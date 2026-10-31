"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Workflow,
  Search,
  Plus,
  Download,
  RefreshCw,
  Clock,
  Users,
  MessageSquare,
  Phone,
  Mail,
  Smartphone,
  CheckCircle2,
  TrendingUp,
  Award,
  ChevronRight,
  Sparkles,
  Play,
  Pause,
  ArrowRight,
  Check,
} from "lucide-react";
import { crmApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { CreateCadenceModal } from "@/components/cadences/CreateCadenceModal";
import { CadenceDetailsDrawer } from "@/components/cadences/CadenceDetailsDrawer";

const CHANNEL_BADGES = {
  whatsapp: { icon: MessageSquare, color: "text-[#25D366] bg-[#25D366]/10 border-[#25D366]/30" },
  call: { icon: Phone, color: "text-[#128C7E] bg-[#128C7E]/10 border-[#128C7E]/30" },
  email: { icon: Mail, color: "text-[#D97706] bg-[#D97706]/10 border-[#D97706]/30" },
  sms: { icon: Smartphone, color: "text-[#D97706] bg-[#D97706]/10 border-[#D97706]/30" },
};

const BASE_DEMO_CADENCES = [
  {
    id: "cad-101",
    name: "7-Day High Intent Prospect Nurture",
    code: "CAD-7D-INTENT",
    targetCourse: "Full Stack Web Development (MERN)",
    description: "Automated 5-step multi-channel cadence for fresh web enquiries, converting interest into counselling.",
    status: "active",
    enrolledCount: 28,
    activeCount: 19,
    completedCount: 9,
    convertedCount: 6,
    conversionRate: 21.4,
    responseRate: 46.4,
    channels: ["whatsapp", "call", "email", "sms"],
    steps: [
      { stepNumber: 1, dayOffset: 0, channel: "whatsapp", title: "Instant Course Brochure & Welcome" },
      { stepNumber: 2, dayOffset: 1, channel: "call", title: "Discovery Phone Consultation Task" },
      { stepNumber: 3, dayOffset: 3, channel: "email", title: "Career Counselling Session Invite" },
      { stepNumber: 4, dayOffset: 5, channel: "whatsapp", title: "15% Academic Merit Scholarship Grant" },
      { stepNumber: 5, dayOffset: 7, channel: "call", title: "Final Cohort Seat Reservation Call" },
    ],
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    id: "cad-102",
    name: "14-Day Cold & Unresponsive Lead Re-engagement",
    code: "CAD-14D-REVIVE",
    targetCourse: "Data Science & Applied AI Accelerator",
    description: "Revives prospects who went silent after initial enquiry with placement case studies and AI trends.",
    status: "active",
    enrolledCount: 42,
    activeCount: 27,
    completedCount: 15,
    convertedCount: 5,
    conversionRate: 11.9,
    responseRate: 31.0,
    channels: ["email", "whatsapp", "sms"],
    steps: [
      { stepNumber: 1, dayOffset: 0, channel: "email", title: "Highest Paying Tech Skills 2026 Report" },
      { stepNumber: 2, dayOffset: 4, channel: "whatsapp", title: "Free AI Masterclass & Live Project Demo" },
      { stepNumber: 3, dayOffset: 9, channel: "sms", title: "Alumni Hiring Spotlight & Interview Prep" },
      { stepNumber: 4, dayOffset: 14, channel: "whatsapp", title: "Profile Archive Warning & Final Consultation" },
    ],
    createdAt: new Date(Date.now() - 35 * 86400000).toISOString(),
  },
  {
    id: "cad-103",
    name: "Weekend Cohort Launch Countdown (Urgency Drip)",
    code: "CAD-5D-COUNTDOWN",
    targetCourse: "All Courses",
    description: "High-urgency 5-day blitz leading up to cohort start date when seats are 85%+ full.",
    status: "active",
    enrolledCount: 19,
    activeCount: 11,
    completedCount: 8,
    convertedCount: 7,
    conversionRate: 36.8,
    responseRate: 57.9,
    channels: ["whatsapp", "sms", "call"],
    steps: [
      { stepNumber: 1, dayOffset: 0, channel: "whatsapp", title: "Batch 85% Full — 4 Seats Remaining Alert" },
      { stepNumber: 2, dayOffset: 2, channel: "sms", title: "Zero Cost 10-Month EMI Digital Pre-Approval" },
      { stepNumber: 3, dayOffset: 4, channel: "call", title: "Direct Admissions Desk Call" },
    ],
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
];

export default function CadencesPage() {
  const { user } = useAuth();
  const [cadences, setCadences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  // Modals & Drawers state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCadence, setSelectedCadence] = useState(null);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchCadences = async () => {
    setLoading(true);
    try {
      let apiItems = [];
      try {
        const res = await crmApi.getCadences({ status: statusFilter || undefined });
        if (Array.isArray(res) && res.length > 0) {
          apiItems = res;
        }
      } catch (err) {
        console.warn("Backend cadences API offline, using local dataset:", err.message);
      }

      // Merge with custom cadences from localStorage
      let customCadences = [];
      if (typeof window !== "undefined") {
        try {
          customCadences = JSON.parse(localStorage.getItem("skillyards_custom_cadences") || "[]");
        } catch (_) {}
      }

      const baseList = apiItems.length > 0 ? apiItems : BASE_DEMO_CADENCES;
      const existingIds = new Set(customCadences.map((c) => c.id));
      let combined = [...customCadences, ...baseList.filter((b) => !existingIds.has(b.id))];

      if (statusFilter) {
        combined = combined.filter((c) => c.status === statusFilter);
      }
      if (search) {
        const q = search.toLowerCase();
        combined = combined.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.code?.toLowerCase().includes(q) ||
            c.targetCourse.toLowerCase().includes(q)
        );
      }

      setCadences(combined);
    } catch (err) {
      console.error(err);
      setCadences(BASE_DEMO_CADENCES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCadences();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCadences();
  };

  // Metrics summary
  const metrics = useMemo(() => {
    const totalCadences = cadences.length;
    const activeCadences = cadences.filter((c) => c.status === "active").length;
    const totalEnrolled = cadences.reduce((sum, c) => sum + (c.enrolledCount || 0), 0);
    const totalConverted = cadences.reduce((sum, c) => sum + (c.convertedCount || 0), 0);
    const avgResponseRate =
      cadences.length > 0
        ? Math.round(
            cadences.reduce((sum, c) => sum + (c.responseRate || 0), 0) / cadences.length
          )
        : 0;

    return {
      totalCadences,
      activeCadences,
      totalEnrolled,
      totalConverted,
      avgResponseRate,
    };
  }, [cadences]);

  const handleCadenceCreated = (newCadence) => {
    setCadences((prev) => [newCadence, ...prev]);
    showToast(`Created cadence "${newCadence.name}" successfully!`);
  };

  const handleToggleCadenceStatus = async (cadenceId) => {
    const target = cadences.find((c) => c.id === cadenceId);
    if (!target) return;
    const newStatus = target.status === "active" ? "paused" : "active";

    try {
      await crmApi.updateCadence(cadenceId, { status: newStatus });
    } catch (_) {}

    setCadences((prev) =>
      prev.map((c) => (c.id === cadenceId ? { ...c, status: newStatus } : c))
    );
    showToast(`Cadence is now ${newStatus}`);
  };

  const handleExportCSV = () => {
    if (cadences.length === 0) {
      alert("No cadences to export");
      return;
    }
    const headers = [
      "Code",
      "Cadence Title",
      "Target Course",
      "Steps Count",
      "Enrolled Prospects",
      "Response Rate %",
      "Conversion Rate %",
      "Status",
    ];
    const rows = cadences.map((c) => [
      `"${c.code || ""}"`,
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.targetCourse.replace(/"/g, '""')}"`,
      c.steps?.length || 0,
      c.enrolledCount || 0,
      `${c.responseRate || 0}%`,
      `${c.conversionRate || 0}%`,
      `"${c.status || "active"}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `skillyards-cadences-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${cadences.length} cadences to CSV`);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Toast Feedback */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-[#0c1316] text-[#FAF6EE] border border-[#25D366]/40 shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-fadeIn backdrop-blur-md">
          <CheckCircle2 className="w-4 h-4 text-[#25D366] shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="crm-page-title">Automated Lead Nurturing & Drip Cadence Engine</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#128C7E]/15 border border-[#128C7E]/30 text-[#128C7E]">
              Sales Automation
            </span>
          </div>
          <p className="crm-page-subtitle">
            Multi-channel automated drip sequences across WhatsApp, Phone tasks, Emails, and Scholarship triggers
          </p>
        </div>

        <div className="flex items-center gap-2 self-start flex-wrap">
          <button
            type="button"
            onClick={handleExportCSV}
            className="crm-btn-secondary shadow-xs !py-1.5 !px-3 text-xs flex items-center gap-1.5"
            title="Export all cadences to CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={fetchCadences}
            className="crm-btn-secondary shadow-xs !py-1.5 !px-3 text-xs flex items-center gap-1.5"
            title="Refresh Cadences"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="crm-btn-primary shadow-md !py-1.5 !px-4 text-xs flex items-center gap-1.5 font-bold"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Cadence</span>
          </button>
        </div>
      </div>

      {/* 4 Performance KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active Cadences */}
        <div className="crm-metric-card p-4 rounded-2xl bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5A6E71] uppercase tracking-wider">
              Active Sequences
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#D97706]/15 border border-[#D97706]/30 flex items-center justify-center text-[#D97706]">
              <Workflow className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#1C2527]">{metrics.activeCadences}</span>
            <span className="text-xs font-semibold text-[#128C7E]">Running live</span>
          </div>
          <p className="text-[11px] text-[#7e939a] mt-1">Multi-touch automated nurturing</p>
        </div>

        {/* KPI 2: Prospects in Drip */}
        <div className="crm-metric-card p-4 rounded-2xl bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5A6E71] uppercase tracking-wider">
              Prospects In Drip
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#128C7E]/15 border border-[#128C7E]/30 flex items-center justify-center text-[#128C7E]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#1C2527]">{metrics.totalEnrolled}</span>
            <span className="text-xs font-bold text-[#128C7E]">Active Candidates</span>
          </div>
          <p className="text-[11px] text-[#7e939a] mt-1">Nurturing across sequences</p>
        </div>

        {/* KPI 3: Average Reply Rate */}
        <div className="crm-metric-card p-4 rounded-2xl bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5A6E71] uppercase tracking-wider">
              Avg Reply Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center text-[#128C7E]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#1C2527]">{metrics.avgResponseRate}%</span>
            <span className="text-xs font-bold text-[#128C7E]">High Engagement</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[rgba(71,86,87,0.15)] mt-2 overflow-hidden">
            <div
              className="h-full bg-[#128C7E] rounded-full transition-all duration-500"
              style={{ width: `${metrics.avgResponseRate}%` }}
            />
          </div>
        </div>

        {/* KPI 4: Cadence Conversions */}
        <div className="crm-metric-card p-4 rounded-2xl bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5A6E71] uppercase tracking-wider">
              Admissions Closed
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#D97706]/15 border border-[#D97706]/30 flex items-center justify-center text-[#D97706]">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#D97706]">{metrics.totalConverted}</span>
            <span className="text-xs font-bold text-[#194451]">Direct Conversions</span>
          </div>
          <p className="text-[11px] text-[#7e939a] mt-1">Closed via automated drip</p>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-[#5A6E71] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search cadence title, course, code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="crm-input !pl-8 !py-1.5 bg-white text-xs font-medium"
          />
        </form>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {["", "active", "paused"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? "bg-[#0c1316] text-white shadow-xs"
                  : "bg-white text-[#5A6E71] hover:text-[#1C2527] border border-[rgba(71,86,87,0.15)]"
              }`}
            >
              {st === "" ? "All Cadences" : st === "active" ? "Active" : "Paused"}
            </button>
          ))}
        </div>
      </div>

      {/* Cadence Cards Grid */}
      {loading ? (
        <div className="p-16 text-center text-sm font-semibold text-[#5A6E71]">
          Loading sales automation cadences...
        </div>
      ) : cadences.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-[#FAF6EE] border border-dashed border-[rgba(71,86,87,0.25)] space-y-3">
          <Workflow className="w-10 h-10 text-[#D97706] mx-auto opacity-60" />
          <h3 className="font-bold text-base text-[#1C2527]">No cadences found</h3>
          <p className="text-xs text-[#5A6E71]">
            Create your first multi-channel automated drip sequence to nurture cold leads.
          </p>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="crm-btn-primary !py-2 !px-4 text-xs font-bold"
          >
            + Create New Cadence
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cadences.map((cadence) => {
            const isPaused = cadence.status === "paused";

            return (
              <div
                key={cadence.id}
                className={`rounded-2xl bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] hover:border-[rgba(71,86,87,0.35)] hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group shadow-xs ${
                  isPaused ? "opacity-75" : ""
                }`}
              >
                {/* Top Banner */}
                <div className="px-5 py-3.5 bg-white border-b border-[rgba(71,86,87,0.12)] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold bg-[#D97706]/15 border border-[#D97706]/30 text-[#92400E]">
                      {cadence.code || "CADENCE"}
                    </span>
                    <span className="text-[11px] font-bold text-[#5A6E71] truncate max-w-[140px]">
                      {cadence.targetCourse}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      isPaused
                        ? "bg-[#5A6E71]/10 text-[#5A6E71] border-[#5A6E71]/30"
                        : "bg-[#25D366]/15 text-[#128C7E] border-[#25D366]/35"
                    }`}
                  >
                    {isPaused ? "Paused" : "Active Drip"}
                  </span>
                </div>

                {/* Card Main Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-base text-[#1C2527] group-hover:text-[#194451] transition-colors leading-snug">
                      {cadence.name}
                    </h3>
                    <p className="text-xs text-[#5A6E71] mt-1 line-clamp-2">
                      {cadence.description}
                    </p>
                  </div>

                  {/* Step Journey Flow Preview */}
                  <div className="p-3 rounded-xl bg-white border border-[rgba(71,86,87,0.14)] space-y-2">
                    <span className="text-[10px] uppercase font-bold text-[#5A6E71] tracking-wider block">
                      Sequence Roadmap ({cadence.steps?.length || 5} Touchpoints)
                    </span>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {(cadence.steps || []).map((step, idx) => {
                        const chan = CHANNEL_BADGES[step.channel] || CHANNEL_BADGES.whatsapp;
                        const IconComp = chan.icon;

                        return (
                          <div key={idx} className="flex items-center gap-1">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${chan.color}`}
                              title={`Day ${step.dayOffset}: ${step.title}`}
                            >
                              <IconComp className="w-2.5 h-2.5" />
                              <span>D{step.dayOffset}</span>
                            </span>
                            {idx < (cadence.steps?.length || 5) - 1 && (
                              <ArrowRight className="w-2.5 h-2.5 text-[#5A6E71]/60" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Performance Statistics Row */}
                  <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-[rgba(71,86,87,0.1)]">
                    <div className="p-2 rounded-lg bg-white/70 border border-[rgba(71,86,87,0.1)]">
                      <span className="text-[10px] text-[#7e939a] block">Enrolled</span>
                      <span className="font-bold text-xs text-[#1C2527]">
                        {cadence.enrolledCount || 0}
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-white/70 border border-[rgba(71,86,87,0.1)]">
                      <span className="text-[10px] text-[#7e939a] block">Replies</span>
                      <span className="font-bold text-xs text-[#128C7E]">
                        {cadence.responseRate || 0}%
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-white/70 border border-[rgba(71,86,87,0.1)]">
                      <span className="text-[10px] text-[#7e939a] block">Converted</span>
                      <span className="font-bold text-xs text-[#194451]">
                        {cadence.convertedCount || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-5 py-3.5 bg-white border-t border-[rgba(71,86,87,0.12)] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCadence(cadence);
                      setIsDetailsDrawerOpen(true);
                    }}
                    className="crm-btn-primary !py-1.5 !px-3 text-xs flex-1 flex items-center justify-center gap-1.5 font-bold shadow-xs cursor-pointer"
                  >
                    <span>Inspect Enrolled ({cadence.enrolledCount || 0})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleCadenceStatus(cadence.id)}
                    className="w-8 h-8 rounded-lg bg-[#FAF6EE] hover:bg-white border border-[rgba(71,86,87,0.2)] text-[#5A6E71] hover:text-[#1C2527] flex items-center justify-center transition-all cursor-pointer shrink-0"
                    title={isPaused ? "Resume Cadence" : "Pause Cadence"}
                  >
                    {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Cadence Modal */}
      <CreateCadenceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCadenceCreated={handleCadenceCreated}
        currentUser={user}
      />

      {/* Cadence Details & Enrolled Leads Drawer */}
      <CadenceDetailsDrawer
        isOpen={isDetailsDrawerOpen}
        onClose={() => {
          setIsDetailsDrawerOpen(false);
          setSelectedCadence(null);
        }}
        cadence={selectedCadence}
        onToggleStatus={handleToggleCadenceStatus}
      />
    </div>
  );
}
