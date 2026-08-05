import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../apps/api/.env.local"), override: false });

const { db } = await import("@repo/db");
const { sql } = await import("drizzle-orm");

const APPLY = process.argv.includes("--apply");
const REVERT = process.argv.includes("--revert");

const SPAM = sql`name LIKE 'Test User %' AND source = '10_min_test'`;

if (REVERT) {
  const { rows: [count] } = await db.execute(sql`
    SELECT count(*)::int AS n FROM test_leads WHERE archived_at IS NOT NULL`);
  const { rowCount } = await db.execute(sql`
    UPDATE test_leads SET archived_at = NULL WHERE archived_at IS NOT NULL`);
  console.log(`REVERT: un-archived ${rowCount ?? count.n} rows`);
  process.exit(0);
}

const { rows: [total] } = await db.execute(sql`
  SELECT count(*)::int AS n FROM test_leads`);
const { rows: [matching] } = await db.execute(sql`
  SELECT count(*)::int AS n FROM test_leads WHERE ${SPAM} AND archived_at IS NULL`);
const { rows: [archived] } = await db.execute(sql`
  SELECT count(*)::int AS n FROM test_leads WHERE archived_at IS NOT NULL`);
const { rows: [other10min] } = await db.execute(sql`
  SELECT count(*)::int AS n FROM test_leads
  WHERE source = '10_min_test' AND archived_at IS NULL AND NOT (${SPAM})`);
const { rows: [sessions] } = await db.execute(sql`
  SELECT count(*)::int AS n FROM test_sessions WHERE archived_at IS NULL`);

console.log(`total test_leads:        ${total.n}`);
console.log(`spam pattern, un-archived: ${matching.n}`);
console.log(`already archived:         ${archived.n}`);
console.log(`other 10_min_test rows:   ${other10min.n} (kept for review)`);
console.log(`test_sessions un-archived: ${sessions.n}`);

if (!APPLY) {
  console.log("DRY RUN - pass --apply to archive");
  process.exit(0);
}

const { rowCount } = await db.execute(sql`
  UPDATE test_leads SET archived_at = now()
  WHERE ${SPAM} AND archived_at IS NULL`);
console.log(`ARCHIVED: ${rowCount} rows`);
