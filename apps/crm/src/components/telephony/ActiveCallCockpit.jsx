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
  Sparkles,
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
    hangupCall,
    toggleMute,
    toggleHold,
  } = useTelephony();

  const [showInCallKeypad, setShowInCallKeypad] = useState(false);

  if (!activeCall) return null;

  const handleInCallKey = (key) => {
    playDtmfTone(key);
  };

  return (
    <div className="flex flex-col items-center p-5 text-white select-none">
      {/* Candidate Profile Avatar & Header */}
      <div className="relative mb-3 flex flex-col items-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#4A6D7C] to-[#62929E] text-white flex items-center justify-center font-bold text-xl uppercase shadow-lg border-2 border-[rgba(98,146,158,0.4)]">
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

        <h3 className="mt-2 text-base font-bold text-white tracking-wide truncate max-w-[220px]">
          {activeCall.name}
        </h3>
        <p className="text-xs font-mono text-[#8ca4ac]">{activeCall.phone}</p>
        <div className="mt-1 px-2.5 py-0.5 rounded-full bg-[rgba(98,146,158,0.15)] border border-[rgba(98,146,158,0.3)] text-[10.5px] text-[#a5cbd5] font-medium">
          {activeCall.courseInterest}
        </div>
      </div>

      {/* Call State & Live Timer Display */}
      <div className="w-full my-3 p-3 rounded-xl bg-[#080d0f] border border-[rgba(98,146,158,0.2)] flex flex-col items-center justify-center">
        {callState === "DIALING" && (
          <div className="flex items-center gap-2 text-xs font-semibold text-[#62929e] animate-pulse">
            <Radio className="w-4 h-4 animate-spin" />
            <span>Connecting carrier line...</span>
          </div>
        )}

        {callState === "RINGING" && (
          <div className="flex items-center gap-2 text-xs font-semibold text-[#62929e]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#62929e] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#62929e]" />
            </span>
            <span className="animate-pulse">Ringing prospect phone...</span>
          </div>
        )}

        {callState === "CONNECTED" && (
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#10b981]" />
              <span className="font-mono text-xl font-bold tracking-widest text-[#10b981]">
                {formatTimer(callDuration)}
              </span>
            </div>

            {/* Audio Wave Bars Visualizer (Simulated voice activity) */}
            <div className="flex items-center gap-1 h-3 mt-1">
              {[40, 70, 95, 60, 80, 45, 90, 30].map((h, i) => (
                <span
                  key={i}
                  style={{ height: `${isOnHold ? 20 : h}%` }}
                  className={`w-1 rounded-full transition-all duration-300 ${
                    isOnHold ? "bg-[#7e939a]" : "bg-[#10b981] animate-pulse"
                  }`}
                />
              ))}
            </div>

            {isOnHold && (
              <span className="text-[10px] font-bold text-[#eab308] tracking-wider uppercase mt-1">
                Call On Hold
              </span>
            )}
            {isMuted && !isOnHold && (
              <span className="text-[10px] font-bold text-[#f87171] tracking-wider uppercase mt-1">
                Microphone Muted
              </span>
            )}
          </div>
        )}

        {callState === "ENDED" && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#f87171]">
            <span>Call disconnected</span>
          </div>
        )}
      </div>

      {/* In-Call Keypad (Collapsible overlay) */}
      {showInCallKeypad && (
        <div className="grid grid-cols-3 gap-1.5 mb-3 w-full animate-fadeIn">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleInCallKey(num)}
              className="h-8 rounded-lg bg-[rgba(98,146,158,0.12)] hover:bg-[rgba(98,146,158,0.25)] text-xs font-bold text-white transition-all active:scale-95"
            >
              {num}
            </button>
          ))}
        </div>
      )}

      {/* In-Call Control Buttons */}
      <div className="flex items-center justify-center gap-3 w-full mt-1">
        {/* Mute Button */}
        <button
          type="button"
          onClick={toggleMute}
          disabled={callState !== "CONNECTED"}
          title={isMuted ? "Unmute" : "Mute Microphone"}
          className={`w-11 h-11 rounded-2xl flex flex-col items-center justify-center transition-all duration-150 active:scale-95 shadow-md ${
            isMuted
              ? "bg-[#C3473C]/20 border border-[#C3473C]/50 text-[#f87171]"
              : "bg-[rgba(98,146,158,0.1)] hover:bg-[rgba(98,146,158,0.2)] border border-[rgba(98,146,158,0.2)] text-[#8ca4ac] hover:text-white"
          }`}
        >
          {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Hold Button */}
        <button
          type="button"
          onClick={toggleHold}
          disabled={callState !== "CONNECTED"}
          title={isOnHold ? "Resume Call" : "Put on Hold"}
          className={`w-11 h-11 rounded-2xl flex flex-col items-center justify-center transition-all duration-150 active:scale-95 shadow-md ${
            isOnHold
              ? "bg-[#eab308]/20 border border-[#eab308]/50 text-[#facc15]"
              : "bg-[rgba(98,146,158,0.1)] hover:bg-[rgba(98,146,158,0.2)] border border-[rgba(98,146,158,0.2)] text-[#8ca4ac] hover:text-white"
          }`}
        >
          {isOnHold ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
        </button>

        {/* In-Call Dialpad Toggle */}
        <button
          type="button"
          onClick={() => setShowInCallKeypad((prev) => !prev)}
          title="Toggle DTMF Keypad"
          className={`w-11 h-11 rounded-2xl flex flex-col items-center justify-center transition-all duration-150 active:scale-95 shadow-md ${
            showInCallKeypad
              ? "bg-[rgba(98,146,158,0.3)] border border-[rgba(98,146,158,0.5)] text-white"
              : "bg-[rgba(98,146,158,0.1)] hover:bg-[rgba(98,146,158,0.2)] border border-[rgba(98,146,158,0.2)] text-[#8ca4ac] hover:text-white"
          }`}
        >
          <Grid className="w-4 h-4" />
        </button>

        {/* Hang Up Button (Prominent Red) */}
        <button
          type="button"
          onClick={hangupCall}
          title="Hang Up Call"
          className="w-14 h-11 rounded-2xl bg-[#C3473C] hover:bg-[#a8352b] text-white flex items-center justify-center shadow-lg shadow-red-950/40 border border-red-400/40 transition-all duration-150 active:scale-95 cursor-pointer ml-1"
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
