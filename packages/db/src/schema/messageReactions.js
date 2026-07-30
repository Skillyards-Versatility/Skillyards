import { pgTable, uuid, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { messages } from "./messages.js";

export const messageReactions = pgTable(
  "message_reactions",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    messageId: uuid("message_id")
      .notNull()
      .references(() => messages.id, { onDelete: "cascade" }),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    emoji: text("emoji").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    messageUserEmojiIdx: uniqueIndex("msg_reactions_msg_user_emoji_idx").on(
      table.messageId,
      table.userId,
      table.emoji
    ),
  })
);
