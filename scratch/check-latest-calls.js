import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../apps/api/.env") });

async function main() {
  const { db, followUps, employees } = await import("@repo/db");
  const { desc } = await import("drizzle-orm");

  console.log("🔍 Querying latest 5 call records in the database...");
  const records = await db
    .select({
      id: followUps.id,
      leadPhone: followUps.leadPhone,
      duration: followUps.duration,
      recordingUrl: followUps.recordingUrl,
      outcome: followUps.outcome,
      aiStatus: followUps.aiStatus,
      transcription: followUps.transcription,
      analysis: followUps.analysis,
      createdAt: followUps.createdAt
    })
    .from(followUps)
    .orderBy(desc(followUps.createdAt))
    .limit(5);

  if (records.length === 0) {
    console.log("❌ No records found in follow_ups table.");
    return;
  }

  console.log("\n================ LATEST CALL LOGS ================");
  records.forEach((rec, idx) => {
    console.log(`[${idx + 1}] ID: ${rec.id}`);
    console.log(`    Phone: ${rec.leadPhone}`);
    console.log(`    Duration: ${rec.duration}s`);
    console.log(`    Outcome: ${rec.outcome}`);
    console.log(`    Recording URL: ${rec.recordingUrl}`);
    console.log(`    AI Status: ${rec.aiStatus}`);
    console.log(`    Created At: ${rec.createdAt}`);
    console.log(`    Transcription Snippet: ${rec.transcription ? rec.transcription.slice(0, 100) + "..." : "None"}`);
    if (rec.analysis) {
      console.log(`    Analysis Keys: ${Object.keys(rec.analysis).join(", ")}`);
      console.log(`    Lead Score: ${rec.analysis.leadScore}`);
    }
    console.log("--------------------------------------------------");
  });
}

main().catch(console.error);
