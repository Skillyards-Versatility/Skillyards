import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm } from "@/modules/crm/crm.permissions";
import {
  getLeadByIdService,
  updateLeadService,
} from "@/modules/crm/crm.lead.service";
import { success, error } from "@/utils/response";

async function getLeadHandler(req, { ctx, params }) {
  const { id } = await params;
  try {
    const lead = await getLeadByIdService(id);
    return Response.json(success(lead, "Lead retrieved successfully"));
  } catch (err) {
    return Response.json(error(err.message || "Lead not found"), {
      status: err.message === "Lead not found" ? 404 : 500,
    });
  }
}

async function patchLeadHandler(req, { ctx, params }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const updated = await updateLeadService(
      id,
      body,
      ctx.session?.userId,
      ctx.requestId
    );
    return Response.json(success(updated, "Lead updated successfully"));
  } catch (err) {
    return Response.json(error(err.message || "Failed to update lead"), {
      status: 400,
    });
  }
}

export const GET = createProtectedRoute(getLeadHandler, {
  policy: canAccessCrm,
});

export const PATCH = createProtectedRoute(patchLeadHandler, {
  policy: canAccessCrm,
});
