import { eq, desc, asc, and, or, inArray, sql } from "drizzle-orm";
import { conversations, conversationParticipants, users } from "@repo/db";

export async function createConversationRecord(db, data) {
  const inserted = await db
    .insert(conversations)
    .values({
      type: data.type || "direct",
      name: data.name || null,
      createdBy: data.createdBy,
    })
    .returning();
  return inserted[0];
}

export async function addParticipants(db, conversationId, userIds) {
  if (userIds.length === 0) return [];
  return db
    .insert(conversationParticipants)
    .values(userIds.map((userId) => ({ conversationId, userId, role: "member" })))
    .returning();
}

export async function getConversationById(db, conversationId) {
  const res = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, conversationId))
    .limit(1);
  return res[0] || null;
}

export async function getUserConversations(db, userId) {
  const convParticipantRows = await db
    .select({
      conversationId: conversationParticipants.conversationId,
    })
    .from(conversationParticipants)
    .where(eq(conversationParticipants.userId, userId));

  const convIds = convParticipantRows
    .map((r) => r.conversationId)
    .filter(Boolean);

  if (convIds.length === 0) return [];

  const convs = await db
    .select()
    .from(conversations)
    .where(inArray(conversations.id, convIds))
    .orderBy(desc(conversations.createdAt));

  const participantUserIds = await db
    .select({
      conversationId: conversationParticipants.conversationId,
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      profileImageKey: users.profileImageKey,
      statusEmoji: users.statusEmoji,
      lastSeenAt: users.lastSeenAt,
    })
    .from(conversationParticipants)
    .innerJoin(users, eq(users.id, conversationParticipants.userId))
    .where(inArray(conversationParticipants.conversationId, convIds));

  const participantsByConv = {};
  for (const p of participantUserIds) {
    if (!participantsByConv[p.conversationId]) participantsByConv[p.conversationId] = [];
    participantsByConv[p.conversationId].push(p);
  }

  return convs.map((c) => ({
    ...c,
    participants: participantsByConv[c.id] || [],
  }));
}

export async function getConversationParticipants(db, conversationId) {
  return db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      profileImageKey: users.profileImageKey,
      statusEmoji: users.statusEmoji,
      lastSeenAt: users.lastSeenAt,
    })
    .from(conversationParticipants)
    .innerJoin(users, eq(users.id, conversationParticipants.userId))
    .where(eq(conversationParticipants.conversationId, conversationId));
}

export async function findDirectConversation(db, userId1, userId2) {
  const userIds = [userId1, userId2].sort();
  const rows = await db
    .select({ conversationId: conversationParticipants.conversationId })
    .from(conversationParticipants)
    .where(
      inArray(conversationParticipants.userId, userIds)
    );

  const convCounts = {};
  for (const row of rows) {
    if (!row.conversationId) continue;
    convCounts[row.conversationId] = (convCounts[row.conversationId] || 0) + 1;
  }

  for (const [convId, count] of Object.entries(convCounts)) {
    if (count === 2) {
      const conv = await getConversationById(db, convId);
      if (conv && conv.type === "direct") return conv;
    }
  }
  return null;
}
