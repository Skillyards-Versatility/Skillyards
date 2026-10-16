import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { students } from "./students.js";
import { salesTeams } from "./salesTeams.js";

export const leads = pgTable(
  "leads",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name"),
    fullName: text("full_name"),
    phone: text("phone"),
    normalizedPhone: text("normalized_phone"),
    email: text("email"),
    normalizedEmail: text("normalized_email"),
    status: text("status").default("new").notNull(), // new | contacted | follow_up | counselling_scheduled | counselled | qualified | converted | cold | lost
    assignedToUserId: uuid("assigned_to_user_id").references(() => users.id),
    assignedTeamId: uuid("assigned_team_id").references(() => salesTeams.id),
    convertedStudentId: uuid("converted_student_id").references(() => students.id),
    convertedAt: timestamp("converted_at", { withTimezone: true }),
    mergedIntoLeadId: uuid("merged_into_lead_id").references(() => leads.id),
    version: integer("version").default(1).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    assignedUserStatusIdx: index("leads_assigned_user_status_updated_idx").on(
      table.assignedToUserId,
      table.status,
      table.updatedAt
    ),
    assignedTeamStatusIdx: index("leads_assigned_team_status_updated_idx").on(
      table.assignedTeamId,
      table.status,
      table.updatedAt
    ),
    normalizedPhoneIdx: index("leads_normalized_phone_idx").on(table.normalizedPhone),
    normalizedEmailIdx: index("leads_normalized_email_idx").on(table.normalizedEmail),
    createdAtIdx: index("leads_created_at_idx").on(table.createdAt),
    statusIdx: index("leads_status_idx").on(table.status),
  })
);
