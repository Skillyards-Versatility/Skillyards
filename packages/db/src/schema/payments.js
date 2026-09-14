import {
  pgTable,
  uuid,
  integer,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { students } from "./students.js";
import { installments } from "./installments.js";

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),

    installmentId: uuid("installment_id").references(() => installments.id, {
      onDelete: "set null",
    }),

    amount: integer("amount").notNull(),

    method: text("method").default("cash"),
    note: text("note"),

    receiptKey: text("receipt_key"), // stores R2 object key (receipts/v1/{paymentId}.pdf)
    receiptStatus: text("receipt_status").default("pending"), // pending, generating, ready, failed
    receiptVersion: integer("receipt_version").default(1),
    receiptRequestedAt: timestamp("receipt_requested_at"), // tracking for stale jobs
    receiptJobId: text("receipt_job_id"), // ownership ID to prevent callback races

    receiptNumber: text("receipt_number"), // SY-2026-0001 format

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    studentIdx: index("payments_student_id_idx").on(table.studentId),
    installmentIdx: index("payments_installment_id_idx").on(
      table.installmentId,
    ),
    receiptNumberIdx: index("payments_receipt_number_idx").on(
      table.receiptNumber,
    ),
  }),
);
