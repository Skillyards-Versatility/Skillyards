import { db } from "@repo/db";
import { students, payments, installments, leads, crmAuditEvents } from "@repo/db/schema";
import { eq } from "drizzle-orm";
import { verifyRazorpayWebhookSignature, runtimePaymentLinks, runtimePaymentEvents } from "@/lib/razorpay";
import { runtimeInstallments } from "@/app/api/crm/installments/route";

/**
 * POST /api/crm/webhooks/razorpay
 * Public webhook endpoint called by Razorpay servers upon payment events:
 * - payment_link.paid
 * - payment.captured
 * - order.paid
 */
export async function POST(req) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Verify cryptographic signature if secret configured
    const isValid = verifyRazorpayWebhookSignature({
      bodyString: rawBody,
      signature,
      secret: webhookSecret,
    });

    if (!isValid) {
      console.warn("Invalid Razorpay webhook signature");
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    let eventData = {};
    try {
      eventData = JSON.parse(rawBody);
    } catch (_) {
      return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { event, payload } = eventData;
    console.log(`[RAZORPAY WEBHOOK] Received event: ${event}`);

    // We process payment successes
    if (event === "payment_link.paid" || event === "payment.captured" || event === "order.paid") {
      const plinkEntity = payload?.payment_link?.entity || {};
      const paymentEntity = payload?.payment?.entity || {};

      const linkId = plinkEntity.id;
      const paymentId = paymentEntity.id || `pay_${Date.now().toString(36)}`;
      const amountInPaise = paymentEntity.amount || plinkEntity.amount || 0;
      const amountInRupees = amountInPaise > 0 ? Math.round(amountInPaise / 100) : 0;
      const paymentMethod = paymentEntity.method || "upi";
      const notes = plinkEntity.notes || paymentEntity.notes || {};

      const installmentId = notes.installmentId;
      const studentId = notes.studentId;
      const leadId = notes.leadId;
      const studentName = notes.studentName || paymentEntity.contact || "Student";
      const receiptNo = `REC-RZP-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const paidTimestamp = new Date().toISOString();

      // 1. Update In-Memory Payment Link Registry
      if (linkId && runtimePaymentLinks.has(linkId)) {
        const linkRecord = runtimePaymentLinks.get(linkId);
        runtimePaymentLinks.set(linkId, {
          ...linkRecord,
          status: "paid",
          paymentId,
          paymentMethod,
          paidAt: paidTimestamp,
          receiptNo,
        });
      }

      // 2. Update In-Memory Installments Runtime Cache
      let matchedInstallment = null;
      if (installmentId) {
        matchedInstallment = runtimeInstallments.find((i) => i.id === installmentId);
      } else if (studentName || amountInRupees > 0) {
        // Fallback matching by name or studentId
        matchedInstallment = runtimeInstallments.find(
          (i) =>
            i.status !== "paid" &&
            (i.studentName?.toLowerCase() === studentName?.toLowerCase() ||
              i.studentId === studentId ||
              i.amountDue === amountInRupees)
        );
      }

      if (matchedInstallment) {
        matchedInstallment.status = "paid";
        matchedInstallment.amountPaid = matchedInstallment.amountDue;
        matchedInstallment.paymentMode = `razorpay_${paymentMethod}`;
        matchedInstallment.transactionRef = paymentId;
        matchedInstallment.receiptNo = receiptNo;
        matchedInstallment.paidAt = paidTimestamp;
        matchedInstallment.notes = `Cleared via Razorpay Gateway (${paymentMethod.toUpperCase()})`;
      }

      // 3. Record in Webhook Events Feed (for live UI toast/notification polling)
      const eventLog = {
        id: `ev_${Date.now()}`,
        event,
        paymentId,
        linkId,
        installmentId: installmentId || matchedInstallment?.id || null,
        studentName,
        amount: amountInRupees,
        paymentMethod,
        receiptNo,
        timestamp: paidTimestamp,
      };
      runtimePaymentEvents.unshift(eventLog);
      if (runtimePaymentEvents.length > 50) runtimePaymentEvents.pop();

      // 4. Update Database (PostgreSQL) if connected
      try {
        // A. Insert into payments table
        if (studentId) {
          await db.insert(payments).values({
            studentId,
            installmentId: installmentId || null,
            amount: amountInRupees,
            method: `razorpay_${paymentMethod}`,
            note: `Razorpay Payment ID: ${paymentId}`,
            receiptNumber: receiptNo,
            receiptStatus: "ready",
          });
        }

        // B. Update installment table status
        if (installmentId) {
          await db
            .update(installments)
            .set({ status: "paid" })
            .where(eq(installments.id, installmentId));
        }

        // C. If leadId provided, convert lead
        if (leadId) {
          await db
            .update(leads)
            .set({ status: "converted", updatedAt: new Date() })
            .where(eq(leads.id, leadId));
        }

        // D. Insert Audit Event
        await db.insert(crmAuditEvents).values({
          actorName: "Razorpay Webhook Engine",
          action: "PAYMENT_CAPTURED_WEBHOOK",
          entityType: "payment",
          entityId: paymentId,
          reason: `Instant settlement of ₹${amountInRupees} received for ${studentName}`,
          afterSnapshot: eventLog,
        });
      } catch (dbErr) {
        console.warn("[RAZORPAY WEBHOOK] Database write notice (persisted in runtime):", dbErr.message);
      }

      return new Response(
        JSON.stringify({
          status: "ok",
          processed: true,
          paymentId,
          receiptNo,
          amount: amountInRupees,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Default response for other events
    return new Response(JSON.stringify({ status: "ignored", event }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[RAZORPAY WEBHOOK] Error processing webhook:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
