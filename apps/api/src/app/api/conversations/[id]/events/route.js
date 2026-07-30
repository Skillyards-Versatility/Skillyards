import { db, messages, messageReactions, users, conversationParticipants } from "@repo/db";
import { eq, and, gt, isNull, inArray, sql } from "drizzle-orm";
import { createProtectedRoute } from "@/lib/middleware";

const POLL_INTERVAL = 3000;

async function getHandler(req, { ctx, context }) {
  const { id } = await context.params;

  const stream = new ReadableStream({
    start(controller) {
      let lastPoll = new Date().toISOString();
      let closed = false;

      const cleanup = () => {
        closed = true;
        clearInterval(interval);
      };

      req.signal.addEventListener("abort", cleanup);
      controller.signal?.addEventListener("abort", cleanup);

      const interval = setInterval(async () => {
        if (closed) return;
        try {
          const since = lastPoll;
          lastPoll = new Date().toISOString();

          const newMsgs = await getNewConversationMessages(db, id, since);
          for (const msg of newMsgs) {
            if (closed) return;
            controller.enqueue(`event: new_message\ndata: ${JSON.stringify(msg)}\n\n`);
          }

          const editedMsgs = await getEditedConversationMessages(db, id, since);
          for (const msg of editedMsgs) {
            if (closed) return;
            controller.enqueue(`event: message_updated\ndata: ${JSON.stringify(msg)}\n\n`);
          }

          const deletedMsgs = await getDeletedConversationMessages(db, id, since);
          for (const msg of deletedMsgs) {
            if (closed) return;
            controller.enqueue(`event: message_deleted\ndata: ${JSON.stringify({ messageId: msg.id })}\n\n`);
          }

          const reactions = await getNewConversationReactions(db, id, since);
          for (const r of reactions) {
            if (closed) return;
            controller.enqueue(`event: reaction_added\ndata: ${JSON.stringify(r)}\n\n`);
          }

          controller.enqueue(`event: heartbeat\ndata: {}\n\n`);
        } catch (err) {
          console.error("[SSE] Poll error:", err);
        }
      }, POLL_INTERVAL);

      controller.enqueue(`event: connected\ndata: {}\n\n`);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

export const GET = createProtectedRoute(getHandler, {
  policy: (session) => ({
    authorized: !!session?.userId,
    reason: session?.userId ? "Authenticated" : "Login required",
  }),
});

async function getNewConversationMessages(db, conversationId, since) {
  const rows = await db
    .select()
    .from(messages)
    .where(
      and(
        eq(messages.conversationId, conversationId),
        gt(messages.createdAt, new Date(since)),
        isNull(messages.deletedAt)
      )
    )
    .orderBy(sql`${messages.createdAt} ASC`);

  if (rows.length === 0) return [];

  const senderIds = [...new Set(rows.map((r) => r.senderId))];
  const senders = await db
    .select({ id: users.id, name: users.name })
    .from(users)
    .where(inArray(users.id, senderIds));
  const senderMap = Object.fromEntries(senders.map((s) => [s.id, s]));

  return rows.map((r) => ({
    ...r,
    createdAt: r.createdAt?.toISOString?.() || r.createdAt,
    editedAt: r.editedAt?.toISOString?.() || null,
    sender: senderMap[r.senderId] || { id: r.senderId, name: "Unknown" },
    reactions: [],
  }));
}

async function getEditedConversationMessages(db, conversationId, since) {
  const rows = await db
    .select()
    .from(messages)
    .where(
      and(
        eq(messages.conversationId, conversationId),
        gt(messages.editedAt, new Date(since)),
        isNull(messages.deletedAt),
      )
    );
  return rows.map((r) => ({
    id: r.id,
    content: r.content,
    editedAt: r.editedAt?.toISOString?.() || r.editedAt,
  }));
}

async function getDeletedConversationMessages(db, conversationId, since) {
  const rows = await db
    .select({ id: messages.id })
    .from(messages)
    .where(
      and(
        eq(messages.conversationId, conversationId),
        gt(messages.deletedAt, new Date(since)),
      )
    );
  return rows;
}

async function getNewConversationReactions(db, conversationId, since) {
  const rows = await db
    .select({
      id: messageReactions.id,
      messageId: messageReactions.messageId,
      userId: messageReactions.userId,
      emoji: messageReactions.emoji,
      createdAt: messageReactions.createdAt,
    })
    .from(messageReactions)
    .innerJoin(messages, eq(messages.id, messageReactions.messageId))
    .where(
      and(
        eq(messages.conversationId, conversationId),
        gt(messageReactions.createdAt, new Date(since)),
        isNull(messages.deletedAt),
      )
    );
  return rows.map((r) => ({
    ...r,
    createdAt: r.createdAt?.toISOString?.() || r.createdAt,
  }));
}
