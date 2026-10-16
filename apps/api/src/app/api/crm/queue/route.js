import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm } from "@/modules/crm/crm.permissions";
import { getQueueService } from "@/modules/crm/crm.assignment.service";
import { success, error } from "@/utils/response";

async function getQueueHandler(req, { ctx }) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "unassigned";
    const page = parseInt(searchParams.get("page"), 10) || 1;
    const limit = parseInt(searchParams.get("limit"), 10) || 50;

    const data = await getQueueService({
      type,
      userId: ctx.session?.userId,
      page,
      limit,
    });

    return Response.json(success(data, "Queue retrieved successfully"));
  } catch (err) {
    return Response.json(
      error(err.message || "Failed to retrieve queue"),
      { status: 500 }
    );
  }
}

export const GET = createProtectedRoute(getQueueHandler, {
  policy: canAccessCrm,
});
