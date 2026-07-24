import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const batches = pgTable("batches", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  courseName: text("course_name").notNull(),
  description: text("description"),
  startDate: timestamp("start_date"),
  status: text("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
