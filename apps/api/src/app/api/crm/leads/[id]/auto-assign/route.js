import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm } from "@/modules/crm/crm.permissions";
import { autoAssignLeadService } from "@/modules/crm/crm.assignment.service";
import { success, error } from "@/utils/response";

async function autoAssignHandler(req, { ctx, params }) {
  const { id } = await params;
  try {
    const result = await autoAssignLeadService(id);
    return Response.json(success(result, "Auto assignment executed"));
  } catch (err) {
    return Response.json(
      error(err.message || "Failed to auto assign lead"),
      { status: 400 }
    );
  }
}

export const POST = createProtectedRoute(autoAssignHandler, {
  policy: canAccessCrm,
});
