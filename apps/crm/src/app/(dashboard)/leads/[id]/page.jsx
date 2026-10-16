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
  GraduationCap,
  X,
  CalendarClock,
} from "lucide-react";
import { crmApi } from "@/lib/api";
import { getStatusBadgeClass, formatStatusLabel } from "@/lib/status";

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

const CALL_OUTCOMES = [
  { value: "reached", label: "Connected / Reached", color: "text-deep-ocean-400" },
  { value: "callback_requested", label: "Callback Requested", color: "text-dark-teal-300" },
  { value: "not_reached", label: "No Answer / Ringing", color: "text-pale-oak-400" },
  { value: "busy", label: "Busy / Engaged", color: "text-pale-oak-300" },
  { value: "switched_off", label: "Switched Off", color: "text-platinum-400" },
  { value: "interested", label: "Interested", color: "text-deep-ocean-300" },
  { value: "not_interested", label: "Not Interested", color: "text-dark-wine-400" },
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

  // Counselling scheduling modal state
  const [isCounsellingModalOpen, setIsCounsellingModalOpen] = useState(false);
  const [counsellingForm, setCounsellingForm] = useState({
    sessionDate: new Date().toISOString().split("T")[0],
    counselorId: "",
    courseInterest: "",
    source: "phone",
    outcome: "session_booked",
    notes: "",
  });
  const [bookingCounselling, setBookingCounselling] = useState(false);

  const handleScheduleCounselling = async (e) => {
    e.preventDefault();
    if (!counsellingForm.sessionDate) {
      alert("Please select a session date");
      return;
    }
    setBookingCounselling(true);
    try {
      await crmApi.scheduleLeadCounselling(lead.id, {
        ...counsellingForm,
        studentName: lead.fullName,
        phone: lead.normalizedPhone,
        counselorId: counsellingForm.counselorId || lead.assignedToUserId,
      });
      setIsCounsellingModalOpen(false);
      setCounsellingForm({
        sessionDate: new Date().toISOString().split("T")[0],
        counselorId: "",
        courseInterest: "",
        source: "phone",
        outcome: "session_booked",
        notes: "",
      });
      await fetchLeadDetails();
    } catch (err) {
      alert(err.message || "Failed to schedule counselling session");
    } finally {
      setBookingCounselling(false);
    }
  };

  const fetchLeadDetails = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await crmApi.getLead(id);
      setLead(data);
    } catch (err) {
      console.warn("Could not load lead from backend:", err.message);
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
      console.warn("Could not load staff list from backend:", err.message);
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-platinum-400">
        <Loader2 className="w-8 h-8 animate-spin text-dark-teal-400" />
        <p className="text-sm">Loading lead profile & activity...</p>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="glass-panel p-8 rounded-xl max-w-xl mx-auto text-center space-y-4 my-12">
        <AlertCircle className="w-10 h-10 text-dark-wine-400 mx-auto" />
        <h2 className="text-lg font-bold text-platinum-50">Lead Not Available</h2>
        <p className="text-xs text-platinum-400">{error || "The requested lead could not be found."}</p>
        <Link
          href="/leads"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-teal-600 hover:bg-dark-teal-500 text-platinum-50 text-xs font-semibold"
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
            className="crm-btn-secondary !p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="crm-page-title text-xl font-bold">{lead.fullName}</h1>
              <span className={getStatusBadgeClass(lead.status)}>
                {formatStatusLabel(lead.status)}
              </span>
            </div>
            <p className="crm-page-subtitle text-xs mt-0.5">
              Lead ID: <span className="font-mono text-platinum-400">{lead.id}</span> • Registered{" "}
              {new Date(lead.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Header Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsCounsellingModalOpen(true)}
            className="crm-btn-primary"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Book Counselling</span>
          </button>

          <button
            onClick={handleCopyContact}
            className="crm-btn-secondary"
            title="Copy contact details"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-deep-ocean-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy Contact"}</span>
          </button>

          {lead.normalizedPhone && (
            <a
              href={`tel:${lead.normalizedPhone}`}
              className="crm-btn-call"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call ({lead.normalizedPhone})</span>
            </a>
          )}

          {lead.normalizedEmail && (
            <a
              href={`mailto:${lead.normalizedEmail}`}
              className="crm-btn-email"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </a>
          )}

          <button
            onClick={fetchLeadDetails}
            className="crm-btn-secondary !p-2"
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
          <div className="crm-panel p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-platinum-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-dark-teal-900/60 border border-dark-teal-700/50 text-dark-teal-300 flex items-center justify-center">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-platinum-50">Log Call & Contact Activity</h3>
                  <p className="text-[11px] text-platinum-400">Record call outcome, customer feedback, and follow-ups</p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-platinum-500">Fast Log</span>
            </div>

            <form onSubmit={handleLogCall} className="space-y-4">
              {/* Outcome Selector */}
              <div>
                <label className="crm-label">Call Outcome</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CALL_OUTCOMES.map((out) => (
                    <button
                      key={out.value}
                      type="button"
                      onClick={() => setCallOutcome(out.value)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-center transition-all ${
                        callOutcome === out.value
                          ? "bg-dark-teal-600/30 border-dark-teal-500 text-platinum-50 shadow-sm"
                          : "crm-btn-secondary"
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
                  <label className="crm-label">
                    Call Duration (Seconds)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      step="10"
                      value={callDuration}
                      onChange={(e) => setCallDuration(e.target.value)}
                      className="crm-input"
                    />
                    <div className="flex gap-1">
                      {[30, 60, 180, 300].map((sec) => (
                        <button
                          key={sec}
                          type="button"
                          onClick={() => setCallDuration(sec)}
                          className="crm-btn-secondary !py-1 !px-2 text-[10px]"
                        >
                          {sec < 60 ? `${sec}s` : `${sec / 60}m`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {callOutcome === "callback_requested" && (
                  <div>
                    <label className="crm-label text-deep-ocean-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Next Callback Schedule *</span>
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={callbackAt}
                      onChange={(e) => setCallbackAt(e.target.value)}
                      className="crm-input !border-deep-ocean-500/50"
                    />
                  </div>
                )}
              </div>

              {/* Call Notes */}
              <div>
                <label className="crm-label">
                  Discussion Notes & Remarks
                </label>
                <textarea
                  rows="2"
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  placeholder="Record summary of conversation, prospect's interest, objections, or next steps..."
                  className="crm-textarea"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loggingCall}
                  className="crm-btn-primary"
                >
                  {loggingCall ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Save Call Record</span>
                </button>
              </div>
            </form>
          </div>

          {/* Activity Tabs & Timeline */}
          <div className="crm-panel overflow-hidden">
            {/* Tab Header */}
            <div className="flex items-center border-b border-platinum-800 bg-platinum-900/60 px-4">
              <button
                onClick={() => setActiveTab("timeline")}
                className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
                  activeTab === "timeline"
                    ? "border-dark-teal-500 text-platinum-50"
                    : "border-transparent text-platinum-400 hover:text-platinum-200"
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Activity Timeline ({lead.timeline?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab("counselling")}
                className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
                  activeTab === "counselling"
                    ? "border-dark-teal-500 text-platinum-50"
                    : "border-transparent text-platinum-400 hover:text-platinum-200"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Counselling ({lead.counsellingSessions?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab("enquiries")}
                className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
                  activeTab === "enquiries"
                    ? "border-dark-teal-500 text-platinum-50"
                    : "border-transparent text-platinum-400 hover:text-platinum-200"
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
                  <div className="py-12 text-center text-platinum-500 text-xs">
                    No activity recorded yet for this lead.
                  </div>
                ) : (
                  <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-platinum-800">
                    {lead.timeline.map((item) => {
                      const isCall = item.type === "call";
                      const isStatus = item.type === "status_change";
                      const isEnquiry = item.type === "enquiry";
                      const isCounselling = item.type === "counselling";

                      return (
                        <div key={item.id} className="relative group">
                          {/* Dot / Icon */}
                          <div
                            className={`absolute -left-[27px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                              isCall
                                ? "bg-dark-teal-950 border-dark-teal-500 text-dark-teal-300"
                                : isStatus
                                ? "bg-pale-oak-950 border-pale-oak-500 text-pale-oak-300"
                                : isEnquiry
                                ? "bg-deep-ocean-950 border-deep-ocean-500 text-deep-ocean-300"
                                : isCounselling
                                ? "bg-dark-teal-950 border-dark-teal-400 text-deep-ocean-300"
                                : "bg-platinum-900 border-platinum-700 text-platinum-400"
                            }`}
                          >
                            {isCall ? (
                              <Phone className="w-3 h-3" />
                            ) : isStatus ? (
                              <RefreshCw className="w-3 h-3" />
                            ) : isEnquiry ? (
                              <MessageSquare className="w-3 h-3" />
                            ) : isCounselling ? (
                              <GraduationCap className="w-3 h-3" />
                            ) : (
                              <History className="w-3 h-3" />
                            )}
                          </div>

                          {/* Content Card */}
                          <div className="bg-platinum-900/70 border border-platinum-800/80 rounded-xl p-3.5 text-xs space-y-1.5 hover:border-platinum-700/80 transition-colors">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold text-platinum-50 capitalize">{item.title}</span>
                              <span className="text-[10px] text-platinum-500 whitespace-nowrap">
                                {new Date(item.timestamp).toLocaleString()}
                              </span>
                            </div>

                            <p className="text-[11px] text-platinum-400">
                              By <span className="font-medium text-platinum-300">{item.actorName}</span>
                            </p>

                            {/* Call Details */}
                            {isCall && (
                              <div className="bg-platinum-950/60 p-2.5 rounded-lg border border-platinum-800/60 space-y-1 mt-1 text-platinum-300 text-[11px]">
                                <div className="flex items-center gap-3 text-platinum-400">
                                  <span>Duration: {item.duration}s</span>
                                  {item.callbackAt && (
                                    <span className="text-deep-ocean-400 font-medium">
                                      Callback Scheduled: {new Date(item.callbackAt).toLocaleString()}
                                    </span>
                                  )}
                                </div>
                                {item.notes && <p className="italic text-platinum-200">"{item.notes}"</p>}
                              </div>
                            )}

                            {/* Counselling details */}
                            {isCounselling && (
                              <div className="bg-dark-teal-950/40 p-2.5 rounded-lg border border-dark-teal-800/50 space-y-1.5 mt-1 text-[11px]">
                                <div className="flex items-center justify-between">
                                  <span className={getStatusBadgeClass(item.outcome)}>
                                    {formatStatusLabel(item.outcome)}
                                  </span>
                                  {item.sessionDate && (
                                    <span className="text-platinum-400 font-mono">
                                      Scheduled Date: {item.sessionDate}
                                    </span>
                                  )}
                                </div>
                                {item.courseInterest && (
                                  <p className="text-pale-oak-300 font-medium">
                                    Target Course: {item.courseInterest}
                                  </p>
                                )}
                                {item.notes && (
                                  <p className="italic text-platinum-300">"{item.notes}"</p>
                                )}
                              </div>
                            )}

                            {/* Reason for status or general audit */}
                            {!isCall && !isCounselling && item.reason && (
                              <p className="text-platinum-300 italic text-[11px]">"{item.reason}"</p>
                            )}

                            {/* Enquiry message */}
                            {isEnquiry && item.message && (
                              <div className="bg-deep-ocean-950/20 p-2.5 rounded-lg border border-deep-ocean-900/40 text-deep-ocean-200 text-[11px] mt-1">
                                <span className="font-semibold text-deep-ocean-300 block mb-0.5">Submitted Message:</span>
                                {item.message}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              ) : activeTab === "counselling" ? (
                /* Counselling Sessions Tab */
                !lead.counsellingSessions || lead.counsellingSessions.length === 0 ? (
                  <div className="py-12 text-center text-platinum-500 text-xs space-y-3">
                    <GraduationCap className="w-8 h-8 text-platinum-600 mx-auto" />
                    <p className="font-medium text-platinum-300">No counselling sessions scheduled yet</p>
                    <button
                      onClick={() => setIsCounsellingModalOpen(true)}
                      className="crm-btn-primary mx-auto"
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>Book Counselling for {lead.fullName}</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-platinum-400 font-semibold">
                        Linked Sessions ({lead.counsellingSessions.length})
                      </span>
                      <button
                        onClick={() => setIsCounsellingModalOpen(true)}
                        className="crm-btn-primary !py-1 !px-2.5 text-xs"
                      >
                        <GraduationCap className="w-3 h-3" />
                        <span>Schedule New</span>
                      </button>
                    </div>

                    {lead.counsellingSessions.map((cs) => (
                      <div
                        key={cs.id}
                        className="p-4 rounded-xl bg-platinum-900/80 border border-platinum-800 text-xs space-y-2 hover:border-dark-teal-700/60 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-platinum-100 text-sm">
                              {cs.studentName}
                            </span>
                            <span className={getStatusBadgeClass(cs.outcome)}>
                              {formatStatusLabel(cs.outcome)}
                            </span>
                          </div>
                          <span className="font-mono text-xs text-deep-ocean-300 bg-platinum-950 px-2 py-0.5 rounded border border-platinum-800">
                            {cs.sessionDate}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] text-platinum-400">
                          <div>Counsellor: <span className="text-platinum-200">{cs.counselorName || "Assigned Rep"}</span></div>
                          <div>Source: <span className="text-platinum-200 capitalize">{cs.source}</span></div>
                          {cs.courseInterest && (
                            <div className="col-span-2 text-pale-oak-300">
                              Course Interest: <span className="font-semibold">{cs.courseInterest}</span>
                            </div>
                          )}
                        </div>

                        {cs.notes && (
                          <div className="bg-platinum-950/60 p-2.5 rounded-lg border border-platinum-800/80 text-platinum-300 text-[11px] italic">
                            "{cs.notes}"
                          </div>
                        )}

                        <div className="flex justify-end pt-1">
                          <Link href="/counselling" className="crm-lead-link text-[11px] inline-flex items-center gap-1">
                            <span>Open in Counselling Manager</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                /* Associated Website Enquiries */
                !lead.enquiries || lead.enquiries.length === 0 ? (
                  <div className="py-12 text-center text-platinum-500 text-xs">
                    No web form submissions linked to this lead.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {lead.enquiries.map((enq) => (
                      <div
                        key={enq.id}
                        className="p-4 rounded-xl bg-platinum-900/80 border border-platinum-800 text-xs space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-platinum-50">
                            {enq.firstName} {enq.lastName || ""}
                          </span>
                          <span className="text-[10px] text-platinum-500">
                            {new Date(enq.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-platinum-400 text-[11px]">
                          <div>Email: <span className="text-platinum-200">{enq.email}</span></div>
                          <div>Phone: <span className="text-platinum-200">{enq.phone || "N/A"}</span></div>
                        </div>
                        <div className="bg-platinum-950/60 p-2.5 rounded-lg border border-platinum-800/80 text-platinum-300 text-[11px]">
                          <span className="font-medium text-platinum-400 block mb-1">Submitted Enquiry Query:</span>
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
          <div className="crm-panel p-5 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-platinum-400">
              Lifecycle Stage
            </h3>

            <div>
              <label className="crm-label">
                Change Pipeline Status
              </label>
              <div className="relative">
                <select
                  value={lead.status}
                  disabled={updatingStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="crm-select appearance-none font-semibold pr-8"
                >
                  {STATUSES.map((st) => (
                    <option key={st.value} value={st.value} className="bg-platinum-900 text-platinum-50">
                      {st.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-platinum-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {updatingStatus && (
                <p className="text-[10px] text-dark-teal-400 mt-1 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Updating status...</span>
                </p>
              )}
            </div>
          </div>

          {/* Assigned Representative Card */}
          <div className="crm-panel p-5 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-platinum-400">
              Sales Ownership
            </h3>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-dark-teal-900/60 text-dark-teal-300 border border-dark-teal-700/50 flex items-center justify-center font-bold text-sm">
                {lead.assignedToUserName ? lead.assignedToUserName[0] : "?"}
              </div>
              <div>
                <p className="text-xs font-bold text-platinum-50">
                  {lead.assignedToUserName || "Unassigned"}
                </p>
                <p className="text-[11px] text-platinum-400">
                  {lead.assignedTeamName ? `Team: ${lead.assignedTeamName}` : "Direct Sales Rep"}
                </p>
              </div>
            </div>

            <div>
              <label className="crm-label">
                Assign / Transfer Lead
              </label>
              <div className="relative">
                <select
                  value={lead.assignedToUserId || ""}
                  disabled={updatingAssignment}
                  onChange={(e) => handleAssignStaff(e.target.value)}
                  className="crm-select appearance-none pr-8"
                >
                  <option value="">Unassigned</option>
                  {staff.map((s) => (
                    <option key={s.id} value={s.id} className="bg-platinum-900 text-platinum-50">
                      {s.name} ({s.role || "Staff"})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-platinum-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {updatingAssignment && (
                <p className="text-[10px] text-dark-teal-400 mt-1 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Transferring lead...</span>
                </p>
              )}
            </div>
          </div>

          {/* Prospect Profile Details */}
          <div className="crm-panel p-5 space-y-3 text-xs">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-platinum-400 mb-2">
              Contact Profile
            </h3>

            <div className="space-y-2.5">
              <div>
                <span className="text-[11px] text-platinum-500 block">Full Name</span>
                <span className="font-semibold text-platinum-50">{lead.fullName}</span>
              </div>

              <div>
                <span className="text-[11px] text-platinum-500 block">Normalized Phone</span>
                <span className="font-mono text-platinum-200">{lead.normalizedPhone || "Not provided"}</span>
              </div>

              <div>
                <span className="text-[11px] text-platinum-500 block">Normalized Email</span>
                <span className="font-mono text-platinum-200">{lead.normalizedEmail || "Not provided"}</span>
              </div>

              <div>
                <span className="text-[11px] text-platinum-500 block">Admission Conversion Status</span>
                {lead.convertedStudentId ? (
                  <span className="inline-flex items-center gap-1 text-deep-ocean-400 font-semibold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Converted (Student #{lead.convertedStudentId})</span>
                  </span>
                ) : (
                  <span className="text-platinum-400 text-[11px]">Not yet converted</span>
                )}
              </div>

              <div className="pt-2 border-t border-platinum-800 text-[10px] text-platinum-500 space-y-1">
                <div>Record Version: v{lead.version || 1}</div>
                <div>Created: {new Date(lead.createdAt).toLocaleString()}</div>
                <div>Last Updated: {new Date(lead.updatedAt).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL: BOOK COUNSELLING FOR THIS LEAD --- */}
      {isCounsellingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="crm-panel w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-platinum-800 pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-deep-ocean-400" />
                <h3 className="font-bold text-sm text-platinum-100">
                  Book Counselling Session for {lead.fullName}
                </h3>
              </div>
              <button
                onClick={() => setIsCounsellingModalOpen(false)}
                className="text-platinum-400 hover:text-platinum-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleScheduleCounselling} className="space-y-3">
              <div className="p-3 bg-platinum-900 rounded-lg border border-platinum-800 text-xs grid grid-cols-2 gap-2">
                <div>
                  <span className="text-platinum-500 block">Candidate</span>
                  <span className="font-semibold text-platinum-100">{lead.fullName}</span>
                </div>
                <div>
                  <span className="text-platinum-500 block">Phone</span>
                  <span className="font-mono text-platinum-200">{lead.normalizedPhone || "No Phone"}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="crm-label">Session Date *</label>
                  <input
                    type="date"
                    required
                    value={counsellingForm.sessionDate}
                    onChange={(e) => setCounsellingForm({ ...counsellingForm, sessionDate: e.target.value })}
                    className="crm-input font-mono"
                  />
                </div>

                <div>
                  <label className="crm-label">Counsellor / Rep</label>
                  <select
                    value={counsellingForm.counselorId}
                    onChange={(e) => setCounsellingForm({ ...counsellingForm, counselorId: e.target.value })}
                    className="crm-select"
                  >
                    <option value="">
                      Assigned ({lead.assignedToUserName || "Current Rep"})
                    </option>
                    {staff.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="crm-label">Course of Interest</label>
                  <input
                    type="text"
                    placeholder="e.g. Full Stack Web Development"
                    value={counsellingForm.courseInterest}
                    onChange={(e) => setCounsellingForm({ ...counsellingForm, courseInterest: e.target.value })}
                    className="crm-input"
                  />
                </div>

                <div>
                  <label className="crm-label">Source</label>
                  <select
                    value={counsellingForm.source}
                    onChange={(e) => setCounsellingForm({ ...counsellingForm, source: e.target.value })}
                    className="crm-select"
                  >
                    <option value="phone">Phone Outbound</option>
                    <option value="walk_in">Walk-in</option>
                    <option value="referral">Referral</option>
                  </select>
                </div>

                <div>
                  <label className="crm-label">Initial Outcome</label>
                  <select
                    value={counsellingForm.outcome}
                    onChange={(e) => setCounsellingForm({ ...counsellingForm, outcome: e.target.value })}
                    className="crm-select"
                  >
                    <option value="session_booked">Session Booked (Upcoming)</option>
                    <option value="completed">Conducted Immediately (EOD Attributed)</option>
                    <option value="follow_up">Follow-up Required</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="crm-label">Session Discussion / Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Candidate aspirations, counseling agenda, notes..."
                    value={counsellingForm.notes}
                    onChange={(e) => setCounsellingForm({ ...counsellingForm, notes: e.target.value })}
                    className="crm-textarea"
                  />
                </div>
              </div>

              <div className="p-2.5 rounded bg-dark-teal-950/60 border border-dark-teal-800/60 text-[11px] text-deep-ocean-300">
                <strong>Lead State Sync:</strong> Scheduling counselling automatically updates this lead's lifecycle status to <span className="font-semibold text-platinum-100">Counselling Scheduled</span> and logs an audit record in the timeline.
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-platinum-800">
                <button
                  type="button"
                  onClick={() => setIsCounsellingModalOpen(false)}
                  className="crm-btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingCounselling}
                  className="crm-btn-primary"
                >
                  {bookingCounselling ? "Booking..." : "Schedule Counselling"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
