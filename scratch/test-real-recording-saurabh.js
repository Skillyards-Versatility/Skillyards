import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../apps/api/.env") });

async function main() {
  const filePath = "/home/chakresh/Skillyards/apps/ai-service/src/real recording.m4a";
  console.log(`📂 Checking for real recording at: ${filePath}`);
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Real recording file not found at ${filePath}`);
    return;
  }

  const fileStats = fs.statSync(filePath);
  console.log(`✅ File found! Size: ${(fileStats.size / (1024 * 1024)).toFixed(2)} MB`);

  // Read buffer
  const audioBuffer = fs.readFileSync(filePath);

  // Initialize R2 client
  const s3Client = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY,
      secretAccessKey: process.env.R2_SECRET_KEY,
    },
  });

  const telecallerId = "988f616e-bea5-4c98-a8c1-b160a7aca469"; // Saurabh Verma
  const phoneNumber = "9193112646";
  const timestamp = Date.now();
  const r2Key = `recordings/${telecallerId}/${phoneNumber}_${timestamp}.m4a`;

  console.log(`☁️ Uploading to R2 with Key: ${r2Key}...`);
  await s3Client.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: r2Key,
    Body: audioBuffer,
    ContentType: "audio/x-m4a"
  }));
  console.log("✅ Upload to R2 completed!");

  // Insert into DB
  const { db, followUps } = await import("@repo/db");
  
  console.log("📝 Creating new call log entry in the database...");
  const [inserted] = await db
    .insert(followUps)
    .values({
      leadPhone: phoneNumber,
      telecallerId: telecallerId,
      duration: 35, // test call duration
      recordingUrl: r2Key,
      outcome: "reached",
      type: "call",
      contactedAt: new Date(),
      aiStatus: "pending"
    })
    .returning();

  console.log(`✅ Call log inserted successfully! ID: ${inserted.id}`);

  console.log("\n🚀 Triggering manual AI audit via API...");
  try {
    const response = await fetch("http://localhost:3000/api/telephony/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        followUpId: inserted.id,
        recordingUrl: r2Key
      })
    });
    const data = await response.json();
    console.log("   API Response:", data);
  } catch (err) {
    console.error("❌ Failed to trigger audit API request:", err.message);
  }

  console.log("\n⏳ Polling database for AI audit progress...");
  for (let i = 0; i < 15; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const { eq } = await import("drizzle-orm");
    const [call] = await db
      .select({ aiStatus: followUps.aiStatus })
      .from(followUps)
      .where(eq(followUps.id, inserted.id))
      .limit(1);

    console.log(`   [Second ${(i + 1) * 2}] AI Status: ${call?.aiStatus}`);
    if (call?.aiStatus === "completed" || call?.aiStatus === "failed") {
      console.log(`🏁 Auditing finished with status: ${call.aiStatus}`);
      break;
    }
  }
}

main().catch(console.error);
