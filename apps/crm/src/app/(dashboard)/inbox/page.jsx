"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Search,
  Phone,
  Mail,
  Smartphone,
  ExternalLink,
  Send,
  Sparkles,
  Paperclip,
  Check,
  CheckCheck,
  Clock,
  User,
  GraduationCap,
  Award,
  CreditCard,
  Building,
  ArrowUpRight,
  RefreshCw,
  FileText,
  CalendarClock,
  Filter,
  ChevronRight,
  ChevronLeft,
  X,
  ShieldCheck,
  PhoneCall,
  Copy,
} from "lucide-react";
import { useTelephony } from "@/context/TelephonyContext";
import { useAuth } from "@/context/AuthContext";
import { crmApi } from "@/lib/api";
import { getStatusBadgeClass, formatStatusLabel } from "@/lib/status";

// Standard EdTech Quick Macros
const QUICK_TEMPLATES = [
  {
    id: "brochure",
    label: "Brochure 📄",
    channel: "whatsapp",
    content: "Hi {{name}}, here is the official curriculum brochure for {{course}}: https://portal.skillyards.com/brochure. Would you like to review the live capstone projects together?",
  },
  {
    id: "counselling",
    label: "1-on-1 Counselling 📅",
    channel: "whatsapp",
    content: "Hello {{name}}, your personalized 1-on-1 career consultation for {{course}} is confirmed! Join your mentor here: https://meet.google.com/sky-admissions. Let me know if this time suits you.",
  },
  {
    id: "scholarship",
    label: "30% Merit Scholarship 🏷️",
    channel: "whatsapp",
    content: "Congratulations {{name}}! 🎉 You have qualified for the Skillyards Academic Merit Scholarship with up to 30% tuition waiver (Code: SKILL30). This offer is valid for the next 48 hours for the upcoming cohort.",
  },
  {
    id: "emi",
    label: "0% EMI Schedule 💳",
    channel: "whatsapp",
    content: "Hi {{name}}, we offer flexible 0% interest 10-month EMI options with zero down-payment lock. You can view your customized payment breakdown here: https://portal.skillyards.com/emi/calculator.",
  },
  {
    id: "timings",
    label: "Class Timings ⏰",
    channel: "whatsapp",
    content: "Hi {{name}}, our live interactive cohorts run on weekends (Sat-Sun 10 AM - 2 PM) and weekday evenings (Mon-Thu 7 PM - 9 PM) with full session recordings and mentor code reviews provided.",
  },
];

const INITIAL_THREADS = [
  {
    id: "lead-101",
    candidateName: "Aarav Sharma",
    candidatePhone: "+91 98765 43210",
    candidateEmail: "aarav.sharma@example.com",
    courseName: "Full Stack Web Development (MERN)",
    cohortName: "Weekend Live Cohort",
    leadStatus: "qualified",
    counselorName: "Priya Patel",
    channel: "whatsapp",
    lastMessage: "Hi Priya, could you share the live project architecture for the MERN program?",
    lastMessageSender: "candidate",
    lastMessageAt: "2026-10-20T11:44:00.000Z",
    unreadCount: 1,
    isDripEnrolled: true,
    tag: "Active Prospect",
    totalFee: 45135,
    amountPaid: 25000,
    balanceDue: 20135,
  },
  {
    id: "lead-102",
    candidateName: "Sneha Mukherjee",
    candidatePhone: "+91 99345 67890",
    candidateEmail: "sneha.m@example.com",
    courseName: "Data Science & Applied AI Accelerator",
    cohortName: "Weekday Evening Cohort",
    leadStatus: "counselling_scheduled",
    counselorName: "Amit Kumar",
    channel: "whatsapp",
    lastMessage: "Thank you! I received the Google Meet link for today's session at 5 PM.",
    lastMessageSender: "candidate",
    lastMessageAt: "2026-10-20T11:11:00.000Z",
    unreadCount: 0,
    isDripEnrolled: true,
    tag: "Counselling Scheduled",
    totalFee: 51920,
    amountPaid: 5192,
    balanceDue: 46728,
  },
  {
    id: "lead-103",
    candidateName: "Rohan Varma",
    candidatePhone: "+91 97123 45678",
    candidateEmail: "rohan.v@example.com",
    courseName: "Product Design (UI/UX) Mastery",
    cohortName: "Fast-Track Intensive",
    leadStatus: "contacted",
    counselorName: "Vikram Malhotra",
    channel: "whatsapp",
    lastMessage: "Can you provide more details regarding the 0% EMI financing plan?",
    lastMessageSender: "candidate",
    lastMessageAt: "2026-10-20T10:06:00.000Z",
    unreadCount: 2,
    isDripEnrolled: false,
    tag: "EMI Query",
    totalFee: 38000,
    amountPaid: 20000,
    balanceDue: 18000,
  },
  {
    id: "lead-104",
    candidateName: "Kabir Mehta",
    candidatePhone: "+91 98456 78901",
    candidateEmail: "kabir.m@example.com",
    courseName: "Full Stack Web Development (MERN)",
    cohortName: "Weekend Live Cohort",
    leadStatus: "converted",
    counselorName: "Priya Patel",
    channel: "whatsapp",
    lastMessage: "Payment voucher REC-2026-90412 verified. Access credentials issued.",
    lastMessageSender: "system",
    lastMessageAt: "2026-10-19T11:56:00.000Z",
    unreadCount: 0,
    isDripEnrolled: false,
    tag: "Enrolled Learner",
    totalFee: 45135,
    amountPaid: 45135,
    balanceDue: 0,
  },
  {
    id: "lead-105",
    candidateName: "Ananya Iyer",
    candidatePhone: "+91 98234 56789",
    candidateEmail: "ananya.iyer@example.com",
    courseName: "Cloud Computing & DevOps Engineering",
    cohortName: "Weekend Live Cohort",
    leadStatus: "in_followup",
    counselorName: "Amit Kumar",
    channel: "email",
    lastMessage: "Syllabus brochure & scholarship code SKILL30-4912 dispatched.",
    lastMessageSender: "counsellor",
    lastMessageAt: "2026-10-18T23:56:00.000Z",
    unreadCount: 0,
    isDripEnrolled: true,
    tag: "Cadence Drip",
    totalFee: 48000,
    amountPaid: 0,
    balanceDue: 48000,
  },
];

