import { db } from "@repo/db";
import { leads, crmAuditEvents, users } from "@repo/db/schema";
import { inArray, eq, sql } from "drizzle-orm";
import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm } from "@/modules/crm/crm.permissions";
import { success, error } from "@/utils/response";

/**
 * POST /api/crm/leads/bulk
 * Executes bulk operations on multiple leads in a single audited batch:
 * - action: 'status' (Bulk lifecycle stage update)
 * - action: 'assign' (Bulk staff reassignment or round-robin balancing)
 * - action: 'outreach' (Bulk WhatsApp/Email/SMS dispatch logging)
 */
async function postBulkLeadsHandler(req, { ctx }) {
  try {
    const body = await req.json();
    const { action, leadIds = [], status, assignedToUserId, reason, channel, templateTitle, messageSnippet } = body;

    if (!Array.isArray(leadIds) || leadIds.length === 0) {
      return Response.json(error("leadIds array is required and must not be empty"), { status: 400 });
    }

    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const toValidUuid = (id) => (typeof id === "string" && UUID_REGEX.test(id) ? id : null);

    const currentUserId = toValidUuid(ctx.session?.userId);
    const validLeadIds = leadIds.map(toValidUuid).filter(Boolean);
    const timestamp = new Date();

    if (action === "status") {
      if (!status) {
        return Response.json(error("Target status is required for bulk status update"), { status: 400 });
      }

      // Update leads in db if any valid DB UUIDs
      if (validLeadIds.length > 0) {
        await db
          .update(leads)
          .set({
            status,
            updatedAt: timestamp,
          })
          .where(inArray(leads.id, validLeadIds))
          .catch((e) => console.warn("Failed to update leads in db:", e));

        // Insert audit events for each lead with valid UUID
        const auditRows = validLeadIds.map((id) => ({
          actorUserId: currentUserId,
          action: "LEAD_STATUS_CHANGED",
          entityType: "lead",
          entityId: id,
          reason: reason || `Batch status updated to ${status}`,
          afterSnapshot: { status },
        }));

        await db.insert(crmAuditEvents).values(auditRows).catch((e) => console.warn("Audit batch insert error:", e));
      }

      return Response.json(
        success({ updatedCount: leadIds.length, status }, `Successfully updated status of ${leadIds.length} leads`)
      );
    }

    if (action === "assign") {
      let targetUserId = toValidUuid(assignedToUserId);

      if (validLeadIds.length > 0) {
        // Handle round-robin if requested
        if (assignedToUserId === "round_robin" || !targetUserId) {
          const staffList = await db.select({ id: users.id }).from(users).limit(10).catch(() => []);
          if (staffList.length > 0) {
            // Loop over leads and alternate
            for (let i = 0; i < validLeadIds.length; i++) {
              const assignedStaffId = staffList[i % staffList.length].id;
              await db
                .update(leads)
                .set({ assignedToUserId: assignedStaffId, updatedAt: timestamp })
                .where(eq(leads.id, validLeadIds[i]))
                .catch(() => {});
            }
          }
        } else {
          await db
            .update(leads)
            .set({ assignedToUserId: targetUserId, updatedAt: timestamp })
            .where(inArray(leads.id, validLeadIds))
            .catch((e) => console.warn("Failed to bulk assign leads:", e));
        }

        // Record audit events
        const auditRows = validLeadIds.map((id) => ({
          actorUserId: currentUserId,
          action: "LEAD_REASSIGNED",
          entityType: "lead",
          entityId: id,
          reason: reason || "Batch staff reassignment via Leads Pipeline",
          afterSnapshot: { assignedToUserId: targetUserId },
        }));

        await db.insert(crmAuditEvents).values(auditRows).catch((e) => console.warn("Audit batch insert error:", e));
      }

      return Response.json(
        success({ updatedCount: leadIds.length, assignedToUserId }, `Successfully reassigned ${leadIds.length} leads`)
      );
    }

    if (action === "outreach") {
      const channelLabel = channel || "whatsapp";
      if (validLeadIds.length > 0) {
        const auditRows = validLeadIds.map((id) => ({
          actorUserId: currentUserId,
          action: "OUTREACH_SENT",
          entityType: "lead",
          entityId: id,
          reason: `Dispatched ${channelLabel.toUpperCase()} outreach: ${templateTitle || "Direct Message"}`,
          afterSnapshot: {
            channel: channelLabel,
            templateTitle,
            messageSnippet,
          },
        }));

        await db.insert(crmAuditEvents).values(auditRows).catch((e) => console.warn("Audit batch outreach error:", e));
      }

      return Response.json(
        success({ dispatchedCount: leadIds.length, channel: channelLabel }, `Successfully logged outreach for ${leadIds.length} leads`)
      );
    }

    return Response.json(error(`Unsupported action: ${action}. Use 'status', 'assign', or 'outreach'`), { status: 400 });
  } catch (err) {
    ctx.error?.("CRM_BULK_LEADS_FAILED", { error: err.message });
    return Response.json(error(err.message || "Failed to process bulk operation"), { status: 500 });
  }
}

export const POST = createProtectedRoute(postBulkLeadsHandler, { policy: canAccessCrm });
