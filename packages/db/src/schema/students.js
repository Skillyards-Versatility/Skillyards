import {pgTable, uuid, text, integer, timestamp} from "drizzle-orm/pg-core";
import { batches } from "./batches.js";

export const students = pgTable("students", {
  id: uuid("id").primaryKey().defaultRandom(),

  name: text("name").notNull(),
  phone: text("phone"),
  email: text("email").unique(),

  totalFee: integer("total_fee").notNull(), 
  finalFee: integer("final_fee").notNull(),
  courseName: text("course_name"),
  batchId: uuid("batch_id").references(() => batches.id),
  batchName: text("batch_name"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});