import { db } from "@repo/db";
import { validateUpdateChannel } from "@/modules/chat/chat.schema";
import { getChannel, updateChannel, archiveChannel, isMember } from "@/modules/chat/channels.service";
import { createProtectedRoute } from "@/lib/middleware";

async function getHandler(req, { ctx, context }) {
  const { id } = await context.params;
  const channel = await getChannel(db, id);
  if (!channel) {
    return Response.json({ error: "Channel not found" }, { status: 404 });
  }
  const member = await isMember(db, id, ctx.session.userId);
  if (!member) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
  return Response.json(channel);
}

async function putHandler(req, { ctx, context }) {
  const { id } = await context.params;
  const member = await isMember(db, id, ctx.session.userId);
  if (!member) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json();
  const result = validateUpdateChannel(body);
  if (!result.success) {
    return Response.json({ error: result.error.flatten() }, { status: 400 });
  }
  try {
    const updated = await updateChannel(db, id, result.data);
    return Response.json(updated);
  } catch (err) {
    if (err.message === "CHANNEL_NOT_FOUND") {
      return Response.json({ error: "Channel not found" }, { status: 404 });
    }
    throw err;
  }
}

async function deleteHandler(req, { ctx, context }) {
  const { id } = await context.params;
  const channel = await getChannel(db, id);
  if (!channel) {
    return Response.json({ error: "Channel not found" }, { status: 404 });
  }
  if (channel.createdBy !== ctx.session.userId) {
    return Response.json({ error: "Only channel creator can archive" }, { status: 403 });
  }
  try {
    const archived = await archiveChannel(db, id);
    return Response.json(archived);
  } catch (err) {
    if (err.message === "CHANNEL_NOT_FOUND") {
      return Response.json({ error: "Channel not found" }, { status: 404 });
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
