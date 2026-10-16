import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm } from "@/modules/crm/crm.permissions";
import {
  submitEodReportService,
  getEodReportsListService,
} from "@/modules/crm/crm.eod.service";
import { success, error } from "@/utils/response";
import { ROLES } from "@/lib/permissions";

async function getEodReportsHandler(req, { ctx }) {
  try {
    const { searchParams } = new URL(req.url);

    const isElevated =
      [ROLES.ADMIN, ROLES.MANAGER].includes(ctx.session?.role) ||
      ctx.session?.crmRoles?.includes("crm_admin") ||
      ctx.session?.crmRoles?.includes("sales_manager");

    const userScope = {
      scopedToUser: !isElevated && searchParams.get("scope") !== "all",
      userId: ctx.session?.userId,
    };

    const query = {
      date: searchParams.get("date") || undefined,
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
      userId: searchParams.get("userId") || undefined,
      limit: parseInt(searchParams.get("limit") || "50", 10),
      offset: parseInt(searchParams.get("offset") || "0", 10),
    };

    const data = await getEodReportsListService({
      userScope,
      query,
    });

    return Response.json(
      success(data, "EOD reports retrieved successfully")
    );
  } catch (err) {
    return Response.json(
      error(err.message || "Failed to retrieve EOD reports"),
      { status: 500 }
    );
  }
}

async function postEodReportHandler(req, { ctx }) {
  try {
    const body = await req.json();

    const created = await submitEodReportService(
      body,
      ctx.session,
      ctx.requestId
    );

    return Response.json(
      success(created, "EOD report submitted and verified successfully"),
      { status: 201 }
    );
  } catch (err) {
    const status = err.status || 400;
    return Response.json(
      error(err.message || "Failed to submit EOD report"),
      { status }
    );
  }
}

export const GET = createProtectedRoute(getEodReportsHandler, {
  policy: canAccessCrm,
});

export const POST = createProtectedRoute(postEodReportHandler, {
  policy: canAccessCrm,
});
