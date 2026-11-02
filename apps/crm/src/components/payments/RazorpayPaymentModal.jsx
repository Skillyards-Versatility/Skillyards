"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  CreditCard,
  Zap,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  QrCode,
  ShieldCheck,
  Clock,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Phone,
  User,
  GraduationCap,
  Banknote,
  Share2,
} from "lucide-react";
import { crmApi } from "@/lib/api";

const PRESET_PURPOSES = [
  "Tuition Fee Installment Milestone",
  "Seat Reservation Token Fee",
  "Full Course Tuition Settlement",
  "Early-Bird Merit Balance Clearance",
];

export function RazorpayPaymentModal({
  isOpen,
  onClose,
  installment = null,
  lead = null,
  student = null,
  onPaymentSuccess,
}) {
  const [step, setStep] = useState("configure"); // 'configure' | 'active' | 'success'
  const [loading, setLoading] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSms, setCopiedSms] = useState(false);

  // Form State
  const [studentName, setStudentName] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [courseName, setCourseName] = useState("");
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("Tuition Fee Installment Milestone");

  // Generated Link State
  const [generatedLink, setGeneratedLink] = useState(null);
  const [whatsappShareUrl, setWhatsappShareUrl] = useState("");
  const [smsText, setSmsText] = useState("");
  const [paymentSuccessData, setPaymentSuccessData] = useState(null);

  // Populate data when modal opens
  useEffect(() => {
    if (!isOpen) return;

    setStep("configure");
    setErrorMsg("");
    setGeneratedLink(null);
    setPaymentSuccessData(null);

    if (installment) {
      setStudentName(installment.studentName || "");
      setStudentPhone(installment.studentPhone || "");
      setStudentEmail(installment.studentEmail || "");
      setCourseName(installment.courseName || "");
      setAmount(installment.amountDue || "");
      setPurpose(installment.installmentTitle || "Tuition Fee Installment Milestone");
    } else if (lead) {
      setStudentName(lead.fullName || lead.name || "");
      setStudentPhone(lead.normalizedPhone || lead.phone || "");
      setStudentEmail(lead.normalizedEmail || lead.email || "");
      setCourseName(lead.courseInterest || "Full Stack Web Development");
      setAmount("5000"); // default token fee
      setPurpose("Seat Reservation Token Fee");
    } else if (student) {
      setStudentName(student.studentName || student.name || "");
      setStudentPhone(student.studentPhone || student.phone || "");
      setStudentEmail(student.studentEmail || student.email || "");
      setCourseName(student.courseName || "");
      setAmount(student.balanceDue || "15000");
      setPurpose("Course Tuition Settlement");
    }
  }, [isOpen, installment, lead, student]);

  if (!isOpen) return null;

  // 1. Handle Link Generation
  const handleGenerateLink = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setErrorMsg("Please enter a valid amount");
      return;
    }
    if (!studentName || !studentPhone) {
      setErrorMsg("Student name and phone number are required");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await crmApi.generatePaymentLink({
        amount: Number(amount),
        purpose,
        studentName,
        studentPhone,
        studentEmail,
        courseName,
        installmentId: installment?.id || null,
        studentId: student?.id || installment?.studentId || null,
        leadId: lead?.id || null,
      });

      setGeneratedLink(res.paymentLink);
      setWhatsappShareUrl(res.whatsappShareUrl);
      setSmsText(res.smsText);
      setStep("active");
    } catch (err) {
      setErrorMsg(err.message || "Failed to generate Razorpay link");
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Copy Actions
  const handleCopyLink = () => {
    if (!generatedLink?.short_url) return;
    navigator.clipboard.writeText(generatedLink.short_url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopySms = () => {
    if (!smsText) return;
    navigator.clipboard.writeText(smsText);
    setCopiedSms(true);
    setTimeout(() => setCopiedSms(false), 2000);
  };

  // 3. Handle Webhook Simulation (Test Mode)
  const handleSimulatePayment = async () => {
    setSimulating(true);
    setErrorMsg("");

    try {
      const res = await crmApi.simulatePaymentWebhook({
        linkId: generatedLink?.id,
        installmentId: installment?.id || null,
        studentId: student?.id || installment?.studentId || null,
        leadId: lead?.id || null,
        studentName,
        amount: Number(amount),
        courseName,
        paymentMethod: "upi",
      });

      setPaymentSuccessData(res);
      setStep("success");

      // Notify parent to refresh lists
      if (onPaymentSuccess) {
        onPaymentSuccess({
          installmentId: installment?.id,
          paymentId: res.paymentId,
          amount: Number(amount),
          status: "paid",
        });
      }
    } catch (err) {
      setErrorMsg(err.message || "Webhook simulation failed");
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#0c1316] border border-[#23353a] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#23353a] bg-[#121c20]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D97706]/15 border border-[#D97706]/30 flex items-center justify-center text-[#D97706]">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  Razorpay Payment Link Gateway
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30">
                  Instant Webhook
                </span>
              </div>
              <p className="text-xs text-[#7e939a]">
                Generate secure UPI/Card checkout link & auto-clear installment
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#7e939a] hover:text-white hover:bg-[#1a272c] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="grid grid-cols-3 border-b border-[#23353a] text-xs font-mono">
          <div
            className={`py-2 px-3 text-center border-r border-[#23353a] flex items-center justify-center gap-1.5 ${
              step === "configure"
                ? "bg-[#D97706]/10 text-[#D97706] font-bold"
                : "text-[#7e939a]"
            }`}
          >
            <span>1.</span> Configure
          </div>
          <div
            className={`py-2 px-3 text-center border-r border-[#23353a] flex items-center justify-center gap-1.5 ${
              step === "active"
                ? "bg-[#D97706]/10 text-[#D97706] font-bold"
                : "text-[#7e939a]"
            }`}
          >
            <span>2.</span> Share & QR Code
          </div>
          <div
            className={`py-2 px-3 text-center flex items-center justify-center gap-1.5 ${
              step === "success"
                ? "bg-[#10b981]/10 text-[#10b981] font-bold"
                : "text-[#7e939a]"
            }`}
          >
            <span>3.</span> Webhook Cleared
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/50 flex items-start gap-2.5 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* =========================================================================
              STEP 1: CONFIGURE FORM
              ========================================================================= */}
          {step === "configure" && (
            <form onSubmit={handleGenerateLink} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#a5b7bd] mb-1.5">
                    Student Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#7e939a] absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#121c20] border border-[#23353a] text-sm text-white placeholder-[#57686a] focus:outline-hidden focus:border-[#D97706]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#a5b7bd] mb-1.5">
                    Phone Number (WhatsApp) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#7e939a] absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#121c20] border border-[#23353a] text-sm text-white placeholder-[#57686a] focus:outline-hidden focus:border-[#D97706]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#a5b7bd] mb-1.5">
                    Course / Specialization
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-[#7e939a] absolute left-3 top-3" />
                    <input
                      type="text"
                      value={courseName}
                      onChange={(e) => setCourseName(e.target.value)}
                      placeholder="Full Stack Web Development"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#121c20] border border-[#23353a] text-sm text-white placeholder-[#57686a] focus:outline-hidden focus:border-[#D97706]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#a5b7bd] mb-1.5">
                    Amount to Collect (₹ INR) *
                  </label>
                  <div className="relative">
                    <span className="text-sm font-bold text-[#D97706] absolute left-3.5 top-2.5">
                      ₹
                    </span>
                    <input
                      type="number"
                      required
                      min="100"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="20135"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#121c20] border border-[#23353a] text-sm text-white font-mono font-bold placeholder-[#57686a] focus:outline-hidden focus:border-[#D97706]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#a5b7bd] mb-1.5">
                  Payment Purpose / Milestone
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PRESET_PURPOSES.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPurpose(p)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-colors ${
                        purpose === p
                          ? "bg-[#D97706]/15 border-[#D97706] text-[#FAF6EE] font-semibold"
                          : "bg-[#121c20] border-[#23353a] text-[#7e939a] hover:border-[#384e55]"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#D97706] to-[#F59E0B] hover:from-[#B45309] hover:to-[#D97706] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Generating Razorpay Link...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Generate Razorpay Payment Link (₹{Number(amount || 0).toLocaleString("en-IN")})</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* =========================================================================
              STEP 2: ACTIVE LINK & QR CODE DESK
              ========================================================================= */}
          {step === "active" && generatedLink && (
            <div className="space-y-5">
              {/* Status Header */}
              <div className="p-3 rounded-xl bg-[#D97706]/10 border border-[#D97706]/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D97706] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D97706]"></span>
                  </span>
                  <span className="text-xs font-bold text-[#F6E3CC]">
                    Live Payment Link Ready
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-white">
                  ₹{Number(generatedLink.amount).toLocaleString("en-IN")}
                </span>
              </div>

              {/* Short URL Box */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#7e939a] uppercase tracking-wider">
                  Official Razorpay Short URL
                </label>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#121c20] border border-[#23353a]">
                  <span className="flex-1 font-mono text-xs text-white truncate select-all">
                    {generatedLink.short_url}
                  </span>
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 rounded-lg bg-[#1a272c] hover:bg-[#23353a] text-xs font-semibold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#10b981]" />
                        <span className="text-[#10b981]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                  <a
                    href={generatedLink.short_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-[#1a272c] hover:bg-[#23353a] text-[#7e939a] hover:text-white transition-colors"
                    title="Open checkout"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* UPI QR Code Preview & Direct WhatsApp Share */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center p-4 rounded-xl bg-[#121c20] border border-[#23353a]">
                <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-white">
                  {generatedLink.qr_code_url ? (
                    <img
                      src={generatedLink.qr_code_url}
                      alt="UPI Payment QR Code"
                      className="w-40 h-40 object-contain rounded"
                    />
                  ) : (
                    <div className="w-40 h-40 flex items-center justify-center bg-gray-100 rounded text-gray-500">
                      <QrCode className="w-16 h-16" />
                    </div>
                  )}
                  <p className="text-[10px] text-gray-700 font-bold mt-2">
                    Scan via GPay / PhonePe / Paytm
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-white">Student Details</h4>
                    <p className="text-xs text-[#7e939a]">{studentName} ({studentPhone})</p>
                    <p className="text-xs text-[#D97706] font-semibold mt-1">{purpose}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#23353a]">
                    <a
                      href={whatsappShareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Share via WhatsApp</span>
                    </a>

                    <button
                      onClick={handleCopySms}
                      className="w-full py-2 px-3 rounded-xl bg-[#1a272c] hover:bg-[#23353a] text-xs font-semibold text-[#a5b7bd] hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedSms ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#10b981]" />
                          <span>SMS Text Copied</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Copy SMS Reminder Text</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Webhook Test Simulation Box */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#121c20] to-[#152329] border border-[#2E7559]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#10b981]" />
                    <h4 className="text-xs font-bold text-white">
                      Instant Webhook Simulator (Test Mode)
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30">
                    Live Settlement
                  </span>
                </div>
                <p className="text-[11px] text-[#7e939a] leading-relaxed">
                  Click below to simulate student completing payment via UPI. The Razorpay instant webhook will trigger, verify the payload, and update the CRM ledger to <strong>PAID</strong> immediately.
                </p>

                <button
                  type="button"
                  onClick={handleSimulatePayment}
                  disabled={simulating}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
                >
                  {simulating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Processing Razorpay Webhook Event...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Simulate Student Payment Success (₹{Number(amount).toLocaleString("en-IN")})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 3: PAYMENT CAPTURED SUCCESS (WEBHOOK CONFIRMED)
              ========================================================================= */}
          {step === "success" && (
            <div className="py-6 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#10b981]/20 border-2 border-[#10b981] flex items-center justify-center text-[#10b981] shadow-lg animate-bounce">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">
                  Payment Captured & Webhook Verified!
                </h3>
                <p className="text-xs text-[#7e939a] mt-1">
                  Tuition settlement confirmed in real-time via Razorpay Engine
                </p>
              </div>

              {/* Receipt Details Card */}
              <div className="w-full p-4 rounded-xl bg-[#121c20] border border-[#23353a] text-xs font-mono space-y-2 text-left">
                <div className="flex justify-between pb-1.5 border-b border-[#23353a]">
                  <span className="text-[#7e939a]">Amount Cleared:</span>
                  <span className="font-bold text-[#10b981]">
                    ₹{Number(amount).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between pb-1.5 border-b border-[#23353a]">
                  <span className="text-[#7e939a]">Payment ID:</span>
                  <span className="font-bold text-white">
                    {paymentSuccessData?.paymentId || "pay_rzp_live"}
                  </span>
                </div>
                <div className="flex justify-between pb-1.5 border-b border-[#23353a]">
                  <span className="text-[#7e939a]">Student:</span>
                  <span className="text-white">{studentName}</span>
                </div>
                <div className="flex justify-between pb-1.5 border-b border-[#23353a]">
                  <span className="text-[#7e939a]">Payment Method:</span>
                  <span className="text-[#D97706] font-bold">UPI / Instant Clearance</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7e939a]">Ledger Status:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                    PAID (100% Settled)
                  </span>
                </div>
              </div>

              <div className="w-full pt-2">
                <button
                  onClick={onClose}
                  className="w-full py-3 px-4 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
                >
                  Close & View Updated Ledger
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
