CREATE TABLE "call_analyses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"follow_up_id" uuid NOT NULL,
	"overall_score" integer NOT NULL,
	"lead_grade" text NOT NULL,
	"has_compliance_risk" boolean DEFAULT false NOT NULL,
	"call_summary" text NOT NULL,
	"language" jsonb NOT NULL,
	"lead_profile" jsonb NOT NULL,
	"call_outcome" text NOT NULL,
	"script_adherence" jsonb NOT NULL,
	"objections_raised" jsonb NOT NULL,
	"compliance_flags" jsonb NOT NULL,
	"tone_and_delivery" jsonb NOT NULL,
	"scores" jsonb NOT NULL,
	"coaching" jsonb NOT NULL,
	"recommended_next_action" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "call_analyses_follow_up_id_unique" UNIQUE("follow_up_id")
);
--> statement-breakpoint
ALTER TABLE "call_analyses" ADD CONSTRAINT "call_analyses_follow_up_id_follow_ups_id_fk" FOREIGN KEY ("follow_up_id") REFERENCES "public"."follow_ups"("id") ON DELETE cascade ON UPDATE no action;