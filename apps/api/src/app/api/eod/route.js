import { db, eodReports, users } from "@repo/db";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { createProtectedRoute } from "@/lib/middleware";
import { getIstDate, isIstBeforeCutoff, isIstSunday } from "@/lib/ist.js";

const VALID_TEAMS = ["sales", "tech", "hr", "ceo_office", "admin_head"];

async function postHandler(req, { ctx }) {
  try {
    const { date, data, screenshotKey } = await req.json();

    if (!date || !data) {
      return Response.json(
        { success: false, message: "date and data are required" },
        { status: 400 }
      );
    }

    // Sunday check
    if (isIstSunday()) {
      return Response.json(
        { success: false, message: "Submissions are closed on Sundays" },
        { status: 400 }
      );
    }

    // Cutoff check
    if (!isIstBeforeCutoff()) {
      return Response.json(
        { success: false, message: "Submission cutoff (6:30 PM IST) has passed" },
        { status: 400 }
      );
    }

    // Get user's team
    const [user] = await db
      .select({ team: users.team })
      .from(users)
      .where(eq(users.id, ctx.session.userId))
      .limit(1);

    if (!user?.team) {
      return Response.json(
        { success: false, message: "You are not assigned to a team" },
        { status: 400 }
      );
    }

    // Upsert: if already submitted today, update
    const [existing] = await db
      .select({ id: eodReports.id })
      .from(eodReports)
      .where(
        and(
          eq(eodReports.userId, ctx.session.userId),
          eq(eodReports.date, date)
        )
      )
      .limit(1);

    let result;
    if (existing) {
      [result] = await db
        .update(eodReports)
        .set({ data, screenshotKey: screenshotKey || null })
        .where(eq(eodReports.id, existing.id))
        .returning();
    } else {
      [result] = await db
        .insert(eodReports)
        .values({
          userId: ctx.session.userId,
          team: user.team,
          date,
          data,
          screenshotKey: screenshotKey || null,
        })
        .returning();
    }

    ctx.log("EOD_REPORT_SAVED", { userId: ctx.session.userId, date, team: user.team });

    return Response.json({ success: true, report: result });
  } catch (error) {
    ctx.error("EOD_REPORT_SAVE_FAILED", { error: error.message });
    return Response.json(
      { success: false, message: "Failed to save report" },
      { status: 500 }
    );
  }
}

async function getHandler(req, { ctx }) {
  try {
    const url = new URL(req.url);
    const date = url.searchParams.get("date") || getIstDate();
    const team = url.searchParams.get("team");

    const conditions = [eq(eodReports.date, date)];
    if (team) conditions.push(eq(eodReports.team, team));

    const reports = await db
      .select({
        id: eodReports.id,
        userId: eodReports.userId,
        team: eodReports.team,
        date: eodReports.date,
        data: eodReports.data,
        screenshotKey: eodReports.screenshotKey,
        submittedAt: eodReports.submittedAt,
        emailedAt: eodReports.emailedAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(eodReports)
      .leftJoin(users, eq(eodReports.userId, users.id))
      .where(and(...conditions))
      .orderBy(desc(eodReports.submittedAt));

    return Response.json({ success: true, reports });
  } catch (error) {
    ctx.error("EOD_REPORTS_FETCH_FAILED", { error: error.message });
    return Response.json(
      { success: false, message: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}

async function putHandler(req, { ctx }) {
  try {
    const { id, data, screenshotKey } = await req.json();

    if (!id || !data) {
      return Response.json(
        { success: false, message: "id and data are required" },
        { status: 400 }
      );
    }

    // Verify ownership
    const [existing] = await db
      .select({ id: eodReports.id, userId: eodReports.userId })
      .from(eodReports)
      .where(eq(eodReports.id, id))
      .limit(1);

    if (!existing) {
      return Response.json(
        { success: false, message: "Report not found" },
        { status: 404 }
      );
    }

    if (existing.userId !== ctx.session.userId) {
      return Response.json(
        { success: false, message: "Cannot edit another user's report" },
        { status: 403 }
      );
    }

    // Check cutoff
    if (!isIstBeforeCutoff()) {
      return Response.json(
        { success: false, message: "Cannot edit after 6:30 PM IST cutoff" },
        { status: 400 }
      );
    }

    const [result] = await db
      .update(eodReports)
      .set({ data, screenshotKey: screenshotKey || null })
      .where(eq(eodReports.id, id))
      .returning();

    ctx.log("EOD_REPORT_UPDATED", { userId: ctx.session.userId, id });

    return Response.json({ success: true, report: result });
  } catch (error) {
    ctx.error("EOD_REPORT_UPDATE_FAILED", { error: error.message });
    return Response.json(
      { success: false, message: "Failed to update report" },
      { status: 500 }
    );
  }
}

export const POST = createProtectedRoute(postHandler, {
  isPublic: false,
  policy: (session) => ({
    authorized: !!session?.userId,
    reason: session?.userId ? "Authenticated" : "Login required",
  }),
});

export const GET = createProtectedRoute(getHandler, {
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
