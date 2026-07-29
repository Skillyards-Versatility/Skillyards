import { db, counsellingSessions } from "@repo/db";
import { eq } from "drizzle-orm";
import { createProtectedRoute } from "@/lib/middleware";

async function deleteHandler(req, { ctx, params }) {
  try {
    const { id } = params;

    const [existing] = await db
      .select({ id: counsellingSessions.id, counselorId: counsellingSessions.counselorId })
      .from(counsellingSessions)
      .where(eq(counsellingSessions.id, id))
      .limit(1);

    if (!existing) {
      return Response.json({ success: false, message: "Session not found" }, { status: 404 });
    }

    if (ctx.session.role !== "ADMIN" && existing.counselorId !== ctx.session.userId) {
      return Response.json({ success: false, message: "Cannot delete another counselor's session" }, { status: 403 });
    }

    await db.delete(counsellingSessions).where(eq(counsellingSessions.id, id));

    ctx.log("COUNSELLING_SESSION_DELETED", { sessionId: id });

    return Response.json({ success: true, message: "Session deleted" });
  } catch (error) {
    ctx.error("COUNSELLING_SESSION_DELETE_FAILED", { error: error.message });
    return Response.json({ success: false, message: "Failed to delete session" }, { status: 500 });
  }
}

export const DELETE = createProtectedRoute(deleteHandler, {
  isPublic: false,
  policy: (session) => ({
    authorized: !!session?.userId,
    reason: session?.userId ? "Authenticated" : "Login required",
  }),
});
