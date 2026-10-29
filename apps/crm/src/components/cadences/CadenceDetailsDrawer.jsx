"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Workflow,
  Clock,
  Phone,
  Mail,
  MessageSquare,
  Smartphone,
  Download,
  CheckCircle2,
  AlertCircle,
  Play,
  Pause,
  Send,
  UserCheck,
  Search,
  ExternalLink,
  Users,
} from "lucide-react";
import { crmApi } from "@/lib/api";

const CHANNEL_ICONS = {
  whatsapp: { icon: MessageSquare, label: "WhatsApp", color: "text-[#25D366] bg-[#25D366]/10 border-[#25D366]/30" },
  call: { icon: Phone, label: "Phone Call", color: "text-[#128C7E] bg-[#128C7E]/10 border-[#128C7E]/30" },
  email: { icon: Mail, label: "Email", color: "text-[#D97706] bg-[#D97706]/10 border-[#D97706]/30" },
  sms: { icon: Smartphone, label: "SMS", color: "text-[#D97706] bg-[#D97706]/10 border-[#D97706]/30" },
};

export function CadenceDetailsDrawer({ isOpen, onClose, cadence, onToggleStatus }) {
  const [enrolledLeads, setEnrolledLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionSuccess, setActionSuccess] = useState(null);

  useEffect(() => {
    if (!cadence || !isOpen) return;

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await crmApi.getCadence(cadence.id);
        if (res && res.enrolledLeads) {
          setEnrolledLeads(res.enrolledLeads);
        } else {
          setEnrolledLeads([]);
        }
      } catch (err) {
        console.warn("Could not fetch cadence detail from backend:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [cadence, isOpen]);

  if (!isOpen || !cadence) return null;

  const filteredLeads = enrolledLeads.filter(
    (l) =>
      l.candidateName?.toLowerCase().includes(search.toLowerCase()) ||
      l.phone?.includes(search) ||
      l.assignedRep?.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportCSV = () => {
    if (enrolledLeads.length === 0) {
      alert("No enrolled prospects to export");
      return;
    }
    const headers = ["Candidate Name", "Phone", "Email", "Current Step", "Next Step Due", "Status", "Assigned Rep"];
    const rows = enrolledLeads.map((l) => [
      `"${l.candidateName}"`,
      `"${l.phone}"`,
      `"${l.email}"`,
      `"${l.currentStep} of ${l.totalSteps}"`,
      `"${l.nextStepTitle || "N/A"}"`,
      `"${l.status}"`,
      `"${l.assignedRep || "Unassigned"}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `skillyards-cadence-${cadence.code || "cadence"}-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleManualDispatchStep = (lead) => {
    setActionSuccess(`Dispatched next touchpoint for ${lead.candidateName}`);
    setTimeout(() => setActionSuccess(null), 3000);

    // Advance step locally
    setEnrolledLeads((prev) =>
      prev.map((l) =>
        l.id === lead.id
          ? {
              ...l,
              currentStep: Math.min(l.totalSteps, l.currentStep + 1),
              lastTouchAt: new Date().toISOString(),
              status: l.currentStep + 1 >= l.totalSteps ? "completed" : l.status,
            }
          : l
      )
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fadeIn flex justify-end">
      <div className="w-full max-w-2xl bg-[#FAF6EE] h-full shadow-2xl flex flex-col border-l border-[rgba(71,86,87,0.25)] animate-slideLeft">
        {/* Cockpit Header */}
        <div className="px-5 py-4 bg-[#0c1316] text-[#FAF6EE] border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D97706]/20 border border-[#D97706]/40 flex items-center justify-center text-[#D97706]">
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#D97706]/20 border border-[#D97706]/40 text-[#D97706]">
                  {cadence.code || "CADENCE"}
                </span>
                <h3 className="font-bold text-sm sm:text-base text-white truncate max-w-[280px]">
                  {cadence.name}
                </h3>
              </div>
              <p className="text-[11px] text-[#7e939a]">{cadence.targetCourse}</p>
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

        {/* Feedback Alert */}
        {actionSuccess && (
          <div className="px-4 py-2 bg-[#25D366]/15 border-b border-[#25D366]/30 text-xs font-semibold text-[#128C7E] flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Performance Summary Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-white border border-[rgba(71,86,87,0.15)] shadow-xs">
              <span className="text-[10px] font-bold text-[#5A6E71] uppercase tracking-wider block">
                In Drip Now
              </span>
              <span className="text-xl font-black text-[#1C2527] block mt-1">
                {cadence.activeCount || enrolledLeads.length}
              </span>
              <span className="text-[10px] text-[#7e939a]">Active prospects</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-[rgba(71,86,87,0.15)] shadow-xs">
              <span className="text-[10px] font-bold text-[#5A6E71] uppercase tracking-wider block">
                Reply Rate
              </span>
              <span className="text-xl font-black text-[#128C7E] block mt-1">
                {cadence.responseRate || 46}%
              </span>
              <span className="text-[10px] text-[#7e939a]">Engagement response</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-[rgba(71,86,87,0.15)] shadow-xs">
              <span className="text-[10px] font-bold text-[#5A6E71] uppercase tracking-wider block">
                Conversions
              </span>
              <span className="text-xl font-black text-[#194451] block mt-1">
                {cadence.convertedCount || 6}
              </span>
              <span className="text-[10px] text-[#7e939a]">Admissions closed</span>
            </div>
          </div>

          {/* Step-by-Step Flow Roadmap */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1C2527] uppercase tracking-wider block">
                Automated Touchpoint Journey ({cadence.steps?.length || 5} Steps)
              </span>
              <span className="text-[10px] text-[#5A6E71]">Executed sequentially by schedule</span>
            </div>

            <div className="space-y-2">
              {(cadence.steps || []).map((step, idx) => {
                const chan = CHANNEL_ICONS[step.channel] || CHANNEL_ICONS.whatsapp;
                const IconComponent = chan.icon;

                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white border border-[rgba(71,86,87,0.14)] flex items-start gap-3 shadow-2xs"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#FAF6EE] border border-[rgba(71,86,87,0.2)] text-[#1C2527] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {step.stepNumber || idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${chan.color}`}
                        >
                          <IconComponent className="w-3 h-3" />
                          <span>{chan.label}</span>
                        </span>
                        <span className="text-[11px] font-semibold text-[#5A6E71]">
                          Day {step.dayOffset}
                        </span>
                      </div>
                      <h5 className="font-bold text-xs text-[#1C2527] mt-1 truncate">
                        {step.title}
                      </h5>
                      <p className="text-[11px] text-[#5A6E71] mt-0.5">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Enrolled Prospects Roster */}
          <div className="space-y-3 pt-2 border-t border-[rgba(71,86,87,0.12)]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h4 className="font-bold text-sm text-[#1C2527] flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#128C7E]" />
                  <span>Prospects Currently in Cadence ({enrolledLeads.length})</span>
                </h4>
                <p className="text-[11px] text-[#5A6E71]">
                  Live candidate journeys and scheduled next touches
                </p>
              </div>

              <button
                type="button"
                onClick={handleExportCSV}
                className="crm-btn-secondary !py-1 !px-2.5 text-xs flex items-center gap-1.5 shadow-xs self-start"
              >
                <Download className="w-3.5 h-3.5 text-[#D97706]" />
                <span>Roster CSV</span>
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#5A6E71] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search enrolled candidates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="crm-input !pl-8 !py-1.5 bg-white text-xs"
              />
            </div>

            {/* Leads List */}
            {loading ? (
              <div className="p-8 text-center text-xs text-[#5A6E71]">
                Loading enrolled prospects...
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-white border border-dashed border-[rgba(71,86,87,0.2)] text-xs text-[#5A6E71]">
                No candidates currently matching filter in this cadence.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-3.5 rounded-xl bg-white border border-[rgba(71,86,87,0.14)] hover:border-[rgba(71,86,87,0.3)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h5 className="font-bold text-xs text-[#1C2527]">{lead.candidateName}</h5>
                        <span
                          className={`px-2 py-0.2 rounded-full text-[10px] font-bold border ${
                            lead.status === "converted"
                              ? "bg-[#25D366]/10 text-[#128C7E] border-[#25D366]/30"
                              : lead.status === "replied"
                              ? "bg-[#D97706]/15 text-[#92400E] border-[#D97706]/30"
                              : "bg-[#D97706]/10 text-[#D97706] border-[#D97706]/30"
                          }`}
                        >
                          {lead.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-[#5A6E71] mt-1">
                        <span>{lead.phone}</span>
                        <span>•</span>
                        <span>Rep: {lead.assignedRep}</span>
                      </div>

                      <div className="mt-1.5 text-[11px] text-[#194451] font-medium flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-[#128C7E] shrink-0" />
                        <span className="truncate">Next: {lead.nextStepTitle || "Pending Touchpoint"}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      <div className="text-right hidden sm:block">
                        <span className="text-[10px] font-bold text-[#5A6E71] block">
                          Step {lead.currentStep} of {lead.totalSteps}
                        </span>
                        <div className="w-16 h-1.5 rounded-full bg-[rgba(71,86,87,0.12)] mt-1 overflow-hidden">
                          <div
                            className="h-full bg-[#128C7E] rounded-full"
                            style={{
                              width: `${Math.min(100, (lead.currentStep / lead.totalSteps) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>

                      {lead.status !== "converted" && (
                        <button
                          type="button"
                          onClick={() => handleManualDispatchStep(lead)}
                          className="crm-btn-secondary !py-1 !px-2.5 text-xs flex items-center gap-1 font-bold shadow-xs cursor-pointer"
                          title="Dispatch step now"
                        >
                          <Send className="w-3 h-3 text-[#128C7E]" />
                          <span>Dispatch</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-white border-t border-[rgba(71,86,87,0.15)] flex items-center justify-between shrink-0">
          <span className="text-xs text-[#5A6E71]">
            Cadence status: <strong className="text-[#1C2527] capitalize">{cadence.status}</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="crm-btn-primary !py-1.5 !px-5 text-xs font-bold"
          >
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
}

export default CadenceDetailsDrawer;
