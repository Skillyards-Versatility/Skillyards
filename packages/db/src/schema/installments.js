import {
  pgTable,
  uuid,
  integer,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

import { students } from "./students.js";
import { plans } from "./plans.js";

export const installments = pgTable(
  "installments",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),

    planId: uuid("plan_id")
      .notNull()
      .references(() => plans.id, { onDelete: "cascade" }),

    amountDue: integer("amount_due").notNull(),

    dueDate: timestamp("due_date").notNull(),

    status: text("status").notNull().default("scheduled"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    studentIdx: index("installments_student_id_idx").on(table.studentId),
    planIdx: index("installments_plan_id_idx").on(table.planId),
  }),
);
