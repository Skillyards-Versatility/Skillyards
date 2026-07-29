import { db } from "@repo/db";
import { validateCreateConversation } from "@/modules/chat/chat.schema";
import { listConversations, createDirectConversation, createGroupConversation } from "@/modules/chat/conversations.service";
import { createProtectedRoute } from "@/lib/middleware";

async function getHandler(req, { ctx }) {
  const convs = await listConversations(db, ctx.session.userId);
  return Response.json(convs);
}

async function postHandler(req, { ctx }) {
  const body = await req.json();
  const result = validateCreateConversation(body);
  if (!result.success) {
    return Response.json({ error: result.error.flatten() }, { status: 400 });
  }
  const data = result.data;
  if (data.type === "direct" && data.participantIds.length === 1) {
    const conv = await createDirectConversation(db, ctx.session.userId, data.participantIds[0]);
    return Response.json(conv, { status: 201 });
  }
  const conv = await createGroupConversation(db, data, ctx.session.userId);
  return Response.json(conv, { status: 201 });
}

export const GET = createProtectedRoute(getHandler, {
  policy: (session) => ({
    authorized: !!session?.userId,
    reason: session?.userId ? "Authenticated" : "Login required",
  }),
});

export const POST = createProtectedRoute(postHandler, {
  policy: (session) => ({
    authorized: !!session?.userId,
    reason: session?.userId ? "Authenticated" : "Login required",
  }),
});
