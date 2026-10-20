"use client";

import React, { useState } from "react";
import {
  X,
  BookmarkCheck,
  Clock,
  DollarSign,
  User,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { crmApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export function ReserveSeatModal({ isOpen, onClose, cohort, onSeatReserved }) {
  const { user } = useAuth();
  const [studentName, setStudentName] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [tokenAmount, setTokenAmount] = useState(5000);
  const [holdHours, setHoldHours] = useState(48);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [whatsappPreviewOpen, setWhatsappPreviewOpen] = useState(false);

  if (!isOpen || !cohort) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentName.trim() || !studentPhone.trim()) {
      alert("Please provide candidate name and phone number");
      return;
    }

    setIsSubmitting(true);
    const expiresAt = new Date(Date.now() + Number(holdHours) * 3600000).toISOString();

    const reservationData = {
      id: `res-${Date.now()}`,
      batchId: cohort.id,
      batchName: cohort.name,
      courseName: cohort.courseName,
      studentName: studentName.trim(),
      studentPhone: studentPhone.trim(),
      studentEmail: studentEmail.trim() || "candidate@skillyards.com",
      tokenAmount: Number(tokenAmount),
      holdHours: Number(holdHours),
      expiresAt,
      status: "token_reserved",
      notes: notes || "Seat held with token payment advance",
      reservedBy: user?.name || "Admissions Counsellor",
      createdAt: new Date().toISOString(),
    };

    try {
      try {
        await crmApi.reserveBatchSeat(reservationData);
      } catch (err) {
        console.warn("Backend reserve API offline, applying locally:", err.message);
      }

      // Persist to localStorage
      if (typeof window !== "undefined") {
        try {
          const stored = JSON.parse(localStorage.getItem("skillyards_seat_reservations") || "[]");
          localStorage.setItem(
            "skillyards_seat_reservations",
            JSON.stringify([reservationData, ...stored])
          );
        } catch (_) {}
      }

      setIsSubmitting(false);
      onClose();
      if (onSeatReserved) onSeatReserved(reservationData);
    } catch (err) {
      alert("Error reserving seat: " + err.message);
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = `Hi ${studentName || "Candidate"}, your seat for ${cohort.name} (${cohort.courseName}) has been temporarily reserved with a token deposit of ₹${tokenAmount.toLocaleString("en-IN")}. Your seat reservation is locked for the next ${holdHours} hours until ${new Date(Date.now() + holdHours * 3600000).toLocaleString("en-IN")}. Please complete the balance admission procedure before expiration to guarantee your batch seat. - Skillyards Admissions Team`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#FAF6EE] rounded-2xl shadow-2xl border border-[rgba(71,86,87,0.22)] overflow-hidden my-8 animate-slideDown">
        {/* Cockpit Top Bar */}
        <div className="bg-[#0c1316] text-white px-6 py-4 flex items-center justify-between border-b border-[rgba(98,146,158,0.2)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D97706]/20 border border-[#D97706]/40 flex items-center justify-center text-[#D97706]">
              <BookmarkCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wide">Reserve Seat (Token Hold)</h2>
              <p className="text-[11px] text-[#7E939A]">48-Hour Priority Seat Reservation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#7E939A] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-[#1C2527]">
          {/* Cohort Summary Strip */}
          <div className="p-3 rounded-xl bg-white border border-[rgba(71,86,87,0.15)] flex items-center justify-between text-xs">
            <div>
              <span className="font-mono text-[10px] font-bold text-[#4A6D7C] block">
                {cohort.code || "COHORT"}
              </span>
              <span className="font-bold text-[#1C2527]">{cohort.name}</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-[#5A6E71] block">Seats Open</span>
              <span className="font-bold text-[#128C7E]">{cohort.seatsRemaining || 2} Remaining</span>
            </div>
          </div>

          {/* Student Information */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-[#1C2527] block mb-1">
                Candidate Full Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Vikramaditya Rathore"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="crm-input bg-white text-xs font-semibold"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#1C2527] block mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  className="crm-input bg-white text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1C2527] block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="candidate@example.com"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  className="crm-input bg-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Token Fee & Hold Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-white rounded-xl border border-[rgba(71,86,87,0.14)]">
            <div>
              <label className="text-xs font-bold text-[#1C2527] block mb-1">
                Token Deposit (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#5A6E71]">
                  ₹
                </span>
                <input
                  type="number"
                  min="1000"
                  step="500"
                  value={tokenAmount}
                  onChange={(e) => setTokenAmount(Number(e.target.value))}
                  className="crm-input !pl-7 bg-[#FAF6EE] text-xs font-bold text-[#2E7559]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#1C2527] block mb-1">
                Hold Duration
              </label>
              <select
                value={holdHours}
                onChange={(e) => setHoldHours(Number(e.target.value))}
                className="crm-input bg-[#FAF6EE] text-xs font-semibold"
              >
                <option value={24}>24 Hours (1 Day)</option>
                <option value={48}>48 Hours (2 Days - Standard)</option>
                <option value={72}>72 Hours (3 Days)</option>
                <option value={120}>5 Days (Special Request)</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-bold text-[#1C2527] block mb-1">
              Internal Counsellor Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Paid ₹5,000 advance via UPI. Awaiting loan sanction for remaining fees."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="crm-input bg-white text-xs"
            />
          </div>

          {/* WhatsApp Confirmation Preview Toggle */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setWhatsappPreviewOpen((prev) => !prev)}
              className="text-xs font-bold text-[#128C7E] hover:underline flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{whatsappPreviewOpen ? "Hide" : "Preview"} WhatsApp Token Confirmation Receipt</span>
            </button>

            {whatsappPreviewOpen && (
              <div className="mt-2 p-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 text-xs text-[#0c1316] space-y-2">
                <p className="font-mono text-[11px] leading-relaxed select-all">
                  {whatsappMessage}
                </p>
                <button
                  type="button"
                  onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`, "_blank")}
                  className="px-2.5 py-1 rounded-lg bg-[#25D366] text-white font-bold text-[11px] flex items-center gap-1 shadow-xs hover:bg-[#1eb857]"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>Send via WhatsApp Web</span>
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[rgba(71,86,87,0.15)] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="crm-btn-secondary !py-2 !px-4 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="crm-btn-primary !bg-[#D97706] hover:!bg-[#b46305] !py-2 !px-5 text-xs font-bold shadow-md flex items-center gap-1.5"
            >
              <BookmarkCheck className="w-4 h-4 text-white" />
              <span>{isSubmitting ? "Locking..." : "Confirm Token Hold"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReserveSeatModal;
