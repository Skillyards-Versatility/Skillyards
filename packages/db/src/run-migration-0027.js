import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../../apps/api/.env") });

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const sql = neon(dbUrl);

async function run() {
  console.log("Applying CRM foundation migration (0027)...");

  // 1. sales_teams
  await sql`
    CREATE TABLE IF NOT EXISTS "sales_teams" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "name" text NOT NULL,
      "is_active" boolean DEFAULT true NOT NULL,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp with time zone DEFAULT now() NOT NULL
    );
  `;
  console.log("✓ sales_teams created/ensured");

  // 2. sales_team_memberships
  await sql`
    CREATE TABLE IF NOT EXISTS "sales_team_memberships" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "team_id" uuid NOT NULL REFERENCES "sales_teams"("id"),
      "user_id" uuid NOT NULL REFERENCES "users"("id"),
      "started_at" timestamp with time zone DEFAULT now() NOT NULL,
      "ended_at" timestamp with time zone,
      "changed_by_user_id" uuid NOT NULL REFERENCES "users"("id"),
      "change_reason" text
    );
  `;
  console.log("✓ sales_team_memberships created/ensured");

  // 3. leads - ensure table and add missing CRM columns
  await sql`
    CREATE TABLE IF NOT EXISTS "leads" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "full_name" text,
      "normalized_phone" text,
      "normalized_email" text,
      "status" text DEFAULT 'new' NOT NULL,
      "assigned_to_user_id" uuid REFERENCES "users"("id"),
      "assigned_team_id" uuid REFERENCES "sales_teams"("id"),
      "converted_student_id" uuid REFERENCES "students"("id"),
      "converted_at" timestamp with time zone,
      "merged_into_lead_id" uuid REFERENCES "leads"("id"),
      "version" integer DEFAULT 1 NOT NULL,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp with time zone DEFAULT now() NOT NULL
    );
  `;

  // In case table already existed, ensure all new columns exist
  await sql`ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "full_name" text;`;
  await sql`ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "normalized_phone" text;`;
  await sql`ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "normalized_email" text;`;
  await sql`ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "assigned_to_user_id" uuid REFERENCES "users"("id");`;
  await sql`ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "assigned_team_id" uuid REFERENCES "sales_teams"("id");`;
  await sql`ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "converted_student_id" uuid REFERENCES "students"("id");`;
  await sql`ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "converted_at" timestamp with time zone;`;
  await sql`ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "merged_into_lead_id" uuid REFERENCES "leads"("id");`;
  await sql`ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "version" integer DEFAULT 1;`;
  await sql`UPDATE "leads" SET "version" = 1 WHERE "version" IS NULL;`;
  await sql`UPDATE "leads" SET "full_name" = "name" WHERE "full_name" IS NULL AND "name" IS NOT NULL;`;
  console.log("✓ leads table and columns ensured");

  // 4. leads indexes
  await sql`CREATE INDEX IF NOT EXISTS "leads_assigned_user_status_updated_idx" ON "leads" ("assigned_to_user_id", "status", "updated_at");`;
  await sql`CREATE INDEX IF NOT EXISTS "leads_assigned_team_status_updated_idx" ON "leads" ("assigned_team_id", "status", "updated_at");`;
  await sql`CREATE INDEX IF NOT EXISTS "leads_normalized_phone_idx" ON "leads" ("normalized_phone");`;
  await sql`CREATE INDEX IF NOT EXISTS "leads_normalized_email_idx" ON "leads" ("normalized_email");`;
  await sql`CREATE INDEX IF NOT EXISTS "leads_created_at_idx" ON "leads" ("created_at");`;
  await sql`CREATE INDEX IF NOT EXISTS "leads_status_idx" ON "leads" ("status");`;
  console.log("✓ leads indexes created/ensured");

  // 5. enquiries CRM columns
  await sql`ALTER TABLE "enquiries" ADD COLUMN IF NOT EXISTS "lead_id" uuid REFERENCES "leads"("id");`;
  await sql`ALTER TABLE "enquiries" ADD COLUMN IF NOT EXISTS "normalized_phone" text;`;
  await sql`ALTER TABLE "enquiries" ADD COLUMN IF NOT EXISTS "normalized_email" text;`;
  await sql`ALTER TABLE "enquiries" ADD COLUMN IF NOT EXISTS "processing_status" text DEFAULT 'pending';`;
  await sql`ALTER TABLE "enquiries" ADD COLUMN IF NOT EXISTS "processed_at" timestamp with time zone;`;
  await sql`CREATE INDEX IF NOT EXISTS "enquiries_lead_id_idx" ON "enquiries" ("lead_id");`;
  await sql`CREATE INDEX IF NOT EXISTS "enquiries_processing_status_idx" ON "enquiries" ("processing_status");`;
  console.log("✓ enquiries CRM columns & indexes ensured");

  // 6. crm_user_roles
  await sql`
    CREATE TABLE IF NOT EXISTS "crm_user_roles" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
      "role" text NOT NULL,
      "granted_by_user_id" uuid REFERENCES "users"("id"),
      "created_at" timestamp with time zone DEFAULT now() NOT NULL,
      "revoked_at" timestamp with time zone
    );
  `;
  await sql`CREATE INDEX IF NOT EXISTS "crm_user_roles_user_role_idx" ON "crm_user_roles" ("user_id", "role");`;
  console.log("✓ crm_user_roles created/ensured");

  // 7. crm_audit_events
  await sql`
    CREATE TABLE IF NOT EXISTS "crm_audit_events" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "actor_user_id" uuid REFERENCES "users"("id"),
      "action" text NOT NULL,
      "entity_type" text NOT NULL,
      "entity_id" uuid NOT NULL,
      "reason" text,
      "before_snapshot" jsonb,
      "after_snapshot" jsonb,
      "request_id" text,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL
    );
  `;
  await sql`CREATE INDEX IF NOT EXISTS "crm_audit_events_entity_idx" ON "crm_audit_events" ("entity_type", "entity_id", "created_at");`;
  await sql`CREATE INDEX IF NOT EXISTS "crm_audit_events_actor_idx" ON "crm_audit_events" ("actor_user_id", "created_at");`;
  await sql`CREATE INDEX IF NOT EXISTS "crm_audit_events_action_idx" ON "crm_audit_events" ("action", "created_at");`;
  console.log("✓ crm_audit_events created/ensured");

  // 8. crm_idempotency_keys
  await sql`
    CREATE TABLE IF NOT EXISTS "crm_idempotency_keys" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "scope" text NOT NULL,
      "idempotency_key" text NOT NULL,
      "request_hash" text NOT NULL,
      "resource_type" text,
      "resource_id" uuid,
      "response_status" integer,
      "response_snapshot" jsonb,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL,
      "expires_at" timestamp with time zone
    );
  `;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS "crm_idempotency_keys_scope_key_idx" ON "crm_idempotency_keys" ("scope", "idempotency_key");`;
  console.log("✓ crm_idempotency_keys created/ensured");

  // 9. lead_duplicate_reviews
  await sql`
    CREATE TABLE IF NOT EXISTS "lead_duplicate_reviews" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "enquiry_id" uuid REFERENCES "enquiries"("id"),
      "candidate_lead_id" uuid NOT NULL REFERENCES "leads"("id"),
      "confidence_category" text NOT NULL,
      "matching_evidence" jsonb NOT NULL,
      "status" text DEFAULT 'pending' NOT NULL,
      "assigned_reviewer_id" uuid REFERENCES "users"("id"),
      "resolved_by_user_id" uuid REFERENCES "users"("id"),
      "resolution_reason" text,
      "resolved_at" timestamp with time zone,
      "version" integer DEFAULT 1 NOT NULL,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp with time zone DEFAULT now() NOT NULL
    );
  `;
  await sql`CREATE INDEX IF NOT EXISTS "lead_duplicate_reviews_status_created_idx" ON "lead_duplicate_reviews" ("status", "created_at");`;
  await sql`CREATE INDEX IF NOT EXISTS "lead_duplicate_reviews_reviewer_status_idx" ON "lead_duplicate_reviews" ("assigned_reviewer_id", "status", "created_at");`;
  await sql`CREATE INDEX IF NOT EXISTS "lead_duplicate_reviews_candidate_lead_idx" ON "lead_duplicate_reviews" ("candidate_lead_id", "created_at");`;
  console.log("✓ lead_duplicate_reviews created/ensured");

  // 10. lead_merge_history
  await sql`
    CREATE TABLE IF NOT EXISTS "lead_merge_history" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "source_lead_id" uuid NOT NULL REFERENCES "leads"("id"),
      "surviving_lead_id" uuid NOT NULL REFERENCES "leads"("id"),
      "merged_by_user_id" uuid NOT NULL REFERENCES "users"("id"),
      "approved_by_user_id" uuid REFERENCES "users"("id"),
      "reason" text NOT NULL,
      "source_snapshot" jsonb,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL,
      "reversed_at" timestamp with time zone,
      "reversed_by_user_id" uuid REFERENCES "users"("id"),
      "reversal_reason" text
    );
  `;
  console.log("✓ lead_merge_history created/ensured");

  console.log("Migration 0027 completed successfully!");
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
