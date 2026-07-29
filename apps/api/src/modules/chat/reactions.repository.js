import { eq, and } from "drizzle-orm";
import { messageReactions } from "@repo/db";

export async function addReaction(db, messageId, userId, emoji) {
  const inserted = await db
    .insert(messageReactions)
    .values({ messageId, userId, emoji })
    .onConflictDoNothing()
    .returning();
  return inserted[0] || null;
}

export async function removeReaction(db, messageId, userId, emoji) {
  await db
    .delete(messageReactions)
    .where(
      and(
        eq(messageReactions.messageId, messageId),
        eq(messageReactions.userId, userId),
        eq(messageReactions.emoji, emoji)
      )
    );
}

export async function getReactionsForMessage(db, messageId) {
  return db
    .select()
    .from(messageReactions)
    .where(eq(messageReactions.messageId, messageId));
}
