import { ChatThreadClient } from "@/components/chat/ChatThreadClient";
import { getSession } from "@/lib/auth";
import { getMessages, getConversationInfo } from "@/actions/chat";
import { redirect } from "next/navigation";

export default async function ChatThreadPage({ params }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const messages = await getMessages(id);
  const info = await getConversationInfo(id);

  if (!info) {
    redirect("/chat");
  }

  const convInfo = {
    conversationId: id,
    type: info.type,
    name: info.type === "channel" ? info.name : null,
    otherUserName: info.type === "dm" ? info.otherUserName : null,
    otherUserRole: info.type === "dm" ? info.otherUserRole : null,
  };

  return (
    <ChatThreadClient
      conversationId={id}
      userId={session.userId}
      convInfo={convInfo}
      initialMessages={messages}
    />
  );
}
