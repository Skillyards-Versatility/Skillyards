import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm } from "@/modules/crm/crm.permissions";
import { rescheduleCounsellingSessionService } from "@/modules/crm/crm.counselling.service";
import { success, error } from "@/utils/response";

async function rescheduleHandler(req, { ctx, params }) {
  const { id } = await params;
  try {
    const body = await req.json();

    const updated = await rescheduleCounsellingSessionService(
      id,
      body,
      ctx.session?.userId,
      ctx.requestId
    );

    return Response.json(
      success(updated, "Counselling session rescheduled successfully")
    );
  } catch (err) {
    return Response.json(
      error(err.message || "Failed to reschedule session"),
      { status: 400 }
    );
  }
}

export const POST = createProtectedRoute(rescheduleHandler, {
  policy: canAccessCrm,
});
