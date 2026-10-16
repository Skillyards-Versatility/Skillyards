import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm } from "@/modules/crm/crm.permissions";
import { updateCounsellingStatusService } from "@/modules/crm/crm.counselling.service";
import { success, error } from "@/utils/response";

async function statusHandler(req, { ctx, params }) {
  const { id } = await params;
  try {
    const body = await req.json();

    const updated = await updateCounsellingStatusService(
      id,
      body,
      ctx.session?.userId,
      ctx.requestId
    );

    return Response.json(
      success(updated, "Counselling session status updated successfully")
    );
  } catch (err) {
    return Response.json(
      error(err.message || "Failed to update session status"),
      { status: 400 }
    );
  }
}

export const POST = createProtectedRoute(statusHandler, {
  policy: canAccessCrm,
});
