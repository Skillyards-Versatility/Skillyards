import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const enquiries = pgTable("enquiries", {
  id: uuid("id").defaultRandom().primaryKey(),

  firstName: text("first_name").notNull(),

  lastName: text("last_name"),

  email: text("email").notNull(),

  phone: text("phone"),

  message: text("message").notNull(),

  status: text("status").default("new"),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
