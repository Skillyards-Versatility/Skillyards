CREATE TABLE "follow_ups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_phone" text NOT NULL,
	"telecaller_id" uuid NOT NULL,
	"duration" integer NOT NULL,
	"recording_url" text,
	"outcome" text NOT NULL,
	"type" text DEFAULT 'call' NOT NULL,
	"contacted_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "follow_ups" ADD CONSTRAINT "follow_ups_telecaller_id_users_id_fk" FOREIGN KEY ("telecaller_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;