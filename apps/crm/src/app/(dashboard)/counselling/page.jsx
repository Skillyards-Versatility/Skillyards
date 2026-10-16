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
} from "lucide-react";
import { crmApi } from "@/lib/api";
import { getStatusBadgeClass, formatStatusLabel } from "@/lib/status";
import { useAuth } from "@/context/AuthContext";

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
        console.error("Failed to load staff list:", err);
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
    } catch (err) {
      console.error("Failed to fetch counselling sessions:", err);
      setError(err.message || "Failed to load counselling sessions");
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
      alert(err.message || "Failed to schedule counselling session");
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
      alert(err.message || "Failed to reschedule session");
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
      alert(err.message || "Failed to update session outcome");
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
      console.error("Failed to load session history:", err);
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

        <div className="flex items-center gap-2">
          {isManager && (
            <div className="flex items-center bg-platinum-900 border border-platinum-800 rounded-lg p-0.5 text-xs font-medium">
              <button
                onClick={() => setScope("all")}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  scope === "all" ? "bg-dark-teal-700 text-platinum-50 font-semibold" : "text-platinum-400 hover:text-platinum-200"
                }`}
              >
                All Team
              </button>
              <button
                onClick={() => setScope("my")}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  scope === "my" ? "bg-dark-teal-700 text-platinum-50 font-semibold" : "text-platinum-400 hover:text-platinum-200"
                }`}
              >
                My Sessions
              </button>
            </div>
          )}

          <button
            onClick={fetchSessions}
            className="crm-btn-secondary"
            title="Refresh sessions"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Refresh
          </button>

          <button
            onClick={() => setIsBookModalOpen(true)}
            className="crm-btn-primary"
          >
            <Plus className="w-4 h-4" />
            Book Session
          </button>
        </div>
      </div>

      {/* EOD Attribution Banner */}
      <div className="crm-panel p-4 bg-gradient-to-r from-dark-teal-950/70 via-platinum-950 to-deep-ocean-950/40 border border-dark-teal-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-dark-teal-900/60 border border-dark-teal-700/60 flex items-center justify-center shrink-0 text-deep-ocean-300">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-platinum-100">
                Server-Owned EOD Attribution Policy
              </h2>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-dark-teal-900/80 text-deep-ocean-300 border border-dark-teal-700/50 font-mono">
                SPEC-6 Compliant
              </span>
            </div>
            <p className="text-xs text-platinum-400 mt-0.5">
              Only sessions marked <span className="text-deep-ocean-300 font-semibold">Completed</span> or <span className="text-deep-ocean-300 font-semibold">Enrolled</span> count toward daily EOD targets. Each completed session reduces dial target by <span className="text-platinum-200 font-bold">15 dials</span> and connect target by <span className="text-platinum-200 font-bold">5 connects</span>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0 bg-platinum-900/80 px-3.5 py-2 rounded-lg border border-platinum-800">
          <div>
            <span className="text-[10px] uppercase font-bold text-platinum-400 block tracking-wider">
              EOD Attributed Today
            </span>
            <span className="text-base font-bold text-deep-ocean-300 font-mono">
              {summary.completed + summary.enrolled} Conducted
            </span>
          </div>
          <div className="border-l border-platinum-800 pl-3">
            <span className="text-[10px] uppercase font-bold text-platinum-400 block tracking-wider">
              Target Relief
            </span>
            <span className="text-xs font-semibold text-platinum-200">
              -{(summary.completed + summary.enrolled) * 15} Dials
            </span>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="crm-card p-4">
          <div className="flex items-center justify-between text-platinum-400 text-xs">
            <span>Total Sessions</span>
            <GraduationCap className="w-4 h-4 text-dark-teal-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-platinum-100 font-mono">
              {summary.total}
            </span>
            <span className="text-[10px] text-platinum-500">logged</span>
          </div>
        </div>

        <div className="crm-card p-4">
          <div className="flex items-center justify-between text-platinum-400 text-xs">
            <span>Today's Schedule</span>
            <Clock className="w-4 h-4 text-deep-ocean-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-deep-ocean-300 font-mono">
              {summary.today}
            </span>
            <span className="text-[10px] text-platinum-500">due today</span>
          </div>
        </div>

        <div className="crm-card p-4">
          <div className="flex items-center justify-between text-platinum-400 text-xs">
            <span>Upcoming / Booked</span>
            <CalendarClock className="w-4 h-4 text-pale-oak-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-pale-oak-300 font-mono">
              {summary.upcoming}
            </span>
            <span className="text-[10px] text-platinum-500">pipeline</span>
          </div>
        </div>

        <div className="crm-card p-4">
          <div className="flex items-center justify-between text-platinum-400 text-xs">
            <span>Conducted (EOD)</span>
            <CheckCircle2 className="w-4 h-4 text-deep-ocean-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-deep-ocean-300 font-mono">
              {summary.completed}
            </span>
            <span className="text-[10px] text-deep-ocean-400/80">completed</span>
          </div>
        </div>

        <div className="crm-card p-4 col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-platinum-400 text-xs">
            <span>Conversions</span>
            <Sparkles className="w-4 h-4 text-dark-teal-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-platinum-100 font-mono">
              {summary.enrolled}
            </span>
            <span className="text-[10px] text-pale-oak-400 font-semibold">
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
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-platinum-500" />
            <input
              type="text"
              placeholder="Search student, phone, or course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="crm-input pl-9"
            />
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
      <div className="crm-panel overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-platinum-400">
            <div className="w-8 h-8 border-2 border-dark-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs">Loading counselling sessions...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-dark-wine-400">
            <AlertCircle className="w-6 h-6 mx-auto mb-2 text-dark-wine-500" />
            <p className="text-xs">{error}</p>
            <button onClick={fetchSessions} className="crm-btn-secondary mt-3">
              Try Again
            </button>
          </div>
        ) : displayedSessions.length === 0 ? (
          <div className="p-12 text-center text-platinum-400 space-y-3">
            <GraduationCap className="w-10 h-10 text-platinum-600 mx-auto" />
            <p className="text-sm font-semibold text-platinum-200">No counselling sessions found</p>
            <p className="text-xs text-platinum-500 max-w-sm mx-auto">
              No sessions match your selected filters. Schedule a new counselling session or broaden your search criteria.
            </p>
            <button
              onClick={() => setIsBookModalOpen(true)}
              className="crm-btn-primary mx-auto mt-2"
            >
              <Plus className="w-4 h-4" />
              Book First Session
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
                        <div className="font-semibold text-platinum-100">
                          {session.studentName}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-platinum-400 mt-0.5">
                          {session.phone && (
                            <span className="flex items-center gap-1 font-mono">
                              <Phone className="w-3 h-3 text-platinum-500" />
                              {session.phone}
                            </span>
                          )}
                          {session.courseInterest && (
                            <span className="text-pale-oak-300 font-medium">
                              • {session.courseInterest}
                            </span>
                          )}
                          {session.ageOrClass && (
                            <span className="text-platinum-500">
                              ({session.ageOrClass})
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Lead link */}
                      <td className="crm-td">
                        {session.leadId ? (
                          <Link
                            href={`/leads/${session.leadId}`}
                            className="crm-lead-link inline-flex items-center gap-1.5 text-xs"
                          >
                            <span>{session.leadFullName || "Lead Record"}</span>
                            <ArrowRight className="w-3 h-3 text-deep-ocean-400" />
                          </Link>
                        ) : (
                          <span className="text-platinum-500 text-xs italic">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="crm-panel w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-platinum-800 pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-deep-ocean-400" />
                <h3 className="font-bold text-sm text-platinum-100">Schedule / Log Counselling</h3>
              </div>
              <button
                onClick={() => setIsBookModalOpen(false)}
                className="text-platinum-400 hover:text-platinum-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBookSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="crm-label">Student Full Name *</label>
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
                  <label className="crm-label">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 9876543210"
                    value={bookForm.phone}
                    onChange={(e) => setBookForm({ ...bookForm, phone: e.target.value })}
                    className="crm-input"
                  />
                </div>

                <div>
                  <label className="crm-label">Age / Current Class</label>
                  <input
                    type="text"
                    placeholder="e.g. Class 12 or 21 yrs"
                    value={bookForm.ageOrClass}
                    onChange={(e) => setBookForm({ ...bookForm, ageOrClass: e.target.value })}
                    className="crm-input"
                  />
                </div>

                <div className="col-span-2">
                  <label className="crm-label">Course of Interest</label>
                  <input
                    type="text"
                    placeholder="e.g. Full Stack Web Development"
                    value={bookForm.courseInterest}
                    onChange={(e) => setBookForm({ ...bookForm, courseInterest: e.target.value })}
                    className="crm-input"
                  />
                </div>

                <div>
                  <label className="crm-label">Session Date *</label>
                  <input
                    type="date"
                    required
                    value={bookForm.sessionDate}
                    onChange={(e) => setBookForm({ ...bookForm, sessionDate: e.target.value })}
                    className="crm-input"
                  />
                </div>

                <div>
                  <label className="crm-label">Counsellor / Rep</label>
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
                  <label className="crm-label">Enquiry Source</label>
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
                  <label className="crm-label">Initial Outcome</label>
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

                <div className="col-span-2">
                  <label className="crm-label">Counselling Notes / Background</label>
                  <textarea
                    rows={3}
                    placeholder="Candidate profile, aspirations, counseling discussions..."
                    value={bookForm.notes}
                    onChange={(e) => setBookForm({ ...bookForm, notes: e.target.value })}
                    className="crm-textarea"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-platinum-800">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="crm-btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="crm-btn-primary"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="crm-panel w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-platinum-800 pb-3">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-pale-oak-400" />
                <h3 className="font-bold text-sm text-platinum-100">
                  Reschedule Counselling Session
                </h3>
              </div>
              <button
                onClick={() => setRescheduleSession(null)}
                className="text-platinum-400 hover:text-platinum-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-platinum-900 rounded-lg border border-platinum-800 text-xs space-y-1">
              <div className="font-semibold text-platinum-100">
                Student: {rescheduleSession.studentName}
              </div>
              <div className="text-platinum-400">
                Current Scheduled Date: <span className="font-mono text-platinum-200">{rescheduleSession.sessionDate}</span>
              </div>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="space-y-3">
              <div>
                <label className="crm-label">New Session Date *</label>
                <input
                  type="date"
                  required
                  value={rescheduleForm.newDate}
                  onChange={(e) => setRescheduleForm({ ...rescheduleForm, newDate: e.target.value })}
                  className="crm-input font-mono"
                />
              </div>

              <div>
                <label className="crm-label">Reason for Rescheduling *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Student requested postpone to Saturday due to exams..."
                  value={rescheduleForm.reason}
                  onChange={(e) => setRescheduleForm({ ...rescheduleForm, reason: e.target.value })}
                  className="crm-textarea"
                />
              </div>

              <div className="p-2.5 rounded bg-dark-teal-950/60 border border-dark-teal-800/60 text-[11px] text-deep-ocean-300">
                <strong>History Preserved:</strong> This updates the scheduled time on the same session identity while appending an immutable audit record to the lead and session timeline.
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-platinum-800">
                <button
                  type="button"
                  onClick={() => setRescheduleSession(null)}
                  className="crm-btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="crm-btn-primary"
                >
                  {submitting ? "Rescheduling..." : "Confirm Reschedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: MARK OUTCOME & EOD ATTRIBUTION --- */}
      {outcomeSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="crm-panel w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-platinum-800 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-deep-ocean-400" />
                <h3 className="font-bold text-sm text-platinum-100">
                  Update Session Outcome
                </h3>
              </div>
              <button
                onClick={() => setOutcomeSession(null)}
                className="text-platinum-400 hover:text-platinum-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-platinum-900 rounded-lg border border-platinum-800 text-xs space-y-1">
              <div className="font-semibold text-platinum-100">
                Student: {outcomeSession.studentName}
              </div>
              <div className="text-platinum-400">
                Session Date: <span className="font-mono text-platinum-200">{outcomeSession.sessionDate}</span>
              </div>
            </div>

            <form onSubmit={handleOutcomeSubmit} className="space-y-3">
              <div>
                <label className="crm-label">Session Outcome *</label>
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
                  <label className="crm-label">Next Follow-up Date</label>
                  <input
                    type="date"
                    value={outcomeForm.nextFollowUpDate}
                    onChange={(e) => setOutcomeForm({ ...outcomeForm, nextFollowUpDate: e.target.value })}
                    className="crm-input font-mono"
                  />
                </div>
              )}

              <div>
                <label className="crm-label">Session Outcome & Feedback Notes</label>
                <textarea
                  rows={3}
                  placeholder="Summary of counseling conversation, student strengths, course recommended, concerns..."
                  value={outcomeForm.notes}
                  onChange={(e) => setOutcomeForm({ ...outcomeForm, notes: e.target.value })}
                  className="crm-textarea"
                />
              </div>

              {(outcomeForm.outcome === "completed" || outcomeForm.outcome === "enrolled") && (
                <div className="p-2.5 rounded bg-dark-teal-950/60 border border-dark-teal-800/60 text-[11px] text-deep-ocean-300">
                  <strong>EOD Credit:</strong> This session will automatically be credited to the counselor's End-of-Day report, reducing dial and connect targets.
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2 border-t border-platinum-800">
                <button
                  type="button"
                  onClick={() => setOutcomeSession(null)}
                  className="crm-btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="crm-btn-primary"
                >
                  {submitting ? "Saving..." : "Save Outcome"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DRAWER / MODAL: AUDIT & RESCHEDULE HISTORY --- */}
      {historySession && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm">
          <div className="crm-panel w-full max-w-md h-full p-6 space-y-4 overflow-y-auto rounded-none border-l border-platinum-800">
            <div className="flex items-center justify-between border-b border-platinum-800 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-deep-ocean-400" />
                <h3 className="font-bold text-sm text-platinum-100">
                  Session Audit History
                </h3>
              </div>
              <button
                onClick={() => setHistorySession(null)}
                className="text-platinum-400 hover:text-platinum-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-platinum-900 rounded-lg border border-platinum-800 text-xs">
              <div className="font-semibold text-platinum-100 text-sm">
                {historySession.studentName}
              </div>
              <div className="text-platinum-400 mt-1">
                Scheduled: <span className="font-mono text-platinum-200">{historySession.sessionDate}</span>
              </div>
              <div className="text-platinum-400">
                Counsellor: <span className="text-platinum-200">{historySession.counselorName}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-platinum-400 uppercase tracking-wider">
                Event Timeline
              </h4>

              {loadingHistory ? (
                <div className="py-8 text-center text-platinum-500 text-xs">
                  Loading history trail...
                </div>
              ) : sessionHistory.length === 0 ? (
                <div className="py-8 text-center text-platinum-500 text-xs">
                  No prior reschedule or audit events recorded for this session.
                </div>
              ) : (
                <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-platinum-800">
                  {sessionHistory.map((ev) => (
                    <div key={ev.id} className="relative text-xs">
                      <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-deep-ocean-400 ring-4 ring-platinum-950" />
                      <div className="font-semibold text-platinum-200">
                        {ev.action?.replace(/_/g, " ")}
                      </div>
                      <div className="text-[11px] text-platinum-500 mt-0.5">
                        by {ev.actorName || "User"} • {new Date(ev.createdAt).toLocaleString("en-GB")}
                      </div>
                      {ev.reason && (
                        <div className="text-platinum-300 bg-platinum-900 p-2 rounded border border-platinum-800 mt-1.5 text-[11px]">
                          {ev.reason}
                        </div>
                      )}
                      {ev.afterSnapshot?.sessionDate && ev.beforeSnapshot?.sessionDate && (
                        <div className="text-[10px] text-pale-oak-400 mt-1 font-mono">
                          Date changed: {ev.beforeSnapshot.sessionDate} → {ev.afterSnapshot.sessionDate}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-platinum-800">
              <button
                onClick={() => setHistorySession(null)}
                className="crm-btn-secondary w-full"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
