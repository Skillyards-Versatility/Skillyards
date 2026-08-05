import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { readFileSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../apps/api/.env.local"), override: false });

const { db } = await import("@repo/db");
const { sql } = await import("drizzle-orm");

const migration = readFileSync(
  path.join(__dirname, "../packages/db/migrations/0025_test_leads_hardening.sql"),
  "utf8",
);

await db.execute(sql.raw(migration));

const { rows } = await db.execute(sql`
  SELECT table_name, column_name
  FROM information_schema.columns
  WHERE table_name IN ('test_leads','test_sessions') AND column_name = 'archived_at'
  ORDER BY table_name`);

const { rows: constraints } = await db.execute(sql`
  SELECT conname
  FROM pg_constraint
  WHERE conrelid = 'test_leads'::regclass AND contype = 'u'`);

console.log("archived_at columns:", rows);
console.log("test_leads unique constraints:", constraints);
