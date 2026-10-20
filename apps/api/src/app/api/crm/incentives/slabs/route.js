import { db } from "@repo/db";
import { crmAuditEvents } from "@repo/db/schema";
import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm } from "@/modules/crm/crm.permissions";
import { success, error } from "@/utils/response";
import { COMMISSION_SLABS } from "../route";

let currentSlabs = [...COMMISSION_SLABS];

/**
 * GET /api/crm/incentives/slabs
 * Returns current commission slabs
 */
async function getSlabsHandler(req, { ctx }) {
  return Response.json(success(currentSlabs, "Commission slabs fetched"));
}

/**
 * PUT /api/crm/incentives/slabs
 * Manager updates commission slabs policy
 */
async function updateSlabsHandler(req, { ctx }) {
  try {
    const body = await req.json();
    const { slabs } = body;

    if (!Array.isArray(slabs)) {
      return Response.json(error("slabs must be an array"), { status: 400 });
    }

    currentSlabs = slabs;

    try {
      await db.insert(crmAuditEvents).values({
        actorId: ctx.user?.id || null,
        actorName: ctx.user?.name || "Management",
        action: "INCENTIVE_SLABS_UPDATED",
        entityType: "policy",
        entityId: "commission_slabs",
        reason: "Updated company sales commission slabs and tier rates",
        afterSnapshot: { slabs },
      });
    } catch (_) {}

    return Response.json(success(currentSlabs, "Commission slabs policy updated successfully"));
  } catch (err) {
    ctx.error?.("CRM_UPDATE_SLABS_FAILED", { error: err.message });
    return Response.json(error(err.message || "Failed to update slabs"), { status: 500 });
  }
}

export const GET = createProtectedRoute(canAccessCrm, getSlabsHandler);
export const PUT = createProtectedRoute(canAccessCrm, updateSlabsHandler);
