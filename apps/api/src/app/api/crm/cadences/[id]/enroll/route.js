import { db } from "@repo/db";
import { crmAuditEvents, leads } from "@repo/db/schema";
import { inArray, eq } from "drizzle-orm";
import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm } from "@/modules/crm/crm.permissions";
import { success, error } from "@/utils/response";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const toValidUuid = (id) => (typeof id === "string" && UUID_REGEX.test(id) ? id : null);

/**
 * POST /api/crm/cadences/[id]/enroll
 * Enrolls candidates into an automated nurturing cadence and logs audit trail
 */
async function postEnrollLeadHandler(req, { ctx, params }) {
  const { id: cadenceId } = await params;
  try {
    const body = await req.json();
    const { leadIds = [], cadenceName = "Drip Cadence", startStep = 1 } = body;

    if (!Array.isArray(leadIds) || leadIds.length === 0) {
      return Response.json(error("leadIds array is required and must not be empty"), { status: 400 });
    }

    const currentUserId = toValidUuid(ctx.session?.userId);
    const validLeadIds = leadIds.map(toValidUuid).filter(Boolean);

    if (validLeadIds.length > 0) {
      const auditRows = validLeadIds.map((leadId) => ({
        actorUserId: currentUserId,
        action: "CADENCE_ENROLLED",
        entityType: "lead",
        entityId: leadId,
        reason: `Enrolled prospect into "${cadenceName}" (Starting at Step ${startStep})`,
        afterSnapshot: {
          cadenceId,
          cadenceName,
          startStep,
          enrolledAt: new Date().toISOString(),
        },
      }));

      await db.insert(crmAuditEvents).values(auditRows).catch((e) => console.warn("Cadence enroll audit warning:", e));
    }

    return Response.json(
      success(
        {
          cadenceId,
          cadenceName,
          enrolledCount: leadIds.length,
          startStep,
          enrolledAt: new Date().toISOString(),
        },
        `Successfully enrolled ${leadIds.length} prospects into "${cadenceName}"`
      ),
      { status: 201 }
    );
  } catch (err) {
    return Response.json(error(err.message || "Failed to enroll leads in cadence"), { status: 400 });
  }
}

export const POST = createProtectedRoute(postEnrollLeadHandler, { policy: canAccessCrm });
