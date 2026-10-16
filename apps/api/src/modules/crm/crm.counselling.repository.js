import { db } from "@repo/db";
import { counsellingSessions, users, leads, crmAuditEvents } from "@repo/db/schema";
import { eq, desc, and, or, ilike, gte, lte, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

const bookedByUser = alias(users, "booked_by_user");

/**
 * Retrieve counselling sessions with optional filtering, search, pagination, and lead linkage.
 */
export async function findCounsellingSessions({
  counselorId,
  bookedById,
  startDate,
  endDate,
  source,
  outcome,
  search,
  phone,
  limit = 50,
  offset = 0,
} = {}) {
  const conditions = [];

  if (counselorId) {
    conditions.push(eq(counsellingSessions.counselorId, counselorId));
  }
  if (bookedById) {
    conditions.push(eq(counsellingSessions.bookedById, bookedById));
  }
  if (startDate) {
    conditions.push(gte(counsellingSessions.sessionDate, startDate));
  }
  if (endDate) {
    conditions.push(lte(counsellingSessions.sessionDate, endDate));
  }
  if (source) {
    conditions.push(eq(counsellingSessions.source, source));
  }
  if (outcome) {
    conditions.push(eq(counsellingSessions.outcome, outcome));
  }
  if (phone) {
    conditions.push(eq(counsellingSessions.phone, phone));
  }
  if (search) {
    const pattern = `%${search}%`;
    conditions.push(
      or(
        ilike(counsellingSessions.studentName, pattern),
        ilike(counsellingSessions.phone, pattern),
        ilike(counsellingSessions.courseInterest, pattern)
      )
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const rows = await db
    .select({
      id: counsellingSessions.id,
      counselorId: counsellingSessions.counselorId,
      counselorName: users.name,
      counselorEmail: users.email,
      bookedById: counsellingSessions.bookedById,
      bookedByName: bookedByUser.name,
      bookedByEmail: bookedByUser.email,
      studentName: counsellingSessions.studentName,
      phone: counsellingSessions.phone,
      ageOrClass: counsellingSessions.ageOrClass,
      courseInterest: counsellingSessions.courseInterest,
      source: counsellingSessions.source,
      outcome: counsellingSessions.outcome,
      notes: counsellingSessions.notes,
      sessionDate: counsellingSessions.sessionDate,
      nextFollowUpDate: counsellingSessions.nextFollowUpDate,
      imageKey: counsellingSessions.imageKey,
      createdAt: counsellingSessions.createdAt,
      // Canonical Lead Linkage (matching on phone)
      leadId: leads.id,
      leadFullName: leads.fullName,
      leadStatus: leads.status,
      leadAssignedToUserId: leads.assignedToUserId,
    })
    .from(counsellingSessions)
    .leftJoin(users, eq(counsellingSessions.counselorId, users.id))
    .leftJoin(bookedByUser, eq(counsellingSessions.bookedById, bookedByUser.id))
    .leftJoin(leads, eq(counsellingSessions.phone, leads.normalizedPhone))
    .where(whereClause)
    .orderBy(
      desc(counsellingSessions.sessionDate),
      desc(counsellingSessions.createdAt)
    )
    .limit(limit)
    .offset(offset);

  // Total count matching current filters
  const [totalRes] = await db
    .select({ count: sql`count(*)::int` })
    .from(counsellingSessions)
    .where(whereClause);

  // Summary counts
  const sourceStats = await db
    .select({
      source: counsellingSessions.source,
      count: sql`count(*)::int`,
    })
    .from(counsellingSessions)
    .groupBy(counsellingSessions.source);

  const outcomeStats = await db
    .select({
      outcome: counsellingSessions.outcome,
      count: sql`count(*)::int`,
    })
    .from(counsellingSessions)
    .groupBy(counsellingSessions.outcome);

  const bySource = {};
  sourceStats.forEach((s) => {
    if (s.source) bySource[s.source] = s.count;
  });

  const byOutcome = {};
  outcomeStats.forEach((o) => {
    if (o.outcome) byOutcome[o.outcome] = o.count;
  });

  const todayStr = new Date().toISOString().split("T")[0];

  const [todayRes] = await db
    .select({ count: sql`count(*)::int` })
    .from(counsellingSessions)
    .where(eq(counsellingSessions.sessionDate, todayStr));

  const [upcomingRes] = await db
    .select({ count: sql`count(*)::int` })
    .from(counsellingSessions)
    .where(
      and(
        gte(counsellingSessions.sessionDate, todayStr),
        or(
          eq(counsellingSessions.outcome, "session_booked"),
          eq(counsellingSessions.outcome, "follow_up")
        )
      )
    );

  const [completedRes] = await db
    .select({ count: sql`count(*)::int` })
    .from(counsellingSessions)
    .where(
      or(
        eq(counsellingSessions.outcome, "completed"),
        eq(counsellingSessions.outcome, "enrolled")
      )
    );

  const [enrolledRes] = await db
    .select({ count: sql`count(*)::int` })
    .from(counsellingSessions)
    .where(eq(counsellingSessions.outcome, "enrolled"));

  return {
    sessions: rows,
    total: totalRes?.count || 0,
    summary: {
      total: totalRes?.count || 0,
      today: todayRes?.count || 0,
      upcoming: upcomingRes?.count || 0,
      completed: completedRes?.count || 0,
      enrolled: enrolledRes?.count || 0,
      bySource,
      byOutcome,
    },
  };
}

/**
 * Retrieve a single counselling session by ID with counselor and lead context.
 */
export async function findCounsellingSessionById(id) {
  const [row] = await db
    .select({
      id: counsellingSessions.id,
      counselorId: counsellingSessions.counselorId,
      counselorName: users.name,
      counselorEmail: users.email,
      bookedById: counsellingSessions.bookedById,
      bookedByName: bookedByUser.name,
      bookedByEmail: bookedByUser.email,
      studentName: counsellingSessions.studentName,
      phone: counsellingSessions.phone,
      ageOrClass: counsellingSessions.ageOrClass,
      courseInterest: counsellingSessions.courseInterest,
      source: counsellingSessions.source,
      outcome: counsellingSessions.outcome,
      notes: counsellingSessions.notes,
      sessionDate: counsellingSessions.sessionDate,
      nextFollowUpDate: counsellingSessions.nextFollowUpDate,
      imageKey: counsellingSessions.imageKey,
      createdAt: counsellingSessions.createdAt,
      // Canonical Lead Linkage
      leadId: leads.id,
      leadFullName: leads.fullName,
      leadStatus: leads.status,
      leadAssignedToUserId: leads.assignedToUserId,
    })
    .from(counsellingSessions)
    .leftJoin(users, eq(counsellingSessions.counselorId, users.id))
    .leftJoin(bookedByUser, eq(counsellingSessions.bookedById, bookedByUser.id))
    .leftJoin(leads, eq(counsellingSessions.phone, leads.normalizedPhone))
    .where(eq(counsellingSessions.id, id));

  return row || null;
}

/**
 * Retrieve audit events for a specific counselling session.
 */
export async function findAuditEventsForSession(sessionId) {
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
        eq(crmAuditEvents.entityType, "counselling_session"),
        eq(crmAuditEvents.entityId, sessionId)
      )
    )
    .orderBy(desc(crmAuditEvents.createdAt));
}

/**
 * Insert a new counselling session record.
 */
export async function insertCounsellingSessionRecord({
  counselorId,
  bookedById,
  studentName,
  phone,
  ageOrClass,
  courseInterest,
  source = "walk_in",
  outcome = "session_booked",
  notes,
  sessionDate,
  nextFollowUpDate,
  imageKey,
}) {
  const [created] = await db
    .insert(counsellingSessions)
    .values({
      counselorId,
      bookedById: bookedById || null,
      studentName,
      phone: phone || null,
      ageOrClass: ageOrClass || null,
      courseInterest: courseInterest || null,
      source,
      outcome,
      notes: notes || null,
      sessionDate,
      nextFollowUpDate: nextFollowUpDate || null,
      imageKey: imageKey || null,
    })
    .returning();

  return created;
}

/**
 * Update a counselling session record.
 */
export async function updateCounsellingSessionRecord(id, updates) {
  const [updated] = await db
    .update(counsellingSessions)
    .set(updates)
    .where(eq(counsellingSessions.id, id))
    .returning();

  return updated;
}

/**
 * Delete a counselling session record.
 */
export async function deleteCounsellingSessionRecord(id) {
  const [deleted] = await db
    .delete(counsellingSessions)
    .where(eq(counsellingSessions.id, id))
    .returning();

  return deleted;
}

/**
 * Find counselling sessions for a given phone number (used in lead timeline).
 */
export async function findCounsellingSessionsForPhone(phone) {
  if (!phone) return [];

  return await db
    .select({
      id: counsellingSessions.id,
      studentName: counsellingSessions.studentName,
      phone: counsellingSessions.phone,
      courseInterest: counsellingSessions.courseInterest,
      source: counsellingSessions.source,
      outcome: counsellingSessions.outcome,
      notes: counsellingSessions.notes,
      sessionDate: counsellingSessions.sessionDate,
      nextFollowUpDate: counsellingSessions.nextFollowUpDate,
      counselorId: counsellingSessions.counselorId,
      counselorName: users.name,
      createdAt: counsellingSessions.createdAt,
    })
    .from(counsellingSessions)
    .leftJoin(users, eq(counsellingSessions.counselorId, users.id))
    .where(eq(counsellingSessions.phone, phone))
    .orderBy(desc(counsellingSessions.sessionDate), desc(counsellingSessions.createdAt));
}
