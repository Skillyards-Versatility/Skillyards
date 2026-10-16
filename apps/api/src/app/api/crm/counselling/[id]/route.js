import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm } from "@/modules/crm/crm.permissions";
import {
  getCounsellingSessionByIdService,
  deleteCounsellingSessionService,
} from "@/modules/crm/crm.counselling.service";
import { success, error } from "@/utils/response";
import { ROLES } from "@/lib/permissions";

async function getSessionHandler(req, { ctx, params }) {
  const { id } = await params;
  try {
    const session = await getCounsellingSessionByIdService(id);
    return Response.json(
      success(session, "Counselling session retrieved successfully")
    );
  } catch (err) {
    return Response.json(
      error(err.message || "Counselling session not found"),
      { status: 404 }
    );
  }
}

async function deleteSessionHandler(req, { ctx, params }) {
  const { id } = await params;
  try {
    if (ctx.session?.role !== ROLES.ADMIN) {
      return Response.json(
        error("Unauthorized: Admin privilege required to delete session"),
        { status: 403 }
      );
    }

    const deleted = await deleteCounsellingSessionService(
      id,
      ctx.session?.userId,
      ctx.requestId
    );

    return Response.json(
      success(deleted, "Counselling session deleted successfully")
    );
  } catch (err) {
    return Response.json(
      error(err.message || "Failed to delete counselling session"),
      { status: 400 }
    );
  }
}

export const GET = createProtectedRoute(getSessionHandler, {
  policy: canAccessCrm,
});

export const DELETE = createProtectedRoute(deleteSessionHandler, {
  policy: canAccessCrm,
});
