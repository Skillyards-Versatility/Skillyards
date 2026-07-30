import { ChatThreadClient } from "@/components/chat/ChatThreadClient";
import { getSession } from "@/lib/auth";
import { getMessages } from "@/actions/chat";
import { redirect } from "next/navigation";
import { db, users, conversationParticipants } from "@repo/db";
import { eq, and, ne } from "drizzle-orm";

export default async function ChatThreadPage({ params }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const messages = await getMessages(id);

  const [otherParticipant] = await db
    .select({ name: users.name, role: users.role })
    .from(conversationParticipants)
    .innerJoin(users, eq(conversationParticipants.userId, users.id))
    .where(
      and(
        eq(conversationParticipants.conversationId, id),
        ne(conversationParticipants.userId, session.userId)
      )
    )
    .limit(1);

  return (
    <ChatThreadClient
      conversationId={id}
      userId={session.userId}
      otherUserName={otherParticipant?.name || "Unknown"}
      initialMessages={messages}
    />
  );
}
