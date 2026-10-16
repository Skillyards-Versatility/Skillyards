import { db } from "@repo/db";
import {
  eodReports,
  counsellingSessions,
  followUps,
  users,
  crmAuditEvents,
} from "@repo/db/schema";
import { eq, and, desc, gte, lte, sql } from "drizzle-orm";
import { getIstDate, isIstBeforeCutoff, isIstSunday } from "@/lib/ist.js";
import { recordAuditEvent } from "./crm.lead.repository";
import { ROLES } from "@/lib/permissions";

export const DEFAULT_EOD_CONFIG = {
  version: "v1.0",
  dialBaseline: 120,
  dialFloor: 0,
  dialsReducedPerSession: 15,
  connectBaseline: 50,
  connectFloor: 30,
  connectsReducedPerSession: 5,
  talkTargetMinutes: 90,
};

/**
 * Pure domain function calculating authoritative EOD targets based on completed counselling count.
 */
export function calculateEodTargets(
  completedCounsellingCount = 0,
  config = DEFAULT_EOD_CONFIG
) {
  const safeCount = Math.max(0, parseInt(completedCounsellingCount, 10) || 0);

  const dialTarget = Math.max(
    config.dialFloor,
    config.dialBaseline - safeCount * config.dialsReducedPerSession
  );

  const connectTarget = Math.max(
    config.connectFloor,
    config.connectBaseline - safeCount * config.connectsReducedPerSession
  );

  const talkTimeTargetMinutes = config.talkTargetMinutes;
  const talkTargetSeconds = talkTimeTargetMinutes * 60;

  return {
    configVersion: config.version,
    dialBaseline: config.dialBaseline,
    dialFloor: config.dialFloor,
    dialsReducedPerSession: config.dialsReducedPerSession,
    connectBaseline: config.connectBaseline,
    connectFloor: config.connectFloor,
    connectsReducedPerSession: config.connectsReducedPerSession,
    completedCounselling: safeCount,
    dialTarget,
    connectTarget,
    talkTimeTargetMinutes,
    talkTargetSeconds,
  };
}

/**
 * Pure domain function calculating attainment percentages and completion status.
 */
export function calculateAttainment({ actuals, targets }) {
  const dials = Math.max(0, parseInt(actuals.dials, 10) || 0);
  const connects = Math.max(0, parseInt(actuals.connects, 10) || 0);
  const talkTimeMinutes = Math.max(
    0,
    parseFloat(actuals.talkTimeMinutes) || 0
  );

  const dialTarget = targets.dialTarget || 1;
  const connectTarget = targets.connectTarget || 1;
  const talkTargetMinutes = targets.talkTimeTargetMinutes || 90;

  const dialAttainmentPct = Math.round((dials / dialTarget) * 1000) / 10;
  const connectAttainmentPct = Math.round((connects / connectTarget) * 1000) / 10;
  const talkTimeAttainmentPct =
    Math.round((talkTimeMinutes / talkTargetMinutes) * 1000) / 10;

  const targetMet =
    dials >= dialTarget &&
    connects >= connectTarget &&
    talkTimeMinutes >= talkTargetMinutes;

  return {
    dialAttainmentPct,
    connectAttainmentPct,
    talkTimeAttainmentPct,
    targetMet,
  };
}

/**
 * Fetch server-authoritative EOD preview:
 * - Server counts verified completed counselling sessions
 * - Server computes authoritative targets
 * - Server extracts verified CRM call logs for the user on that date
 * - Checks if report already exists and is locked
 */
