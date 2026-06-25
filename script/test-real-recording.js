import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../apps/ai-service/.env") });

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:3005";
const RECORDING_FILE = path.join(__dirname, "../apps/ai-service/src/real recording.m4a");
const R2_KEY = `recordings/test/real-recording-test_${Date.now()}.m4a`;
const TEST_PHONE = "9999999999";

async function main() {
  console.log("🎧 Testing AI call audit with REAL recording...");

  // 1. Load DB
  const { db, employees, followUps } = await import("@repo/db");
  const { eq, desc } = await import("drizzle-orm");

  // 2. Fetch an employee (telecaller)
  console.log("🔍 Fetching a telecaller from DB...");
  const [employee] = await db.select().from(employees).limit(1);
  if (!employee) {
    console.error("❌ No employees found in DB. Seed one first.");
    process.exit(1);
  }
  console.log(`✅ Using employee: ${employee.name} (${employee.id})`);

  // 3. Read real recording file
  console.log(`📂 Reading real recording from: ${RECORDING_FILE}`);
  if (!fs.existsSync(RECORDING_FILE)) {
    console.error("❌ Recording file not found at", RECORDING_FILE);
    process.exit(1);
  }
  const audioBuffer = fs.readFileSync(RECORDING_FILE);
  console.log(`✅ Read recording: ${(audioBuffer.length / 1024 / 1024).toFixed(2)} MB`);

  // 4. Upload to R2
  console.log(`☁️  Uploading to R2 as: ${R2_KEY}`);
  const { s3Client } = await import("../apps/ai-service/src/r2-client.js");
  await s3Client.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: R2_KEY,
    Body: audioBuffer,
    ContentType: "audio/x-m4a",
  }));
  console.log("✅ Uploaded to R2 successfully");

  // 5. Insert follow_ups record
  console.log("📝 Inserting follow_ups DB record...");
  const [inserted] = await db
    .insert(followUps)
    .values({
      leadPhone: TEST_PHONE,
      telecallerId: employee.id,
      duration: 120,
      recordingUrl: R2_KEY,
      outcome: "reached",
      type: "call",
      contactedAt: new Date(),
      aiStatus: "pending",
    })
    .returning();
  console.log(`✅ DB record created with ID: ${inserted.id}`);

  // 6. Trigger AI audit
  console.log(`🚀 Triggering AI audit at ${AI_SERVICE_URL}/api/audit...`);
  const response = await fetch(`${AI_SERVICE_URL}/api/audit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      followUpId: inserted.id,
      recordingUrl: R2_KEY,
    }),
  });
  if (!response.ok) {
    console.error("❌ AI service returned", response.status, await response.text());
    process.exit(1);
  }
  console.log("✅ AI audit queued successfully (202 Accepted)");

  // 7. Poll for results
  console.log("⏳ Polling for AI audit results...");
  let attempts = 0;
  const maxAttempts = 30;

  await new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      attempts++;
      const [record] = await db
        .select()
        .from(followUps)
        .where(eq(followUps.id, inserted.id));

      const status = record?.aiStatus || "unknown";
      process.stdout.write(`\r  [Attempt ${attempts}/${maxAttempts}] Status: ${status}  `);

      if (status === "completed") {
        clearInterval(interval);
        console.log("\n\n✅✅✅ AI AUDIT COMPLETED SUCCESSFULLY ✅✅✅");
        console.log("=".repeat(60));
        console.log(`📝 Transcription:\n${record.transcription}\n`);
        console.log("📊 Analysis:");
        console.log(JSON.stringify(record.analysis, null, 2));
        console.log("=".repeat(60));
        resolve();
      } else if (status === "failed") {
        clearInterval(interval);
        console.log("\n\n❌ AI audit failed. Check ai-service logs.");
        reject(new Error("AI audit failed"));
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
        console.log("\n\n❌ Timeout waiting for AI audit.");
        reject(new Error("Timeout"));
      }
    }, 2000);
  });
}

main().catch((err) => {
  console.error("\n❌ Test failed:", err.message);
  process.exit(1);
});
