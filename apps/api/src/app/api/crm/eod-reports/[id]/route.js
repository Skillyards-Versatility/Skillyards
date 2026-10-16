import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm } from "@/modules/crm/crm.permissions";
import { getEodReportByIdService } from "@/modules/crm/crm.eod.service";
import { success, error } from "@/utils/response";

async function getEodReportHandler(req, { ctx, params }) {
  const { id } = await params;
  try {
    const report = await getEodReportByIdService(id);
    return Response.json(
      success(report, "EOD report detail retrieved successfully")
    );
  } catch (err) {
    return Response.json(
      error(err.message || "EOD report not found"),
      { status: 404 }
    );
  }
}

export const GET = createProtectedRoute(getEodReportHandler, {
  policy: canAccessCrm,
});
