import {
  findLeads,
  findLeadById,
  insertLead,
  updateLead,
  recordAuditEvent,
  findEnquiriesForLead,
  findAuditEventsForLead,
  findCallLogsForPhone,
  insertCallLogRecord,
  findAssignableStaff,
} from "./crm.lead.repository";
import { normalizePhone, normalizeEmail } from "@/utils/normalization";

const VALID_STATUSES = [
  "new",
  "contacted",
  "follow_up",
  "counselling_scheduled",
  "counselled",
  "qualified",
  "converted",
  "cold",
  "lost",
];

export async function getLeadsService({ query = {}, userScope = {} }) {
  const { status, search, page = 1, limit = 20 } = query;
  const numLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
  const numPage = Math.max(parseInt(page, 10) || 1, 1);
  const offset = (numPage - 1) * numLimit;

  // If user is restricted to own leads (e.g., standard BDA)
  const assignedToUserId = userScope.scopedToUser ? userScope.userId : undefined;

  const result = await findLeads({
    status,
    assignedToUserId,
    search,
    limit: numLimit,
    offset,
  });

  return {
    items: result.leads,
    pagination: {
      total: result.total,
      page: numPage,
      limit: numLimit,
      totalPages: Math.ceil(result.total / numLimit),
    },
  };
}

export async function getLeadByIdService(id) {
  const lead = await findLeadById(id);
  if (!lead) {
    throw new Error("Lead not found");
  }

  // Fetch linked enquiries
  const linkedEnquiries = await findEnquiriesForLead({
    leadId: lead.id,
    normalizedPhone: lead.normalizedPhone,
    normalizedEmail: lead.normalizedEmail,
  });

  // Fetch audit history
  const auditEvents = await findAuditEventsForLead(lead.id);

  // Fetch call logs
  const callLogs = lead.normalizedPhone
    ? await findCallLogsForPhone(lead.normalizedPhone)
    : [];

  // Build unified chronological timeline
  const timeline = [];

  // 1. Audit events
  for (const ev of auditEvents) {
    if (ev.action === "CALL_LOGGED") continue; // will be shown via callLogs to avoid duplication
    timeline.push({
      id: `audit-${ev.id}`,
      type: ev.action === "LEAD_STATUS_CHANGED" ? "status_change" : "audit",
      action: ev.action,
      title:
        ev.action === "LEAD_STATUS_CHANGED"
          ? `Status changed to ${ev.afterSnapshot?.status || "updated"}`
          : ev.action === "LEAD_CREATED"
          ? "Lead created"
          : ev.action.replace(/_/g, " "),
      actorName: ev.actorName || "System",
      reason: ev.reason,
      beforeSnapshot: ev.beforeSnapshot,
      afterSnapshot: ev.afterSnapshot,
      timestamp: ev.createdAt,
    });
  }

  // 2. Call logs
  for (const call of callLogs) {
    timeline.push({
      id: `call-${call.id}`,
      type: "call",
      title: `Call logged: ${call.outcome.replace(/_/g, " ")}`,
      actorName: call.telecallerName || "Sales Rep",
      outcome: call.outcome,
      duration: call.duration,
      notes: typeof call.notes === "object" ? call.notes?.notes || "" : call.notes || "",
      callbackAt: typeof call.notes === "object" ? call.notes?.callbackAt : null,
      timestamp: call.contactedAt || call.createdAt,
    });
  }

  // 3. Enquiry submissions
  for (const enq of linkedEnquiries) {
    timeline.push({
      id: `enquiry-${enq.id}`,
      type: "enquiry",
      title: "Website Enquiry Submitted",
      actorName: `${enq.firstName} ${enq.lastName || ""}`.trim(),
      message: enq.message,
      submittedEmail: enq.email,
      submittedPhone: enq.phone,
      timestamp: enq.createdAt,
    });
  }

  // Sort descending by timestamp
  timeline.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return {
    ...lead,
    enquiries: linkedEnquiries,
    timeline,
  };
}

export async function logLeadCallService(leadId, callData, telecallerId, requestId) {
  const lead = await findLeadById(leadId);
  if (!lead) {
    throw new Error("Lead not found");
  }

  const { outcome = "reached", duration = 60, notes = "", callbackAt } = callData;

  const phone = lead.normalizedPhone || "UNKNOWN";

  const callRecord = await insertCallLogRecord({
    leadPhone: phone,
    telecallerId,
    duration,
    outcome,
    notes,
    callbackAt,
  });

  // Optionally advance status if lead was new
  let newStatus = undefined;
  if (outcome === "callback_requested") {
    newStatus = "follow_up";
  } else if (lead.status === "new") {
    newStatus = "contacted";
  }

  if (newStatus && newStatus !== lead.status) {
    await updateLead(leadId, { status: newStatus });
  }

  await recordAuditEvent({
    actorUserId: telecallerId,
    action: "CALL_LOGGED",
    entityType: "lead",
    entityId: leadId,
    reason: notes || `Call outcome: ${outcome}`,
    afterSnapshot: {
      callId: callRecord.id,
      outcome,
      duration,
      notes,
      callbackAt,
      newStatus,
    },
    requestId,
  });

  return {
    call: callRecord,
    updatedStatus: newStatus || lead.status,
  };
}

export async function getAssignableStaffService() {
  return await findAssignableStaff();
}

export async function createLeadService(payload, actorUserId, requestId) {
  const fullName = payload.fullName?.trim() || payload.name?.trim();
  if (!fullName) {
    throw new Error("Lead full name is required");
  }

  const normalizedPhone = normalizePhone(payload.phone || payload.normalizedPhone);
  const normalizedEmail = normalizeEmail(payload.email || payload.normalizedEmail);

  if (!normalizedPhone && !normalizedEmail) {
    throw new Error("At least one valid phone or email is required");
  }

  const created = await insertLead({
    fullName,
    normalizedPhone,
    normalizedEmail,
    status: payload.status || "new",
    assignedToUserId: payload.assignedToUserId || null,
    assignedTeamId: payload.assignedTeamId || null,
  });

  await recordAuditEvent({
    actorUserId,
    action: "LEAD_CREATED",
    entityType: "lead",
    entityId: created.id,
    afterSnapshot: created,
    requestId,
  });

  return created;
}

export async function updateLeadService(id, payload, actorUserId, requestId) {
  const existing = await findLeadById(id);
  if (!existing) {
    throw new Error("Lead not found");
  }

  const updates = {};

  if (payload.fullName) {
    updates.fullName = payload.fullName.trim();
  }
  if (payload.phone) {
    updates.normalizedPhone = normalizePhone(payload.phone);
  }
  if (payload.email) {
    updates.normalizedEmail = normalizeEmail(payload.email);
  }
  if (payload.status) {
    if (!VALID_STATUSES.includes(payload.status)) {
      throw new Error(`Invalid status: ${payload.status}`);
    }
    updates.status = payload.status;
  }
  if (payload.assignedToUserId !== undefined) {
    updates.assignedToUserId = payload.assignedToUserId;
  }
  if (payload.assignedTeamId !== undefined) {
    updates.assignedTeamId = payload.assignedTeamId;
  }

  const updated = await updateLead(id, updates);

  await recordAuditEvent({
    actorUserId,
    action: payload.status && payload.status !== existing.status ? "LEAD_STATUS_CHANGED" : "LEAD_UPDATED",
    entityType: "lead",
    entityId: id,
    reason: payload.reason || "Manual update from CRM",
    beforeSnapshot: existing,
    afterSnapshot: updated,
    requestId,
  });

  return updated;
}
