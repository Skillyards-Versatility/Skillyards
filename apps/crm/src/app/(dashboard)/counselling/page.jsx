"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  GraduationCap,
  CalendarClock,
  Clock,
  CheckCircle2,
  Sparkles,
  Search,
  Filter,
  Plus,
  RotateCcw,
  Calendar,
  User,
  Phone,
  BookOpen,
  ArrowRight,
  History,
  X,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Download,
} from "lucide-react";
import { crmApi } from "@/lib/api";
import { getStatusBadgeClass, formatStatusLabel } from "@/lib/status";
import { useAuth } from "@/context/AuthContext";

const FALLBACK_COUNSELLING_SESSIONS = [
  {
    id: "mock-counselling-1",
    studentName: "Aarav Sharma",
    phone: "+91 98765 43210",
    courseInterest: "Full Stack Web Development",
    ageOrClass: "Final Year B.Tech",
    counselorName: "Priya Sharma",
    counselorId: "user-1",
    bookedByName: "Self / Walk-in",
    source: "walk_in",
    outcome: "completed",
    sessionDate: new Date().toISOString().split("T")[0],
    notes: "Deeply interested in MERN stack. Offered early bird scholarship.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "mock-counselling-2",
    studentName: "Ananya Verma",
    phone: "+91 98111 22334",
    courseInterest: "Data Science & AI",
    ageOrClass: "Working Professional",
    counselorName: "Rahul Mehta",
    counselorId: "user-2",
    bookedByName: "Vikram Telecaller",
    source: "phone",
    outcome: "session_booked",
    sessionDate: new Date().toISOString().split("T")[0],
    notes: "Follow up call booked for demo lecture review.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "mock-counselling-3",
    studentName: "Rohan Kulkarni",
    phone: "+91 99223 34455",
    courseInterest: "Cloud Computing & DevOps",
    ageOrClass: "3rd Year BCA",
    counselorName: "Priya Sharma",
    counselorId: "user-1",
    bookedByName: "Referral Portal",
    source: "referral",
    outcome: "enrolled",
    sessionDate: new Date().toISOString().split("T")[0],
    notes: "Enrolled in Batch 2026-A. Initial installment confirmed.",
    createdAt: new Date().toISOString(),
  },
];

const FALLBACK_COUNSELLING_SUMMARY = {
  total: 3,
  today: 3,
  upcoming: 1,
  completed: 1,
  enrolled: 1,
  bySource: { walk_in: 1, phone: 1, referral: 1 },
  byOutcome: { session_booked: 1, completed: 1, enrolled: 1 },
};

