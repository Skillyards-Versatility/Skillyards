require('dotenv').config();
const { sql } = require('drizzle-orm');
const { db } = require('@repo/db');

async function run() {
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "settings" (
        "key" text PRIMARY KEY NOT NULL,
        "value" jsonb NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `);
    console.log("Table 'settings' created successfully.");
  } catch (err) {
    console.error("Error creating table:", err);
  }
}

run();
