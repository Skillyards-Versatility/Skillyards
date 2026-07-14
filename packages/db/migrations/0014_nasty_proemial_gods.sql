ALTER TABLE "follow_ups" DROP CONSTRAINT "follow_ups_telecaller_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "follow_ups" ADD CONSTRAINT "follow_ups_telecaller_id_employees_id_fk" FOREIGN KEY ("telecaller_id") REFERENCES "public"."employees"("id") ON DELETE cascade ON UPDATE no action;