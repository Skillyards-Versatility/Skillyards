import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  jsonb,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const crmIdempotencyKeys = pgTable(
  "crm_idempotency_keys",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    scope: text("scope").notNull(),
    idempotencyKey: text("idempotency_key").notNull(),
    requestHash: text("request_hash").notNull(),
    resourceType: text("resource_type"),
    resourceId: uuid("resource_id"),
    responseStatus: integer("response_status"),
    responseSnapshot: jsonb("response_snapshot"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
  },
  (table) => ({
    scopeKeyIdx: uniqueIndex("crm_idempotency_keys_scope_key_idx").on(
      table.scope,
      table.idempotencyKey
    ),
  })
);
