import { testLeads, testSessions } from "@repo/db"; 
import { eq, desc } from "drizzle-orm";
import { sanityClient } from "@/lib/sanity/client";
export async function findLeadByEmail(db, email) {
  console.log("Finding lead by email:", email);

  return db.query.testLeads.findFirst({
    where: (t, { eq }) => eq(t.email, email),
  });
}

export async function createLead(db, data) {
  const [lead] = await db.insert(testLeads).values(data).returning();
  return lead;
}

export async function createTestSession(db, data) {
  const [session] = await db
    .insert(testSessions)
    .values({
      leadId: data.leadId,
      testType: data.testType || "10_min_test",
      status: data.status || "started",
      questionsSnapshot: data.questionsSnapshot || [],
      startedAt: new Date(),
    })
    .returning();

  return session;
}

export async function getSessionById(db, sessionId) {
  return db.query.testSessions.findFirst({
    where: (t, { eq }) => eq(t.id, sessionId),
  });
}

export async function getLatestSessionByLeadId(db, leadId) {
  return db.query.testSessions.findFirst({
    where: (t, { eq }) => eq(t.leadId, leadId),
    orderBy: (t, { desc }) => [desc(t.startedAt)],
  });
}

export async function getLeadById(db, leadId) {
  return db.query.testLeads.findFirst({
    where: (t, { eq }) => eq(t.id, leadId),
  });
}

const SANITY_QUESTIONS_QUERY = `*[_type == "testQuestion" && isActive == true && topic == $topic] {
  "id": slug.current,
  topic,
  question,
  options,
  correctAnswer
}`;

export async function getRandomActiveQuestions(topics, maxCount = 30) {
  if (!topics || topics.length === 0) {
    throw new Error("At least one topic must be selected.");
  }

  const questionsPerTopic = Math.floor(maxCount / topics.length);
  const shuffleArray = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  let selected = [];

  for (const topic of topics) {
    const topicQuestions = await sanityClient.fetch(SANITY_QUESTIONS_QUERY, { topic });

    const shuffled = shuffleArray(topicQuestions);
    const picked = shuffled.slice(0, questionsPerTopic);
    selected.push(...picked);
  }

  return selected.map((q) => ({
    ...q,
    options: shuffleArray(q.options || []),
  }));
}