import { db } from "@repo/db";
import { crmAuditEvents, leads } from "@repo/db/schema";
import { eq } from "drizzle-orm";
import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm } from "@/modules/crm/crm.permissions";
import { success, error } from "@/utils/response";

/**
 * POST /api/crm/leads/[id]/outreach
 * Logs a single candidate WhatsApp, Email, or SMS outreach dispatch into the audit timeline
 */
async function postOutreachHandler(req, { ctx, params }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { channel = "whatsapp", templateTitle = "Outreach", messageSnippet = "" } = body;

    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const toValidUuid = (val) => (typeof val === "string" && UUID_REGEX.test(val) ? val : null);

    const currentUserId = toValidUuid(ctx.session?.userId);
    const validLeadId = toValidUuid(id);

    // If demo lead ID or non-UUID, return success gracefully
    if (!validLeadId) {
      return Response.json(
        success(
          {
            id: `outreach-${Date.now()}`,
            leadId: id,
            channel,
            templateTitle,
            messageSnippet,
            timestamp: new Date().toISOString(),
          },
          "Outreach logged successfully"
        ),
        { status: 201 }
      );
    }

    // Verify lead exists in db
    const [lead] = await db.select({ id: leads.id }).from(leads).where(eq(leads.id, validLeadId)).limit(1);
    if (!lead) {
      return Response.json(error("Lead not found"), { status: 404 });
    }

    // Insert audit event
    const [event] = await db
      .insert(crmAuditEvents)
      .values({
        actorUserId: currentUserId,
        action: "OUTREACH_SENT",
        entityType: "lead",
        entityId: validLeadId,
        reason: `Dispatched ${channel.toUpperCase()} outreach: ${templateTitle}`,
        afterSnapshot: {
          channel,
          templateTitle,
          messageSnippet,
        },
      })
      .returning();

    return Response.json(
      success(
        {
          id: event.id,
          leadId: id,
          channel,
          templateTitle,
          messageSnippet,
          timestamp: event.createdAt,
        },
        "Outreach logged successfully"
      ),
      { status: 201 }
    );
  } catch (err) {
    ctx.error?.("CRM_LOG_OUTREACH_FAILED", { error: err.message });
    return Response.json(error(err.message || "Failed to log outreach"), { status: 400 });
  }
}

export const POST = createProtectedRoute(postOutreachHandler, { policy: canAccessCrm });