const INITIAL_MESSAGES_MAP = {
  "lead-101": [
    {
      id: "msg-101-1",
      sender: "candidate",
      senderName: "Aarav Sharma",
      channel: "whatsapp",
      content: "Hi! I submitted an enquiry for the MERN Stack development course. Can someone help me with the syllabus?",
      timestamp: "2026-10-20T06:56:00.000Z",
      status: "read",
    },
    {
      id: "msg-101-2",
      sender: "counsellor",
      senderName: "Priya Patel",
      channel: "whatsapp",
      content: "Hello Aarav! Welcome to Skillyards Versatility. Here is the official curriculum brochure: https://portal.skillyards.com/brochure/mern. It covers full-stack Node.js, React 19, Next.js, and cloud deployments.",
      timestamp: "2026-10-20T07:56:00.000Z",
      status: "read",
    },
    {
      id: "msg-101-3",
      sender: "system",
      senderName: "Automated Cadence",
      channel: "system",
      content: "Cadence Step 2: 1-on-1 Academic Counselling invitation link dispatched.",
      timestamp: "2026-10-20T09:56:00.000Z",
      status: "delivered",
    },
    {
      id: "msg-101-4",
      sender: "candidate",
      senderName: "Aarav Sharma",
      channel: "whatsapp",
      content: "Hi Priya, could you share the live project architecture for the MERN program?",
      timestamp: "2026-10-20T11:44:00.000Z",
      status: "delivered",
    },
  ],
  "lead-102": [
    {
      id: "msg-102-1",
      sender: "counsellor",
      senderName: "Amit Kumar",
      channel: "whatsapp",
      content: "Hi Sneha, looking forward to our Data Science & AI counselling session today at 5:00 PM. Here is the meeting room: https://meet.google.com/sky-ai-counsel",
      timestamp: "2026-10-20T08:56:00.000Z",
      status: "read",
    },
    {
      id: "msg-102-2",
      sender: "candidate",
      senderName: "Sneha Mukherjee",
      channel: "whatsapp",
      content: "Thank you! I received the Google Meet link for today's session at 5 PM.",
      timestamp: "2026-10-20T11:11:00.000Z",
      status: "read",
    },
  ],
  "lead-103": [
    {
      id: "msg-103-1",
      sender: "counsellor",
      senderName: "Vikram Malhotra",
      channel: "whatsapp",
      content: "Hi Rohan! We noticed you evaluated the UI/UX Mastery cohort. Would you like to review our flexible payment options?",
      timestamp: "2026-10-20T05:56:00.000Z",
      status: "read",
    },
    {
      id: "msg-103-2",
      sender: "candidate",
      senderName: "Rohan Varma",
      channel: "whatsapp",
      content: "Can you provide more details regarding the 0% EMI financing plan?",
      timestamp: "2026-10-20T10:06:00.000Z",
      status: "delivered",
    },
  ],
  "lead-104": [
    {
      id: "msg-104-1",
      sender: "system",
      senderName: "Admissions Desk",
      channel: "system",
      content: "Official Student Enrollment Confirmed (Student ID: SKY-2026-8812). Down-payment ₹45,135 settled.",
      timestamp: "2026-10-19T11:56:00.000Z",
      status: "delivered",
    },
  ],
  "lead-105": [
    {
      id: "msg-105-1",
      sender: "counsellor",
      senderName: "Amit Kumar",
      channel: "email",
      content: "Syllabus brochure & scholarship code SKILL30-4912 dispatched.",
      timestamp: "2026-10-18T23:56:00.000Z",
      status: "read",
    },
  ],
};

