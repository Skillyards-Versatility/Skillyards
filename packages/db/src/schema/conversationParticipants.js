import { pgTable, uuid, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { channels } from "./channels.js";
import { conversations } from "./conversations.js";

export const conversationParticipants = pgTable(
  "conversation_participants",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    channelId: uuid("channel_id").references(() => channels.id, { onDelete: "cascade" }),

    conversationId: uuid("conversation_id").references(() => conversations.id, { onDelete: "cascade" }),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    role: text("role").notNull().default("member"), // admin | member

    lastReadAt: timestamp("last_read_at").defaultNow().notNull(),

    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (table) => ({
    channelUserIdx: uniqueIndex("conv_part_channel_user_idx").on(table.channelId, table.userId),
    conversationUserIdx: uniqueIndex("conv_part_conversation_user_idx").on(table.conversationId, table.userId),
  })
);
