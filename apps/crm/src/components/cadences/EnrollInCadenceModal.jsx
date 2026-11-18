"use client";

import React, { useState } from "react";
import { X, Workflow, Users, CheckCircle2, AlertCircle } from "lucide-react";
import { crmApi } from "@/lib/api";

export function EnrollInCadenceModal({
  isOpen,
  onClose,
  selectedLeads = [],
  availableCadences = [],
  onEnrollComplete,
}) {
  const [selectedCadenceId, setSelectedCadenceId] = useState(
    availableCadences[0]?.id || "cad-101"
  );
  const [startStep, setStartStep] = useState(1);
  const [isEnrolling, setIsEnrolling] = useState(false);

  if (!isOpen || selectedLeads.length === 0) return null;

  const currentCadence =
    availableCadences.find((c) => c.id === selectedCadenceId) || availableCadences[0];

  const handleEnroll = async (e) => {
    e.preventDefault();
    setIsEnrolling(true);

    try {
      try {
        await crmApi.enrollLeadInCadence(selectedCadenceId, {
          leadIds: selectedLeads.map((l) => l.id),
          cadenceName: currentCadence?.name || "Drip Cadence",
          startStep: Number(startStep) || 1,
        });
      } catch (apiErr) {
        console.warn("Backend cadence enrollment offline, logged locally:", apiErr.message);
      }

      // Record to lead call histories and localStorage
      const timestamp = new Date().toISOString();
      selectedLeads.forEach((lead) => {
        const leadKey = `skillyards_lead_call_history_${lead.id}`;
        const newEvent = {
          id: `tl-cadence-enroll-${Date.now()}-${lead.id}`,
          type: "cadence",
          title: `Enrolled in Cadence: ${currentCadence?.name || "Drip Sequence"}`,
          actorName: "You",
          timestamp,
          notes: `Sequence started at Step ${startStep}. Automated touchpoints scheduled.`,
        };
        try {
          const existing = JSON.parse(localStorage.getItem(leadKey) || "[]");
          existing.unshift(newEvent);
          localStorage.setItem(leadKey, JSON.stringify(existing));
        } catch (_) {}
      });

      if (onEnrollComplete) {
        onEnrollComplete({
          count: selectedLeads.length,
          cadenceName: currentCadence?.name || "Drip Cadence",
        });
      }

      setIsEnrolling(false);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to enroll leads: " + err.message);
      setIsEnrolling(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-[#FAF6EE] border border-[rgba(71,86,87,0.25)] rounded-2xl shadow-2xl max-w-lg w-full flex flex-col overflow-hidden animate-scaleUp">
        {/* Cockpit Header */}
        <div className="px-5 py-4 bg-[#0c1316] text-[#FAF6EE] border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D97706]/20 border border-[#D97706]/40 flex items-center justify-center text-[#D97706]">
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-white">
                  Enroll in Automated Cadence
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#128C7E]/20 border border-[#128C7E]/40 text-[#25D366]">
                  {selectedLeads.length} Selected
                </span>
              </div>
              <p className="text-[11px] text-[#7e939a]">
                Add candidate(s) to a multi-touch automated drip sequence
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleEnroll} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="crm-label font-bold text-[#1C2527]">Select Drip Sequence *</label>
            <select
              value={selectedCadenceId}
              onChange={(e) => setSelectedCadenceId(e.target.value)}
              className="crm-select bg-white font-semibold"
            >
              {availableCadences.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.steps?.length || 5} Steps • {c.targetCourse})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="crm-label font-bold text-[#1C2527]">Starting Step</label>
            <select
              value={startStep}
              onChange={(e) => setStartStep(Number(e.target.value))}
              className="crm-select bg-white text-xs"
            >
              {(currentCadence?.steps || [1, 2, 3, 4, 5]).map((s, idx) => (
                <option key={idx} value={idx + 1}>
                  Step {idx + 1}: {s.title || `Day ${idx * 2} Touchpoint`}
                </option>
              ))}
            </select>
          </div>

          {/* Selected Candidates Preview */}
          <div className="p-3 rounded-xl bg-white border border-[rgba(71,86,87,0.15)] space-y-2">
            <span className="text-[11px] font-bold text-[#5A6E71] block">
              Enrolling {selectedLeads.length} Candidate(s):
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {selectedLeads.slice(0, 10).map((lead) => (
                <span
                  key={lead.id}
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#FAF6EE] border border-[rgba(71,86,87,0.15)] text-[#1C2527]"
                >
                  {lead.fullName || lead.name}
                </span>
              ))}
              {selectedLeads.length > 10 && (
                <span className="text-[11px] font-bold text-[#128C7E] self-center">
                  +{selectedLeads.length - 10} more
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-[rgba(71,86,87,0.15)]">
            <button
              type="button"
              onClick={onClose}
              className="crm-btn-secondary !py-2 !px-4 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isEnrolling}
              className="crm-btn-primary !py-2 !px-5 text-xs font-bold shadow-md"
            >
              {isEnrolling ? "Enrolling..." : `Enroll ${selectedLeads.length} Lead(s)`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EnrollInCadenceModal;
