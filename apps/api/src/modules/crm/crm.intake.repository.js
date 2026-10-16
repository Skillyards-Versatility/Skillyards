import { db } from "@repo/db";
import {
  leads,
  enquiries,
  leadDuplicateReviews,
  leadMergeHistory,
  crmIdempotencyKeys,
  users,
} from "@repo/db/schema";
import { eq, or, and, isNull, desc, sql } from "drizzle-orm";

/**
 * Find active candidate leads matching normalized phone or email
 */
export async function findCandidateLeadsByContact({ normalizedPhone, normalizedEmail }) {
  const conditions = [];

  if (normalizedPhone) {
    conditions.push(eq(leads.normalizedPhone, normalizedPhone));
  }
  if (normalizedEmail) {
    conditions.push(eq(leads.normalizedEmail, normalizedEmail));
  }

  if (conditions.length === 0) return [];

  // Exclude already merged leads
  return await db
    .select({
      id: leads.id,
      fullName: leads.fullName,
      normalizedPhone: leads.normalizedPhone,
      normalizedEmail: leads.normalizedEmail,
      status: leads.status,
      assignedToUserId: leads.assignedToUserId,
      assignedTeamId: leads.assignedTeamId,
      createdAt: leads.createdAt,
    })
    .from(leads)
    .where(and(or(...conditions), isNull(leads.mergedIntoLeadId)));
}

/**
 * Insert enquiry with enriched CRM fields
 */
export async function insertEnquiryWithCrmFields(enquiryData) {
  const [created] = await db
    .insert(enquiries)
    .values({
      firstName: enquiryData.firstName,
      lastName: enquiryData.lastName || null,
      email: enquiryData.email,
      phone: enquiryData.phone || null,
      message: enquiryData.message,
      status: enquiryData.status || "new",
      leadId: enquiryData.leadId || null,
      normalizedPhone: enquiryData.normalizedPhone || null,
      normalizedEmail: enquiryData.normalizedEmail || null,
      processingStatus: enquiryData.processingStatus || "pending",
      processedAt: enquiryData.processedAt || new Date(),
    })
    .returning();

  return created;
}

/**
 * Insert duplicate review record
 */
export async function insertDuplicateReview({
  enquiryId,
  candidateLeadId,
  confidenceCategory,
  matchingEvidence,
  status = "pending",
}) {
  const [created] = await db
    .insert(leadDuplicateReviews)
    .values({
      enquiryId: enquiryId || null,
      candidateLeadId,
      confidenceCategory,
      matchingEvidence,
      status,
    })
    .returning();

  return created;
}

/**
 * List pending or filtered duplicate reviews
 */
export async function findDuplicateReviews({ status = "pending" } = {}) {
  const conditions = [];
  if (status) {
    conditions.push(eq(leadDuplicateReviews.status, status));
  }

  return await db
    .select({
      id: leadDuplicateReviews.id,
      enquiryId: leadDuplicateReviews.enquiryId,
      candidateLeadId: leadDuplicateReviews.candidateLeadId,
      candidateLeadName: leads.fullName,
      candidateLeadPhone: leads.normalizedPhone,
      candidateLeadEmail: leads.normalizedEmail,
      candidateLeadStatus: leads.status,
      confidenceCategory: leadDuplicateReviews.confidenceCategory,
      matchingEvidence: leadDuplicateReviews.matchingEvidence,
      status: leadDuplicateReviews.status,
      enquiryFirstName: enquiries.firstName,
      enquiryLastName: enquiries.lastName,
      enquiryPhone: enquiries.phone,
      enquiryEmail: enquiries.email,
      enquiryMessage: enquiries.message,
      createdAt: leadDuplicateReviews.createdAt,
    })
    .from(leadDuplicateReviews)
    .leftJoin(leads, eq(leadDuplicateReviews.candidateLeadId, leads.id))
    .leftJoin(enquiries, eq(leadDuplicateReviews.enquiryId, enquiries.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(leadDuplicateReviews.createdAt));
}

/**
 * Find a duplicate review by ID
 */
export async function findDuplicateReviewById(id) {
  const [review] = await db
    .select({
      id: leadDuplicateReviews.id,
      enquiryId: leadDuplicateReviews.enquiryId,
      candidateLeadId: leadDuplicateReviews.candidateLeadId,
      confidenceCategory: leadDuplicateReviews.confidenceCategory,
      matchingEvidence: leadDuplicateReviews.matchingEvidence,
      status: leadDuplicateReviews.status,
      version: leadDuplicateReviews.version,
    })
    .from(leadDuplicateReviews)
    .where(eq(leadDuplicateReviews.id, id));

  return review || null;
}

/**
 * Update a duplicate review
 */
export async function updateDuplicateReview(id, data) {
  const [updated] = await db
    .update(leadDuplicateReviews)
    .set({
      ...data,
      updatedAt: new Date(),
      version: sql`${leadDuplicateReviews.version} + 1`,
    })
    .where(eq(leadDuplicateReviews.id, id))
    .returning();

  return updated;
}

/**
 * Record a non-destructive lead merge
 */
export async function insertMergeHistory({
  sourceLeadId,
  survivingLeadId,
  mergedByUserId,
  reason,
  sourceSnapshot,
}) {
  const [record] = await db
    .insert(leadMergeHistory)
    .values({
      sourceLeadId,
      survivingLeadId,
      mergedByUserId,
      reason,
      sourceSnapshot,
    })
    .returning();

  // Flag source lead with mergedIntoLeadId
  await db
    .update(leads)
    .set({
      mergedIntoLeadId: survivingLeadId,
      updatedAt: new Date(),
    })
    .where(eq(leads.id, sourceLeadId));

  return record;
}

/**
 * Check idempotency cache
 */
export async function findIdempotencyRecord(scope, idempotencyKey) {
  const [record] = await db
    .select()
    .from(crmIdempotencyKeys)
    .where(
      and(
        eq(crmIdempotencyKeys.scope, scope),
        eq(crmIdempotencyKeys.idempotencyKey, idempotencyKey)
      )
    );

  return record || null;
}

/**
 * Store idempotency key result
 */
export async function saveIdempotencyRecord({
  scope,
  idempotencyKey,
  requestHash,
  resourceType,
  resourceId,
  responseStatus = 200,
  responseSnapshot,
  expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
}) {
  try {
    await db.insert(crmIdempotencyKeys).values({
      scope,
      idempotencyKey,
      requestHash,
      resourceType,
      resourceId,
      responseStatus,
      responseSnapshot,
      expiresAt,
    });
  } catch (err) {
    console.error("Failed to persist idempotency key:", err);
  }
}
