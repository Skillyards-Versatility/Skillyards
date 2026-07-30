import { eq, desc, asc, and, isNull, or, sql } from "drizzle-orm";
import { messages, messageReactions } from "@repo/db";

export async function getMessagesByChannel(db, channelId, { limit = 50, before } = {}) {
  let conditions = and(
    eq(messages.channelId, channelId),
    isNull(messages.deletedAt),
    isNull(messages.parentId),
  );
  if (before) {
    conditions = and(conditions, sql`${messages.createdAt} < ${before}::timestamp`);
  }
  return db
    .select()
    .from(messages)
    .where(conditions)
    .orderBy(desc(messages.createdAt))
    .limit(limit);
}

export async function getMessagesByConversation(db, conversationId, { limit = 50, before } = {}) {
  let conditions = and(
    eq(messages.conversationId, conversationId),
    isNull(messages.deletedAt),
    isNull(messages.parentId),
  );
  if (before) {
    conditions = and(conditions, sql`${messages.createdAt} < ${before}::timestamp`);
  }
  return db
    .select()
    .from(messages)
    .where(conditions)
    .orderBy(desc(messages.createdAt))
    .limit(limit);
}

export async function getThreadReplies(db, parentId) {
  return db
    .select()
    .from(messages)
    .where(eq(messages.parentId, parentId))
    .orderBy(asc(messages.createdAt));
}

export async function createMessageRecord(db, data) {
  const inserted = await db
    .insert(messages)
    .values({
      content: data.content,
      senderId: data.senderId,
      channelId: data.channelId || null,
      conversationId: data.conversationId || null,
      parentId: data.parentId || null,
      type: data.type || "text",
      fileKey: data.fileKey || null,
      fileType: data.fileType || null,
      fileName: data.fileName || null,
    })
    .returning();
  return inserted[0];
}

export async function getMessageById(db, messageId) {
  const res = await db
    .select()
    .from(messages)
    .where(and(eq(messages.id, messageId), isNull(messages.deletedAt)))
    .limit(1);
  return res[0] || null;
}

export async function updateMessageContent(db, messageId, content) {
  const updated = await db
    .update(messages)
    .set({ content, editedAt: new Date() })
    .where(eq(messages.id, messageId))
    .returning();
  return updated[0] || null;
}

export async function softDeleteMessage(db, messageId) {
  const updated = await db
    .update(messages)
    .set({ deletedAt: new Date(), content: "" })
    .where(eq(messages.id, messageId))
    .returning();
  return updated[0] || null;
}

export async function getMessageWithReactions(db, messageId) {
  const msg = await getMessageById(db, messageId);
  if (!msg) return null;
  const reactions = await db
    .select()
    .from(messageReactions)
    .where(eq(messageReactions.messageId, messageId));
  return { ...msg, reactions };
}
