import { pgTable, uuid, text, timestamp, jsonb, uniqueIndex } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const eodReports = pgTable(
  "eod_reports",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    team: text("team").notNull(), // sales | tech | hr | ceo_office | admin_head

    date: text("date").notNull(), // YYYY-MM-DD in IST

    data: jsonb("data").notNull(), // team-specific fields

    screenshotKey: text("screenshot_key"), // R2 object key

    submittedAt: timestamp("submitted_at").defaultNow().notNull(),

    emailedAt: timestamp("emailed_at"),
  },
  (table) => ({
    userDateIdx: uniqueIndex("eod_reports_user_date_idx").on(
      table.userId,
      table.date
    ),
  })
);
