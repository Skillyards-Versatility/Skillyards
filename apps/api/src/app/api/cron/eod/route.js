import { db, eodReports, users } from "@repo/db";
import { eq, and, inArray } from "drizzle-orm";
import { sendEodReportEmail, sendEodAllTeamsEmail } from "@/modules/notifications/email.service";
import { getIstDate, isIstSunday } from "@/lib/ist.js";

const TEAM_LEADS = {
  sales: { name: "Rahul Singh", email: "rahul@skillyards.in" },
  tech: { name: "Mrigesh Deshpande", email: "mrigesh@skillyards.in" },
};

const ADMIN_HEADS = [
  { name: "CEO", email: process.env.CEO_EMAIL || "ceo@skillyards.in" },
  { name: "Admin Head", email: process.env.ADMIN_EMAIL || "admin@skillyards.in" },
];

const ADMIN_URL = process.env.ADMIN_URL || "http://localhost:3002";

async function handler(req) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Skip Sundays
  if (isIstSunday()) {
    return Response.json({ success: true, message: "Sunday — skipped" });
  }

  const today = getIstDate();

  // Fetch all reports submitted today with user info
  const reports = await db
    .select({
      id: eodReports.id,
      userId: eodReports.userId,
      team: eodReports.team,
      date: eodReports.date,
      data: eodReports.data,
      screenshotKey: eodReports.screenshotKey,
      submittedAt: eodReports.submittedAt,
      userName: users.name,
      userEmail: users.email,
    })
    .from(eodReports)
    .leftJoin(users, eq(eodReports.userId, users.id))
    .where(eq(eodReports.date, today));

  if (reports.length === 0) {
    return Response.json({ success: true, message: "No reports today", sent: 0 });
  }

  // Group by team
  const byTeam = {};
  for (const r of reports) {
    if (!byTeam[r.team]) byTeam[r.team] = [];
    byTeam[r.team].push(r);
  }

  const teams = Object.keys(byTeam);
  let totalSent = 0;

  // Send per-team emails to team leads
  const teamEmailPromises = [];
  for (const team of teams) {
    const lead = TEAM_LEADS[team];
    if (lead?.email) {
      teamEmailPromises.push(
        sendEodReportEmail({
          to: lead.email,
          team,
          date: today,
          reports: byTeam[team],
          adminUrl: ADMIN_URL,
        }).then(() => {
          totalSent++;
          return { team, recipient: lead.email, status: "sent" };
        }).catch((err) => {
          console.error(`Failed to send EOD email to ${lead.email}:`, err);
          return { team, recipient: lead.email, status: "failed", error: err.message };
        })
      );
    }
  }

  // Send combined report to admin heads
  for (const admin of ADMIN_HEADS) {
    if (admin.email) {
      teamEmailPromises.push(
        sendEodAllTeamsEmail({
          to: admin.email,
          date: today,
          teamSummaries: teams.map((t) => ({ team: t, reports: byTeam[t] })),
          adminUrl: ADMIN_URL,
        }).then(() => {
          totalSent++;
          return { recipient: admin.email, status: "sent" };
        }).catch((err) => {
          console.error(`Failed to send combined EOD email to ${admin.email}:`, err);
          return { recipient: admin.email, status: "failed", error: err.message };
        })
      );
    }
  }

  const results = await Promise.allSettled(teamEmailPromises);

  // Mark all today's reports as emailed
  const reportIds = reports.map((r) => r.id);
  if (reportIds.length > 0) {
    await db
      .update(eodReports)
      .set({ emailedAt: new Date() })
      .where(inArray(eodReports.id, reportIds));
  }

  return Response.json({
    success: true,
    date: today,
    reportsFound: reports.length,
    teams: teams,
    emailsSent: totalSent,
    results: results.map((r) => r.value || r.reason),
  });
}

// Disable body parsing for cron endpoint
export const runtime = "nodejs";

export async function GET(req) {
  return handler(req);
}

export async function POST(req) {
  return handler(req);
}
