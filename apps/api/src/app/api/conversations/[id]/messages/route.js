import { db } from "@repo/db";
import { getConversationMessages } from "@/modules/chat/messages.service";
import { getConversation } from "@/modules/chat/conversations.service";
import { createProtectedRoute } from "@/lib/middleware";

async function getHandler(req, { ctx, context }) {
  const { id } = await context.params;
  const conv = await getConversation(db, id);
  if (!conv) {
    return Response.json({ error: "Conversation not found" }, { status: 404 });
  }
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "50", 10);
  const before = searchParams.get("before") || undefined;
  const messages = await getConversationMessages(db, id, { limit, before });
  return Response.json(messages);
}

export const GET = createProtectedRoute(getHandler, {
  policy: (session) => ({
    authorized: !!session?.userId,
    reason: session?.userId ? "Authenticated" : "Login required",
  }),
});
