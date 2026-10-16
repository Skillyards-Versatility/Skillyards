import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm } from "@/modules/crm/crm.permissions";
import { claimLeadService } from "@/modules/crm/crm.assignment.service";
import { success, error } from "@/utils/response";

async function claimLeadHandler(req, { ctx, params }) {
  const { id } = await params;
  try {
    const updated = await claimLeadService(id, ctx.session?.userId);
    return Response.json(success(updated, "Lead claimed successfully"));
  } catch (err) {
    return Response.json(
      error(err.message || "Failed to claim lead"),
      { status: 400 }
    );
  }
}

export const POST = createProtectedRoute(claimLeadHandler, {
  policy: canAccessCrm,
});
