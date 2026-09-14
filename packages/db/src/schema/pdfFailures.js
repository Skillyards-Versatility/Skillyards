import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const pdfFailures = pgTable("pdf_failures", {
  id: uuid("id").defaultRandom().primaryKey(),
  paymentId: uuid("payment_id").notNull(),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow(),
});
