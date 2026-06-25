import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../apps/api/.env") });

async function main() {
  const { db, followUps } = await import("@repo/db");
  const { eq, and, isNotNull } = await import("drizzle-orm");

  console.log("🔍 Fetching a test call from database...");
  const [testCall] = await db
    .select({
      id: followUps.id,
      recordingUrl: followUps.recordingUrl,
      aiStatus: followUps.aiStatus
    })
    .from(followUps)
    .where(
      and(
        isNotNull(followUps.recordingUrl),
        eq(followUps.aiStatus, "failed")
      )
    )
    .limit(1);

  if (!testCall) {
    console.error("❌ No test call with recording found in database.");
    return;
  }

  console.log(`✅ Selected Test Call ID: ${testCall.id}`);
  console.log(`   Recording URL: ${testCall.recordingUrl}`);
  console.log(`   Initial AI Status: ${testCall.aiStatus}`);

  console.log("\n🚀 Triggering manual audit via POST /api/telephony/audit...");
  const response = await fetch("http://localhost:3000/api/telephony/audit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      followUpId: testCall.id,
      recordingUrl: testCall.recordingUrl
    })
  });

  const responseData = await response.json();
  console.log("   API Response:", responseData);

  if (!responseData.success) {
    console.error("❌ API returned error status.");
    return;
  }

  console.log("\n⏳ Polling database to check if status updates to pending/processing...");
  for (let i = 0; i < 5; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    const [updatedCall] = await db
      .select({ aiStatus: followUps.aiStatus })
      .from(followUps)
      .where(eq(followUps.id, testCall.id))
      .limit(1);
    
    console.log(`   [Second ${i + 1}] DB AI Status: ${updatedCall?.aiStatus}`);
  }

  console.log("\n🎉 Verification run complete!");
}

main().catch(console.error);
