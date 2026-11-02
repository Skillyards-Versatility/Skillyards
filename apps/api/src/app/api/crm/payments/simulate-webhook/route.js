import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm } from "@/modules/crm/crm.permissions";
import { success, error } from "@/utils/response";
import { POST as razorpayWebhookPost } from "@/app/api/crm/webhooks/razorpay/route";

/**
 * POST /api/crm/payments/simulate-webhook
 * Diagnostic & Testing endpoint: Simulates an official Razorpay payment.captured webhook.
 * Allows counsellors to verify live payment settlement flows instantly.
 */
async function simulateWebhookHandler(req, { ctx }) {
  try {
    const body = await req.json();
    const {
      linkId,
      installmentId,
      studentId,
      leadId,
      studentName,
      amount,
      courseName,
      paymentMethod = "upi",
    } = body;

    const numAmount = Number(amount) || 1000;
    const amountInPaise = Math.round(numAmount * 100);
    const mockPaymentId = `pay_sim_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

    // Build authentic Razorpay webhook event structure
    const simulatedEvent = {
      entity: "event",
      account_id: "acc_skillyards_live",
      event: "payment_link.paid",
      contains: ["payment_link", "payment"],
      payload: {
        payment_link: {
          entity: {
            id: linkId || `plink_sim_${Date.now()}`,
            amount: amountInPaise,
            currency: "INR",
            status: "paid",
            notes: {
              installmentId: installmentId || "",
              studentId: studentId || "",
              leadId: leadId || "",
              studentName: studentName || "Student Learner",
              courseName: courseName || "Tech Specialization",
            },
          },
        },
        payment: {
          entity: {
            id: mockPaymentId,
            amount: amountInPaise,
            currency: "INR",
            status: "captured",
            method: paymentMethod,
            contact: "+919876543210",
            email: "student@skillyards.com",
            acquirer_data: {
              upi_transaction_id: `UPI${Date.now().toString().slice(-9)}`,
            },
            notes: {
              installmentId: installmentId || "",
              studentId: studentId || "",
              leadId: leadId || "",
              studentName: studentName || "Student Learner",
            },
          },
        },
      },
      created_at: Math.floor(Date.now() / 1000),
    };

    // Construct mock request for the webhook handler
    const mockRequest = new Request("http://localhost:3000/api/crm/webhooks/razorpay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(simulatedEvent),
    });

    // Execute through official webhook processor
    const webhookRes = await razorpayWebhookPost(mockRequest);
    const webhookData = await webhookRes.json();

    return Response.json(
      success(
        {
          simulated: true,
          paymentId: mockPaymentId,
          amount: numAmount,
          method: paymentMethod,
          result: webhookData,
        },
        `Simulated payment of ₹${numAmount.toLocaleString("en-IN")} processed successfully via Razorpay Webhook Engine`
      )
    );
  } catch (err) {
    return Response.json(
      error(err.message || "Failed to simulate payment webhook"),
      { status: 500 }
    );
  }
}

export const POST = createProtectedRoute(simulateWebhookHandler, {
  policy: canAccessCrm,
});
