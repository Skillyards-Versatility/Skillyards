import { db } from "@repo/db";
import { validateAddReaction } from "@/modules/chat/chat.schema";
import { addReaction, removeReaction, getReactions } from "@/modules/chat/reactions.service";
import { createProtectedRoute } from "@/lib/middleware";

async function getHandler(req, { ctx, context }) {
  const { id } = await context.params;
  const reactions = await getReactions(db, id);
  return Response.json(reactions);
}

async function postHandler(req, { ctx, context }) {
  const { id } = await context.params;
  const body = await req.json();
  const result = validateAddReaction(body);
  if (!result.success) {
    return Response.json({ error: result.error.flatten() }, { status: 400 });
  }
  try {
    const reaction = await addReaction(db, id, ctx.session.userId, result.data.emoji);
    if (!reaction) {
      return Response.json({ error: "Reaction already exists" }, { status: 409 });
    }
    return Response.json(reaction, { status: 201 });
  } catch (err) {
    if (err.message === "MESSAGE_NOT_FOUND") {
      return Response.json({ error: "Message not found" }, { status: 404 });
    }
    throw err;
  }
}

async function deleteHandler(req, { ctx, context }) {
  const { id } = await context.params;
  const body = await req.json();
  const { emoji } = body;
  if (!emoji) {
    return Response.json({ error: "Emoji is required" }, { status: 400 });
  }
  await removeReaction(db, id, ctx.session.userId, emoji);
  return Response.json({ success: true });
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

export const DELETE = createProtectedRoute(deleteHandler, {
  policy: (session) => ({
    authorized: !!session?.userId,
    reason: session?.userId ? "Authenticated" : "Login required",
  }),
});
