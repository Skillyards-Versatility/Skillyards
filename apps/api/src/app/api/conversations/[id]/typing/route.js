import { db, conversationParticipants } from "@repo/db";
import { eq, and } from "drizzle-orm";
import { recordTyping } from "@/modules/chat/typing.store";
import { createProtectedRoute } from "@/lib/middleware";

async function postHandler(req, { ctx, context }) {
  const { id } = await context.params;
  const userId = ctx.session?.userId;

  const [participation] = await db
    .select()
    .from(conversationParticipants)
    .where(and(eq(conversationParticipants.conversationId, id), eq(conversationParticipants.userId, userId)))
    .limit(1);

  if (!participation) {
    return Response.json({ error: "Not a participant" }, { status: 403 });
  }

  recordTyping(id, userId);
  return Response.json({ success: true });
}

export const POST = createProtectedRoute(postHandler, {
  policy: (session) => ({
    authorized: !!session?.userId,
    reason: session?.userId ? "Authenticated" : "Login required",
  }),
});
