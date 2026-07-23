import { createProtectedRoute } from "@/lib/middleware";
import { processEodEmails } from "@/modules/eod/eodProcessor";

export const POST = createProtectedRoute(async (req) => {
  try {
    const body = await req.json();
    const { date, userId } = body;

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return Response.json({ error: "Invalid or missing date (YYYY-MM-DD)" }, { status: 400 });
    }

    const results = await processEodEmails(date, userId || null);

    return Response.json(results);
  } catch (error) {
    console.error("[POST /api/admin/eod/trigger] Error:", error);
    return Response.json({ error: "Failed to trigger EOD emails", details: error.message }, { status: 500 });
  }
}, {
  policy: (session) => {
    const isAuthorized = session?.role === "ADMIN" || session?.role === "MANAGER";
    return {
      authorized: isAuthorized,
      reason: isAuthorized ? "AUTHORIZED_ROLE" : "ADMIN_OR_MANAGER_ONLY",
    };
  },
});
