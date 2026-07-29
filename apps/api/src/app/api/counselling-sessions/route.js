import { db, counsellingSessions, users } from "@repo/db";
import { eq, desc, and, gte, lte } from "drizzle-orm";
import { createProtectedRoute } from "@/lib/middleware";

async function getHandler(req, { ctx }) {
  try {
    const url = new URL(req.url);
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    const source = url.searchParams.get("source");
    const outcome = url.searchParams.get("outcome");
    const counselorId = url.searchParams.get("counselorId");

    const conditions = [];

    if (ctx.session.role !== "ADMIN" && ctx.session.role !== "MANAGER") {
      conditions.push(eq(counsellingSessions.counselorId, ctx.session.userId));
    } else if (counselorId) {
      conditions.push(eq(counsellingSessions.counselorId, counselorId));
    }

    if (startDate) conditions.push(gte(counsellingSessions.sessionDate, startDate));
    if (endDate) conditions.push(lte(counsellingSessions.sessionDate, endDate));
    if (source) conditions.push(eq(counsellingSessions.source, source));
    if (outcome) conditions.push(eq(counsellingSessions.outcome, outcome));

    const sessions = await db
      .select({
        id: counsellingSessions.id,
        counselorId: counsellingSessions.counselorId,
        counselorName: users.name,
        studentName: counsellingSessions.studentName,
        phone: counsellingSessions.phone,
        ageOrClass: counsellingSessions.ageOrClass,
        courseInterest: counsellingSessions.courseInterest,
        source: counsellingSessions.source,
        outcome: counsellingSessions.outcome,
        notes: counsellingSessions.notes,
        sessionDate: counsellingSessions.sessionDate,
        createdAt: counsellingSessions.createdAt,
      })
      .from(counsellingSessions)
      .leftJoin(users, eq(counsellingSessions.counselorId, users.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(counsellingSessions.sessionDate));

    // Summary stats for admin
    const totalSessions = sessions.length;
    const sourceBreakdown = {};
    const outcomeBreakdown = {};
    sessions.forEach((s) => {
      sourceBreakdown[s.source] = (sourceBreakdown[s.source] || 0) + 1;
      outcomeBreakdown[s.outcome] = (outcomeBreakdown[s.outcome] || 0) + 1;
    });

    return Response.json({
      success: true,
      sessions,
      summary: {
        total: totalSessions,
        bySource: sourceBreakdown,
        byOutcome: outcomeBreakdown,
      },
    });
  } catch (error) {
    ctx.error("COUNSELLING_SESSIONS_FETCH_FAILED", { error: error.message });
    return Response.json({ success: false, message: "Failed to fetch sessions" }, { status: 500 });
  }
}

async function postHandler(req, { ctx }) {
  try {
    const { studentName, phone, ageOrClass, courseInterest, source, outcome, notes, sessionDate } = await req.json();

    if (!studentName || !sessionDate) {
      return Response.json(
        { success: false, message: "studentName and sessionDate are required" },
        { status: 400 }
      );
    }

    const [session] = await db
      .insert(counsellingSessions)
      .values({
        counselorId: ctx.session.userId,
        studentName,
        phone: phone || null,
        ageOrClass: ageOrClass || null,
        courseInterest: courseInterest || null,
        source: source || "walk_in",
        outcome: outcome || "follow_up",
        notes: notes || null,
        sessionDate,
      })
      .returning();

    ctx.log("COUNSELLING_SESSION_CREATED", { sessionId: session.id, studentName });

    return Response.json({ success: true, session }, { status: 201 });
  } catch (error) {
    ctx.error("COUNSELLING_SESSION_CREATE_FAILED", { error: error.message });
    return Response.json({ success: false, message: "Failed to create session" }, { status: 500 });
  }
}

export const GET = createProtectedRoute(getHandler, {
  isPublic: false,
  policy: (session) => ({
    authorized: !!session?.userId,
    reason: session?.userId ? "Authenticated" : "Login required",
  }),
});

export const POST = createProtectedRoute(postHandler, {
  isPublic: false,
  policy: (session) => ({
    authorized: !!session?.userId,
    reason: session?.userId ? "Authenticated" : "Login required",
  }),
});
