const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

async function main() {
  await sql`CREATE TABLE IF NOT EXISTS "eod_warnings" ("id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL, "user_id" uuid NOT NULL, "date" text NOT NULL, "sent_at" timestamp DEFAULT now() NOT NULL)`;
  console.log("Table created");
  
  try {
    await sql`ALTER TABLE "eod_warnings" ADD CONSTRAINT "eod_warnings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action`;
    console.log("FK added");
  } catch (e) {
    if (e.code === "42710") console.log("FK already exists");
    else throw e;
  }

  await sql`CREATE UNIQUE INDEX IF NOT EXISTS "eod_warnings_user_date_idx" ON "eod_warnings" USING btree ("user_id","date")`;
  console.log("Index created");
  
  console.log("DONE");
}

main().catch(e => { console.error(e.message); process.exit(1); });
