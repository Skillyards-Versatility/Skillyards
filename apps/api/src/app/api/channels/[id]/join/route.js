import { db } from "@repo/db";
import { joinChannel } from "@/modules/chat/channels.service";
import { createProtectedRoute } from "@/lib/middleware";

async function postHandler(req, { ctx, context }) {
  const { id } = await context.params;
  try {
    const result = await joinChannel(db, id, ctx.session.userId);
    return Response.json(result);
  } catch (err) {
    if (err.message === "CHANNEL_NOT_FOUND") {
      return Response.json({ error: "Channel not found" }, { status: 404 });
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
