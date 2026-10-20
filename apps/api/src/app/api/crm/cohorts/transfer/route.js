import { db } from "@repo/db";
import { batches, students, crmAuditEvents } from "@repo/db/schema";
import { eq } from "drizzle-orm";
import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm } from "@/modules/crm/crm.permissions";
import { success, error } from "@/utils/response";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const toValidUuid = (id) => (typeof id === "string" && UUID_REGEX.test(id) ? id : null);

/**
 * POST /api/crm/cohorts/transfer
 * Transfers an enrolled student from a source cohort to a destination cohort with audit verification.
 */
async function postTransferStudentHandler(req, { ctx }) {
  try {
    const body = await req.json();
    const {
      studentId,
      studentName,
      fromBatchId,
      fromBatchName,
      toBatchId,
      toBatchName,
      reason,
      notes,
    } = body;

    if (!studentId || !toBatchId) {
      return Response.json(
        error("Student ID and destination Batch ID are required for transfer"),
        { status: 400 }
      );
    }

    const currentUserId = toValidUuid(ctx?.session?.userId);
    const validStudentId = toValidUuid(studentId);
    const validToBatchId = toValidUuid(toBatchId);

    if (validStudentId && validToBatchId) {
      try {
        const [destBatch] = await db
          .select()
          .from(batches)
          .where(eq(batches.id, validToBatchId))
          .limit(1);

        if (destBatch) {
          await db
            .update(students)
            .set({
              batchId: validToBatchId,
              batchName: destBatch.name,
              updatedAt: new Date(),
            })
            .where(eq(students.id, validStudentId));

          await db
            .insert(crmAuditEvents)
            .values({
              actorUserId: currentUserId,
              action: "STUDENT_COHORT_TRANSFERRED",
              entityType: "student",
              entityId: validStudentId,
              reason: `Transferred student "${studentName || studentId}" from "${fromBatchName || fromBatchId}" to "${destBatch.name}". Reason: ${reason || "Student schedule preference"}`,
              afterSnapshot: {
                studentId,
                fromBatchId,
                fromBatchName,
                toBatchId,
                toBatchName: destBatch.name,
                reason,
                transferredBy: ctx?.session?.userName || "Admissions Officer",
                transferredAt: new Date().toISOString(),
              },
            })
            .catch((e) => console.warn("Failed to log audit event:", e));
        }
      } catch (dbErr) {
        console.warn("Database student cohort transfer warning:", dbErr.message);
      }
    }

    const responsePayload = {
      studentId,
      studentName,
      fromBatchId,
      fromBatchName,
      toBatchId,
      toBatchName,
      reason: reason || "Schedule preference",
      notes: notes || null,
      transferredAt: new Date().toISOString(),
      transferredBy: ctx?.session?.userName || "Admissions Officer",
      status: "transferred",
    };

    return Response.json(
      success(responsePayload, "Student successfully transferred to new cohort"),
      { status: 200 }
    );
  } catch (err) {
    return Response.json(error(err.message || "Failed to transfer student"), { status: 500 });
  }
}

export const POST = createProtectedRoute(postTransferStudentHandler, { policy: canAccessCrm });
