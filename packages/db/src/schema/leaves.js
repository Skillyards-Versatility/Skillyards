import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { relations } from "drizzle-orm";

export const leaves = pgTable("leaves", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  type: text("type").notNull(), // CASUAL, SICK, UNPAID
  reason: text("reason").notNull(),
  status: text("status").default("PENDING").notNull(), // PENDING, APPROVED, REJECTED
  isHalfDay: boolean("is_half_day").default(false).notNull(),
  halfDayPeriod: text("half_day_period"), // MORNING or EVENING
  approvedById: uuid("approved_by_id").references(() => users.id),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const leavesRelations = relations(leaves, ({ one }) => ({
  user: one(users, {
    fields: [leaves.userId],
    references: [users.id],
    relationName: "employee_leaves"
  }),
  approver: one(users, {
    fields: [leaves.approvedById],
    references: [users.id],
    relationName: "approved_leaves"
  })
}));
