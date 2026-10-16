import {
  ensureDefaultSalesTeam,
  findSalesTeamsWithMembers,
  findEligibleReps,
  getRepActiveLeadCount,
  getRepLastAssignedAt,
  findUnassignedLeads,
  findRepQueueLeads,
} from "./crm.assignment.repository";
import { findLeadById, updateLead, recordAuditEvent } from "./crm.lead.repository";

// Default max active leads per sales rep before capacity cutoff
const DEFAULT_REP_CAPACITY = 50;

/**
 * Automated capacity-aware round-robin assignment engine
 */
export async function autoAssignLeadService(leadId, options = {}) {
  const lead = await findLeadById(leadId);
  if (!lead) {
    throw new Error("Lead not found for auto-assignment");
  }

  // Ensure team is present
  const defaultTeam = await ensureDefaultSalesTeam();
  const targetTeamId = lead.assignedTeamId || defaultTeam?.id || null;

  // Fetch eligible active reps
  const candidateReps = await findEligibleReps(targetTeamId);

  if (candidateReps.length === 0) {
    // Fallback: No sales reps available
    await updateLead(leadId, {
      assignedToUserId: null,
      assignedTeamId: targetTeamId,
    });

    await recordAuditEvent({
      action: "LEAD_ROUTED_UNASSIGNED",
      entityType: "lead",
      entityId: leadId,
      reason: "No active sales representatives found in destination team",
    });

    return {
      assigned: false,
      reason: "NO_ACTIVE_REPRESENTATIVES",
      unassigned: true,
    };
  }

  // Evaluate workload & capacity for each rep
  const repWorkloads = [];
  for (const rep of candidateReps) {
    const activeCount = await getRepActiveLeadCount(rep.id);
    const lastAssignedAt = await getRepLastAssignedAt(rep.id);
    const isAtCapacity = activeCount >= DEFAULT_REP_CAPACITY;

    repWorkloads.push({
      ...rep,
      activeCount,
      lastAssignedAt,
      isAtCapacity,
    });
  }

  // Filter reps with spare capacity
  const availableReps = repWorkloads.filter((r) => !r.isAtCapacity);

  if (availableReps.length === 0) {
    // Fallback: All reps at capacity, route safely to unassigned queue
    await updateLead(leadId, {
      assignedToUserId: null,
      assignedTeamId: targetTeamId,
    });

    await recordAuditEvent({
      action: "LEAD_ROUTED_UNASSIGNED",
      entityType: "lead",
      entityId: leadId,
      reason: `All ${repWorkloads.length} representatives have reached their active lead capacity limit (${DEFAULT_REP_CAPACITY})`,
      afterSnapshot: {
        capacityLimit: DEFAULT_REP_CAPACITY,
        teamId: targetTeamId,
      },
    });

    return {
      assigned: false,
      reason: "CAPACITY_EXHAUSTED",
      unassigned: true,
      totalRepsChecked: repWorkloads.length,
    };
  }

  // Sort strategy:
  // 1. Lowest active workload (workload-aware)
  // 2. Oldest assignment timestamp (least-recently-assigned round robin)
  // 3. Stable user ID (deterministic tie-break)
  availableReps.sort((a, b) => {
    if (a.activeCount !== b.activeCount) {
      return a.activeCount - b.activeCount;
    }
    if (a.lastAssignedAt.getTime() !== b.lastAssignedAt.getTime()) {
      return a.lastAssignedAt.getTime() - b.lastAssignedAt.getTime();
    }
    return a.id.localeCompare(b.id);
  });

  const chosenRep = availableReps[0];

  // Assign lead
  const updated = await updateLead(leadId, {
    assignedToUserId: chosenRep.id,
    assignedTeamId: targetTeamId,
  });

  await recordAuditEvent({
    action: "LEAD_ASSIGNED",
    entityType: "lead",
    entityId: leadId,
    reason: `Automated round-robin assignment (${chosenRep.activeCount} active leads)`,
    afterSnapshot: {
      assignedToUserId: chosenRep.id,
      assignedToUserName: chosenRep.name,
      assignedTeamId: targetTeamId,
      activeCountBeforeAssignment: chosenRep.activeCount,
    },
  });

  return {
    assigned: true,
    rep: chosenRep,
    teamId: targetTeamId,
    lead: updated,
  };
}

