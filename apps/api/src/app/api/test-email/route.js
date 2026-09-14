import { sendTestEmail } from "@/modules/notifications/email.service";
import { createProtectedRoute } from "@/lib/middleware";
import { canAccessEnquiry } from "@/lib/permissions";

/**
 * SECURED EMAIL TEST HANDLER (Internal)
 */
async function getHandler() {
  const result = await sendTestEmail();

  return Response.json({
    success: true,
    data: result,
  });
}

// ── STRUCTURAL ENFORCEMENT ──
export const GET = createProtectedRoute(getHandler, {
  policy: canAccessEnquiry,
});
