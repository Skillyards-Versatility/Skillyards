import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm } from "@/modules/crm/crm.permissions";
import { success, error } from "@/utils/response";
import { runtimePaymentLinks, runtimePaymentEvents } from "@/lib/razorpay";

/**
 * GET /api/crm/payments
 * Lists all active generated Razorpay links and live webhook events
 */
async function getPaymentsHandler(req, { ctx }) {
  try {
    const { searchParams } = new URL(req.url);
    const linkId = searchParams.get("linkId");

    if (linkId) {
      const link = runtimePaymentLinks.get(linkId);
      if (!link) {
        return Response.json(error("Payment link not found"), { status: 404 });
      }
      return Response.json(success(link, "Payment link retrieved"));
    }

    const links = Array.from(runtimePaymentLinks.values()).reverse();
    const events = runtimePaymentEvents.slice(0, 20);

    return Response.json(
      success(
        {
          links,
          recentEvents: events,
          totalGenerated: links.length,
          totalPaid: links.filter((l) => l.status === "paid").length,
        },
        "Payments list retrieved successfully"
      )
    );
  } catch (err) {
    return Response.json(
      error(err.message || "Failed to retrieve payments"),
      { status: 500 }
    );
  }
}

export const GET = createProtectedRoute(getPaymentsHandler, {
  policy: canAccessCrm,
});
