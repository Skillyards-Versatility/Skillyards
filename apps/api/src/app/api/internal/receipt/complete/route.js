import { db } from "@repo/db";
import { completePaymentGeneration } from "@/modules/payments/payment.repository";
import { corsHeaders } from "@/utils/cors";
import { createProtectedRoute } from "@/lib/middleware";
import { internalServiceOnly } from "@/lib/permissions";

/**
 * SECURE INTERNAL CALLBACK HANDLER
 * Triggered by the PDF Service (Railway).
 * Structural enforcement ensures:
 * - Internal Key validation (via internalServiceOnly)
 * - requestId propagation
 * - Atomic state transition
 */
async function postHandler(req, { ctx }) {
  const { paymentId, jobId, status, key } = await req.json();

  if (!paymentId || !jobId || !status) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
    });
  }

  // ── ATOMIC OWNERSHIP UPDATE ──
  const updated = await completePaymentGeneration(db, paymentId, jobId, {
    receiptStatus: status, // 'ready' or 'failed'
    receiptKey: status === "ready" ? key : null,
  });

  if (updated) {
    ctx.log("INTERNAL_COMPLETE_SUCCESS", { paymentId, jobId });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } else {
    ctx.warn("INTERNAL_COMPLETE_STALE_IGNORED", { paymentId, jobId });
    return new Response(
      JSON.stringify({ success: true, message: "Ignored stale callback" }),
      { status: 200 },
    );
  }
}

// ── STRUCTURAL ENFORCEMENT ──
export const POST = createProtectedRoute(postHandler, {
  policy: internalServiceOnly,
  internalServiceOnly: true,
});

export async function OPTIONS(req) {
  return new Response(null, { headers: corsHeaders(req) });
}
