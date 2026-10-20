"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Banknote,
  Search,
  Download,
  RefreshCw,
  Phone,
  MessageSquare,
  Receipt,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  CreditCard,
  Building,
  User,
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
  Filter,
} from "lucide-react";
import { useTelephony } from "@/context/TelephonyContext";
import { useAuth } from "@/context/AuthContext";
import { crmApi } from "@/lib/api";
import { CollectInstallmentModal } from "@/components/installments/CollectInstallmentModal";
import { SendInstallmentReminderModal } from "@/components/installments/SendInstallmentReminderModal";
import { InstallmentReceiptModal } from "@/components/installments/InstallmentReceiptModal";

const INITIAL_FALLBACK_INSTALLMENTS = [
  {
    id: "inst-101",
    studentId: "SKY-2026-6623",
    studentName: "Aarav Sharma",
    studentPhone: "+91 98765 43210",
    studentEmail: "aarav.sharma@example.com",
    courseName: "Full Stack Web Development (MERN)",
    cohortName: "Weekend Live Cohort (Sat-Sun 10 AM - 2 PM)",
    counselorName: "Priya Patel",
    installmentNo: 2,
    totalInstallments: 2,
    installmentTitle: "Milestone 2 of 2 (Mid-Term Completion)",
    amountDue: 20135,
    amountPaid: 0,
    totalCourseFee: 45135,
    priorPaid: 25000,
    dueDate: new Date(Date.now() + 14 * 3600000 * 24).toISOString().split("T")[0],
    status: "due_soon",
    paymentSchedule: "installment",
    paymentMode: null,
    receiptNo: null,
    transactionRef: null,
    paidAt: null,
  },
  {
    id: "inst-102",
    studentId: "SKY-2026-7731",
    studentName: "Sneha Mukherjee",
    studentPhone: "+91 99345 67890",
    studentEmail: "sneha.m@example.com",
    courseName: "Data Science & Applied AI Accelerator",
    cohortName: "Weekday Evening Cohort (Mon-Thu 7 PM - 9 PM)",
    counselorName: "Amit Kumar",
    installmentNo: 2,
    totalInstallments: 10,
    installmentTitle: "Monthly 0% EMI (Month 2 of 10)",
    amountDue: 5192,
    amountPaid: 0,
    totalCourseFee: 51920,
    priorPaid: 5192,
    dueDate: new Date(Date.now() - 4 * 3600000 * 24).toISOString().split("T")[0],
    status: "overdue",
    paymentSchedule: "emi",
    paymentMode: null,
    receiptNo: null,
    transactionRef: null,
    paidAt: null,
  },
  {
    id: "inst-103",
    studentId: "SKY-2026-7731",
    studentName: "Sneha Mukherjee",
    studentPhone: "+91 99345 67890",
    studentEmail: "sneha.m@example.com",
    courseName: "Data Science & Applied AI Accelerator",
    cohortName: "Weekday Evening Cohort (Mon-Thu 7 PM - 9 PM)",
    counselorName: "Amit Kumar",
    installmentNo: 3,
    totalInstallments: 10,
    installmentTitle: "Monthly 0% EMI (Month 3 of 10)",
    amountDue: 5192,
    amountPaid: 0,
    totalCourseFee: 51920,
    priorPaid: 5192,
    dueDate: new Date(Date.now() + 26 * 3600000 * 24).toISOString().split("T")[0],
    status: "upcoming",
    paymentSchedule: "emi",
    paymentMode: null,
    receiptNo: null,
    transactionRef: null,
    paidAt: null,
  },
  {
    id: "inst-104",
    studentId: "SKY-2026-5519",
    studentName: "Rohan Varma",
    studentPhone: "+91 97123 45678",
    studentEmail: "rohan.v@example.com",
    courseName: "Product Design (UI/UX) Mastery",
    cohortName: "Fast-Track Intensive (Mon-Fri 10 AM - 1 PM)",
    counselorName: "Vikram Malhotra",
    installmentNo: 2,
    totalInstallments: 2,
    installmentTitle: "Final Settlement (Portfolio Phase)",
    amountDue: 18000,
    amountPaid: 0,
    totalCourseFee: 38000,
    priorPaid: 20000,
    dueDate: new Date(Date.now() - 9 * 3600000 * 24).toISOString().split("T")[0],
    status: "overdue",
    paymentSchedule: "installment",
    paymentMode: null,
    receiptNo: null,
    transactionRef: null,
    paidAt: null,
  },
  {
    id: "inst-105",
    studentId: "SKY-2026-8812",
    studentName: "Kabir Mehta",
    studentPhone: "+91 98456 78901",
    studentEmail: "kabir.m@example.com",
    courseName: "Full Stack Web Development (MERN)",
    cohortName: "Weekend Live Cohort (Sat-Sun 10 AM - 2 PM)",
    counselorName: "Priya Patel",
    installmentNo: 1,
    totalInstallments: 1,
    installmentTitle: "Full Tuition Clearance",
    amountDue: 45135,
    amountPaid: 45135,
    totalCourseFee: 45135,
    priorPaid: 0,
    dueDate: new Date(Date.now() - 2 * 3600000 * 24).toISOString().split("T")[0],
    status: "paid",
    paymentSchedule: "full",
    paymentMode: "upi",
    receiptNo: "REC-2026-90412",
    transactionRef: "UPI-48192019284",
    paidAt: new Date(Date.now() - 2 * 3600000 * 24).toISOString(),
  },
];

