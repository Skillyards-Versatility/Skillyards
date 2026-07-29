import { eq, desc, asc, and, isNull, sql, inArray } from "drizzle-orm";
import { channels, conversationParticipants, users, messages } from "@repo/db";

export async function getChannels(db) {
  return db
    .select({
      id: channels.id,
      name: channels.name,
      description: channels.description,
      type: channels.type,
      team: channels.team,
      createdAt: channels.createdAt,
      archivedAt: channels.archivedAt,
      createdBy: channels.createdBy,
    })
    .from(channels)
    .where(isNull(channels.archivedAt))
    .orderBy(asc(channels.name));
}

export async function getChannelById(db, channelId) {
  const res = await db
    .select({
      id: channels.id,
      name: channels.name,
      description: channels.description,
      type: channels.type,
      team: channels.team,
      createdAt: channels.createdAt,
      archivedAt: channels.archivedAt,
      createdBy: channels.createdBy,
    })
    .from(channels)
    .where(and(eq(channels.id, channelId), isNull(channels.archivedAt)))
    .limit(1);
  return res[0] || null;
}

export async function getChannelByName(db, name) {
  const res = await db
    .select()
    .from(channels)
    .where(eq(channels.name, name))
    .limit(1);
  return res[0] || null;
}

export async function createChannelRecord(db, data) {
  const inserted = await db
    .insert(channels)
    .values({
      name: data.name,
      description: data.description || null,
      type: data.type || "public",
      team: data.team || null,
      createdBy: data.createdBy,
    })
    .returning();
  return inserted[0];
}

export async function updateChannelRecord(db, channelId, data) {
  const updated = await db
    .update(channels)
    .set(data)
    .where(eq(channels.id, channelId))
    .returning();
  return updated[0] || null;
}

export async function archiveChannel(db, channelId) {
  const updated = await db
    .update(channels)
    .set({ archivedAt: new Date() })
    .where(eq(channels.id, channelId))
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
    .where(eq(conversationParticipants.channelId, channelId))
    .orderBy(asc(users.name));
}

export async function isChannelMember(db, channelId, userId) {
  const res = await db
    .select({ id: conversationParticipants.id })
    .from(conversationParticipants)
    .where(
      and(
        eq(conversationParticipants.channelId, channelId),
        eq(conversationParticipants.userId, userId)
      )
    )
    .limit(1);
  return !!res[0];
}

export async function addChannelMember(db, channelId, userId) {
  const inserted = await db
    .insert(conversationParticipants)
    .values({ channelId, userId, role: "member" })
    .returning();
  return inserted[0];
}

export async function removeChannelMember(db, channelId, userId) {
  await db
    .delete(conversationParticipants)
    .where(
      and(
        eq(conversationParticipants.channelId, channelId),
        eq(conversationParticipants.userId, userId)
      )
    );
}

export async function getUserChannelIds(db, userId) {
  const rows = await db
    .select({ channelId: conversationParticipants.channelId })
    .from(conversationParticipants)
    .where(eq(conversationParticipants.userId, userId));
  return rows.map((r) => r.channelId).filter(Boolean);
}

export async function getChannelsForUser(db, userId) {
  const userChannelIds = await getUserChannelIds(db, userId);
  if (userChannelIds.length === 0) return [];
  return db
    .select({
      id: channels.id,
      name: channels.name,
      description: channels.description,
      type: channels.type,
      team: channels.team,
      createdAt: channels.createdAt,
      archivedAt: channels.archivedAt,
    })
    .from(channels)
    .where(and(inArray(channels.id, userChannelIds), isNull(channels.archivedAt)))
    .orderBy(asc(channels.name));
}
