"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  Mail,
  Copy,
  Check,
  Calendar,
  Clock,
  User,
  Shield,
  Send,
  Loader2,
  RefreshCw,
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  FileText,
  History,
  Sparkles,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { crmApi } from "@/lib/api";

const STATUSES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "follow_up", label: "Follow-up" },
  { value: "counselling_scheduled", label: "Counselling Scheduled" },
  { value: "counselled", label: "Counselled" },
  { value: "qualified", label: "Qualified" },
  { value: "converted", label: "Converted" },
  { value: "cold", label: "Cold" },
  { value: "lost", label: "Lost" },
];

const STATUS_COLORS = {
  new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  contacted: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  follow_up: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  counselling_scheduled: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  counselled: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  qualified: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  converted: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  cold: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  lost: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const CALL_OUTCOMES = [
  { value: "reached", label: "Connected / Reached", color: "text-emerald-400" },
  { value: "callback_requested", label: "Callback Requested", color: "text-purple-400" },
  { value: "not_reached", label: "No Answer / Ringing", color: "text-amber-400" },
  { value: "busy", label: "Busy / Engaged", color: "text-orange-400" },
  { value: "switched_off", label: "Switched Off", color: "text-slate-400" },
  { value: "interested", label: "Interested", color: "text-blue-400" },
  { value: "not_interested", label: "Not Interested", color: "text-rose-400" },
];

export default function LeadDetailPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Staff members for reassignment
  const [staff, setStaff] = useState([]);
  const [updatingAssignment, setUpdatingAssignment] = useState(false);

  // Status updating
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Active tab: 'timeline' | 'enquiries' | 'notes'
  const [activeTab, setActiveTab] = useState("timeline");

  // Call logging form state
  const [callOutcome, setCallOutcome] = useState("reached");
  const [callDuration, setCallDuration] = useState(60);
  const [callNotes, setCallNotes] = useState("");
  const [callbackAt, setCallbackAt] = useState("");
  const [loggingCall, setLoggingCall] = useState(false);

  // Copied state toast
  const [copied, setCopied] = useState(false);

  const fetchLeadDetails = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await crmApi.getLead(id);
      setLead(data);
    } catch (err) {
      console.error("Failed to load lead:", err);
      setError(err.message || "Failed to load lead details");
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const data = await crmApi.getStaff();
      setStaff(data || []);
    } catch (err) {
      console.error("Failed to load staff list:", err);
    }
  };

  useEffect(() => {
    fetchLeadDetails();
    fetchStaff();
  }, [id]);

  const handleCopyContact = () => {
    if (!lead) return;
    const info = `Name: ${lead.fullName}\nPhone: ${lead.normalizedPhone || "N/A"}\nEmail: ${lead.normalizedEmail || "N/A"}`;
    navigator.clipboard.writeText(info);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStatusChange = async (newStatus) => {
    if (!lead || newStatus === lead.status) return;
    try {
      setUpdatingStatus(true);
      await crmApi.updateLead(lead.id, {
        status: newStatus,
        reason: `Status manually updated to ${newStatus}`,
      });
      // Refresh lead details to pull new audit event
      await fetchLeadDetails();
    } catch (err) {
      alert(err.message || "Failed to update lead status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAssignStaff = async (userId) => {
    if (!lead) return;
    try {
      setUpdatingAssignment(true);
      await crmApi.updateLead(lead.id, {
        assignedToUserId: userId || null,
        reason: userId ? "Reassigned lead to representative" : "Unassigned lead",
      });
      await fetchLeadDetails();
    } catch (err) {
      alert(err.message || "Failed to update assignment");
    } finally {
      setUpdatingAssignment(false);
    }
  };

  const handleLogCall = async (e) => {
    e.preventDefault();
    if (!lead) return;
    try {
      setLoggingCall(true);
      await crmApi.logCall(lead.id, {
        outcome: callOutcome,
        duration: parseInt(callDuration, 10) || 60,
        notes: callNotes,
        callbackAt: callOutcome === "callback_requested" ? callbackAt : null,
      });

      // Reset form
      setCallNotes("");
      setCallbackAt("");
      setCallOutcome("reached");

      // Refresh lead to update timeline and potentially advanced status
      await fetchLeadDetails();
    } catch (err) {
      alert(err.message || "Failed to record call log");
    } finally {
      setLoggingCall(false);
    }
  };

  if (loading && !lead) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-sm">Loading lead profile & activity...</p>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="glass-panel p-8 rounded-xl max-w-xl mx-auto text-center space-y-4 my-12">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-white">Lead Not Available</h2>
        <p className="text-xs text-slate-400">{error || "The requested lead could not be found."}</p>
        <Link
          href="/leads"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Leads Pipeline</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Breadcrumb & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/leads"
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">{lead.fullName}</h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${
                  STATUS_COLORS[lead.status] || "bg-slate-800 text-slate-400 border-slate-700"
                }`}
              >
                {lead.status.replace("_", " ")}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Lead ID: <span className="font-mono text-slate-400">{lead.id}</span> • Registered{" "}
              {new Date(lead.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Header Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopyContact}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-colors"
            title="Copy contact details"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy Contact"}</span>
          </button>

          {lead.normalizedPhone && (
            <a
              href={`tel:${lead.normalizedPhone}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/25 text-xs font-semibold transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call ({lead.normalizedPhone})</span>
            </a>
          )}

          {lead.normalizedEmail && (
            <a
              href={`mailto:${lead.normalizedEmail}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/15 border border-blue-500/30 text-blue-400 hover:bg-blue-600/25 text-xs font-semibold transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </a>
          )}

          <button
            onClick={fetchLeadDetails}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Refresh details"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Action Center & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Call Logger Card */}
          <div className="glass-panel p-5 rounded-xl border border-slate-800/80 bg-slate-900/50 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Log Call & Contact Activity</h3>
                  <p className="text-[11px] text-slate-400">Record call outcome, customer feedback, and follow-ups</p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-slate-500">Fast Log</span>
            </div>

            <form onSubmit={handleLogCall} className="space-y-4">
              {/* Outcome Selector */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Call Outcome</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CALL_OUTCOMES.map((out) => (
                    <button
                      key={out.value}
                      type="button"
                      onClick={() => setCallOutcome(out.value)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-center transition-all ${
                        callOutcome === out.value
                          ? "bg-indigo-600/20 border-indigo-500 text-white shadow-sm shadow-indigo-500/20"
                          : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                      }`}
                    >
                      {out.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration and Callback (if requested) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Call Duration (Seconds)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      step="10"
                      value={callDuration}
                      onChange={(e) => setCallDuration(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                    <div className="flex gap-1">
                      {[30, 60, 180, 300].map((sec) => (
                        <button
                          key={sec}
                          type="button"
                          onClick={() => setCallDuration(sec)}
                          className="px-2 py-1 text-[10px] rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                        >
                          {sec < 60 ? `${sec}s` : `${sec / 60}m`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {callOutcome === "callback_requested" && (
                  <div>
                    <label className="block text-xs font-medium text-purple-400 mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Next Callback Schedule *</span>
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={callbackAt}
                      onChange={(e) => setCallbackAt(e.target.value)}
                      className="w-full bg-slate-900 border border-purple-500/40 rounded-lg px-3 py-1.5 text-xs text-purple-200 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                )}
              </div>

              {/* Call Notes */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Discussion Notes & Remarks
                </label>
                <textarea
                  rows="2"
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  placeholder="Record summary of conversation, prospect's interest, objections, or next steps..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loggingCall}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition-all"
                >
                  {loggingCall ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Save Call Record</span>
                </button>
              </div>
            </form>
          </div>

          {/* Activity Tabs & Timeline */}
          <div className="glass-panel rounded-xl overflow-hidden">
            {/* Tab Header */}
            <div className="flex items-center border-b border-slate-800 bg-slate-900/60 px-4">
              <button
                onClick={() => setActiveTab("timeline")}
                className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
                  activeTab === "timeline"
                    ? "border-indigo-500 text-white"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Activity Timeline ({lead.timeline?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab("enquiries")}
                className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
                  activeTab === "enquiries"
                    ? "border-indigo-500 text-white"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Website Submissions ({lead.enquiries?.length || 0})</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-5">
              {activeTab === "timeline" ? (
                /* Chronological Activity Feed */
                !lead.timeline || lead.timeline.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 text-xs">
                    No activity recorded yet for this lead.
                  </div>
                ) : (
                  <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                    {lead.timeline.map((item) => {
                      const isCall = item.type === "call";
                      const isStatus = item.type === "status_change";
                      const isEnquiry = item.type === "enquiry";

                      return (
                        <div key={item.id} className="relative group">
                          {/* Dot / Icon */}
                          <div
                            className={`absolute -left-[27px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                              isCall
                                ? "bg-purple-950 border-purple-500 text-purple-300"
                                : isStatus
                                ? "bg-amber-950 border-amber-500 text-amber-300"
                                : isEnquiry
                                ? "bg-blue-950 border-blue-500 text-blue-300"
                                : "bg-slate-900 border-slate-700 text-slate-400"
                            }`}
                          >
                            {isCall ? (
                              <Phone className="w-3 h-3" />
                            ) : isStatus ? (
                              <RefreshCw className="w-3 h-3" />
                            ) : isEnquiry ? (
                              <MessageSquare className="w-3 h-3" />
                            ) : (
                              <History className="w-3 h-3" />
                            )}
                          </div>

                          {/* Content Card */}
                          <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-3.5 text-xs space-y-1.5 hover:border-slate-700/80 transition-colors">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold text-white capitalize">{item.title}</span>
                              <span className="text-[10px] text-slate-500 whitespace-nowrap">
                                {new Date(item.timestamp).toLocaleString()}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-400">
                              By <span className="font-medium text-slate-300">{item.actorName}</span>
                            </p>

                            {/* Call Details */}
                            {isCall && (
                              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60 space-y-1 mt-1 text-slate-300 text-[11px]">
                                <div className="flex items-center gap-3 text-slate-400">
                                  <span>Duration: {item.duration}s</span>
                                  {item.callbackAt && (
                                    <span className="text-purple-400 font-medium">
                                      Callback Scheduled: {new Date(item.callbackAt).toLocaleString()}
                                    </span>
                                  )}
                                </div>
                                {item.notes && <p className="italic text-slate-200">"{item.notes}"</p>}
                              </div>
                            )}

                            {/* Reason for status or general audit */}
                            {!isCall && item.reason && (
                              <p className="text-slate-300 italic text-[11px]">"{item.reason}"</p>
                            )}

                            {/* Enquiry message */}
                            {isEnquiry && item.message && (
                              <div className="bg-blue-950/20 p-2.5 rounded-lg border border-blue-900/30 text-blue-200 text-[11px] mt-1">
                                <span className="font-semibold text-blue-300 block mb-0.5">Submitted Message:</span>
                                {item.message}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              ) : (
                /* Associated Website Enquiries */
                !lead.enquiries || lead.enquiries.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 text-xs">
                    No web form submissions linked to this lead.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {lead.enquiries.map((enq) => (
                      <div
                        key={enq.id}
                        className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white">
                            {enq.firstName} {enq.lastName || ""}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(enq.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-slate-400 text-[11px]">
                          <div>Email: <span className="text-slate-200">{enq.email}</span></div>
                          <div>Phone: <span className="text-slate-200">{enq.phone || "N/A"}</span></div>
                        </div>
                        <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 text-slate-300 text-[11px]">
                          <span className="font-medium text-slate-400 block mb-1">Submitted Enquiry Query:</span>
                          {enq.message}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Lead Profile & Management */}
        <div className="space-y-6">
          {/* Status & Lifecycle Management Card */}
          <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Lifecycle Stage
            </h3>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1.5 font-medium">
                Change Pipeline Status
              </label>
              <div className="relative">
                <select
                  value={lead.status}
                  disabled={updatingStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold text-white appearance-none focus:outline-none focus:border-indigo-500 cursor-pointer disabled:opacity-50"
                >
                  {STATUSES.map((st) => (
                    <option key={st.value} value={st.value} className="bg-slate-900 text-white">
                      {st.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {updatingStatus && (
                <p className="text-[10px] text-indigo-400 mt-1 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Updating status...</span>
                </p>
              )}
            </div>
          </div>

          {/* Assigned Representative Card */}
          <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Sales Ownership
            </h3>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-sm">
                {lead.assignedToUserName ? lead.assignedToUserName[0] : "?"}
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  {lead.assignedToUserName || "Unassigned"}
                </p>
                <p className="text-[11px] text-slate-400">
                  {lead.assignedTeamName ? `Team: ${lead.assignedTeamName}` : "Direct Sales Rep"}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1.5 font-medium">
                Assign / Transfer Lead
              </label>
              <div className="relative">
                <select
                  value={lead.assignedToUserId || ""}
                  disabled={updatingAssignment}
                  onChange={(e) => handleAssignStaff(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-medium text-white appearance-none focus:outline-none focus:border-indigo-500 cursor-pointer disabled:opacity-50"
                >
                  <option value="">Unassigned</option>
                  {staff.map((s) => (
                    <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                      {s.name} ({s.role || "Staff"})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {updatingAssignment && (
                <p className="text-[10px] text-indigo-400 mt-1 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Transferring lead...</span>
                </p>
              )}
            </div>
          </div>

          {/* Prospect Profile Details */}
          <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3 text-xs">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Contact Profile
            </h3>

            <div className="space-y-2.5">
              <div>
                <span className="text-[11px] text-slate-500 block">Full Name</span>
                <span className="font-semibold text-white">{lead.fullName}</span>
              </div>

              <div>
                <span className="text-[11px] text-slate-500 block">Normalized Phone</span>
                <span className="font-mono text-slate-200">{lead.normalizedPhone || "Not provided"}</span>
              </div>

              <div>
                <span className="text-[11px] text-slate-500 block">Normalized Email</span>
                <span className="font-mono text-slate-200">{lead.normalizedEmail || "Not provided"}</span>
              </div>

              <div>
                <span className="text-[11px] text-slate-500 block">Admission Conversion Status</span>
                {lead.convertedStudentId ? (
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Converted (Student #{lead.convertedStudentId})</span>
                  </span>
                ) : (
                  <span className="text-slate-400 text-[11px]">Not yet converted</span>
                )}
              </div>

              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 space-y-1">
                <div>Record Version: v{lead.version || 1}</div>
                <div>Created: {new Date(lead.createdAt).toLocaleString()}</div>
                <div>Last Updated: {new Date(lead.updatedAt).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
