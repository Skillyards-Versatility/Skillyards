import { pgTable, uuid, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const eodWarnings = pgTable(
  "eod_warnings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    date: text("date").notNull(), // YYYY-MM-DD in IST
    sentAt: timestamp("sent_at").defaultNow().notNull(),
  },
  (table) => ({
    userDateIdx: uniqueIndex("eod_warnings_user_date_idx").on(table.userId, table.date),
  })
);
