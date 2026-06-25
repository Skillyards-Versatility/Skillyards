import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../apps/api/.env") });

async function main() {
  const { db, followUps } = await import("@repo/db");
  const { eq } = await import("drizzle-orm");

  console.log("🔍 Checking for calls currently marked as 'processing'...");
  const processingCalls = await db
    .select({ id: followUps.id })
    .from(followUps)
    .where(eq(followUps.aiStatus, "processing"));

  console.log(`   Found ${processingCalls.length} calls in 'processing' state.`);

  if (processingCalls.length > 0) {
    console.log("🔄 Resetting their status to 'pending'...");
    const result = await db
      .update(followUps)
      .set({ aiStatus: "pending" })
      .where(eq(followUps.aiStatus, "processing"));
    console.log("✅ Successfully reset all processing calls back to pending.");
  } else {
    console.log("✅ Nothing to reset.");
  }
}

main().catch(console.error);
