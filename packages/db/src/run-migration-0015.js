import { neon } from "@neondatabase/serverless";

const dbUrl = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_3Ziyfzo1MVng@ep-old-cell-aepno7oh-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const sql = neon(dbUrl);

async function run() {
  console.log("Adding columns to follow_ups table...");
  
  try {
    await sql`ALTER TABLE "follow_ups" ADD COLUMN IF NOT EXISTS "ai_status" text DEFAULT 'pending' NOT NULL;`;
    console.log("ai_status column ensured.");
  } catch (e) {
    console.error("Failed to add ai_status column:", e.message);
  }

  try {
    await sql`ALTER TABLE "follow_ups" ADD COLUMN IF NOT EXISTS "transcription" text;`;
    console.log("transcription column ensured.");
  } catch (e) {
    console.error("Failed to add transcription column:", e.message);
  }

  try {
    await sql`ALTER TABLE "follow_ups" ADD COLUMN IF NOT EXISTS "analysis" jsonb;`;
    console.log("analysis column ensured.");
  } catch (e) {
    console.error("Failed to add analysis column:", e.message);
  }

  console.log("Migration complete!");
}

run().catch(console.error);