export default function InstallmentsPage() {
  const { startCall } = useTelephony();
  const { user: currentUser } = useAuth();

  const [installments, setInstallments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // all, overdue, due_soon, upcoming, paid
  const [scheduleFilter, setScheduleFilter] = useState("all"); // all, installment, emi
  const [courseFilter, setCourseFilter] = useState("all");
  const [toastMessage, setToastMessage] = useState(null);

  // Modals
  const [collectModalOpen, setCollectModalOpen] = useState(false);
  const [selectedForCollect, setSelectedForCollect] = useState(null);

  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [selectedForReminder, setSelectedForReminder] = useState(null);

  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [receiptModalData, setReceiptModalData] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchInstallments = async () => {
    setLoading(true);
    let loaded = [];

    try {
      const res = await crmApi.getInstallments();
      if (res && res.data && res.data.installments) {
        loaded = res.data.installments;
      }
    } catch (err) {
      console.warn("Backend API offline, falling back to local storage and presets");
    }

    if (loaded.length === 0) {
      loaded = [...INITIAL_FALLBACK_INSTALLMENTS];
    }

    // Merge with any custom offline updates stored in localStorage
    if (typeof window !== "undefined") {
      try {
        const custom = JSON.parse(localStorage.getItem("skillyards_custom_installments") || "[]");
        if (custom.length > 0) {
          const customIds = new Set(custom.map((c) => c.id));
          const filtered = loaded.filter((l) => !customIds.has(l.id));
          loaded = [...custom, ...filtered];
        }
      } catch (_) {}
    }

    // Dynamic aging calculation
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const calculated = loaded.map((inst) => {
      if (inst.status === "paid") {
        return { ...inst, daysOverdue: 0, daysRemaining: 0 };
      }

      const due = new Date(inst.dueDate);
      due.setHours(0, 0, 0, 0);
      const diffMs = due.getTime() - now.getTime();
      const diffDays = Math.round(diffMs / (1000 * 3600 * 24));

      let status = inst.status;
      let daysOverdue = 0;
      let daysRemaining = 0;

      if (diffDays < 0) {
        status = "overdue";
        daysOverdue = Math.abs(diffDays);
      } else if (diffDays <= 7) {
        status = "due_soon";
        daysRemaining = diffDays;
      } else {
        status = "upcoming";
        daysRemaining = diffDays;
      }

      return {
        ...inst,
        status,
        daysOverdue,
        daysRemaining,
      };
    });

    setInstallments(calculated);
    setLoading(false);
  };

  useEffect(() => {
    fetchInstallments();
  }, []);

  // Compute KPIs
  const kpis = useMemo(() => {
    const totalReceivables = installments
      .filter((i) => i.status !== "paid")
      .reduce((sum, i) => sum + (Number(i.amountDue) || 0) - (Number(i.amountPaid) || 0), 0);

    const overdueList = installments.filter((i) => i.status === "overdue");
    const overdueAmount = overdueList.reduce(
      (sum, i) => sum + (Number(i.amountDue) || 0) - (Number(i.amountPaid) || 0),
      0
    );

    const paidList = installments.filter((i) => i.status === "paid");
    const collectedThisMonth = paidList.reduce(
      (sum, i) => sum + (Number(i.amountPaid || i.amountDue) || 0),
      0
    );

    const totalCount = installments.length;
    const onTimeRate = totalCount > 0 ? Math.round((paidList.length / totalCount) * 100) : 85;

    return {
      totalReceivables,
      overdueAmount,
      overdueCount: overdueList.length,
      collectedThisMonth,
      paidCount: paidList.length,
      onTimeRate,
      dueSoonCount: installments.filter((i) => i.status === "due_soon").length,
    };
  }, [installments]);

  // Tab & Search Filtering
  const filteredInstallments = useMemo(() => {
    return installments.filter((inst) => {
      // Tab filter
      if (activeTab === "overdue" && inst.status !== "overdue") return false;
      if (activeTab === "due_soon" && inst.status !== "due_soon") return false;
      if (activeTab === "upcoming" && inst.status !== "upcoming") return false;
      if (activeTab === "paid" && inst.status !== "paid") return false;

      // Schedule filter
      if (scheduleFilter !== "all" && inst.paymentSchedule !== scheduleFilter) return false;

      // Course filter
      if (courseFilter !== "all" && inst.courseName !== courseFilter) return false;

      // Search term
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesName = inst.studentName?.toLowerCase().includes(query);
        const matchesId = inst.studentId?.toLowerCase().includes(query);
        const matchesPhone = inst.studentPhone?.toLowerCase().includes(query);
        const matchesCourse = inst.courseName?.toLowerCase().includes(query);
        const matchesRef = inst.transactionRef?.toLowerCase().includes(query);
        const matchesReceipt = inst.receiptNo?.toLowerCase().includes(query);
        if (!matchesName && !matchesId && !matchesPhone && !matchesCourse && !matchesRef && !matchesReceipt) {
          return false;
        }
      }

      return true;
    });
  }, [installments, activeTab, scheduleFilter, courseFilter, searchTerm]);

  // Available unique courses
  const uniqueCourses = useMemo(() => {
    return Array.from(new Set(installments.map((i) => i.courseName).filter(Boolean)));
  }, [installments]);

  // CSV Export
  const handleExportCSV = () => {
    if (filteredInstallments.length === 0) {
      alert("No installment records available to export.");
      return;
    }

    const headers = [
      "Student ID",
      "Candidate Name",
      "Phone",
      "Email",
      "Course Program",
      "Cohort Batch",
      "Installment Milestone",
      "Amount Due (INR)",
      "Amount Paid (INR)",
      "Due Date",
      "Status",
      "Payment Mode",
      "Receipt No",
      "Bank UTR / Ref",
      "Counsellor",
    ];

    const rows = filteredInstallments.map((i) => [
      `"${i.studentId}"`,
      `"${i.studentName}"`,
      `"${i.studentPhone}"`,
      `"${i.studentEmail || ""}"`,
      `"${i.courseName}"`,
      `"${i.cohortName}"`,
      `"${i.installmentTitle}"`,
      i.amountDue,
      i.amountPaid || 0,
      `"${i.dueDate}"`,
      `"${i.status}"`,
      `"${i.paymentMode || "N/A"}"`,
      `"${i.receiptNo || "N/A"}"`,
      `"${i.transactionRef || "N/A"}"`,
      `"${i.counselorName || "N/A"}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `skillyards-installment-ledger-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Downloaded installments ledger CSV");
  };

  // Actions
  const handleCollect = (inst) => {
    setSelectedForCollect(inst);
    setCollectModalOpen(true);
  };

  const handleReminder = (inst) => {
    setSelectedForReminder(inst);
    setReminderModalOpen(true);
  };

  const handleViewReceipt = (inst) => {
    setReceiptModalData({
      receiptNo: inst.receiptNo || `REC-INST-${inst.studentId}`,
      studentId: inst.studentId,
      studentName: inst.studentName,
      studentPhone: inst.studentPhone,
      studentEmail: inst.studentEmail,
      courseName: inst.courseName,
      cohortName: inst.cohortName,
      installmentTitle: inst.installmentTitle,
      amountPaid: inst.amountPaid || inst.amountDue,
      totalCourseFee: inst.totalCourseFee || inst.amountDue,
      priorPaid: inst.priorPaid || 0,
      paymentMode: inst.paymentMode || "upi",
      transactionRef: inst.transactionRef || "Bank UTR",
      paidAt: inst.paidAt || inst.dueDate,
      counselorName: inst.counselorName || "Accounts Desk",
      collectionNotes: inst.collectionNotes || "",
    });
    setReceiptModalOpen(true);
  };

  const handleDirectCall = (inst) => {
    startCall(inst.studentPhone, {
      name: inst.studentName,
      id: inst.id,
      course: inst.courseName,
    });
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-[#1C2527] tracking-tight">
              Fee Installment & EMI Desk
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#2E7559]/15 border border-[#2E7559]/30 text-[#2E7559] text-[11px] font-bold uppercase tracking-wider">
              Receivables Ledger
            </span>
          </div>
          <p className="text-xs text-[#5A6E71] mt-1 font-medium">
            Monitor upcoming tuition milestones, dispatch automated 1-click WhatsApp payment reminders, and issue digital fee vouchers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchInstallments}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-[#FAF6EE] text-[#1C2527] border border-[rgba(71,86,87,0.2)] text-xs font-semibold transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#5A6E71] ${loading ? "animate-spin" : ""}`} />
            <span>Sync</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#FAF6EE] text-[#1C2527] border border-[rgba(71,86,87,0.2)] text-xs font-semibold transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#4A6D7C]" />
            <span>Export CSV</span>
          </button>

          <Link
            href="/admissions"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0c1316] hover:bg-[#152024] text-white text-xs font-bold transition-all shadow-sm"
          >
            <span>Admissions Desk</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#7E939A]" />
          </Link>
        </div>
      </div>

      {/* 4 Executive KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Total Receivables */}
        <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] shadow-xs">
          <div className="flex items-center justify-between text-[#5A6E71] text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Total Receivables</span>
            <div className="w-7 h-7 rounded-lg bg-[#4A6D7C]/15 flex items-center justify-center text-[#4A6D7C]">
              <Banknote className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-black text-[#1C2527] font-mono tracking-tight">
            ₹{kpis.totalReceivables.toLocaleString("en-IN")}
          </div>
          <p className="text-[11px] text-[#5A6E71] mt-1">Pending learner dues across batches</p>
        </div>

        {/* Overdue At Risk */}
        <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-[rgba(239,68,68,0.25)] shadow-xs relative overflow-hidden">
          {kpis.overdueCount > 0 && (
            <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-600 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span>{kpis.overdueCount} Alerts</span>
            </div>
          )}
          <div className="flex items-center justify-between text-[#5A6E71] text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-red-600">Overdue at Risk</span>
            <div className="w-7 h-7 rounded-lg bg-red-500/15 flex items-center justify-center text-red-600">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-black text-red-600 font-mono tracking-tight">
            ₹{kpis.overdueAmount.toLocaleString("en-IN")}
          </div>
          <p className="text-[11px] text-[#5A6E71] mt-1">{kpis.overdueCount} student installments past due date</p>
        </div>

        {/* Collected This Month */}
        <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-[rgba(46,117,89,0.25)] shadow-xs">
          <div className="flex items-center justify-between text-[#5A6E71] text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-[#2E7559]">Collected This Month</span>
            <div className="w-7 h-7 rounded-lg bg-[#2E7559]/15 flex items-center justify-center text-[#2E7559]">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-black text-[#2E7559] font-mono tracking-tight">
            ₹{kpis.collectedThisMonth.toLocaleString("en-IN")}
          </div>
          <p className="text-[11px] text-[#5A6E71] mt-1">{kpis.paidCount} cleared installments & EMI debits</p>
        </div>

        {/* On-Time Settlement Rate */}
        <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] shadow-xs">
          <div className="flex items-center justify-between text-[#5A6E71] text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">On-Time Rate</span>
            <div className="w-7 h-7 rounded-lg bg-[#B07238]/15 flex items-center justify-center text-[#B07238]">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-black text-[#1C2527] font-mono tracking-tight">
            {kpis.onTimeRate}%
          </div>
          <p className="text-[11px] text-[#5A6E71] mt-1">Payment punctuality benchmark</p>
        </div>

      </div>

      {/* Urgent Overdue Alert Banner if overdue > 0 */}
      {kpis.overdueCount > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FAF6EE] via-[#FCEAE6] to-[#FAF6EE] border border-red-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600/10 border border-red-300 flex items-center justify-center text-red-600 shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#1C2527] flex items-center gap-2">
                <span>{kpis.overdueCount} Tuition Installments Require Immediate Accounts Follow-up</span>
                <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold">Action Needed</span>
              </h3>
              <p className="text-[11px] text-[#5A6E71] mt-0.5">
                Total ₹{kpis.overdueAmount.toLocaleString("en-IN")} overdue. Dispatch 1-click WhatsApp alerts with UPI deep links to recover pending tuition before batch suspension.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab("overdue")}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shrink-0 shadow-sm"
          >
            Filter Overdue Accounts ({kpis.overdueCount})
          </button>
        </div>
      )}

      {/* Filter Tabs & Search Deck */}
      <div className="bg-[#FAF6EE] p-4 rounded-2xl border border-[rgba(71,86,87,0.18)] space-y-4 shadow-xs">
        
        {/* Top Tab Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(71,86,87,0.14)] pb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {[
              { id: "all", label: "All Milestones", count: installments.length },
              { id: "overdue", label: "Overdue Alerts", count: kpis.overdueCount, badgeColor: "bg-red-500 text-white" },
              { id: "due_soon", label: "Due This Week", count: kpis.dueSoonCount, badgeColor: "bg-[#B07238] text-white" },
              { id: "upcoming", label: "Upcoming 30 Days", count: installments.filter((i) => i.status === "upcoming").length },
              { id: "paid", label: "Settled / Paid", count: kpis.paidCount, badgeColor: "bg-[#2E7559] text-white" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  activeTab === tab.id
                    ? "bg-[#0c1316] text-white shadow-xs"
                    : "bg-white/80 hover:bg-white text-[#5A6E71] border border-[rgba(71,86,87,0.14)]"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      tab.badgeColor || (activeTab === tab.id ? "bg-white/20 text-white" : "bg-[rgba(71,86,87,0.1)] text-[#1C2527]")
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-[#5A6E71] font-medium">
            Showing <strong className="text-[#1C2527]">{filteredInstallments.length}</strong> of {installments.length} installments
          </div>
        </div>

        {/* Search & Filter Dropdowns */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7E939A]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name, phone, student ID (SKY-2026-...), program, or receipt..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-[rgba(71,86,87,0.2)] text-xs text-[#1C2527] focus:outline-none focus:ring-1 focus:ring-[#2E7559] placeholder-[#7E939A]"
            />
          </div>

          {/* Schedule Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={scheduleFilter}
              onChange={(e) => setScheduleFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-[rgba(71,86,87,0.2)] text-xs text-[#1C2527] focus:outline-none focus:ring-1 focus:ring-[#2E7559]"
            >
              <option value="all">All Plan Schedules</option>
              <option value="installment">2-Part Milestone Plans</option>
              <option value="emi">0% EMI Monthly Debits</option>
              <option value="full">100% Upfront Clearance</option>
            </select>

            {/* Course Filter */}
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-[rgba(71,86,87,0.2)] text-xs text-[#1C2527] focus:outline-none focus:ring-1 focus:ring-[#2E7559]"
            >
              <option value="all">All Programs</option>
              {uniqueCourses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

        </div>

      </div>

      {/* Main Ledger Table */}
      <div className="bg-[#FAF6EE] rounded-2xl border border-[rgba(71,86,87,0.18)] overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-[#5A6E71] text-xs space-y-2">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#4A6D7C]" />
            <p>Synchronizing fee installments ledger...</p>
          </div>
        ) : filteredInstallments.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[rgba(71,86,87,0.16)] flex items-center justify-center text-[#2E7559] mx-auto shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#1C2527]">No Installment Accounts Match Filter</h3>
            <p className="text-xs text-[#5A6E71] max-w-sm mx-auto">
              There are no pending dues in this category. All learners are either up to date or matching filters are cleared.
            </p>
            <button
              onClick={() => {
                setActiveTab("all");
                setSearchTerm("");
                setScheduleFilter("all");
                setCourseFilter("all");
              }}
              className="px-4 py-2 rounded-xl bg-white text-[#1C2527] border border-[rgba(71,86,87,0.2)] text-xs font-semibold hover:bg-[#FAF6EE] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF6EE] border-b border-[rgba(71,86,87,0.16)] text-[#5A6E71] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Student Particulars</th>
                  <th className="py-3 px-4 font-semibold">Program & Cohort</th>
                  <th className="py-3 px-4 font-semibold">Milestone / Plan</th>
                  <th className="py-3 px-4 font-semibold text-right">Amount Due</th>
                  <th className="py-3 px-4 font-semibold">Due Date & Aging</th>
                  <th className="py-3 px-4 font-semibold text-center">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(71,86,87,0.1)] text-[#1C2527]">
                {filteredInstallments.map((inst) => {
                  const isPaid = inst.status === "paid";
                  const isOverdue = inst.status === "overdue";
                  const isDueSoon = inst.status === "due_soon";
                  const initials = (inst.studentName || "C")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  const netDue = Math.max(
                    0,
                    (Number(inst.amountDue) || 0) - (Number(inst.amountPaid) || 0)
                  );

                  return (
                    <tr
                      key={inst.id}
                      className={`hover:bg-white/60 transition-colors ${
                        isOverdue ? "bg-red-50/40" : ""
                      }`}
                    >
                      {/* Student Particulars */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#0c1316] text-white flex items-center justify-center font-bold text-[11px] shrink-0 shadow-xs">
                            {initials}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-[#1C2527] hover:underline cursor-pointer">
                              {inst.studentName}
                            </p>
                            <div className="flex items-center gap-2 text-[11px] text-[#5A6E71] mt-0.5">
                              <span className="font-mono text-[#4A6D7C] font-semibold">{inst.studentId}</span>
                              <span>•</span>
                              <span>{inst.studentPhone}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Course & Cohort */}
                      <td className="py-3 px-4">
                        <p className="font-semibold text-xs text-[#1C2527] max-w-xs truncate">
                          {inst.courseName}
                        </p>
                        <p className="text-[11px] text-[#5A6E71] truncate max-w-xs">
                          {inst.cohortName}
                        </p>
                      </td>

                      {/* Milestone / Plan */}
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-lg bg-white border border-[rgba(71,86,87,0.16)] text-[#1C2527] font-semibold text-[11px]">
                          {inst.installmentTitle}
                        </span>
                        <p className="text-[10.5px] text-[#7E939A] mt-1 capitalize">
                          {inst.paymentSchedule === "emi"
                            ? "0% EMI Loan (10-Mo)"
                            : inst.paymentSchedule === "installment"
                            ? "2-Part Milestone"
                            : "Upfront"}
                        </p>
                      </td>

                      {/* Amount Due */}
                      <td className="py-3 px-4 text-right">
                        <p className="font-black text-sm font-mono text-[#1C2527]">
                          ₹{netDue.toLocaleString("en-IN")}
                        </p>
                        <p className="text-[10.5px] text-[#7E939A]">
                          Fee: ₹{Number(inst.totalCourseFee || inst.amountDue).toLocaleString("en-IN")}
                        </p>
                      </td>

                      {/* Due Date & Aging */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-xs text-[#1C2527]">
                            {new Date(inst.dueDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                          {isPaid ? (
                            <span className="text-[10px] text-[#2E7559] font-bold">
                              Cleared on {new Date(inst.paidAt || inst.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            </span>
                          ) : isOverdue ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-100/70 px-1.5 py-0.2 rounded">
                              <AlertTriangle className="w-2.5 h-2.5" />
                              <span>{inst.daysOverdue} Days Overdue</span>
                            </span>
                          ) : isDueSoon ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#B07238] bg-[#B07238]/10 px-1.5 py-0.2 rounded">
                              <Clock className="w-2.5 h-2.5" />
                              <span>Due in {inst.daysRemaining} Days</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#5A6E71]">
                              In {inst.daysRemaining} Days
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-4 text-center">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#2E7559]/15 border border-[#2E7559]/30 text-[#2E7559] text-[10.5px] font-bold">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Paid</span>
                          </span>
                        ) : isOverdue ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-600 text-[10.5px] font-bold">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Overdue</span>
                          </span>
                        ) : isDueSoon ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#B07238]/15 border border-[#B07238]/30 text-[#B07238] text-[10.5px] font-bold">
                            <Clock className="w-3 h-3" />
                            <span>Due Soon</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10.5px] font-semibold">
                            <span>Upcoming</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Direct Softphone Call */}
                          <button
                            onClick={() => handleDirectCall(inst)}
                            title="Call candidate via softphone"
                            className="w-7 h-7 rounded-lg bg-white hover:bg-[#FAF6EE] border border-[rgba(71,86,87,0.2)] flex items-center justify-center text-[#5A6E71] hover:text-[#1C2527] transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </button>

                          {/* WhatsApp Reminder (for unpaid) */}
                          {!isPaid && (
                            <button
                              onClick={() => handleReminder(inst)}
                              title="Send WhatsApp Payment Reminder"
                              className="w-7 h-7 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 flex items-center justify-center text-[#25D366] transition-colors"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Collect Fee Button (for unpaid) */}
                          {!isPaid ? (
                            <button
                              onClick={() => handleCollect(inst)}
                              className="px-3 py-1.5 rounded-xl bg-[#2E7559] hover:bg-[#256149] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                            >
                              <Receipt className="w-3.5 h-3.5" />
                              <span>Collect</span>
                            </button>
                          ) : (
                            /* View Receipt Button (for paid) */
                            <button
                              onClick={() => handleViewReceipt(inst)}
                              className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF6EE] text-[#1C2527] border border-[rgba(71,86,87,0.2)] text-xs font-semibold transition-all flex items-center gap-1 shadow-xs"
                            >
                              <Receipt className="w-3.5 h-3.5 text-[#2E7559]" />
                              <span>Receipt</span>
                            </button>
                          )}
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

      {/* Modals */}
      <CollectInstallmentModal
        isOpen={collectModalOpen}
        onClose={() => {
          setCollectModalOpen(false);
          setSelectedForCollect(null);
        }}
        installment={selectedForCollect}
        onCollected={(updated, receipt) => {
          showToast(`Collected ₹${(receipt.amount || 0).toLocaleString("en-IN")}. Receipt: ${receipt.receiptNo}`);
          fetchInstallments();
          setReceiptModalData(receipt);
          setReceiptModalOpen(true);
        }}
      />

      <SendInstallmentReminderModal
        isOpen={reminderModalOpen}
        onClose={() => {
          setReminderModalOpen(false);
          setSelectedForReminder(null);
        }}
        installment={selectedForReminder}
        onDispatched={(instId, channel) => {
          showToast(`Dispatched payment reminder via ${channel === "whatsapp" ? "WhatsApp" : channel.toUpperCase()}`);
        }}
      />

      <InstallmentReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => {
          setReceiptModalOpen(false);
          setReceiptModalData(null);
        }}
        data={receiptModalData}
      />

    </div>
  );
}
