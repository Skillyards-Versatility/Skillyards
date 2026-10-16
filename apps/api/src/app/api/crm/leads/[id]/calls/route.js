import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm } from "@/modules/crm/crm.permissions";
import { logLeadCallService } from "@/modules/crm/crm.lead.service";
import { success, error } from "@/utils/response";

async function postCallHandler(req, { ctx, params }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const result = await logLeadCallService(
      id,
      body,
      ctx.session?.userId,
      ctx.requestId
    );
    return Response.json(success(result, "Call logged successfully"), {
      status: 201,
    });
  } catch (err) {
    return Response.json(error(err.message || "Failed to log call"), {
      status: 400,
    });
  }
}

export const POST = createProtectedRoute(postCallHandler, {
  policy: canAccessCrm,
});
