import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm } from "@/modules/crm/crm.permissions";
import { getSalesTeamsService } from "@/modules/crm/crm.assignment.service";
import { success, error } from "@/utils/response";

async function getTeamsHandler() {
  try {
    const teams = await getSalesTeamsService();
    return Response.json(success(teams, "Sales teams retrieved successfully"));
  } catch (err) {
    return Response.json(
      error(err.message || "Failed to retrieve sales teams"),
      { status: 500 }
    );
  }
}

export const GET = createProtectedRoute(getTeamsHandler, {
  policy: canAccessCrm,
});
