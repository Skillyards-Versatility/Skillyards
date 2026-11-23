"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Trophy,
  Award,
  TrendingUp,
  Download,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowUpRight,
  Flame,
  Search,
  DollarSign,
  Users,
  Check,
  ChevronRight,
} from "lucide-react";
import { crmApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { ApprovePayoutModal } from "@/components/incentives/ApprovePayoutModal";

const INITIAL_REPS = [
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
    status: "approved",
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

export default function SalesIncentivesPage() {
  const { user: currentUser } = useAuth();
  const [reps, setReps] = useState(INITIAL_REPS);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toastMessage, setToastMessage] = useState(null);

  // Modals
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [selectedRepForApproval, setSelectedRepForApproval] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchIncentives = async () => {
    setLoading(true);
    let loaded = [];

    try {
      const res = await crmApi.getIncentives();
      if (res && res.data && res.data.reps) {
        loaded = res.data.reps;
      }
    } catch (_) {}

    if (loaded.length === 0) {
      loaded = [...INITIAL_REPS];
    }

    // Merge custom approvals from localStorage
    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("skillyards_custom_incentives") || "[]");
        if (stored.length > 0) {
          const storedIds = new Set(stored.map((s) => s.id));
          const filtered = loaded.filter((l) => !storedIds.has(l.id));
          loaded = [...stored, ...filtered];
        }
      } catch (_) {}
    }

    setReps(loaded);
    setLoading(false);
  };

  useEffect(() => {
    fetchIncentives();
  }, []);

  // Aggregated KPIs
  const kpis = useMemo(() => {
    const totalPoolEarned = reps.reduce((sum, r) => sum + (Number(r.commissionEarned) || 0), 0);
    const totalAdmissions = reps.reduce((sum, r) => sum + (Number(r.closedAdmissions) || 0), 0);
    const totalTarget = reps.reduce((sum, r) => sum + (Number(r.targetAdmissions) || 0), 0);
    const totalTuitionRevenue = reps.reduce((sum, r) => sum + (Number(r.tuitionRevenueClosed) || 0), 0);

    const teamAttainmentRate = totalTarget > 0 ? Number(((totalAdmissions / totalTarget) * 100).toFixed(1)) : 0;
    const avgCommission = reps.length > 0 ? Math.round(totalPoolEarned / reps.length) : 0;

    const sortedByEarnings = [...reps].sort((a, b) => b.commissionEarned - a.commissionEarned);
    const topEarner = sortedByEarnings[0];

    return {
      totalPoolEarned,
      totalAdmissions,
      totalTarget,
      totalTuitionRevenue,
      teamAttainmentRate,
      avgCommission,
      topEarner,
      approvedCount: reps.filter((r) => r.status === "approved").length,
      pendingCount: reps.filter((r) => r.status === "pending_approval").length,
    };
  }, [reps]);

  // Ranked Reps for Podium
  const rankedReps = useMemo(() => {
    return [...reps].sort((a, b) => b.closedAdmissions - a.closedAdmissions);
  }, [reps]);

  // Filtered List
  const filteredReps = useMemo(() => {
    return reps.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchesName = r.repName.toLowerCase().includes(q);
        const matchesEmail = r.email.toLowerCase().includes(q);
        const matchesRole = r.role.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesRole) return false;
      }
      return true;
    });
  }, [reps, statusFilter, searchTerm]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "Representative Name",
      "Email",
      "Role",
      "Target Admissions",
      "Closed Admissions",
      "Attainment %",
      "Tuition Revenue (INR)",
      "Commission Payout (INR)",
      "Status",
      "Approved By",
    ];

    const rows = filteredReps.map((r) => [
      `"${r.repName}"`,
      `"${r.email}"`,
      `"${r.role}"`,
      r.targetAdmissions,
      r.closedAdmissions,
      `${Math.round((r.closedAdmissions / (r.targetAdmissions || 1)) * 100)}%`,
      r.tuitionRevenueClosed,
      r.commissionEarned,
      `"${r.status}"`,
      `"${r.approvedBy || "N/A"}"`,
    ]);

    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `skillyards-sales-incentives-ledger-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    showToast("Downloaded sales payroll incentive ledger CSV");
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#0c1316] text-white px-4 py-2.5 rounded-xl shadow-xl border border-[rgba(98,146,158,0.3)] flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-[#25D366]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#1C2527] tracking-tight">
              Sales Gamification & Commission Desk
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#B07238]/15 border border-[#B07238]/30 text-[#B07238] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
              <Trophy className="w-3.5 h-3.5" />
              <span>October Sprint</span>
            </span>
          </div>
          <p className="text-xs text-[#5A6E71] mt-1 font-medium max-w-2xl">
            Live rep leaderboard podium, slab-based admissions commission calculation, and manager payroll verification ledger.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap shrink-0">
          <button
            onClick={fetchIncentives}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-[#FAF6EE] text-[#1C2527] border border-[rgba(71,86,87,0.2)] text-xs font-semibold transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#5A6E71] ${loading ? "animate-spin" : ""}`} />
            <span>Sync</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-[#FAF6EE] text-[#1C2527] border border-[rgba(71,86,87,0.2)] text-xs font-semibold transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Export Payroll CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Executive Incentive KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 2xl:gap-5">
        
        {/* Total Commission Pool */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-white via-[#FAF6EE] to-[#F3F9F5] border border-[rgba(71,86,87,0.18)] hover:border-[#2E7559]/40 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-[#5A6E71] text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Commission Pool Earned</span>
            <div className="w-8 h-8 rounded-lg bg-[#2E7559]/15 border border-[#2E7559]/25 flex items-center justify-center text-[#2E7559]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-black text-[#2E7559] font-mono tracking-tight">
            ₹{kpis.totalPoolEarned.toLocaleString("en-IN")}
          </div>
          <p className="text-[11px] sm:text-xs text-[#5A6E71] mt-1">Across {reps.length} active sales representatives</p>
        </div>

        {/* Team Target Attainment */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-white via-[#FAF6EE] to-[#FFF8EE] border border-[rgba(71,86,87,0.18)] hover:border-[#D97706]/40 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-[#5A6E71] text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Team Target Attainment</span>
            <div className="w-8 h-8 rounded-lg bg-[#D97706]/15 border border-[#D97706]/25 flex items-center justify-center text-[#D97706]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-black text-[#1C2527] font-mono tracking-tight">
            {kpis.teamAttainmentRate}%
          </div>
          <p className="text-[11px] sm:text-xs text-[#5A6E71] mt-1">
            {kpis.totalAdmissions} of {kpis.totalTarget} monthly target
          </p>
        </div>

        {/* Gross Tuition Generated */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-white via-[#FAF6EE] to-[#FDF5ED] border border-[rgba(71,86,87,0.18)] hover:border-[#B07238]/40 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-[#5A6E71] text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Tuition Revenue Closed</span>
            <div className="w-8 h-8 rounded-lg bg-[#B07238]/15 border border-[#B07238]/25 flex items-center justify-center text-[#B07238]">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-black text-[#1C2527] font-mono tracking-tight">
            ₹{(kpis.totalTuitionRevenue / 100000).toFixed(2)}L
          </div>
          <p className="text-[11px] sm:text-xs text-[#5A6E71] mt-1">Generated by closing sales team</p>
        </div>

        {/* Top Podium Champion */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-white via-[#FFF8EC] to-[#F7ECDB] border-2 border-[#B07238]/35 shadow-xs hover:shadow-md transition-all relative overflow-hidden">
          <div className="flex items-center justify-between text-[#5A6E71] text-xs mb-2">
            <span className="font-bold uppercase tracking-wider text-[10px] text-[#B07238]">🥇 Podium Champion</span>
            <div className="w-8 h-8 rounded-lg bg-[#B07238]/20 border border-[#B07238]/30 flex items-center justify-center text-[#B07238]">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-xl lg:text-2xl font-black text-[#1C2527] truncate">
            {kpis.topEarner?.repName || "Priya Patel"}
          </div>
          <p className="text-[11px] sm:text-xs text-[#2E7559] font-bold mt-1 font-mono">
            ₹{kpis.topEarner?.commissionEarned.toLocaleString("en-IN")} payout ({kpis.topEarner?.closedAdmissions} admissions)
          </p>
        </div>

      </div>

      {/* Interactive Podium Stage (1st, 2nd, 3rd Place) */}
      <div className="p-6 bg-gradient-to-b from-[#FFFDF8] via-[#FAF3E6] to-[#EFE2CE] rounded-2xl border border-[#D97706]/25 shadow-sm">
        <div className="text-center space-y-1 mb-6">
          <h2 className="text-base font-black text-[#1C2527] flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5 text-[#B07238]" />
            <span>October Sales Champions Podium</span>
          </h2>
          <p className="text-xs text-[#5A6E71]">
            Real-time standings based on verified admissions closures and student fee settlements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end max-w-3xl mx-auto">
          
          {/* 🥈 2nd Place Podium */}
          {rankedReps[1] && (
            <div className="p-4 bg-gradient-to-b from-white to-[#F5F8FA] rounded-2xl border border-slate-300 text-center space-y-2 shadow-xs order-2 md:order-1">
              <span className="text-2xl">🥈</span>
              <div className="w-12 h-12 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-sm mx-auto shadow-xs">
                {rankedReps[1].avatar}
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1C2527]">{rankedReps[1].repName}</h4>
                <p className="text-[11px] text-[#5A6E71]">{rankedReps[1].role}</p>
              </div>
              <div className="pt-2 border-t border-[rgba(71,86,87,0.1)] space-y-0.5">
                <span className="text-lg font-black text-[#1C2527] font-mono">{rankedReps[1].closedAdmissions} Admissions</span>
                <p className="text-xs font-bold text-[#2E7559] font-mono">₹{rankedReps[1].commissionEarned.toLocaleString("en-IN")}</p>
              </div>
              <div className="flex items-center justify-center gap-1 text-[10px] text-[#B07238] font-bold">
                <Flame className="w-3 h-3" />
                <span>{rankedReps[1].streakDays} Day Streak</span>
              </div>
            </div>
          )}

          {/* 🥇 1st Place Podium (Elevated) */}
          {rankedReps[0] && (
            <div className="p-5 bg-gradient-to-b from-white via-[#FFF8EC] to-[#F7ECDB] rounded-2xl border-2 border-[#D97706] text-center space-y-2 shadow-md order-1 md:order-2 md:-translate-y-4 relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#B07238] text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <Trophy className="w-3 h-3" />
                <span>Leader</span>
              </div>
              <span className="text-3xl block pt-1">🥇</span>
              <div className="w-14 h-14 rounded-full bg-[#0c1316] text-white font-bold flex items-center justify-center text-base mx-auto shadow-sm">
                {rankedReps[0].avatar}
              </div>
              <div>
                <h4 className="font-black text-base text-[#1C2527]">{rankedReps[0].repName}</h4>
                <p className="text-xs text-[#5A6E71]">{rankedReps[0].role}</p>
              </div>
              <div className="pt-2 border-t border-[rgba(71,86,87,0.1)] space-y-0.5">
                <span className="text-xl font-black text-[#2E7559] font-mono">{rankedReps[0].closedAdmissions} Admissions</span>
                <p className="text-sm font-black text-[#2E7559] font-mono">₹{rankedReps[0].commissionEarned.toLocaleString("en-IN")}</p>
              </div>
              <div className="flex items-center justify-center gap-1 text-xs text-[#B07238] font-bold">
                <Flame className="w-3.5 h-3.5" />
                <span>{rankedReps[0].streakDays} Day Hot Streak 🔥</span>
              </div>
            </div>
          )}

          {/* 🥉 3rd Place Podium */}
          {rankedReps[2] && (
            <div className="p-4 bg-gradient-to-b from-white to-[#FAF6EE] rounded-2xl border border-amber-300/80 text-center space-y-2 shadow-xs order-3 md:order-3">
              <span className="text-2xl">🥉</span>
              <div className="w-12 h-12 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-sm mx-auto shadow-xs">
                {rankedReps[2].avatar}
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1C2527]">{rankedReps[2].repName}</h4>
                <p className="text-[11px] text-[#5A6E71]">{rankedReps[2].role}</p>
              </div>
              <div className="pt-2 border-t border-[rgba(71,86,87,0.1)] space-y-0.5">
                <span className="text-lg font-black text-[#1C2527] font-mono">{rankedReps[2].closedAdmissions} Admissions</span>
                <p className="text-xs font-bold text-[#2E7559] font-mono">₹{rankedReps[2].commissionEarned.toLocaleString("en-IN")}</p>
              </div>
              <div className="flex items-center justify-center gap-1 text-[10px] text-[#B07238] font-bold">
                <Flame className="w-3 h-3" />
                <span>{rankedReps[2].streakDays} Day Streak</span>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Commission Slabs Policy Strip */}
      <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] space-y-3 shadow-xs">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold uppercase tracking-wider text-[10.5px] text-[#7E939A]">
            Official Commission Policy Slabs
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { tier: "Tier 1: Kickoff", count: "1 to 5 Admissions", rate: "₹1,500 / student", note: "Base onboarding tier" },
            { tier: "Tier 2: Growth", count: "6 to 10 Admissions", rate: "₹2,500 / student", note: "+66% rate acceleration" },
            { tier: "Tier 3: Accelerator", count: "11 to 15 Admissions", rate: "₹3,500 / student", note: "High performer slab" },
            { tier: "Tier 4: Super Achiever", count: "16+ Admissions", rate: "₹5,000 / student", bonus: "+ ₹10,000 Milestone Bonus", highlight: true },
          ].map((slab) => (
            <div
              key={slab.tier}
              className={`p-3 rounded-xl border text-xs space-y-1 ${
                slab.highlight
                  ? "bg-[#2E7559]/10 border-[#2E7559]/30 text-[#1C2527]"
                  : "bg-white border-[rgba(71,86,87,0.14)] text-[#1C2527]"
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-[#7E939A] block">{slab.tier}</span>
              <p className="font-bold text-sm text-[#1C2527]">{slab.count}</p>
              <p className="font-mono font-bold text-xs text-[#2E7559]">{slab.rate}</p>
              {slab.bonus && (
                <span className="inline-block px-1.5 py-0.2 rounded bg-[#2E7559] text-white text-[9.5px] font-bold">
                  {slab.bonus}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Rep Performance & Payroll Approval Ledger Table */}
      <div className="crm-table-box">
        
        {/* Table Filter & Search Header */}
        <div className="p-3.5 sm:p-4 border-b border-[rgba(71,86,87,0.14)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7E939A]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search sales reps..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-[rgba(71,86,87,0.2)] text-xs text-[#1C2527] focus:outline-none focus:ring-1 focus:ring-[#2E7559]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-white border border-[rgba(71,86,87,0.2)] text-xs text-[#1C2527] focus:outline-none focus:ring-1 focus:ring-[#2E7559]"
            >
              <option value="all">All Approval States</option>
              <option value="approved">Approved & Locked</option>
              <option value="pending_approval">Pending Approval</option>
            </select>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="crm-table w-full min-w-[760px] text-left text-xs sm:text-sm">
            <thead className="crm-thead">
              <tr>
                <th className="py-3 px-4 font-bold min-w-[210px]">Representative</th>
                <th className="py-3 px-4 font-bold min-w-[170px]">Admissions Attainment</th>
                <th className="py-3 px-4 font-bold text-right min-w-[130px]">Tuition Closed</th>
                <th className="py-3 px-4 font-bold text-right min-w-[140px]">Commission Payout</th>
                <th className="py-3 px-4 font-bold min-w-[150px]">Special Badges</th>
                <th className="py-3 px-4 font-bold text-center min-w-[110px]">Status</th>
                <th className="py-3 px-4 font-bold text-right min-w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(71,86,87,0.1)] text-[#1C2527]">
              {filteredReps.map((rep) => {
                const attainmentPct = Math.round((rep.closedAdmissions / (rep.targetAdmissions || 1)) * 100);
                const isApproved = rep.status === "approved";

                return (
                  <tr key={rep.id} className="hover:bg-white/60 transition-colors">
                    
                    {/* Rep Particulars */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#0c1316] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                          {rep.avatar}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-xs sm:text-sm lg:text-[14.5px] text-[#1C2527]">{rep.repName}</p>
                          <p className="text-[11px] sm:text-xs text-[#5A6E71]">{rep.role} • {rep.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Admissions Progress Track */}
                    <td className="py-3 px-4">
                      <div className="space-y-1 max-w-xs">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="font-bold text-[#1C2527] font-mono">
                            {rep.closedAdmissions} of {rep.targetAdmissions}
                          </span>
                          <span
                            className={`font-bold font-mono ${
                              attainmentPct >= 100 ? "text-[#2E7559]" : "text-[#B07238]"
                            }`}
                          >
                            {attainmentPct}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[rgba(71,86,87,0.15)] overflow-hidden">
                          <div
                            className={`h-full ${
                              attainmentPct >= 100 ? "bg-[#2E7559]" : "bg-[#B07238]"
                            }`}
                            style={{ width: `${Math.min(100, attainmentPct)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Tuition Closed */}
                    <td className="py-3 px-4 text-right">
                      <span className="font-mono font-bold text-xs sm:text-sm text-[#1C2527] block">
                        ₹{(rep.tuitionRevenueClosed / 100000).toFixed(2)}L
                      </span>
                      <span className="text-[11px] text-[#7E939A]">
                        Avg: ₹{Math.round(rep.avgDealSize).toLocaleString("en-IN")}
                      </span>
                    </td>

                    {/* Commission Payout */}
                    <td className="py-3 px-4 text-right">
                      <span className="font-mono font-black text-xs sm:text-sm text-[#2E7559] block">
                        ₹{rep.commissionEarned.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[11px] text-[#7E939A]">Slab calculated</span>
                    </td>

                    {/* Badges */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {rep.badges.slice(0, 2).map((b) => (
                          <span
                            key={b}
                            className="px-2 py-0.5 rounded-md bg-white border border-[rgba(71,86,87,0.18)] text-[11px] sm:text-xs font-semibold text-[#1C2527]"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      {isApproved ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#2E7559]/15 border border-[#2E7559]/30 text-[#2E7559] text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Locked</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
                          <span>Pending Signoff</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Approve Payout */}
                        {!isApproved ? (
                          <button
                            onClick={() => {
                              setSelectedRepForApproval(rep);
                              setApproveModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#2E7559] to-[#1e5842] hover:from-[#1e5842] hover:to-[#144432] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer border border-[#1e5842]"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                        ) : (
                          <span className="text-xs text-[#7E939A] font-mono px-2 py-1 font-semibold">
                            Verified
                          </span>
                        )}
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <ApprovePayoutModal
        isOpen={approveModalOpen}
        onClose={() => {
          setApproveModalOpen(false);
          setSelectedRepForApproval(null);
        }}
        rep={selectedRepForApproval}
        onApproved={(updated) => {
          showToast(`Commission payout of ₹${updated.commissionEarned.toLocaleString("en-IN")} locked for ${updated.repName}`);
          fetchIncentives();
        }}
      />

    </div>
  );
}
