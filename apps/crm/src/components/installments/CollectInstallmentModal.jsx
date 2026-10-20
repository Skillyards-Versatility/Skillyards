"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  CreditCard,
  Building,
  CheckCircle2,
  Calendar,
  AlertCircle,
  FileText,
  User,
  Sparkles,
  Receipt,
  IndianRupee,
} from "lucide-react";
import { crmApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export function CollectInstallmentModal({ isOpen, onClose, installment, onCollected }) {
  const { user: currentUser } = useAuth();
  const [amountToCollect, setAmountToCollect] = useState("");
  const [paymentMode, setPaymentMode] = useState("upi");
  const [transactionRef, setTransactionRef] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (installment) {
      const balance = Math.max(
        0,
        (Number(installment.amountDue) || 0) - (Number(installment.amountPaid) || 0)
      );
      setAmountToCollect(balance.toString());
      setTransactionRef(`UTR-${Date.now().toString().slice(-8)}`);
      setPaymentDate(new Date().toISOString().split("T")[0]);
      setNotes("");
    }
  }, [installment]);

  if (!isOpen || !installment) return null;

  const currentDue = Math.max(
    0,
    (Number(installment.amountDue) || 0) - (Number(installment.amountPaid) || 0)
  );
  const enteredAmount = Number(amountToCollect) || 0;
  const remainingBalanceAfter = Math.max(0, currentDue - enteredAmount);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (enteredAmount <= 0) {
      alert("Please enter a valid payment amount");
      return;
    }

    setIsSubmitting(true);
    const receiptNo = `REC-INST-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const collectionTimestamp = new Date(paymentDate || Date.now()).toISOString();

    const payload = {
      installmentId: installment.id,
      studentId: installment.studentId,
      rawStudentId: installment.rawStudentId || null,
      amount: enteredAmount,
      paymentMode,
      transactionRef: transactionRef || `UTR-${Date.now().toString().slice(-8)}`,
      paymentDate: collectionTimestamp,
      notes,
      receiptNumber: receiptNo,
    };

    let updatedInstallment = null;
    let receiptData = null;

    try {
      // 1. Try Backend API
      const res = await crmApi.collectInstallment(payload);
      if (res && res.data) {
        updatedInstallment = res.data.installment;
        receiptData = res.data.receipt;
      }
    } catch (err) {
      console.warn("API collection failed, executing local offline fallback:", err.message);
    }

    // 2. Offline / Local State Fallback
    const isFullSettlement = enteredAmount >= currentDue;
    const finalUpdated = {
      ...installment,
      amountPaid: (installment.amountPaid || 0) + enteredAmount,
      status: isFullSettlement ? "paid" : "partial",
      paymentMode,
      receiptNo,
      transactionRef: payload.transactionRef,
      paidAt: collectionTimestamp,
      collectionNotes: notes,
    };

    const finalReceipt = {
      receiptNo,
      studentId: installment.studentId,
      studentName: installment.studentName,
      studentPhone: installment.studentPhone,
      studentEmail: installment.studentEmail,
      courseName: installment.courseName,
      cohortName: installment.cohortName,
      installmentTitle: installment.installmentTitle,
      amountPaid: enteredAmount,
      totalCourseFee: installment.totalCourseFee || installment.amountDue,
      priorPaid: installment.priorPaid || 0,
      paymentMode,
      transactionRef: payload.transactionRef,
      paidAt: collectionTimestamp,
      counselorName: currentUser?.name || installment.counselorName || "Accounts Desk",
      collectionNotes: notes,
    };

    // Update localStorage custom collections
    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("skillyards_custom_installments") || "[]");
        const filtered = stored.filter((i) => i.id !== installment.id);
        localStorage.setItem(
          "skillyards_custom_installments",
          JSON.stringify([finalUpdated, ...filtered])
        );

        // Also synchronize with skillyards_custom_admissions if present
        const admissions = JSON.parse(localStorage.getItem("skillyards_custom_admissions") || "[]");
        const admIdx = admissions.findIndex(
          (a) => a.studentId === installment.studentId || a.studentPhone === installment.studentPhone
        );
        if (admIdx !== -1) {
          const adm = admissions[admIdx];
          const newTotalPaid = (Number(adm.amountPaid) || 0) + enteredAmount;
          const newBal = Math.max(0, (Number(adm.totalAmount) || 0) - newTotalPaid);
          admissions[admIdx] = {
            ...adm,
            amountPaid: newTotalPaid,
            balanceDue: newBal,
            paymentStatus: newBal === 0 ? "fully_paid" : adm.paymentStatus,
          };
          localStorage.setItem("skillyards_custom_admissions", JSON.stringify(admissions));
        }
      } catch (_) {}
    }

    setIsSubmitting(false);
    onClose();
    if (onCollected) {
      onCollected(finalUpdated, finalReceipt);
    }
  };

  if (!isOpen || !plan) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative w-full max-w-lg bg-[#FAF6EE] rounded-2xl shadow-2xl border border-[rgba(71,86,87,0.22)] overflow-hidden my-8">
        
        {/* Cockpit Header */}
        <div className="bg-[#0c1316] text-white px-6 py-4 flex items-center justify-between border-b border-[rgba(98,146,158,0.2)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2E7559]/20 border border-[#2E7559]/40 flex items-center justify-center text-[#2E7559]">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wide">Record Installment Payment</h2>
              <p className="text-[11px] text-[#7E939A]">Financial Accounts & Tuition Settlement</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#7E939A] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-[#1C2527]">
          
          {/* Candidate Info Pill */}
          <div className="p-3.5 bg-white rounded-xl border border-[rgba(71,86,87,0.16)] flex items-start justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-[#7E939A] tracking-wider">Candidate</span>
              <p className="font-bold text-sm text-[#1C2527]">{installment.studentName}</p>
              <p className="text-[11px] text-[#5A6E71] font-mono">{installment.studentId} • {installment.studentPhone}</p>
            </div>
            <div className="text-right space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-[#7E939A] tracking-wider">Milestone</span>
              <p className="font-bold text-xs text-[#4A6D7C]">{installment.installmentTitle}</p>
              <p className="text-[11px] text-[#B07238] font-bold">
                Due: ₹{currentDue.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1C2527] flex items-center justify-between">
              <span>Collection Amount (INR) *</span>
              <span className="text-[11px] text-[#5A6E71]">
                Max Due: ₹{currentDue.toLocaleString("en-IN")}
              </span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#5A6E71]">
                ₹
              </span>
              <input
                type="number"
                required
                min="1"
                max={currentDue}
                value={amountToCollect}
                onChange={(e) => setAmountToCollect(e.target.value)}
                placeholder="e.g. 20135"
                className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-white border border-[rgba(71,86,87,0.24)] text-sm font-bold text-[#1C2527] focus:outline-none focus:ring-2 focus:ring-[#2E7559] focus:border-transparent transition-all"
              />
            </div>
            {remainingBalanceAfter > 0 && (
              <p className="text-[11px] text-[#B07238] font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                <span>Partial payment: ₹{remainingBalanceAfter.toLocaleString("en-IN")} will remain pending.</span>
              </p>
            )}
            {remainingBalanceAfter === 0 && enteredAmount > 0 && (
              <p className="text-[11px] text-[#2E7559] font-medium flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Full settlement: Milestone will be marked 100% Paid.</span>
              </p>
            )}
          </div>

          {/* Payment Mode Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1C2527]">Payment Mode *</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "upi", label: "UPI / QR", icon: "⚡" },
                { id: "net_banking", label: "NetBanking / NEFT", icon: "🏛️" },
                { id: "card", label: "Debit/Credit Card", icon: "💳" },
                { id: "cash", label: "Cash Voucher", icon: "💵" },
                { id: "cheque", label: "Cheque / DD", icon: "📜" },
                { id: "emi", label: "NBFC Direct Debit", icon: "🔄" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMode(m.id)}
                  className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                    paymentMode === m.id
                      ? "bg-[#0c1316] text-white border-[#0c1316] shadow-sm"
                      : "bg-white text-[#5A6E71] border-[rgba(71,86,87,0.18)] hover:bg-[#FAF6EE]"
                  }`}
                >
                  <span>{m.icon}</span>
                  <span className="truncate">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Transaction Reference & Payment Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1C2527]">Bank UTR / Ref No *</label>
              <input
                type="text"
                required
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="e.g. UPI-91823901"
                className="w-full px-3 py-2 rounded-xl bg-white border border-[rgba(71,86,87,0.2)] text-xs font-mono text-[#1C2527] focus:outline-none focus:ring-1 focus:ring-[#2E7559]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1C2527]">Settlement Date *</label>
              <input
                type="date"
                required
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[rgba(71,86,87,0.2)] text-xs text-[#1C2527] focus:outline-none focus:ring-1 focus:ring-[#2E7559]"
              />
            </div>
          </div>

          {/* Collection Remarks */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1C2527]">Accounts Remarks / Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Received via GPay from student personal account"
              className="w-full px-3 py-2 rounded-xl bg-white border border-[rgba(71,86,87,0.2)] text-xs text-[#1C2527] focus:outline-none focus:ring-1 focus:ring-[#2E7559]"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-[rgba(71,86,87,0.16)] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-white hover:bg-[#FAF6EE] text-[#1C2527] border border-[rgba(71,86,87,0.2)] text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#2E7559] hover:bg-[#256149] text-white text-xs font-bold transition-all shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? "Processing Settlement..." : `Confirm & Collect ₹${enteredAmount.toLocaleString("en-IN")}`}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
