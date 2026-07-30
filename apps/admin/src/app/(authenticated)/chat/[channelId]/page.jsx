import { db } from "@repo/db";
import { channels, messages, conversationParticipants, users, messageReactions } from "@repo/db";
import { eq, and, isNull, desc, asc, inArray, sql } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { ChatClient } from "./ChatClient";

export default async function ChannelPage({ params }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { channelId } = await params;

  const [channel] = await db
    .select()
    .from(channels)
    .where(and(eq(channels.id, channelId), isNull(channels.archivedAt)))
    .limit(1);

  if (!channel) notFound();

  const isMember = await db
    .select({ id: conversationParticipants.id })
    .from(conversationParticipants)
    .where(
      and(
        eq(conversationParticipants.channelId, channelId),
        eq(conversationParticipants.userId, session.userId)
      )
    )
    .limit(1);

  const rawMessages = await db
    .select()
    .from(messages)
    .where(
      eq(messages.channelId, channelId)
    )
    .orderBy(desc(messages.createdAt))
    .limit(100);

  const messageIds = rawMessages.map((m) => m.id);
  let reactionsMap = {};
  if (messageIds.length > 0) {
    const allReactions = await db
      .select()
      .from(messageReactions)
      .where(inArray(messageReactions.messageId, messageIds));
    for (const r of allReactions) {
      if (!reactionsMap[r.messageId]) reactionsMap[r.messageId] = [];
      reactionsMap[r.messageId].push(r);
    }
  }

  const senderIds = [...new Set(rawMessages.map((m) => m.senderId))];
  const senderRows = await db
    .select({ id: users.id, name: users.name, role: users.role, profileImageKey: users.profileImageKey })
    .from(users)
    .where(inArray(users.id, senderIds));
  const senderMap = {};
  for (const s of senderRows) senderMap[s.id] = s;

  const messagesWithSenders = rawMessages.reverse().map((m) => ({
    ...m,
    sender: senderMap[m.senderId] || { id: m.senderId, name: "Unknown" },
    reactions: reactionsMap[m.id] || [],
    createdAt: m.createdAt?.toISOString?.() || m.createdAt,
    editedAt: m.editedAt?.toISOString?.() || null,
    deletedAt: m.deletedAt?.toISOString?.() || null,
  }));

  const allUsers = await db
    .select({ id: users.id, name: users.name, email: users.email, role: users.role })
    .from(users);

  const memberCount = await db
    .select({ count: sql`COUNT(*)::int` })
    .from(conversationParticipants)
    .where(eq(conversationParticipants.channelId, channelId));

  return (
    <ChatClient
      channel={{ ...channel, createdAt: channel.createdAt?.toISOString?.() || channel.createdAt }}
      currentUser={{ id: session.userId, name: session.name, role: session.role }}
      initialMessages={messagesWithSenders}
      allUsers={allUsers.map((u) => ({ ...u }))}
      isMember={!!isMember[0]}
      memberCount={memberCount[0]?.count || 0}
    />
  );
}
