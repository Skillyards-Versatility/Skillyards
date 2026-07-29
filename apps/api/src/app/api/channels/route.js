import { db } from "@repo/db";
import { validateCreateChannel } from "@/modules/chat/chat.schema";
import { listMyChannels, createChannel } from "@/modules/chat/channels.service";
import { createProtectedRoute } from "@/lib/middleware";

async function getHandler(req, { ctx }) {
  const channels = await listMyChannels(db, ctx.session.userId);
  return Response.json(channels);
}

async function postHandler(req, { ctx }) {
  const body = await req.json();
  const result = validateCreateChannel(body);
  if (!result.success) {
    ctx.warn("VALIDATION_FAILURE", { errors: result.error.flatten() });
    return Response.json({ error: result.error.flatten() }, { status: 400 });
  }
  try {
    const channel = await createChannel(db, result.data, ctx.session.userId);
    ctx.log("CHANNEL_CREATED", { channelId: channel.id, name: channel.name });
    return Response.json(channel, { status: 201 });
  } catch (err) {
    if (err.message === "CHANNEL_NAME_TAKEN") {
      return Response.json({ error: "Channel name already taken" }, { status: 409 });
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

export const POST = createProtectedRoute(postHandler, {
  policy: (session) => ({
    authorized: !!session?.userId,
    reason: session?.userId ? "Authenticated" : "Login required",
  }),
});
