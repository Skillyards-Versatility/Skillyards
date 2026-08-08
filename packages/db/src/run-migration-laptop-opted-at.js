import { neon } from "@neondatabase/serverless";

const dbUrl = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_3Ziyfzo1MVng@ep-old-cell-aepno7oh-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const sql = neon(dbUrl);

async function run() {
  console.log("Adding laptop_opted_at column to students table...");

  try {
    await sql`ALTER TABLE "students" ADD COLUMN IF NOT EXISTS "laptop_opted_at" timestamp;`;
    console.log("laptop_opted_at column ensured.");

    await sql`UPDATE "students" SET "laptop_opted_at" = "created_at" WHERE "laptop_opted" = true AND "laptop_opted_at" IS NULL;`;
    console.log("Backfilled laptop_opted_at for existing opted students.");
  } catch (e) {
    console.error("Failed to add laptop_opted_at column:", e.message);
  }

  console.log("Migration complete!");
}

run().catch(console.error);
