import { db } from "@repo/db";
import { followUps, users, leads, crmAuditEvents } from "@repo/db/schema";
import { eq, desc, sql, and } from "drizzle-orm";

/**
 * Find all follow-up tasks with callback schedules, enriched with lead and telecaller info
 */
export async function findFollowUpTasks({ userId = null } = {}) {
  const conditions = [
    sql`jsonb_extract_path_text(${followUps.analysis}, 'callbackAt') IS NOT NULL`,
  ];

  if (userId) {
    conditions.push(eq(followUps.telecallerId, userId));
  }

  const rows = await db
    .select({
      id: followUps.id,
      leadPhone: followUps.leadPhone,
      telecallerId: followUps.telecallerId,
      telecallerName: users.name,
      telecallerEmail: users.email,
      duration: followUps.duration,
      outcome: followUps.outcome,
      contactedAt: followUps.contactedAt,
      analysis: followUps.analysis,
      createdAt: followUps.createdAt,
      // Lead info
      leadId: leads.id,
      leadFullName: leads.fullName,
      leadStatus: leads.status,
      leadNormalizedEmail: leads.normalizedEmail,
    })
    .from(followUps)
    .leftJoin(users, eq(followUps.telecallerId, users.id))
    .leftJoin(leads, eq(followUps.leadPhone, leads.normalizedPhone))
    .where(and(...conditions))
    .orderBy(desc(followUps.createdAt));

  return rows;
}

/**
 * Find a specific follow-up by ID
 */
export async function findFollowUpById(id) {
  const [row] = await db
    .select({
      id: followUps.id,
      leadPhone: followUps.leadPhone,
      telecallerId: followUps.telecallerId,
      analysis: followUps.analysis,
      createdAt: followUps.createdAt,
      leadId: leads.id,
      leadFullName: leads.fullName,
    })
    .from(followUps)
    .leftJoin(leads, eq(followUps.leadPhone, leads.normalizedPhone))
    .where(eq(followUps.id, id));

  return row || null;
}

/**
 * Update the follow-up record analysis (notes, status, reschedule)
 */
export async function updateFollowUpAnalysis(id, newAnalysisData) {
  const existing = await findFollowUpById(id);
  if (!existing) {
    throw new Error("Follow-up task not found");
  }

  const mergedAnalysis = {
    ...(typeof existing.analysis === "object" ? existing.analysis : {}),
    ...newAnalysisData,
    updatedAt: new Date().toISOString(),
  };

  const [updated] = await db
    .update(followUps)
    .set({
      analysis: mergedAnalysis,
    })
    .where(eq(followUps.id, id))
    .returning();

  return updated;
}
