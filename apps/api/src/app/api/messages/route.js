import { db } from "@repo/db";
import { validateSendMessage } from "@/modules/chat/chat.schema";
import { sendMessage } from "@/modules/chat/messages.service";
import { createProtectedRoute } from "@/lib/middleware";

async function postHandler(req, { ctx }) {
  const body = await req.json();
  const result = validateSendMessage(body);
  if (!result.success) {
    ctx.warn("VALIDATION_FAILURE", { errors: result.error.flatten() });
    return Response.json({ error: result.error.flatten() }, { status: 400 });
  }
  if (!result.data.channelId && !result.data.conversationId) {
    return Response.json({ error: "Either channelId or conversationId is required" }, { status: 400 });
  }
  if (result.data.channelId && result.data.conversationId) {
    return Response.json({ error: "Provide either channelId or conversationId, not both" }, { status: 400 });
  }
  try {
    const message = await sendMessage(db, result.data, ctx.session.userId);
    ctx.log("MESSAGE_SENT", { messageId: message.id, channelId: message.channelId });
    return Response.json(message, { status: 201 });
  } catch (err) {
    if (err.message === "NOT_CHANNEL_MEMBER") {
      return Response.json({ error: "You are not a member of this channel" }, { status: 403 });
    }
    throw err;
  }
}

export const POST = createProtectedRoute(postHandler, {
  policy: (session) => ({
    authorized: !!session?.userId,
    reason: session?.userId ? "Authenticated" : "Login required",
  }),
});
