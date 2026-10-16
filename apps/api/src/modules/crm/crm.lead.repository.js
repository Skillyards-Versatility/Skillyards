import { db } from "@repo/db";
import {
  leads,
  users,
  salesTeams,
  crmAuditEvents,
  enquiries,
  followUps,
} from "@repo/db/schema";
import { eq, desc, and, or, ilike, sql } from "drizzle-orm";

export async function findLeads({
  status,
  assignedToUserId,
  search,
  limit = 20,
  offset = 0,
} = {}) {
  const conditions = [];

  if (status) {
    conditions.push(eq(leads.status, status));
  }

  if (assignedToUserId) {
    conditions.push(eq(leads.assignedToUserId, assignedToUserId));
  }

  if (search) {
    const pattern = `%${search}%`;
    conditions.push(
      or(
        ilike(leads.fullName, pattern),
        ilike(leads.normalizedEmail, pattern),
        ilike(leads.normalizedPhone, pattern)
      )
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const data = await db
    .select({
      id: leads.id,
      fullName: leads.fullName,
      normalizedPhone: leads.normalizedPhone,
      normalizedEmail: leads.normalizedEmail,
      status: leads.status,
      assignedToUserId: leads.assignedToUserId,
      assignedToUserName: users.name,
      assignedTeamId: leads.assignedTeamId,
      assignedTeamName: salesTeams.name,
      version: leads.version,
      createdAt: leads.createdAt,
      updatedAt: leads.updatedAt,
    })
    .from(leads)
    .leftJoin(users, eq(leads.assignedToUserId, users.id))
    .leftJoin(salesTeams, eq(leads.assignedTeamId, salesTeams.id))
    .where(whereClause)
    .orderBy(desc(leads.createdAt))
    .limit(limit)
    .offset(offset);

  const [totalRes] = await db
    .select({ count: sql`count(*)::int` })
    .from(leads)
    .where(whereClause);

  return {
    leads: data,
    total: totalRes?.count || 0,
    limit,
    offset,
  };
}

export async function findLeadById(id) {
  const [lead] = await db
    .select({
      id: leads.id,
      fullName: leads.fullName,
      normalizedPhone: leads.normalizedPhone,
      normalizedEmail: leads.normalizedEmail,
      status: leads.status,
      assignedToUserId: leads.assignedToUserId,
      assignedToUserName: users.name,
      assignedTeamId: leads.assignedTeamId,
      assignedTeamName: salesTeams.name,
      convertedStudentId: leads.convertedStudentId,
      convertedAt: leads.convertedAt,
      version: leads.version,
      createdAt: leads.createdAt,
      updatedAt: leads.updatedAt,
    })
    .from(leads)
    .leftJoin(users, eq(leads.assignedToUserId, users.id))
    .leftJoin(salesTeams, eq(leads.assignedTeamId, salesTeams.id))
    .where(eq(leads.id, id));

  return lead || null;
}

export async function insertLead(leadData) {
  const [created] = await db
    .insert(leads)
    .values({
      fullName: leadData.fullName,
      normalizedPhone: leadData.normalizedPhone,
      normalizedEmail: leadData.normalizedEmail,
      status: leadData.status || "new",
      assignedToUserId: leadData.assignedToUserId || null,
      assignedTeamId: leadData.assignedTeamId || null,
    })
    .returning();

  return created;
}

export async function updateLead(id, updateData) {
  const [updated] = await db
    .update(leads)
    .set({
      ...updateData,
      updatedAt: new Date(),
      version: sql`${leads.version} + 1`,
    })
    .where(eq(leads.id, id))
    .returning();

  return updated;
}

export async function recordAuditEvent({
  actorUserId,
  action,
  entityType,
  entityId,
  reason,
  beforeSnapshot,
  afterSnapshot,
  requestId,
}) {
  try {
    await db.insert(crmAuditEvents).values({
      actorUserId: actorUserId || null,
      action,
      entityType,
      entityId,
      reason: reason || null,
      beforeSnapshot: beforeSnapshot ? JSON.stringify(beforeSnapshot) : null,
      afterSnapshot: afterSnapshot ? JSON.stringify(afterSnapshot) : null,
      requestId: requestId || null,
    });
  } catch (err) {
    console.error("Failed to insert CRM audit event:", err);
  }
}

export async function findEnquiriesForLead({ leadId, normalizedPhone, normalizedEmail }) {
  const conditions = [];
  if (leadId) {
    conditions.push(eq(enquiries.leadId, leadId));
  }
  if (normalizedPhone) {
    conditions.push(eq(enquiries.normalizedPhone, normalizedPhone));
  }
  if (normalizedEmail) {
    conditions.push(eq(enquiries.normalizedEmail, normalizedEmail));
  }
  if (conditions.length === 0) return [];

  return await db
    .select({
      id: enquiries.id,
      firstName: enquiries.firstName,
      lastName: enquiries.lastName,
      email: enquiries.email,
      phone: enquiries.phone,
      message: enquiries.message,
      status: enquiries.status,
      processingStatus: enquiries.processingStatus,
      createdAt: enquiries.createdAt,
    })
    .from(enquiries)
    .where(or(...conditions))
    .orderBy(desc(enquiries.createdAt));
}

export async function findAuditEventsForLead(leadId) {
  return await db
    .select({
      id: crmAuditEvents.id,
      action: crmAuditEvents.action,
      entityType: crmAuditEvents.entityType,
      entityId: crmAuditEvents.entityId,
      actorUserId: crmAuditEvents.actorUserId,
      actorName: users.name,
      reason: crmAuditEvents.reason,
      beforeSnapshot: crmAuditEvents.beforeSnapshot,
      afterSnapshot: crmAuditEvents.afterSnapshot,
      createdAt: crmAuditEvents.createdAt,
    })
    .from(crmAuditEvents)
    .leftJoin(users, eq(crmAuditEvents.actorUserId, users.id))
    .where(
      and(
        eq(crmAuditEvents.entityType, "lead"),
        eq(crmAuditEvents.entityId, leadId)
      )
    )
    .orderBy(desc(crmAuditEvents.createdAt));
}

export async function findCallLogsForPhone(phone) {
  if (!phone) return [];
  return await db
    .select({
      id: followUps.id,
      leadPhone: followUps.leadPhone,
      telecallerId: followUps.telecallerId,
      telecallerName: users.name,
      duration: followUps.duration,
      outcome: followUps.outcome,
      type: followUps.type,
      notes: followUps.analysis,
      contactedAt: followUps.contactedAt,
      createdAt: followUps.createdAt,
    })
    .from(followUps)
    .leftJoin(users, eq(followUps.telecallerId, users.id))
    .where(eq(followUps.leadPhone, phone))
    .orderBy(desc(followUps.contactedAt));
}

export async function insertCallLogRecord({
  leadPhone,
  telecallerId,
  duration = 60,
  outcome = "reached",
  notes = "",
  callbackAt = null,
}) {
  const [created] = await db
    .insert(followUps)
    .values({
      leadPhone,
      telecallerId,
      duration: parseInt(duration, 10) || 60,
      outcome,
      type: "call",
      contactedAt: new Date(),
      analysis: {
        notes,
        callbackAt: callbackAt ? new Date(callbackAt).toISOString() : null,
      },
    })
    .returning();

  return created;
}

export async function findAssignableStaff() {
  return await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      team: users.team,
    })
    .from(users)
    .orderBy(users.name);
}
