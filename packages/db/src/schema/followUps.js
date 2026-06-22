import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";
import { employees } from "./employees.js";

export const followUps = pgTable("follow_ups", {
  id: uuid("id").defaultRandom().primaryKey(),
  leadPhone: text("lead_phone").notNull(),
  telecallerId: uuid("telecaller_id")
    .references(() => employees.id, { onDelete: "cascade" })
    .notNull(),
  duration: integer("duration").notNull(),
  recordingUrl: text("recording_url"),
  outcome: text("outcome").notNull(), // 'reached' | 'not_reached'
  type: text("type").default("call").notNull(),
  contactedAt: timestamp("contacted_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
