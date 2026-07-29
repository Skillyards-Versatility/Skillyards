CREATE TABLE "counselling_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"counselor_id" uuid NOT NULL,
	"student_name" text NOT NULL,
	"phone" text,
	"age_or_class" text,
	"course_interest" text,
	"source" text DEFAULT 'walk_in' NOT NULL,
	"outcome" text DEFAULT 'follow_up' NOT NULL,
	"notes" text,
	"session_date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "counselling_sessions" ADD CONSTRAINT "counselling_sessions_counselor_id_users_id_fk" FOREIGN KEY ("counselor_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
