import { neon } from "@neondatabase/serverless";

const dbUrl = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_3Ziyfzo1MVng@ep-old-cell-aepno7oh-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const sql = neon(dbUrl);

async function run() {
  console.log("Running migration for batches...");

  // 1. Create batches table
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS "batches" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" text NOT NULL,
        "course_name" text NOT NULL,
        "description" text,
        "start_date" timestamp,
        "status" text DEFAULT 'active' NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `;
    console.log("Table 'batches' created/ensured.");
  } catch (e) {
    console.error("Failed to create 'batches' table:", e.message);
  }

  // 2. Add batch_id and batch_name to students table
  try {
    await sql`
      ALTER TABLE "students" ADD COLUMN IF NOT EXISTS "batch_id" uuid REFERENCES "batches"("id") ON DELETE SET NULL;
    `;
    console.log("Column 'batch_id' ensured in students table.");
  } catch (e) {
    console.error("Failed to add 'batch_id' column to students table:", e.message);
  }

  try {
    await sql`
      ALTER TABLE "students" ADD COLUMN IF NOT EXISTS "batch_name" text;
    `;
    console.log("Column 'batch_name' ensured in students table.");
  } catch (e) {
    console.error("Failed to add 'batch_name' column to students table:", e.message);
  }

  // 3. Seed initial default course batches
  const seedBatches = [
    { name: "OJT Fullstack Batch 1", courseName: "OJT (Full Stack Development)" },
    { name: "OJT Fullstack Batch 2", courseName: "OJT (Full Stack Development)" },
    { name: "OJT Digital Marketing Batch 1", courseName: "OJT (Advanced Digital Marketing)" },
    { name: "OJD BCA Batch 1", courseName: "OJD (Bachelor of Computer Applications)" },
    { name: "OJD BCA Batch 2", courseName: "OJD (Bachelor of Computer Applications)" },
    { name: "OJD BBA Batch 1", courseName: "OJD (Bachelor of Business Administration)" },
  ];

  for (const b of seedBatches) {
    try {
      const existing = await sql`
        SELECT id FROM batches WHERE name = ${b.name} AND course_name = ${b.courseName};
      `;
      if (existing.length === 0) {
        await sql`
          INSERT INTO batches (name, course_name, status)
          VALUES (${b.name}, ${b.courseName}, 'active');
        `;
        console.log(`Seeded batch: ${b.name} (${b.courseName})`);
      } else {
        console.log(`Batch already exists: ${b.name}`);
      }
    } catch (err) {
      console.error(`Failed to seed batch ${b.name}:`, err.message);
    }
  }

  console.log("Batch migration and seeding complete!");
}

run().catch(console.error);
