import { pgTable, text, uuid, timestamp, jsonb, integer } from "drizzle-orm/pg-core";

export const testSessions = pgTable("test_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),

  leadId: uuid("lead_id").notNull(),

  testType: text("test_type").notNull().default("10_min_test"),

  status: text("status").notNull().default("started"),

  startedAt: timestamp("started_at").defaultNow().notNull(),

  completedAt: timestamp("completed_at"),

  score: integer("score"),

  questionsSnapshot: jsonb("questions_snapshot"),

  evaluationSnapshot: jsonb("evaluation_snapshot"),

  archivedAt: timestamp("archived_at"),
});