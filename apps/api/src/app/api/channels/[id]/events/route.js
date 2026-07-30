import { db, messages, messageReactions, users } from "@repo/db";
import { eq, and, gt, isNull, inArray, or, sql, desc } from "drizzle-orm";
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

          const newMsgs = await getNewChannelMessages(db, id, since);
          for (const msg of newMsgs) {
            if (closed) return;
            controller.enqueue(`event: new_message\ndata: ${JSON.stringify(msg)}\n\n`);
          }

          const editedMsgs = await getEditedChannelMessages(db, id, since);
          for (const msg of editedMsgs) {
            if (closed) return;
            controller.enqueue(`event: message_updated\ndata: ${JSON.stringify(msg)}\n\n`);
          }

          const deletedMsgs = await getDeletedChannelMessages(db, id, since);
          for (const msg of deletedMsgs) {
            if (closed) return;
            controller.enqueue(`event: message_deleted\ndata: ${JSON.stringify({ messageId: msg.id })}\n\n`);
          }

          const reactions = await getNewChannelReactions(db, id, since);
          for (const r of reactions) {
            if (closed) return;
            controller.enqueue(`event: reaction_added\ndata: ${JSON.stringify(r)}\n\n`);
          }

          const removedReactions = await getRemovedChannelReactions(db, id, since);
          for (const r of removedReactions) {
            if (closed) return;
            controller.enqueue(`event: reaction_removed\ndata: ${JSON.stringify(r)}\n\n`);
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

async function getNewChannelMessages(db, channelId, since) {
  const rows = await db
    .select()
    .from(messages)
    .where(
      and(
        eq(messages.channelId, channelId),
        gt(messages.createdAt, new Date(since)),
        isNull(messages.deletedAt)
      )
    )
    .orderBy(asc(messages.createdAt));

  if (rows.length === 0) return [];

  const senderIds = [...new Set(rows.map((r) => r.senderId))];
  const senders = await db
    .select({ id: users.id, name: users.name, role: users.role, profileImageKey: users.profileImageKey })
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

async function getEditedChannelMessages(db, channelId, since) {
  const rows = await db
    .select()
    .from(messages)
    .where(
      and(
        eq(messages.channelId, channelId),
        gt(messages.editedAt, new Date(since)),
        isNull(messages.deletedAt),
      )
    )
    .orderBy(asc(messages.createdAt));

  return rows.map((r) => ({
    id: r.id,
    content: r.content,
    editedAt: r.editedAt?.toISOString?.() || r.editedAt,
  }));
}

async function getDeletedChannelMessages(db, channelId, since) {
  const rows = await db
    .select({ id: messages.id })
    .from(messages)
    .where(
      and(
        eq(messages.channelId, channelId),
        gt(messages.deletedAt, new Date(since)),
      )
    );
  return rows;
}

async function getNewChannelReactions(db, channelId, since) {
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
        eq(messages.channelId, channelId),
        gt(messageReactions.createdAt, new Date(since)),
        isNull(messages.deletedAt),
      )
    );
  return rows.map((r) => ({
    ...r,
    createdAt: r.createdAt?.toISOString?.() || r.createdAt,
  }));
}

async function getRemovedChannelReactions(db, channelId, since) {
  return [];
}

function asc(col) {
  return sql`${col} ASC`;
}
