import { db, counsellingSessions, users } from "@repo/db";
import { eq, desc, and, or, ilike, gte, lte, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { createProtectedRoute } from "@/lib/middleware";

const bookedByUser = alias(users, "booked_by_user");

async function getHandler(req, { ctx }) {
  try {
    const url = new URL(req.url);
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    const source = url.searchParams.get("source");
    const outcome = url.searchParams.get("outcome");
    const counselorId = url.searchParams.get("counselorId");
    const bookedById = url.searchParams.get("bookedById");
    const search = url.searchParams.get("search");
    const limit = parseInt(url.searchParams.get("limit") || "50", 10);
    const offset = parseInt(url.searchParams.get("offset") || "0", 10);
    const showTodayFollowUps = url.searchParams.get("showTodayFollowUps") === "true";
    const followUpDateStr = url.searchParams.get("followUpDate");

    const conditions = [];

    if (ctx.session.role !== "ADMIN" && ctx.session.role !== "MANAGER") {
      conditions.push(
        or(
          eq(counsellingSessions.counselorId, ctx.session.userId),
          eq(counsellingSessions.bookedById, ctx.session.userId)
        )
      );
    } else {
      if (counselorId) conditions.push(eq(counsellingSessions.counselorId, counselorId));
      if (bookedById) conditions.push(eq(counsellingSessions.bookedById, bookedById));
    }

    if (startDate) conditions.push(gte(counsellingSessions.sessionDate, startDate));
    if (endDate) conditions.push(lte(counsellingSessions.sessionDate, endDate));
    if (source) conditions.push(eq(counsellingSessions.source, source));
    if (outcome) conditions.push(eq(counsellingSessions.outcome, outcome));
    
    if (search) {
      conditions.push(
        or(
          ilike(counsellingSessions.studentName, `%${search}%`),
          ilike(counsellingSessions.phone, `%${search}%`)
        )
      );
    }
    
    if (showTodayFollowUps && followUpDateStr) {
      conditions.push(eq(counsellingSessions.nextFollowUpDate, followUpDateStr));
    }

    const sessions = await db
      .select({
        id: counsellingSessions.id,
        counselorId: counsellingSessions.counselorId,
        counselorName: users.name,
        bookedById: counsellingSessions.bookedById,
        bookedByName: bookedByUser.name,
        studentName: counsellingSessions.studentName,
        phone: counsellingSessions.phone,
        ageOrClass: counsellingSessions.ageOrClass,
        courseInterest: counsellingSessions.courseInterest,
        source: counsellingSessions.source,
        outcome: counsellingSessions.outcome,
        notes: counsellingSessions.notes,
        sessionDate: counsellingSessions.sessionDate,
        nextFollowUpDate: counsellingSessions.nextFollowUpDate,
        imageKey: counsellingSessions.imageKey,
        createdAt: counsellingSessions.createdAt,
      })
      .from(counsellingSessions)
      .leftJoin(users, eq(counsellingSessions.counselorId, users.id))
      .leftJoin(bookedByUser, eq(counsellingSessions.bookedById, bookedByUser.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(counsellingSessions.sessionDate), desc(counsellingSessions.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const [{ count }] = await db
      .select({ count: sql`count(*)`.mapWith(Number) })
      .from(counsellingSessions)
      .where(conditions.length > 0 ? and(...conditions) : undefined);
      
    // Get aggregate breakdown by source
    const sourceStats = await db
      .select({ source: counsellingSessions.source, count: sql`count(*)`.mapWith(Number) })
      .from(counsellingSessions)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .groupBy(counsellingSessions.source);

    // Get aggregate breakdown by outcome
    const outcomeStats = await db
      .select({ outcome: counsellingSessions.outcome, count: sql`count(*)`.mapWith(Number) })
      .from(counsellingSessions)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .groupBy(counsellingSessions.outcome);

    const bySource = {};
    sourceStats.forEach(s => {
      if (s.source) bySource[s.source] = s.count;
    });

    const byOutcome = {};
    outcomeStats.forEach(s => {
      if (s.outcome) byOutcome[s.outcome] = s.count;
    });

    return Response.json({
      success: true,
      sessions,
      totalCount: count,
      summary: {
        total: count,
        bySource,
        byOutcome,
      },
    });
  } catch (error) {
    ctx.error("COUNSELLING_SESSIONS_FETCH_FAILED", { error: error.message });
    return Response.json({ success: false, message: "Failed to fetch sessions" }, { status: 500 });
  }
}

async function postHandler(req, { ctx }) {
  try {
    const { studentName, phone, ageOrClass, courseInterest, source, outcome, notes, sessionDate, nextFollowUpDate, counselorId, bookedById, imageKey } = await req.json();

    if (!studentName || !sessionDate) {
      return Response.json(
        { success: false, message: "studentName and sessionDate are required" },
        { status: 400 }
      );
    }

    let finalCounselorId = ctx.session.userId;
    if ((ctx.session.role === "ADMIN" || ctx.session.role === "MANAGER") && counselorId) {
      finalCounselorId = counselorId;
    }

    let finalBookedById = ctx.session.userId;
    if ((ctx.session.role === "ADMIN" || ctx.session.role === "MANAGER") && bookedById) {
      finalBookedById = bookedById;
    }

    const [session] = await db
      .insert(counsellingSessions)
      .values({
        counselorId: finalCounselorId,
        bookedById: finalBookedById,
        studentName,
        phone: phone || null,
        ageOrClass: ageOrClass || null,
        courseInterest: courseInterest || null,
        source: source || "walk_in",
        outcome: outcome || "follow_up",
        notes: notes || null,
        sessionDate,
        nextFollowUpDate: nextFollowUpDate || null,
        imageKey: imageKey || null,
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
