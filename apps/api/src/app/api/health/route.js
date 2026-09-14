import { success } from "@/utils/response";
import { createProtectedRoute } from "@/lib/middleware";
import { publicAllow } from "@/lib/permissions";

/**
 * PUBLIC HEALTH CHECK HANDLER
 */
async function getHandler(req, { ctx }) {
  const payload = success(
    {
      status: "ok",
      service: "skillyards-api",
      version: "1.0.0",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
    "API is healthy",
  );

  return Response.json(payload, { status: 200 });
}

// ── STRUCTURAL ENFORCEMENT ──
// Even safe public routes use the structural wrapper for:
// - Uniform logging
// - requestId propagation
// - Automatic rate limiting protection
export const GET = createProtectedRoute(getHandler, {
  policy: publicAllow,
  isPublic: true,
});
