"use client";

import React, { useState } from "react";
import {
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  PhoneCall,
  User,
  GraduationCap,
  CalendarClock,
} from "lucide-react";
import { useTelephony } from "@/context/TelephonyContext";

const OUTCOMES = [
  {
    id: "connected",
    label: "Connected / Spoke",
    desc: "Spoke with prospect & explained course curriculum",
    badge: "bg-[#2E7559]/20 text-[#10b981] border-[#2E7559]/40",
  },
  {
    id: "counselling_booked",
    label: "Counselling Scheduled",
    desc: "Candidate agreed to admissions 1-on-1 counseling",
    badge: "bg-[#D97706]/20 text-[#D97706] border-[#D97706]/40",
  },
  {
    id: "callback_requested",
    label: "Callback Requested",
    desc: "Prospect asked to call back at a specific time",
    badge: "bg-[#B07238]/20 text-[#f59e0b] border-[#B07238]/40",
  },
  {
    id: "no_answer",
    label: "Ringing / No Answer",
    desc: "Phone rang full duration; no answer",
    badge: "bg-slate-700/30 text-slate-300 border-slate-600/40",
  },
  {
    id: "busy",
    label: "Line Busy / Engaged",
    desc: "Line was engaged or call waiting",
    badge: "bg-amber-900/20 text-amber-300 border-amber-700/40",
  },
  {
    id: "invalid_number",
    label: "Invalid / Switched Off",
    desc: "Number unreachable or disconnected",
    badge: "bg-rose-950/20 text-rose-300 border-rose-800/40",
  },
  {
    id: "not_interested",
    label: "Not Interested / Drop",
    desc: "Candidate explicitly declined enrollment",
    badge: "bg-red-950/20 text-red-300 border-red-800/40",
  },
];

const QUICK_TAGS = [
  "Interested in MERN",
  "Fee breakdown shared",
  "Needs parent approval",
  "Working professional - weekend batch",
  "Job guarantee enquiry",
  "Scholarship test requested",
];

