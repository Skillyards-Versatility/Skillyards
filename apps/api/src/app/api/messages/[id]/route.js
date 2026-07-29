import { db } from "@repo/db";
import { validateEditMessage } from "@/modules/chat/chat.schema";
import { editMessage, deleteMessage, getMessage } from "@/modules/chat/messages.service";
import { createProtectedRoute } from "@/lib/middleware";

async function getHandler(req, { ctx, context }) {
  const { id } = await context.params;
  const message = await getMessage(db, id);
  if (!message) {
    return Response.json({ error: "Message not found" }, { status: 404 });
  }
  return Response.json(message);
}

async function putHandler(req, { ctx, context }) {
  const { id } = await context.params;
  const body = await req.json();
  const result = validateEditMessage(body);
  if (!result.success) {
    return Response.json({ error: result.error.flatten() }, { status: 400 });
  }
  try {
    const updated = await editMessage(db, id, result.data.content, ctx.session.userId);
    return Response.json(updated);
  } catch (err) {
    if (err.message === "MESSAGE_NOT_FOUND") {
      return Response.json({ error: "Message not found" }, { status: 404 });
    }
    if (err.message === "NOT_MESSAGE_AUTHOR") {
      return Response.json({ error: "You can only edit your own messages" }, { status: 403 });
    }
    throw err;
  }
}

async function deleteHandler(req, { ctx, context }) {
  const { id } = await context.params;
  try {
    const deleted = await deleteMessage(db, id, ctx.session.userId);
    return Response.json(deleted);
  } catch (err) {
    if (err.message === "MESSAGE_NOT_FOUND") {
      return Response.json({ error: "Message not found" }, { status: 404 });
    }
    if (err.message === "NOT_MESSAGE_AUTHOR") {
      return Response.json({ error: "You can only delete your own messages" }, { status: 403 });
    }
    throw err;
  }
}

export const GET = createProtectedRoute(getHandler, {
  policy: (session) => ({
    authorized: !!session?.userId,
    reason: session?.userId ? "Authenticated" : "Login required",
  }),
});

export const PUT = createProtectedRoute(putHandler, {
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
