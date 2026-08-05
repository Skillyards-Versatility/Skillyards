import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../apps/api/.env.local"), override: false });

const { db } = await import("@repo/db");
const { sql } = await import("drizzle-orm");

const { rows } = await db.execute(sql`
  SELECT column_name, data_type, column_default
  FROM information_schema.columns
  WHERE table_name IN ('test_leads','enquiries') AND column_name = 'id'
  ORDER BY table_name`);
for (const r of rows) console.log(r);

const { rows: range } = await db.execute(sql`
  SELECT min(created_at) AS first_seen, max(created_at) AS last_seen
  FROM test_leads WHERE name LIKE 'Test User %'`);
console.log(range[0]);

const { rows: top } = await db.execute(sql`
  SELECT left(name, 40) AS name, count(*) AS n
  FROM test_leads WHERE created_at > now() - interval '30 days'
  GROUP BY 1 ORDER BY n DESC LIMIT 5`);
for (const r of top) console.log(r);

const { rows: dupCheck } = await db.execute(sql`
  SELECT COUNT(*)::int AS dup_emails FROM (
    SELECT email FROM test_leads GROUP BY email HAVING COUNT(*) > 1
  ) d`);
console.log("dup emails:", dupCheck[0].dup_emails);
