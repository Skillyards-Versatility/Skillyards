"use server";

import { db, users, conversations, conversationParticipants, messages, messageReactions } from "@repo/db";
import { eq, and, ne, desc, sql, inArray, isNull } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import webPush from "web-push";

if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webPush.setVapidDetails(
    "mailto:admin@skillyards.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

const TEAM_CHANNELS = {
  general: "General",
  sales: "Sales",
  tech: "Tech",
  hr: "HR",
  ceo_office: "CEO Office",
  admin_head: "Admin Head",
  marketing: "Marketing",
  outside_sales: "Outside Sales",
};

const TEAM_MAP = {
  sales: "sales",
  tech: "tech",
  hr: "hr",
  ceo_office: "ceo_office",
  admin_head: "admin_head",
  marketing: "marketing",
  outside_sales: "outside_sales",
};

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
      .innerJoin(conversations, eq(conversationParticipants.conversationId, conversations.id))
      .where(
        and(
          inArray(conversationParticipants.conversationId, myConvIds),
          eq(conversationParticipants.userId, otherUserId),
          eq(conversations.type, "dm")
        )
      )
      .limit(1);

    if (match) return match.conversationId;
  }

  const [conv] = await db.insert(conversations).values({ type: "dm" }).returning();

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
      c.type AS "type",
      c.name AS "name",
      c.updated_at AS "updatedAt",
      cp.last_read_at AS "lastReadAt",
      CASE WHEN c.type = 'dm' THEN u.id END AS "otherUserId",
      CASE WHEN c.type = 'dm' THEN u.name END AS "otherUserName",
      CASE WHEN c.type = 'dm' THEN u.role END AS "otherUserRole",
      CASE WHEN c.type = 'dm' THEN u.team END AS "otherUserTeam",
      CASE WHEN c.type = 'dm' THEN u.profile_image_key END AS "otherUserProfileImageKey",
      CASE WHEN c.type = 'channel' THEN (
        SELECT COUNT(*) FROM conversation_participants WHERE conversation_id = c.id
      ) ELSE NULL END::int AS "participantCount",
      m.id AS "lastMessageId",
      m.content AS "lastMessageContent",
      m.created_at AS "lastMessageCreatedAt",
      m.sender_id AS "lastMessageSenderId",
      (SELECT COUNT(*) FROM messages
       WHERE conversation_id = c.id
       AND parent_id IS NULL
       AND created_at > COALESCE(cp.last_read_at, '1970-01-01'::timestamp)
       AND sender_id != ${userId})::int AS "unreadCount"
    FROM conversation_participants cp
    JOIN conversations c ON cp.conversation_id = c.id
    LEFT JOIN conversation_participants cp2 ON c.id = cp2.conversation_id AND cp2.user_id != cp.user_id AND c.type = 'dm'
    LEFT JOIN users u ON cp2.user_id = u.id
    LEFT JOIN LATERAL (
      SELECT id, content, created_at, sender_id
      FROM messages
      WHERE conversation_id = c.id AND parent_id IS NULL
      ORDER BY created_at DESC
      LIMIT 1
    ) m ON true
    WHERE cp.user_id = ${userId}
    ORDER BY COALESCE(m.created_at, c.updated_at) DESC
  `);

  return result.rows || [];
}

export async function getAvailableChannels() {
  const session = await getSession();
  if (!session) return [];

  const channels = await db
    .select({
      id: conversations.id,
      name: conversations.name,
      createdAt: conversations.createdAt,
      participantCount: sql`(SELECT COUNT(*) FROM conversation_participants WHERE conversation_id = ${conversations.id})::int`,
    })
    .from(conversations)
    .where(eq(conversations.type, "channel"))
    .orderBy(conversations.name);

  return channels;
}

export async function createChannel(name, userIds = []) {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated" };

  const trimmed = name?.trim().toLowerCase().replace(/\s+/g, "-");
  if (!trimmed) return { success: false, error: "Channel name is required" };
  if (trimmed.length < 2) return { success: false, error: "Channel name must be at least 2 characters" };
  if (!/^[a-z0-9-]+$/.test(trimmed)) return { success: false, error: "Channel name can only contain lowercase letters, numbers, and hyphens" };

  const [existing] = await db
    .select()
    .from(conversations)
    .where(and(eq(conversations.type, "channel"), eq(conversations.name, trimmed)))
    .limit(1);

  if (existing) return { success: false, error: "Channel already exists" };

  const [conv] = await db
    .insert(conversations)
    .values({ type: "channel", name: trimmed, createdBy: session.userId })
    .returning();

  const participants = [
    { conversationId: conv.id, userId: session.userId, role: "admin" },
  ];

  if (userIds?.length) {
    const existingParticipants = await db
      .select({ userId: conversationParticipants.userId })
      .from(conversationParticipants)
      .where(
        and(
          eq(conversationParticipants.conversationId, conv.id),
          inArray(conversationParticipants.userId, userIds)
        )
      );
    const existingSet = new Set(existingParticipants.map((p) => p.userId));
    for (const uid of userIds) {
      if (uid !== session.userId && !existingSet.has(uid)) {
        participants.push({ conversationId: conv.id, userId: uid });
      }
    }
  }

  await db.insert(conversationParticipants).values(participants);

  return { success: true, conversationId: conv.id };
}

export async function getChannelMembers(channelId) {
  const session = await getSession();
  if (!session) return [];

  const [conv] = await db
    .select()
    .from(conversations)
    .where(and(eq(conversations.id, channelId), eq(conversations.type, "channel")))
    .limit(1);

  if (!conv) return [];

  const members = await db
    .select({
      userId: conversationParticipants.userId,
      role: conversationParticipants.role,
      joinedAt: conversationParticipants.joinedAt,
      name: users.name,
      email: users.email,
      userRole: users.role,
      team: users.team,
    })
    .from(conversationParticipants)
    .innerJoin(users, eq(conversationParticipants.userId, users.id))
    .where(eq(conversationParticipants.conversationId, channelId))
    .orderBy(conversationParticipants.joinedAt);

  return members;
}

export async function addChannelMembers(channelId, userIds) {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated" };

  if (!userIds?.length) return { success: false, error: "No users specified" };

  const [membership] = await db
    .select({ role: conversationParticipants.role })
    .from(conversationParticipants)
    .where(
      and(
        eq(conversationParticipants.conversationId, channelId),
        eq(conversationParticipants.userId, session.userId)
      )
    )
    .limit(1);

  if (!membership) return { success: false, error: "Not a participant" };
  if (membership.role !== "admin") return { success: false, error: "Only admins can add members" };

  const existing = await db
    .select({ userId: conversationParticipants.userId })
    .from(conversationParticipants)
    .where(
      and(
        eq(conversationParticipants.conversationId, channelId),
        inArray(conversationParticipants.userId, userIds)
      )
    );

  const existingSet = new Set(existing.map((p) => p.userId));
  const toAdd = userIds
    .filter((uid) => !existingSet.has(uid))
    .map((uid) => ({ conversationId: channelId, userId: uid }));

  if (toAdd.length === 0) return { success: true, added: 0 };

  await db.insert(conversationParticipants).values(toAdd);

  return { success: true, added: toAdd.length };
}

export async function addAllUsersToChannel(channelId) {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated" };

  const [membership] = await db
    .select({ role: conversationParticipants.role })
    .from(conversationParticipants)
    .where(
      and(
        eq(conversationParticipants.conversationId, channelId),
        eq(conversationParticipants.userId, session.userId)
      )
    )
    .limit(1);

  if (!membership) return { success: false, error: "Not a participant" };
  if (membership.role !== "admin") return { success: false, error: "Only admins can add members" };

  const allUsers = await db.select({ id: users.id }).from(users);
  const allUserIds = allUsers.map((u) => u.id);

  const existing = await db
    .select({ userId: conversationParticipants.userId })
    .from(conversationParticipants)
    .where(eq(conversationParticipants.conversationId, channelId));

  const existingSet = new Set(existing.map((p) => p.userId));
  const toAdd = allUserIds
    .filter((uid) => !existingSet.has(uid))
    .map((uid) => ({ conversationId: channelId, userId: uid }));

  if (toAdd.length === 0) return { success: true, added: 0 };

  await db.insert(conversationParticipants).values(toAdd);

  return { success: true, added: toAdd.length };
}

export async function joinChannel(channelId) {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated" };

  const [existing] = await db
    .select()
    .from(conversationParticipants)
    .where(
      and(
        eq(conversationParticipants.conversationId, channelId),
        eq(conversationParticipants.userId, session.userId)
      )
    )
    .limit(1);

  if (existing) return { success: true };

  await db.insert(conversationParticipants).values([
    { conversationId: channelId, userId: session.userId },
  ]);

  return { success: true };
}

export async function leaveChannel(channelId) {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated" };

  await db
    .delete(conversationParticipants)
    .where(
      and(
        eq(conversationParticipants.conversationId, channelId),
        eq(conversationParticipants.userId, session.userId)
      )
    );

  return { success: true };
}

export async function ensureTeamChannels() {
  const session = await getSession();
  if (!session) return;

  const userId = session.userId;
  const [user] = await db.select({ team: users.team }).from(users).where(eq(users.id, userId)).limit(1);
  if (!user) return;

  const teamSlug = user.team ? TEAM_MAP[user.team] : null;

  for (const [slug, label] of Object.entries(TEAM_CHANNELS)) {
    let [channel] = await db
      .select()
      .from(conversations)
      .where(and(eq(conversations.type, "channel"), eq(conversations.name, slug)))
      .limit(1);

    if (!channel) {
      [channel] = await db
        .insert(conversations)
        .values({ type: "channel", name: slug, createdBy: userId })
        .returning();

      await db.insert(conversationParticipants).values([
        { conversationId: channel.id, userId, role: "admin" },
      ]);

      continue;
    }

    const [membership] = await db
      .select()
      .from(conversationParticipants)
      .where(
        and(
          eq(conversationParticipants.conversationId, channel.id),
          eq(conversationParticipants.userId, userId)
        )
      )
      .limit(1);

    if (slug === "general" || slug === teamSlug) {
      const [hasAdmin] = await db
        .select()
        .from(conversationParticipants)
        .where(
          and(
            eq(conversationParticipants.conversationId, channel.id),
            eq(conversationParticipants.role, "admin")
          )
        )
        .limit(1);

      if (membership) {
        if (!hasAdmin && membership.role !== "admin") {
          await db
            .update(conversationParticipants)
            .set({ role: "admin" })
            .where(eq(conversationParticipants.id, membership.id));
        }
      } else {
        await db.insert(conversationParticipants).values([
          { conversationId: channel.id, userId, role: hasAdmin ? "member" : "admin" },
        ]);
      }
    }
  }
}

export async function getConversationInfo(conversationId) {
  const session = await getSession();
  if (!session) return null;

  const [conv] = await db
    .select({
      id: conversations.id,
      type: conversations.type,
      name: conversations.name,
    })
    .from(conversations)
    .where(eq(conversations.id, conversationId))
    .limit(1);

  if (!conv) return null;
  if (conv.type === "channel") return conv;

  const [other] = await db
    .select({ name: users.name, role: users.role, profileImageKey: users.profileImageKey })
    .from(conversationParticipants)
    .innerJoin(users, eq(conversationParticipants.userId, users.id))
    .where(
      and(
        eq(conversationParticipants.conversationId, conversationId),
        ne(conversationParticipants.userId, session.userId)
      )
    )
    .limit(1);

  return { ...conv, otherUserName: other?.name, otherUserRole: other?.role, otherUserProfileImageKey: other?.profileImageKey };
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

  const conditions = [
    eq(messages.conversationId, conversationId),
    isNull(messages.parentId),
  ];
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
      senderProfileImageKey: users.profileImageKey,
      parentId: messages.parentId,
      replyCount: sql`(SELECT COUNT(*) FROM ${messages} AS r WHERE r.parent_id = ${messages.id})::int`,
      reactions: sql`COALESCE(
        json_agg(
          json_build_object('emoji', mr.emoji, 'count', mr.cnt, 'hasReacted', mr.has_reacted)
          ORDER BY mr.emoji
        ) FILTER (WHERE mr.emoji IS NOT NULL),
        '[]'::json
      )`,
    })
    .from(messages)
    .innerJoin(users, eq(messages.senderId, users.id))
    .leftJoin(
      sql`(
        SELECT
          r.message_id,
          r.emoji,
          COUNT(*)::int AS cnt,
          bool_or(r.user_id = ${userId}) AS has_reacted
        FROM ${messageReactions} AS r
        GROUP BY r.message_id, r.emoji
      ) AS mr`,
      eq(messages.id, sql`mr.message_id`)
    )
    .where(and(...conditions))
    .groupBy(messages.id, users.name, users.profileImageKey)
    .orderBy(messages.createdAt);

  return msgs;
}

export async function sendMessage(conversationId, content, parentId, fileData) {
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

  if (parentId) {
    const [parentMsg] = await db
      .select({ conversationId: messages.conversationId })
      .from(messages)
      .where(eq(messages.id, parentId))
      .limit(1);

    if (!parentMsg || parentMsg.conversationId !== conversationId) {
      return { success: false, error: "Invalid parent message" };
    }
  }

  const insertValues = { conversationId, senderId: userId, content };
  if (parentId) insertValues.parentId = parentId;
  if (fileData?.fileKey) {
    insertValues.fileKey = fileData.fileKey;
    insertValues.fileType = fileData.fileType || null;
    insertValues.fileName = fileData.fileName || null;
  }

  const [message] = await db
    .insert(messages)
    .values(insertValues)
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

export async function getParentMessage(messageId) {
  const session = await getSession();
  if (!session) return null;

  const [msg] = await db
    .select({
      id: messages.id,
      content: messages.content,
      createdAt: messages.createdAt,
      senderId: messages.senderId,
      senderName: users.name,
      senderProfileImageKey: users.profileImageKey,
    })
    .from(messages)
    .innerJoin(users, eq(messages.senderId, users.id))
    .where(eq(messages.id, messageId))
    .limit(1);

  return msg || null;
}

export async function getThreadReplies(messageId) {
  const session = await getSession();
  if (!session) return [];

  const userId = session.userId;

  const replies = await db
    .select({
      id: messages.id,
      content: messages.content,
      createdAt: messages.createdAt,
      senderId: messages.senderId,
      senderName: users.name,
      senderProfileImageKey: users.profileImageKey,
      reactions: sql`COALESCE(
        json_agg(
          json_build_object('emoji', mr.emoji, 'count', mr.cnt, 'hasReacted', mr.has_reacted)
          ORDER BY mr.emoji
        ) FILTER (WHERE mr.emoji IS NOT NULL),
        '[]'::json
      )`,
    })
    .from(messages)
    .innerJoin(users, eq(messages.senderId, users.id))
    .leftJoin(
      sql`(
        SELECT
          r.message_id,
          r.emoji,
          COUNT(*)::int AS cnt,
          bool_or(r.user_id = ${userId}) AS has_reacted
        FROM ${messageReactions} AS r
        GROUP BY r.message_id, r.emoji
      ) AS mr`,
      eq(messages.id, sql`mr.message_id`)
    )
    .where(eq(messages.parentId, messageId))
    .groupBy(messages.id, users.name, users.profileImageKey)
    .orderBy(messages.createdAt);

  return replies;
}

export async function toggleReaction(messageId, emoji) {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated" };

  const userId = session.userId;

  const [existing] = await db
    .select()
    .from(messageReactions)
    .where(
      and(
        eq(messageReactions.messageId, messageId),
        eq(messageReactions.userId, userId),
        eq(messageReactions.emoji, emoji)
      )
    )
    .limit(1);

  if (existing) {
    await db
      .delete(messageReactions)
      .where(eq(messageReactions.id, existing.id));
  } else {
    await db
      .insert(messageReactions)
      .values({ messageId, userId, emoji });
  }

  const reactions = await db
    .select({
      emoji: messageReactions.emoji,
      count: sql`COUNT(*)::int`,
      hasReacted: sql`bool_or(${messageReactions.userId} = ${userId})`,
    })
    .from(messageReactions)
    .where(eq(messageReactions.messageId, messageId))
    .groupBy(messageReactions.emoji)
    .orderBy(messageReactions.emoji);

  return { success: true, reactions };
}

export async function editMessage(messageId, content) {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated" };

  const [msg] = await db
    .select({ senderId: messages.senderId })
    .from(messages)
    .where(eq(messages.id, messageId))
    .limit(1);

  if (!msg) return { success: false, error: "Message not found" };
  if (msg.senderId !== session.userId) return { success: false, error: "Can only edit your own messages" };

  await db
    .update(messages)
    .set({ content, editedAt: new Date() })
    .where(eq(messages.id, messageId));

  return { success: true };
}

export async function deleteMessage(messageId) {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated" };

  const [msg] = await db
    .select({ senderId: messages.senderId })
    .from(messages)
    .where(eq(messages.id, messageId))
    .limit(1);

  if (!msg) return { success: false, error: "Message not found" };
  if (msg.senderId !== session.userId) return { success: false, error: "Can only delete your own messages" };

  await db
    .update(messages)
    .set({ deletedAt: new Date(), content: "" })
    .where(eq(messages.id, messageId));

  return { success: true };
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
