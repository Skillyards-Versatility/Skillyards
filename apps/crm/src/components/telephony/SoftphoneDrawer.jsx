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
  Mic,
  MicOff,
  PhoneOff,
  Maximize2,
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
    activeCall,
    callDuration,
    isMuted,
    isSoftphoneOpen,
    recentCalls,
    startCall,
    hangupCall,
    toggleMute,
    openSoftphone,
    closeSoftphone,
    setIsSoftphoneOpen,
  } = useTelephony();

  const [activeTab, setActiveTab] = useState("keypad"); // "keypad" | "recent"

  const isCallActive = ["DIALING", "RINGING", "CONNECTED", "ENDED"].includes(callState);

  return (
    <>
      {/* =========================================================================
          1. FLOATING MINIMIZED CALL COCKPIT (Visible when minimized during active call)
          ========================================================================= */}
      {!isSoftphoneOpen && isCallActive && (
        <div
          onClick={() => setIsSoftphoneOpen(true)}
          className="fixed bottom-4 right-3 sm:right-6 z-50 px-4 py-2.5 rounded-2xl bg-[#0c1316] border border-[#D97706]/40 shadow-2xl flex items-center gap-3 text-white cursor-pointer hover:border-[#D97706] transition-all duration-150 backdrop-blur-xl animate-fadeIn group"
          title="Click to maximize call cockpit"
        >
          {/* Status & Name */}
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-80" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white truncate max-w-[110px]">
                  {activeCall?.name || "Active Call"}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-mono font-bold">
                  REC
                </span>
              </div>
              <div className="text-[10px] text-emerald-400 font-mono font-bold">
                {formatTimer(callDuration)}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div
            className="flex items-center gap-1 pl-2 border-l border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={toggleMute}
              title={isMuted ? "Unmute" : "Mute"}
              className={`p-1.5 rounded-lg transition-colors ${
                isMuted
                  ? "bg-rose-500/30 text-rose-300 border border-rose-500/40"
                  : "bg-white/10 text-[#8ca4ac] hover:text-white hover:bg-white/20"
              }`}
            >
              {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={hangupCall}
              title="Hang up"
              className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors"
            >
              <PhoneOff className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsSoftphoneOpen(true)}
              title="Expand window"
              className="p-1.5 rounded-lg text-[#8ca4ac] hover:text-white hover:bg-white/10"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          2. EXPANDED SOFTPHONE WINDOW (Docked Bottom-Right when opened)
          ========================================================================= */}
      {isSoftphoneOpen && (
        <div className="fixed bottom-4 right-3 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[350px] max-w-[360px] bg-[#0c1316] border border-[#D97706]/35 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-white animate-fadeIn select-none backdrop-blur-xl">
          {/* Header Bar */}
          <div className="h-13 px-4 bg-[#080d0f] border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-[#D97706]/20 border border-[#D97706]/40 flex items-center justify-center text-[#D97706] shrink-0">
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
              className="p-1.5 rounded-lg text-[#7e939a] hover:text-white hover:bg-white/10 transition-colors active:scale-90 cursor-pointer"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Sub-Header Tabs (Visible when IDLE) */}
          {!isCallActive && callState !== "DISPOSITION" && (
            <div className="flex border-b border-white/10 bg-[#0c1316]">
              <button
                type="button"
                onClick={() => setActiveTab("keypad")}
                className={`flex-1 py-2 flex items-center justify-center gap-1.5 text-xs font-semibold transition-all border-b-2 cursor-pointer ${
                  activeTab === "keypad"
                    ? "text-[#D97706] border-[#D97706] bg-[#D97706]/10"
                    : "text-[#7e939a] border-transparent hover:text-white"
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Dialpad</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("recent")}
                className={`flex-1 py-2 flex items-center justify-center gap-1.5 text-xs font-semibold transition-all border-b-2 cursor-pointer ${
                  activeTab === "recent"
                    ? "text-[#D97706] border-[#D97706] bg-[#D97706]/10"
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
                      className="p-2.5 rounded-xl bg-[#080d0f] border border-white/10 hover:border-[#D97706]/30 transition-colors flex items-center justify-between"
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
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#D97706]/15 text-[#F59E0B] font-medium">
                            {rc.courseInterest}
                          </span>
                          <span className="text-[10px] text-[#8ca4ac]">
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
