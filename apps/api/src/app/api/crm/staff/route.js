import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm } from "@/modules/crm/crm.permissions";
import { getAssignableStaffService } from "@/modules/crm/crm.lead.service";
import { success, error } from "@/utils/response";

async function getStaffHandler() {
  try {
    const staff = await getAssignableStaffService();
    return Response.json(success(staff, "Staff members retrieved successfully"));
  } catch (err) {
    return Response.json(error(err.message || "Failed to retrieve staff"), {
      status: 500,
    });
  }
}

export const GET = createProtectedRoute(getStaffHandler, {
  policy: canAccessCrm,
});
