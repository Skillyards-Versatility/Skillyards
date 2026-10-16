import { db } from "@repo/db";
import {
  leads,
  users,
  salesTeams,
  salesTeamMemberships,
  crmUserRoles,
} from "@repo/db/schema";
import { eq, and, or, isNull, inArray, desc, sql } from "drizzle-orm";

const ACTIVE_LEAD_STATUSES = [
  "new",
  "contacted",
  "follow_up",
  "counselling_scheduled",
];

/**
 * Ensure at least one active sales team exists with active reps.
 */
export async function ensureDefaultSalesTeam() {
  try {
    const [existingTeam] = await db
      .select()
      .from(salesTeams)
      .where(eq(salesTeams.isActive, true))
      .limit(1);

    if (existingTeam) return existingTeam;

    // Create default sales team
    const [createdTeam] = await db
      .insert(salesTeams)
      .values({
        name: "Skillyards Primary Sales",
        isActive: true,
      })
      .returning();

    // Find users with sales/admin roles to attach
    const eligibleUsers = await db
      .select({ id: users.id })
      .from(users)
      .where(or(eq(users.role, "SALES"), eq(users.role, "MANAGER"), eq(users.role, "ADMIN")))
      .limit(10);

    for (const u of eligibleUsers) {
      await db.insert(salesTeamMemberships).values({
        teamId: createdTeam.id,
        userId: u.id,
        changedByUserId: u.id,
        changeReason: "Initial default team setup",
      });
    }

    return createdTeam;
  } catch (err) {
    console.error("Failed in ensureDefaultSalesTeam:", err);
    return null;
  }
}

/**
 * Find active sales teams with member count
 */
export async function findSalesTeamsWithMembers() {
  const teams = await db
    .select({
      id: salesTeams.id,
      name: salesTeams.name,
      isActive: salesTeams.isActive,
      createdAt: salesTeams.createdAt,
    })
    .from(salesTeams)
    .where(eq(salesTeams.isActive, true));

  const result = [];
  for (const team of teams) {
    const members = await db
      .select({
        userId: salesTeamMemberships.userId,
        name: users.name,
        email: users.email,
        role: users.role,
      })
      .from(salesTeamMemberships)
      .leftJoin(users, eq(salesTeamMemberships.userId, users.id))
      .where(
        and(
          eq(salesTeamMemberships.teamId, team.id),
          isNull(salesTeamMemberships.endedAt)
        )
      );

    result.push({
      ...team,
      members,
      memberCount: members.length,
    });
  }

  return result;
}

/**
 * Find eligible representatives for assignment
 */
export async function findEligibleReps(teamId = null) {
  let repUsers = [];

  if (teamId) {
    repUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      })
      .from(salesTeamMemberships)
      .innerJoin(users, eq(salesTeamMemberships.userId, users.id))
      .where(
        and(
          eq(salesTeamMemberships.teamId, teamId),
          isNull(salesTeamMemberships.endedAt)
        )
      );
  }

  // Fallback: If no members in team or team not specified, look for sales/admin users
  if (repUsers.length === 0) {
    repUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      })
      .from(users)
      .where(
        or(
          eq(users.role, "SALES"),
          eq(users.role, "MANAGER"),
          eq(users.role, "ADMIN")
        )
      );
  }

  return repUsers;
}

/**
 * Get current active lead count for a representative
 */
export async function getRepActiveLeadCount(userId) {
  const [res] = await db
    .select({ count: sql`count(*)::int` })
    .from(leads)
    .where(
      and(
        eq(leads.assignedToUserId, userId),
        inArray(leads.status, ACTIVE_LEAD_STATUSES),
        isNull(leads.mergedIntoLeadId)
      )
    );

  return res?.count || 0;
}

/**
 * Get timestamp of the last lead assigned to a representative
 */
export async function getRepLastAssignedAt(userId) {
  const [res] = await db
    .select({ lastAssignedAt: leads.createdAt })
    .from(leads)
    .where(eq(leads.assignedToUserId, userId))
    .orderBy(desc(leads.createdAt))
    .limit(1);

  return res?.lastAssignedAt ? new Date(res.lastAssignedAt) : new Date(0);
}

/**
 * Find unassigned leads awaiting queue routing
 */
export async function findUnassignedLeads({ limit = 50, offset = 0 } = {}) {
  const whereClause = and(
    isNull(leads.assignedToUserId),
    isNull(leads.mergedIntoLeadId)
  );

  const data = await db
    .select({
      id: leads.id,
      fullName: leads.fullName,
      normalizedPhone: leads.normalizedPhone,
      normalizedEmail: leads.normalizedEmail,
      status: leads.status,
      assignedTeamId: leads.assignedTeamId,
      assignedTeamName: salesTeams.name,
      createdAt: leads.createdAt,
    })
    .from(leads)
    .leftJoin(salesTeams, eq(leads.assignedTeamId, salesTeams.id))
    .where(whereClause)
    .orderBy(desc(leads.createdAt))
    .limit(limit)
    .offset(offset);

  const [totalRes] = await db
    .select({ count: sql`count(*)::int` })
    .from(leads)
    .where(whereClause);

  return {
    leads: data,
    total: totalRes?.count || 0,
  };
}

/**
 * Find leads assigned to a specific representative for their personal call queue
 */
export async function findRepQueueLeads(userId, { limit = 50, offset = 0 } = {}) {
  const whereClause = and(
    eq(leads.assignedToUserId, userId),
    inArray(leads.status, ACTIVE_LEAD_STATUSES),
    isNull(leads.mergedIntoLeadId)
  );

  const data = await db
    .select({
      id: leads.id,
      fullName: leads.fullName,
      normalizedPhone: leads.normalizedPhone,
      normalizedEmail: leads.normalizedEmail,
      status: leads.status,
      assignedToUserId: leads.assignedToUserId,
      assignedToUserName: users.name,
      createdAt: leads.createdAt,
      updatedAt: leads.updatedAt,
    })
    .from(leads)
    .leftJoin(users, eq(leads.assignedToUserId, users.id))
    .where(whereClause)
    .orderBy(desc(leads.createdAt))
    .limit(limit)
    .offset(offset);

  const [totalRes] = await db
    .select({ count: sql`count(*)::int` })
    .from(leads)
    .where(whereClause);

  return {
    leads: data,
    total: totalRes?.count || 0,
  };
}
