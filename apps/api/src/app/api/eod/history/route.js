import { db, eodReports, users } from "@repo/db";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { createProtectedRoute } from "@/lib/middleware";

async function getHandler(req, { ctx }) {
  try {
    const url = new URL(req.url);
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    const team = url.searchParams.get("team");

    const conditions = [];
    if (ctx.session.role !== "ADMIN" && ctx.session.role !== "MANAGER") {
      conditions.push(eq(eodReports.userId, ctx.session.userId));
    } else if (team) {
      conditions.push(eq(eodReports.team, team));
    }

    if (startDate) conditions.push(gte(eodReports.date, startDate));
    if (endDate) conditions.push(lte(eodReports.date, endDate));

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
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(eodReports.date), desc(eodReports.submittedAt));

    return Response.json({ success: true, reports });
  } catch (error) {
    ctx.error("EOD_HISTORY_FETCH_FAILED", { error: error.message });
    return Response.json(
      { success: false, message: "Failed to fetch history" },
      { status: 500 }
    );
  }
}

export const GET = createProtectedRoute(getHandler, {
  isPublic: false,
  policy: (session) => ({
    authorized: !!session?.userId,
    reason: session?.userId ? "Authenticated" : "Login required",
  }),
});
