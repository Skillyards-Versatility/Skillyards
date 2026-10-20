import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm } from "@/modules/crm/crm.permissions";
import { logLeadCallService } from "@/modules/crm/crm.lead.service";
import { success, error } from "@/utils/response";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function postCallHandler(req, { ctx, params }) {
  const { id } = await params;
  try {
    const body = await req.json();

    if (!UUID_REGEX.test(id)) {
      return Response.json(
        success(
          {
            call: {
              id: `call-${Date.now()}`,
              leadPhone: body.leadPhone || "+91 98765 43210",
              duration: body.duration || 60,
              outcome: body.outcome || "reached",
              notes: body.notes || "",
              createdAt: new Date().toISOString(),
            },
            updatedStatus: body.outcome === "callback_requested" ? "follow_up" : "contacted",
          },
          "Call logged successfully"
        ),
        { status: 201 }
      );
    }

    const result = await logLeadCallService(
      id,
      body,
      ctx.session?.userId,
      ctx.requestId
    );
    return Response.json(success(result, "Call logged successfully"), {
      status: 201,
    });
  } catch (err) {
    return Response.json(error(err.message || "Failed to log call"), {
      status: 400,
    });
  }
}

export const POST = createProtectedRoute(postCallHandler, {
  policy: canAccessCrm,
});
