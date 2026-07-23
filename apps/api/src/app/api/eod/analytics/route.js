import { db, eodReports, users } from "@repo/db";
import { eq, and, gte, lte } from "drizzle-orm";
import { createProtectedRoute } from "@/lib/middleware";

async function getHandler(req, { ctx }) {
  try {
    const url = new URL(req.url);
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    const team = url.searchParams.get("team");

    if (!ctx.session || !ctx.session.userId) {
      return Response.json({ success: false, message: "Unauthorized access" }, { status: 403 });
    }

    const conditions = [];
    
    // Security: If not Admin or Manager, force filtering to their own userId
    if (ctx.session.role !== "ADMIN" && ctx.session.role !== "MANAGER") {
      conditions.push(eq(eodReports.userId, ctx.session.userId));
    } else {
      if (team) {
        conditions.push(eq(eodReports.team, team));
      }
    }

    if (startDate) conditions.push(gte(eodReports.date, startDate));
    if (endDate) conditions.push(lte(eodReports.date, endDate));

    const reports = await db
      .select({
        date: eodReports.date,
        team: eodReports.team,
        data: eodReports.data,
        userName: users.name,
        profileImageKey: users.profileImageKey,
      })
      .from(eodReports)
      .leftJoin(users, eq(eodReports.userId, users.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    // Aggregate numeric data for charts
    const timeSeriesData = {};
    const teamAggregates = {};
    const userAggregates = {};

    reports.forEach((report) => {
      const date = report.date;
      const teamName = report.team;
      const userName = report.userName;
      const profileImageKey = report.profileImageKey;
      
      // Mutate data to map old keys for backward compatibility in both aggregates and drill-downs
      const data = report.data || {};
      if (data.counsellingVirtual !== undefined) {
        data.counsellingBooked = data.counsellingVirtual;
        delete data.counsellingVirtual;
      }
      if (data.counsellingWalkin !== undefined) {
        data.counsellingDone = data.counsellingWalkin;
        delete data.counsellingWalkin;
      }

      if (!timeSeriesData[date]) timeSeriesData[date] = { date };
      if (!teamAggregates[teamName]) teamAggregates[teamName] = {};
      if (!userAggregates[userName]) {
        userAggregates[userName] = { image: profileImageKey };
      }

      Object.entries(data).forEach(([key, value]) => {
        // Only aggregate numeric fields
        const numValue = Number(value);
        if (!isNaN(numValue) && typeof value !== 'boolean' && key !== "notes") {
          // Time series
          timeSeriesData[date][key] = (timeSeriesData[date][key] || 0) + numValue;
          // Team agg
          teamAggregates[teamName][key] = (teamAggregates[teamName][key] || 0) + numValue;
          // User agg
          userAggregates[userName][key] = (userAggregates[userName][key] || 0) + numValue;
        }
      });
    });

    return Response.json({
      success: true,
      timeSeries: Object.values(timeSeriesData).sort((a, b) => a.date.localeCompare(b.date)),
      teamAggregates: Object.entries(teamAggregates).map(([team, metrics]) => ({ team, ...metrics })),
      userAggregates: Object.entries(userAggregates).map(([user, metrics]) => ({ user, ...metrics })),
      reports: reports, // Send raw reports to allow frontend drill-down
    });
  } catch (error) {
    ctx.error("EOD_ANALYTICS_FETCH_FAILED", { error: error.message });
    return Response.json(
      { success: false, message: "Failed to fetch analytics" },
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
