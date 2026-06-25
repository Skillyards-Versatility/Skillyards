import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../apps/api/.env") });

async function main() {
  const { db, followUps } = await import("@repo/db");
  const { eq } = await import("drizzle-orm");

  const callId = "a7f7ee0f-922f-40c3-a36e-a308ce1f21e9";
  console.log(`🔍 Fetching call ID: ${callId}...`);
  const [call] = await db
    .select()
    .from(followUps)
    .where(eq(followUps.id, callId))
    .limit(1);

  if (!call) {
    console.error("❌ Call not found!");
    return;
  }

  console.log("\n================ AUDIT RESULTS ================");
  console.log(`Status: ${call.aiStatus}`);
  console.log(`Transcription:\n${call.transcription}`);
  console.log(`Analysis:\n`, JSON.stringify(call.analysis, null, 2));
  console.log("===============================================");
}

main().catch(console.error);
