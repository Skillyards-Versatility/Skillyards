import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";

export const testLeads = pgTable("test_leads", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),

  status: text("status").default("registered"),
  source: text("source").default("10_min_test"),

  archivedAt: timestamp("archived_at"),

  createdAt: timestamp("created_at").defaultNow(),
});


