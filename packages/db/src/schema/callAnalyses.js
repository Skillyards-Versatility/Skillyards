import { pgTable, uuid, text, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { followUps } from "./followUps.js";

export const callAnalyses = pgTable("call_analyses", {
  id: uuid("id").defaultRandom().primaryKey(),
  followUpId: uuid("follow_up_id")
    .references(() => followUps.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  overallScore: integer("overall_score").notNull(),
  leadGrade: text("lead_grade").notNull(),
  hasComplianceRisk: boolean("has_compliance_risk").notNull().default(false),
  callSummary: text("call_summary").notNull(),
  language: jsonb("language").notNull(),
  leadProfile: jsonb("lead_profile").notNull(),
  callOutcome: text("call_outcome").notNull(),
  scriptAdherence: jsonb("script_adherence").notNull(),
  objectionsRaised: jsonb("objections_raised").notNull(),
  complianceFlags: jsonb("compliance_flags").notNull(),
  toneAndDelivery: jsonb("tone_and_delivery").notNull(),
  scores: jsonb("scores").notNull(),
  coaching: jsonb("coaching").notNull(),
  recommendedNextAction: text("recommended_next_action").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
