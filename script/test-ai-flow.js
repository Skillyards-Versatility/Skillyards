import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables from apps/api/.env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../apps/api/.env") });

const API_SECRET = process.env.CALL_TRACKER_SECRET || "f8fe36033866cd8b2630e77a3322784d";
const API_URL = "http://localhost:3000/api/telephony/gsm-callback";

async function main() {
  console.log("🚀 Starting Full End-to-End AI Call Analyzer Test...");

  // Load database module dynamically after environment is configured
  const { db, employees, followUps } = await import("@repo/db");
  const { desc, eq } = await import("drizzle-orm");

  // 1. Fetch a valid telecaller (employee) ID
  console.log("🔍 Fetching a valid telecaller from the database...");
  const [employee] = await db.select().from(employees).limit(1);
  if (!employee) {
    console.error("❌ No employees found in the database. Please seed or add an employee first!");
    process.exit(1);
  }
  console.log(`✅ Found employee: ${employee.name} (${employee.id})`);

  // 2. Fetch a sample audio file from public URL
  const sampleAudioUrl = "https://www.w3schools.com/html/horse.mp3";
  console.log(`📥 Downloading sample audio file from: ${sampleAudioUrl}...`);
  
  let audioBuffer;
  try {
    const audioRes = await fetch(sampleAudioUrl);
    if (!audioRes.ok) throw new Error(`HTTP error! status: ${audioRes.status}`);
    audioBuffer = Buffer.from(await audioRes.arrayBuffer());
    console.log(`✅ Downloaded sample audio file successfully (${audioBuffer.length} bytes)`);
  } catch (err) {
    console.error("❌ Failed to download sample audio file:", err.message);
    process.exit(1);
  }

  // 3. Prepare payload for gsm-callback API
  const base64Audio = audioBuffer.toString("base64");
  const payload = {
    telecaller_id: employee.id,
    to_number: "9876543210",
    call_duration_seconds: 45, // >15s to classify as "reached"
    recording_base64: base64Audio,
    recording_ext: "mp3",
    call_start_time: new Date().toISOString(),
  };

  // 4. Send POST request to gsm-callback endpoint
  console.log(`📤 Sending call record log to ingestion endpoint: ${API_URL}...`);
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-app-secret": API_SECRET,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      console.error("❌ API request failed:", result);
      process.exit(1);
    }
    console.log("✅ Ingestion API accepted the call logs successfully!");
  } catch (err) {
    console.error("❌ Failed to connect to API server. Ensure Next.js API is running on http://localhost:3000");
    console.error(err.message);
    process.exit(1);
  }

  // 5. Query the DB to find the newly logged call
  console.log("🔍 Checking database for the newly logged call record...");
  const [newCall] = await db
    .select()
    .from(followUps)
    .where(eq(followUps.leadPhone, "9876543210"))
    .orderBy(desc(followUps.createdAt))
    .limit(1);

  if (!newCall) {
    console.error("❌ New call record not found in database!");
    process.exit(1);
  }
  console.log(`✅ Logged call record found with ID: ${newCall.id}. Starting poll for AI status...`);

  // 6. Poll database until AI status transitions from pending/processing -> completed/failed
  let attempts = 0;
  const maxAttempts = 30; // 60 seconds
  const interval = setInterval(async () => {
    attempts++;
    const [updatedCall] = await db
      .select()
      .from(followUps)
      .where(eq(followUps.id, newCall.id));

    console.log(`[Attempt ${attempts}] Current AI Status: ${updatedCall?.aiStatus}`);

    if (updatedCall?.aiStatus === "completed") {
      clearInterval(interval);
      console.log("\n🎉 AI Auditing Flow Completed Successfully!");
      console.log("==================================================");
      console.log(`📝 Transcription: \n"${updatedCall.transcription}"\n`);
      console.log("📊 Structured Analysis Output:");
      console.log(JSON.stringify(updatedCall.analysis, null, 2));
      console.log("==================================================");
      process.exit(0);
    } else if (updatedCall?.aiStatus === "failed") {
      clearInterval(interval);
      console.error("\n❌ AI Auditing failed. Please check the logs in the ai-service console.");
      process.exit(1);
    }

    if (attempts >= maxAttempts) {
      clearInterval(interval);
      console.error("\n❌ Timeout waiting for AI Auditing to complete.");
      process.exit(1);
    }
  }, 2000);
}

main().catch((err) => {
  console.error("❌ Unexpected test execution error:", err);
  process.exit(1);
});
