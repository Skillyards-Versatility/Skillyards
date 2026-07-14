ALTER TABLE "follow_ups" ADD COLUMN "ai_status" text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "follow_ups" ADD COLUMN "transcription" text;--> statement-breakpoint
ALTER TABLE "follow_ups" ADD COLUMN "analysis" jsonb;