export default function OmnichannelInboxPage() {
  const { startCall } = useTelephony();
  const { user: currentUser } = useAuth();

  const [isMounted, setIsMounted] = useState(false);
  const [threads, setThreads] = useState(INITIAL_THREADS);
  const [selectedThreadId, setSelectedThreadId] = useState("lead-101");
  const [messagesMap, setMessagesMap] = useState(INITIAL_MESSAGES_MAP);
  const [searchTerm, setSearchTerm] = useState("");
  const [channelFilter, setChannelFilter] = useState("all"); // all, whatsapp, unread, drip
  const [selectedChannel, setSelectedChannel] = useState("whatsapp"); // whatsapp, email, sms
  const [messageInput, setMessageInput] = useState("");
  const [openWhatsAppOnSend, setOpenWhatsAppOnSend] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [repNotes, setRepNotes] = useState("");
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [mobileView, setMobileView] = useState("threads"); // "threads" | "chat"
  const [showMobileDossier, setShowMobileDossier] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const messagesEndRef = useRef(null);

  // Active selected thread
  const activeThread = useMemo(() => {
    return threads.find((t) => t.id === selectedThreadId) || threads[0];
  }, [threads, selectedThreadId]);

  // Messages for active thread
  const activeMessages = useMemo(() => {
    return messagesMap[activeThread?.id] || [];
  }, [messagesMap, activeThread]);

  // Load threads from backend API or local storage
  const fetchThreads = async () => {
    try {
      const res = await crmApi.getInboxThreads();
      const threadsList = res?.threads || res?.data?.threads;
      if (Array.isArray(threadsList) && threadsList.length > 0) {
        setThreads(threadsList);
      }
    } catch (_) {}
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  // Load rep notes from localStorage when active thread changes
  useEffect(() => {
    if (activeThread && typeof window !== "undefined") {
      const note = localStorage.getItem(`skillyards_rep_note_${activeThread.id}`) || "";
      setRepNotes(note);
    }
  }, [activeThread]);

  // Save rep notes
  const handleSaveNotes = (val) => {
    setRepNotes(val);
    if (activeThread && typeof window !== "undefined") {
      localStorage.setItem(`skillyards_rep_note_${activeThread.id}`, val);
    }
  };

  // Filtered threads list
  const filteredThreads = useMemo(() => {
    return threads.filter((t) => {
      if (channelFilter === "whatsapp" && t.channel !== "whatsapp") return false;
      if (channelFilter === "unread" && t.unreadCount === 0) return false;
      if (channelFilter === "drip" && !t.isDripEnrolled) return false;

      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesName = t.candidateName.toLowerCase().includes(query);
        const matchesPhone = t.candidatePhone.includes(query);
        const matchesCourse = t.courseName.toLowerCase().includes(query);
        const matchesMsg = t.lastMessage.toLowerCase().includes(query);
        if (!matchesName && !matchesPhone && !matchesCourse && !matchesMsg) return false;
      }

      return true;
    });
  }, [threads, channelFilter, searchTerm]);

  // Select a thread and clear unread count
  const handleSelectThread = (threadId) => {
    setSelectedThreadId(threadId);
    setMobileView("chat");
    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, unreadCount: 0 } : t))
    );
  };

  // Quick Macro Click
  const handleApplyMacro = (macro) => {
    if (!activeThread) return;
    const interpolated = macro.content
      .replace(/\{\{name\}\}/g, activeThread.candidateName)
      .replace(/\{\{course\}\}/g, activeThread.courseName);
    setMessageInput(interpolated);
    setSelectedChannel(macro.channel);
  };

  // Quick Token Insert
  const handleInsertToken = (token) => {
    if (!activeThread) return;
    let replacement = "";
    if (token === "name") replacement = activeThread.candidateName;
    if (token === "course") replacement = activeThread.courseName;
    if (token === "counsellor") replacement = currentUser?.name || activeThread.counselorName;
    if (token === "phone") replacement = activeThread.candidatePhone;
    setMessageInput((prev) => `${prev} ${replacement}`.trim());
  };

  // Send Message
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!messageInput.trim() || !activeThread) return;

    const content = messageInput.trim();
    setIsSending(true);

    const newMsg = {
      id: `msg-${Date.now()}`,
      threadId: activeThread.id,
      sender: "counsellor",
      senderName: currentUser?.name || activeThread.counselorName || "Admissions Rep",
      channel: selectedChannel,
      content,
      timestamp: new Date().toISOString(),
      status: "delivered",
    };

    // 1. Optimistic message update
    setMessagesMap((prev) => ({
      ...prev,
      [activeThread.id]: [...(prev[activeThread.id] || []), newMsg],
    }));

    // 2. Update thread last message
    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread.id
          ? {
              ...t,
              lastMessage: content,
              lastMessageSender: "counsellor",
              lastMessageAt: newMsg.timestamp,
              channel: selectedChannel,
            }
          : t
      )
    );

    setMessageInput("");

    // 3. Open WhatsApp Web synchronously if enabled (prevents browser popup blocker)
    if (selectedChannel === "whatsapp" && openWhatsAppOnSend) {
      const cleanPhone = (activeThread.candidatePhone || "").replace(/[^0-9]/g, "");
      const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : (cleanPhone.startsWith("91") && cleanPhone.length === 12 ? cleanPhone : `91${cleanPhone}`);
      const url = `https://wa.me/${targetPhone}?text=${encodeURIComponent(content)}`;
      window.open(url, "_blank");
    }

    // 4. Dispatch to backend API in background
    crmApi.sendInboxMessage(activeThread.id, {
      content,
      channel: selectedChannel,
      candidatePhone: activeThread.candidatePhone,
      candidateName: activeThread.candidateName,
    }).catch((err) => console.warn("Backend inbox message sync warning:", err));

    setIsSending(false);
  };

  // Copy phone number
  const handleCopyPhone = () => {
    if (!activeThread) return;
    navigator.clipboard.writeText(activeThread.candidatePhone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  // Direct Softphone Call Trigger
  const handleCall = () => {
    if (!activeThread) return;
    startCall(activeThread.candidatePhone, {
      name: activeThread.candidateName,
      id: activeThread.id,
      course: activeThread.courseName,
    });
  };

  // Change Lead Status directly from Inbox
  const handleChangeStatus = async (newStatus) => {
    setThreads((prev) =>
      prev.map((t) => (t.id === activeThread.id ? { ...t, leadStatus: newStatus } : t))
    );
    try {
      await crmApi.updateLeadStatus(activeThread.id, newStatus, "Updated via Omnichannel Inbox");
    } catch (_) {}
  };

  const renderCandidateDossier = () => {
    if (!activeThread) return null;
    return (
      <div className="space-y-4">
        {/* Candidate Dossier Header */}
        <div className="p-4 bg-white rounded-2xl border border-[rgba(71,86,87,0.16)] text-center space-y-2 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-[#0c1316] text-white flex items-center justify-center font-bold text-base mx-auto shadow-sm">
            {activeThread.candidateName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#1C2527]">{activeThread.candidateName}</h3>
            <p className="text-[11px] text-[#5A6E71] font-mono">{activeThread.candidatePhone}</p>
            <p className="text-[11px] text-[#5A6E71]">{activeThread.candidateEmail}</p>
          </div>

          {/* Status Selector */}
          <div className="pt-2 border-t border-[rgba(71,86,87,0.1)]">
            <label className="text-[10px] uppercase font-bold text-[#7E939A] block mb-1">
              Lifecycle Stage:
            </label>
            <select
              value={activeThread.leadStatus}
              onChange={(e) => handleChangeStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl bg-[#FAF6EE] border border-[rgba(71,86,87,0.2)] text-xs font-bold text-[#1C2527] focus:outline-none focus:ring-1 focus:ring-[#2E7559]"
            >
              <option value="new">New Prospect</option>
              <option value="contacted">Contacted</option>
              <option value="in_followup">In Follow-up</option>
              <option value="counselling_scheduled">Counselling Scheduled</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted / Enrolled</option>
              <option value="cold">Cold</option>
              <option value="lost">Lost</option>
            </select>
          </div>
        </div>

        {/* Target Program & Batch Card */}
        <div className="p-3.5 bg-white rounded-2xl border border-[rgba(71,86,87,0.16)] space-y-2 shadow-xs text-xs">
          <span className="text-[10px] uppercase font-bold text-[#7E939A]">Target Course</span>
          <p className="font-bold text-[#4A6D7C]">{activeThread.courseName}</p>
          <p className="text-[11px] text-[#5A6E71]">{activeThread.cohortName}</p>
          <div className="flex items-center justify-between pt-1 border-t border-[rgba(71,86,87,0.1)] text-[11px]">
            <span className="text-[#5A6E71]">Assigned Rep:</span>
            <strong className="text-[#1C2527]">{activeThread.counselorName}</strong>
          </div>
        </div>

        {/* Financial & Tuition Ledger Snippet */}
        <div className="p-3.5 bg-white rounded-2xl border border-[rgba(71,86,87,0.16)] space-y-2 shadow-xs text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[#7E939A]">Tuition Dues Status</span>
            <Link
              href="/installments"
              className="text-[10.5px] font-bold text-[#4A6D7C] hover:underline flex items-center gap-0.5"
            >
              <span>Ledger</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-1 font-mono">
            <div className="flex justify-between text-[11px]">
              <span className="text-[#5A6E71]">Program Fee:</span>
              <span suppressHydrationWarning className="font-bold text-[#1C2527]">₹{(activeThread.totalFee || 45135).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-[#5A6E71]">Amount Paid:</span>
              <span suppressHydrationWarning className="font-bold text-[#2E7559]">₹{(activeThread.amountPaid || 0).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-[11px] pt-1 border-t border-[rgba(71,86,87,0.1)]">
              <span className="text-[#5A6E71]">Balance Due:</span>
              <span suppressHydrationWarning className="font-black text-[#B07238]">₹{(activeThread.balanceDue || 0).toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Rep Internal Notepad (Local Storage Persisted) */}
        <div className="p-3.5 bg-white rounded-2xl border border-[rgba(71,86,87,0.16)] space-y-2 shadow-xs text-xs">
          <span className="text-[10px] uppercase font-bold text-[#7E939A]">Internal Rep Notes</span>
          <textarea
            rows={3}
            value={repNotes}
            onChange={(e) => handleSaveNotes(e.target.value)}
            placeholder="Add private sales notes, callback preferences, objection details..."
            className="w-full p-2 rounded-xl bg-[#FAF6EE] border border-[rgba(71,86,87,0.2)] text-[11px] text-[#1C2527] focus:outline-none focus:ring-1 focus:ring-[#2E7559] resize-none placeholder-[#7E939A]"
          />
          <p className="text-[10px] text-[#7E939A] italic">
            * Auto-saved locally for this candidate.
          </p>
        </div>

        {/* Quick Link to Lead Profile */}
        <Link
          href={`/leads/${activeThread.id}`}
          className="w-full py-2.5 rounded-xl bg-white hover:bg-[#FAF6EE] border border-[rgba(71,86,87,0.2)] text-xs font-bold text-[#1C2527] flex items-center justify-center gap-1.5 transition-colors shadow-xs"
        >
          <span>View Full Lead Profile & Activity</span>
          <ChevronRight className="w-4 h-4 text-[#7E939A]" />
        </Link>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-[#FAF6EE]">
      
      {/* Top Banner Cockpit */}
      <div className="px-3 sm:px-5 py-2 sm:py-2.5 bg-[#0c1316] text-white flex items-center justify-between border-b border-[rgba(98,146,158,0.2)] shrink-0">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366] shrink-0">
            <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xs sm:text-sm font-bold tracking-wide truncate">Omnichannel Inbox</h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-[#25D366]/20 text-[#25D366] text-[10px] font-bold uppercase tracking-wider items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                <span>Live WhatsApp</span>
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-[#7E939A] truncate">
              Unified two-way candidate conversations, instant EdTech macro triggers, and CRM intelligence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-xs shrink-0">
          <div className="hidden sm:flex items-center gap-2 text-[#7E939A]">
            <span>Active: <strong className="text-white">{threads.length}</strong></span>
            <span>•</span>
            <span className="text-[#25D366]">Unread: <strong className="text-[#25D366]">{threads.filter((t) => t.unreadCount > 0).length}</strong></span>
          </div>

          <Link
            href="/cadences"
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-[11px] sm:text-xs font-semibold border border-white/20 transition-colors"
          >
            <span className="hidden sm:inline">Drip Cadences</span>
            <span className="sm:hidden">Cadences</span>
            <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#7E939A]" />
          </Link>
        </div>
      </div>

      {/* Main 3-Column Split Pane */}
      <div className="flex-1 flex min-h-0 overflow-hidden bg-[#FAF6EE]">
        
        {/* ======================================================== */}
        {/* COLUMN 1: Conversation Threads Roster (~320px) */}
        {/* ======================================================== */}
        <div className={`${mobileView === "chat" ? "hidden md:flex" : "flex"} w-full md:w-80 lg:w-88 border-r border-[rgba(71,86,87,0.18)] bg-[#FAF6EE] flex-col h-full min-h-0 shrink-0`}>
          
          {/* Search & Channel Tabs */}
          <div className="p-3 border-b border-[rgba(71,86,87,0.14)] space-y-2.5 shrink-0">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#7E939A]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search candidates, phone, course..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-[rgba(71,86,87,0.2)] text-xs text-[#1C2527] focus:outline-none focus:ring-1 focus:ring-[#2E7559] placeholder-[#7E939A]"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 text-[11px] font-bold">
              {[
                { id: "all", label: "All", count: threads.length },
                { id: "whatsapp", label: "WhatsApp", count: threads.filter((t) => t.channel === "whatsapp").length },
                { id: "unread", label: "Unread", count: threads.filter((t) => t.unreadCount > 0).length },
                { id: "drip", label: "In Cadence", count: threads.filter((t) => t.isDripEnrolled).length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setChannelFilter(tab.id)}
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                    channelFilter === tab.id
                      ? "bg-[#0c1316] text-white shadow-xs"
                      : "bg-white text-[#5A6E71] hover:bg-[#F4ECDF] border border-[rgba(71,86,87,0.14)]"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span
                      className={`text-[9.5px] px-1 py-0.2 rounded-full ${
                        channelFilter === tab.id
                          ? "bg-white/20 text-white"
                          : tab.id === "unread"
                          ? "bg-[#25D366]/20 text-[#128C7E] font-bold"
                          : "bg-[rgba(71,86,87,0.1)] text-[#1C2527]"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Threads Scroll List */}
          <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-[rgba(71,86,87,0.1)]">
            {filteredThreads.length === 0 ? (
              <div className="p-8 text-center text-[#5A6E71] text-xs">
                No conversation threads match this filter.
              </div>
            ) : (
              filteredThreads.map((thread) => {
                const isSelected = thread.id === activeThread?.id;
                const initials = thread.candidateName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                const timeAgo = formatTimeAgo(thread.lastMessageAt);

                return (
                  <div
                    key={thread.id}
                    onClick={() => handleSelectThread(thread.id)}
                    className={`p-3 cursor-pointer transition-all flex items-start gap-3 relative ${
                      isSelected
                        ? "bg-white border-l-4 border-l-[#0c1316] shadow-xs"
                        : "hover:bg-white/70"
                    }`}
                  >
                    {/* Candidate Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full bg-[#0c1316] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        {initials}
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#25D366] border-2 border-white" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-[#1C2527] truncate">
                          {thread.candidateName}
                        </h4>
                        <span suppressHydrationWarning className="text-[10px] text-[#7E939A] shrink-0 font-medium">
                          {isMounted ? timeAgo : ""}
                        </span>
                      </div>

                      <p className="text-[10.5px] text-[#4A6D7C] truncate font-medium">
                        {thread.courseName}
                      </p>

                      {/* Last Message Snippet */}
                      <p className="text-[11px] text-[#5A6E71] truncate mt-0.5 leading-snug">
                        {thread.lastMessageSender === "candidate" ? "" : "You: "}
                        {thread.lastMessage}
                      </p>

                      {/* Footer Tags */}
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-[#25D366]/15 text-[#128C7E] flex items-center gap-1">
                          <MessageSquare className="w-2.5 h-2.5 text-[#25D366]" />
                          <span>WhatsApp</span>
                        </span>

                        {thread.tag && (
                          <span className="text-[9.5px] text-[#7E939A] bg-white px-1.5 py-0.2 rounded border border-[rgba(71,86,87,0.12)] truncate max-w-[120px]">
                            {thread.tag}
                          </span>
                        )}

                        {thread.unreadCount > 0 && (
                          <span className="ml-auto text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#25D366] text-white">
                            {thread.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* ======================================================== */}
        {/* COLUMN 2: Center Chat Stream & Multi-Channel Composer */}
        {/* ======================================================== */}
        <div className={`${mobileView === "threads" ? "hidden md:flex" : "flex"} flex-1 flex-col min-h-0 bg-[#F4ECDF] overflow-hidden`}>
          
          {/* Chat Header */}
          {activeThread && (
            <div className="px-3 sm:px-5 py-2.5 sm:py-3 bg-[#FAF6EE] border-b border-[rgba(71,86,87,0.18)] flex items-center justify-between shadow-xs shrink-0 gap-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                {/* Mobile Back to Threads list */}
                <button
                  type="button"
                  onClick={() => setMobileView("threads")}
                  className="md:hidden p-1.5 rounded-xl bg-white hover:bg-[#FAF6EE] text-[#5A6E71] border border-[rgba(71,86,87,0.2)] transition-colors active:scale-95 shrink-0"
                  title="Back to conversations list"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0c1316] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {activeThread.candidateName.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-[#1C2527] truncate">
                      {activeThread.candidateName}
                    </h3>
                    <span className={`${getStatusBadgeClass(activeThread.leadStatus)} text-[9.5px] sm:text-[11px] truncate`}>
                      {formatStatusLabel(activeThread.leadStatus)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[10.5px] sm:text-[11px] text-[#5A6E71] font-mono mt-0.5 truncate">
                    <span>{activeThread.candidatePhone}</span>
                    <button
                      onClick={handleCopyPhone}
                      className="text-[#4A6D7C] hover:text-[#1C2527] transition-colors shrink-0"
                      title="Copy phone"
                    >
                      {copiedPhone ? <Check className="w-3 h-3 text-[#2E7559]" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline text-[#4A6D7C] font-semibold truncate">{activeThread.courseName}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button
                  onClick={handleCall}
                  className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#2E7559] hover:bg-[#256149] text-white text-xs font-bold transition-all shadow-xs"
                  title="Initiate softphone call"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Call</span>
                </button>

                <a
                  href={`https://wa.me/${(() => {
                    const c = (activeThread.candidatePhone || "").replace(/[^0-9]/g, "");
                    return c.length === 10 ? `91${c}` : (c.startsWith("91") && c.length === 12 ? c : `91${c}`);
                  })()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#1ebd5b] text-white text-xs font-bold transition-all shadow-xs"
                  title="Launch WhatsApp Web"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">WhatsApp Web</span>
                  <ExternalLink className="w-3 h-3 hidden md:inline" />
                </a>

                {/* Candidate Intelligence Toggle (Tablet & Mobile) */}
                <button
                  type="button"
                  onClick={() => setShowMobileDossier(true)}
                  className="lg:hidden p-1.5 rounded-xl bg-white hover:bg-[#FAF6EE] text-[#5A6E71] border border-[rgba(71,86,87,0.2)] transition-colors active:scale-95 shrink-0"
                  title="View Candidate Dossier"
                >
                  <ShieldCheck className="w-4 h-4 text-[#2E7559]" />
                </button>

                <Link
                  href={`/leads/${activeThread.id}`}
                  className="p-1.5 rounded-xl bg-white hover:bg-[#FAF6EE] text-[#5A6E71] border border-[rgba(71,86,87,0.2)] transition-colors shrink-0"
                  title="Open full candidate profile"
                >
                  <User className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* Chat Messages Stream */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
            {/* Timestamp Separator */}
            <div className="flex items-center justify-center my-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/80 border border-[rgba(71,86,87,0.14)] text-[#7E939A]">
                Candidate Interaction History
              </span>
            </div>

            {activeMessages.map((msg) => {
              const isMe = msg.sender === "counsellor";
              const isSystem = msg.sender === "system";

              if (isSystem) {
                return (
                  <div key={msg.id} className="flex justify-center my-2">
                    <div className="px-3 py-1.5 rounded-xl bg-[#FAF6EE] border border-[rgba(98,146,158,0.25)] text-center text-[11px] text-[#4A6D7C] max-w-md shadow-xs flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#B07238] shrink-0" />
                      <span>{msg.content}</span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
                >
                  {!isMe && (
                    <div className="w-7 h-7 rounded-full bg-[#0c1316] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mb-1">
                      {activeThread.candidateName.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div
                    className={`max-w-md p-3.5 rounded-2xl shadow-xs text-xs space-y-1 ${
                      isMe
                        ? "bg-[#FAF6EE] text-[#1C2527] border border-[rgba(71,86,87,0.18)] rounded-br-xs"
                        : "bg-white text-[#1C2527] border border-[rgba(71,86,87,0.14)] rounded-bl-xs"
                    }`}
                  >
                    {/* Header info */}
                    <div className="flex items-center justify-between gap-3 text-[10px] text-[#7E939A]">
                      <span className="font-bold text-[#1C2527]">
                        {isMe ? "You" : msg.senderName}
                      </span>
                      <span className="flex items-center gap-1">
                        <span suppressHydrationWarning>
                          {isMounted ? formatMessageTime(msg.timestamp) : ""}
                        </span>
                        {isMe && <CheckCheck className="w-3 h-3 text-[#25D366]" />}
                      </span>
                    </div>

                    {/* Content */}
                    <p className="whitespace-pre-line leading-relaxed text-[#1C2527] text-xs">
                      {msg.content}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick EdTech Macros & Token Pills Strip */}
          <div className="px-4 py-2 bg-[#FAF6EE] border-t border-[rgba(71,86,87,0.14)] space-y-1.5 shrink-0">
            {/* Quick Macro Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7E939A] shrink-0 mr-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#B07238]" />
                <span>Templates:</span>
              </span>
              {QUICK_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => handleApplyMacro(tmpl)}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#F0E6D6] text-[#1C2527] font-semibold text-[11px] border border-[rgba(71,86,87,0.16)] shrink-0 transition-all hover:scale-[1.02] shadow-xs active:scale-95 cursor-pointer"
                >
                  {tmpl.label}
                </button>
              ))}
            </div>

            {/* Dynamic Token Pills */}
            <div className="flex items-center gap-1 text-[10.5px] text-[#5A6E71] overflow-x-auto no-scrollbar">
              <span className="text-[10px] uppercase font-bold text-[#7E939A] shrink-0 mr-1">Insert:</span>
              {[
                { key: "name", label: "+ Candidate Name" },
                { key: "course", label: "+ Target Course" },
                { key: "counsellor", label: "+ Counsellor Name" },
                { key: "phone", label: "+ Phone" },
              ].map((token) => (
                <button
                  key={token.key}
                  type="button"
                  onClick={() => handleInsertToken(token.key)}
                  className="px-2 py-0.5 rounded-md bg-[rgba(71,86,87,0.08)] hover:bg-[rgba(71,86,87,0.15)] text-[#4A6D7C] font-mono text-[10px] shrink-0 transition-colors cursor-pointer"
                >
                  {token.label}
                </button>
              ))}
            </div>
          </div>

          {/* Message Composer */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white border-t border-[rgba(71,86,87,0.18)] space-y-2 shrink-0 shadow-lg"
          >
            {/* Channel Selector & Settings Bar */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 bg-[#FAF6EE] p-1 rounded-xl border border-[rgba(71,86,87,0.14)]">
                {[
                  { id: "whatsapp", label: "WhatsApp", icon: MessageSquare, color: "text-[#25D366]" },
                  { id: "email", label: "Email", icon: Mail, color: "text-[#4A6D7C]" },
                  { id: "sms", label: "SMS", icon: Smartphone, color: "text-[#B07238]" },
                ].map((c) => {
                  const Icon = c.icon;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedChannel(c.id)}
                      className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all text-xs ${
                        selectedChannel === c.id
                          ? "bg-[#0c1316] text-white shadow-xs"
                          : "text-[#5A6E71] hover:text-[#1C2527]"
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${selectedChannel === c.id ? "text-white" : c.color}`} />
                      <span>{c.label}</span>
                    </button>
                  );
                })}
              </div>

              {selectedChannel === "whatsapp" && (
                <label className="flex items-center gap-1.5 text-[11px] text-[#5A6E71] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={openWhatsAppOnSend}
                    onChange={(e) => setOpenWhatsAppOnSend(e.target.checked)}
                    className="rounded border-[rgba(71,86,87,0.3)] text-[#25D366] focus:ring-[#25D366]"
                  />
                  <span>Launch WhatsApp Web on Send</span>
                </label>
              )}
            </div>

            {/* Input & Send Button */}
            <div className="flex items-end gap-2">
              <textarea
                rows={2}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={`Type a ${selectedChannel === "whatsapp" ? "WhatsApp" : selectedChannel.toUpperCase()} message to ${activeThread?.candidateName}... (Press Enter to send)`}
                className="flex-1 p-2.5 rounded-xl bg-[#FAF6EE] border border-[rgba(71,86,87,0.22)] text-xs text-[#1C2527] focus:outline-none focus:ring-2 focus:ring-[#2E7559] focus:bg-white resize-none transition-all placeholder-[#7E939A]"
              />

              <button
                type="submit"
                disabled={isSending || !messageInput.trim()}
                className="px-5 py-3 rounded-xl bg-[#2E7559] hover:bg-[#256149] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
          </form>

        </div>

        {/* ======================================================== */}
        {/* COLUMN 3: Candidate Intelligence Dossier (~300px) */}
        {/* ======================================================== */}
        {activeThread && (
          <div className="hidden lg:flex w-80 border-l border-[rgba(71,86,87,0.18)] bg-[#FAF6EE] flex-col h-full min-h-0 overflow-y-auto p-4 space-y-4 shrink-0">
            {renderCandidateDossier()}
          </div>
        )}

      </div>

      {/* Mobile & Tablet Candidate Intelligence Slide-over Modal */}
      {showMobileDossier && activeThread && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setShowMobileDossier(false)}
          />
          <div className="relative z-10 w-full max-w-sm bg-[#FAF6EE] border-l border-[rgba(71,86,87,0.2)] h-full overflow-y-auto p-4 space-y-4 shadow-2xl animate-in slide-in-from-right duration-200 flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-[rgba(71,86,87,0.14)]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2E7559]" />
                <h3 className="text-xs font-bold text-[#1C2527]">Candidate Intelligence</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMobileDossier(false)}
                className="p-1 rounded-lg text-[#7E939A] hover:text-[#1C2527] bg-white border border-[rgba(71,86,87,0.18)] active:scale-95 transition-all"
                title="Close Dossier"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {renderCandidateDossier()}
          </div>
        </div>
      )}

    </div>
  );
}

function formatMessageTime(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return "";
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

function formatTimeAgo(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "";
  const diffMs = Math.max(0, Date.now() - date.getTime());
  const diffMins = Math.round(diffMs / (1000 * 60));
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
}
