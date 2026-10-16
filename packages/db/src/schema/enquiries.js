import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { leads } from "./leads.js";

export const enquiries = pgTable(
  "enquiries",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    firstName: text("first_name").notNull(),

    lastName: text("last_name"),

    email: text("email").notNull(),

    phone: text("phone"),

    message: text("message").notNull(),

    status: text("status").default("new"),

    // CRM fields
    leadId: uuid("lead_id").references(() => leads.id),
    normalizedPhone: text("normalized_phone"),
    normalizedEmail: text("normalized_email"),
    processingStatus: text("processing_status").default("pending"),
    processedAt: timestamp("processed_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    leadIdx: index("enquiries_lead_id_idx").on(table.leadId),
    processingStatusIdx: index("enquiries_processing_status_idx").on(
      table.processingStatus
    ),
  })
);
