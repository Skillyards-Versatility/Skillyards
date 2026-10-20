import { db } from "@repo/db";
import { crmAuditEvents, users, students } from "@repo/db/schema";
import { eq, desc } from "drizzle-orm";
import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm } from "@/modules/crm/crm.permissions";
import { success, error } from "@/utils/response";

export const COMMISSION_SLABS = [
  { tier: 1, min: 1, max: 5, ratePerAdmission: 1500, label: "Tier 1: Kickoff (1–5 Admissions)" },
  { tier: 2, min: 6, max: 10, ratePerAdmission: 2500, label: "Tier 2: Growth (6–10 Admissions)" },
  { tier: 3, min: 11, max: 15, ratePerAdmission: 3500, label: "Tier 3: Accelerator (11–15 Admissions)" },
  { tier: 4, min: 16, max: 999, ratePerAdmission: 5000, bonus: 10000, label: "Tier 4: Super Achiever (>15 Admissions + ₹10k Bonus)" },
];

export const INITIAL_REPS_INCENTIVES = [
  {
    id: "rep-101",
    repName: "Priya Patel",
    email: "priya.patel@skillyards.com",
    role: "Senior Counsellor",
    avatar: "PP",
    targetAdmissions: 18,
    closedAdmissions: 21,
    tuitionRevenueClosed: 948000,
    commissionEarned: 52500,
    status: "approved", // approved | pending_approval
    approvedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    approvedBy: "Sales Director",
    badges: ["🥇 Gold Closer", "🎯 100%+ Target Attainment", "⚡ Fastest First Connect"],
    streakDays: 6,
    avgDealSize: 45142,
  },
  {
    id: "rep-102",
    repName: "Amit Kumar",
    email: "amit.kumar@skillyards.com",
    role: "Admissions Specialist",
    avatar: "AK",
    targetAdmissions: 15,
    closedAdmissions: 16,
    tuitionRevenueClosed: 814000,
    commissionEarned: 37500,
    status: "approved",
    approvedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    approvedBy: "Sales Director",
    badges: ["🥈 Silver Closer", "📞 180+ Dials Daily Club"],
    streakDays: 4,
    avgDealSize: 50875,
  },
  {
    id: "rep-103",
    repName: "Vikram Malhotra",
    email: "vikram.m@skillyards.com",
    role: "Academic Counsellor",
    avatar: "VM",
    targetAdmissions: 15,
    closedAdmissions: 12,
    tuitionRevenueClosed: 546000,
    commissionEarned: 24500,
    status: "pending_approval",
    approvedAt: null,
    approvedBy: null,
    badges: ["🥉 Bronze Closer", "🎓 4.9/5 Student Rating"],
    streakDays: 2,
    avgDealSize: 45500,
  },
  {
    id: "rep-104",
    repName: "Sneha Rao",
    email: "sneha.rao@skillyards.com",
    role: "Telecalling Specialist",
    avatar: "SR",
    targetAdmissions: 12,
    closedAdmissions: 10,
    tuitionRevenueClosed: 451000,
    commissionEarned: 17500,
    status: "pending_approval",
    approvedAt: null,
    approvedBy: null,
    badges: ["🔥 Consistency Star", "📱 98% Connect Rate"],
    streakDays: 3,
    avgDealSize: 45100,
  },
  {
    id: "rep-105",
    repName: "Rajesh Verma",
    email: "rajesh.v@skillyards.com",
    role: "Junior Admissions Executive",
    avatar: "RV",
    targetAdmissions: 10,
    closedAdmissions: 7,
    tuitionRevenueClosed: 316000,
    commissionEarned: 11500,
    status: "pending_approval",
    approvedAt: null,
    approvedBy: null,
    badges: ["🚀 Rising Talent", "💡 Best Objection Handler"],
    streakDays: 1,
    avgDealSize: 45142,
  },
];

let runtimeRepsIncentives = [...INITIAL_REPS_INCENTIVES];

/**
 * Calculates commission payout based on slab rules
 */
