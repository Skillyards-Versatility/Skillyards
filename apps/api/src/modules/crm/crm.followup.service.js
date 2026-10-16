import {
  findFollowUpTasks,
  findFollowUpById,
  updateFollowUpAnalysis,
} from "./crm.followup.repository";
import { recordAuditEvent } from "./crm.lead.repository";

/**
 * Get prioritized follow-up tasks (Overdue, Due Today, Upcoming, Completed)
 */
export async function getFollowUpsService({ userId = null, filter = "all" } = {}) {
  const tasks = await findFollowUpTasks({ userId });

  const now = new Date();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const overdue = [];
  const dueToday = [];
  const upcoming = [];
  const completed = [];

  for (const t of tasks) {
    const rawAnalysis = typeof t.analysis === "object" ? t.analysis : {};
    const callbackAtStr = rawAnalysis.callbackAt;
    if (!callbackAtStr) continue;

    const callbackAt = new Date(callbackAtStr);
    const taskStatus = rawAnalysis.status || "pending";

    const enrichedTask = {
      id: t.id,
      leadId: t.leadId,
      leadFullName: t.leadFullName || "Unnamed Prospect",
      leadPhone: t.leadPhone,
      leadEmail: t.leadNormalizedEmail,
      leadStatus: t.leadStatus || "follow_up",
      telecallerId: t.telecallerId,
      telecallerName: t.telecallerName || "Sales Rep",
      callbackAt: callbackAt.toISOString(),
      notes: rawAnalysis.notes || "",
      completionNotes: rawAnalysis.completionNotes || null,
      rescheduleReason: rawAnalysis.rescheduleReason || null,
      status: taskStatus,
      createdAt: t.createdAt,
    };

    if (taskStatus === "completed") {
      completed.push(enrichedTask);
    } else if (callbackAt < startOfToday) {
      overdue.push(enrichedTask);
    } else if (callbackAt <= endOfToday) {
      dueToday.push(enrichedTask);
    } else {
      upcoming.push(enrichedTask);
    }
  }

  // Sort: overdue oldest first (most urgent), due today nearest first, upcoming chronological
  overdue.sort((a, b) => new Date(a.callbackAt) - new Date(b.callbackAt));
  dueToday.sort((a, b) => new Date(a.callbackAt) - new Date(b.callbackAt));
  upcoming.sort((a, b) => new Date(a.callbackAt) - new Date(b.callbackAt));
  completed.sort((a, b) => new Date(b.callbackAt) - new Date(a.callbackAt));

  return {
    counts: {
      overdue: overdue.length,
      dueToday: dueToday.length,
      upcoming: upcoming.length,
      completed: completed.length,
      totalActive: overdue.length + dueToday.length + upcoming.length,
    },
    overdue,
    dueToday,
    upcoming,
    completed,
  };
}

/**
 * Mark a follow-up task completed
 */
export async function completeFollowUpService(
  followUpId,
  { completionNotes = "Follow-up contact completed" },
  actorUserId
) {
  const existing = await findFollowUpById(followUpId);
  if (!existing) {
    throw new Error("Follow-up task not found");
  }

  const updated = await updateFollowUpAnalysis(followUpId, {
    status: "completed",
    completedAt: new Date().toISOString(),
    completionNotes,
  });

  if (existing.leadId) {
    await recordAuditEvent({
      actorUserId,
      action: "FOLLOW_UP_COMPLETED",
      entityType: "lead",
      entityId: existing.leadId,
      reason: completionNotes,
      afterSnapshot: {
        followUpId,
        completedAt: new Date().toISOString(),
        completionNotes,
      },
    });
  }

  return updated;
}

/**
 * Reschedule a follow-up task
 */
export async function rescheduleFollowUpService(
  followUpId,
  { newCallbackAt, reason = "Rescheduled by representative" },
  actorUserId
) {
  if (!newCallbackAt) {
    throw new Error("New callback date and time is required");
  }

  const existing = await findFollowUpById(followUpId);
  if (!existing) {
    throw new Error("Follow-up task not found");
  }

  const parsedDate = new Date(newCallbackAt);
  if (isNaN(parsedDate.getTime())) {
    throw new Error("Invalid callback schedule date");
  }

  const updated = await updateFollowUpAnalysis(followUpId, {
    callbackAt: parsedDate.toISOString(),
    status: "pending",
    rescheduleReason: reason,
    rescheduledAt: new Date().toISOString(),
  });

  if (existing.leadId) {
    await recordAuditEvent({
      actorUserId,
      action: "FOLLOW_UP_RESCHEDULED",
      entityType: "lead",
      entityId: existing.leadId,
      reason,
      afterSnapshot: {
        followUpId,
        newCallbackAt: parsedDate.toISOString(),
        rescheduleReason: reason,
      },
    });
  }

  return updated;
}
