import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm } from "@/modules/crm/crm.permissions";
import { createCounsellingSessionService } from "@/modules/crm/crm.counselling.service";
import { findLeadById } from "@/modules/crm/crm.lead.repository";
import { success, error } from "@/utils/response";

async function postLeadCounsellingHandler(req, { ctx, params }) {
  const { id: leadId } = await params;
  try {
    const lead = await findLeadById(leadId);
    if (!lead) {
      return Response.json(error("Lead not found"), { status: 404 });
    }

    const body = await req.json();

    const payload = {
      ...body,
      leadId,
      studentName: body.studentName || lead.fullName,
      phone: body.phone || lead.normalizedPhone,
      counselorId: body.counselorId || lead.assignedToUserId || ctx.session?.userId,
    };

    const created = await createCounsellingSessionService(
      payload,
      ctx.session?.userId,
      ctx.requestId
    );

    return Response.json(
      success(created, "Counselling session booked for lead successfully"),
      { status: 201 }
    );
  } catch (err) {
    return Response.json(
      error(err.message || "Failed to schedule counselling session for lead"),
      { status: 400 }
    );
  }
}

export const POST = createProtectedRoute(postLeadCounsellingHandler, {
  policy: canAccessCrm,
});
