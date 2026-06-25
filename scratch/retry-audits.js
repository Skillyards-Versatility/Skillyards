import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../apps/api/.env") });

async function main() {
  const { db, followUps } = await import("@repo/db");
  const { eq, and, isNotNull } = await import("drizzle-orm");

  console.log("🔍 Finding failed or processing audits to retry...");
  const failedCalls = await db
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
    );

  if (failedCalls.length === 0) {
    console.log("✅ No failed audits found in database.");
    return;
  }

  console.log(`🚀 Found ${failedCalls.length} failed audits. Retrying them now...`);

  for (const call of failedCalls) {
    console.log(`🔄 Triggering audit retry for Call ID: ${call.id}...`);
    
    // Set status to pending in DB so it can be audited cleanly
    await db
      .update(followUps)
      .set({ aiStatus: "pending", errorLog: null })
      .where(eq(followUps.id, call.id));

    try {
      const response = await fetch("http://localhost:3005/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          followUpId: call.id,
          recordingUrl: call.recordingUrl
        })
      });
      const data = await response.json();
      console.log(`   Response for ${call.id}:`, data);
    } catch (err) {
      console.error(`   Failed to send trigger for ${call.id}:`, err.message);
    }
    
    // Sleep a bit between requests to avoid rate limits
    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log("🏁 All retries triggered!");
}

main().catch(console.error);
