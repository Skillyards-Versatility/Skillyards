import { db, counsellingSessions } from "@repo/db";
import { eq } from "drizzle-orm";
import { createProtectedRoute } from "@/lib/middleware";
import { deleteObjectFromR2 } from "@/integrations/r2/r2.client";

async function putHandler(req, { ctx, context }) {
  try {
    const { id } = await context.params;

    if (ctx.session.role !== "ADMIN") {
      return Response.json({ success: false, message: "Admin access required to edit sessions" }, { status: 403 });
    }

    const [existing] = await db
      .select({ id: counsellingSessions.id, imageKey: counsellingSessions.imageKey, counselorId: counsellingSessions.counselorId, bookedById: counsellingSessions.bookedById })
      .from(counsellingSessions)
      .where(eq(counsellingSessions.id, id))
      .limit(1);

    if (!existing) {
      return Response.json({ success: false, message: "Session not found" }, { status: 404 });
    }

    const { studentName, phone, ageOrClass, courseInterest, source, outcome, notes, sessionDate, nextFollowUpDate, counselorId, bookedById, imageKey } = await req.json();

    if (!studentName || !sessionDate) {
      return Response.json(
        { success: false, message: "studentName and sessionDate are required" },
        { status: 400 }
      );
    }

    const oldImageKey = existing.imageKey;
    const finalImageKey = imageKey === undefined ? existing.imageKey : (imageKey || null);

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
        nextFollowUpDate: outcome && outcome !== "follow_up" ? null : (nextFollowUpDate || null),
        counselorId: counselorId || existing.counselorId,
        bookedById: bookedById === undefined ? existing.bookedById : (bookedById || null),
        imageKey: finalImageKey,
      })
      .where(eq(counsellingSessions.id, id))
      .returning();

    if (oldImageKey && finalImageKey !== oldImageKey) {
      deleteObjectFromR2({ key: oldImageKey }).catch(() => {});
    }

    ctx.log("COUNSELLING_SESSION_UPDATED", { sessionId: id });

    return Response.json({ success: true, session: updated[0] });
  } catch (error) {
    ctx.error("COUNSELLING_SESSION_UPDATE_FAILED", { error: error.message });
    return Response.json({ success: false, message: "Failed to update session" }, { status: 500 });
  }
}

async function deleteHandler(req, { ctx, context }) {
  try {
    const { id } = await context.params;

    if (ctx.session.role !== "ADMIN") {
      return Response.json({ success: false, message: "Admin access required to delete sessions" }, { status: 403 });
    }

    const [existing] = await db
      .select({ id: counsellingSessions.id, imageKey: counsellingSessions.imageKey })
      .from(counsellingSessions)
      .where(eq(counsellingSessions.id, id))
      .limit(1);

    if (!existing) {
      return Response.json({ success: false, message: "Session not found" }, { status: 404 });
    }

    await db.delete(counsellingSessions).where(eq(counsellingSessions.id, id));

    if (existing.imageKey) {
      deleteObjectFromR2({ key: existing.imageKey }).catch(() => {});
    }

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
