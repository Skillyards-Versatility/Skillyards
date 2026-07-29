import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { channels } from "./channels.js";
import { conversations } from "./conversations.js";

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    content: text("content").notNull(),

    senderId: uuid("sender_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    channelId: uuid("channel_id").references(() => channels.id, { onDelete: "cascade" }),

    conversationId: uuid("conversation_id").references(() => conversations.id, { onDelete: "cascade" }),

    parentId: uuid("parent_id"), // self-reference for thread replies

    type: text("type").notNull().default("text"), // text | image | file | system

    fileKey: text("file_key"),

    fileType: text("file_type"),

    fileName: text("file_name"),

    editedAt: timestamp("edited_at"),

    deletedAt: timestamp("deleted_at"), // soft delete

    createdAt: timestamp("created_at").defaultNow().notNull(),
  }
);
