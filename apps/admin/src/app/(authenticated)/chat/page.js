import { ChatPageClient } from "@/components/chat/ChatPageClient";
import { getSession } from "@/lib/auth";
import { getUsers } from "@/actions/users";
import { getMyConversations } from "@/actions/chat";
import { getSettings } from "@/actions/settings";
import { redirect } from "next/navigation";

export default async function ChatPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const settings = await getSettings();
  if (settings.chat_feature === false) redirect("/dashboard");

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
