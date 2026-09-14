import { pgTable, uuid, integer, timestamp, index } from "drizzle-orm/pg-core";

import { payments } from "./payments.js";
import { installments } from "./installments.js";

export const paymentAllocations = pgTable(
  "payment_allocations",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    paymentId: uuid("payment_id")
      .notNull()
      .references(() => payments.id, { onDelete: "cascade" }),

    installmentId: uuid("installment_id")
      .notNull()
      .references(() => installments.id, { onDelete: "cascade" }),

    amount: integer("amount").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    paymentIdx: index("alloc_payment_id_idx").on(table.paymentId),
    installmentIdx: index("alloc_installment_id_idx").on(table.installmentId),
  }),
);
