"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Layers,
  Search,
  Plus,
  Download,
  RefreshCw,
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Filter,
} from "lucide-react";
import { crmApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { CreateCohortModal } from "@/components/cohorts/CreateCohortModal";
import { CohortDetailsDrawer } from "@/components/cohorts/CohortDetailsDrawer";

const COURSE_FILTERS = [
  { label: "All Courses", value: "" },
  { label: "Full Stack (MERN)", value: "Full Stack" },
  { label: "Data Science & AI", value: "Data Science" },
  { label: "Product Design (UX)", value: "Product Design" },
  { label: "Cloud & DevOps", value: "Cloud DevOps" },
];

const STATUS_FILTERS = [
  { label: "All Batches", value: "" },
  { label: "Launching Soon", value: "upcoming" },
  { label: "In Progress (Live)", value: "active" },
  { label: "Batch Full", value: "full" },
];

const BASE_DEMO_COHORTS = [
  {
    id: "cohort-101",
    code: "FS-W14",
    name: "Weekend Live Cohort #14",
    courseName: "Full Stack Web Development (MERN)",
    schedule: "Weekend Live (Sat-Sun 10:00 AM - 02:00 PM IST)",
    mentorName: "Vikram Malhotra",
    mentorRole: "Lead Full-Stack Architect",
    mentorAvatar: "VM",
    description: "Production MERN stack, Next.js 15, PostgreSQL & microservices live cohort.",
    startDate: new Date(Date.now() + 12 * 86400000).toISOString(),
    status: "upcoming",
    maxCapacity: 30,
    filledSeats: 26,
    seatsRemaining: 4,
    occupancyRate: 87,
    urgencyBadge: "Filling Fast",
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: "cohort-102",
    code: "DS-E08",
    name: "Weekday Evening Cohort #08",
    courseName: "Data Science & Applied AI Accelerator",
    schedule: "Weekday Evening (Mon-Thu 07:00 PM - 09:30 PM IST)",
    mentorName: "Dr. Ananya Sen",
    mentorRole: "Principal AI Scientist",
    mentorAvatar: "AS",
    description: "PyTorch, Generative AI, LLM Fine-Tuning & Computer Vision live sessions.",
    startDate: new Date(Date.now() + 6 * 86400000).toISOString(),
    status: "upcoming",
    maxCapacity: 25,
    filledSeats: 21,
    seatsRemaining: 4,
    occupancyRate: 84,
    urgencyBadge: "Filling Fast",
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
  {
    id: "cohort-103",
    code: "UX-W06",
    name: "Weekend Live Cohort #06",
    courseName: "Product Design & UI/UX Mastery",
    schedule: "Weekend Live (Sat-Sun 02:30 PM - 06:30 PM IST)",
    mentorName: "Priya Patel",
    mentorRole: "Staff Product Designer",
    mentorAvatar: "PP",
    description: "Design systems, Figma variables, UX research methods & portfolio design labs.",
    startDate: new Date(Date.now() + 18 * 86400000).toISOString(),
    status: "upcoming",
    maxCapacity: 20,
    filledSeats: 12,
    seatsRemaining: 8,
    occupancyRate: 60,
    urgencyBadge: "Admissions Open",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: "cohort-104",
    code: "DO-W11",
    name: "Weekend Morning Cohort #11",
    courseName: "Cloud DevOps & Kubernetes Engineering",
    schedule: "Weekend Morning (Sat-Sun 09:00 AM - 01:00 PM IST)",
    mentorName: "Amit Kumar",
    mentorRole: "Senior Cloud & DevOps Architect",
    mentorAvatar: "AK",
    description: "Kubernetes clustering, Terraform, AWS multi-region deployments & CI/CD pipelines.",
    startDate: new Date(Date.now() - 4 * 86400000).toISOString(),
    status: "active",
    maxCapacity: 25,
    filledSeats: 25,
    seatsRemaining: 0,
    occupancyRate: 100,
    urgencyBadge: "Batch Full",
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
  },
  {
    id: "cohort-105",
    code: "FS-F13",
    name: "Fast-Track Intensive Cohort #13",
    courseName: "Full Stack Web Development (MERN)",
    schedule: "Daily Bootcamp (Mon-Fri 10:00 AM - 04:00 PM IST)",
    mentorName: "Vikram Malhotra",
    mentorRole: "Lead Full-Stack Architect",
    mentorAvatar: "VM",
    description: "Intensive 12-week placement cohort with live project sprints and code reviews.",
    startDate: new Date(Date.now() - 28 * 86400000).toISOString(),
    status: "active",
    maxCapacity: 30,
    filledSeats: 29,
    seatsRemaining: 1,
    occupancyRate: 97,
    urgencyBadge: "Active Cohort",
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
  },
];

export default function CohortsPage() {
  const { user } = useAuth();
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseFilter, setCourseFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  // Modals & Drawers state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCohort, setSelectedCohort] = useState(null);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);

  // Toast feedback state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchCohorts = async () => {
    setLoading(true);
    try {
      let apiItems = [];
      try {
        const res = await crmApi.getCohorts({
          courseName: courseFilter || undefined,
          status: statusFilter || undefined,
        });
        if (Array.isArray(res) && res.length > 0) {
          apiItems = res;
        }
      } catch (err) {
        console.warn("Backend cohorts API offline, activating local dataset:", err.message);
      }

      // Merge with custom cohorts created in localStorage
      let customCohorts = [];
      if (typeof window !== "undefined") {
        try {
          customCohorts = JSON.parse(localStorage.getItem("skillyards_custom_cohorts") || "[]");
        } catch (_) {}
      }

      const baseList = apiItems.length > 0 ? apiItems : BASE_DEMO_COHORTS;
      const existingIds = new Set(customCohorts.map((c) => c.id));
      let combined = [...customCohorts, ...baseList.filter((b) => !existingIds.has(b.id))];

      if (courseFilter) {
        combined = combined.filter((c) =>
          c.courseName.toLowerCase().includes(courseFilter.toLowerCase())
        );
      }
      if (statusFilter) {
        if (statusFilter === "full") {
          combined = combined.filter((c) => c.seatsRemaining === 0 || c.occupancyRate >= 100);
        } else {
          combined = combined.filter((c) => c.status === statusFilter);
        }
      }
      if (search) {
        const q = search.toLowerCase();
        combined = combined.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.code?.toLowerCase().includes(q) ||
            c.courseName.toLowerCase().includes(q) ||
            c.mentorName?.toLowerCase().includes(q)
        );
      }

      setCohorts(combined);
    } catch (err) {
      console.error("Error loading cohorts:", err);
      setCohorts(BASE_DEMO_COHORTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCohorts();
  }, [courseFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCohorts();
  };

  // Metrics summary
  const metrics = useMemo(() => {
    const totalCohorts = cohorts.length;
    const activeCount = cohorts.filter((c) => c.status === "active").length;
    const upcomingCount = cohorts.filter((c) => c.status === "upcoming").length;
    const totalFilledSeats = cohorts.reduce((sum, c) => sum + (c.filledSeats || 0), 0);
    const totalCapacity = cohorts.reduce((sum, c) => sum + (c.maxCapacity || 30), 0);
    const totalRemaining = cohorts.reduce((sum, c) => sum + (c.seatsRemaining || 0), 0);
    const avgOccupancy = totalCapacity > 0 ? Math.round((totalFilledSeats / totalCapacity) * 100) : 0;

    return {
      totalCohorts,
      activeCount,
      upcomingCount,
      totalFilledSeats,
      totalRemaining,
      avgOccupancy,
    };
  }, [cohorts]);

  // Export CSV
  const handleExportCSV = () => {
    if (cohorts.length === 0) {
      alert("No cohorts to export");
      return;
    }
    const headers = [
      "Code",
      "Cohort Name",
      "Course Program",
      "Schedule",
      "Faculty Mentor",
      "Filled Seats",
      "Max Capacity",
      "Occupancy Rate %",
      "Seats Open",
      "Start Date",
      "Status",
    ];
    const rows = cohorts.map((c) => [
      `"${c.code || ""}"`,
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.courseName.replace(/"/g, '""')}"`,
      `"${c.schedule.replace(/"/g, '""')}"`,
      `"${(c.mentorName || "Faculty Lead").replace(/"/g, '""')}"`,
      c.filledSeats || 0,
      c.maxCapacity || 30,
      `${c.occupancyRate || 0}%`,
      c.seatsRemaining || 0,
      `"${new Date(c.startDate).toLocaleDateString()}"`,
      `"${c.status || "active"}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `skillyards-cohorts-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${cohorts.length} cohorts to CSV`);
  };

  const handleCohortCreated = (newCohort) => {
    setCohorts((prev) => [newCohort, ...prev]);
    showToast(`Created cohort "${newCohort.name}" successfully!`);
  };

  const handleUpdateCohort = (updated) => {
    setCohorts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
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
            <h1 className="crm-page-title">Course Cohorts & Batch Allocation Hub</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#128C7E]/15 border border-[#128C7E]/30 text-[#128C7E]">
              Live Seat Engine
            </span>
          </div>
          <p className="crm-page-subtitle">
            Seat capacity tracking, launch countdowns, and student-to-batch assignment
          </p>
        </div>

        <div className="flex items-center gap-2 self-start flex-wrap">
          <button
            type="button"
            onClick={handleExportCSV}
            className="crm-btn-secondary shadow-xs !py-1.5 !px-3 text-xs flex items-center gap-1.5"
            title="Export all cohorts to CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#4A6D7C]" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={fetchCohorts}
            className="crm-btn-secondary shadow-xs !py-1.5 !px-3 text-xs flex items-center gap-1.5"
            title="Refresh Cohorts"
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
            <span>+ Create Cohort</span>
          </button>
        </div>
      </div>

      {/* 4 Financial & Operational KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active Cohorts */}
        <div className="crm-metric-card p-4 rounded-2xl bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5A6E71] uppercase tracking-wider">
              Total Cohorts
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#4A6D7C]/15 border border-[#4A6D7C]/30 flex items-center justify-center text-[#194451]">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#1C2527]">{metrics.totalCohorts}</span>
            <span className="text-xs font-semibold text-[#128C7E]">
              {metrics.upcomingCount} launching soon
            </span>
          </div>
          <p className="text-[11px] text-[#7e939a] mt-1">
            {metrics.activeCount} cohorts currently running live
          </p>
        </div>

        {/* KPI 2: Overall Seat Occupancy Rate */}
        <div className="crm-metric-card p-4 rounded-2xl bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5A6E71] uppercase tracking-wider">
              Average Occupancy
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center text-[#128C7E]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#1C2527]">{metrics.avgOccupancy}%</span>
            <span className="text-xs font-bold text-[#128C7E]">High Demand</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[rgba(71,86,87,0.15)] mt-2 overflow-hidden">
            <div
              className="h-full bg-[#128C7E] rounded-full transition-all duration-500"
              style={{ width: `${metrics.avgOccupancy}%` }}
            />
          </div>
        </div>

        {/* KPI 3: Available Seats */}
        <div className="crm-metric-card p-4 rounded-2xl bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5A6E71] uppercase tracking-wider">
              Seats Open
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#D97706]/15 border border-[#D97706]/30 flex items-center justify-center text-[#D97706]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#D97706]">{metrics.totalRemaining}</span>
            <span className="text-xs font-semibold text-[#5A6E71]">Seats Remaining</span>
          </div>
          <p className="text-[11px] text-[#7e939a] mt-1">Across all planned & active batches</p>
        </div>

        {/* KPI 4: Enrolled Learners */}
        <div className="crm-metric-card p-4 rounded-2xl bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5A6E71] uppercase tracking-wider">
              Enrolled Students
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#194451]/15 border border-[#194451]/30 flex items-center justify-center text-[#194451]">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#1C2527]">{metrics.totalFilledSeats}</span>
            <span className="text-xs font-bold text-[#194451]">Learners Allocated</span>
          </div>
          <p className="text-[11px] text-[#7e939a] mt-1">Confirmed student admissions</p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] shadow-xs space-y-3">
        {/* Course Filter Tabs */}
        <div className="crm-tab-bar !mb-0 overflow-x-auto">
          {COURSE_FILTERS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setCourseFilter(tab.value)}
              className={courseFilter === tab.value ? "crm-tab-active shrink-0" : "crm-tab-inactive shrink-0"}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[rgba(71,86,87,0.12)]">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-[#5A6E71] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search cohort name, mentor, code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="crm-input !pl-8 !py-1.5 bg-white text-xs font-medium"
            />
          </form>

          <div className="flex items-center gap-2 self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setStatusFilter(s.value)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  statusFilter === s.value
                    ? "bg-[#0c1316] text-white shadow-xs"
                    : "bg-white text-[#5A6E71] hover:text-[#1C2527] border border-[rgba(71,86,87,0.15)]"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cohorts Grid */}
      {loading ? (
        <div className="p-16 text-center text-sm font-semibold text-[#5A6E71]">
          Loading course cohorts and seat occupancy...
        </div>
      ) : cohorts.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-[#FAF6EE] border border-dashed border-[rgba(71,86,87,0.25)] space-y-3">
          <Layers className="w-10 h-10 text-[#4A6D7C] mx-auto opacity-60" />
          <h3 className="font-bold text-base text-[#1C2527]">No cohorts found</h3>
          <p className="text-xs text-[#5A6E71]">
            Try adjusting your search criteria or create a new course cohort.
          </p>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="crm-btn-primary !py-2 !px-4 text-xs font-bold"
          >
            + Create New Cohort
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cohorts.map((cohort) => {
            const occupancy =
              cohort.occupancyRate !== undefined
                ? cohort.occupancyRate
                : Math.round(((cohort.filledSeats || 0) / (cohort.maxCapacity || 30)) * 100);

            const isFull = cohort.seatsRemaining === 0 || occupancy >= 100;
            const isFillingFast = !isFull && (occupancy >= 80 || cohort.seatsRemaining <= 5);

            return (
              <div
                key={cohort.id}
                className="rounded-2xl bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] hover:border-[rgba(71,86,87,0.35)] hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group shadow-xs"
              >
                {/* Top Banner with Code & Status */}
                <div className="px-5 py-3.5 bg-white border-b border-[rgba(71,86,87,0.12)] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold bg-[#4A6D7C]/15 border border-[#4A6D7C]/30 text-[#194451]">
                      {cohort.code || "SKY-COHORT"}
                    </span>
                    <span className="text-[11px] font-bold text-[#5A6E71] truncate max-w-[130px]">
                      {cohort.courseName}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      isFull
                        ? "bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/30"
                        : isFillingFast
                        ? "bg-[#D97706]/15 text-[#D97706] border-[#D97706]/35 animate-pulse"
                        : "bg-[#25D366]/15 text-[#128C7E] border-[#25D366]/35"
                    }`}
                  >
                    {isFull ? "Batch Full" : isFillingFast ? "Filling Fast 🔥" : "Open"}
                  </span>
                </div>

                {/* Card Main Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-base text-[#1C2527] group-hover:text-[#194451] transition-colors leading-snug">
                      {cohort.name}
                    </h3>

                    {/* Schedule & Timing Pill */}
                    <div className="mt-2.5 space-y-1.5 text-xs text-[#5A6E71]">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#4A6D7C] shrink-0" />
                        <span className="truncate">{cohort.schedule || "Weekend Live"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#4A6D7C] shrink-0" />
                        <span>
                          Launch:{" "}
                          <strong>
                            {new Date(cohort.startDate || Date.now()).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Seat Occupancy Visual Meter */}
                  <div className="p-3.5 rounded-xl bg-white border border-[rgba(71,86,87,0.14)] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#1C2527] flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#128C7E]" />
                        <span>Seat Allocation</span>
                      </span>
                      <span className="font-black text-[#1C2527]">
                        {cohort.filledSeats || 0} / {cohort.maxCapacity || 30}{" "}
                        <span className="font-normal text-[#5A6E71]">({occupancy}%)</span>
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-[rgba(71,86,87,0.12)] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          isFull ? "bg-[#DC2626]" : isFillingFast ? "bg-[#D97706]" : "bg-[#128C7E]"
                        }`}
                        style={{ width: `${Math.min(100, occupancy)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#7e939a]">
                        {cohort.seatsRemaining !== undefined
                          ? cohort.seatsRemaining
                          : Math.max(0, (cohort.maxCapacity || 30) - (cohort.filledSeats || 0))}{" "}
                        seats open
                      </span>
                      {isFillingFast && (
                        <span className="font-bold text-[#D97706]">Hurry! Only few left</span>
                      )}
                    </div>
                  </div>

                  {/* Mentor Card Row */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#194451] text-white flex items-center justify-center font-bold text-[10px]">
                        {cohort.mentorAvatar || "VM"}
                      </div>
                      <div>
                        <span className="font-bold text-xs text-[#1C2527] block">
                          {cohort.mentorName || "Faculty Lead"}
                        </span>
                        <span className="text-[10px] text-[#5A6E71]">Senior Program Mentor</span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[rgba(71,86,87,0.08)] text-[#5A6E71] capitalize">
                      {cohort.status || "upcoming"}
                    </span>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-5 py-3.5 bg-white border-t border-[rgba(71,86,87,0.12)] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCohort(cohort);
                      setIsDetailsDrawerOpen(true);
                    }}
                    className="crm-btn-primary !py-1.5 !px-3 text-xs flex-1 flex items-center justify-center gap-1.5 font-bold shadow-xs"
                  >
                    <span>View Roster ({cohort.filledSeats || 0})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const msg = encodeURIComponent(
                        `Hi Candidate, admissions for Skillyards ${cohort.name} (${cohort.courseName}) are currently ${
                          isFull ? "closed as batch is 100% full" : `closing with only ${cohort.seatsRemaining} seats left`
                        }. Batch starts on ${new Date(cohort.startDate).toLocaleDateString()}. Reply to reserve your seat!`
                      );
                      window.open(`https://wa.me/?text=${msg}`, "_blank");
                    }}
                    className="w-8 h-8 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/35 text-[#128C7E] flex items-center justify-center transition-all cursor-pointer shrink-0"
                    title="Broadcast WhatsApp Cohort Update"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Cohort Modal */}
      <CreateCohortModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCohortCreated={handleCohortCreated}
        currentUser={user}
      />

      {/* Cohort Details & Enrolled Learners Drawer */}
      <CohortDetailsDrawer
        isOpen={isDetailsDrawerOpen}
        onClose={() => {
          setIsDetailsDrawerOpen(false);
          setSelectedCohort(null);
        }}
        cohort={selectedCohort}
        onUpdateCohort={handleUpdateCohort}
      />
    </div>
  );
}
