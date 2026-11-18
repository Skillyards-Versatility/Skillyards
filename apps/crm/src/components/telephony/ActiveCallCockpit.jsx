"use client";

import React, { useState } from "react";
import {
  PhoneOff,
  Mic,
  MicOff,
  Pause,
  Play,
  Grid,
  Radio,
  Clock,
  ShieldCheck,
  Disc,
  FileEdit,
  Zap,
} from "lucide-react";
import { useTelephony } from "@/context/TelephonyContext";
import { playDtmfTone } from "@/lib/telephonyAudio";

// Format seconds into MM:SS
function formatTimer(totalSecs) {
  const m = Math.floor(totalSecs / 60);
  const s = totalSecs % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function ActiveCallCockpit() {
  const {
    callState,
    activeCall,
    callDuration,
    isMuted,
    isOnHold,
    audioBars,
    hasMicPermission,
    quickNotes,
    setQuickNotes,
    hangupCall,
    toggleMute,
    toggleHold,
  } = useTelephony();

  const [showInCallKeypad, setShowInCallKeypad] = useState(false);
  const [showQuickNoteBox, setShowQuickNoteBox] = useState(false);

  if (!activeCall) return null;

  const handleInCallKey = (key) => {
    playDtmfTone(key);
  };

  return (
    <div className="flex flex-col items-center p-4 text-white select-none animate-fadeIn">
      {/* =========================================================================
          1. RECORDING & WEBRTC TELEMETRY BANNER (High Visibility)
          ========================================================================= */}
      <div className="w-full flex items-center justify-between mb-3 px-2 py-1.5 rounded-xl bg-[#080d0f]/90 border border-white/10 text-[10.5px]">
        {/* Recording Badge */}
        <div className="flex items-center gap-1.5">
          {callState === "CONNECTED" ? (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-rose-500/15 border border-rose-500/30 text-rose-400 font-semibold tracking-wide">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-80" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </span>
              <span>REC</span>
              <span className="font-mono text-[10px] text-rose-300">
                {formatTimer(callDuration)}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-[#8ca4ac]">
              <Disc className="w-3 h-3 text-[#D97706] animate-spin" />
              <span>Initializing Call...</span>
            </div>
          )}
        </div>

        {/* Carrier & Encryption Stats */}
        <div className="flex items-center gap-1.5 text-[#8ca4ac] font-mono text-[10px]">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3 h-3" />
            <span>Opus HD</span>
          </span>
          <span className="text-white/20">•</span>
          <span className="text-[#a5cbd5]">24ms</span>
        </div>
      </div>

      {/* =========================================================================
          2. CANDIDATE PROFILE AVATAR & INFO
          ========================================================================= */}
      <div className="relative mb-3 flex flex-col items-center">
        <div className="relative">
          <div
            className={`w-15 h-15 rounded-2xl bg-gradient-to-br from-[#D97706] to-[#F59E0B] text-white flex items-center justify-center font-bold text-xl uppercase shadow-lg border-2 transition-all duration-300 ${
              callState === "CONNECTED" && !isOnHold && !isMuted
                ? "border-emerald-400 shadow-emerald-500/20 scale-102"
                : "border-[#D97706]/40"
            }`}
          >
            {activeCall.name ? activeCall.name[0] : "P"}
          </div>

          {/* Pulsing indicator when ringing / connected */}
          {callState === "CONNECTED" && !isOnHold && (
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-[#10b981] border-2 border-[#0c1316]" />
            </span>
          )}
        </div>

        <h3 className="mt-2 text-sm font-bold text-white tracking-wide truncate max-w-[220px]">
          {activeCall.name}
        </h3>
        <p className="text-[11px] font-mono text-[#8ca4ac]">{activeCall.phone}</p>
        <div className="mt-1 px-2.5 py-0.5 rounded-full bg-[#D97706]/15 border border-[#D97706]/30 text-[10.5px] text-[#F59E0B] font-medium truncate max-w-[240px]">
          {activeCall.courseInterest}
        </div>
      </div>

      {/* =========================================================================
          3. CALL STATUS DISPLAY & LIVE TIMER
          ========================================================================= */}
      <div className="w-full my-2 p-3 rounded-2xl bg-[#080d0f] border border-white/10 flex flex-col items-center justify-center shadow-inner">
        {callState === "DIALING" && (
          <div className="flex flex-col items-center gap-1.5 py-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#D97706] animate-pulse">
              <Radio className="w-4 h-4 animate-spin text-[#D97706]" />
              <span>Routing carrier WebRTC line...</span>
            </div>
            <span className="text-[10px] text-[#7e939a] font-mono">Connecting Skillyards SIP gateway</span>
          </div>
        )}

        {callState === "RINGING" && (
          <div className="flex flex-col items-center gap-1.5 py-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#D97706]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D97706] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D97706]" />
              </span>
              <span className="animate-pulse">Ringing student handset...</span>
            </div>
            <span className="text-[10px] text-[#7e939a] font-mono">Waiting for pickup</span>
          </div>
        )}

        {callState === "CONNECTED" && (
          <div className="flex flex-col items-center gap-1 w-full">
            {/* Live Timer */}
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#10b981]" />
              <span className="font-mono text-2xl font-black tracking-widest text-white drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                {formatTimer(callDuration)}
              </span>
            </div>

            {/* Live Audio Spectrum Equalizer (WebRTC Audio Stream Reactive) */}
            <div className="flex items-end justify-center gap-1 h-6 w-full px-4 mt-1">
              {audioBars.map((heightPct, idx) => (
                <span
                  key={idx}
                  style={{ height: `${isOnHold ? 20 : isMuted ? 8 : Math.max(12, heightPct)}%` }}
                  className={`w-1 rounded-full transition-all duration-100 ${
                    isOnHold
                      ? "bg-[#eab308]/60"
                      : isMuted
                      ? "bg-rose-500/40"
                      : "bg-gradient-to-t from-emerald-500 to-[#10b981]"
                  }`}
                />
              ))}
            </div>

            {/* Sub-status label */}
            <div className="mt-1 flex items-center gap-1.5 text-[10px]">
              {isOnHold ? (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold uppercase tracking-wider">
                  Call On Hold • Melody Playing
                </span>
              ) : isMuted ? (
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold uppercase tracking-wider">
                  Microphone Muted (Track Disabled)
                </span>
              ) : (
                <span className="text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {hasMicPermission
                    ? "Live Browser Mic Active"
                    : "Encrypted HD Voice Channel Active"}
                </span>
              )}
            </div>
          </div>
        )}

        {callState === "ENDED" && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 py-2">
            <span>Call Disconnected • Saving session...</span>
          </div>
        )}
      </div>

      {/* =========================================================================
          4. IN-CALL SCRATCHPAD / QUICK NOTES (Collapsible)
          ========================================================================= */}
      {showQuickNoteBox && callState === "CONNECTED" && (
        <div className="w-full mb-3 p-2 rounded-xl bg-[#080d0f] border border-[#D97706]/30 animate-fadeIn">
          <div className="flex items-center justify-between mb-1 text-[11px] text-[#D97706] font-semibold">
            <span>In-Call Live Notes</span>
            <span className="text-[10px] text-[#7e939a]">Transfers to Disposition</span>
          </div>
          <textarea
            value={quickNotes}
            onChange={(e) => setQuickNotes(e.target.value)}
            placeholder="e.g. Candidate asking about installment options, wants 7:30 PM batch..."
            rows={2}
            className="w-full p-1.5 text-xs rounded-lg bg-black/40 border border-white/10 text-white placeholder-[#57686A] focus:outline-none focus:border-[#D97706]"
          />
        </div>
      )}

      {/* =========================================================================
          5. IN-CALL DTMF KEYPAD (Collapsible)
          ========================================================================= */}
      {showInCallKeypad && (
        <div className="grid grid-cols-3 gap-1.5 mb-3 w-full animate-fadeIn">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleInCallKey(num)}
              className="h-8 rounded-lg bg-white/5 hover:bg-white/15 text-xs font-bold text-white transition-all active:scale-95 border border-white/10"
            >
              {num}
            </button>
          ))}
        </div>
      )}

      {/* =========================================================================
          6. IN-CALL CONTROL COCKPIT ACTIONS
          ========================================================================= */}
      <div className="flex items-center justify-center gap-2.5 w-full mt-1">
        {/* Mute Button */}
        <button
          type="button"
          onClick={toggleMute}
          disabled={callState !== "CONNECTED"}
          title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
          className={`w-11 h-11 rounded-2xl flex flex-col items-center justify-center transition-all duration-150 active:scale-95 shadow-md ${
            isMuted
              ? "bg-rose-500/25 border border-rose-500/60 text-rose-400 shadow-rose-950/40"
              : "bg-white/5 hover:bg-white/10 border border-white/10 text-[#8ca4ac] hover:text-white"
          }`}
        >
          {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Hold Button */}
        <button
          type="button"
          onClick={toggleHold}
          disabled={callState !== "CONNECTED"}
          title={isOnHold ? "Resume Call" : "Put on Hold (Play Music)"}
          className={`w-11 h-11 rounded-2xl flex flex-col items-center justify-center transition-all duration-150 active:scale-95 shadow-md ${
            isOnHold
              ? "bg-amber-500/25 border border-amber-500/60 text-amber-300 shadow-amber-950/40"
              : "bg-white/5 hover:bg-white/10 border border-white/10 text-[#8ca4ac] hover:text-white"
          }`}
        >
          {isOnHold ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
        </button>

        {/* In-Call Notes Toggle */}
        <button
          type="button"
          onClick={() => setShowQuickNoteBox((prev) => !prev)}
          title="Toggle In-Call Live Notes"
          className={`w-11 h-11 rounded-2xl flex flex-col items-center justify-center transition-all duration-150 active:scale-95 shadow-md ${
            showQuickNoteBox || quickNotes
              ? "bg-[#D97706]/25 border border-[#D97706]/60 text-[#F59E0B]"
              : "bg-white/5 hover:bg-white/10 border border-white/10 text-[#8ca4ac] hover:text-white"
          }`}
        >
          <FileEdit className="w-4 h-4" />
        </button>

        {/* In-Call Keypad Toggle */}
        <button
          type="button"
          onClick={() => setShowInCallKeypad((prev) => !prev)}
          title="Toggle DTMF Dialpad"
          className={`w-11 h-11 rounded-2xl flex flex-col items-center justify-center transition-all duration-150 active:scale-95 shadow-md ${
            showInCallKeypad
              ? "bg-white/20 border border-white/40 text-white"
              : "bg-white/5 hover:bg-white/10 border border-white/10 text-[#8ca4ac] hover:text-white"
          }`}
        >
          <Grid className="w-4 h-4" />
        </button>

        {/* Hang Up Button (Prominent & Accessible) */}
        <button
          type="button"
          onClick={hangupCall}
          title="Hang Up & Complete Call"
          className="w-13 h-11 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white flex items-center justify-center shadow-lg shadow-red-950/50 border border-rose-400/40 transition-all duration-150 active:scale-95 cursor-pointer ml-0.5"
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
