ALTER TABLE "students" ADD COLUMN "assigned_to" uuid;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "laptop_opted_at" timestamp;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "photo_key" text;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;