export async function getEodPreviewService({ userId, date, sessionUser }) {
  const targetDate = date || getIstDate();
  const targetUserId = userId || sessionUser.userId;

  // 1. Fetch user info
  const [user] = await db
    .select({ id: users.id, name: users.name, email: users.email, team: users.team })
    .from(users)
    .where(eq(users.id, targetUserId))
    .limit(1);

  if (!user) {
    throw new Error("User not found");
  }

  // 2. Count authoritative completed counselling sessions on that business date
  const [counsellingStats] = await db
    .select({
      count: sql`count(*)::int`,
    })
    .from(counsellingSessions)
    .where(
      and(
        eq(counsellingSessions.counselorId, targetUserId),
        eq(counsellingSessions.sessionDate, targetDate),
        sql`${counsellingSessions.outcome} IN ('completed', 'enrolled')`
      )
    );

  const completedCounselling = counsellingStats?.count || 0;

  // 3. Compute server-authoritative targets
  const targets = calculateEodTargets(completedCounselling, DEFAULT_EOD_CONFIG);

  // 4. Auto-aggregate actuals from CRM followUps / call logs on that date
  const startOfDay = `${targetDate}T00:00:00Z`;
  const endOfDay = `${targetDate}T23:59:59.999Z`;

  const [callStats] = await db
    .select({
      totalDials: sql`count(*)::int`,
      totalConnects: sql`count(*) FILTER (WHERE ${followUps.outcome} IN ('reached', 'callback_requested', 'interested'))::int`,
      totalDurationSeconds: sql`coalesce(sum(${followUps.duration}), 0)::int`,
    })
    .from(followUps)
    .where(
      and(
        eq(followUps.telecallerId, targetUserId),
        gte(followUps.contactedAt, new Date(startOfDay)),
        lte(followUps.contactedAt, new Date(endOfDay))
      )
    );

  const autoActuals = {
    dials: callStats?.totalDials || 0,
    connects: callStats?.totalConnects || 0,
    talkTimeMinutes: Math.round(((callStats?.totalDurationSeconds || 0) / 60) * 10) / 10,
    counsellingCompleted: completedCounselling,
    notes: "",
  };

  // 5. Check if report is already submitted
  const [existingReport] = await db
    .select()
    .from(eodReports)
    .where(
      and(eq(eodReports.userId, targetUserId), eq(eodReports.date, targetDate))
    )
    .limit(1);

  const isSubmitted = !!existingReport;
  const isLocked = isSubmitted;

  // Compute live attainment based on existing or auto-extracted actuals
  const currentActuals = isSubmitted && existingReport.data?.actuals
    ? existingReport.data.actuals
    : autoActuals;

  const currentTargets = isSubmitted && existingReport.data?.targets
    ? existingReport.data.targets
    : targets;

  const attainment = calculateAttainment({
    actuals: currentActuals,
    targets: currentTargets,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      team: user.team,
    },
    date: targetDate,
    isSunday: isIstSunday(new Date(targetDate)),
    isCutoffPassed: !isIstBeforeCutoff(new Date()),
    isSubmitted,
    isLocked,
    existingReport: existingReport || null,
    targets,
    autoActuals,
    currentActuals,
    attainment,
  };
}

/**
 * Submit authoritative EOD report:
 * - Server recalculates targets from persisted completed counselling
 * - Prevents client tampering of target values or counselling count
 * - Prevents unapproved overwrites (returns 409 if already submitted)
 */
