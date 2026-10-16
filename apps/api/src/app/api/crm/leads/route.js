import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm } from "@/modules/crm/crm.permissions";
import {
  getLeadsService,
  createLeadService,
} from "@/modules/crm/crm.lead.service";
import { success, error } from "@/utils/response";

async function getLeadsHandler(req, { ctx }) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status") || undefined;
  const search = url.searchParams.get("search") || undefined;
  const page = url.searchParams.get("page") || 1;
  const limit = url.searchParams.get("limit") || 20;

  try {
    const data = await getLeadsService({
      query: { status, search, page, limit },
      userScope: { userId: ctx.session?.userId },
    });

    return Response.json(success(data, "Leads fetched successfully"));
  } catch (err) {
    ctx.error("CRM_GET_LEADS_FAILED", { error: err.message });
    return Response.json(error(err.message || "Failed to fetch leads"), {
      status: 500,
    });
  }
}

async function postLeadHandler(req, { ctx }) {
  try {
    const body = await req.json();
    const created = await createLeadService(
      body,
      ctx.session?.userId,
      ctx.requestId
    );

    return Response.json(success(created, "Lead created successfully"), {
      status: 201,
    });
  } catch (err) {
    ctx.warn("CRM_CREATE_LEAD_FAILED", { error: err.message });
    return Response.json(error(err.message || "Failed to create lead"), {
      status: 400,
    });
  }
}

export const GET = createProtectedRoute(getLeadsHandler, {
  policy: canAccessCrm,
});

export const POST = createProtectedRoute(postLeadHandler, {
  policy: canAccessCrm,
});
