import { db, users, messageReactions } from "@repo/db";
import { inArray, eq, sql } from "drizzle-orm";
import { getThreadMessages } from "@/modules/chat/messages.service";
import { createProtectedRoute } from "@/lib/middleware";

async function getHandler(req, { ctx, context }) {
  const { id: parentId } = await context.params;
  
  try {
    const rawReplies = await getThreadMessages(db, parentId);
    
    if (rawReplies.length === 0) {
      return Response.json([]);
    }

    const senderIds = [...new Set(rawReplies.map((r) => r.senderId))];
    const senders = await db
      .select({ id: users.id, name: users.name })
      .from(users)
      .where(inArray(users.id, senderIds));
      
    const senderMap = Object.fromEntries(senders.map((s) => [s.id, s]));

    const replyIds = rawReplies.map((r) => r.id);
    const reactions = await db
      .select({
        messageId: messageReactions.messageId,
        emoji: messageReactions.emoji,
        count: sql`COUNT(*)::int`,
        hasReacted: sql`bool_or(${messageReactions.userId} = ${ctx.session.userId})`,
      })
      .from(messageReactions)
      .where(inArray(messageReactions.messageId, replyIds))
      .groupBy(messageReactions.messageId, messageReactions.emoji)
      .orderBy(messageReactions.messageId, messageReactions.emoji);

    const reactionsByMsg = {};
    for (const r of reactions) {
      if (!reactionsByMsg[r.messageId]) reactionsByMsg[r.messageId] = [];
      reactionsByMsg[r.messageId].push({
        emoji: r.emoji,
        count: r.count,
        hasReacted: r.hasReacted,
      });
    }

    const replies = rawReplies.map(r => ({
      ...r,
      sender: senderMap[r.senderId] || { id: r.senderId, name: "Unknown" },
      createdAt: r.createdAt?.toISOString?.() || r.createdAt,
      editedAt: r.editedAt?.toISOString?.() || null,
      reactions: reactionsByMsg[r.id] || [],
    }));

    return Response.json(replies);
  } catch (error) {
    console.error("Error fetching replies:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export const GET = createProtectedRoute(getHandler, {
  policy: (session) => ({
    authorized: !!session?.userId,
    reason: session?.userId ? "Authenticated" : "Login required",
  }),
});