export async function submitEodReportService(
  { date, actuals, screenshotKey },
  sessionUser,
  requestId
) {
  const targetDate = date || getIstDate();
  const userId = sessionUser.userId;

  const isManager =
    sessionUser.role === ROLES.ADMIN ||
    sessionUser.role === ROLES.MANAGER ||
    sessionUser.crmRoles?.includes("crm_admin") ||
    sessionUser.crmRoles?.includes("sales_manager");

  // Validate business date rules
  if (!isManager) {
    if (isIstSunday() || new Date(targetDate).getDay() === 0) {
      throw new Error("EOD submissions are closed on Sundays");
    }
    if (!isIstBeforeCutoff()) {
      throw new Error("Submission cutoff (7:30 PM IST) has passed for today");
    }
  }

  // Check unique report constraint
  const [existing] = await db
    .select()
    .from(eodReports)
    .where(and(eq(eodReports.userId, userId), eq(eodReports.date, targetDate)))
    .limit(1);

  if (existing) {
    const error = new Error(
      "An EOD report has already been submitted for this date. Use the manager amendment workflow to make corrections."
    );
    error.status = 409;
    error.code = "EOD_REPORT_ALREADY_SUBMITTED";
    throw error;
  }

  // Get user details
  const [user] = await db
    .select({ team: users.team, name: users.name })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const team = user?.team || "sales";

  // Re-verify authoritative completed counselling count
  const [counsellingStats] = await db
    .select({
      count: sql`count(*)::int`,
    })
    .from(counsellingSessions)
    .where(
      and(
        eq(counsellingSessions.counselorId, userId),
        eq(counsellingSessions.sessionDate, targetDate),
        sql`${counsellingSessions.outcome} IN ('completed', 'enrolled')`
      )
    );

  const completedCounselling = counsellingStats?.count || 0;

  // Server-authoritative target snapshot
  const targets = calculateEodTargets(completedCounselling, DEFAULT_EOD_CONFIG);

  // Validate actuals
  const sanitizedActuals = {
    dials: Math.max(0, parseInt(actuals.dials, 10) || 0),
    connects: Math.max(0, parseInt(actuals.connects, 10) || 0),
    talkTimeMinutes: Math.max(0, parseFloat(actuals.talkTimeMinutes) || 0),
    counsellingCompleted: completedCounselling,
    notes: actuals.notes ? String(actuals.notes).trim() : "",
  };

  // Authoritative attainment
  const attainment = calculateAttainment({
    actuals: sanitizedActuals,
    targets,
  });

  const payloadData = {
    configVersion: targets.configVersion,
    targets,
    actuals: sanitizedActuals,
    attainment,
    revision: 1,
    status: "submitted",
    submittedAt: new Date().toISOString(),
    submittedByUserId: userId,
    submittedByUserName: user?.name || "Rep",
    revisions: [
      {
        revision: 1,
        timestamp: new Date().toISOString(),
        actorUserId: userId,
        actorName: user?.name || "Rep",
        action: "initial_submission",
        targets,
        actuals: sanitizedActuals,
        attainment,
      },
    ],
  };

  const [created] = await db
    .insert(eodReports)
    .values({
      userId,
      team,
      date: targetDate,
      data: payloadData,
      screenshotKey: screenshotKey || null,
      submittedAt: new Date(),
    })
    .returning();

  // Audit event
  await recordAuditEvent({
    actorUserId: userId,
    action: "EOD_REPORT_SUBMITTED",
    entityType: "eod_report",
    entityId: created.id,
    reason: `EOD report submitted for ${targetDate} (Attainment: ${attainment.targetMet ? "MET" : "MISSED"})`,
    afterSnapshot: {
      reportId: created.id,
      date: targetDate,
      targets,
      actuals: sanitizedActuals,
      attainment,
    },
    requestId,
  });

  return created;
}

/**
 * Manager amendment workflow:
 * - Requires manager / admin role
 * - Requires mandatory amendment reason
 * - Preserves immutable revision history on same report ID
 */
export async function amendEodReportService(
  reportId,
  { actuals, amendmentReason },
  actorUser,
  requestId
) {
  if (!amendmentReason?.trim()) {
    const error = new Error("An amendment reason is strictly required");
    error.status = 400;
    error.code = "EOD_AMENDMENT_REASON_REQUIRED";
    throw error;
  }

  const isManager =
    actorUser.role === ROLES.ADMIN ||
    actorUser.role === ROLES.MANAGER ||
    actorUser.crmRoles?.includes("crm_admin") ||
    actorUser.crmRoles?.includes("sales_manager");

  if (!isManager) {
    const error = new Error("Only sales managers or admins can amend submitted EOD reports");
    error.status = 403;
    error.code = "EOD_REPORT_LOCKED";
    throw error;
  }

  const [existing] = await db
    .select()
    .from(eodReports)
    .where(eq(eodReports.id, reportId))
    .limit(1);

  if (!existing) {
    throw new Error("EOD report not found");
  }

  const existingData = typeof existing.data === "object" ? existing.data : {};
  const currentTargets = existingData.targets || calculateEodTargets(0);
  const currentRevision = parseInt(existingData.revision, 10) || 1;
  const nextRevision = currentRevision + 1;

  // Validate amended actuals
  const amendedActuals = {
    ...existingData.actuals,
    dials:
      actuals.dials !== undefined
        ? Math.max(0, parseInt(actuals.dials, 10) || 0)
        : existingData.actuals?.dials || 0,
    connects:
      actuals.connects !== undefined
        ? Math.max(0, parseInt(actuals.connects, 10) || 0)
        : existingData.actuals?.connects || 0,
    talkTimeMinutes:
      actuals.talkTimeMinutes !== undefined
        ? Math.max(0, parseFloat(actuals.talkTimeMinutes) || 0)
        : existingData.actuals?.talkTimeMinutes || 0,
    notes:
      actuals.notes !== undefined
        ? String(actuals.notes).trim()
        : existingData.actuals?.notes || "",
  };

  const newAttainment = calculateAttainment({
    actuals: amendedActuals,
    targets: currentTargets,
  });

  const amendmentEntry = {
    revision: nextRevision,
    timestamp: new Date().toISOString(),
    actorUserId: actorUser.userId,
    actorName: actorUser.name || "Manager",
    action: "manager_amendment",
    reason: amendmentReason.trim(),
    previousActuals: existingData.actuals,
    newActuals: amendedActuals,
    previousAttainment: existingData.attainment,
    newAttainment,
  };

  const updatedData = {
    ...existingData,
    actuals: amendedActuals,
    attainment: newAttainment,
    revision: nextRevision,
    status: "amended",
    lastAmendedAt: new Date().toISOString(),
    lastAmendedBy: actorUser.name || "Manager",
    lastAmendmentReason: amendmentReason.trim(),
    revisions: [...(existingData.revisions || []), amendmentEntry],
  };

  const [updated] = await db
    .update(eodReports)
    .set({
      data: updatedData,
    })
    .where(eq(eodReports.id, reportId))
    .returning();

  // Audit event
  await recordAuditEvent({
    actorUserId: actorUser.userId,
    action: "EOD_REPORT_AMENDED",
    entityType: "eod_report",
    entityId: reportId,
    reason: amendmentReason.trim(),
    beforeSnapshot: existingData,
    afterSnapshot: updatedData,
    requestId,
  });

  return updated;
}

