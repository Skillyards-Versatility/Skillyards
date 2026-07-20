import { pgTable, uuid, text, timestamp, integer, index } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const breaks = pgTable(
  "breaks",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    startedAt: timestamp("started_at").defaultNow().notNull(),

    endedAt: timestamp("ended_at"),

    duration: integer("duration"), // seconds, computed on end

    date: text("date").notNull(), // YYYY-MM-DD in IST

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userDateIdx: index("breaks_user_date_idx").on(table.userId, table.date),
  })
);
