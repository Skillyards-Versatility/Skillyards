DROP TABLE "test_questions" CASCADE;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "receipt_requested_at" timestamp;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "receipt_job_id" text;