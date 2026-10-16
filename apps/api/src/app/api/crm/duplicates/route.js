import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm } from "@/modules/crm/crm.permissions";
import { getDuplicateReviewsService } from "@/modules/crm/crm.intake.service";
import { success, error } from "@/utils/response";

async function getDuplicateReviewsHandler(req) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "pending";
    const reviews = await getDuplicateReviewsService({ status });
    return Response.json(
      success(reviews, "Duplicate reviews retrieved successfully")
    );
  } catch (err) {
    return Response.json(
      error(err.message || "Failed to retrieve duplicate reviews"),
      { status: 500 }
    );
  }
}

export const GET = createProtectedRoute(getDuplicateReviewsHandler, {
  policy: canAccessCrm,
});
