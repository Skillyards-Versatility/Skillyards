import "dotenv/config";
import { db } from "../src/client.js";
import { testQuestions } from "../src/schema/testQuestions.js";
import { TEST_QUESTIONS } from "./questions.data.js";

async function seedTestQuestions() {
  console.log("🌱 Seeding test questions...");

  try {
    const data = TEST_QUESTIONS.map((q) => ({
      id: q.id,
      topic: q.topic,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      isActive: true,
    }));

    await db.insert(testQuestions).values(data).onConflictDoNothing();

    console.log(`Seeded ${data.length} questions`);
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    process.exit(0);
  }
}

seedTestQuestions();
