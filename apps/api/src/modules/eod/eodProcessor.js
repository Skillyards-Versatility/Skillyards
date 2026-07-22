import { db, eodReports, users, eodWarnings } from "@repo/db";
import { eq, isNotNull, inArray } from "drizzle-orm";
import { sendEodReportEmail, sendEodWarningEmail } from "@/modules/notifications/email.service";

const TEAM_LEADS = {
  sales: { name: "Rahul Singh", email: "sskillyards@gmail.com" },
  tech: { name: "Mrigesh Deshpande", email: "mrigeshdeshpande@skillyards.in" },
  marketing: { name: "Neeraj Dang", email: "neeraj@skillyards.in" },
};

const ADMIN_HEADS = [
  { name: "CEO", email: process.env.CEO_EMAIL || "ceo@skillyards.in" },
  { name: "Admin Head", email: process.env.ADMIN_EMAIL || "admin@skillyards.in" },
];

const ADMIN_URL = process.env.ADMIN_URL || (process.env.NODE_ENV === "production" ? "https://admin.skillyards.in" : "http://localhost:3002");

const delay = (ms) => new Promise(r => setTimeout(r, ms));

export async function processEodEmails(date, targetUserId = null) {
  // Fetch all users who belong to a team
  let allUsers = await db.select().from(users).where(isNotNull(users.team));

  // If targeting a specific user, filter to only that user
  if (targetUserId) {
    allUsers = allUsers.filter(u => u.id === targetUserId);
    if (allUsers.length === 0) {
      return { success: true, message: "User not found or has no team", date, reportsSent: 0, warningsSent: 0, warningsSkipped: 0, failed: [] };
    }
  }
  
  // Fetch all reports submitted for the date
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
    .where(eq(eodReports.date, date));

  // Fetch all warnings sent for the date to avoid duplicates
  const warningsSentList = await db
    .select()
    .from(eodWarnings)
    .where(eq(eodWarnings.date, date));
  
  const warningsSentUserIds = new Set(warningsSentList.map(w => w.userId));

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

  const teams = Array.from(new Set([...Object.keys(usersByTeam), ...Object.keys(reportsByTeam)]));

  if (teams.length === 0) {
    return { success: true, message: "No teams to process", date, reportsSent: 0, warningsSent: 0, warningsSkipped: 0, failed: [] };
  }

  let reportsSent = 0;
  let warningsSent = 0;
  let warningsSkipped = 0;
  const failed = [];
  const results = [];

  const adminEmails = ADMIN_HEADS.map((a) => a.email).filter(Boolean);
  
  // Build a queue of functions to run sequentially
  const emailTasks = [];

  for (const team of teams) {
    const teamReports = reportsByTeam[team] || [];
    const teamUsers = usersByTeam[team] || [];
    
    const submittedUserIds = new Set(teamReports.map(r => r.userId));
    const missingUsers = teamUsers.filter(u => !submittedUserIds.has(u.id));

    let addedWarningsForTeam = false;

    // Warning emails for missing users
    for (const missingUser of missingUsers) {
      if (warningsSentUserIds.has(missingUser.id)) {
        warningsSkipped++;
        continue;
      }

      addedWarningsForTeam = true;
      emailTasks.push(async () => {
        try {
          await sendEodWarningEmail({
            to: missingUser.email,
            userName: missingUser.name,
            date: date
          });
          // Track it in DB immediately to prevent future runs from picking it up
          await db.insert(eodWarnings).values({
            userId: missingUser.id,
            date: date
          }).onConflictDoNothing();

          warningsSent++;
          results.push({ type: "warning", recipient: missingUser.email, status: "sent" });
        } catch (err) {
          console.error(`Failed to send warning email to ${missingUser.email}`, err);
          failed.push({ type: "warning", recipient: missingUser.email, error: err.message });
          results.push({ type: "warning", recipient: missingUser.email, status: "failed", error: err.message });
        }
      });
    }

    // Team summary email logic
    // If targeting a specific user who is MISSING, skip team report (just send warning).
    // If they are not missing (they submitted), proceed to send the team report.
    if (targetUserId && missingUsers.length > 0) continue;

    const lead = TEAM_LEADS[team];
    const to = lead?.email || adminEmails[0];
    const bcc = lead?.email ? adminEmails : adminEmails.slice(1);
    
    // We send a team report if there are any unemailed reports OR if there are 0 reports but we just sent warnings
    // (This deduplicates the "0 submitted" emails by only sending them when the warnings for that day are being triggered)
    const unemailedReports = teamReports.filter(r => !r.emailedAt);
    const shouldSendReport = unemailedReports.length > 0 || (teamReports.length === 0 && addedWarningsForTeam);

    if (to && shouldSendReport) {
      emailTasks.push(async () => {
        try {
          await sendEodReportEmail({
            to,
            bcc,
            team,
            date: date,
            reports: teamReports,
            missingUsers: missingUsers.map(u => ({ name: u.name, email: u.email })),
            adminUrl: ADMIN_URL,
          });
          
          if (teamReports.length > 0) {
            const reportIds = teamReports.map(r => r.id);
            await db
              .update(eodReports)
              .set({ emailedAt: new Date() })
              .where(inArray(eodReports.id, reportIds));
          }

          reportsSent++;
          results.push({ type: "report", team, recipient: to, status: "sent" });
        } catch (err) {
          console.error(`Failed to send EOD email for ${team}:`, err);
          failed.push({ type: "report", team, recipient: to, error: err.message });
          results.push({ type: "report", team, recipient: to, status: "failed", error: err.message });
        }
      });
    }
  }

  // Execute tasks sequentially with 600ms delay to avoid Resend rate limits
  for (const task of emailTasks) {
    await task();
    await delay(600);
  }

  return {
    success: true,
    date,
    reportsSent,
    warningsSent,
    warningsSkipped,
    failed,
    results
  };
}
