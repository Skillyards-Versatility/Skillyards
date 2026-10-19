"use client";

import React, { useState } from "react";
import {
  PhoneCall,
  ChevronDown,
  Clock,
  History,
  Grid,
  PhoneForwarded,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useTelephony } from "@/context/TelephonyContext";
import { DialerPad } from "./DialerPad";
import { ActiveCallCockpit } from "./ActiveCallCockpit";
import { CallDispositionModal } from "./CallDispositionModal";

// Format seconds into MM:SS
function formatTimer(totalSecs) {
  const m = Math.floor(totalSecs / 60);
  const s = totalSecs % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function formatCallTime(isoStr) {
  try {
    const d = new Date(isoStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "Recent";
  }
}

export function SoftphoneDrawer() {
  const {
    callState,
    callDuration,
    isSoftphoneOpen,
    recentCalls,
    startCall,
    openSoftphone,
    closeSoftphone,
    setIsSoftphoneOpen,
  } = useTelephony();

  const [activeTab, setActiveTab] = useState("keypad"); // "keypad" | "recent"

  const isCallActive = ["DIALING", "RINGING", "CONNECTED", "ENDED"].includes(callState);

  return (
    <>
      {/* =========================================================================
          1. FLOATING DOCKED TRIGGER PILL (Bottom-Right, Always Visible)
          ========================================================================= */}
      {!isSoftphoneOpen && (
        <div className="fixed bottom-4 right-20 sm:right-24 z-30 animate-fadeIn">
          <button
            type="button"
            onClick={openSoftphone}
            title="Open Telecalling Softphone"
            className={`flex items-center gap-2.5 px-3.5 py-2 rounded-full shadow-2xl border backdrop-blur-md transition-all duration-200 active:scale-95 cursor-pointer ${
              isCallActive
                ? "bg-[#0c1316] text-white border-emerald-500/50 shadow-emerald-950/40 ring-2 ring-emerald-500/30"
                : "bg-[#0c1316]/95 hover:bg-[#0c1316] text-[#FAF6EE] border-[rgba(98,146,158,0.25)] hover:border-[rgba(98,146,158,0.45)]"
            }`}
          >
            <div className="relative">
              <PhoneCall className={`w-4 h-4 ${isCallActive ? "text-[#10b981] animate-bounce" : "text-[#62929e]"}`} />
              <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${isCallActive ? "bg-[#10b981] animate-ping" : "bg-[#10b981]"}`} />
            </div>

            <span className="text-xs font-bold tracking-wide">
              {isCallActive ? "Call in Progress" : "Dialer"}
            </span>

            {isCallActive ? (
              <span className="font-mono text-xs font-bold text-[#10b981] px-1.5 py-0.2 rounded bg-emerald-950/60 border border-emerald-500/30">
                {formatTimer(callDuration)}
              </span>
            ) : (
              <span className="text-[10px] font-semibold text-[#7e939a] uppercase">Ready</span>
            )}
          </button>
        </div>
      )}

      {/* =========================================================================
          2. EXPANDED SOFTPHONE WINDOW (Docked Bottom-Right)
          ========================================================================= */}
      {isSoftphoneOpen && (
        <div className="fixed bottom-4 right-4 sm:right-6 z-40 w-[320px] sm:w-[350px] bg-[#0c1316] border border-[rgba(98,146,158,0.25)] rounded-2xl shadow-2xl overflow-hidden flex flex-col text-white animate-fadeIn select-none backdrop-blur-xl">
          {/* Header Bar */}
          <div className="h-13 px-4 bg-[#080d0f] border-b border-[rgba(98,146,158,0.18)] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-[rgba(98,146,158,0.18)] border border-[rgba(98,146,158,0.35)] flex items-center justify-center text-[#62929e] shrink-0">
                <PhoneCall className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold tracking-wide text-white truncate">
                    Skillyards Softphone
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] shadow-[0_0_6px_#10b981]" />
                </div>
                <div className="text-[10px] text-[#7e939a] font-medium flex items-center gap-1">
                  <span>WebRTC Telecom Gateway</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSoftphoneOpen(false)}
              title="Minimize Softphone"
              className="p-1.5 rounded-lg text-[#7e939a] hover:text-white hover:bg-[rgba(98,146,158,0.15)] transition-colors active:scale-90"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Sub-Header Tabs (Visible when IDLE) */}
          {!isCallActive && callState !== "DISPOSITION" && (
            <div className="flex border-b border-[rgba(98,146,158,0.14)] bg-[#0c1316]">
              <button
                type="button"
                onClick={() => setActiveTab("keypad")}
                className={`flex-1 py-2 flex items-center justify-center gap-1.5 text-xs font-semibold transition-all border-b-2 ${
                  activeTab === "keypad"
                    ? "text-[#62929e] border-[#62929e] bg-[rgba(98,146,158,0.08)]"
                    : "text-[#7e939a] border-transparent hover:text-white"
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Dialpad</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("recent")}
                className={`flex-1 py-2 flex items-center justify-center gap-1.5 text-xs font-semibold transition-all border-b-2 ${
                  activeTab === "recent"
                    ? "text-[#62929e] border-[#62929e] bg-[rgba(98,146,158,0.08)]"
                    : "text-[#7e939a] border-transparent hover:text-white"
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Recent Calls</span>
                <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[9px] font-mono">
                  {recentCalls.length}
                </span>
              </button>
            </div>
          )}

          {/* Main Softphone Content Area */}
          <div className="bg-[#0f171a] overflow-hidden">
            {isCallActive ? (
              <ActiveCallCockpit />
            ) : activeTab === "keypad" ? (
              <DialerPad />
            ) : (
              /* Recent Calls Log Screen */
              <div className="p-3 max-h-[380px] overflow-y-auto space-y-1.5 text-xs">
                {recentCalls.length === 0 ? (
                  <div className="text-center py-8 text-[#7e939a] text-xs">
                    No recent calls logged yet
                  </div>
                ) : (
                  recentCalls.map((rc) => (
                    <div
                      key={rc.id}
                      className="p-2.5 rounded-xl bg-[#080d0f] border border-[rgba(98,146,158,0.15)] hover:border-[rgba(98,146,158,0.3)] transition-colors flex items-center justify-between"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-white truncate text-xs">
                            {rc.name}
                          </span>
                          <span className="text-[10px] text-[#7e939a] font-mono">
                            {formatCallTime(rc.timestamp)}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#7e939a] font-mono truncate">
                          {rc.phone}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[rgba(98,146,158,0.15)] text-[#a3cdd8] font-medium">
                            {rc.courseInterest}
                          </span>
                          <span className="text-[10px] text-[#57686A]">
                            {rc.duration ? `${rc.duration}s` : "0s"}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          startCall({
                            leadId: rc.leadId,
                            name: rc.name,
                            phone: rc.phone,
                            courseInterest: rc.courseInterest,
                          })
                        }
                        title={`Redial ${rc.name}`}
                        className="p-2 rounded-xl bg-[#2E7559]/20 hover:bg-[#2E7559] text-[#10b981] hover:text-white border border-[#2E7559]/30 transition-all active:scale-90 cursor-pointer shrink-0"
                      >
                        <PhoneForwarded className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          3. MANDATORY POST-CALL DISPOSITION MODAL (Surfaced when call ends)
          ========================================================================= */}
      {callState === "DISPOSITION" && <CallDispositionModal />}
    </>
  );
}
