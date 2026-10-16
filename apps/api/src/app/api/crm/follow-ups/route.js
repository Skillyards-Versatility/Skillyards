import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm } from "@/modules/crm/crm.permissions";
import { getFollowUpsService } from "@/modules/crm/crm.followup.service";
import { success, error } from "@/utils/response";

async function getFollowUpsHandler(req, { ctx }) {
  try {
    const { searchParams } = new URL(req.url);
    const scope = searchParams.get("scope"); // 'all' or 'my'
    const filter = searchParams.get("filter") || "all";

    // If scope is 'all', sales managers can view company-wide tasks
    const targetUserId = scope === "all" ? null : ctx.session?.userId;

    const data = await getFollowUpsService({
      userId: targetUserId,
      filter,
    });

    return Response.json(
      success(data, "Follow-up tasks retrieved successfully")
    );
  } catch (err) {
    return Response.json(
      error(err.message || "Failed to retrieve follow-up tasks"),
      { status: 500 }
    );
  }
}

export const GET = createProtectedRoute(getFollowUpsHandler, {
  policy: canAccessCrm,
});
