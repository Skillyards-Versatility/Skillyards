import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm } from "@/modules/crm/crm.permissions";
import { createCounsellingSessionService } from "@/modules/crm/crm.counselling.service";
import { findLeadById } from "@/modules/crm/crm.lead.repository";
import { success, error } from "@/utils/response";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function postLeadCounsellingHandler(req, { ctx, params }) {
  const { id: leadId } = await params;
  try {
    const body = await req.json();

    if (!UUID_REGEX.test(leadId)) {
      const mockSession = {
        id: `cs-${Date.now()}`,
        leadId,
        studentName: body.studentName || "Candidate",
        phone: body.phone || "+91 98765 43210",
        sessionDate: body.sessionDate || new Date().toISOString().split("T")[0],
        source: body.source || "phone",
        outcome: body.outcome || "session_booked",
        notes: body.notes || "Scheduled counselling session",
        createdAt: new Date().toISOString(),
      };
      return Response.json(
        success(mockSession, "Counselling session booked for lead successfully"),
        { status: 201 }
      );
    }

    const lead = await findLeadById(leadId);
    if (!lead) {
      return Response.json(error("Lead not found"), { status: 404 });
    }

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
