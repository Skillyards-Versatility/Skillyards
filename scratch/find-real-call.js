import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../apps/api/.env") });

async function main() {
  const { db, followUps, employees } = await import("@repo/db");
  const { isNotNull, gt, and, desc, eq } = await import("drizzle-orm");

  console.log("🔍 Searching for real call records in database...");
  const records = await db
    .select({
      id: followUps.id,
      leadPhone: followUps.leadPhone,
      telecallerName: employees.name,
      duration: followUps.duration,
      recordingUrl: followUps.recordingUrl,
      aiStatus: followUps.aiStatus,
      createdAt: followUps.createdAt
    })
    .from(followUps)
    .innerJoin(employees, eq(followUps.telecallerId, employees.id))
    .where(
      and(
        isNotNull(followUps.recordingUrl),
        gt(followUps.duration, 20)
      )
    )
    .orderBy(desc(followUps.createdAt))
    .limit(10);

  if (records.length === 0) {
    console.log("❌ No calls with recordings and duration > 20s found.");
    
    // Let's also print standard calls with recordings to check if any exist at all
    const anyRecordings = await db
      .select({
        id: followUps.id,
        duration: followUps.duration,
        recordingUrl: followUps.recordingUrl
      })
      .from(followUps)
      .where(isNotNull(followUps.recordingUrl))
      .limit(5);
    
    console.log("Any recordings at all:", anyRecordings);
    return;
  }

  console.log("✅ Found the following real call recordings:");
  records.forEach((rec, idx) => {
    console.log(`[${idx + 1}] ID: ${rec.id}`);
    console.log(`    Caller: ${rec.telecallerName}`);
    console.log(`    Phone: ${rec.leadPhone}`);
    console.log(`    Duration: ${rec.duration}s`);
    console.log(`    Recording URL/Key: ${rec.recordingUrl}`);
    console.log(`    AI Status: ${rec.aiStatus}`);
    console.log(`    Date: ${rec.createdAt}`);
    console.log("-----------------------------------------");
  });
}

main().catch(console.error);