export default function CounsellingPage() {
  const { user, crmRoles } = useAuth();

  const isManager =
    user?.role === "ADMIN" ||
    user?.role === "MANAGER" ||
    crmRoles?.includes("crm_admin") ||
    crmRoles?.includes("sales_manager") ||
    crmRoles?.includes("sales_lead");

  // State
  const [sessions, setSessions] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    today: 0,
    upcoming: 0,
    completed: 0,
    enrolled: 0,
    bySource: {},
    byOutcome: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [staff, setStaff] = useState([]);
  const [isOffline, setIsOffline] = useState(false);

  // Filters
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'scheduled' | 'completed' | 'enrolled' | 'follow_up' | 'cancelled_noshow'
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all"); // 'all' | 'today' | 'tomorrow' | 'week' | 'past'
  const [scope, setScope] = useState("all");

  // Modals state
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [rescheduleSession, setRescheduleSession] = useState(null);
  const [outcomeSession, setOutcomeSession] = useState(null);
  const [historySession, setHistorySession] = useState(null);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Form states
  const [bookForm, setBookForm] = useState({
    studentName: "",
    phone: "",
    ageOrClass: "",
    courseInterest: "",
    counselorId: "",
    sessionDate: new Date().toISOString().split("T")[0],
    source: "walk_in",
    outcome: "session_booked",
    notes: "",
  });

  const [rescheduleForm, setRescheduleForm] = useState({
    newDate: "",
    reason: "",
  });

  const [outcomeForm, setOutcomeForm] = useState({
    outcome: "completed",
    notes: "",
    nextFollowUpDate: "",
  });

  const [submitting, setSubmitting] = useState(false);

  // Load staff list
  useEffect(() => {
    async function fetchStaff() {
      try {
        const staffList = await crmApi.getStaff();
        setStaff(staffList || []);
      } catch (err) {
        console.warn("Could not load staff list from backend:", err.message);
      }
    }
    fetchStaff();
  }, []);

  // Fetch sessions
  const fetchSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        scope,
        limit: 100,
      };

      if (search) params.search = search;
      if (sourceFilter !== "all") params.source = sourceFilter;

      // Handle date filters
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];

      if (dateFilter === "today") {
        params.startDate = todayStr;
        params.endDate = todayStr;
      } else if (dateFilter === "tomorrow") {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomStr = tomorrow.toISOString().split("T")[0];
        params.startDate = tomStr;
        params.endDate = tomStr;
      } else if (dateFilter === "week") {
        const weekEnd = new Date(today);
        weekEnd.setDate(weekEnd.getDate() + 7);
        params.startDate = todayStr;
        params.endDate = weekEnd.toISOString().split("T")[0];
      } else if (dateFilter === "past") {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        params.endDate = yesterday.toISOString().split("T")[0];
      }

      // Map tab filter to outcome if specific
      if (activeTab === "scheduled") {
        params.outcome = "session_booked";
      } else if (activeTab === "completed") {
        params.outcome = "completed";
      } else if (activeTab === "enrolled") {
        params.outcome = "enrolled";
      } else if (activeTab === "follow_up") {
        params.outcome = "follow_up";
      }

      const res = await crmApi.getCounselling(params);
      setSessions(res.sessions || []);
      if (res.summary) {
        setSummary(res.summary);
      }
      setIsOffline(false);
    } catch (err) {
      console.warn("Could not reach backend API for counselling sessions:", err.message);
      setIsOffline(true);
      setError(null);
      setSessions(FALLBACK_COUNSELLING_SESSIONS);
      setSummary(FALLBACK_COUNSELLING_SUMMARY);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [activeTab, sourceFilter, dateFilter, scope]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSessions();
  };

  // Filtered in-memory sessions for tabs like 'cancelled_noshow'
  const displayedSessions = useMemo(() => {
    if (activeTab === "cancelled_noshow") {
      return sessions.filter((s) => s.outcome === "cancelled" || s.outcome === "no_show" || s.outcome === "not_interested");
    }
    return sessions;
  }, [sessions, activeTab]);

  // Handle Book Session Submit
  const handleBookSubmit = async (e) => {
    e.preventDefault();
    if (!bookForm.studentName || !bookForm.sessionDate) {
      alert("Please provide Student Name and Session Date");
      return;
    }
    setSubmitting(true);
    try {
      await crmApi.createCounselling({
        ...bookForm,
        counselorId: bookForm.counselorId || user?.id,
      });
      setIsBookModalOpen(false);
      setBookForm({
        studentName: "",
        phone: "",
        ageOrClass: "",
        courseInterest: "",
        counselorId: "",
        sessionDate: new Date().toISOString().split("T")[0],
        source: "walk_in",
        outcome: "session_booked",
        notes: "",
      });
      fetchSessions();
    } catch (err) {
      console.warn("Backend error during booking, applying optimistic local state update:", err.message);
      const newSession = {
        id: `mock-counselling-${Date.now()}`,
        studentName: bookForm.studentName,
        phone: bookForm.phone || "",
        courseInterest: bookForm.courseInterest || "Full Stack Web Development",
        ageOrClass: bookForm.ageOrClass || "Student",
        counselorName: staff.find((s) => s.id === bookForm.counselorId)?.name || user?.name || "Priya Sharma",
        counselorId: bookForm.counselorId || user?.id || "user-1",
        bookedByName: user?.name || "Current User",
        source: bookForm.source || "walk_in",
        outcome: bookForm.outcome || "session_booked",
        sessionDate: bookForm.sessionDate,
        notes: bookForm.notes || "Booked session via CRM",
        createdAt: new Date().toISOString(),
      };
      setSessions((prev) => [newSession, ...prev]);
      setSummary((prev) => ({
        ...prev,
        total: (prev.total || 0) + 1,
        upcoming: (prev.upcoming || 0) + 1,
        byOutcome: {
          ...prev.byOutcome,
          session_booked: ((prev.byOutcome?.session_booked || 0) + 1),
        },
      }));
      setIsBookModalOpen(false);
      setBookForm({
        studentName: "",
        phone: "",
        ageOrClass: "",
        courseInterest: "",
        counselorId: "",
        sessionDate: new Date().toISOString().split("T")[0],
        source: "walk_in",
        outcome: "session_booked",
        notes: "",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Reschedule Submit
  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!rescheduleForm.newDate) {
      alert("Please pick a new session date");
      return;
    }
    setSubmitting(true);
    try {
      await crmApi.rescheduleCounselling(rescheduleSession.id, rescheduleForm);
      setRescheduleSession(null);
      setRescheduleForm({ newDate: "", reason: "" });
      fetchSessions();
    } catch (err) {
      console.warn("Backend error during reschedule, applying optimistic local state update:", err.message);
      setSessions((prev) =>
        prev.map((s) =>
          s.id === rescheduleSession.id
            ? { ...s, sessionDate: rescheduleForm.newDate, notes: rescheduleForm.reason ? `${s.notes || ""} [Rescheduled: ${rescheduleForm.reason}]`.trim() : s.notes }
            : s
        )
      );
      setRescheduleSession(null);
      setRescheduleForm({ newDate: "", reason: "" });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Outcome Status Submit
  const handleOutcomeSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await crmApi.updateCounsellingStatus(outcomeSession.id, outcomeForm);
      setOutcomeSession(null);
      setOutcomeForm({ outcome: "completed", notes: "", nextFollowUpDate: "" });
      fetchSessions();
    } catch (err) {
      console.warn("Backend error during outcome update, applying optimistic local state update:", err.message);
      setSessions((prev) =>
        prev.map((s) =>
          s.id === outcomeSession.id
            ? {
                ...s,
                outcome: outcomeForm.outcome,
                notes: outcomeForm.notes ? `${s.notes || ""} [Outcome: ${outcomeForm.notes}]`.trim() : s.notes,
                nextFollowUpDate: outcomeForm.nextFollowUpDate || s.nextFollowUpDate,
              }
            : s
        )
      );
      if (outcomeForm.outcome === "completed" || outcomeForm.outcome === "enrolled") {
        setSummary((prev) => ({
          ...prev,
          completed: outcomeForm.outcome === "completed" ? (prev.completed || 0) + 1 : prev.completed,
          enrolled: outcomeForm.outcome === "enrolled" ? (prev.enrolled || 0) + 1 : prev.enrolled,
        }));
      }
      setOutcomeSession(null);
      setOutcomeForm({ outcome: "completed", notes: "", nextFollowUpDate: "" });
    } finally {
      setSubmitting(false);
    }
  };

  // Open History Drawer
  const openHistory = async (session) => {
    setHistorySession(session);
    setLoadingHistory(true);
    try {
      const detailed = await crmApi.getCounsellingSession(session.id);
      setSessionHistory(detailed.history || []);
    } catch (err) {
      console.warn("Could not load session history from backend:", err.message);
      setSessionHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Calculate conversion rate
  const conversionRate = useMemo(() => {
    const totalConducted = (summary.completed || 0) + (summary.enrolled || 0);
    if (!totalConducted) return 0;
    return Math.round(((summary.enrolled || 0) / totalConducted) * 100);
  }, [summary]);

  const handleExportCSV = () => {
    if (!displayedSessions.length) {
      alert("No sessions to export");
      return;
    }
    const headers = ["ID", "Student Name", "Phone", "Course Interest", "Class / Background", "Session Date", "Counsellor", "Source", "Outcome", "Notes"];
    const rows = displayedSessions.map((s) => [
      `"${s.id || ""}"`,
      `"${(s.studentName || "").replace(/"/g, '""')}"`,
      `"${s.phone || ""}"`,
      `"${(s.courseInterest || "").replace(/"/g, '""')}"`,
      `"${(s.ageOrClass || "").replace(/"/g, '""')}"`,
      `"${s.sessionDate || ""}"`,
      `"${(s.counselorName || "").replace(/"/g, '""')}"`,
      `"${formatStatusLabel(s.source)}"`,
      `"${formatStatusLabel(s.outcome)}"`,
      `"${(s.notes || "").replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `skillyards-counselling-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="crm-page-title">Counselling Session Management</h1>
            <span className="crm-badge crm-badge-counselling_scheduled">Track 2</span>
          </div>
          <p className="crm-page-subtitle">
            Schedule, conduct, and track student counselling appointments with full history and EOD target attribution.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isManager && (
            <div className="flex items-center bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] rounded-xl p-1 text-xs font-semibold shadow-xs">
              <button
                onClick={() => setScope("all")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  scope === "all" ? "bg-[#D97706] text-white font-bold shadow-xs" : "text-[#5A6E71] hover:text-[#1C2527]"
                }`}
              >
                All Team
              </button>
              <button
                onClick={() => setScope("my")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  scope === "my" ? "bg-[#D97706] text-white font-bold shadow-xs" : "text-[#5A6E71] hover:text-[#1C2527]"
                }`}
              >
                My Sessions
              </button>
            </div>
          )}

          <button
            onClick={handleExportCSV}
            className="crm-btn-secondary shadow-xs !py-1.5 !px-3 text-xs"
            title="Export CSV of current filtered sessions"
          >
            <Download className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={fetchSessions}
            className="crm-btn-secondary shadow-xs !py-1.5 !px-3 text-xs"
            title="Refresh sessions"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setIsBookModalOpen(true)}
            className="crm-btn-primary shadow-xs !py-1.5 !px-3.5 text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Book Session</span>
          </button>
        </div>
      </div>

      {/* Offline Mode Banner */}
      {isOffline && (
        <div className="p-4 rounded-xl bg-[rgba(176,114,56,0.12)] border border-[rgba(176,114,56,0.25)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white border border-[rgba(176,114,56,0.3)] flex items-center justify-center shrink-0 text-[#B07238] shadow-xs">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-[#1C2527]">
                Offline Development Mode (Local Fallback Demo Sessions)
              </p>
              <p className="text-[#5A6E71] mt-0.5">
                Backend server on port 3000 is not reachable. Showing interactive demo counselling sessions. Run <span className="font-mono text-[#2E7559] font-bold">cd apps/api && npm run dev</span> to connect to live database.
              </p>
            </div>
          </div>
          <button
            onClick={fetchSessions}
            className="crm-btn-secondary shrink-0 text-xs shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
        </div>
      )}

      {/* EOD Attribution Banner */}
      <div className="p-5 bg-gradient-to-r from-[#FAF6EE] via-[#F4ECE1] to-[#EBE0CF] border border-[rgba(71,86,87,0.18)] shadow-sm rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[rgba(46,117,89,0.15)] border border-[rgba(46,117,89,0.25)] flex items-center justify-center shrink-0 text-[#2E7559] shadow-xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#1C2527]">
                Server-Owned EOD Attribution Policy
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-white text-[#2E7559] border border-[rgba(46,117,89,0.25)] font-mono font-bold shadow-xs">
                SPEC-6 Compliant
              </span>
            </div>
            <p className="text-xs text-[#5A6E71] mt-0.5">
              Only sessions marked <span className="text-[#2E7559] font-bold">Completed</span> or <span className="text-[#2E7559] font-bold">Enrolled</span> count toward daily EOD targets. Each completed session reduces dial target by <span className="text-[#1C2527] font-bold">15 dials</span> and connect target by <span className="text-[#1C2527] font-bold">5 connects</span>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0 bg-white px-4 py-2.5 rounded-xl border border-[rgba(71,86,87,0.14)] shadow-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#5A6E71] block tracking-wider">
              EOD Attributed Today
            </span>
            <span className="text-base font-black text-[#2E7559] font-mono">
              {summary.completed + summary.enrolled} Conducted
            </span>
          </div>
          <div className="border-l border-[rgba(71,86,87,0.15)] pl-4">
            <span className="text-[10px] uppercase font-bold text-[#5A6E71] block tracking-wider">
              Target Relief
            </span>
            <span className="text-xs font-bold text-[#1C2527]">
              -{(summary.completed + summary.enrolled) * 15} Dials
            </span>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="p-4 bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] shadow-sm hover:shadow-md transition-all rounded-2xl">
          <div className="flex items-center justify-between text-[#5A6E71] text-xs font-semibold">
            <span>Total Sessions</span>
            <GraduationCap className="w-4 h-4 text-[#D97706]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#1C2527] font-mono">
              {summary.total}
            </span>
            <span className="text-[10px] text-[#7e939a]">logged</span>
          </div>
        </div>

        <div className="p-4 bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] shadow-sm hover:shadow-md transition-all rounded-2xl">
          <div className="flex items-center justify-between text-[#5A6E71] text-xs font-semibold">
            <span>Today's Schedule</span>
            <Clock className="w-4 h-4 text-[#2E7559]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#2E7559] font-mono">
              {summary.today}
            </span>
            <span className="text-[10px] text-[#2E7559]/80 font-bold">due today</span>
          </div>
        </div>

        <div className="p-4 bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] shadow-sm hover:shadow-md transition-all rounded-2xl">
          <div className="flex items-center justify-between text-[#5A6E71] text-xs font-semibold">
            <span>Upcoming / Booked</span>
            <CalendarClock className="w-4 h-4 text-[#B07238]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#B07238] font-mono">
              {summary.upcoming}
            </span>
            <span className="text-[10px] text-[#7e939a]">pipeline</span>
          </div>
        </div>

        <div className="p-4 bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] shadow-sm hover:shadow-md transition-all rounded-2xl">
          <div className="flex items-center justify-between text-[#5A6E71] text-xs font-semibold">
            <span>Conducted (EOD)</span>
            <CheckCircle2 className="w-4 h-4 text-[#2E7559]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#2E7559] font-mono">
              {summary.completed}
            </span>
            <span className="text-[10px] text-[#2E7559]/80 font-bold">completed</span>
          </div>
        </div>

        <div className="p-4 bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] shadow-sm hover:shadow-md transition-all rounded-2xl col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-[#5A6E71] text-xs font-semibold">
            <span>Conversions</span>
            <Sparkles className="w-4 h-4 text-[#D97706]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#1C2527] font-mono">
              {summary.enrolled}
            </span>
            <span className="text-[10px] text-[#B07238] font-bold">
              ({conversionRate}%)
            </span>
          </div>
        </div>
      </div>

      {/* Tab Bar & Filters */}
      <div className="crm-panel p-4 space-y-4">
        {/* Outcome Tabs */}
        <div className="crm-tab-bar">
          <button
            onClick={() => setActiveTab("all")}
            className={activeTab === "all" ? "crm-tab-active" : "crm-tab-inactive"}
          >
            All Sessions
            <span className={activeTab === "all" ? "crm-tab-badge-active" : "crm-tab-badge-inactive"}>
              {summary.total}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("scheduled")}
            className={activeTab === "scheduled" ? "crm-tab-active" : "crm-tab-inactive"}
          >
            Scheduled / Booked
            <span className={activeTab === "scheduled" ? "crm-tab-badge-active" : "crm-tab-badge-inactive"}>
              {summary.byOutcome?.session_booked || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("completed")}
            className={activeTab === "completed" ? "crm-tab-active" : "crm-tab-inactive"}
          >
            Completed (EOD)
            <span className={activeTab === "completed" ? "crm-tab-badge-active" : "crm-tab-badge-inactive"}>
              {summary.byOutcome?.completed || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("enrolled")}
            className={activeTab === "enrolled" ? "crm-tab-active" : "crm-tab-inactive"}
          >
            Enrolled
            <span className={activeTab === "enrolled" ? "crm-tab-badge-active" : "crm-tab-badge-inactive"}>
              {summary.byOutcome?.enrolled || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("follow_up")}
            className={activeTab === "follow_up" ? "crm-tab-active" : "crm-tab-inactive"}
          >
            Follow-up Required
            <span className={activeTab === "follow_up" ? "crm-tab-badge-active" : "crm-tab-badge-inactive"}>
              {summary.byOutcome?.follow_up || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("cancelled_noshow")}
            className={activeTab === "cancelled_noshow" ? "crm-tab-active" : "crm-tab-inactive"}
          >
            Cancelled / No-show
            <span className={activeTab === "cancelled_noshow" ? "crm-tab-badge-active" : "crm-tab-badge-inactive"}>
              {(summary.byOutcome?.cancelled || 0) + (summary.byOutcome?.no_show || 0) + (summary.byOutcome?.not_interested || 0)}
            </span>
          </button>
        </div>

        {/* Secondary Filter Controls */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Search student, phone, or course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="crm-input pr-9 pl-3.5"
            />
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-platinum-500 pointer-events-none" />
          </form>

          {/* Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Date filter */}
            <div className="w-36">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="crm-select"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="week">Next 7 Days</option>
                <option value="past">Past / Overdue</option>
              </select>
            </div>

            {/* Source filter */}
            <div className="w-32">
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="crm-select"
              >
                <option value="all">All Sources</option>
                <option value="walk_in">Walk-in</option>
                <option value="phone">Phone</option>
                <option value="referral">Referral</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] shadow-sm rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#7e939a]">
            <div className="w-8 h-8 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs">Loading counselling sessions...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-[#B84A4A]">
            <AlertCircle className="w-6 h-6 mx-auto mb-2 text-[#B84A4A]" />
            <p className="text-xs">{error}</p>
            <button onClick={fetchSessions} className="crm-btn-secondary mt-3">
              Try Again
            </button>
          </div>
        ) : displayedSessions.length === 0 ? (
          <div className="p-12 text-center text-[#7e939a] space-y-3">
            <GraduationCap className="w-10 h-10 text-[#7e939a] mx-auto" />
            <p className="text-sm font-bold text-[#1C2527]">No counselling sessions found</p>
            <p className="text-xs text-[#5A6E71] max-w-sm mx-auto">
              No sessions match your selected filters. Schedule a new counselling session or broaden your search criteria.
            </p>
            <button
              onClick={() => setIsBookModalOpen(true)}
              className="crm-btn-primary mx-auto mt-2 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Book First Session</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="crm-table">
              <thead className="crm-thead">
                <tr>
                  <th className="crm-th">Candidate / Student</th>
                  <th className="crm-th">Canonical Lead Link</th>
                  <th className="crm-th">Session Date</th>
                  <th className="crm-th">Counsellor</th>
                  <th className="crm-th">Source</th>
                  <th className="crm-th">Outcome / Status</th>
                  <th className="crm-th text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="crm-tbody">
                {displayedSessions.map((session) => {
                  const isToday =
                    session.sessionDate === new Date().toISOString().split("T")[0];
                  const isPast =
                    session.sessionDate < new Date().toISOString().split("T")[0] &&
                    session.outcome === "session_booked";

                  return (
                    <tr key={session.id} className="crm-tr">
                      {/* Student info */}
                      <td className="crm-td">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1C2527] to-[#2D3A3D] text-[#FAF6EE] font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                            {(session.studentName || "S").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-[#1C2527] text-sm">
                              {session.studentName}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-[#5A6E71] mt-0.5">
                              {session.phone && (
                                <span className="flex items-center gap-1 font-mono text-[#1C2527]">
                                  <Phone className="w-3 h-3 text-[#7e939a]" />
                                  {session.phone}
                                </span>
                              )}
                              {session.courseInterest && (
                                <span className="text-[#B07238] font-bold">
                                  • {session.courseInterest}
                                </span>
                              )}
                              {session.ageOrClass && (
                                <span className="text-[#7e939a]">
                                  ({session.ageOrClass})
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Lead link */}
                      <td className="crm-td">
                        {session.leadId ? (
                          <Link
                            href={`/leads/${session.leadId}`}
                            className="crm-lead-link inline-flex items-center gap-1.5 text-xs font-bold"
                          >
                            <span>{session.leadFullName || "Lead Record"}</span>
                            <ArrowRight className="w-3 h-3 text-[#D97706]" />
                          </Link>
                        ) : (
                          <span className="text-[#7e939a] text-xs italic">
                            Unlinked Walk-in
                          </span>
                        )}
                      </td>

                      {/* Session date */}
                      <td className="crm-td font-mono text-xs">
                        <div className="flex items-center gap-1.5">
                          <span>{session.sessionDate}</span>
                          {isToday && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-deep-ocean-950 text-deep-ocean-300 border border-deep-ocean-700">
                              Today
                            </span>
                          )}
                          {isPast && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-dark-wine-950 text-dark-wine-300 border border-dark-wine-700">
                              Overdue
                            </span>
                          )}
                        </div>
                        {session.nextFollowUpDate && (
                          <div className="text-[10px] text-pale-oak-400 mt-0.5">
                            Follow-up: {session.nextFollowUpDate}
                          </div>
                        )}
                      </td>

                      {/* Counsellor */}
                      <td className="crm-td text-xs">
                        <div className="font-medium text-platinum-200">
                          {session.counselorName || "Unassigned"}
                        </div>
                        {session.bookedByName && session.bookedByName !== session.counselorName && (
                          <div className="text-[10px] text-platinum-500">
                            Booked by: {session.bookedByName}
                          </div>
                        )}
                      </td>

                      {/* Source */}
                      <td className="crm-td">
                        <span className={getStatusBadgeClass(session.source)}>
                          {formatStatusLabel(session.source)}
                        </span>
                      </td>

                      {/* Outcome */}
                      <td className="crm-td">
                        <span className={getStatusBadgeClass(session.outcome)}>
                          {formatStatusLabel(session.outcome)}
                        </span>
                        {session.notes && (
                          <p className="text-[11px] text-platinum-400 truncate max-w-xs mt-1" title={session.notes}>
                            {session.notes}
                          </p>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="crm-td text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setOutcomeSession(session);
                              setOutcomeForm({
                                outcome: session.outcome === "session_booked" ? "completed" : session.outcome,
                                notes: session.notes || "",
                                nextFollowUpDate: session.nextFollowUpDate || "",
                              });
                            }}
                            className="crm-btn-secondary"
                            title="Update Outcome & EOD status"
                          >
                            Outcome
                          </button>

                          <button
                            onClick={() => {
                              setRescheduleSession(session);
                              setRescheduleForm({
                                newDate: session.sessionDate,
                                reason: "",
                              });
                            }}
                            className="crm-btn-ghost"
                            title="Reschedule session preserving history"
                          >
                            Reschedule
                          </button>

                          <button
                            onClick={() => openHistory(session)}
                            className="crm-btn-ghost"
                            title="View session audit history"
                          >
                            <History className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* --- MODAL: BOOK / LOG SESSION --- */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-md p-4 transition-all">
          <div className="w-full max-w-lg bg-[#FAF6EE] border border-[rgba(71,86,87,0.2)] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#0c1316] px-6 py-4 flex items-center justify-between border-b border-[rgba(98,146,158,0.2)]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#D97706]/20 border border-[#D97706]/40 text-[#D97706] flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">Schedule / Log Counselling</h3>
                  <p className="text-[11px] text-[#7e939a]">Register student session and attribute targets</p>
                </div>
              </div>
              <button
                onClick={() => setIsBookModalOpen(false)}
                className="p-1.5 rounded-lg text-[#7e939a] hover:text-white hover:bg-[rgba(98,146,158,0.15)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBookSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="crm-label font-bold text-[#1C2527]">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Candidate name"
                    value={bookForm.studentName}
                    onChange={(e) => setBookForm({ ...bookForm, studentName: e.target.value })}
                    className="crm-input"
                  />
                </div>

                <div>
                  <label className="crm-label font-bold text-[#1C2527]">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 9876543210"
                    value={bookForm.phone}
                    onChange={(e) => setBookForm({ ...bookForm, phone: e.target.value })}
                    className="crm-input"
                  />
                </div>

                <div>
                  <label className="crm-label font-bold text-[#1C2527]">Age / Current Class</label>
                  <input
                    type="text"
                    placeholder="e.g. Class 12 or 21 yrs"
                    value={bookForm.ageOrClass}
                    onChange={(e) => setBookForm({ ...bookForm, ageOrClass: e.target.value })}
                    className="crm-input"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="crm-label font-bold text-[#1C2527]">Course of Interest</label>
                  <input
                    type="text"
                    placeholder="e.g. Full Stack Web Development"
                    value={bookForm.courseInterest}
                    onChange={(e) => setBookForm({ ...bookForm, courseInterest: e.target.value })}
                    className="crm-input"
                  />
                </div>

                <div>
                  <label className="crm-label font-bold text-[#1C2527]">Session Date *</label>
                  <input
                    type="date"
                    required
                    value={bookForm.sessionDate}
                    onChange={(e) => setBookForm({ ...bookForm, sessionDate: e.target.value })}
                    className="crm-input font-mono"
                  />
                </div>

                <div>
                  <label className="crm-label font-bold text-[#1C2527]">Counsellor / Rep</label>
                  <select
                    value={bookForm.counselorId}
                    onChange={(e) => setBookForm({ ...bookForm, counselorId: e.target.value })}
                    className="crm-select"
                  >
                    <option value="">Myself ({user?.name || "Rep"})</option>
                    {staff.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="crm-label font-bold text-[#1C2527]">Enquiry Source</label>
                  <select
                    value={bookForm.source}
                    onChange={(e) => setBookForm({ ...bookForm, source: e.target.value })}
                    className="crm-select"
                  >
                    <option value="walk_in">Walk-in</option>
                    <option value="phone">Phone Call</option>
                    <option value="referral">Referral</option>
                  </select>
                </div>

                <div>
                  <label className="crm-label font-bold text-[#1C2527]">Initial Outcome</label>
                  <select
                    value={bookForm.outcome}
                    onChange={(e) => setBookForm({ ...bookForm, outcome: e.target.value })}
                    className="crm-select"
                  >
                    <option value="session_booked">Session Booked (Upcoming)</option>
                    <option value="completed">Completed (Direct Walk-in)</option>
                    <option value="enrolled">Enrolled on Spot</option>
                    <option value="follow_up">Follow-up Required</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="crm-label font-bold text-[#1C2527]">Counselling Notes / Background</label>
                  <textarea
                    rows={3}
                    placeholder="Candidate profile, aspirations, counseling discussions..."
                    value={bookForm.notes}
                    onChange={(e) => setBookForm({ ...bookForm, notes: e.target.value })}
                    className="crm-textarea"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-[rgba(71,86,87,0.14)]">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="crm-btn-secondary !py-2 !px-3.5 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="crm-btn-primary !py-2 !px-4 text-xs shadow-md"
                >
                  {submitting ? "Booking..." : "Schedule Session"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: RESCHEDULE SESSION (PRESERVING HISTORY) --- */}
      {rescheduleSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-md p-4 transition-all">
          <div className="w-full max-w-md bg-[#FAF6EE] border border-[rgba(71,86,87,0.2)] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#0c1316] px-6 py-4 flex items-center justify-between border-b border-[rgba(98,146,158,0.2)]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#D97706]/20 border border-[#D97706]/40 text-[#D97706] flex items-center justify-center">
                  <CalendarClock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    Reschedule Counselling
                  </h3>
                  <p className="text-[11px] text-[#7e939a]">
                    Student: <span className="text-white font-medium">{rescheduleSession.studentName}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRescheduleSession(null)}
                className="p-1.5 rounded-lg text-[#7e939a] hover:text-white hover:bg-[rgba(98,146,158,0.15)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-3.5 bg-white rounded-xl border border-[rgba(71,86,87,0.16)] text-xs space-y-1 shadow-xs">
                <div className="font-bold text-[#1C2527] text-sm">
                  {rescheduleSession.studentName}
                </div>
                <div className="text-[11px] text-[#5A6E71]">
                  Current Scheduled Date: <span className="font-mono font-semibold text-[#1C2527]">{rescheduleSession.sessionDate}</span>
                </div>
              </div>

              <form onSubmit={handleRescheduleSubmit} className="space-y-4">
                <div>
                  <label className="crm-label font-bold text-[#1C2527]">New Session Date *</label>
                  <input
                    type="date"
                    required
                    value={rescheduleForm.newDate}
                    onChange={(e) => setRescheduleForm({ ...rescheduleForm, newDate: e.target.value })}
                    className="crm-input font-mono"
                  />
                </div>

                <div>
                  <label className="crm-label font-bold text-[#1C2527]">Reason for Rescheduling *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. Student requested postpone to Saturday due to exams..."
                    value={rescheduleForm.reason}
                    onChange={(e) => setRescheduleForm({ ...rescheduleForm, reason: e.target.value })}
                    className="crm-textarea"
                  />
                </div>

                <div className="p-3 rounded-xl bg-white border border-[rgba(74,109,124,0.25)] text-xs text-[#2A5766] space-y-0.5">
                  <span className="font-bold text-[#194451]">⚡ History Preserved:</span>
                  <p className="text-[11px] text-[#475657]">
                    Updates the schedule on the existing session identity while appending an immutable audit entry to the timeline.
                  </p>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-[rgba(71,86,87,0.14)]">
                  <button
                    type="button"
                    onClick={() => setRescheduleSession(null)}
                    className="crm-btn-secondary !py-2 !px-3.5 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="crm-btn-primary !py-2 !px-4 text-xs shadow-md"
                  >
                    {submitting ? "Rescheduling..." : "Confirm Reschedule"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: MARK OUTCOME & EOD ATTRIBUTION --- */}
      {outcomeSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-md p-4 transition-all">
          <div className="w-full max-w-md bg-[#FAF6EE] border border-[rgba(71,86,87,0.2)] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#0c1316] px-6 py-4 flex items-center justify-between border-b border-[rgba(98,146,158,0.2)]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#D97706]/20 border border-[#D97706]/40 text-[#D97706] flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    Update Session Outcome
                  </h3>
                  <p className="text-[11px] text-[#7e939a]">
                    Student: <span className="text-white font-medium">{outcomeSession.studentName}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOutcomeSession(null)}
                className="p-1.5 rounded-lg text-[#7e939a] hover:text-white hover:bg-[rgba(98,146,158,0.15)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-3.5 bg-white rounded-xl border border-[rgba(71,86,87,0.16)] text-xs space-y-1 shadow-xs">
                <div className="font-bold text-[#1C2527] text-sm">
                  {outcomeSession.studentName}
                </div>
                <div className="text-[11px] text-[#5A6E71]">
                  Session Date: <span className="font-mono font-semibold text-[#1C2527]">{outcomeSession.sessionDate}</span>
                </div>
              </div>

              <form onSubmit={handleOutcomeSubmit} className="space-y-4">
                <div>
                  <label className="crm-label font-bold text-[#1C2527]">Session Outcome *</label>
                  <select
                    value={outcomeForm.outcome}
                    onChange={(e) => setOutcomeForm({ ...outcomeForm, outcome: e.target.value })}
                    className="crm-select"
                  >
                    <option value="completed">Completed (Conducted - Attributed to EOD)</option>
                    <option value="enrolled">Enrolled / Converted (Conducted + Admission)</option>
                    <option value="follow_up">Follow-up Required (Requires another touchpoint)</option>
                    <option value="not_interested">Not Interested (Closed Lost)</option>
                    <option value="no_show">No Show (Candidate did not attend)</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="session_booked">Scheduled / Pending</option>
                  </select>
                </div>

                {outcomeForm.outcome === "follow_up" && (
                  <div>
                    <label className="crm-label font-bold text-[#1C2527]">Next Follow-up Date</label>
                    <input
                      type="date"
                      value={outcomeForm.nextFollowUpDate}
                      onChange={(e) => setOutcomeForm({ ...outcomeForm, nextFollowUpDate: e.target.value })}
                      className="crm-input font-mono"
                    />
                  </div>
                )}

                <div>
                  <label className="crm-label font-bold text-[#1C2527]">Session Outcome & Feedback Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Summary of counseling conversation, student strengths, course recommended, concerns..."
                    value={outcomeForm.notes}
                    onChange={(e) => setOutcomeForm({ ...outcomeForm, notes: e.target.value })}
                    className="crm-textarea"
                  />
                </div>

                {(outcomeForm.outcome === "completed" || outcomeForm.outcome === "enrolled") && (
                  <div className="p-3 rounded-xl bg-white border border-[rgba(74,109,124,0.25)] text-xs text-[#2A5766]">
                    <strong>⚡ Automatic EOD Target Relief:</strong> This session will automatically credit to the counselor's End-of-Day attainment report, reducing dial and connect targets.
                  </div>
                )}

                <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-[rgba(71,86,87,0.14)]">
                  <button
                    type="button"
                    onClick={() => setOutcomeSession(null)}
                    className="crm-btn-secondary !py-2 !px-3.5 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="crm-btn-primary !py-2 !px-4 text-xs shadow-md"
                  >
                    {submitting ? "Saving..." : "Save Outcome"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- DRAWER / MODAL: AUDIT & RESCHEDULE HISTORY --- */}
      {historySession && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/65 backdrop-blur-md transition-all">
          <div className="w-full max-w-md h-full bg-[#FAF6EE] border-l border-[rgba(71,86,87,0.2)] shadow-2xl flex flex-col animate-in slide-in-from-right duration-250">
            {/* Drawer Header */}
            <div className="bg-[#0c1316] px-6 py-4 flex items-center justify-between border-b border-[rgba(98,146,158,0.2)] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#D97706]/20 border border-[#D97706]/40 text-[#D97706] flex items-center justify-center">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    Session Audit History
                  </h3>
                  <p className="text-[11px] text-[#7e939a]">
                    Student: <span className="text-white font-medium">{historySession.studentName}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setHistorySession(null)}
                className="p-1.5 rounded-lg text-[#7e939a] hover:text-white hover:bg-[rgba(98,146,158,0.15)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              <div className="p-3.5 bg-white rounded-xl border border-[rgba(71,86,87,0.16)] text-xs shadow-xs space-y-1">
                <div className="font-bold text-[#1C2527] text-sm">
                  {historySession.studentName}
                </div>
                <div className="text-[11px] text-[#5A6E71]">
                  Scheduled Date: <span className="font-mono font-semibold text-[#1C2527]">{historySession.sessionDate}</span>
                </div>
                <div className="text-[11px] text-[#5A6E71]">
                  Counsellor: <span className="font-semibold text-[#1C2527]">{historySession.counselorName}</span>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                <h4 className="text-[11px] font-bold text-[#5A6E71] uppercase tracking-wider">
                  Event Timeline
                </h4>

                {loadingHistory ? (
                  <div className="py-8 text-center text-[#5A6E71] text-xs">
                    Loading history trail...
                  </div>
                ) : sessionHistory.length === 0 ? (
                  <div className="py-8 text-center text-[#7E9396] text-xs">
                    No prior reschedule or audit events recorded for this session.
                  </div>
                ) : (
                  <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[rgba(71,86,87,0.2)]">
                    {sessionHistory.map((ev) => (
                      <div key={ev.id} className="relative text-xs">
                        <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#D97706] ring-4 ring-[#FAF6EE]" />
                        <div className="font-bold text-[#1C2527]">
                          {ev.action?.replace(/_/g, " ")}
                        </div>
                        <div className="text-[11px] text-[#5A6E71] mt-0.5">
                          by {ev.actorName || "User"} • {new Date(ev.createdAt).toLocaleString("en-GB")}
                        </div>
                        {ev.reason && (
                          <div className="text-[#1C2527] bg-white p-2.5 rounded-lg border border-[rgba(71,86,87,0.16)] mt-1.5 text-[11px] shadow-xs">
                            {ev.reason}
                          </div>
                        )}
                        {ev.afterSnapshot?.sessionDate && ev.beforeSnapshot?.sessionDate && (
                          <div className="text-[10px] text-[#393A10] mt-1 font-mono font-semibold">
                            Date changed: {ev.beforeSnapshot.sessionDate} → {ev.afterSnapshot.sessionDate}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-[#F5EDE1] border-t border-[rgba(71,86,87,0.14)] shrink-0">
              <button
                onClick={() => setHistorySession(null)}
                className="crm-btn-secondary w-full !py-2 text-xs"
              >
                Close Audit History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
