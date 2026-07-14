import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../apps/api/.env") });

async function main() {
  const { db } = await import("@repo/db");
  const { sql } = await import("drizzle-orm");

  console.log("🔄 Starting safe migration script...");

  // 1. Truncate follow_ups to clear old references from employees table
  console.log("🧹 Truncating 'follow_ups' table to remove old references...");
  await db.execute(sql`TRUNCATE TABLE "follow_ups" CASCADE`);
  console.log("✅ Cleared follow_ups table successfully.");

  // 2. Drop old constraint if exists
  console.log("🔄 Dropping old employees constraint...");
  await db.execute(sql`
    ALTER TABLE "follow_ups" 
    DROP CONSTRAINT IF EXISTS "follow_ups_telecaller_id_employees_id_fk"
  `);
  console.log("✅ Old constraint dropped.");

  // 3. Add new users constraint
  console.log("🔄 Adding new users constraint...");
  await db.execute(sql`
    ALTER TABLE "follow_ups" 
    ADD CONSTRAINT "follow_ups_telecaller_id_users_id_fk" 
    FOREIGN KEY ("telecaller_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action
  `);
  console.log("✅ New constraint added.");

  console.log("🎉 Database schema migration completed successfully!");
}

main().catch(console.error);
