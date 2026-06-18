import {
  findLeadByEmail,
  createLead,
  getLeadById,
} from "./test.repository";

import { getSessionById, createTestSession, getLatestSessionByLeadId, getRandomActiveQuestions } from "./test.repository";
import { testSessions } from "@repo/db";
import { eq } from "drizzle-orm";
import { generateAndSendCertificate } from "./certificate.service";



// ---------------- REGISTER ----------------

export async function registerTestLead({ db, data }) {
  const existing = await findLeadByEmail(db, data.email);

  let lead;
  let alreadyExists = false;

  if (existing) {
    lead = existing;
    alreadyExists = true;
  } else {
    lead = await createLead(db, {
      ...data,
      source: "10_min_test",
      status: "registered",
    });
  }

  return {
    alreadyExists,
    lead,
  };
}



// ---------------- START TEST ----------------

export async function startTest({ db, leadId, topics }) {
  const existingSession = await getLatestSessionByLeadId(db, leadId);

  if (existingSession) {
    if (existingSession.status === "completed") {
      return { alreadyCompleted: true, sessionId: existingSession.id };
    }

    const elapsedMinutes = (new Date() - new Date(existingSession.startedAt)) / 60000;

    const snapshotTopics = [...new Set(existingSession.questionsSnapshot.map(q => q.topic))].sort();
    const sortedTopics = [...topics].sort();
    const topicsMatch =
      snapshotTopics.length === sortedTopics.length &&
      snapshotTopics.every((t, i) => t === sortedTopics[i]);

    if (elapsedMinutes <= 5 && topicsMatch) {
      // Resume session — accidental refresh with same subjects
      const questionsForFrontend = existingSession.questionsSnapshot.map(({ correctAnswer, ...q }) => q);
      return {
        sessionId: existingSession.id,
        questions: questionsForFrontend,
        startedAt: existingSession.startedAt,
      };
    }

    // Abandon old session — window expired or subjects changed
    await db
      .update(testSessions)
      .set({ status: "completed", completedAt: new Date() })
      .where(eq(testSessions.id, existingSession.id));
  }

  const rawQuestions = await getRandomActiveQuestions(topics);

  if (!rawQuestions || rawQuestions.length === 0) {
    throw new Error("No questions available for the selected topics in the database.");
  }

  const session = await createTestSession(db, {
    leadId,
    testType: "10_min_test",
    status: "started",
    questionsSnapshot: rawQuestions, // DB saves full payload including correctAnswer!
  });

  const questionsForFrontend = rawQuestions.map(({ correctAnswer, ...q }) => q);

  return {
    sessionId: session.id,
    questions: questionsForFrontend,
    startedAt: session.startedAt,
  };
}

// ---------------- SUBMIT TEST ----------------

export async function submitTest({ db, sessionId, answers }) {
  if (!sessionId || !Array.isArray(answers)) {
    throw new Error("Invalid payload");
  }

  const session = await getSessionById(db, sessionId);

  if (!session) {
    throw new Error("Session not found");
  }

  if (session.status === "completed") {
    throw new Error("Test already submitted");
  }

  const elapsedMinutes = (new Date() - new Date(session.startedAt)) / 60000;
  if (elapsedMinutes > 11) {
    throw new Error("Test submission expired. Time limit exceeded.");
  }

  const questions = session.questionsSnapshot;

  let score = 0;
  const evaluationSnapshot = [];

  for (const userAns of answers) {
    const actualQ = questions.find(q => q.id === userAns.questionId);
    if (!actualQ) continue;

    const correctAnswer = actualQ.correctAnswer;
    const givenAnswer = userAns.selectedOptionId;

    if (correctAnswer === givenAnswer) {
      score++;
    } else {
      evaluationSnapshot.push({
        question: actualQ.question,
        topic: actualQ.topic,
        yourAnswer: givenAnswer || "Not answered",
        correctAnswer,
      });
    }
  }

  const completedAt = new Date();

  await db
    .update(testSessions)
    .set({
      status: "completed",
      completedAt,
      score,
      evaluationSnapshot,
    })
    .where(eq(testSessions.id, sessionId));

  const total = questions.length;
  const percentage = Math.round((score / total) * 100);

  const shouldSend =
    percentage >= 70 || process.env.FORCE_SEND_EMAIL === "true";

  if (shouldSend) {
    await generateAndSendCertificateWrapper({
      db,
      session,
      questions,
      score,
      total,
      sessionId,
      completedAt,
    });
  }

  return {
    score,
    total,
  };
}


async function generateAndSendCertificateWrapper({
  db,
  session,
  questions,
  score,
  total,
  sessionId,
  completedAt,
}) {
  try {
    const lead = await getLeadById(db, session.leadId);

    if (!lead) {
      console.error("Lead not found:", session.leadId);
      return;
    }

    const topics = [...new Set(questions.map((q) => q.topic))];

    await generateAndSendCertificate({
      name: lead.name,
      email: lead.email,
      score,
      total,
      topics,
      certificateId: sessionId,
      completedAt,
    });
  } catch (err) {
    console.error("CERTIFICATE WRAPPER FAILED:", err);
  }
}