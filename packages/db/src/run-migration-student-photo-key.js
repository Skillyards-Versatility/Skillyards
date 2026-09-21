import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../../apps/api/.env") });

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const sql = neon(dbUrl);

async function run() {
  console.log("Adding photo_key column to students table...");

  try {
    await sql`ALTER TABLE "students" ADD COLUMN IF NOT EXISTS "photo_key" text;`;
    console.log("photo_key column ensured in students table.");
  } catch (e) {
    console.error("Failed to add photo_key column:", e.message);
    process.exit(1);
  }

  console.log("Migration complete!");
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
