import { db } from "@repo/db";
import { getChannelMessages } from "@/modules/chat/messages.service";
import { isMember } from "@/modules/chat/channels.service";
import { createProtectedRoute } from "@/lib/middleware";

async function getHandler(req, { ctx, context }) {
  const { id } = await context.params;
  const member = await isMember(db, id, ctx.session.userId);
  if (!member) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "50", 10);
  const before = searchParams.get("before") || undefined;
  const messages = await getChannelMessages(db, id, { limit, before });
  return Response.json(messages);
}

export const GET = createProtectedRoute(getHandler, {
  policy: (session) => ({
    authorized: !!session?.userId,
    reason: session?.userId ? "Authenticated" : "Login required",
  }),
});
