import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm } from "@/modules/crm/crm.permissions";
import { getEodPreviewService } from "@/modules/crm/crm.eod.service";
import { success, error } from "@/utils/response";

async function getEodPreviewHandler(req, { ctx }) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const userId = searchParams.get("userId");

    const preview = await getEodPreviewService({
      userId,
      date,
      sessionUser: ctx.session,
    });

    return Response.json(
      success(preview, "Server-authoritative EOD preview calculated")
    );
  } catch (err) {
    return Response.json(
      error(err.message || "Failed to calculate EOD preview"),
      { status: 500 }
    );
  }
}

export const GET = createProtectedRoute(getEodPreviewHandler, {
  policy: canAccessCrm,
});
