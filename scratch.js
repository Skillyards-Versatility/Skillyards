require('dotenv').config();
const { sql } = require('drizzle-orm');
const { db } = require('@repo/db');
async function run() {
  try {
    await db.execute(sql`ALTER TABLE counselling_sessions ADD COLUMN IF NOT EXISTS next_follow_up_date date;`);
    console.log("Migration successful");
  } catch (err) {
    console.error("Migration failed:", err);
  }
}
run();
