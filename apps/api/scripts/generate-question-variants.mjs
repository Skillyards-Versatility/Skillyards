import { config } from "dotenv";
config({ path: new URL("../.env.local", import.meta.url).pathname });

import { createClient } from "@sanity/client";
import { GoogleGenAI } from "@google/genai";
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const sanityClient = createClient({
  projectId: "2it7abok",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const QUERY = `*[_type == "testQuestion" && isActive == true] {
  "id": slug.current,
  topic,
  question,
  options,
  correctAnswer
}`;

const questions = await sanityClient.fetch(QUERY);
console.log(`Found ${questions.length} questions`);

const variants = {};

async function generateBatch(batch) {
  const prompt = `You are a test question creator for 12th-pass students in India.
For each original question below, create TWO variants:

MEDIUM: More challenging. Use moderate technical vocabulary, require deeper understanding, include plausible distractors based on common misconceptions.

HARD: Significantly harder. Require applied knowledge, critical thinking, combining multiple concepts. Distractors must be very plausible.

Each variant must:
- Have exactly 4 options with ids "a", "b", "c", "d"
- The correctAnswer must match the correct option's id
- Be factually accurate
- Keep the same topic

Original questions:
${batch.map((q, i) => `[Q${i + 1}]
ID: ${q.id}
Topic: ${q.topic}
Question: ${q.question}
Options: ${JSON.stringify(q.options)}
CorrectAnswer: ${q.correctAnswer}`).join("\n\n")}

Return ONLY valid JSON (no markdown, no code fences):
{
  "${batch[0].id}": {
    "medium": { "question": "...", "options": [{"id":"a","text":"..."},{"id":"b","text":"..."},{"id":"c","text":"..."},{"id":"d","text":"..."}], "correctAnswer": "a" },
    "hard": { "question": "...", "options": [...], "correctAnswer": "a" }
  },
  ...
}`;

  const response = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      temperature: 0.7,
      maxOutputTokens: 16384,
    },
  });

  const text = response.text.replace(/```json\n?|```\n?/g, "").trim();
  return JSON.parse(text);
}

// Process a subset (only generate for the topics used in tests)
const sample = questions.slice(0, 60);
console.log(`Processing ${sample.length} questions in ${Math.ceil(sample.length / 10)} batches`);

const BATCH_SIZE = 10;
for (let i = 0; i < sample.length; i += BATCH_SIZE) {
  const batch = sample.slice(i, i + BATCH_SIZE);
  console.log(`Generating batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(sample.length / BATCH_SIZE)} (${batch.length} questions)...`);
  try {
    const result = await generateBatch(batch);
    Object.assign(variants, result);
    console.log(`  ✓ Batch done`);
  } catch (err) {
    console.error(`  ✗ Batch failed:`, err.message);
  }
}

const outputPath = resolve(__dirname, "../src/modules/test/question-variants.json");
writeFileSync(outputPath, JSON.stringify(variants, null, 2));
console.log(`\nDone. Saved ${Object.keys(variants).length} variant sets to question-variants.json`);
