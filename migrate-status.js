import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

const sql = neon(process.env.DATABASE_URL);

async function run() {
  console.log("Adding columns to users...");
  try {
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS status_emoji text`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS status_text text`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS status_clear_at timestamp`;
    console.log("Added status columns successfully.");
  } catch (err) {
    console.error("Error altering users:", err);
  }

  console.log("Creating leaves table...");
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS leaves (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES users(id),
        start_date timestamp NOT NULL,
        end_date timestamp NOT NULL,
        type text NOT NULL,
        reason text NOT NULL,
        status text NOT NULL DEFAULT 'PENDING',
        approved_by_id uuid REFERENCES users(id),
        rejection_reason text,
        created_at timestamp DEFAULT now(),
        updated_at timestamp DEFAULT now()
      )
    `;
    console.log("Created leaves table successfully.");
  } catch (err) {
    console.error("Error creating leaves:", err);
  }
}

run();
