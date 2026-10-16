CREATE TABLE "crm_audit_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_user_id" uuid,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" uuid NOT NULL,
	"reason" text,
	"before_snapshot" jsonb,
	"after_snapshot" jsonb,
	"request_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lead_duplicate_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"enquiry_id" uuid,
	"candidate_lead_id" uuid NOT NULL,
	"confidence_category" text NOT NULL,
	"matching_evidence" jsonb NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"assigned_reviewer_id" uuid,
	"resolved_by_user_id" uuid,
	"resolution_reason" text,
	"resolved_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lead_merge_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_lead_id" uuid NOT NULL,
	"surviving_lead_id" uuid NOT NULL,
	"merged_by_user_id" uuid NOT NULL,
	"approved_by_user_id" uuid,
	"reason" text NOT NULL,
	"source_snapshot" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reversed_at" timestamp with time zone,
	"reversed_by_user_id" uuid,
	"reversal_reason" text
);
--> statement-breakpoint
CREATE TABLE "crm_idempotency_keys" (
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
--> statement-breakpoint
CREATE TABLE "crm_user_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"role" text NOT NULL,
	"granted_by_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"revoked_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "sales_team_memberships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ended_at" timestamp with time zone,
	"changed_by_user_id" uuid NOT NULL,
	"change_reason" text
);
--> statement-breakpoint
CREATE TABLE "sales_teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text NOT NULL,
	"normalized_phone" text,
	"normalized_email" text,
	"status" text DEFAULT 'new' NOT NULL,
	"assigned_to_user_id" uuid,
	"assigned_team_id" uuid,
	"converted_student_id" uuid,
	"converted_at" timestamp with time zone,
	"merged_into_lead_id" uuid,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "enquiries" ADD COLUMN "lead_id" uuid;--> statement-breakpoint
ALTER TABLE "enquiries" ADD COLUMN "normalized_phone" text;--> statement-breakpoint
ALTER TABLE "enquiries" ADD COLUMN "normalized_email" text;--> statement-breakpoint
ALTER TABLE "enquiries" ADD COLUMN "processing_status" text DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "enquiries" ADD COLUMN "processed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "crm_audit_events" ADD CONSTRAINT "crm_audit_events_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_duplicate_reviews" ADD CONSTRAINT "lead_duplicate_reviews_enquiry_id_enquiries_id_fk" FOREIGN KEY ("enquiry_id") REFERENCES "public"."enquiries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_duplicate_reviews" ADD CONSTRAINT "lead_duplicate_reviews_candidate_lead_id_leads_id_fk" FOREIGN KEY ("candidate_lead_id") REFERENCES "public"."leads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_duplicate_reviews" ADD CONSTRAINT "lead_duplicate_reviews_assigned_reviewer_id_users_id_fk" FOREIGN KEY ("assigned_reviewer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_duplicate_reviews" ADD CONSTRAINT "lead_duplicate_reviews_resolved_by_user_id_users_id_fk" FOREIGN KEY ("resolved_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_merge_history" ADD CONSTRAINT "lead_merge_history_source_lead_id_leads_id_fk" FOREIGN KEY ("source_lead_id") REFERENCES "public"."leads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_merge_history" ADD CONSTRAINT "lead_merge_history_surviving_lead_id_leads_id_fk" FOREIGN KEY ("surviving_lead_id") REFERENCES "public"."leads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_merge_history" ADD CONSTRAINT "lead_merge_history_merged_by_user_id_users_id_fk" FOREIGN KEY ("merged_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_merge_history" ADD CONSTRAINT "lead_merge_history_approved_by_user_id_users_id_fk" FOREIGN KEY ("approved_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_merge_history" ADD CONSTRAINT "lead_merge_history_reversed_by_user_id_users_id_fk" FOREIGN KEY ("reversed_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crm_user_roles" ADD CONSTRAINT "crm_user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crm_user_roles" ADD CONSTRAINT "crm_user_roles_granted_by_user_id_users_id_fk" FOREIGN KEY ("granted_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_team_memberships" ADD CONSTRAINT "sales_team_memberships_team_id_sales_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."sales_teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_team_memberships" ADD CONSTRAINT "sales_team_memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_team_memberships" ADD CONSTRAINT "sales_team_memberships_changed_by_user_id_users_id_fk" FOREIGN KEY ("changed_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_assigned_to_user_id_users_id_fk" FOREIGN KEY ("assigned_to_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_assigned_team_id_sales_teams_id_fk" FOREIGN KEY ("assigned_team_id") REFERENCES "public"."sales_teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_converted_student_id_students_id_fk" FOREIGN KEY ("converted_student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_merged_into_lead_id_leads_id_fk" FOREIGN KEY ("merged_into_lead_id") REFERENCES "public"."leads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "crm_audit_events_entity_idx" ON "crm_audit_events" USING btree ("entity_type","entity_id","created_at");--> statement-breakpoint
CREATE INDEX "crm_audit_events_actor_idx" ON "crm_audit_events" USING btree ("actor_user_id","created_at");--> statement-breakpoint
CREATE INDEX "crm_audit_events_action_idx" ON "crm_audit_events" USING btree ("action","created_at");--> statement-breakpoint
CREATE INDEX "lead_duplicate_reviews_status_created_idx" ON "lead_duplicate_reviews" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "lead_duplicate_reviews_reviewer_status_idx" ON "lead_duplicate_reviews" USING btree ("assigned_reviewer_id","status","created_at");--> statement-breakpoint
CREATE INDEX "lead_duplicate_reviews_candidate_lead_idx" ON "lead_duplicate_reviews" USING btree ("candidate_lead_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "crm_idempotency_keys_scope_key_idx" ON "crm_idempotency_keys" USING btree ("scope","idempotency_key");--> statement-breakpoint
CREATE INDEX "crm_user_roles_user_role_idx" ON "crm_user_roles" USING btree ("user_id","role");--> statement-breakpoint
CREATE INDEX "leads_assigned_user_status_updated_idx" ON "leads" USING btree ("assigned_to_user_id","status","updated_at");--> statement-breakpoint
CREATE INDEX "leads_assigned_team_status_updated_idx" ON "leads" USING btree ("assigned_team_id","status","updated_at");--> statement-breakpoint
CREATE INDEX "leads_normalized_phone_idx" ON "leads" USING btree ("normalized_phone");--> statement-breakpoint
CREATE INDEX "leads_normalized_email_idx" ON "leads" USING btree ("normalized_email");--> statement-breakpoint
CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "leads_status_idx" ON "leads" USING btree ("status");--> statement-breakpoint
ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "enquiries_lead_id_idx" ON "enquiries" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "enquiries_processing_status_idx" ON "enquiries" USING btree ("processing_status");