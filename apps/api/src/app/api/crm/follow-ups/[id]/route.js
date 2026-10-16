import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm } from "@/modules/crm/crm.permissions";
import {
  completeFollowUpService,
  rescheduleFollowUpService,
} from "@/modules/crm/crm.followup.service";
import { success, error } from "@/utils/response";

async function patchFollowUpHandler(req, { ctx, params }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { action } = body;

    let result;
    if (action === "complete") {
      result = await completeFollowUpService(
        id,
        { completionNotes: body.completionNotes || "Follow-up marked completed" },
        ctx.session?.userId
      );
    } else if (action === "reschedule") {
      result = await rescheduleFollowUpService(
        id,
        {
          newCallbackAt: body.newCallbackAt,
          reason: body.reason || "Rescheduled by representative",
        },
        ctx.session?.userId
      );
    } else {
      return Response.json(
        error("Invalid action. Must be 'complete' or 'reschedule'"),
        { status: 400 }
      );
    }

    return Response.json(
      success(result, `Follow-up task ${action}d successfully`)
    );
  } catch (err) {
    return Response.json(
      error(err.message || "Failed to update follow-up task"),
      { status: 400 }
    );
  }
}

export const PATCH = createProtectedRoute(patchFollowUpHandler, {
  policy: canAccessCrm,
});
