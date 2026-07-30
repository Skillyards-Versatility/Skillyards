import { eq, desc, asc, and, sql, inArray } from "drizzle-orm";
import { conversations, conversationParticipants, users } from "@repo/db";

export async function getChannels(db) {
  return db
    .select({
      id: conversations.id,
      name: conversations.name,
      createdAt: conversations.createdAt,
      createdBy: conversations.createdBy,
    })
    .from(conversations)
    .where(eq(conversations.type, "channel"))
    .orderBy(asc(conversations.name));
}

export async function getChannelById(db, channelId) {
  const res = await db
    .select({
      id: conversations.id,
      name: conversations.name,
      createdAt: conversations.createdAt,
      createdBy: conversations.createdBy,
    })
    .from(conversations)
    .where(and(eq(conversations.id, channelId), eq(conversations.type, "channel")))
    .limit(1);
  return res[0] || null;
}

export async function getChannelByName(db, name) {
  const res = await db
    .select()
    .from(conversations)
    .where(and(eq(conversations.name, name), eq(conversations.type, "channel")))
    .limit(1);
  return res[0] || null;
}

export async function createChannelRecord(db, data) {
  const inserted = await db
    .insert(conversations)
    .values({
      name: data.name,
      type: "channel",
      createdBy: data.createdBy,
    })
    .returning();
  return inserted[0];
}

export async function updateChannelRecord(db, channelId, data) {
  const updated = await db
    .update(conversations)
    .set(data)
    .where(eq(conversations.id, channelId))
    .returning();
  return updated[0] || null;
}

export async function archiveChannel(db, channelId) {
  const updated = await db
    .update(conversations)
    .set({ updatedAt: new Date() })
    .where(eq(conversations.id, channelId))
    .returning();
  return updated[0] || null;
}

export async function getChannelMembers(db, channelId) {
  return db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      team: users.team,
      profileImageKey: users.profileImageKey,
      statusEmoji: users.statusEmoji,
      statusText: users.statusText,
      lastSeenAt: users.lastSeenAt,
      joinedAt: conversationParticipants.joinedAt,
    })
    .from(conversationParticipants)
    .innerJoin(users, eq(users.id, conversationParticipants.userId))
    .where(eq(conversationParticipants.conversationId, channelId))
    .orderBy(asc(users.name));
}

export async function isChannelMember(db, channelId, userId) {
  const res = await db
    .select({ id: conversationParticipants.id })
    .from(conversationParticipants)
    .where(
      and(
        eq(conversationParticipants.conversationId, channelId),
        eq(conversationParticipants.userId, userId)
      )
    )
    .limit(1);
  return !!res[0];
}

export async function addChannelMember(db, channelId, userId) {
  const inserted = await db
    .insert(conversationParticipants)
    .values({ conversationId: channelId, userId, role: "member" })
    .returning();
  return inserted[0];
}

export async function removeChannelMember(db, channelId, userId) {
  await db
    .delete(conversationParticipants)
    .where(
      and(
        eq(conversationParticipants.conversationId, channelId),
        eq(conversationParticipants.userId, userId)
      )
    );
}

export async function getUserChannelIds(db, userId) {
  const rows = await db
    .select({ channelId: conversationParticipants.conversationId })
    .from(conversationParticipants)
    .where(eq(conversationParticipants.userId, userId));
  return rows.map((r) => r.channelId).filter(Boolean);
}

export async function getChannelsForUser(db, userId) {
  const userChannelIds = await getUserChannelIds(db, userId);
  if (userChannelIds.length === 0) return [];
  return db
    .select({
      id: conversations.id,
      name: conversations.name,
      createdAt: conversations.createdAt,
      createdBy: conversations.createdBy,
    })
    .from(conversations)
    .where(and(inArray(conversations.id, userChannelIds), eq(conversations.type, "channel")))
    .orderBy(asc(conversations.name));
}
