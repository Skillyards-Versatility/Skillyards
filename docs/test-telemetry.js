/**
 * SkillYards Call Tracker Telemetry Simulator
 * 
 * Simulates an Android client logging a call recording and metadata.
 * Run with: node docs/test-telemetry.js
 */

import { neon } from "@neondatabase/serverless";

const dbUrl = "postgresql://neondb_owner:npg_3Ziyfzo1MVng@ep-old-cell-aepno7oh-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const sql = neon(dbUrl);

// Base64 encoding of a tiny valid 1-second silent MP3
const MOCK_AUDIO_BASE64 = "/+MYxAAAAANIAAAAAExBTUUzLjk5rQAAAAAAAAAA";

async function simulate() {
  console.log("Fetching a valid telecaller ID from users table...");
  const users = await sql`SELECT id, name, email FROM users LIMIT 1`;
  if (users.length === 0) {
    console.error("No users found in database to simulate telecaller ID.");
    return;
  }
  const telecaller = users[0];
  console.log(`Using telecaller: ${telecaller.name} (${telecaller.id})`);

  const payload = {
    telecaller_id: telecaller.id,
    to_number: "+919999988888",
    call_duration_seconds: 45,
    recording_ext: "mp3",
    call_start_time: new Date().toISOString(),
    recording_base64: MOCK_AUDIO_BASE64
  };

  const secret = "f8fe36033866cd8b2630e77a3322784d";
  const url = "http://localhost:3000/api/telephony/gsm-callback";

  console.log(`Sending mock payload to ${url}...`);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-app-secret": secret
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log("Response Status:", response.status);
    console.log("Response Body:", data);
  } catch (error) {
    console.error("Connection failed. Make sure the API server is running on http://localhost:3000.");
    console.error(error.message);
  }
}

simulate().catch(console.error);
