ALTER TABLE "messages" DROP CONSTRAINT IF EXISTS "messages_parent_id_messages_id_fk";--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_parent_id_messages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."messages"("id") ON DELETE CASCADE;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "messages_conversation_id_idx" ON "messages" ("conversation_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "messages_parent_id_idx" ON "messages" ("parent_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "messages_conversation_created_at_idx" ON "messages" ("conversation_id", "created_at");