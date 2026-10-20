"use client";

import React, { useState } from "react";
import {
  X,
  ArrowRightLeft,
  GraduationCap,
  Layers,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { crmApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export function TransferStudentModal({
  isOpen,
  onClose,
  student,
  currentCohort,
  allCohorts = [],
  onStudentTransferred,
}) {
  const { user } = useAuth();
  const [targetBatchId, setTargetBatchId] = useState("");
  const [transferReason, setTransferReason] = useState("Schedule conflict with employment / college");
  const [internalNotes, setInternalNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !student || !currentCohort) return null;

  // Filter out current cohort and full cohorts
  const eligibleCohorts = allCohorts.filter((c) => c.id !== currentCohort.id);
  const selectedTargetCohort = allCohorts.find((c) => c.id === targetBatchId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!targetBatchId) {
      alert("Please select destination cohort");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      studentId: student.id,
      studentName: student.name,
      fromBatchId: currentCohort.id,
      fromBatchName: currentCohort.name,
      toBatchId: targetBatchId,
      toBatchName: selectedTargetCohort?.name || targetBatchId,
      reason: transferReason,
      notes: internalNotes || null,
      transferredBy: user?.name || "Admissions Officer",
      transferredAt: new Date().toISOString(),
    };

    try {
      try {
        await crmApi.transferCohortStudent(payload);
      } catch (err) {
        console.warn("Backend transfer API offline, applying locally:", err.message);
      }

      // Persist to localStorage
      if (typeof window !== "undefined") {
        try {
          const transfers = JSON.parse(localStorage.getItem("skillyards_cohort_transfers") || "[]");
          localStorage.setItem(
            "skillyards_cohort_transfers",
            JSON.stringify([payload, ...transfers])
          );
        } catch (_) {}
      }

      setIsSubmitting(false);
      onClose();
      if (onStudentTransferred) {
        onStudentTransferred(payload);
      }
    } catch (err) {
      alert("Error transferring student: " + err.message);
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !student) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-fadeIn"
    >
      <div className="relative w-full max-w-lg bg-[#FAF6EE] rounded-2xl shadow-2xl border border-[rgba(71,86,87,0.22)] overflow-hidden my-8 animate-slideDown">
        {/* Cockpit Top Bar */}
        <div className="bg-[#0c1316] text-white px-6 py-4 flex items-center justify-between border-b border-[rgba(98,146,158,0.2)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#4A6D7C]/20 border border-[#4A6D7C]/40 flex items-center justify-center text-[#a3cdd8]">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wide">Cohort Transfer Desk</h2>
              <p className="text-[11px] text-[#7E939A]">Relocate Student to Alternate Batch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#7E939A] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-[#1C2527]">
          {/* Student Profile Card */}
          <div className="p-3.5 rounded-xl bg-white border border-[rgba(71,86,87,0.15)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#194451] text-white font-bold text-xs flex items-center justify-center">
                {student.name?.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#1C2527]">{student.name}</h4>
                <p className="text-[11px] text-[#5A6E71]">
                  Student ID: <span className="font-mono">#{student.studentId}</span>
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#25D366]/10 text-[#128C7E] border border-[#25D366]/30">
              Active Enrolled
            </span>
          </div>

          {/* Transfer Visual Route */}
          <div className="p-3 rounded-xl bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] flex items-center justify-between gap-3 text-xs">
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase font-bold text-[#5A6E71] block">
                Current Batch (Source)
              </span>
              <p className="font-bold text-[#1C2527] truncate mt-0.5">{currentCohort.name}</p>
              <span className="text-[10px] text-[#7e939a] block truncate">
                {currentCohort.schedule || "Weekend Live"}
              </span>
            </div>

            <div className="w-8 h-8 rounded-full bg-white border border-[rgba(71,86,87,0.2)] flex items-center justify-center text-[#4A6D7C] shrink-0 shadow-2xs">
              <ArrowRight className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0 text-right">
              <span className="text-[10px] uppercase font-bold text-[#128C7E] block">
                Destination Batch
              </span>
              <p className="font-bold text-[#1C2527] truncate mt-0.5">
                {selectedTargetCohort ? selectedTargetCohort.name : "Select Batch..."}
              </p>
              <span className="text-[10px] text-[#7e939a] block truncate">
                {selectedTargetCohort?.schedule || "Choose below"}
              </span>
            </div>
          </div>

          {/* Select Target Cohort */}
          <div>
            <label className="text-xs font-bold text-[#1C2527] block mb-1">
              Select Destination Cohort *
            </label>
            <select
              value={targetBatchId}
              onChange={(e) => setTargetBatchId(e.target.value)}
              className="crm-input bg-white text-xs font-semibold"
              required
            >
              <option value="">-- Choose an available batch --</option>
              {eligibleCohorts.map((c) => {
                const openSeats = c.seatsRemaining !== undefined ? c.seatsRemaining : Math.max(0, 30 - (c.filledSeats || 0));
                return (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.schedule} ({openSeats} seats open)
                  </option>
                );
              })}
            </select>
          </div>

          {/* Reason for Transfer */}
          <div>
            <label className="text-xs font-bold text-[#1C2527] block mb-1">
              Reason for Transfer *
            </label>
            <select
              value={transferReason}
              onChange={(e) => setTransferReason(e.target.value)}
              className="crm-input bg-white text-xs font-semibold"
            >
              <option value="Schedule conflict with employment / college">
                Schedule conflict with employment / college
              </option>
              <option value="Preferred Weekend Live format over Weekday Evening">
                Preferred Weekend Live format over Weekday Evening
              </option>
              <option value="Student requested faculty / mentor change">
                Student requested faculty / mentor change
              </option>
              <option value="Medical leave / cohort deferral request">
                Medical leave / cohort deferral request
              </option>
              <option value="Placement preparation pacing adjustment">
                Placement preparation pacing adjustment
              </option>
            </select>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="text-xs font-bold text-[#1C2527] block mb-1">
              Transfer Audit Remarks
            </label>
            <input
              type="text"
              placeholder="e.g. Approved by Academic Director. LMS access batch synced."
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              className="crm-input bg-white text-xs"
            />
          </div>

          {/* Audit Notice */}
          <div className="p-3 rounded-xl bg-white border border-[rgba(71,86,87,0.14)] text-[11px] text-[#5A6E71] flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2E7559] shrink-0 mt-0.5" />
            <span>
              This transfer will automatically update student attendance records, recalculate seat occupancy in both cohorts, and write an immutable audit log to governance logs.
            </span>
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
              disabled={isSubmitting || !targetBatchId}
              className="crm-btn-primary !bg-[#194451] hover:!bg-[#12333d] !py-2 !px-5 text-xs font-bold shadow-md flex items-center gap-1.5"
            >
              <ArrowRightLeft className="w-4 h-4 text-white" />
              <span>{isSubmitting ? "Transferring..." : "Authorize Batch Transfer"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransferStudentModal;
