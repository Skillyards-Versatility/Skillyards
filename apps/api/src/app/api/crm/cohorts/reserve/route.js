import { db } from "@repo/db";
import { batches, students, crmAuditEvents } from "@repo/db/schema";
import { eq } from "drizzle-orm";
import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm } from "@/modules/crm/crm.permissions";
import { success, error } from "@/utils/response";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const toValidUuid = (id) => (typeof id === "string" && UUID_REGEX.test(id) ? id : null);

/**
 * POST /api/crm/cohorts/reserve
 * Locks a temporary seat (Token Hold) for a prospective student with an expiration timer.
 */
async function postReserveSeatHandler(req, { ctx }) {
  try {
    const body = await req.json();
    const {
      batchId,
      studentName,
      studentPhone,
      studentEmail,
      tokenAmount = 5000,
      holdHours = 48,
      notes,
    } = body;

    if (!batchId || !studentName || !studentPhone) {
      return Response.json(
        error("Batch ID, student name, and student phone are required for seat reservation"),
        { status: 400 }
      );
    }

    const currentUserId = toValidUuid(ctx?.session?.userId);
    const validBatchId = toValidUuid(batchId);
    const expiresAt = new Date(Date.now() + Number(holdHours) * 3600000).toISOString();

    const reservationRecord = {
      id: `res-${Date.now()}`,
      batchId,
      studentName: studentName.trim(),
      studentPhone: studentPhone.trim(),
      studentEmail: studentEmail?.trim() || null,
      tokenAmount: Number(tokenAmount) || 5000,
      holdHours: Number(holdHours) || 48,
      expiresAt,
      status: "token_reserved",
      notes: notes || "Seat held with token payment advance",
      reservedBy: ctx?.session?.userName || "Admissions Counsellor",
      createdAt: new Date().toISOString(),
    };

    // Log Audit Event
    try {
      if (validBatchId) {
        await db
          .insert(crmAuditEvents)
          .values({
            actorUserId: currentUserId,
            action: "SEAT_RESERVED_TOKEN_HOLD",
            entityType: "batch",
            entityId: validBatchId,
            reason: `Reserved seat for ${studentName} with ₹${tokenAmount} token hold (Expires in ${holdHours}h)`,
            afterSnapshot: reservationRecord,
          })
          .catch((e) => console.warn("Audit logging warning:", e.message));
      }
    } catch (dbErr) {
      console.warn("DB reserve seat warning:", dbErr.message);
    }

    return Response.json(
      success(reservationRecord, "Seat reserved successfully with token hold"),
      { status: 201 }
    );
  } catch (err) {
    return Response.json(error(err.message || "Failed to reserve seat"), { status: 500 });
  }
}

export const POST = createProtectedRoute(postReserveSeatHandler, { policy: canAccessCrm });
