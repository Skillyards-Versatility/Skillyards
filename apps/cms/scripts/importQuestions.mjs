import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { TEST_QUESTIONS } from "../../../packages/db/seed/questions.data.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../.env") });

const client = createClient({
  projectId: "2it7abok",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});

async function importQuestions() {
  console.log(`Found ${TEST_QUESTIONS.length} questions to import...`);

  let created = 0;
  let skipped = 0;

  for (const q of TEST_QUESTIONS) {
    const existing = await client.fetch(
      `*[_type == "testQuestion" && slug.current == $id][0]`,
      { id: q.id }
    );

    if (existing) {
      console.log(`  SKIP ${q.id} — already exists`);
      skipped++;
      continue;
    }

    await client.create({
      _type: "testQuestion",
      slug: { _type: "slug", current: q.id },
      topic: q.topic,
      language: "english",
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      isActive: true,
    });

    console.log(`  CREATED ${q.id} — ${q.topic}`);
    created++;
  }

  console.log(`\nDone. Created: ${created}, Skipped: ${skipped}, Total: ${TEST_QUESTIONS.length}`);
}

importQuestions().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});
