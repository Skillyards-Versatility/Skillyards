import { pgTable, uuid, text, timestamp, date, uniqueIndex } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const counsellingSessions = pgTable(
  "counselling_sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    counselorId: uuid("counselor_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    studentName: text("student_name").notNull(),
    phone: text("phone"),
    ageOrClass: text("age_or_class"),
    courseInterest: text("course_interest"),

    source: text("source").notNull().default("walk_in"), // walk_in | phone | referral

    outcome: text("outcome").notNull().default("follow_up"), // session_booked | enrolled | follow_up | not_interested | no_response

    notes: text("notes"),

    sessionDate: date("session_date").notNull(), // YYYY-MM-DD
    nextFollowUpDate: date("next_follow_up_date"), // YYYY-MM-DD
    imageKey: text("image_key"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  () => ({})
);
