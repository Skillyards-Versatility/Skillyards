import { db, counsellingSessions } from "@repo/db";
import { eq } from "drizzle-orm";
import { createProtectedRoute } from "@/lib/middleware";

async function putHandler(req, { ctx, params }) {
  try {
    const { id } = params;

    if (ctx.session.role !== "ADMIN") {
      return Response.json({ success: false, message: "Admin access required to edit sessions" }, { status: 403 });
    }

    const [existing] = await db
      .select({ id: counsellingSessions.id })
      .from(counsellingSessions)
      .where(eq(counsellingSessions.id, id))
      .limit(1);

    if (!existing) {
      return Response.json({ success: false, message: "Session not found" }, { status: 404 });
    }

    const { studentName, phone, ageOrClass, courseInterest, source, outcome, notes, sessionDate, nextFollowUpDate, counselorId, imageKey } = await req.json();

    if (!studentName || !sessionDate) {
      return Response.json(
        { success: false, message: "studentName and sessionDate are required" },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(counsellingSessions)
      .set({
        studentName,
        phone: phone || null,
        ageOrClass: ageOrClass || null,
        courseInterest: courseInterest || null,
        source: source || "walk_in",
        outcome: outcome || "follow_up",
        notes: notes || null,
        sessionDate,
        nextFollowUpDate: nextFollowUpDate || null,
        counselorId: counselorId || existing.counselorId,
        imageKey: imageKey ?? undefined,
      })
      .where(eq(counsellingSessions.id, id))
      .returning();

    ctx.log("COUNSELLING_SESSION_UPDATED", { sessionId: id });

    return Response.json({ success: true, session: updated[0] });
  } catch (error) {
    ctx.error("COUNSELLING_SESSION_UPDATE_FAILED", { error: error.message });
    return Response.json({ success: false, message: "Failed to update session" }, { status: 500 });
  }
}

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

export const PUT = createProtectedRoute(putHandler, {
  isPublic: false,
  policy: (session) => ({
    authorized: !!session?.userId,
    reason: session?.userId ? "Authenticated" : "Login required",
  }),
});
