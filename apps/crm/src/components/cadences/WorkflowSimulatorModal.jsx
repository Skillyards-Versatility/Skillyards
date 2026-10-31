"use client";

import React, { useState } from "react";
import {
  X,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  MessageSquare,
  Smartphone,
  Phone,
  Zap,
  User,
  ArrowRight,
  Sparkles,
  PhoneCall,
} from "lucide-react";
import { useTelephony } from "@/context/TelephonyContext";

const SAMPLE_LEADS = [
  { id: "lead-101", name: "Aarav Sharma", phone: "+91 98765 43210", course: "Full Stack Web Development (MERN)" },
  { id: "lead-102", name: "Rohan Patel", phone: "+91 98111 22233", course: "Data Science & Applied AI" },
  { id: "lead-103", name: "Pooja Mehta", phone: "+91 99887 76655", course: "UI/UX Product Design" },
  { id: "lead-104", name: "Divya Nair", phone: "+91 98765 00001", course: "Cloud DevOps Engineering" },
];

export function WorkflowSimulatorModal({ isOpen, onClose, onSimulationSuccess }) {
  const { startCall } = useTelephony();
  const [selectedLead, setSelectedLead] = useState(SAMPLE_LEADS[0]);
  const [simulationState, setSimulationState] = useState("IDLE"); // 'IDLE' | 'RUNNING' | 'COMPLETED'
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [executionLogs, setExecutionLogs] = useState([]);

  if (!isOpen) return null;

  const handleStartSimulation = () => {
    setSimulationState("RUNNING");
    setActiveStepIndex(1);
    setExecutionLogs([
      {
        time: "0.0s",
        text: `⚡ Trigger Fired: New Website Enquiry captured for ${selectedLead.name} (${selectedLead.course})`,
        type: "trigger",
      },
    ]);

    // Step 1: Immediate WhatsApp Brochure
    setTimeout(() => {
      setActiveStepIndex(2);
      setExecutionLogs((prev) => [
        ...prev,
        {
          time: "0.8s",
          text: `🟢 Step 1 Dispatched: WhatsApp Welcome + Curriculum Syllabus PDF sent to ${selectedLead.phone}`,
          preview: `Hi ${selectedLead.name}! 🚀 Welcome to Skillyards. Here is the complete curriculum brochure for ${selectedLead.course}: https://portal.skillyards.com/brochure.pdf`,
          type: "whatsapp",
        },
      ]);
    }, 1200);

    // Step 2: Next Day 11 AM Demo SMS
    setTimeout(() => {
      setActiveStepIndex(3);
      setExecutionLogs((prev) => [
        ...prev,
        {
          time: "2.2s",
          text: `📱 Step 2 Dispatched: Next Day 11:00 AM SMS Demo Class VIP Pass delivered`,
          preview: `Hi ${selectedLead.name}, your VIP seat for tomorrow's Live Project Masterclass is confirmed! Claim access: skillyards.com/demo`,
          type: "sms",
        },
      ]);
    }, 2500);

    // Step 3: Condition Check (No student response after 48h)
    setTimeout(() => {
      setActiveStepIndex(4);
      setExecutionLogs((prev) => [
        ...prev,
        {
          time: "3.6s",
          text: `❓ Step 3 Condition Check: Did student reply or book demo? ➔ FALSE (Lead silent for 48 hours)`,
          type: "condition",
        },
      ]);
    }, 3800);

    // Step 4: Auto-Create Urgent Callback Task in Telecaller Softphone Queue
    setTimeout(() => {
      setActiveStepIndex(5);
      const taskId = `task-drip-${Date.now()}`;
      const newTask = {
        id: taskId,
        leadId: selectedLead.id,
        leadName: selectedLead.name,
        phone: selectedLead.phone,
        course: selectedLead.course,
        dueAt: new Date().toISOString(),
        status: "pending",
        priority: "high",
        assignedTo: "Self",
        notes: "Automated Drip Cadence Trigger: Student received syllabus & demo SMS but is silent. Urgent phone outreach required.",
      };

      // Save to follow-ups desk so it shows up in CRM
      try {
        const stored = JSON.parse(localStorage.getItem("skillyards_custom_followups") || "[]");
        stored.unshift(newTask);
        localStorage.setItem("skillyards_custom_followups", JSON.stringify(stored));
      } catch (_) {}

      setExecutionLogs((prev) => [
        ...prev,
        {
          time: "4.8s",
          text: `📞 Step 4 Action: Auto-created HIGH PRIORITY Call Task in Telecaller Softphone Queue!`,
          taskCreated: newTask,
          type: "call",
        },
      ]);

      setSimulationState("COMPLETED");
      if (onSimulationSuccess) {
        onSimulationSuccess(selectedLead, newTask);
      }
    }, 5000);
  };

  const handleReset = () => {
    setSimulationState("IDLE");
    setActiveStepIndex(0);
    setExecutionLogs([]);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && simulationState !== "RUNNING") onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md animate-fadeIn"
    >
      <div className="bg-[#FAF6EE] text-[#1C2527] border border-[rgba(71,86,87,0.25)] rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden animate-scaleUp max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-[#0c1316] text-white border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D97706]/20 border border-[#D97706]/40 flex items-center justify-center text-[#D97706]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-white">
                  Live Drip Automation Simulator
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30">
                  Interactive Test
                </span>
              </div>
              <p className="text-[11px] text-[#7e939a]">
                Test the exact automated sequence: Lead Created ➔ WhatsApp ➔ SMS ➔ Queue Call Task
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={simulationState === "RUNNING"}
            className="p-1.5 rounded-lg text-[#7e939a] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Target Student Selection */}
          <div className="p-4 rounded-xl bg-white border border-[rgba(71,86,87,0.15)] space-y-2.5">
            <label className="text-xs font-bold text-[#1C2527] uppercase tracking-wider block">
              1. Select Test Prospect for Trigger Simulation
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SAMPLE_LEADS.map((lead) => (
                <button
                  key={lead.id}
                  type="button"
                  disabled={simulationState === "RUNNING"}
                  onClick={() => setSelectedLead(lead)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                    selectedLead.id === lead.id
                      ? "bg-[#D97706]/10 border-[#D97706] text-[#1C2527] shadow-xs"
                      : "bg-[#FAF6EE] border-[rgba(71,86,87,0.15)] text-[#5A6E71] hover:text-[#1C2527]"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      selectedLead.id === lead.id
                        ? "bg-[#D97706] text-white"
                        : "bg-[rgba(71,86,87,0.12)] text-[#1C2527]"
                    }`}
                  >
                    {lead.name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-xs block truncate text-[#1C2527]">{lead.name}</span>
                    <span className="text-[10px] text-[#7e939a] block truncate font-mono">{lead.phone}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Workflow Sequence Steps Progress Bar */}
          <div className="p-4 rounded-xl bg-white border border-[rgba(71,86,87,0.15)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1C2527] uppercase tracking-wider">
                2. Automated Sequence Execution Steps
              </span>
              <span className="text-[11px] font-mono text-[#7e939a]">
                Step {activeStepIndex} of 5
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2 text-center text-[10.5px]">
              {[
                { title: "Trigger", desc: "New Lead" },
                { title: "Day 0", desc: "WhatsApp" },
                { title: "Day 1", desc: "Demo SMS" },
                { title: "Day 3", desc: "Check Reply" },
                { title: "Auto-Task", desc: "Queue Call" },
              ].map((step, idx) => {
                const isPassed = activeStepIndex > idx;
                const isCurrent = activeStepIndex === idx + 1 && simulationState === "RUNNING";

                return (
                  <div
                    key={idx}
                    className={`p-2 rounded-xl border transition-all ${
                      isCurrent
                        ? "bg-[#D97706]/15 border-[#D97706] text-[#D97706] shadow-xs animate-pulse font-bold"
                        : isPassed
                        ? "bg-[#10b981]/15 border-[#10b981]/40 text-[#10b981] font-bold"
                        : "bg-[#FAF6EE] border-[rgba(71,86,87,0.12)] text-[#7e939a]"
                    }`}
                  >
                    <span className="block font-bold text-xs">{step.title}</span>
                    <span className="text-[10px] block opacity-80">{step.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Execution Terminal / Logs Output */}
          <div className="p-4 rounded-xl bg-[#080d0f] text-white border border-white/10 space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between text-[#7e939a] pb-2 border-b border-white/10">
              <span className="text-[11px] font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
                Live Execution Console
              </span>
              <span>{executionLogs.length} events logged</span>
            </div>

            {executionLogs.length === 0 ? (
              <div className="py-8 text-center text-[#57686A]">
                Click "Run Test Workflow Execution" below to start simulation.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {executionLogs.map((log, idx) => (
                  <div key={idx} className="space-y-1 animate-fadeIn">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[#D97706] font-bold text-[10px]">[{log.time}]</span>
                      <span className="text-white text-[11px]">{log.text}</span>
                    </div>

                    {log.preview && (
                      <div className="ml-6 p-2 rounded-lg bg-white/5 border border-white/10 text-[10.5px] text-[#FAF6EE] font-sans italic">
                        "{log.preview}"
                      </div>
                    )}

                    {log.taskCreated && (
                      <div className="ml-6 p-2 rounded-lg bg-[#2E7559]/20 border border-[#2E7559]/40 text-[10.5px] text-[#10b981] flex items-center justify-between font-sans">
                        <span>✅ Task successfully injected into Dialer Queue & Follow-ups desk!</span>
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            startCall({
                              leadId: selectedLead.id,
                              name: selectedLead.name,
                              phone: selectedLead.phone,
                              courseInterest: selectedLead.course,
                            });
                          }}
                          className="px-2.5 py-1 rounded-md bg-[#2E7559] hover:bg-[#25634b] text-white font-bold flex items-center gap-1 text-[10px] cursor-pointer"
                        >
                          <PhoneCall className="w-3 h-3" />
                          <span>1-Click Call Now</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 bg-white border-t border-[rgba(71,86,87,0.15)] flex items-center justify-between shrink-0">
          {simulationState === "COMPLETED" ? (
            <button
              type="button"
              onClick={handleReset}
              className="crm-btn-secondary text-xs !py-2 !px-4"
            >
              Reset Simulation
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              disabled={simulationState === "RUNNING"}
              className="crm-btn-secondary text-xs !py-2 !px-4"
            >
              Cancel
            </button>
          )}

          <div className="flex items-center gap-2">
            {simulationState === "COMPLETED" && (
              <button
                type="button"
                onClick={onClose}
                className="crm-btn-primary text-xs !py-2 !px-5 font-bold"
              >
                Close & View Queue Tasks
              </button>
            )}

            {simulationState === "IDLE" && (
              <button
                type="button"
                onClick={handleStartSimulation}
                className="crm-btn-primary text-xs !py-2 !px-5 font-bold flex items-center gap-1.5 shadow-md"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Run Test Workflow Execution</span>
              </button>
            )}

            {simulationState === "RUNNING" && (
              <div className="flex items-center gap-2 text-xs font-bold text-[#D97706] animate-pulse">
                <Clock className="w-4 h-4 animate-spin" />
                <span>Simulating automated drip sequence...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
