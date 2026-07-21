import { db, eodReports, users } from "@repo/db";
import { eq, and, inArray } from "drizzle-orm";
import { sendEodReportEmail, sendEodAllTeamsEmail } from "@/modules/notifications/email.service";
import { getIstDate, isIstSunday } from "@/lib/ist.js";

const TEAM_LEADS = {
  sales: { name: "Rahul Singh", email: "sskillyards@gmail.com" },
  tech: { name: "Mrigesh Deshpande", email: "mrigeshdeshpande@skillyards.in" },
  marketing: { name: "Neeraj Dang", email: "neeraj@skillyards.in" },
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

  // Fetch all users who belong to a team
  const allUsers = await db.select().from(users).where(and(inArray(users.team, Object.keys(TEAM_LEADS).concat(["marketing", "sales", "tech", "hr", "outside_sales", "ceo_office", "admin_head"]))));
  
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

  // Group users by team
  const usersByTeam = {};
  for (const u of allUsers) {
    if (!u.team) continue;
    if (!usersByTeam[u.team]) usersByTeam[u.team] = [];
    usersByTeam[u.team].push(u);
  }

  // Group reports by team
  const reportsByTeam = {};
  for (const r of reports) {
    if (!reportsByTeam[r.team]) reportsByTeam[r.team] = [];
    reportsByTeam[r.team].push(r);
  }

  // Determine which teams to process (all teams that have users or reports)
  const teams = Array.from(new Set([...Object.keys(usersByTeam), ...Object.keys(reportsByTeam)]));

  if (teams.length === 0) {
    return Response.json({ success: true, message: "No teams to process", sent: 0 });
  }

  let totalSent = 0;
  let totalWarningsSent = 0;

  const adminEmails = ADMIN_HEADS.map((a) => a.email).filter(Boolean);
  const emailPromises = [];
  
  for (const team of teams) {
    const teamReports = reportsByTeam[team] || [];
    const teamUsers = usersByTeam[team] || [];
    
    // Compute missing users
    const submittedUserIds = new Set(teamReports.map(r => r.userId));
    const missingUsers = teamUsers.filter(u => !submittedUserIds.has(u.id));

    // Queue Warning Emails for missing users
    for (const missingUser of missingUsers) {
      emailPromises.push(
        import("@/modules/notifications/email.service").then(({ sendEodWarningEmail }) => 
          sendEodWarningEmail({
            to: missingUser.email,
            userName: missingUser.name,
            date: today
          })
        ).then(() => {
          totalWarningsSent++;
          return { type: "warning", recipient: missingUser.email, status: "sent" };
        }).catch(err => {
          console.error(`Failed to send warning email to ${missingUser.email}`, err);
          return { type: "warning", recipient: missingUser.email, status: "failed", error: err.message };
        })
      );
    }

    const lead = TEAM_LEADS[team];
    const to = lead?.email || adminEmails[0];
    const bcc = lead?.email ? adminEmails : adminEmails.slice(1);
    
    if (to) {
      emailPromises.push(
        import("@/modules/notifications/email.service").then(({ sendEodReportEmail }) =>
          sendEodReportEmail({
            to,
            bcc,
            team,
            date: today,
            reports: teamReports,
            missingUsers: missingUsers.map(u => ({ name: u.name, email: u.email })),
            adminUrl: ADMIN_URL,
          })
        ).then(() => {
          totalSent++;
          return { type: "report", team, recipient: to, status: "sent" };
        }).catch((err) => {
          console.error(`Failed to send EOD email for ${team}:`, err);
          return { type: "report", team, recipient: to, status: "failed", error: err.message };
        })
      );
    }
  }

  const results = await Promise.allSettled(emailPromises);

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
    warningsSent: totalWarningsSent,
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
