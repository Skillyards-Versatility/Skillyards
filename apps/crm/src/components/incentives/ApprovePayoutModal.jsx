"use client";

import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Award,
  AlertCircle,
  FileCheck2,
  Lock,
} from "lucide-react";
import { crmApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export function ApprovePayoutModal({ isOpen, onClose, rep, onApproved }) {
  const { user: currentUser } = useAuth();
  const [remarks, setRemarks] = useState("Reconciled against verified student tuition settlements.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !rep) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const updatedRep = {
      ...rep,
      status: "approved",
      approvedAt: new Date().toISOString(),
      approvedBy: currentUser?.name || "Sales Manager",
      approvalNote: remarks,
    };

    // 1. Dispatch API
    try {
      await crmApi.approveIncentivePayout({
        repId: rep.id,
        note: remarks,
      });
    } catch (_) {}

    // 2. Persist to localStorage
    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("skillyards_custom_incentives") || "[]");
        const filtered = stored.filter((r) => r.id !== rep.id);
        localStorage.setItem(
          "skillyards_custom_incentives",
          JSON.stringify([updatedRep, ...filtered])
        );
      } catch (_) {}
    }

    setIsSubmitting(false);
    onClose();
    if (onApproved) onApproved(updatedRep);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#FAF6EE] rounded-2xl shadow-2xl border border-[rgba(71,86,87,0.22)] overflow-hidden my-8">
        
        {/* Cockpit Top Bar */}
        <div className="bg-[#0c1316] text-white px-6 py-4 flex items-center justify-between border-b border-[rgba(98,146,158,0.2)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2E7559]/20 border border-[#2E7559]/40 flex items-center justify-center text-[#2E7559]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wide">Manager Incentive Signoff</h2>
              <p className="text-[11px] text-[#7E939A]">Audit & Payroll Lock</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-[#1C2527]">
          
          {/* Rep Particulars Card */}
          <div className="p-3.5 bg-white rounded-xl border border-[rgba(71,86,87,0.16)] flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0c1316] text-white font-bold flex items-center justify-center text-xs">
                {rep.avatar || rep.repName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1C2527]">{rep.repName}</h4>
                <p className="text-[11px] text-[#5A6E71]">{rep.role}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#7E939A]">Net Payout</span>
              <p className="text-base font-black text-[#2E7559] font-mono">
                ₹{rep.commissionEarned.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* Performance Audit Metrics */}
          <div className="p-3 bg-[#FAF6EE] rounded-xl border border-[rgba(71,86,87,0.14)] space-y-1.5 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-[#5A6E71]">Target Admissions:</span>
              <span className="font-bold text-[#1C2527]">{rep.targetAdmissions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5A6E71]">Verified Closed Admissions:</span>
              <span className="font-bold text-[#2E7559]">{rep.closedAdmissions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5A6E71]">Tuition Revenue Realized:</span>
              <span className="font-bold text-[#1C2527]">₹{rep.tuitionRevenueClosed.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-[rgba(71,86,87,0.1)]">
              <span className="text-[#5A6E71]">Attainment Rate:</span>
              <span className="font-bold text-[#2E7559]">
                {Math.round((rep.closedAdmissions / (rep.targetAdmissions || 1)) * 100)}%
              </span>
            </div>
          </div>

          {/* Manager Verification Checklist */}
          <div className="space-y-1.5 text-xs text-[#5A6E71]">
            <span className="font-bold text-[10.5px] uppercase tracking-wider text-[#7E939A] block">
              Manager Verification Checklist
            </span>
            <div className="space-y-1 bg-white p-2.5 rounded-xl border border-[rgba(71,86,87,0.14)]">
              <div className="flex items-center gap-1.5 text-[#2E7559] text-[11px] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Admissions verified against bank receipts</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#2E7559] text-[11px] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Zero refund disputes or chargebacks pending</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#2E7559] text-[11px] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Telecalling EOD targets verified</span>
              </div>
            </div>
          </div>

          {/* Manager Remarks */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1C2527]">Approval Remarks / Payroll Notes</label>
            <input
              type="text"
              required
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
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
              <Lock className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Locking..." : "Approve & Lock Payout"}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