function formatDuration(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

export function CallDispositionModal() {
  const { activeCall, callDuration, submitDisposition } = useTelephony();

  const [selectedOutcome, setSelectedOutcome] = useState(
    callDuration > 10 ? "connected" : "no_answer"
  );
  const [notes, setNotes] = useState("");
  const [callbackDate, setCallbackDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [callbackTime, setCallbackTime] = useState("16:00");

  if (!activeCall) return null;

  const handleQuickTag = (tag) => {
    setNotes((prev) => (prev ? `${prev}. ${tag}` : tag));
  };

  const handleSave = (e) => {
    e.preventDefault();

    let callbackAt = null;
    if (selectedOutcome === "callback_requested" && callbackDate && callbackTime) {
      callbackAt = new Date(`${callbackDate}T${callbackTime}:00`).toISOString();
    }

    submitDisposition({
      outcome: selectedOutcome,
      notes: notes.trim(),
      callbackAt,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-[#FAF6EE] text-[#1C2527] rounded-2xl shadow-2xl border border-[rgba(71,86,87,0.2)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Dark Cockpit Header */}
        <div className="px-5 py-3.5 bg-[#0c1316] text-white border-b border-[rgba(98,146,158,0.2)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D97706]/20 border border-[#D97706]/40 flex items-center justify-center text-[#D97706]">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">
                Log Call Outcome & Notes
              </h2>
              <p className="text-[11px] text-[#7e939a]">
                Mandatory post-call disposition to credit daily EOD targets
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#D97706]/15 border border-[#D97706]/30 text-xs font-mono font-semibold text-[#D97706]">
            <Clock className="w-3.5 h-3.5 text-[#10b981]" />
            <span>{formatDuration(callDuration)}</span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Candidate Card Summary */}
          <div className="p-3 rounded-xl bg-white border border-[rgba(71,86,87,0.14)] flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D97706] to-[#F59E0B] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                {activeCall.name ? activeCall.name[0] : "P"}
              </div>
              <div>
                <div className="font-bold text-[#1C2527] text-sm">{activeCall.name}</div>
                <div className="text-[11px] text-[#57686A] font-mono">{activeCall.phone}</div>
              </div>
            </div>
            <div className="text-right">
              <span className="px-2 py-0.5 rounded-full bg-[#D97706]/10 border border-[#D97706]/25 text-[10.5px] font-semibold text-[#92400E]">
                {activeCall.courseInterest}
              </span>
            </div>
          </div>

          {/* Disposition Outcome Selector */}
          <div>
            <label className="block text-[11px] font-bold text-[#2E3A3C] uppercase tracking-wider mb-2">
              Select Call Outcome <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {OUTCOMES.map((item) => {
                const isSelected = selectedOutcome === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedOutcome(item.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all duration-150 flex items-start justify-between cursor-pointer ${
                      isSelected
                        ? "bg-[#D97706]/12 border-[#D97706] shadow-sm ring-1 ring-[#D97706]"
                        : "bg-white border-[rgba(71,86,87,0.14)] hover:border-[rgba(71,86,87,0.3)]"
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-[#1C2527] text-xs leading-snug">
                        {item.label}
                      </div>
                      <div className="text-[10px] text-[#57686A] mt-0.5 leading-tight">
                        {item.desc}
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-[#D97706] shrink-0 ml-1.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conditional Callback Scheduler if 'callback_requested' */}
          {selectedOutcome === "callback_requested" && (
            <div className="p-3.5 rounded-xl bg-[rgba(176,114,56,0.1)] border border-[rgba(176,114,56,0.3)] space-y-2.5 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-bold text-[#B07238]">
                <CalendarClock className="w-4 h-4" />
                <span>Schedule Callback Reminder</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10.5px] font-semibold text-[#2E3A3C] mb-1">
                    Callback Date
                  </label>
                  <input
                    type="date"
                    value={callbackDate}
                    onChange={(e) => setCallbackDate(e.target.value)}
                    required
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[rgba(71,86,87,0.2)] text-xs text-[#1C2527] focus:outline-none focus:ring-1 focus:ring-[#B07238]"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] font-semibold text-[#2E3A3C] mb-1">
                    Callback Time
                  </label>
                  <input
                    type="time"
                    value={callbackTime}
                    onChange={(e) => setCallbackTime(e.target.value)}
                    required
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[rgba(71,86,87,0.2)] text-xs text-[#1C2527] focus:outline-none focus:ring-1 focus:ring-[#B07238]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Discussion Notes Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-[#2E3A3C] uppercase tracking-wider">
                Call Discussion Notes
              </label>
              <span className="text-[10px] text-[#57686A]">Auto-attaches to lead history</span>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Record candidate feedback, objections, fee discussion, or commitments made..."
              className="w-full p-2.5 rounded-xl bg-white border border-[rgba(71,86,87,0.2)] text-xs text-[#1C2527] placeholder-[#7E939A] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
            />

            {/* Quick Tags Pills */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {QUICK_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleQuickTag(tag)}
                  className="px-2 py-0.5 rounded-md bg-white border border-[rgba(71,86,87,0.15)] text-[10.5px] text-[#2E3A3C] hover:bg-[#D97706]/10 hover:border-[#D97706]/30 transition-colors"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Submit Action */}
          <div className="pt-2 flex items-center justify-between border-t border-[rgba(71,86,87,0.12)]">
            <div className="text-[10.5px] text-[#57686A]">
              EOD Target Effect: <span className="font-bold text-[#1C2527]">+1 Dial</span>
              {callDuration >= 15 && (
                <span className="font-bold text-[#2E7559] ml-1.5">+1 Connect ({callDuration}s)</span>
              )}
            </div>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2E7559] hover:bg-[#25634b] text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Complete Call</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
