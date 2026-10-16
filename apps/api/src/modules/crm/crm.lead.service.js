import {
  findLeads,
  findLeadById,
  insertLead,
  updateLead,
  recordAuditEvent,
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
  return lead;
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