/**
 * Manual assignment or reassignment by staff/manager
 */
export async function manualAssignLeadService(
  leadId,
  { repId = null, teamId = null, reason = "Manual assignment" },
  actorUserId
) {
  const lead = await findLeadById(leadId);
  if (!lead) {
    throw new Error("Lead not found");
  }

  if (repId) {
    const activeCount = await getRepActiveLeadCount(repId);
    if (activeCount >= DEFAULT_REP_CAPACITY) {
      // Allowed with explicit override audit
      reason += ` (Note: Rep currently at/above capacity with ${activeCount} active leads)`;
    }
  }

  const updated = await updateLead(leadId, {
    assignedToUserId: repId || null,
    assignedTeamId: teamId || lead.assignedTeamId || null,
  });

  await recordAuditEvent({
    actorUserId,
    action: repId ? "LEAD_ASSIGNED" : "LEAD_UNASSIGNED",
    entityType: "lead",
    entityId: leadId,
    reason,
    beforeSnapshot: {
      assignedToUserId: lead.assignedToUserId,
      assignedTeamId: lead.assignedTeamId,
    },
    afterSnapshot: {
      assignedToUserId: repId || null,
      assignedTeamId: teamId || lead.assignedTeamId || null,
    },
  });

  return updated;
}

/**
 * Claim an unassigned lead into the logged-in rep's pipeline
 */
export async function claimLeadService(leadId, repUserId) {
  const lead = await findLeadById(leadId);
  if (!lead) {
    throw new Error("Lead not found");
  }

  if (lead.assignedToUserId) {
    throw new Error("Lead has already been claimed by another representative");
  }

  const activeCount = await getRepActiveLeadCount(repUserId);
  if (activeCount >= DEFAULT_REP_CAPACITY) {
    throw new Error(
      `Cannot claim lead: You have reached your active lead capacity limit (${DEFAULT_REP_CAPACITY})`
    );
  }

  const updated = await updateLead(leadId, {
    assignedToUserId: repUserId,
  });

  await recordAuditEvent({
    actorUserId: repUserId,
    action: "LEAD_CLAIMED",
    entityType: "lead",
    entityId: leadId,
    reason: "Representative claimed unassigned prospect from queue",
    afterSnapshot: {
      assignedToUserId: repUserId,
      activeCountBeforeClaim: activeCount,
    },
  });

  return updated;
}

/**
 * Query unassigned queue or user's active call queue
 */
export async function getQueueService({
  type = "unassigned",
  userId = null,
  page = 1,
  limit = 50,
}) {
  const numLimit = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 100);
  const numPage = Math.max(parseInt(page, 10) || 1, 1);
  const offset = (numPage - 1) * numLimit;

  if (type === "my_queue") {
    if (!userId) {
      throw new Error("User ID is required for personal call queue");
    }
    const result = await findRepQueueLeads(userId, { limit: numLimit, offset });
    return {
      type: "my_queue",
      items: result.leads,
      pagination: {
        total: result.total,
        page: numPage,
        limit: numLimit,
        totalPages: Math.ceil(result.total / numLimit),
      },
    };
  }

  // Default: unassigned queue
  const result = await findUnassignedLeads({ limit: numLimit, offset });
  return {
    type: "unassigned",
    items: result.leads,
    pagination: {
      total: result.total,
      page: numPage,
      limit: numLimit,
      totalPages: Math.ceil(result.total / numLimit),
    },
  };
}

/**
 * Get sales teams with member capacity status
 */
export async function getSalesTeamsService() {
  const teams = await findSalesTeamsWithMembers();

  for (const team of teams) {
    for (const member of team.members) {
      member.activeLeads = await getRepActiveLeadCount(member.userId);
      member.capacityLimit = DEFAULT_REP_CAPACITY;
      member.isAtCapacity = member.activeLeads >= DEFAULT_REP_CAPACITY;
    }
  }

  return teams;
}
