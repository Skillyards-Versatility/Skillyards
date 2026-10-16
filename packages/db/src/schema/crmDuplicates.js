import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { enquiries } from "./enquiries.js";
import { leads } from "./leads.js";

export const leadDuplicateReviews = pgTable(
  "lead_duplicate_reviews",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    enquiryId: uuid("enquiry_id").references(() => enquiries.id),
    candidateLeadId: uuid("candidate_lead_id")
      .notNull()
      .references(() => leads.id),
    confidenceCategory: text("confidence_category").notNull(), // high | medium | low
    matchingEvidence: jsonb("matching_evidence").notNull(),
    status: text("status").default("pending").notNull(), // pending | in_review | resolved_existing_lead | resolved_new_lead | dismissed
    assignedReviewerId: uuid("assigned_reviewer_id").references(() => users.id),
    resolvedByUserId: uuid("resolved_by_user_id").references(() => users.id),
    resolutionReason: text("resolution_reason"),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    version: integer("version").default(1).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    statusCreatedIdx: index("lead_duplicate_reviews_status_created_idx").on(
      table.status,
      table.createdAt
    ),
    reviewerStatusIdx: index("lead_duplicate_reviews_reviewer_status_idx").on(
      table.assignedReviewerId,
      table.status,
      table.createdAt
    ),
    candidateLeadIdx: index("lead_duplicate_reviews_candidate_lead_idx").on(
      table.candidateLeadId,
      table.createdAt
    ),
  })
);

export const leadMergeHistory = pgTable("lead_merge_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  sourceLeadId: uuid("source_lead_id")
    .notNull()
    .references(() => leads.id),
  survivingLeadId: uuid("surviving_lead_id")
    .notNull()
    .references(() => leads.id),
  mergedByUserId: uuid("merged_by_user_id")
    .notNull()
    .references(() => users.id),
  approvedByUserId: uuid("approved_by_user_id").references(() => users.id),
  reason: text("reason").notNull(),
  sourceSnapshot: jsonb("source_snapshot"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  reversedAt: timestamp("reversed_at", { withTimezone: true }),
  reversedByUserId: uuid("reversed_by_user_id").references(() => users.id),
  reversalReason: text("reversal_reason"),
});
