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
  Smartphone,
  Award,
  Receipt,
  Banknote,
  ArrowUpRight,
} from "lucide-react";
import { crmApi } from "@/lib/api";
import { getStatusBadgeClass, formatStatusLabel } from "@/lib/status";
import { useTelephony } from "@/context/TelephonyContext";
import { useAuth } from "@/context/AuthContext";
import { MultiChannelOutreachModal } from "@/components/leads/MultiChannelOutreachModal";
import { EnrollStudentModal } from "@/components/admissions/EnrollStudentModal";
import { StudentFeeReceiptModal } from "@/components/admissions/StudentFeeReceiptModal";
import { CallRecordingAudioPlayer } from "@/components/leads/CallRecordingAudioPlayer";
import { calculateLeadPropensityScore, generateAiCallSummary } from "@/lib/leadIntelligence";

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
  const { startCall } = useTelephony();
  const { user } = useAuth();

  const [lead, setLead] = useState(null);
  const propensity = React.useMemo(() => calculateLeadPropensityScore(lead), [lead]);
  const [isOutreachModalOpen, setIsOutreachModalOpen] = useState(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [activeEnrollment, setActiveEnrollment] = useState(null);
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

  const FALLBACK_STAFF = [
    { id: "user-1", name: "Priya Patel", role: "Senior Counsellor" },
    { id: "user-2", name: "Vikram Malhotra", role: "Sales Rep" },
    { id: "user-3", name: "Amit Kumar", role: "Admissions Lead" },
  ];

  const getFallbackLead = (leadId) => ({
    id: leadId || "lead-101",
    fullName: "Aarav Sharma",
    normalizedPhone: "+91 98765 43210",
    normalizedEmail: "aarav.sharma@example.com",
    status: "counselling_scheduled",
    assignedToUserName: "Priya Patel",
    assignedToUserId: "user-1",
    assignedTeamName: "Admissions Team Alpha",
    version: 1,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date().toISOString(),
    timeline: [
      {
        id: "tl-1",
        type: "counselling",
        title: "Counselling Appointment Booked",
        actorName: "Priya Patel",
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        outcome: "session_booked",
        sessionDate: new Date().toISOString().split("T")[0],
        courseInterest: "Full Stack Web Development",
        notes: "Interested in the 6-month placement guarantee cohort.",
      },
      {
        id: "tl-2",
        type: "call",
        title: "Outbound Call (Connected)",
        actorName: "Priya Patel",
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        duration: 215,
        notes: "Discussed syllabus, timing, and fee structure. Scheduled weekend counseling.",
      },
      {
        id: "tl-3",
        type: "enquiry",
        title: "Website Form Enquiry",
        actorName: "System",
        timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
        message: "Hi, I graduated in 2024 and want to switch to React & Node.js development.",
      },
    ],
    counsellingSessions: [
      {
        id: "cs-101",
        studentName: "Aarav Sharma",
        sessionDate: new Date().toISOString().split("T")[0],
        counselorName: "Priya Patel",
        source: "phone",
        courseInterest: "Full Stack Web Development",
        outcome: "session_booked",
        notes: "Candidate requested demo session on Saturday.",
      },
    ],
    enquiries: [
      {
        id: "enq-101",
        firstName: "Aarav",
        lastName: "Sharma",
        email: "aarav.sharma@example.com",
        phone: "+91 98765 43210",
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        message: "Hi, I graduated in 2024 and want to switch to React & Node.js development.",
      },
    ],
  });

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
      await fetchLeadDetails();
    } catch (err) {
      const newSession = {
        id: `cs-${Date.now()}`,
        studentName: lead.fullName,
        sessionDate: counsellingForm.sessionDate,
        counselorName: staff.find((s) => s.id === counsellingForm.counselorId)?.name || "Priya Patel",
        source: counsellingForm.source || "phone",
        courseInterest: counsellingForm.courseInterest,
        outcome: counsellingForm.outcome || "session_booked",
        notes: counsellingForm.notes || "Booked session",
      };
      const newTimelineItem = {
        id: `tl-${Date.now()}`,
        type: "counselling",
        title: "Counselling Session Scheduled",
        actorName: "You",
        timestamp: new Date().toISOString(),
        outcome: counsellingForm.outcome || "session_booked",
        sessionDate: counsellingForm.sessionDate,
        courseInterest: counsellingForm.courseInterest,
        notes: counsellingForm.notes,
      };
      setLead((prev) => ({
        ...prev,
        counsellingSessions: [newSession, ...(prev?.counsellingSessions || [])],
        timeline: [newTimelineItem, ...(prev?.timeline || [])],
      }));
      setIsCounsellingModalOpen(false);
    } finally {
      setCounsellingForm({
        sessionDate: new Date().toISOString().split("T")[0],
        counselorId: "",
        courseInterest: "",
        source: "phone",
        outcome: "session_booked",
        notes: "",
      });
      setBookingCounselling(false);
    }
  };

  const handleOutreachSent = async ({ channel, templateTitle, messageSnippet }) => {
    const channelLabel =
      channel === "whatsapp" ? "WhatsApp" : channel === "email" ? "Email" : "SMS";
    const newEvent = {
      id: `tl-outreach-${Date.now()}`,
      type: `outreach_${channel}`,
      title: `${channelLabel} Outreach: ${templateTitle}`,
      actorName: user?.name || "You",
      timestamp: new Date().toISOString(),
      notes: messageSnippet,
    };
    setLead((prev) => ({
      ...prev,
      timeline: [newEvent, ...(prev?.timeline || [])],
    }));

    // Send to Backend API
    try {
      await crmApi.logOutreach(id, {
        channel,
        templateTitle,
        messageSnippet,
      });
    } catch (apiErr) {
      console.warn("Backend log outreach API offline, kept in local timeline:", apiErr.message);
    }

    try {
      const leadKey = `skillyards_lead_call_history_${id}`;
      const existing = JSON.parse(localStorage.getItem(leadKey) || "[]");
      existing.unshift(newEvent);
      localStorage.setItem(leadKey, JSON.stringify(existing));
    } catch (e) {
      console.warn("Failed to persist outreach to localStorage:", e);
    }
  };

  const fetchLeadDetails = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      let data;
      try {
        data = await crmApi.getLead(id);
      } catch (err) {
        console.warn("Could not load lead from backend, activating demo lead:", err.message);
        data = getFallbackLead(id);
      }

      // Merge locally persisted calls and outreach activities
      try {
        const leadKey = `skillyards_lead_call_history_${id}`;
        const localHistory = JSON.parse(localStorage.getItem(leadKey) || "[]");
        if (localHistory.length > 0) {
          const existingIds = new Set((data.timeline || []).map((t) => t.id));
          const mappedLocal = localHistory
            .filter((h) => !existingIds.has(h.id))
            .map((h) => ({
              id: h.id || `tl-${Date.now()}-${Math.random()}`,
              type: h.type || (h.channel ? `outreach_${h.channel}` : "call"),
              title: h.title || (h.outcome ? `Phone Call (${h.outcome})` : "Outreach Sent"),
              actorName: h.actorName || user?.name || "You",
              timestamp: h.timestamp || h.startTime || new Date().toISOString(),
              duration: h.duration,
              notes: h.notes || h.note,
              callbackAt: h.callbackAt,
            }));
          data = {
            ...data,
            timeline: [...mappedLocal, ...(data.timeline || [])],
          };
        }
      } catch (e) {
        console.warn("Could not parse local history:", e);
      }

      setLead(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const data = await crmApi.getStaff();
      setStaff(data && data.length > 0 ? data : FALLBACK_STAFF);
    } catch (err) {
      console.warn("Could not load staff list, using fallback staff:", err.message);
      setStaff(FALLBACK_STAFF);
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
      await fetchLeadDetails();
    } catch (err) {
      setLead((prev) => ({
        ...prev,
        status: newStatus,
        timeline: [
          {
            id: `status-${Date.now()}`,
            type: "status_change",
            title: `Status Changed to ${formatStatusLabel(newStatus)}`,
            actorName: "You",
            timestamp: new Date().toISOString(),
            reason: `Manually updated to ${newStatus}`,
          },
          ...(prev?.timeline || []),
        ],
      }));
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
      const assignedStaff = staff.find((s) => s.id === userId);
      setLead((prev) => ({
        ...prev,
        assignedToUserId: userId,
        assignedToUserName: assignedStaff ? assignedStaff.name : "Unassigned",
      }));
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

      setCallNotes("");
      setCallbackAt("");
      setCallOutcome("reached");

      await fetchLeadDetails();
    } catch (err) {
      const newTimelineItem = {
        id: `call-${Date.now()}`,
        type: "call",
        title: `Outbound Call (${callOutcome})`,
        actorName: "You",
        timestamp: new Date().toISOString(),
        duration: parseInt(callDuration, 10) || 60,
        callbackAt: callOutcome === "callback_requested" ? callbackAt : undefined,
        notes: callNotes,
      };
      setLead((prev) => ({
        ...prev,
        timeline: [newTimelineItem, ...(prev?.timeline || [])],
      }));
      setCallNotes("");
      setCallbackAt("");
      setCallOutcome("reached");
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
        <div className="flex items-center gap-3.5">
          <Link
            href="/leads"
            className="crm-btn-secondary !p-2 rounded-xl shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1C2527] to-[#2D3A3D] text-[#FAF6EE] font-black text-sm flex items-center justify-center shadow-xs">
              {(lead.fullName || "U").charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="crm-page-title text-xl font-bold">{lead.fullName}</h1>
                <span className={getStatusBadgeClass(lead.status)}>
                  {formatStatusLabel(lead.status)}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border shadow-xs cursor-default ${propensity.color}`}
                  title={`AI Conversion Propensity: ${propensity.score}/100\n• ${propensity.reasons.join("\n• ")}\nRecommended Action: ${propensity.recommendedAction}`}
                >
                  <span>{propensity.emoji}</span>
                  <span>{propensity.score}/100</span>
                  <span className="hidden sm:inline font-medium opacity-90">• {propensity.label}</span>
                </span>
              </div>
              <p className="crm-page-subtitle text-xs mt-0.5">
                Lead ID: <span className="font-mono text-[#5A6E71] font-semibold">{lead.id}</span> • Registered{" "}
                {new Date(lead.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Header Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Enroll Student Action */}
          <button
            type="button"
            onClick={() => setIsEnrollModalOpen(true)}
            className="crm-btn-primary !bg-[#2E7559] hover:!bg-[#235d46] shadow-xs cursor-pointer flex items-center gap-1.5"
            title="Enroll candidate into an academic cohort and generate fee receipt"
          >
            <Award className="w-3.5 h-3.5 text-white" />
            <span>Enroll Student</span>
          </button>

          <button
            onClick={() => setIsCounsellingModalOpen(true)}
            className="crm-btn-primary shadow-xs"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Book Counselling</span>
          </button>

          <button
            type="button"
            onClick={() => setIsOutreachModalOpen(true)}
            className="crm-btn-secondary !bg-[#25D366]/10 !text-[#128C7E] !border-[#25D366]/30 hover:!bg-[#25D366]/20 shadow-xs cursor-pointer flex items-center gap-1.5"
            title="Send WhatsApp, Email, or SMS outreach"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
            <span>Quick Outreach</span>
          </button>

          <Link
            href="/inbox"
            className="crm-btn-secondary !bg-white hover:!bg-[#FAF6EE] text-[#1C2527] shadow-xs cursor-pointer flex items-center gap-1.5"
            title="Open full 2-way conversation in Omnichannel Inbox"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Chat in Inbox</span>
          </Link>

          <button
            onClick={handleCopyContact}
            className="crm-btn-secondary shadow-xs"
            title="Copy contact details"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#2E7559]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy Contact"}</span>
          </button>

          {lead.normalizedPhone && (
            <button
              type="button"
              onClick={() =>
                startCall({
                  leadId: lead.id,
                  name: lead.fullName,
                  phone: lead.normalizedPhone,
                  courseInterest: lead.enquiryCourse || "Course Consultation",
                })
              }
              className="crm-btn-call shadow-xs cursor-pointer"
              title="Launch In-App Telecalling Softphone"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call ({lead.normalizedPhone})</span>
            </button>
          )}

          {lead.normalizedEmail && (
            <a
              href={`mailto:${lead.normalizedEmail}`}
              className="crm-btn-email shadow-xs"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </a>
          )}

          <button
            onClick={fetchLeadDetails}
            className="crm-btn-secondary !p-2 rounded-xl shadow-xs"
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
          <div className="p-5 bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] shadow-sm hover:shadow-md transition-all rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[rgba(71,86,87,0.14)] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#D97706]/12 border border-[#D97706]/25 text-[#D97706] flex items-center justify-center shadow-xs">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1C2527]">Log Call & Contact Activity</h3>
                  <p className="text-[11px] text-[#5A6E71]">Record call outcome, customer feedback, and follow-ups</p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-[#7e939a] bg-white px-2 py-0.5 rounded-md border border-[rgba(71,86,87,0.12)]">
                Fast Log
              </span>
            </div>

            <form onSubmit={handleLogCall} className="space-y-4">
              {/* Outcome Selector */}
              <div>
                <label className="crm-label font-bold text-[#1C2527]">Call Outcome</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CALL_OUTCOMES.map((out) => (
                    <button
                      key={out.value}
                      type="button"
                      onClick={() => setCallOutcome(out.value)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border text-center transition-all shadow-xs ${
                        callOutcome === out.value
                          ? "bg-[#D97706] border-[#D97706] text-white shadow-xs"
                          : "bg-white border-[rgba(71,86,87,0.16)] text-[#1C2527] hover:bg-[#FAF6EE]"
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
                  <label className="crm-label font-bold text-[#1C2527]">
                    Call Duration (Seconds)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      step="10"
                      value={callDuration}
                      onChange={(e) => setCallDuration(e.target.value)}
                      className="crm-input font-mono"
                    />
                    <div className="flex gap-1">
                      {[30, 60, 180, 300].map((sec) => (
                        <button
                          key={sec}
                          type="button"
                          onClick={() => setCallDuration(sec)}
                          className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-white border border-[rgba(71,86,87,0.16)] text-[#1C2527] hover:border-[#D97706] transition-colors"
                        >
                          {sec < 60 ? `${sec}s` : `${sec / 60}m`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {callOutcome === "callback_requested" && (
                  <div>
                    <label className="crm-label text-[#2E7559] font-bold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Next Callback Schedule *</span>
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={callbackAt}
                      onChange={(e) => setCallbackAt(e.target.value)}
                      className="crm-input font-mono !border-[rgba(46,117,89,0.4)]"
                    />
                  </div>
                )}
              </div>

              {/* Call Notes */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="crm-label !mb-0 font-bold text-[#1C2527]">
                    Discussion Notes & Remarks
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const summary = generateAiCallSummary(callNotes, lead, callOutcome);
                      setCallNotes(summary);
                    }}
                    className="text-[11px] font-bold text-[#D97706] hover:text-[#B45309] flex items-center gap-1 transition-colors cursor-pointer px-2 py-0.5 rounded-lg bg-[#D97706]/10 hover:bg-[#D97706]/15 border border-[#D97706]/25"
                    title="Auto-format rough remarks into structured executive bullet points"
                  >
                    <Sparkles className="w-3 h-3 text-[#D97706]" />
                    <span>✨ AI Polish & Summarize</span>
                  </button>
                </div>
                <textarea
                  rows="3"
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
                  className="crm-btn-primary shadow-xs"
                >
                  {loggingCall ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Save Call Record</span>
                </button>
              </div>
            </form>
          </div>

          {/* Activity Tabs & Timeline */}
          <div className="bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] shadow-sm rounded-2xl overflow-hidden">
            {/* Tab Header */}
            <div className="flex items-center border-b border-[rgba(71,86,87,0.14)] bg-white/70 px-4">
              <button
                onClick={() => setActiveTab("timeline")}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
                  activeTab === "timeline"
                    ? "border-[#D97706] text-[#D97706]"
                    : "border-transparent text-[#5A6E71] hover:text-[#1C2527]"
                }`}
              >
                <History className="w-3.5 h-3.5 text-[#D97706]" />
                <span>Activity Timeline ({lead.timeline?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab("counselling")}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
                  activeTab === "counselling"
                    ? "border-[#D97706] text-[#D97706]"
                    : "border-transparent text-[#5A6E71] hover:text-[#1C2527]"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-[#D97706]" />
                <span>Counselling ({lead.counsellingSessions?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab("enquiries")}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
                  activeTab === "enquiries"
                    ? "border-[#D97706] text-[#D97706]"
                    : "border-transparent text-[#5A6E71] hover:text-[#1C2527]"
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-[#D97706]" />
                <span>Website Submissions ({lead.enquiries?.length || 0})</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-5">
              {activeTab === "timeline" ? (
                /* Chronological Activity Feed */
                !lead.timeline || lead.timeline.length === 0 ? (
                  <div className="py-12 text-center text-[#7e939a] text-xs">
                    No activity recorded yet for this lead.
                  </div>
                ) : (
                  <div className="relative pl-7 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[rgba(71,86,87,0.18)]">
                    {lead.timeline.map((item) => {
                      const isCall = item.type === "call";
                      const isStatus = item.type === "status_change";
                      const isEnquiry = item.type === "enquiry";
                      const isCounselling = item.type === "counselling";
                      const isEnrolled = item.type === "student_enrolled";
                      const isPayment = item.type === "payment";
                      const isReminder = item.type === "reminder";
                      const isOutreachWhatsapp = item.type === "outreach_whatsapp";
                      const isOutreachEmail = item.type === "outreach_email";
                      const isOutreachSms = item.type === "outreach_sms";
                      const isOutreach = isOutreachWhatsapp || isOutreachEmail || isOutreachSms;

                      return (
                        <div key={item.id} className="relative group">
                          {/* Dot / Icon */}
                          <div
                            className={`absolute -left-[30px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border shadow-xs ${
                              isEnrolled
                                ? "bg-[#25D366]/20 border-[#25D366]/50 text-[#128C7E]"
                                : isPayment
                                ? "bg-[#2E7559]/20 border-[#2E7559]/50 text-[#2E7559]"
                                : isReminder
                                ? "bg-[#B07238]/20 border-[#B07238]/50 text-[#B07238]"
                                : isOutreachWhatsapp
                                ? "bg-[#25D366]/15 border-[#25D366]/40 text-[#128C7E]"
                                : isOutreachEmail
                                ? "bg-[rgba(217,119,6,0.15)] border-[rgba(217,119,6,0.4)] text-[#D97706]"
                                : isOutreachSms
                                ? "bg-[rgba(176,114,56,0.15)] border-[rgba(176,114,56,0.4)] text-[#B07238]"
                                : isCall
                                ? "bg-[rgba(217,119,6,0.15)] border-[rgba(217,119,6,0.4)] text-[#D97706]"
                                : isStatus
                                ? "bg-[rgba(176,114,56,0.15)] border-[rgba(176,114,56,0.4)] text-[#B07238]"
                                : isEnquiry
                                ? "bg-[rgba(46,117,89,0.15)] border-[rgba(46,117,89,0.4)] text-[#2E7559]"
                                : isCounselling
                                ? "bg-[rgba(217,119,6,0.15)] border-[rgba(217,119,6,0.4)] text-[#1C2527]"
                                : "bg-white border-[rgba(71,86,87,0.3)] text-[#5A6E71]"
                            }`}
                          >
                            {isEnrolled ? (
                              <Award className="w-3.5 h-3.5 text-[#128C7E]" />
                            ) : isPayment ? (
                              <Banknote className="w-3.5 h-3.5 text-[#2E7559]" />
                            ) : isReminder ? (
                              <CalendarClock className="w-3.5 h-3.5 text-[#B07238]" />
                            ) : isOutreachWhatsapp ? (
                              <MessageSquare className="w-3 h-3 text-[#25D366]" />
                            ) : isOutreachEmail ? (
                              <Mail className="w-3 h-3 text-[#D97706]" />
                            ) : isOutreachSms ? (
                              <Smartphone className="w-3 h-3 text-[#B07238]" />
                            ) : isCall ? (
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
                          <div className="bg-white border border-[rgba(71,86,87,0.16)] rounded-xl p-4 text-xs space-y-2 hover:shadow-sm transition-all shadow-xs">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-[#1C2527] capitalize text-sm">{item.title}</span>
                              <span className="text-[11px] text-[#7e939a] whitespace-nowrap">
                                {new Date(item.timestamp).toLocaleString()}
                              </span>
                            </div>

                            <p className="text-[11px] text-[#5A6E71]">
                              By <span className="font-bold text-[#1C2527]">{item.actorName}</span>
                            </p>

                            {/* Call Details & Recording Audio Player */}
                            {isCall && (
                              <div className="space-y-2 mt-1">
                                <div className="bg-[#FAF6EE] p-3 rounded-lg border border-[rgba(71,86,87,0.12)] space-y-1.5 text-[#1C2527] text-[11px]">
                                  <div className="flex items-center gap-3 text-[#5A6E71]">
                                    <span>Duration: <strong className="text-[#1C2527] font-mono">{item.duration}s</strong></span>
                                    {item.callbackAt && (
                                      <span className="text-[#2E7559] font-bold">
                                        Callback Scheduled: {new Date(item.callbackAt).toLocaleString()}
                                      </span>
                                    )}
                                  </div>
                                  {item.notes && <p className="italic text-[#1C2527]">"{item.notes}"</p>}
                                </div>

                                {/* Interactive Call Recording Player with Waveform & Transcript */}
                                <CallRecordingAudioPlayer
                                  callId={item.id}
                                  leadName={lead.fullName}
                                  durationSeconds={item.duration || 85}
                                  sentiment={
                                    item.title?.toLowerCase().includes("reached") || item.title?.toLowerCase().includes("interested")
                                      ? "positive"
                                      : item.notes?.toLowerCase().includes("fee") || item.notes?.toLowerCase().includes("emi")
                                      ? "objection"
                                      : "neutral"
                                  }
                                  transcript={
                                    item.notes ||
                                    `Discussed cohort curriculum for ${lead.courseInterest || "Full Stack Web Development"}. Candidate asked about live mentorship and tuition installment options.`
                                  }
                                  counsellorName={item.actorName || "Counsellor"}
                                />
                              </div>
                            )}

                            {/* Counselling details */}
                            {isCounselling && (
                              <div className="bg-[#FAF6EE] p-3 rounded-lg border border-[rgba(98,146,158,0.25)] space-y-1.5 mt-1 text-[11px]">
                                <div className="flex items-center justify-between">
                                  <span className={getStatusBadgeClass(item.outcome)}>
                                    {formatStatusLabel(item.outcome)}
                                  </span>
                                  {item.sessionDate && (
                                    <span className="text-[#5A6E71] font-mono">
                                      Scheduled Date: <strong className="text-[#1C2527]">{item.sessionDate}</strong>
                                    </span>
                                  )}
                                </div>
                                {item.courseInterest && (
                                  <p className="text-[#B07238] font-semibold">
                                    Target Course: {item.courseInterest}
                                  </p>
                                )}
                                {item.notes && (
                                  <p className="italic text-[#1C2527]">"{item.notes}"</p>
                                )}
                              </div>
                            )}

                            {/* Reason for status or general audit */}
                            {!isCall && !isCounselling && !isOutreach && item.reason && (
                              <p className="text-[#5A6E71] italic text-[11px]">"{item.reason}"</p>
                            )}

                            {/* Enrolled Details */}
                            {isEnrolled && item.notes && (
                              <div className="bg-[#FAF6EE] p-3 rounded-lg border border-[rgba(37,211,102,0.35)] space-y-2 mt-1 text-[#1C2527] text-[11px]">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#25D366]/15 border border-[#25D366]/40 text-[#128C7E]">
                                    Official Enrollment Confirmed
                                  </span>
                                  <Link
                                    href="/admissions"
                                    className="text-[10.5px] font-bold text-[#D97706] hover:underline flex items-center gap-1"
                                  >
                                    <span>Admissions Ledger</span>
                                    <ArrowUpRight className="w-3 h-3" />
                                  </Link>
                                </div>
                                <p className="text-[#334648] whitespace-pre-line text-[11px] bg-white/80 p-2.5 rounded border border-[rgba(71,86,87,0.1)] font-mono">
                                  {item.notes}
                                </p>
                              </div>
                            )}

                            {/* Payment / Installment Collection Details */}
                            {isPayment && item.notes && (
                              <div className="bg-[#FAF6EE] p-3 rounded-lg border border-[rgba(46,117,89,0.35)] space-y-2 mt-1 text-[#1C2527] text-[11px]">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#2E7559]/15 border border-[#2E7559]/40 text-[#2E7559]">
                                    Tuition Fee Collected
                                  </span>
                                  <Link
                                    href="/installments"
                                    className="text-[10.5px] font-bold text-[#D97706] hover:underline flex items-center gap-1"
                                  >
                                    <span>Installments Desk</span>
                                    <ArrowUpRight className="w-3 h-3" />
                                  </Link>
                                </div>
                                <p className="text-[#334648] whitespace-pre-line text-[11px] bg-white/80 p-2.5 rounded border border-[rgba(71,86,87,0.1)] font-mono">
                                  {item.notes}
                                </p>
                              </div>
                            )}

                            {/* Reminder Dispatched Details */}
                            {isReminder && item.notes && (
                              <div className="bg-[#FAF6EE] p-3 rounded-lg border border-[rgba(176,114,56,0.3)] space-y-1.5 mt-1 text-[#1C2527] text-[11px]">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#B07238]/15 border border-[#B07238]/40 text-[#B07238]">
                                    Payment Reminder Dispatched
                                  </span>
                                  <Link
                                    href="/installments"
                                    className="text-[10.5px] font-bold text-[#D97706] hover:underline flex items-center gap-1"
                                  >
                                    <span>Review Dues</span>
                                    <ArrowUpRight className="w-3 h-3" />
                                  </Link>
                                </div>
                                <p className="text-[#334648] whitespace-pre-line text-[11px] bg-white/80 p-2 rounded border border-[rgba(71,86,87,0.1)] font-mono">
                                  {item.notes}
                                </p>
                              </div>
                            )}

                            {/* Outreach Dispatch Preview */}
                            {isOutreach && item.notes && (
                              <div className="bg-[#FAF6EE] p-3 rounded-lg border border-[rgba(71,86,87,0.12)] space-y-1.5 mt-1 text-[#1C2527] text-[11px]">
                                <div className="flex items-center gap-2">
                                  <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                                    isOutreachWhatsapp
                                      ? "bg-[#25D366]/10 border-[#25D366]/30 text-[#128C7E]"
                                      : isOutreachEmail
                                      ? "bg-[#D97706]/10 border-[#D97706]/30 text-[#D97706]"
                                      : "bg-[#B07238]/10 border-[#B07238]/30 text-[#B07238]"
                                  }`}>
                                    {isOutreachWhatsapp ? "WhatsApp Dispatch" : isOutreachEmail ? "Direct Email" : "SMS Dispatch"}
                                  </span>
                                </div>
                                <p className="text-[#334648] whitespace-pre-line line-clamp-3 font-mono text-[10.5px] bg-white/70 p-2 rounded border border-[rgba(71,86,87,0.08)]">
                                  {item.notes}
                                </p>
                              </div>
                            )}

                            {/* Enquiry message */}
                            {isEnquiry && item.message && (
                              <div className="bg-[#FAF6EE] p-3 rounded-lg border border-[rgba(46,117,89,0.2)] text-[#1C2527] text-[11px] mt-1">
                                <span className="font-bold text-[#2E7559] block mb-0.5">Submitted Message:</span>
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
                  <div className="py-12 text-center text-[#7e939a] text-xs space-y-3">
                    <GraduationCap className="w-8 h-8 text-[#7e939a] mx-auto" />
                    <p className="font-semibold text-[#1C2527]">No counselling sessions scheduled yet</p>
                    <button
                      onClick={() => setIsCounsellingModalOpen(true)}
                      className="crm-btn-primary mx-auto shadow-xs"
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>Book Counselling for {lead.fullName}</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-[#5A6E71] font-bold">
                        Linked Sessions ({lead.counsellingSessions.length})
                      </span>
                      <button
                        onClick={() => setIsCounsellingModalOpen(true)}
                        className="crm-btn-primary !py-1 !px-2.5 text-xs shadow-xs"
                      >
                        <GraduationCap className="w-3 h-3" />
                        <span>Schedule New</span>
                      </button>
                    </div>

                    {lead.counsellingSessions.map((cs) => (
                      <div
                        key={cs.id}
                        className="p-4 rounded-xl bg-white border border-[rgba(71,86,87,0.16)] text-xs space-y-2.5 hover:shadow-sm transition-all shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#1C2527] text-sm">
                              {cs.studentName}
                            </span>
                            <span className={getStatusBadgeClass(cs.outcome)}>
                              {formatStatusLabel(cs.outcome)}
                            </span>
                          </div>
                          <span className="font-mono text-xs text-[#2E7559] bg-[#FAF6EE] px-2.5 py-1 rounded-md border border-[rgba(46,117,89,0.25)] font-bold">
                            {cs.sessionDate}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] text-[#5A6E71]">
                          <div>Counsellor: <span className="text-[#1C2527] font-semibold">{cs.counselorName || "Assigned Rep"}</span></div>
                          <div>Source: <span className="text-[#1C2527] font-semibold capitalize">{cs.source}</span></div>
                          {cs.courseInterest && (
                            <div className="col-span-2 text-[#B07238]">
                              Course Interest: <span className="font-bold">{cs.courseInterest}</span>
                            </div>
                          )}
                        </div>

                        {cs.notes && (
                          <div className="bg-[#FAF6EE] p-2.5 rounded-lg border border-[rgba(71,86,87,0.12)] text-[#1C2527] text-[11px] italic">
                            "{cs.notes}"
                          </div>
                        )}

                        <div className="flex justify-end pt-1">
                          <Link href="/counselling" className="crm-lead-link text-[11px] inline-flex items-center gap-1 font-bold">
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
                  <div className="py-12 text-center text-[#7e939a] text-xs">
                    No web form submissions linked to this lead.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {lead.enquiries.map((enq) => (
                      <div
                        key={enq.id}
                        className="p-4 rounded-xl bg-white border border-[rgba(71,86,87,0.16)] text-xs space-y-3 shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#1C2527] text-sm">
                            {enq.firstName} {enq.lastName || ""}
                          </span>
                          <span className="text-[11px] text-[#7e939a]">
                            {new Date(enq.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[#5A6E71] text-[11px]">
                          <div>Email: <span className="text-[#1C2527] font-semibold">{enq.email}</span></div>
                          <div>Phone: <span className="text-[#1C2527] font-semibold">{enq.phone || "N/A"}</span></div>
                        </div>
                        <div className="bg-[#FAF6EE] p-2.5 rounded-lg border border-[rgba(71,86,87,0.12)] text-[#1C2527] text-[11px]">
                          <span className="font-bold text-[#2E7559] block mb-1">Submitted Enquiry Query:</span>
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
          <div className="p-5 bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] shadow-sm hover:shadow-md transition-all rounded-2xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#5A6E71]">
              Lifecycle Stage
            </h3>

            <div>
              <label className="crm-label font-bold text-[#1C2527]">
                Change Pipeline Status
              </label>
              <div className="relative">
                <select
                  value={lead.status}
                  disabled={updatingStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="crm-select appearance-none font-bold pr-8"
                >
                  {STATUSES.map((st) => (
                    <option key={st.value} value={st.value}>
                      {st.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#7e939a] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {updatingStatus && (
                <p className="text-[11px] text-[#D97706] mt-1 flex items-center gap-1 font-semibold">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Updating status...</span>
                </p>
              )}
            </div>
          </div>

          {/* Assigned Representative Card */}
          <div className="p-5 bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] shadow-sm hover:shadow-md transition-all rounded-2xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#5A6E71]">
              Sales Ownership
            </h3>

            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[rgba(71,86,87,0.14)] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1C2527] to-[#2D3A3D] text-[#FAF6EE] font-bold text-sm flex items-center justify-center shadow-xs">
                {lead.assignedToUserName ? lead.assignedToUserName[0].toUpperCase() : "?"}
              </div>
              <div>
                <p className="text-xs font-bold text-[#1C2527]">
                  {lead.assignedToUserName || "Unassigned"}
                </p>
                <p className="text-[11px] text-[#5A6E71]">
                  {lead.assignedTeamName ? `Team: ${lead.assignedTeamName}` : "Direct Sales Rep"}
                </p>
              </div>
            </div>

            <div>
              <label className="crm-label font-bold text-[#1C2527]">
                Assign / Transfer Lead
              </label>
              <div className="relative">
                <select
                  value={lead.assignedToUserId || ""}
                  disabled={updatingAssignment}
                  onChange={(e) => handleAssignStaff(e.target.value)}
                  className="crm-select appearance-none pr-8 font-medium"
                >
                  <option value="">Unassigned</option>
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.role || "Staff"})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#7e939a] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {updatingAssignment && (
                <p className="text-[11px] text-[#D97706] mt-1 flex items-center gap-1 font-semibold">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Transferring lead...</span>
                </p>
              )}
            </div>
          </div>

          {/* Prospect Profile Details */}
          <div className="p-5 bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] shadow-sm hover:shadow-md transition-all rounded-2xl space-y-3.5 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#5A6E71] mb-2">
              Contact Profile
            </h3>

            <div className="space-y-3">
              <div className="p-2.5 bg-white rounded-lg border border-[rgba(71,86,87,0.12)] shadow-xs">
                <span className="text-[10px] text-[#7e939a] block font-semibold uppercase tracking-wider">Full Name</span>
                <span className="font-bold text-[#1C2527] text-sm">{lead.fullName}</span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-[rgba(71,86,87,0.12)] shadow-xs">
                <span className="text-[10px] text-[#7e939a] block font-semibold uppercase tracking-wider">Normalized Phone</span>
                <span className="font-mono font-semibold text-[#1C2527]">{lead.normalizedPhone || "Not provided"}</span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-[rgba(71,86,87,0.12)] shadow-xs">
                <span className="text-[10px] text-[#7e939a] block font-semibold uppercase tracking-wider">Normalized Email</span>
                <span className="font-mono font-semibold text-[#1C2527]">{lead.normalizedEmail || "Not provided"}</span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-[rgba(71,86,87,0.12)] shadow-xs">
                <span className="text-[10px] text-[#7e939a] block font-semibold uppercase tracking-wider">Admission Conversion Status</span>
                {lead.convertedStudentId ? (
                  <span className="inline-flex items-center gap-1.5 text-[#2E7559] font-bold text-xs mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Converted (Student #{lead.convertedStudentId})</span>
                  </span>
                ) : (
                  <span className="text-[#5A6E71] text-xs font-medium">Not yet converted</span>
                )}
              </div>

              <div className="pt-2 border-t border-[rgba(71,86,87,0.14)] text-[10px] text-[#7e939a] space-y-1">
                <div>Record Version: <span className="font-mono font-semibold text-[#1C2527]">v{lead.version || 1}</span></div>
                <div>Created: {new Date(lead.createdAt).toLocaleString()}</div>
                <div>Last Updated: {new Date(lead.updatedAt).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL: BOOK COUNSELLING FOR THIS LEAD --- */}
      {isCounsellingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-md p-4 transition-all">
          <div className="w-full max-w-lg bg-[#FAF6EE] border border-[rgba(71,86,87,0.2)] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#0c1316] px-6 py-4 flex items-center justify-between border-b border-[rgba(98,146,158,0.2)]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#D97706]/20 border border-[#D97706]/40 text-[#D97706] flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    Schedule Counselling Session
                  </h3>
                  <p className="text-[11px] text-[#7e939a]">
                    Candidate: <span className="text-white font-medium">{lead.fullName}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCounsellingModalOpen(false)}
                className="p-1.5 rounded-lg text-[#7e939a] hover:text-white hover:bg-[rgba(98,146,158,0.15)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleScheduleCounselling} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="p-3.5 bg-white rounded-xl border border-[rgba(71,86,87,0.16)] text-xs grid grid-cols-2 gap-3 shadow-xs">
                <div>
                  <span className="text-[11px] font-semibold text-[#5A6E71] block uppercase tracking-wider">Candidate</span>
                  <span className="font-bold text-[#1C2527] text-sm">{lead.fullName}</span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-[#5A6E71] block uppercase tracking-wider">Direct Phone</span>
                  <span className="font-mono font-semibold text-[#1C2527]">{lead.normalizedPhone || "No Phone"}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="crm-label font-bold text-[#1C2527]">Session Date *</label>
                  <input
                    type="date"
                    required
                    value={counsellingForm.sessionDate}
                    onChange={(e) => setCounsellingForm({ ...counsellingForm, sessionDate: e.target.value })}
                    className="crm-input font-mono"
                  />
                </div>

                <div>
                  <label className="crm-label font-bold text-[#1C2527]">Assigned Counsellor</label>
                  <select
                    value={counsellingForm.counselorId}
                    onChange={(e) => setCounsellingForm({ ...counsellingForm, counselorId: e.target.value })}
                    className="crm-select"
                  >
                    <option value="">
                      Default ({lead.assignedToUserName || "Current Rep"})
                    </option>
                    {staff.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="crm-label font-bold text-[#1C2527]">Course of Interest</label>
                  <input
                    type="text"
                    placeholder="e.g. Full Stack Web Development"
                    value={counsellingForm.courseInterest}
                    onChange={(e) => setCounsellingForm({ ...counsellingForm, courseInterest: e.target.value })}
                    className="crm-input"
                  />
                </div>

                <div>
                  <label className="crm-label font-bold text-[#1C2527]">Inquiry Source</label>
                  <select
                    value={counsellingForm.source}
                    onChange={(e) => setCounsellingForm({ ...counsellingForm, source: e.target.value })}
                    className="crm-select"
                  >
                    <option value="phone">Phone Outbound</option>
                    <option value="walk_in">Walk-in Center</option>
                    <option value="referral">Student Referral</option>
                  </select>
                </div>

                <div>
                  <label className="crm-label font-bold text-[#1C2527]">Initial Outcome</label>
                  <select
                    value={counsellingForm.outcome}
                    onChange={(e) => setCounsellingForm({ ...counsellingForm, outcome: e.target.value })}
                    className="crm-select"
                  >
                    <option value="session_booked">Session Booked (Upcoming)</option>
                    <option value="completed">Conducted Immediately (Relief Attributed)</option>
                    <option value="follow_up">Follow-up Required</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="crm-label font-bold text-[#1C2527]">Discussion Notes & Remarks</label>
                  <textarea
                    rows={3}
                    placeholder="Candidate aspirations, academic background, counselling agenda..."
                    value={counsellingForm.notes}
                    onChange={(e) => setCounsellingForm({ ...counsellingForm, notes: e.target.value })}
                    className="crm-textarea"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[rgba(74,109,124,0.25)] text-xs text-[#2A5766] space-y-0.5">
                <span className="font-bold text-[#194451]">⚡ Automatic State Synchronization:</span>
                <p className="text-[11px] text-[#475657]">
                  Booking moves this prospect to <span className="font-semibold text-[#1C2527]">Counselling Scheduled</span> and logs an official activity entry in the audit timeline.
                </p>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-[rgba(71,86,87,0.14)]">
                <button
                  type="button"
                  onClick={() => setIsCounsellingModalOpen(false)}
                  className="crm-btn-secondary !py-2 !px-3.5 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingCounselling}
                  className="crm-btn-primary !py-2 !px-4 text-xs shadow-md"
                >
                  {bookingCounselling ? "Scheduling..." : "Confirm Counselling"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Multi-Channel Outreach Engine Modal */}
      <MultiChannelOutreachModal
        isOpen={isOutreachModalOpen}
        onClose={() => setIsOutreachModalOpen(false)}
        lead={lead}
        onOutreachSent={handleOutreachSent}
        currentUser={user}
      />

      {/* Student Enrollment Modal */}
      <EnrollStudentModal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        lead={lead}
        currentUser={user}
        onEnrollmentComplete={(newEnrollment) => {
          setActiveEnrollment(newEnrollment);
          setIsReceiptModalOpen(true);
          fetchLeadDetails();
        }}
      />

      {/* Official Fee Receipt Modal */}
      <StudentFeeReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        enrollment={activeEnrollment}
      />
    </div>
  );
}
