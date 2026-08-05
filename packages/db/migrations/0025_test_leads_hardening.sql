ALTER TABLE "test_leads" ADD COLUMN IF NOT EXISTS "archived_at" timestamp;
ALTER TABLE "test_sessions" ADD COLUMN IF NOT EXISTS "archived_at" timestamp;

ALTER TABLE "test_leads" DROP CONSTRAINT IF EXISTS "test_leads_email_unique";
ALTER TABLE "test_leads" ADD CONSTRAINT "test_leads_email_unique" UNIQUE ("email");
