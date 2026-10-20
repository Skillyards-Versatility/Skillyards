"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  GraduationCap,
  X,
  CreditCard,
  Building,
  User,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Sparkles,
  Percent,
  Receipt,
  FileText,
} from "lucide-react";
import { crmApi } from "@/lib/api";

const COURSES = [
  { id: "fsd", name: "Full Stack Web Development (MERN)", fee: 45000 },
  { id: "ds_ai", name: "Data Science & Applied AI Accelerator", fee: 55000 },
  { id: "cloud_devops", name: "Cloud Architecture & DevOps Engineering", fee: 50000 },
  { id: "ui_ux", name: "Product Design & UI/UX Mastery", fee: 40000 },
  { id: "cyber", name: "Cybersecurity & Ethical Hacking Cohort", fee: 48000 },
];

const BATCHES = [
  "Weekend Live Cohort (Sat-Sun 10 AM - 2 PM)",
  "Weekday Evening Cohort (Mon-Thu 7 PM - 9 PM)",
  "Fast-Track Immersion Bootcamp (Daily 9 AM - 1 PM)",
];

const SCHOLARSHIPS = [
  { code: "NONE", label: "No Scholarship (Standard Tuition)", discountPct: 0 },
  { code: "SKY-MERIT-15", label: "15% Academic Merit Scholarship", discountPct: 0.15 },
  { code: "EARLY-10", label: "10% Early Bird Admissions Incentive", discountPct: 0.10 },
  { code: "WOMEN-TECH-20", label: "20% Women in Tech Leadership Grant", discountPct: 0.20 },
];

