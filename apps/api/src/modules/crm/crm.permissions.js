import { ROLES } from "@/lib/permissions";
import { db } from "@repo/db";
import { crmUserRoles } from "@repo/db/schema";
import { eq, and, isNull } from "drizzle-orm";

export const CRM_ROLES = {
  CRM_ADMIN: "crm_admin",
  SALES_MANAGER: "sales_manager",
  SALES_LEAD: "sales_lead",
  COUNSELLOR: "counsellor",
  BDA: "bda",
};

/**
 * Fetch active CRM roles for a user.
 */
export async function getUserCrmRoles(userId) {
  if (!userId) return [];
  try {
    const records = await db
      .select({ role: crmUserRoles.role })
      .from(crmUserRoles)
      .where(and(eq(crmUserRoles.userId, userId), isNull(crmUserRoles.revokedAt)));
    return records.map((r) => r.role);
  } catch (err) {
    console.error("Failed to query user CRM roles:", err);
    return [];
  }
}

/**
 * Policy: Check if user has CRM access
 */
export async function canAccessCrm(session) {
  if (!session || !session.userId) {
    return { authorized: false, reason: "NO_SESSION" };
  }

  // Admin/Manager override
  if ([ROLES.ADMIN, ROLES.MANAGER, ROLES.SALES].includes(session.role)) {
    return { authorized: true, reason: "PLATFORM_ROLE_ALLOW" };
  }

  // Check CRM roles
  const crmRoles = await getUserCrmRoles(session.userId);
  if (crmRoles.length > 0) {
    return { authorized: true, reason: "CRM_ROLE_ALLOW" };
  }

  return { authorized: false, reason: "NO_CRM_PERMISSION" };
}

/**
 * Policy: Check if user can view / edit lead
 */
export async function canAccessLead(session, lead, req) {
  if (!session || !session.userId) {
    return { authorized: false, reason: "NO_SESSION" };
  }

  // Admin / Manager / Sales Manager full access
  if ([ROLES.ADMIN, ROLES.MANAGER].includes(session.role)) {
    return { authorized: true, reason: "ADMIN_OVERRIDE" };
  }

  const crmRoles = await getUserCrmRoles(session.userId);
  if (crmRoles.includes(CRM_ROLES.CRM_ADMIN) || crmRoles.includes(CRM_ROLES.SALES_MANAGER)) {
    return { authorized: true, reason: "CRM_MANAGER_ALLOW" };
  }

  // If lead is unassigned or assigned to current user
  if (!lead.assignedToUserId || lead.assignedToUserId === session.userId) {
    return { authorized: true, reason: "ASSIGNED_USER_ALLOW" };
  }

  // Read-only for sales team colleagues if configured
  if (req?.method === "GET") {
    return { authorized: true, reason: "TEAM_READ_ALLOW" };
  }

  return { authorized: false, reason: "LEAD_SCOPE_RESTRICTED" };
}
