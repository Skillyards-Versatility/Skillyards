import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm } from "@/modules/crm/crm.permissions";
import { createRazorpayPaymentLink } from "@/lib/razorpay";
import { success, error } from "@/utils/response";
import { db } from "@repo/db";
import { crmAuditEvents } from "@repo/db/schema";

/**
 * POST /api/crm/payments/generate-link
 * Generates an official Razorpay payment link with WhatsApp share template & UPI QR code.
 */
async function generatePaymentLinkHandler(req, { ctx }) {
  try {
    const body = await req.json();
    const {
      amount,
      purpose,
      studentName,
      studentPhone,
      studentEmail,
      courseName,
      cohortName,
      installmentId,
      studentId,
      leadId,
      expiresInDays,
    } = body;

    if (!amount || Number(amount) <= 0) {
      return Response.json(error("Valid amount is required"), { status: 400 });
    }
    if (!studentName || !studentPhone) {
      return Response.json(
        error("Student name and phone number are required"),
        { status: 400 }
      );
    }

    const paymentLink = await createRazorpayPaymentLink({
      amount,
      purpose: purpose || "Tuition Fee Installment",
      studentName,
      studentPhone,
      studentEmail,
      courseName: courseName || "Skillyards Course",
      cohortName,
      installmentId,
      studentId,
      leadId,
      expiresInDays: expiresInDays || 7,
    });

    // Formatted WhatsApp message for 1-click sharing
    const cleanPhone = (studentPhone || "").replace(/[^0-9]/g, "");
    const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

    const waText = encodeURIComponent(
      `Dear ${studentName},\n\n` +
      `Here is your official *Skillyards Versatility* fee clearance payment link:\n\n` +
      `📌 *Purpose:* ${purpose || "Course Fee Clearance"}\n` +
      `📚 *Program:* ${courseName || "Skillyards Specialization"}\n` +
      `💰 *Amount Due:* ₹${Number(amount).toLocaleString("en-IN")}\n\n` +
      `⚡ *Pay via UPI, GPay, PhonePe, Card, NetBanking:*\n` +
      `${paymentLink.short_url}\n\n` +
      `This link is valid for 7 days. You will receive an instant GST fee receipt as soon as payment is confirmed.\n\n` +
      `Warm regards,\n` +
      `*Admissions & Accounts Desk*\n` +
      `Skillyards Versatility`
    );

    const whatsappShareUrl = `https://wa.me/${waPhone}?text=${waText}`;

    // Log in CRM Audit Events
    try {
      await db.insert(crmAuditEvents).values({
        actorId: ctx.session?.userId || null,
        actorName: ctx.session?.name || "Counsellor",
        action: "PAYMENT_LINK_GENERATED",
        entityType: "payment_link",
        entityId: paymentLink.id,
        reason: `Generated ₹${amount} Razorpay link for ${studentName}`,
        afterSnapshot: paymentLink,
      });
    } catch (_) {}

    return Response.json(
      success(
        {
          paymentLink,
          whatsappShareUrl,
          smsText: `Hi ${studentName}, please complete your Skillyards fee payment of Rs.${amount} via this secure link: ${paymentLink.short_url}`,
        },
        "Razorpay payment link generated successfully"
      )
    );
  } catch (err) {
    return Response.json(
      error(err.message || "Failed to generate payment link"),
      { status: 500 }
    );
  }
}

export const POST = createProtectedRoute(generatePaymentLinkHandler, {
  policy: canAccessCrm,
});
