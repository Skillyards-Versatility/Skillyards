import {
  findCounsellingSessions,
  findCounsellingSessionById,
  findAuditEventsForSession,
  insertCounsellingSessionRecord,
  updateCounsellingSessionRecord,
  deleteCounsellingSessionRecord,
} from "./crm.counselling.repository";
import {
  findLeadById,
  updateLead,
  recordAuditEvent,
} from "./crm.lead.repository";
import { normalizePhone } from "@/utils/normalization";
import { db } from "@repo/db";
import { leads } from "@repo/db/schema";
import { eq } from "drizzle-orm";

const VALID_OUTCOMES = [
  "session_booked",
  "scheduled",
  "completed",
  "enrolled",
  "follow_up",
  "not_interested",
  "no_response",
  "cancelled",
  "no_show",
];

const VALID_SOURCES = ["walk_in", "phone", "referral"];

/**
 * Get scoped counselling sessions with summary statistics.
 */
export async function getCounsellingSessionsService({
  userScope = {},
  query = {},
} = {}) {
  const {
    startDate,
    endDate,
    source,
    outcome,
    counselorId,
    bookedById,
    search,
    phone,
    page = 1,
    limit = 25,
  } = query;

  const numLimit = Math.min(Math.max(parseInt(limit, 10) || 25, 1), 100);
  const numPage = Math.max(parseInt(page, 10) || 1, 1);
  const offset = (numPage - 1) * numLimit;

  // Determine user scoping
  let targetCounselorId = counselorId;
  let targetBookedById = bookedById;

  if (userScope.scopedToUser && userScope.userId) {
    targetCounselorId = userScope.userId;
  }

  const result = await findCounsellingSessions({
    counselorId: targetCounselorId,
    bookedById: targetBookedById,
    startDate,
    endDate,
    source,
    outcome,
    search,
    phone,
    limit: numLimit,
    offset,
  });

  return {
    sessions: result.sessions,
    pagination: {
      total: result.total,
      page: numPage,
      limit: numLimit,
      totalPages: Math.ceil(result.total / numLimit) || 1,
    },
    summary: result.summary,
  };
}

/**
 * Get detailed session with audit and reschedule history.
 */
export async function getCounsellingSessionByIdService(id) {
  const session = await findCounsellingSessionById(id);
  if (!session) {
    throw new Error("Counselling session not found");
  }

  const auditEvents = await findAuditEventsForSession(id);

  return {
    ...session,
    history: auditEvents,
  };
}

/**
 * Book / Log a counselling session and synchronize with canonical lead.
 */
export async function createCounsellingSessionService(
  payload,
  actorUserId,
  requestId
) {
  const {
    studentName,
    phone,
    ageOrClass,
    courseInterest,
    source = "walk_in",
    outcome = "session_booked",
    notes,
    sessionDate,
    nextFollowUpDate,
    counselorId,
    leadId,
  } = payload;

  if (!studentName?.trim()) {
    throw new Error("Student name is required");
  }

  if (!sessionDate) {
    throw new Error("Session date is required (YYYY-MM-DD)");
  }

  const normalizedPhone = phone ? normalizePhone(phone) : null;
  const finalCounselorId = counselorId || actorUserId;

  const created = await insertCounsellingSessionRecord({
    counselorId: finalCounselorId,
    bookedById: actorUserId,
    studentName: studentName.trim(),
    phone: normalizedPhone,
    ageOrClass: ageOrClass || null,
    courseInterest: courseInterest || null,
    source: VALID_SOURCES.includes(source) ? source : "walk_in",
    outcome: VALID_OUTCOMES.includes(outcome) ? outcome : "session_booked",
    notes: notes || null,
    sessionDate,
    nextFollowUpDate: nextFollowUpDate || null,
  });

  // Record audit event for session creation
  await recordAuditEvent({
    actorUserId,
    action: "COUNSELLING_SESSION_SCHEDULED",
    entityType: "counselling_session",
    entityId: created.id,
    reason: notes || `Session booked with counselor`,
    afterSnapshot: created,
    requestId,
  });

  // Check if there is an associated lead to link
  let linkedLead = null;
  if (leadId) {
    linkedLead = await findLeadById(leadId);
  } else if (normalizedPhone) {
    const [matching] = await db
      .select()
      .from(leads)
      .where(eq(leads.normalizedPhone, normalizedPhone))
      .limit(1);
    linkedLead = matching || null;
  }

  if (linkedLead) {
    // Record audit event on lead timeline
    await recordAuditEvent({
      actorUserId,
      action: "COUNSELLING_SESSION_SCHEDULED",
      entityType: "lead",
      entityId: linkedLead.id,
      reason: `Counselling session scheduled for ${sessionDate}`,
      afterSnapshot: {
        sessionId: created.id,
        sessionDate,
        counselorId: finalCounselorId,
        studentName,
        courseInterest,
      },
      requestId,
    });

    // Advance lead status if new or contacted
    if (["new", "contacted", "follow_up"].includes(linkedLead.status)) {
      await updateLead(linkedLead.id, {
        status: "counselling_scheduled",
      });
    }
  }

  return created;
}