/**
 * List scoped EOD reports.
 */
export async function getEodReportsListService({ userScope = {}, query = {} }) {
  const { startDate, endDate, date, userId, limit = 50, offset = 0 } = query;

  const conditions = [];

  if (date) {
    conditions.push(eq(eodReports.date, date));
  }
  if (startDate) {
    conditions.push(gte(eodReports.date, startDate));
  }
  if (endDate) {
    conditions.push(lte(eodReports.date, endDate));
  }

  if (userScope.scopedToUser && userScope.userId) {
    conditions.push(eq(eodReports.userId, userScope.userId));
  } else if (userId) {
    conditions.push(eq(eodReports.userId, userId));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const rows = await db
    .select({
      id: eodReports.id,
      userId: eodReports.userId,
      userName: users.name,
      userEmail: users.email,
      team: eodReports.team,
      date: eodReports.date,
      data: eodReports.data,
      screenshotKey: eodReports.screenshotKey,
      submittedAt: eodReports.submittedAt,
    })
    .from(eodReports)
    .leftJoin(users, eq(eodReports.userId, users.id))
    .where(whereClause)
    .orderBy(desc(eodReports.date), desc(eodReports.submittedAt))
    .limit(limit)
    .offset(offset);

  const [totalRes] = await db
    .select({ count: sql`count(*)::int` })
    .from(eodReports)
    .where(whereClause);

  return {
    reports: rows,
    total: totalRes?.count || 0,
  };
}

/**
 * Get single EOD report with full revision history and audit events.
 */
export async function getEodReportByIdService(reportId) {
  const [report] = await db
    .select({
      id: eodReports.id,
      userId: eodReports.userId,
      userName: users.name,
      userEmail: users.email,
      team: eodReports.team,
      date: eodReports.date,
      data: eodReports.data,
      screenshotKey: eodReports.screenshotKey,
      submittedAt: eodReports.submittedAt,
    })
    .from(eodReports)
    .leftJoin(users, eq(eodReports.userId, users.id))
    .where(eq(eodReports.id, reportId))
    .limit(1);

  if (!report) {
    throw new Error("EOD report not found");
  }

  const auditEvents = await db
    .select({
      id: crmAuditEvents.id,
      action: crmAuditEvents.action,
      actorUserId: crmAuditEvents.actorUserId,
      actorName: users.name,
      reason: crmAuditEvents.reason,
      createdAt: crmAuditEvents.createdAt,
    })
    .from(crmAuditEvents)
    .leftJoin(users, eq(crmAuditEvents.actorUserId, users.id))
    .where(
      and(
        eq(crmAuditEvents.entityType, "eod_report"),
        eq(crmAuditEvents.entityId, reportId)
      )
    )
    .orderBy(desc(crmAuditEvents.createdAt));

  return {
    ...report,
    auditHistory: auditEvents,
  };
}
