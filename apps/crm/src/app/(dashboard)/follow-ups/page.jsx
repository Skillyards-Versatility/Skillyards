"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarClock,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Calendar,
  Phone,
  ArrowRight,
  Loader2,
  RefreshCw,
  ExternalLink,
  Check,
  Send,
  X,
  User,
} from "lucide-react";
import { crmApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function FollowUpsPage() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    counts: { overdue: 0, dueToday: 0, upcoming: 0, completed: 0, totalActive: 0 },
    overdue: [],
    dueToday: [],
    upcoming: [],
    completed: [],
  });

  // Active filter tab: 'all' | 'dueToday' | 'overdue' | 'upcoming' | 'completed'
  const [activeTab, setActiveTab] = useState("all");

  // Scope: 'my' | 'all'
  const [scope, setScope] = useState("my");

  // Modal states for Complete / Reschedule
  const [actionTask, setActionTask] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [completionNotes, setCompletionNotes] = useState("");
  const [newCallbackAt, setNewCallbackAt] = useState("");
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [submittingAction, setSubmittingAction] = useState(false);

  const fetchFollowUps = async () => {
    try {
      setLoading(true);
      const res = await crmApi.getFollowUps({ scope });
      setData(
        res || {
          counts: { overdue: 0, dueToday: 0, upcoming: 0, completed: 0, totalActive: 0 },
          overdue: [],
          dueToday: [],
          upcoming: [],
          completed: [],
        }
      );
    } catch (err) {
      console.error("Failed to load follow-up tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowUps();
  }, [scope]);

  const handleOpenCompleteModal = (task) => {
    setActionTask(task);
    setModalMode("complete");
    setCompletionNotes("");
  };

  const handleOpenRescheduleModal = (task) => {
    setActionTask(task);
    setModalMode("reschedule");
    setNewCallbackAt("");
    setRescheduleReason("");
  };

  const closeModal = () => {
    setActionTask(null);
    setModalMode(null);
  };

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    if (!actionTask) return;
    try {
      setSubmittingAction(true);
      if (modalMode === "complete") {
        await crmApi.completeFollowUp(actionTask.id, {
          completionNotes: completionNotes || "Callback completed",
        });
      } else if (modalMode === "reschedule") {
        await crmApi.rescheduleFollowUp(actionTask.id, {
          newCallbackAt,
          reason: rescheduleReason || "Customer requested different time",
        });
      }
      closeModal();
      await fetchFollowUps();
    } catch (err) {
      alert(err.message || "Failed to update follow-up task");
    } finally {
      setSubmittingAction(false);
    }
  };

  let displayedTasks = [];
  if (activeTab === "all") {
    displayedTasks = [...data.overdue, ...data.dueToday, ...data.upcoming];
  } else if (activeTab === "overdue") {
    displayedTasks = data.overdue;
  } else if (activeTab === "dueToday") {
    displayedTasks = data.dueToday;
  } else if (activeTab === "upcoming") {
    displayedTasks = data.upcoming;
  } else if (activeTab === "completed") {
    displayedTasks = data.completed;
  }

  const formatSchedule = (isoString) => {
    if (!isoString) return "-";
    const d = new Date(isoString);
    return d.toLocaleString("en-IN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-deep-ocean-900/60 border border-deep-ocean-700/50 text-deep-ocean-300 flex items-center justify-center">
              <CalendarClock className="w-4 h-4" />
            </div>
            <h1 className="crm-page-title">Follow-up Tasks & Callbacks</h1>
          </div>
          <p className="crm-page-subtitle">
            Prioritized callback queue ensuring client contact commitments are honoured on time.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          {/* Scope Toggle */}
          <div className="flex items-center rounded-lg bg-platinum-900 border border-platinum-800 p-0.5 text-xs font-semibold">
            <button
              onClick={() => setScope("my")}
              className={`px-3 py-1 rounded-md transition-colors ${
                scope === "my" ? "bg-dark-teal-600 text-platinum-50" : "text-platinum-400 hover:text-platinum-50"
              }`}
            >
              My Tasks
            </button>
            <button
              onClick={() => setScope("all")}
              className={`px-3 py-1 rounded-md transition-colors ${
                scope === "all" ? "bg-dark-teal-600 text-platinum-50" : "text-platinum-400 hover:text-platinum-50"
              }`}
            >
              All Team Tasks
            </button>
          </div>

          <button
            onClick={fetchFollowUps}
            className="crm-btn-secondary"
            title="Refresh tasks"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab("overdue")}
          className={`crm-card p-4 cursor-pointer transition-all ${
            activeTab === "overdue"
              ? "!border-dark-wine-500/80 bg-dark-wine-950/40"
              : "hover:border-platinum-700"
          }`}
        >
          <div className="flex items-center justify-between text-platinum-400 text-xs font-medium">
            <span>Overdue Callbacks</span>
            <AlertTriangle className="w-3.5 h-3.5 text-dark-wine-400" />
          </div>
          <p className="text-2xl font-bold text-dark-wine-400 mt-1">{data.counts.overdue}</p>
          <span className="text-[10px] text-platinum-500">Requires urgent outreach</span>
        </div>

        <div
          onClick={() => setActiveTab("dueToday")}
          className={`crm-card p-4 cursor-pointer transition-all ${
            activeTab === "dueToday"
              ? "!border-dark-teal-500/80 bg-dark-teal-950/40"
              : "hover:border-platinum-700"
          }`}
        >
          <div className="flex items-center justify-between text-platinum-400 text-xs font-medium">
            <span>Due Today</span>
            <Clock className="w-3.5 h-3.5 text-dark-teal-300" />
          </div>
          <p className="text-2xl font-bold text-dark-teal-300 mt-1">{data.counts.dueToday}</p>
          <span className="text-[10px] text-platinum-500">Scheduled for today</span>
        </div>

        <div
          onClick={() => setActiveTab("upcoming")}
          className={`crm-card p-4 cursor-pointer transition-all ${
            activeTab === "upcoming"
              ? "!border-deep-ocean-500/80 bg-deep-ocean-950/40"
              : "hover:border-platinum-700"
          }`}
        >
          <div className="flex items-center justify-between text-platinum-400 text-xs font-medium">
            <span>Upcoming</span>
            <Calendar className="w-3.5 h-3.5 text-deep-ocean-300" />
          </div>
          <p className="text-2xl font-bold text-deep-ocean-300 mt-1">{data.counts.upcoming}</p>
          <span className="text-[10px] text-platinum-500">Tomorrow & onwards</span>
        </div>

        <div
          onClick={() => setActiveTab("completed")}
          className={`crm-card p-4 cursor-pointer transition-all ${
            activeTab === "completed"
              ? "!border-deep-ocean-500/80 bg-deep-ocean-950/40"
              : "hover:border-platinum-700"
          }`}
        >
          <div className="flex items-center justify-between text-platinum-400 text-xs font-medium">
            <span>Completed</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-deep-ocean-400" />
          </div>
          <p className="text-2xl font-bold text-deep-ocean-400 mt-1">{data.counts.completed}</p>
          <span className="text-[10px] text-platinum-500">Resolved tasks</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="crm-tab-bar">
        {[
          { label: "All Active", value: "all", count: data.counts.totalActive },
          { label: "Due Today", value: "dueToday", count: data.counts.dueToday },
          { label: "Overdue", value: "overdue", count: data.counts.overdue },
          { label: "Upcoming", value: "upcoming", count: data.counts.upcoming },
          { label: "Completed", value: "completed", count: data.counts.completed },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={activeTab === tab.value ? "crm-tab-active" : "crm-tab-inactive"}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={activeTab === tab.value ? "crm-tab-badge-active" : "crm-tab-badge-inactive"}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-platinum-400 gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-dark-teal-400" />
          <span className="text-xs">Loading follow-up tasks...</span>
        </div>
      ) : displayedTasks.length === 0 ? (
        <div className="crm-panel p-16 text-center space-y-3 max-w-lg mx-auto">
          <CheckCircle2 className="w-10 h-10 text-deep-ocean-400 mx-auto" />
          <h3 className="text-sm font-bold text-platinum-50">No Tasks in This Category</h3>
          <p className="text-xs text-platinum-400 leading-relaxed">
            {activeTab === "overdue"
              ? "Great job! There are no overdue follow-ups."
              : activeTab === "dueToday"
              ? "All callbacks scheduled for today have been attended to."
              : "No follow-up callbacks scheduled currently."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedTasks.map((task) => {
            const isOverdue = data.overdue.some((o) => o.id === task.id);
            const isDueToday = data.dueToday.some((d) => d.id === task.id);
            const isCompleted = task.status === "completed";

            return (
              <div
                key={task.id}
                className="crm-panel p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Left: Info */}
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`crm-badge uppercase tracking-wider ${
                        isCompleted
                          ? "crm-badge-success"
                          : isOverdue
                          ? "crm-badge-danger"
                          : isDueToday
                          ? "crm-badge-info"
                          : "crm-badge-contacted"
                      }`}
                    >
                      {isCompleted ? "Completed" : isOverdue ? "Overdue" : isDueToday ? "Due Today" : "Upcoming"}
                    </span>

                    {task.leadId ? (
                      <Link
                        href={`/leads/${task.leadId}`}
                        className="crm-lead-link text-sm flex items-center gap-1"
                      >
                        <span>{task.leadFullName}</span>
                        <ExternalLink className="w-3 h-3 text-platinum-500" />
                      </Link>
                    ) : (
                      <span className="font-bold text-platinum-50 text-sm">{task.leadFullName}</span>
                    )}

                    <span className="text-xs text-platinum-400 font-mono">({task.leadPhone})</span>
                  </div>

                  {/* Scheduled time & rep */}
                  <div className="flex items-center gap-4 text-xs text-platinum-400 flex-wrap">
                    <div className="flex items-center gap-1 text-platinum-200 font-medium">
                      <Clock className="w-3.5 h-3.5 text-deep-ocean-400" />
                      <span>Scheduled: {formatSchedule(task.callbackAt)}</span>
                    </div>

                    <div className="flex items-center gap-1 text-platinum-400">
                      <User className="w-3.5 h-3.5 text-platinum-500" />
                      <span>Rep: {task.telecallerName}</span>
                    </div>
                  </div>

                  {/* Previous call notes */}
                  {task.notes && (
                    <p className="text-[11px] text-platinum-300 italic bg-platinum-950/80 px-2.5 py-1 rounded-lg border border-platinum-800/80 inline-block">
                      "{task.notes}"
                    </p>
                  )}

                  {/* Completed notes if completed */}
                  {isCompleted && task.completionNotes && (
                    <p className="text-[11px] text-deep-ocean-300 font-medium">
                      ✓ Resolution: {task.completionNotes}
                    </p>
                  )}
                </div>

                {/* Right: Quick Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {!isCompleted && (
                    <>
                      {task.leadPhone && (
                        <a
                          href={`tel:${task.leadPhone}`}
                          className="crm-btn-call"
                          title="Call phone directly"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call</span>
                        </a>
                      )}

                      <button
                        onClick={() => handleOpenCompleteModal(task)}
                        className="crm-btn-primary !py-1.5 !px-3"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Complete</span>
                      </button>

                      <button
                        onClick={() => handleOpenRescheduleModal(task)}
                        className="crm-btn-secondary !py-1.5 !px-3"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Reschedule</span>
                      </button>
                    </>
                  )}

                  {task.leadId && (
                    <Link
                      href={`/leads/${task.leadId}`}
                      className="crm-btn-secondary !p-2"
                      title="Open Lead Workspace"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Complete / Reschedule Action Modal */}
      {modalMode && actionTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="crm-panel w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-platinum-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-platinum-50">
                  {modalMode === "complete" ? "Mark Callback Completed" : "Reschedule Follow-up"}
                </h3>
                <p className="text-xs text-platinum-400 mt-0.5">
                  Prospect: <span className="text-platinum-100 font-semibold">{actionTask.leadFullName}</span> ({actionTask.leadPhone})
                </p>
              </div>
              <button onClick={closeModal} className="crm-btn-ghost !p-1.5">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleActionSubmit} className="space-y-4">
              {modalMode === "complete" ? (
                <div>
                  <label className="crm-label">
                    Completion Notes & Outcome *
                  </label>
                  <textarea
                    rows="3"
                    required
                    value={completionNotes}
                    onChange={(e) => setCompletionNotes(e.target.value)}
                    placeholder="Document discussion summary or why this callback task is fulfilled..."
                    className="crm-textarea"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="crm-label flex items-center gap-1 text-deep-ocean-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>New Callback Schedule *</span>
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={newCallbackAt}
                      onChange={(e) => setNewCallbackAt(e.target.value)}
                      className="crm-input"
                    />
                  </div>

                  <div>
                    <label className="crm-label">
                      Reason for Rescheduling
                    </label>
                    <input
                      type="text"
                      value={rescheduleReason}
                      onChange={(e) => setRescheduleReason(e.target.value)}
                      placeholder="e.g. Prospect busy in meeting, requested evening call"
                      className="crm-input"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-platinum-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="crm-btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAction}
                  className="crm-btn-primary"
                >
                  {submittingAction ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>{modalMode === "complete" ? "Confirm Completed" : "Save Reschedule"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
