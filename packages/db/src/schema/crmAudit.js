import { pgTable, uuid, text, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const crmAuditEvents = pgTable(
  "crm_audit_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    actorUserId: uuid("actor_user_id").references(() => users.id),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: uuid("entity_id").notNull(),
    reason: text("reason"),
    beforeSnapshot: jsonb("before_snapshot"),
    afterSnapshot: jsonb("after_snapshot"),
    requestId: text("request_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    entityIdx: index("crm_audit_events_entity_idx").on(
      table.entityType,
      table.entityId,
      table.createdAt
    ),
    actorIdx: index("crm_audit_events_actor_idx").on(table.actorUserId, table.createdAt),
    actionIdx: index("crm_audit_events_action_idx").on(table.action, table.createdAt),
  })
);
