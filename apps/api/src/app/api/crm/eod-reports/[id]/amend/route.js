import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm } from "@/modules/crm/crm.permissions";
import { amendEodReportService } from "@/modules/crm/crm.eod.service";
import { success, error } from "@/utils/response";

async function postAmendHandler(req, { ctx, params }) {
  const { id } = await params;
  try {
    const body = await req.json();

    const amended = await amendEodReportService(
      id,
      body,
      ctx.session,
      ctx.requestId
    );

    return Response.json(
      success(amended, "EOD report amended successfully with preserved revision history")
    );
  } catch (err) {
    const status = err.status || 400;
    return Response.json(
      error(err.message || "Failed to amend EOD report"),
      { status }
    );
  }
}

export const POST = createProtectedRoute(postAmendHandler, {
  policy: canAccessCrm,
});
