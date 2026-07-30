import { ChatPageClient } from "@/components/chat/ChatPageClient";
import { getSession } from "@/lib/auth";
import { getUsers } from "@/actions/users";
import { getMyConversations } from "@/actions/chat";
import { redirect } from "next/navigation";

export default async function ChatPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const conversations = await getMyConversations();
  const allUsers = await getUsers();

  return (
    <ChatPageClient
      userId={session.userId}
      conversations={conversations}
      users={allUsers}
    />
  );
}
