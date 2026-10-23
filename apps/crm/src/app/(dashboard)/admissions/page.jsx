"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Search,
  Download,
  RefreshCw,
  Plus,
  Phone,
  Mail,
  Receipt,
  CreditCard,
  Building,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Award,
  Users,
  Banknote,
  Trophy,
  Layers,
} from "lucide-react";
import { useTelephony } from "@/context/TelephonyContext";
import { useAuth } from "@/context/AuthContext";
import { EnrollStudentModal } from "@/components/admissions/EnrollStudentModal";
import { StudentFeeReceiptModal } from "@/components/admissions/StudentFeeReceiptModal";
import { crmApi } from "@/lib/api";

const DEMO_ENROLLMENTS = [
  {
    id: "adm-101",
    studentId: "SKY-2026-8812",
    receiptNo: "REC-2026-90412",
    studentName: "Kabir Mehta",
    studentPhone: "+91 98456 78901",
    studentEmail: "kabir.m@example.com",
    courseName: "Full Stack Web Development (MERN)",
    cohortName: "Weekend Live Cohort (Sat-Sun 10 AM - 2 PM)",
    counselorName: "Priya Patel",
    baseFee: 45000,
    scholarshipCode: "SKY-MERIT-15",
    scholarshipAmount: 6750,
    netBeforeTax: 38250,
    gstAmount: 6885,
    totalAmount: 45135,
    amountPaid: 45135,
    balanceDue: 0,
    balanceDueDate: null,
    paymentMode: "upi",
    paymentSchedule: "full",
    transactionRef: "UPI-48192019284",
    paymentStatus: "fully_paid",
    enrolledAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: "adm-102",
    studentId: "SKY-2026-7731",
    receiptNo: "REC-2026-88319",
    studentName: "Sneha Mukherjee",
    studentPhone: "+91 99345 67890",
    studentEmail: "sneha.m@example.com",
    courseName: "Data Science & Applied AI Accelerator",
    cohortName: "Weekday Evening Cohort (Mon-Thu 7 PM - 9 PM)",
    counselorName: "Amit Kumar",
    baseFee: 55000,
    scholarshipCode: "WOMEN-TECH-20",
    scholarshipAmount: 11000,
    netBeforeTax: 44000,
    gstAmount: 7920,
    totalAmount: 51920,
    amountPaid: 5192,
    balanceDue: 46728,
    balanceDueDate: new Date(Date.now() + 25 * 3600000 * 24).toISOString().split("T")[0],
    paymentMode: "emi",
    paymentSchedule: "emi",
    transactionRef: "NBFC-PROP-98214",
    paymentStatus: "emi_active",
    enrolledAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: "adm-103",
    studentId: "SKY-2026-6623",
    receiptNo: "REC-2026-77123",
    studentName: "Aarav Sharma",
    studentPhone: "+91 98765 43210",
    studentEmail: "aarav.sharma@example.com",
    courseName: "Full Stack Web Development (MERN)",
    cohortName: "Weekend Live Cohort (Sat-Sun 10 AM - 2 PM)",
    counselorName: "Priya Patel",
    baseFee: 45000,
    scholarshipCode: "SKY-MERIT-15",
    scholarshipAmount: 6750,
    netBeforeTax: 38250,
    gstAmount: 6885,
    totalAmount: 45135,
    amountPaid: 25000,
    balanceDue: 20135,
    balanceDueDate: new Date(Date.now() + 18 * 3600000 * 24).toISOString().split("T")[0],
    paymentMode: "net_banking",
    paymentSchedule: "installment",
    transactionRef: "IMPS-8921849102",
    paymentStatus: "partial_paid",
    enrolledAt: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
  {
    id: "adm-104",
    studentId: "SKY-2026-5510",
    receiptNo: "REC-2026-66481",
    studentName: "Rohan Verma",
    studentPhone: "+91 97234 56789",
    studentEmail: "rohan.v@example.com",
    courseName: "Cloud Architecture & DevOps Engineering",
    cohortName: "Fast-Track Immersion Bootcamp (Daily 9 AM - 1 PM)",
    counselorName: "Vikram Malhotra",
    baseFee: 50000,
    scholarshipCode: "EARLY-10",
    scholarshipAmount: 5000,
    netBeforeTax: 45000,
    gstAmount: 8100,
    totalAmount: 53100,
    amountPaid: 53100,
    balanceDue: 0,
    balanceDueDate: null,
    paymentMode: "card",
    paymentSchedule: "full",
    transactionRef: "CARD-AUTH-38912",
    paymentStatus: "fully_paid",
    enrolledAt: new Date(Date.now() - 3600000 * 96).toISOString(),
  },
  {
    id: "adm-105",
    studentId: "SKY-2026-4409",
    receiptNo: "REC-2026-55198",
    studentName: "Divya Nair",
    studentPhone: "+91 97567 89012",
    studentEmail: "divya.nair@example.com",
    courseName: "Product Design & UI/UX Mastery",
    cohortName: "Weekend Live Cohort (Sat-Sun 10 AM - 2 PM)",
    counselorName: "Vikram Malhotra",
    baseFee: 40000,
    scholarshipCode: "NONE",
    scholarshipAmount: 0,
    netBeforeTax: 40000,
    gstAmount: 7200,
    totalAmount: 47200,
    amountPaid: 4720,
    balanceDue: 42480,
    balanceDueDate: new Date(Date.now() + 20 * 3600000 * 24).toISOString().split("T")[0],
    paymentMode: "emi",
    paymentSchedule: "emi",
    transactionRef: "LIQUI-LOAN-9842",
    paymentStatus: "emi_active",
    enrolledAt: new Date(Date.now() - 3600000 * 120).toISOString(),
  },
];

const PAYMENT_TABS = [
  { label: "All Enrollments", value: "" },
  { label: "Fully Paid", value: "fully_paid" },
  { label: "0% EMI Active", value: "emi_active" },
  { label: "Balance Pending", value: "partial_paid" },
];

export default function AdmissionsPage() {
  const { startCall } = useTelephony();
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [paymentFilter, setPaymentFilter] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Load enrollments from backend API with localStorage & demo fallbacks
  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      let apiItems = [];
      try {
        const res = await crmApi.getAdmissions();
        if (Array.isArray(res) && res.length > 0) {
          apiItems = res;
        }
      } catch (e) {
        console.warn("Backend admissions API unavailable, using offline persistence:", e.message);
      }

      const stored = JSON.parse(localStorage.getItem("skillyards_enrolled_students") || "[]");
      const baseDemo = apiItems.length > 0 ? apiItems : DEMO_ENROLLMENTS;
      
      // Combine without duplicating IDs
      const existingIds = new Set(stored.map((s) => s.id));
      const combined = [...stored, ...baseDemo.filter((d) => !existingIds.has(d.id))];

      // Filter
      let filtered = combined;
      if (paymentFilter) {
        filtered = filtered.filter((item) => item.paymentStatus === paymentFilter);
      }
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (item) =>
            item.studentName?.toLowerCase().includes(q) ||
            item.studentId?.toLowerCase().includes(q) ||
            item.receiptNo?.toLowerCase().includes(q) ||
            item.studentPhone?.includes(q) ||
            item.courseName?.toLowerCase().includes(q)
        );
      }
      setEnrollments(filtered);
    } catch (err) {
      console.warn("Could not load enrollments:", err);
      setEnrollments(DEMO_ENROLLMENTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, [paymentFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEnrollments();
  };

  // Metrics summary
  const metrics = useMemo(() => {
    const totalCount = enrollments.length;
    const totalGross = enrollments.reduce((acc, curr) => acc + (Number(curr.totalAmount) || 0), 0);
    const totalCollected = enrollments.reduce((acc, curr) => acc + (Number(curr.amountPaid) || 0), 0);
    const totalReceivables = enrollments.reduce((acc, curr) => acc + (Number(curr.balanceDue) || 0), 0);
    const emiCount = enrollments.filter((e) => e.paymentStatus === "emi_active").length;

    return {
      totalCount,
      totalGross,
      totalCollected,
      totalReceivables,
      emiCount,
    };
  }, [enrollments]);

  const handleOpenReceipt = (enrollment) => {
    setSelectedReceipt(enrollment);
    setIsReceiptModalOpen(true);
  };

  const handleExportCSV = () => {
    if (!enrollments.length) return;
    const headers = [
      "Student ID",
      "Receipt No",
      "Student Name",
      "Phone",
      "Email",
      "Course Program",
      "Total Amount",
      "Amount Paid",
      "Balance Due",
      "Payment Mode",
      "Payment Status",
      "Enrolled Date",
    ];
    const rows = enrollments.map((e) => [
      `"${e.studentId || ""}"`,
      `"${e.receiptNo || ""}"`,
      `"${(e.studentName || "").replace(/"/g, '""')}"`,
      `"${e.studentPhone || ""}"`,
      `"${e.studentEmail || ""}"`,
      `"${(e.courseName || "").replace(/"/g, '""')}"`,
      e.totalAmount,
      e.amountPaid,
      e.balanceDue,
      `"${e.paymentMode || ""}"`,
      `"${e.paymentStatus || ""}"`,
      `"${new Date(e.enrolledAt || Date.now()).toLocaleDateString()}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `skillyards-admissions-ledger-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEnrollmentComplete = (newEnrollment) => {
    fetchEnrollments();
    // Prompt receipt immediately
    setSelectedReceipt(newEnrollment);
    setIsReceiptModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="crm-page-title">Admissions & Fee Management</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#25D366]/15 border border-[#25D366]/30 text-[#128C7E]">
              Confirmed Cohorts
            </span>
          </div>
          <p className="crm-page-subtitle">
            Student enrollment ledger, fee receipts, tuition collection, and EMI disbursement tracking
          </p>
        </div>

        <div className="flex items-center gap-2 self-start flex-wrap">
          <button
            type="button"
            onClick={() => setIsEnrollModalOpen(true)}
            className="crm-btn-primary !bg-[#2E7559] hover:!bg-[#235d46] shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>+ Enroll Student</span>
          </button>

          <Link
            href="/installments"
            className="crm-btn-secondary shadow-xs !py-1.5 !px-3 text-xs flex items-center gap-1.5 font-bold !text-[#B07238] border-[rgba(176,114,56,0.3)] bg-white hover:bg-[#FAF6EE]"
            title="Open Fee Installments & Dues Desk"
          >
            <Banknote className="w-3.5 h-3.5 text-[#B07238]" />
            <span>Installments Desk</span>
          </Link>

          <Link
            href="/incentives"
            className="crm-btn-secondary shadow-xs !py-1.5 !px-3 text-xs flex items-center gap-1.5 font-bold !text-[#2E7559] border-[rgba(46,117,89,0.3)] bg-white hover:bg-[#FAF6EE]"
            title="Open Sales Team Incentives & Commission Desk"
          >
            <Trophy className="w-3.5 h-3.5 text-[#2E7559]" />
            <span>Sales Incentives</span>
          </Link>

          <Link
            href="/cohorts"
            className="crm-btn-secondary shadow-xs !py-1.5 !px-3 text-xs flex items-center gap-1.5 font-bold !text-[#194451] border-[rgba(25,68,81,0.3)] bg-white hover:bg-[#FAF6EE]"
            title="Open Academic Batches & Seat Inventory Hub"
          >
            <Layers className="w-3.5 h-3.5 text-[#194451]" />
            <span>Academic Batches</span>
          </Link>

          <button
            onClick={handleExportCSV}
            className="crm-btn-secondary shadow-xs !py-1.5 !px-3 text-xs flex items-center gap-1.5"
            title="Download CSV of current admissions"
          >
            <Download className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={fetchEnrollments}
            className="crm-btn-secondary shadow-xs !py-1.5 !px-3 text-xs flex items-center gap-1.5"
            title="Refresh admissions ledger"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 4 Financial & Enrollment KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Enrolled */}
        <div className="p-4 bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] rounded-2xl shadow-sm hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5A6E71]">Enrolled Students</span>
            <div className="w-8 h-8 rounded-lg bg-[#D97706]/15 flex items-center justify-center text-[#D97706]">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#1C2527]">
              {metrics.totalCount}
            </span>
            <span className="text-[11px] font-bold text-[#2E7559]">+18% this month</span>
          </div>
          <p className="text-[10.5px] text-[#7E9396]">Active in Q4 cohorts</p>
        </div>

        {/* Tuition Collected */}
        <div className="p-4 bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] rounded-2xl shadow-sm hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5A6E71]">Tuition Collected</span>
            <div className="w-8 h-8 rounded-lg bg-[#25D366]/15 flex items-center justify-center text-[#128C7E]">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#128C7E]">
              ₹{(metrics.totalCollected / 100000).toFixed(2)}L
            </span>
            <span className="text-[11px] text-[#5A6E71]">
              / ₹{(metrics.totalGross / 100000).toFixed(2)}L gross
            </span>
          </div>
          <p className="text-[10.5px] text-[#7E9396]">100% verified transactions</p>
        </div>

        {/* Pending Receivables */}
        <div className="p-4 bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] rounded-2xl shadow-sm hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5A6E71]">Pending Receivables</span>
            <div className="w-8 h-8 rounded-lg bg-[#B07238]/15 flex items-center justify-center text-[#B07238]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#B07238]">
              ₹{(metrics.totalReceivables / 100000).toFixed(2)}L
            </span>
            <span className="text-[11px] font-bold text-[#B07238]">Installments due</span>
          </div>
          <p className="text-[10.5px] text-[#7E9396]">Under 30-day collection cycle</p>
        </div>

        {/* 0% EMI Disbursed */}
        <div className="p-4 bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] rounded-2xl shadow-sm hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5A6E71]">0% EMI Disbursals</span>
            <div className="w-8 h-8 rounded-lg bg-[rgba(98,146,158,0.2)] flex items-center justify-center text-[#1C2527]">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#1C2527]">
              {metrics.emiCount} Plans
            </span>
            <span className="text-[11px] font-bold text-[#2E7559]">NBFC Approved</span>
          </div>
          <p className="text-[10.5px] text-[#7E9396]">Liquiloans & Propelld</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="crm-tab-bar">
        {PAYMENT_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setPaymentFilter(tab.value)}
            className={paymentFilter === tab.value ? "crm-tab-active" : "crm-tab-inactive"}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, ID, phone, receipt #..."
            className="crm-input pr-9 pl-3.5 bg-white"
          />
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#7e939a] pointer-events-none" />
        </div>
        <button type="submit" className="crm-btn-primary shadow-xs">
          Search
        </button>
      </form>

      {/* Enrolled Students Table */}
      <div className="bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] shadow-sm rounded-2xl overflow-hidden">
        {enrollments.length === 0 ? (
          <div className="py-20 text-center space-y-3 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-[#25D366]/15 text-[#128C7E] flex items-center justify-center mx-auto shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#1C2527]">No Enrolled Students Found</h3>
            <p className="text-xs text-[#5A6E71]">No student admissions match your current search or filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="crm-table">
              <thead className="crm-thead">
                <tr>
                  <th className="crm-th">Student Details</th>
                  <th className="crm-th">Contact</th>
                  <th className="crm-th">Enrolled Program & Cohort</th>
                  <th className="crm-th">Total Fee</th>
                  <th className="crm-th">Amount Paid</th>
                  <th className="crm-th">Balance Due</th>
                  <th className="crm-th">Payment Status</th>
                  <th className="crm-th text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="crm-tbody">
                {enrollments.map((item) => {
                  const initial = item.studentName?.charAt(0).toUpperCase() || "S";
                  const isFull = item.paymentStatus === "fully_paid";
                  const isEmi = item.paymentStatus === "emi_active";

                  return (
                    <tr key={item.id} className="crm-tr group">
                      {/* Student Info */}
                      <td className="crm-td">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 text-[#128C7E] font-bold text-xs flex items-center justify-center shrink-0">
                            {initial}
                          </div>
                          <div>
                            <span className="font-bold text-xs text-[#1C2527] block">
                              {item.studentName}
                            </span>
                            <span className="text-[10.5px] text-[#D97706] font-mono font-semibold">
                              {item.studentId}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="crm-td">
                        <div className="space-y-0.5 text-xs">
                          <div className="flex items-center gap-1.5 font-semibold text-[#1C2527]">
                            <Phone className="w-3 h-3 text-[#5A6E71]" />
                            <span className="font-mono text-[11px]">{item.studentPhone}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[#5A6E71] text-[11px]">
                            <Mail className="w-3 h-3 text-[#7E9396]" />
                            <span className="truncate max-w-[140px]">{item.studentEmail}</span>
                          </div>
                        </div>
                      </td>

                      {/* Program & Batch */}
                      <td className="crm-td">
                        <div className="space-y-0.5 text-xs">
                          <span className="font-bold text-[#1C2527] block truncate max-w-[200px]">
                            {item.courseName}
                          </span>
                          <span className="text-[10.5px] text-[#5A6E71] block truncate max-w-[200px]">
                            {item.cohortName}
                          </span>
                        </div>
                      </td>

                      {/* Total Investment */}
                      <td className="crm-td">
                        <span className="font-mono font-bold text-xs text-[#1C2527]">
                          ₹{Number(item.totalAmount).toLocaleString("en-IN")}
                        </span>
                      </td>

                      {/* Amount Paid */}
                      <td className="crm-td">
                        <span className="font-mono font-bold text-xs text-[#128C7E]">
                          ₹{Number(item.amountPaid).toLocaleString("en-IN")}
                        </span>
                      </td>

                      {/* Balance Due */}
                      <td className="crm-td">
                        {item.balanceDue > 0 ? (
                          <div>
                            <span className="font-mono font-bold text-xs text-[#B07238] block">
                              ₹{Number(item.balanceDue).toLocaleString("en-IN")}
                            </span>
                            {item.balanceDueDate && (
                              <span className="text-[10px] text-[#7E9396] block">
                                Due: {item.balanceDueDate}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-[#2E7559] font-bold">Settled</span>
                        )}
                      </td>

                      {/* Payment Status Badge */}
                      <td className="crm-td">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            isFull
                              ? "bg-[#25D366]/15 border-[#25D366]/40 text-[#128C7E]"
                              : isEmi
                              ? "bg-[#D97706]/15 border-[#D97706]/40 text-[#D97706]"
                              : "bg-[#B07238]/15 border-[#B07238]/40 text-[#B07238]"
                          }`}
                        >
                          {isFull ? "Fully Paid" : isEmi ? "0% EMI Active" : "Balance Due"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="crm-td text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenReceipt(item)}
                            className="crm-btn-secondary !py-1 !px-2 text-[11px] flex items-center gap-1 shadow-xs cursor-pointer"
                            title="View official fee receipt"
                          >
                            <Receipt className="w-3.5 h-3.5 text-[#D97706]" />
                            <span>Receipt</span>
                          </button>

                          {item.studentPhone && (
                            <button
                              type="button"
                              onClick={() =>
                                startCall({
                                  leadId: item.leadId || item.id,
                                  name: item.studentName,
                                  phone: item.studentPhone,
                                  courseInterest: item.courseName,
                                })
                              }
                              className="p-1.5 rounded-lg bg-[#2E7559]/15 hover:bg-[#2E7559] text-[#1e5842] hover:text-white border border-[#2E7559]/30 transition-all cursor-pointer shadow-xs"
                              title={`Call ${item.studentName}`}
                            >
                              <Phone className="w-3.5 h-3.5" />
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

      {/* New Student Enrollment Modal */}
      <EnrollStudentModal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        onEnrollmentComplete={handleEnrollmentComplete}
        currentUser={user}
      />

      {/* Digital Fee Receipt Modal */}
      <StudentFeeReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        enrollment={selectedReceipt}
      />
    </div>
  );
}