export function EnrollStudentModal({ isOpen, onClose, lead, onEnrollmentComplete, currentUser }) {
  // Form State
  const [studentName, setStudentName] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [selectedCourseName, setSelectedCourseName] = useState(COURSES[0].name);
  const [selectedBatch, setSelectedBatch] = useState(BATCHES[0]);
  const [counselorName, setCounselorName] = useState("Priya Patel");

  // Fee Calculation State
  const [selectedScholarshipCode, setSelectedScholarshipCode] = useState("SKY-MERIT-15");
  const [applyGst, setApplyGst] = useState(true);
  const [paymentMode, setPaymentMode] = useState("upi");
  const [paymentSchedule, setPaymentSchedule] = useState("full"); // "full" | "installment" | "emi"
  const [amountPaidToday, setAmountPaidToday] = useState(0);
  const [balanceDueDate, setBalanceDueDate] = useState("");
  const [transactionRef, setTransactionRef] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize or prefill from lead
  useEffect(() => {
    if (lead) {
      setStudentName(lead.fullName || lead.name || "");
      setStudentPhone(lead.normalizedPhone || lead.phone || "");
      setStudentEmail(lead.normalizedEmail || lead.email || "");
      if (lead.enquiryCourse) {
        const matched = COURSES.find((c) => c.name.toLowerCase().includes(lead.enquiryCourse.toLowerCase()));
        if (matched) setSelectedCourseName(matched.name);
      }
      if (lead.assignedToUserName) {
        setCounselorName(lead.assignedToUserName);
      }
    } else {
      setStudentName("");
      setStudentPhone("");
      setStudentEmail("");
    }

    // Set default balance due date 30 days out
    const dueDate = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split("T")[0];
    setBalanceDueDate(dueDate);
    setTransactionRef(`UTR-${Date.now().toString().slice(-8)}`);
  }, [lead, isOpen]);

  // Derive Base Fee from selected course
  const currentCourse = useMemo(() => {
    return COURSES.find((c) => c.name === selectedCourseName) || COURSES[0];
  }, [selectedCourseName]);

  const baseFee = currentCourse.fee;

  // Derive Scholarship discount
  const scholarship = useMemo(() => {
    return SCHOLARSHIPS.find((s) => s.code === selectedScholarshipCode) || SCHOLARSHIPS[0];
  }, [selectedScholarshipCode]);

  const discountAmount = Math.round(baseFee * scholarship.discountPct);
  const netBeforeTax = baseFee - discountAmount;
  const gstAmount = applyGst ? Math.round(netBeforeTax * 0.18) : 0;
  const finalTotalAmount = netBeforeTax + gstAmount;

  // Auto-update amount paid if "full" is selected
  useEffect(() => {
    if (paymentSchedule === "full") {
      setAmountPaidToday(finalTotalAmount);
    } else if (paymentSchedule === "installment") {
      setAmountPaidToday(Math.round(finalTotalAmount / 2));
    } else if (paymentSchedule === "emi") {
      setAmountPaidToday(Math.round(finalTotalAmount / 10)); // 1st EMI advance
    }
  }, [paymentSchedule, finalTotalAmount]);

  const balancePending = Math.max(0, finalTotalAmount - amountPaidToday);

  // Available batches including custom cohorts
  const availableBatches = useMemo(() => {
    let customNames = [];
    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("skillyards_custom_cohorts") || "[]");
        customNames = stored.map((c) => `${c.name} (${c.schedule || "Weekend Live"})`);
      } catch (_) {}
    }
    return [...customNames, ...BATCHES];
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentName || !studentPhone) {
      alert("Please provide the candidate's name and phone number");
      return;
    }

    setIsSubmitting(true);
    const enrollmentId = `adm-${Date.now()}`;
    const studentId = `SKY-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const receiptNo = `REC-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const newEnrollment = {
      id: enrollmentId,
      studentId,
      receiptNo,
      leadId: lead?.id || null,
      studentName,
      studentPhone,
      studentEmail,
      courseName: selectedCourseName,
      cohortName: selectedBatch,
      counselorName: counselorName || currentUser?.name || "Admissions Team",
      baseFee,
      scholarshipCode: scholarship.code,
      scholarshipAmount: discountAmount,
      netBeforeTax,
      gstAmount,
      totalAmount: finalTotalAmount,
      amountPaid: Number(amountPaidToday),
      balanceDue: balancePending,
      balanceDueDate: balancePending > 0 ? balanceDueDate : null,
      paymentMode,
      paymentSchedule,
      transactionRef: transactionRef || `UTR-${Date.now().toString().slice(-8)}`,
      paymentStatus: balancePending === 0 ? "fully_paid" : paymentSchedule === "emi" ? "emi_active" : "partial_paid",
      enrolledAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    try {
      // 1. Submit to Backend API
      try {
        const apiRes = await crmApi.enrollStudent({
          leadId: lead?.id || null,
          studentName,
          studentPhone,
          studentEmail,
          courseName: selectedCourseName,
          cohortName: selectedBatch,
          baseFee,
          totalAmount: finalTotalAmount,
          amountPaid: Number(amountPaidToday),
          paymentMode,
          transactionRef: transactionRef || `UTR-${Date.now().toString().slice(-8)}`,
          scholarshipCode: scholarship.code,
          scholarshipAmount: discountAmount,
        });
        if (apiRes?.studentId) {
          newEnrollment.studentId = apiRes.studentId;
          newEnrollment.receiptNo = apiRes.receiptNo;
        }
      } catch (apiErr) {
        console.warn("Backend API offline, persisting enrollment locally:", apiErr.message);
      }

      // Save to localStorage enrolled students roster
      const existing = JSON.parse(localStorage.getItem("skillyards_enrolled_students") || "[]");
      existing.unshift(newEnrollment);
      localStorage.setItem("skillyards_enrolled_students", JSON.stringify(existing));

      // If tied to a lead, log student_enrolled event into the lead's timeline and update status
      if (lead?.id) {
        const leadKey = `skillyards_lead_call_history_${lead.id}`;
        const leadHistory = JSON.parse(localStorage.getItem(leadKey) || "[]");
        const enrollEvent = {
          id: `tl-enroll-${Date.now()}`,
          type: "student_enrolled",
          title: `Student Enrolled: ${selectedCourseName}`,
          actorName: currentUser?.name || "You",
          timestamp: new Date().toISOString(),
          notes: `Confirmed admission under student ID #${studentId}. Total Investment: ₹${finalTotalAmount.toLocaleString("en-IN")}, Paid Today: ₹${Number(amountPaidToday).toLocaleString("en-IN")} via ${paymentMode.toUpperCase()} (${transactionRef}). Receipt #${receiptNo}.`,
        };
        leadHistory.unshift(enrollEvent);
        localStorage.setItem(leadKey, JSON.stringify(leadHistory));

        // Also update custom leads if lead was custom
        const customLeads = JSON.parse(localStorage.getItem("skillyards_custom_leads") || "[]");
        const updatedCustom = customLeads.map((l) =>
          l.id === lead.id ? { ...l, status: "converted" } : l
        );
        localStorage.setItem("skillyards_custom_leads", JSON.stringify(updatedCustom));
      }

      if (onEnrollmentComplete) {
        onEnrollmentComplete(newEnrollment);
      }
      setIsSubmitting(false);
      onClose();
    } catch (err) {
      console.error("Enrollment error:", err);
      setIsSubmitting(false);
      alert("Failed to save enrollment: " + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FAF6EE] border border-[rgba(71,86,87,0.25)] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="px-5 py-4 bg-[#0c1316] text-[#FAF6EE] border-b border-[rgba(98,146,158,0.2)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-white">Enroll Candidate as Student</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30">
                  Confirmed Admission
                </span>
              </div>
              <p className="text-xs text-[#7e939a]">
                Generate student ID, configure tuition & scholarship, and collect fees
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Section 1: Candidate Information */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#1C2527] uppercase tracking-wider block">
              1. Candidate Details
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="crm-label font-bold text-[#1C2527]">Full Name *</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="crm-input bg-white"
                />
              </div>

              <div>
                <label className="crm-label font-bold text-[#1C2527]">Contact Phone *</label>
                <input
                  type="tel"
                  required
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="crm-input bg-white font-mono"
                />
              </div>

              <div>
                <label className="crm-label font-bold text-[#1C2527]">Email Address</label>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="crm-input bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Academic Program & Cohort */}
          <div className="space-y-3 pt-2 border-t border-[rgba(71,86,87,0.12)]">
            <span className="text-xs font-bold text-[#1C2527] uppercase tracking-wider block">
              2. Academic Program & Batch Cohort
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="crm-label font-bold text-[#1C2527]">Selected Program</label>
                <select
                  value={selectedCourseName}
                  onChange={(e) => setSelectedCourseName(e.target.value)}
                  className="crm-select bg-white font-semibold"
                >
                  {COURSES.map((course) => (
                    <option key={course.id} value={course.name}>
                      {course.name} (₹{course.fee.toLocaleString("en-IN")})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="crm-label font-bold text-[#1C2527]">Cohort Schedule</label>
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="crm-select bg-white"
                >
                  {availableBatches.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Fee Breakdown & Scholarship */}
          <div className="space-y-3 pt-2 border-t border-[rgba(71,86,87,0.12)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1C2527] uppercase tracking-wider block">
                3. Tuition Fee Structure & Scholarship
              </span>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#5A6E71]">
                <input
                  type="checkbox"
                  checked={applyGst}
                  onChange={(e) => setApplyGst(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-[#4A6D7C] focus:ring-[#4A6D7C]"
                />
                <span>Include 18% GST (Official Invoice)</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="crm-label font-bold text-[#1C2527]">Scholarship / Fee Waiver</label>
                <select
                  value={selectedScholarshipCode}
                  onChange={(e) => setSelectedScholarshipCode(e.target.value)}
                  className="crm-select bg-white"
                >
                  {SCHOLARSHIPS.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="crm-label font-bold text-[#1C2527]">Admissions Counselor</label>
                <input
                  type="text"
                  value={counselorName}
                  onChange={(e) => setCounselorName(e.target.value)}
                  className="crm-input bg-white"
                />
              </div>
            </div>

            {/* Calculated Fee Summary Box */}
            <div className="p-3.5 rounded-xl bg-white border border-[rgba(71,86,87,0.18)] shadow-xs space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#5A6E71]">
                <span>Base Tuition Fee:</span>
                <span className="font-mono text-[#1C2527] font-semibold">₹{baseFee.toLocaleString("en-IN")}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-[#2E7559]">
                  <span>Scholarship Waiver ({scholarship.code}):</span>
                  <span className="font-mono font-bold">-₹{discountAmount.toLocaleString("en-IN")}</span>
                </div>
              )}
              {applyGst && (
                <div className="flex items-center justify-between text-[#5A6E71]">
                  <span>GST @ 18%:</span>
                  <span className="font-mono text-[#1C2527]">₹{gstAmount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="pt-2 border-t border-[rgba(71,86,87,0.12)] flex items-center justify-between font-bold text-sm text-[#1C2527]">
                <span>Total Net Payable Investment:</span>
                <span className="font-mono text-base text-[#128C7E]">₹{finalTotalAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Payment Details */}
          <div className="space-y-3 pt-2 border-t border-[rgba(71,86,87,0.12)]">
            <span className="text-xs font-bold text-[#1C2527] uppercase tracking-wider block">
              4. Payment Collection & Modes
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="crm-label font-bold text-[#1C2527]">Payment Plan</label>
                <select
                  value={paymentSchedule}
                  onChange={(e) => setPaymentSchedule(e.target.value)}
                  className="crm-select bg-white font-semibold"
                >
                  <option value="full">100% Full Upfront Settlement</option>
                  <option value="installment">Two-Part Installment Plan</option>
                  <option value="emi">0% Interest 10-Month EMI Loan</option>
                </select>
              </div>

              <div>
                <label className="crm-label font-bold text-[#1C2527]">Payment Instrument</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="crm-select bg-white capitalize"
                >
                  <option value="upi">UPI (GPay, PhonePe, Paytm)</option>
                  <option value="net_banking">Net Banking / IMPS / NEFT</option>
                  <option value="card">Debit / Credit Card</option>
                  <option value="emi">NBFC Loan Approval (Liquiloans)</option>
                  <option value="cash">Cash / Cheque Collection</option>
                </select>
              </div>

              <div>
                <label className="crm-label font-bold text-[#1C2527]">Amount Collected Today (₹)</label>
                <input
                  type="number"
                  min="0"
                  max={finalTotalAmount}
                  value={amountPaidToday}
                  onChange={(e) => setAmountPaidToday(Number(e.target.value))}
                  className="crm-input bg-white font-mono font-bold text-[#128C7E]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="crm-label font-bold text-[#1C2527]">Transaction Reference / UTR Number</label>
                <input
                  type="text"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  placeholder="e.g. UTR-20261019-94821"
                  className="crm-input bg-white font-mono text-xs"
                />
              </div>

              {balancePending > 0 && (
                <div>
                  <label className="crm-label font-bold text-[#B07238]">
                    Balance Due Date (Remaining: ₹{balancePending.toLocaleString("en-IN")})
                  </label>
                  <input
                    type="date"
                    value={balanceDueDate}
                    onChange={(e) => setBalanceDueDate(e.target.value)}
                    className="crm-input bg-white text-xs"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Institutional Audit Notification */}
          <div className="p-3.5 rounded-xl bg-[#FAF6EE] border border-[rgba(74,109,124,0.3)] text-xs text-[#2A5766] space-y-1">
            <span className="font-bold text-[#194451] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#4A6D7C]" />
              <span>Automatic Lifecycle Synchronization:</span>
            </span>
            <p className="text-[11px] text-[#475657]">
              Submitting marks candidate as <strong className="text-[#1C2527]">Converted / Enrolled</strong>, creates a verified admission record, logs the transaction in candidate audit history, and issues an official digital receipt.
            </p>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-[rgba(71,86,87,0.15)]">
            <button
              type="button"
              onClick={onClose}
              className="crm-btn-secondary !py-2 !px-3.5 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="crm-btn-primary !bg-[#2E7559] hover:!bg-[#235d46] !py-2 !px-5 text-xs shadow-md flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>{isSubmitting ? "Enrolling..." : "Confirm Admission & Generate Receipt"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EnrollStudentModal;
