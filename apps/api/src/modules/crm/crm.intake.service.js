import crypto from "crypto";
import { normalizePhone, normalizeEmail } from "@/utils/normalization";
import {
  findCandidateLeadsByContact,
  insertEnquiryWithCrmFields,
  insertDuplicateReview,
  findDuplicateReviews,
  findDuplicateReviewById,
  updateDuplicateReview,
  insertMergeHistory,
  findIdempotencyRecord,
  saveIdempotencyRecord,
} from "./crm.intake.repository";
import { insertLead, updateLead, recordAuditEvent, findLeadById } from "./crm.lead.repository";
import { autoAssignLeadService } from "./crm.assignment.service";

/**
 * Ingest enquiry from website or API with contact normalization & deduplication
 */
export async function ingestEnquiryService(enquiryData, options = {}) {
  const { idempotencyKey, channel = "website" } = options;

  // 1. Check Idempotency Key if provided
  let requestHash = null;
  if (idempotencyKey) {
    requestHash = crypto
      .createHash("sha256")
      .update(
        JSON.stringify({
          email: enquiryData.email,
          phone: enquiryData.phone,
          message: enquiryData.message,
        })
      )
      .digest("hex");

    const existingIdemp = await findIdempotencyRecord("intake", idempotencyKey);
    if (existingIdemp) {
      if (existingIdemp.requestHash === requestHash) {
        return existingIdemp.responseSnapshot;
      }
      throw new Error("Idempotency key reused with different request payload");
    }
  }

  // 2. Normalize Contact Information
  const normalizedPhone = normalizePhone(enquiryData.phone);
  const normalizedEmail = normalizeEmail(enquiryData.email);
  const fullName = `${enquiryData.firstName || ""} ${enquiryData.lastName || ""}`.trim() || "Web Prospect";

  // 3. Search for Candidate Active Leads
  const candidates = await findCandidateLeadsByContact({
    normalizedPhone,
    normalizedEmail,
  });

  const phoneMatches = normalizedPhone
    ? candidates.filter((c) => c.normalizedPhone === normalizedPhone)
    : [];
  const emailMatches = normalizedEmail
    ? candidates.filter((c) => c.normalizedEmail === normalizedEmail)
    : [];

  let result = null;

  // ── Scenario A: Exact match on BOTH phone and email (Strongest deterministic match)
  const exactMatch = candidates.find(
    (c) =>
      c.normalizedPhone &&
      c.normalizedEmail &&
      c.normalizedPhone === normalizedPhone &&
      c.normalizedEmail === normalizedEmail
  );

  if (exactMatch) {
    // Auto-associate to existing canonical lead
    const createdEnquiry = await insertEnquiryWithCrmFields({
      ...enquiryData,
      leadId: exactMatch.id,
      normalizedPhone,
      normalizedEmail,
      processingStatus: "associated",
      processedAt: new Date(),
    });

    // Touch lead updatedAt
    await updateLead(exactMatch.id, {});

    await recordAuditEvent({
      action: "ENQUIRY_AUTO_ASSOCIATED",
      entityType: "lead",
      entityId: exactMatch.id,
      reason: "Exact phone and email matched existing lead",
      afterSnapshot: {
        enquiryId: createdEnquiry.id,
        channel,
      },
    });

    result = {
      enquiry: createdEnquiry,
      leadId: exactMatch.id,
      isNewLead: false,
      duplicateStatus: "none",
    };
  } else if (phoneMatches.length === 0 && emailMatches.length === 0) {
    // ── Scenario B: No match on either phone or email (Create new canonical lead)
    const newLead = await insertLead({
      fullName,
      normalizedPhone,
      normalizedEmail,
      status: "new",
    });

    const createdEnquiry = await insertEnquiryWithCrmFields({
      ...enquiryData,
      leadId: newLead.id,
      normalizedPhone,
      normalizedEmail,
      processingStatus: "associated",
      processedAt: new Date(),
    });

    await recordAuditEvent({
      action: "LEAD_CREATED",
      entityType: "lead",
      entityId: newLead.id,
      reason: `Intake from ${channel} submission`,
      afterSnapshot: {
        lead: newLead,
        enquiryId: createdEnquiry.id,
      },
    });

    // Auto-assign new lead using capacity-aware round-robin engine
    let assignmentResult = null;
    try {
      assignmentResult = await autoAssignLeadService(newLead.id);
    } catch (assignErr) {
      console.error("Auto assignment error:", assignErr);
    }

    result = {
      enquiry: createdEnquiry,
      leadId: newLead.id,
      isNewLead: true,
      duplicateStatus: "none",
      assignment: assignmentResult,
    };
  } else if (
    phoneMatches.length > 0 &&
    emailMatches.length > 0 &&
    phoneMatches[0].id !== emailMatches[0].id
  ) {
    // ── Scenario C: High-risk collision (Phone matches Lead A, Email matches Lead B)
    const createdEnquiry = await insertEnquiryWithCrmFields({
      ...enquiryData,
      leadId: null, // do not link to either without human review
      normalizedPhone,
      normalizedEmail,
      processingStatus: "needs_review",
      processedAt: new Date(),
    });

    const review = await insertDuplicateReview({
      enquiryId: createdEnquiry.id,
      candidateLeadId: phoneMatches[0].id,
      confidenceCategory: "high",
      matchingEvidence: {
        conflictType: "phone_email_split",
        phoneMatchLeadId: phoneMatches[0].id,
        phoneMatchLeadName: phoneMatches[0].fullName,
        emailMatchLeadId: emailMatches[0].id,
        emailMatchLeadName: emailMatches[0].fullName,
        submittedPhone: normalizedPhone,
        submittedEmail: normalizedEmail,
      },
      status: "pending",
    });

    await recordAuditEvent({
      action: "DUPLICATE_COLLISION_FLAGGED",
      entityType: "lead",
      entityId: phoneMatches[0].id,
      reason: "Submitted phone and email point to different leads",
      afterSnapshot: {
        reviewId: review.id,
        enquiryId: createdEnquiry.id,
      },
    });

    result = {
      enquiry: createdEnquiry,
      leadId: null,
      isNewLead: false,
      duplicateStatus: "collision_review_required",
      reviewId: review.id,
    };
  } else {
    // ── Scenario D: Single-field match (Phone matches OR Email matches, but other field is missing or differs)
    const candidate = phoneMatches[0] || emailMatches[0];

    const createdEnquiry = await insertEnquiryWithCrmFields({
      ...enquiryData,
      leadId: candidate.id,
      normalizedPhone,
      normalizedEmail,
      processingStatus: "needs_review",
      processedAt: new Date(),
    });

    const matchedField = phoneMatches.length > 0 ? "phone" : "email";

    const review = await insertDuplicateReview({
      enquiryId: createdEnquiry.id,
      candidateLeadId: candidate.id,
      confidenceCategory: "medium",
      matchingEvidence: {
        matchType: `${matchedField}_only`,
        matchedField,
        candidateName: candidate.fullName,
        submittedName: fullName,
        candidatePhone: candidate.normalizedPhone,
        candidateEmail: candidate.normalizedEmail,
        submittedPhone: normalizedPhone,
        submittedEmail: normalizedEmail,
      },
      status: "pending",
    });

    await recordAuditEvent({
      action: "DUPLICATE_CANDIDATE_FLAGGED",
      entityType: "lead",
      entityId: candidate.id,
      reason: `Single contact field (${matchedField}) matched existing lead`,
      afterSnapshot: {
        reviewId: review.id,
        enquiryId: createdEnquiry.id,
      },
    });

    result = {
      enquiry: createdEnquiry,
      leadId: candidate.id,
      isNewLead: false,
      duplicateStatus: "needs_review",
      reviewId: review.id,
    };
  }

  // 4. Save Idempotency Result if requested
  if (idempotencyKey && requestHash) {
    await saveIdempotencyRecord({
      scope: "intake",
      idempotencyKey,
      requestHash,
      resourceType: "enquiry",
      resourceId: result.enquiry?.id,
      responseStatus: 201,
      responseSnapshot: result,
    });
  }

  return result;
}

