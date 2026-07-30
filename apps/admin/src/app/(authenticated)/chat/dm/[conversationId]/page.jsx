import { db } from "@repo/db";
import { conversations, messages, users, messageReactions } from "@repo/db";
import { eq, and, isNull, desc, inArray } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { DmClient } from "./DmClient";

export default async function DmPage({ params }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { conversationId } = await params;

  const [conv] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, conversationId))
    .limit(1);

  if (!conv) notFound();

  const rawMessages = await db
    .select()
    .from(messages)
    .where(
      eq(messages.conversationId, conversationId)
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
    .select({ id: users.id, name: users.name })
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

  return (
    <DmClient
      conversation={{ ...conv, createdAt: conv.createdAt?.toISOString?.() || conv.createdAt }}
      currentUser={{ id: session.userId, name: session.name, role: session.role }}
      initialMessages={messagesWithSenders}
    />
  );
}
