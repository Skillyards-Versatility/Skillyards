import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm } from "@/modules/crm/crm.permissions";
import {
  getCounsellingSessionsService,
  createCounsellingSessionService,
} from "@/modules/crm/crm.counselling.service";
import { success, error } from "@/utils/response";
import { ROLES } from "@/lib/permissions";

async function getCounsellingHandler(req, { ctx }) {
  try {
    const { searchParams } = new URL(req.url);

    const query = {
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
      source: searchParams.get("source") || undefined,
      outcome: searchParams.get("outcome") || undefined,
      counselorId: searchParams.get("counselorId") || undefined,
      bookedById: searchParams.get("bookedById") || undefined,
      search: searchParams.get("search") || undefined,
      phone: searchParams.get("phone") || undefined,
      page: searchParams.get("page") || 1,
      limit: searchParams.get("limit") || 25,
    };

    const isElevated =
      [ROLES.ADMIN, ROLES.MANAGER].includes(ctx.session?.role) ||
      ctx.session?.crmRoles?.includes("crm_admin") ||
      ctx.session?.crmRoles?.includes("sales_manager");

    const userScope = {
      scopedToUser: !isElevated && searchParams.get("scope") !== "all",
      userId: ctx.session?.userId,
    };

    const result = await getCounsellingSessionsService({
      userScope,
      query,
    });

    return Response.json(
      success(result, "Counselling sessions retrieved successfully")
    );
  } catch (err) {
    return Response.json(
      error(err.message || "Failed to retrieve counselling sessions"),
      { status: 500 }
    );
  }
}

async function postCounsellingHandler(req, { ctx }) {
  try {
    const body = await req.json();

    const created = await createCounsellingSessionService(
      body,
      ctx.session?.userId,
      ctx.requestId
    );

    return Response.json(
      success(created, "Counselling session scheduled successfully"),
      { status: 201 }
    );
  } catch (err) {
    return Response.json(
      error(err.message || "Failed to schedule counselling session"),
      { status: 400 }
    );
  }
}

export const GET = createProtectedRoute(getCounsellingHandler, {
  policy: canAccessCrm,
});

export const POST = createProtectedRoute(postCounsellingHandler, {
  policy: canAccessCrm,
});
