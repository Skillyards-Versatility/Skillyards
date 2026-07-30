"use server";

import { db, users, conversations, conversationParticipants, messages } from "@repo/db";
import { eq, and, ne, desc, sql, inArray } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import webPush from "web-push";

if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webPush.setVapidDetails(
    "mailto:admin@skillyards.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

export async function getOrCreateConversation(otherUserId) {
  const session = await getSession();
  if (!session) return null;

  const userId = session.userId;

  if (otherUserId === userId) return null;

  const myConvs = await db
    .select({ conversationId: conversationParticipants.conversationId })
    .from(conversationParticipants)
    .where(eq(conversationParticipants.userId, userId));

  if (myConvs.length > 0) {
    const myConvIds = myConvs.map((c) => c.conversationId);

    const [match] = await db
      .select({ conversationId: conversationParticipants.conversationId })
      .from(conversationParticipants)
      .where(
        and(
          inArray(conversationParticipants.conversationId, myConvIds),
          eq(conversationParticipants.userId, otherUserId)
        )
      )
      .limit(1);

    if (match) return match.conversationId;
  }

  const [conv] = await db.insert(conversations).values({}).returning();

  await db.insert(conversationParticipants).values([
    { conversationId: conv.id, userId },
    { conversationId: conv.id, userId: otherUserId },
  ]);

  return conv.id;
}

export async function getMyConversations() {
  const session = await getSession();
  if (!session) return [];

  const userId = session.userId;

  const result = await db.execute(sql`
    SELECT
      c.id AS "conversationId",
      c.updated_at AS "updatedAt",
      u.id AS "otherUserId",
      u.name AS "otherUserName",
      u.role AS "otherUserRole",
      u.team AS "otherUserTeam",
      cp.last_read_at AS "lastReadAt",
      m.id AS "lastMessageId",
      m.content AS "lastMessageContent",
      m.created_at AS "lastMessageCreatedAt",
      m.sender_id AS "lastMessageSenderId",
      (SELECT COUNT(*) FROM messages
       WHERE conversation_id = c.id
       AND created_at > COALESCE(cp.last_read_at, '1970-01-01'::timestamp)
       AND sender_id != ${userId})::int AS "unreadCount"
    FROM conversation_participants cp
    JOIN conversations c ON cp.conversation_id = c.id
    JOIN conversation_participants cp2 ON c.id = cp2.conversation_id AND cp2.user_id != cp.user_id
    JOIN users u ON cp2.user_id = u.id
    LEFT JOIN LATERAL (
      SELECT id, content, created_at, sender_id
      FROM messages
      WHERE conversation_id = c.id
      ORDER BY created_at DESC
      LIMIT 1
    ) m ON true
    WHERE cp.user_id = ${userId}
    ORDER BY COALESCE(m.created_at, c.updated_at) DESC
  `);

  return result.rows || [];
}

export async function getMessages(conversationId, since) {
  const session = await getSession();
  if (!session) return [];

  const userId = session.userId;

  const [participation] = await db
    .select()
    .from(conversationParticipants)
    .where(
      and(
        eq(conversationParticipants.conversationId, conversationId),
        eq(conversationParticipants.userId, userId)
      )
    )
    .limit(1);

  if (!participation) return [];

  const conditions = [eq(messages.conversationId, conversationId)];
  if (since) {
    conditions.push(sql`${messages.createdAt} > ${new Date(since)}`);
  }

  const msgs = await db
    .select({
      id: messages.id,
      content: messages.content,
      createdAt: messages.createdAt,
      senderId: messages.senderId,
      senderName: users.name,
    })
    .from(messages)
    .innerJoin(users, eq(messages.senderId, users.id))
    .where(and(...conditions))
    .orderBy(messages.createdAt);

  return msgs;
}

export async function sendMessage(conversationId, content) {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated" };

  const userId = session.userId;

  const [participation] = await db
    .select()
    .from(conversationParticipants)
    .where(
      and(
        eq(conversationParticipants.conversationId, conversationId),
        eq(conversationParticipants.userId, userId)
      )
    )
    .limit(1);

  if (!participation) {
    return { success: false, error: "Not a participant" };
  }

  const [message] = await db
    .insert(messages)
    .values({ conversationId, senderId: userId, content })
    .returning();

  await db
    .update(conversations)
    .set({ updatedAt: new Date() })
    .where(eq(conversations.id, conversationId));

  const [sender] = await db
    .select({ name: users.name })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const senderName = sender?.name || "Someone";

  try {
    const otherParticipants = await db
      .select({ id: users.id, pushSubscription: users.pushSubscription })
      .from(conversationParticipants)
      .innerJoin(users, eq(conversationParticipants.userId, users.id))
      .where(
        and(
          eq(conversationParticipants.conversationId, conversationId),
          ne(conversationParticipants.userId, userId),
          sql`${users.pushSubscription} IS NOT NULL`
        )
      );

    for (const p of otherParticipants) {
      try {
        await webPush.sendNotification(
          p.pushSubscription,
          JSON.stringify({
            title: senderName,
            body: content,
            url: `/chat/${conversationId}`,
          })
        );
      } catch (pushErr) {
        if (pushErr.statusCode === 410) {
          await db.update(users).set({ pushSubscription: null }).where(eq(users.id, p.id));
        }
      }
    }
  } catch {
    // push notification errors never block the message
  }

  return { success: true, message };
}

export async function markAsRead(conversationId) {
  const session = await getSession();
  if (!session) return;

  await db
    .update(conversationParticipants)
    .set({ lastReadAt: new Date() })
    .where(
      and(
        eq(conversationParticipants.conversationId, conversationId),
        eq(conversationParticipants.userId, session.userId)
      )
    );
}
