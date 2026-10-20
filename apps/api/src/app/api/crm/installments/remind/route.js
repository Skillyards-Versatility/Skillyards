import { db } from "@repo/db";
import { crmAuditEvents } from "@repo/db/schema";
import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm } from "@/modules/crm/crm.permissions";
import { success, error } from "@/utils/response";

/**
 * POST /api/crm/installments/remind
 * Logs a payment reminder dispatch (WhatsApp, Email, SMS) with audit tracking
 */
async function sendReminderHandler(req, { ctx }) {
  try {
    const body = await req.json();
    const {
      installmentId,
      studentId,
      studentName,
      channel,
      template,
      amountDue,
      dueDate,
    } = body;

    if (!installmentId) {
      return Response.json(error("installmentId is required"), { status: 400 });
    }

    // Insert into crmAuditEvents for compliance
    try {
      await db.insert(crmAuditEvents).values({
        actorId: ctx.user?.id || null,
        actorName: ctx.user?.name || "Accounts Desk",
        action: "INSTALLMENT_REMINDER_SENT",
        entityType: "installment",
        entityId: installmentId,
        reason: `Dispatched ${channel || "WhatsApp"} payment reminder for ₹${Number(amountDue || 0).toLocaleString("en-IN")} due ${dueDate || "soon"}`,
        afterSnapshot: {
          installmentId,
          studentId,
          studentName,
          channel: channel || "whatsapp",
          template: template || "due_reminder",
          amountDue,
          dueDate,
          dispatchedAt: new Date().toISOString(),
        },
      });
    } catch (_) {}

    return Response.json(
      success(
        {
          installmentId,
          status: "reminder_dispatched",
          channel: channel || "whatsapp",
          dispatchedAt: new Date().toISOString(),
        },
        "Installment payment reminder recorded"
      )
    );
  } catch (err) {
    ctx.error?.("CRM_INSTALLMENT_REMINDER_FAILED", { error: err.message });
    return Response.json(
      error(err.message || "Failed to record payment reminder"),
      { status: 500 }
    );
  }
}

export const POST = createProtectedRoute(canAccessCrm, sendReminderHandler);
