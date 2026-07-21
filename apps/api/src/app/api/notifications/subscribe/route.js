import { db, users } from "@repo/db";
import { eq } from "drizzle-orm";
import { createProtectedRoute } from "@/lib/middleware";

async function postHandler(req, { ctx }) {
  try {
    const { subscription } = await req.json();

    if (!subscription) {
      return Response.json({ success: false, message: "Subscription is required" }, { status: 400 });
    }

    await db.update(users)
      .set({ pushSubscription: subscription })
      .where(eq(users.id, ctx.session.userId));

    return Response.json({ success: true, message: "Subscription saved successfully" });
  } catch (error) {
    ctx.error("PUSH_SUBSCRIBE_FAILED", { error: error.message });
    return Response.json({ success: false, message: "Failed to save subscription" }, { status: 500 });
  }
}

export const POST = createProtectedRoute(postHandler, {
  isPublic: false,
});