/**
 * Reschedule a counselling session, updating sessionDate while preserving complete history.
 */
export async function rescheduleCounsellingSessionService(
  id,
  { newDate, reason = "Rescheduled by counsellor" },
  actorUserId,
  requestId
) {
  if (!newDate) {
    throw new Error("New session date is required (YYYY-MM-DD)");
  }

  const existing = await findCounsellingSessionById(id);
  if (!existing) {
    throw new Error("Counselling session not found");
  }

  const prevDate = existing.sessionDate;

  // Append reschedule note to notes
  const rescheduleLog = `[Rescheduled on ${new Date().toLocaleDateString("en-GB")}: from ${prevDate} to ${newDate} - Reason: ${reason}]`;
  const updatedNotes = existing.notes
    ? `${existing.notes}\n${rescheduleLog}`
    : rescheduleLog;

  const [updated] = await updateCounsellingSessionRecord(id, {
    sessionDate: newDate,
    notes: updatedNotes,
  });

  // Record audit event preserving previous time, new time, actor, and reason
  await recordAuditEvent({
    actorUserId,
    action: "COUNSELLING_SESSION_RESCHEDULED",
    entityType: "counselling_session",
    entityId: id,
    reason,
    beforeSnapshot: {
      sessionDate: prevDate,
    },
    afterSnapshot: {
      sessionDate: newDate,
      reason,
      rescheduledAt: new Date().toISOString(),
    },
    requestId,
  });

  // If lead is linked, also append to lead audit history
  if (existing.leadId) {
    await recordAuditEvent({
      actorUserId,
      action: "COUNSELLING_SESSION_RESCHEDULED",
      entityType: "lead",
      entityId: existing.leadId,
      reason: `Counselling session rescheduled from ${prevDate} to ${newDate}: ${reason}`,
      afterSnapshot: {
        sessionId: id,
        previousDate: prevDate,
        newDate,
        reason,
      },
      requestId,
    });
  }

  return updated;
}

/**
 * Transition session status / outcome and update lead lifecycle & EOD relevance.
 */
export async function updateCounsellingStatusService(
  id,
  { outcome, notes, nextFollowUpDate },
  actorUserId,
  requestId
) {
  if (!outcome || !VALID_OUTCOMES.includes(outcome)) {
    throw new Error(`Invalid outcome. Expected one of: ${VALID_OUTCOMES.join(", ")}`);
  }

  const existing = await findCounsellingSessionById(id);
  if (!existing) {
    throw new Error("Counselling session not found");
  }

  const updateFields = {
    outcome,
    notes: notes !== undefined ? notes : existing.notes,
  };

  if (nextFollowUpDate !== undefined) {
    updateFields.nextFollowUpDate = outcome === "follow_up" ? nextFollowUpDate : null;
  }

  const [updated] = await updateCounsellingSessionRecord(id, updateFields);

  const isCompleted = outcome === "completed" || outcome === "enrolled";

  // Record audit event
  await recordAuditEvent({
    actorUserId,
    action: isCompleted ? "COUNSELLING_SESSION_COMPLETED" : "COUNSELLING_SESSION_STATUS_CHANGED",
    entityType: "counselling_session",
    entityId: id,
    reason: notes || `Outcome set to ${outcome}`,
    beforeSnapshot: {
      outcome: existing.outcome,
      notes: existing.notes,
    },
    afterSnapshot: {
      outcome,
      notes: updateFields.notes,
      eodAttributed: isCompleted,
    },
    requestId,
  });

  // Sync with canonical lead if present
  if (existing.leadId) {
    let nextLeadStatus = undefined;

    if (outcome === "enrolled") {
      nextLeadStatus = "converted";
    } else if (outcome === "completed") {
      nextLeadStatus = "counselled";
    } else if (outcome === "follow_up") {
      nextLeadStatus = "follow_up";
    } else if (outcome === "not_interested") {
      nextLeadStatus = "lost";
    }

    if (nextLeadStatus && nextLeadStatus !== existing.leadStatus) {
      await updateLead(existing.leadId, { status: nextLeadStatus });
    }

    await recordAuditEvent({
      actorUserId,
      action: isCompleted ? "COUNSELLING_SESSION_COMPLETED" : "COUNSELLING_SESSION_STATUS_CHANGED",
      entityType: "lead",
      entityId: existing.leadId,
      reason: `Counselling session outcome: ${outcome}`,
      afterSnapshot: {
        sessionId: id,
        outcome,
        leadStatus: nextLeadStatus || existing.leadStatus,
      },
      requestId,
    });
  }

  return updated;
}

/**
 * Delete session record (Admin only).
 */
export async function deleteCounsellingSessionService(id, actorUserId, requestId) {
  const existing = await findCounsellingSessionById(id);
  if (!existing) {
    throw new Error("Counselling session not found");
  }

  const [deleted] = await deleteCounsellingSessionRecord(id);

  await recordAuditEvent({
    actorUserId,
    action: "COUNSELLING_SESSION_DELETED",
    entityType: "counselling_session",
    entityId: id,
    reason: "Session deleted by admin",
    beforeSnapshot: existing,
    requestId,
  });

  return deleted;
}