export function calculateCommission(admissions) {
  let count = Number(admissions) || 0;
  if (count <= 0) return 0;

  let total = 0;
  // Tier 1: first 5 @ 1500
  const t1 = Math.min(count, 5);
  total += t1 * 1500;
  count -= t1;

  // Tier 2: next 5 @ 2500
  if (count > 0) {
    const t2 = Math.min(count, 5);
    total += t2 * 2500;
    count -= t2;
  }

  // Tier 3: next 5 @ 3500
  if (count > 0) {
    const t3 = Math.min(count, 5);
    total += t3 * 3500;
    count -= t3;
  }

  // Tier 4: all remaining @ 5000 + 10,000 bonus
  if (count > 0) {
    total += count * 5000 + 10000;
  }

  return total;
}

/**
 * GET /api/crm/incentives
 * Returns sales team commission leaderboard, slabs, and monthly payout statistics
 */
async function getIncentivesHandler(req, { ctx }) {
  try {
    const list = [...runtimeRepsIncentives];

    // Compute team aggregates
    const totalPoolEarned = list.reduce((sum, r) => sum + (Number(r.commissionEarned) || 0), 0);
    const totalAdmissions = list.reduce((sum, r) => sum + (Number(r.closedAdmissions) || 0), 0);
    const totalTarget = list.reduce((sum, r) => sum + (Number(r.targetAdmissions) || 0), 0);
    const totalTuitionRevenue = list.reduce((sum, r) => sum + (Number(r.tuitionRevenueClosed) || 0), 0);

    const teamAttainmentRate = totalTarget > 0 ? Number(((totalAdmissions / totalTarget) * 100).toFixed(1)) : 0;
    const avgCommissionPerRep = list.length > 0 ? Math.round(totalPoolEarned / list.length) : 0;

    const topEarner = [...list].sort((a, b) => b.commissionEarned - a.commissionEarned)[0];

    return Response.json(
      success(
        {
          reps: list,
          slabs: COMMISSION_SLABS,
          metrics: {
            totalPoolEarned,
            totalAdmissions,
            totalTarget,
            totalTuitionRevenue,
            teamAttainmentRate,
            avgCommissionPerRep,
            topEarnerName: topEarner?.repName || "Priya Patel",
            topEarnerPayout: topEarner?.commissionEarned || 52500,
            approvedCount: list.filter((r) => r.status === "approved").length,
            pendingCount: list.filter((r) => r.status === "pending_approval").length,
          },
        },
        "Incentives and leaderboard fetched successfully"
      )
    );
  } catch (err) {
    ctx.error?.("CRM_GET_INCENTIVES_FAILED", { error: err.message });
    return Response.json(error(err.message || "Failed to load incentives data"), { status: 500 });
  }
}

/**
 * POST /api/crm/incentives/approve
 * Manager action to approve & lock a rep's monthly commission payout
 */
async function approveIncentiveHandler(req, { ctx }) {
  try {
    const body = await req.json();
    const { repId, note } = body;

    if (!repId) {
      return Response.json(error("repId is required"), { status: 400 });
    }

    const idx = runtimeRepsIncentives.findIndex((r) => r.id === repId);
    if (idx === -1) {
      return Response.json(error("Representative not found"), { status: 404 });
    }

    const rep = runtimeRepsIncentives[idx];
    const updated = {
      ...rep,
      status: "approved",
      approvedAt: new Date().toISOString(),
      approvedBy: ctx.user?.name || "Sales Manager",
      approvalNote: note || "Verified against bank settlement receipts",
    };

    runtimeRepsIncentives[idx] = updated;

    // Log audit event
    try {
      await db.insert(crmAuditEvents).values({
        actorId: ctx.user?.id || null,
        actorName: ctx.user?.name || "Sales Manager",
        action: "INCENTIVE_LOCKED",
        entityType: "staff",
        entityId: repId,
        reason: `Approved monthly sales commission of ₹${rep.commissionEarned.toLocaleString("en-IN")} for ${rep.repName}`,
        afterSnapshot: updated,
      });
    } catch (_) {}

    return Response.json(success(updated, "Commission payout approved successfully"));
  } catch (err) {
    ctx.error?.("CRM_APPROVE_INCENTIVE_FAILED", { error: err.message });
    return Response.json(error(err.message || "Failed to approve commission"), { status: 500 });
  }
}

export const GET = createProtectedRoute(canAccessCrm, getIncentivesHandler);
export const POST = createProtectedRoute(canAccessCrm, approveIncentiveHandler);
export { runtimeRepsIncentives };
