ALTER TABLE "conversation_participants" ADD COLUMN "role" text DEFAULT 'member';--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "type" text DEFAULT 'dm' NOT NULL;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "name" text;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "created_by" uuid;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;