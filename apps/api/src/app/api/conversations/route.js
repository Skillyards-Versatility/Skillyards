import { db } from "@repo/db";
import { validateCreateConversation } from "@/modules/chat/chat.schema";
import { listConversations, createDirectConversation, createGroupConversation } from "@/modules/chat/conversations.service";
import { createProtectedRoute } from "@/lib/middleware";

async function getHandler(req, { ctx }) {
  try {
    const userId = "cm0h3qfbb000213er9y79m6l1"; // fake id
    const convs = await listConversations(db, userId);
    return Response.json(convs);
  } catch (error) {
    console.error("Error in get conversations handler:", error);
    require("fs").writeFileSync("/tmp/error.log", error.stack);
    return Response.json({ error: error.message }, { status: 500 });
  }
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
    authorized: true,
    reason: "Authenticated",
  }),
});

export const POST = createProtectedRoute(postHandler, {
  policy: (session) => ({
    authorized: !!session?.userId,
    reason: session?.userId ? "Authenticated" : "Login required",
  }),
});
