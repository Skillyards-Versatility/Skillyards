import { redirect } from "next/navigation";
import { db } from "@repo/db";
import { getSession } from "@/lib/auth";
import { channels, conversationParticipants, users } from "@repo/db";
import { eq, isNull, inArray } from "drizzle-orm";

export default async function ChatPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const userChannelRows = await db
    .select({ channelId: conversationParticipants.channelId })
    .from(conversationParticipants)
    .where(eq(conversationParticipants.userId, session.userId));

  const channelIds = userChannelRows.map((r) => r.channelId).filter(Boolean);

  let firstChannel = null;
  if (channelIds.length > 0) {
    const rows = await db
      .select({ id: channels.id })
      .from(channels)
      .where(inArray(channels.id, channelIds))
      .limit(1);
    firstChannel = rows[0];
  }

  if (firstChannel) {
    redirect(`/chat/${firstChannel.id}`);
  }

  return (
    <div className="flex items-center justify-center h-full text-muted-foreground">
      <p className="text-sm">No channels yet. Create one to get started.</p>
    </div>
  );
}