/**
 * Get duplicate reviews for manager queue
 */
export async function getDuplicateReviewsService({ status = "pending" } = {}) {
  return await findDuplicateReviews({ status });
}

/**
 * Resolve duplicate review case
 */
export async function resolveDuplicateReviewService(reviewId, resolution, actorUserId) {
  const review = await findDuplicateReviewById(reviewId);
  if (!review) {
    throw new Error("Duplicate review case not found");
  }

  const { decision, reason = "Manual review decision" } = resolution;
  // decision: 'confirm_same' | 'confirm_separate' | 'merge_leads'

  if (decision === "confirm_same") {
    // Confirmed to be the same prospect
    await updateDuplicateReview(reviewId, {
      status: "resolved_existing_lead",
      resolvedByUserId: actorUserId,
      resolutionReason: reason,
      resolvedAt: new Date(),
    });

    await recordAuditEvent({
      actorUserId,
      action: "DUPLICATE_CONFIRMED_SAME",
      entityType: "lead",
      entityId: review.candidateLeadId,
      reason,
      afterSnapshot: { reviewId },
    });

    return { success: true, status: "resolved_existing_lead" };
  } else if (decision === "confirm_separate") {
    // Confirmed to be a completely different person
    // Create new lead if the enquiry was unlinked or needs to be detached
    await updateDuplicateReview(reviewId, {
      status: "resolved_new_lead",
      resolvedByUserId: actorUserId,
      resolutionReason: reason,
      resolvedAt: new Date(),
    });

    await recordAuditEvent({
      actorUserId,
      action: "DUPLICATE_CONFIRMED_SEPARATE",
      entityType: "lead",
      entityId: review.candidateLeadId,
      reason,
      afterSnapshot: { reviewId },
    });

    return { success: true, status: "resolved_new_lead" };
  } else if (decision === "merge_leads") {
    const { sourceLeadId, survivingLeadId } = resolution;
    if (!sourceLeadId || !survivingLeadId) {
      throw new Error("Both sourceLeadId and survivingLeadId are required for merge");
    }

    const sourceLead = await findLeadById(sourceLeadId);
    if (!sourceLead) {
      throw new Error("Source lead not found");
    }

    await insertMergeHistory({
      sourceLeadId,
      survivingLeadId,
      mergedByUserId: actorUserId,
      reason,
      sourceSnapshot: sourceLead,
    });

    await updateDuplicateReview(reviewId, {
      status: "resolved_existing_lead",
      resolvedByUserId: actorUserId,
      resolutionReason: `Merged into lead ${survivingLeadId}: ${reason}`,
      resolvedAt: new Date(),
    });

    await recordAuditEvent({
      actorUserId,
      action: "LEAD_MERGED",
      entityType: "lead",
      entityId: survivingLeadId,
      reason,
      afterSnapshot: { sourceLeadId, survivingLeadId },
    });

    return { success: true, status: "merged" };
  } else {
    throw new Error(`Unsupported resolution decision: ${decision}`);
  }
}
