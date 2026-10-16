import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm } from "@/modules/crm/crm.permissions";
import { resolveDuplicateReviewService } from "@/modules/crm/crm.intake.service";
import { success, error } from "@/utils/response";

async function resolveDuplicateHandler(req, { ctx, params }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const result = await resolveDuplicateReviewService(
      id,
      body,
      ctx.session?.userId
    );
    return Response.json(
      success(result, "Duplicate review resolved successfully")
    );
  } catch (err) {
    return Response.json(
      error(err.message || "Failed to resolve duplicate review"),
      { status: 400 }
    );
  }
}

export const POST = createProtectedRoute(resolveDuplicateHandler, {
  policy: canAccessCrm,
});
