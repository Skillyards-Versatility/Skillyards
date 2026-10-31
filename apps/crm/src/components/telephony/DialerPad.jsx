"use client";

import React, { useState, useMemo } from "react";
import { Phone, Delete, User, Sparkles } from "lucide-react";
import { playDtmfTone } from "@/lib/telephonyAudio";
import { useTelephony } from "@/context/TelephonyContext";

// Standard telephone dial keys with alpha sub-labels
const KEYS = [
  { char: "1", sub: "" },
  { char: "2", sub: "ABC" },
  { char: "3", sub: "DEF" },
  { char: "4", sub: "GHI" },
  { char: "5", sub: "JKL" },
  { char: "6", sub: "MNO" },
  { char: "7", sub: "PQRS" },
  { char: "8", sub: "TUV" },
  { char: "9", sub: "WXYZ" },
  { char: "*", sub: "+" },
  { char: "0", sub: "OPER" },
  { char: "#", sub: "" },
];

// Sample known leads for live auto-lookup match
const KNOWN_PROSPECTS = [
  { name: "Aarav Sharma", phone: "9876543210", course: "Full Stack MERN" },
  { name: "Rohan Patel", phone: "9811122233", course: "Data Science & AI" },
  { name: "Pooja Mehta", phone: "9988776655", course: "Cybersecurity" },
  { name: "Sneha Reddy", phone: "9123456780", course: "Cloud DevOps" },
  { name: "Divya Nair", phone: "9876500001", course: "UI/UX Design" },
];

export function DialerPad() {
  const { startCall } = useTelephony();
  const [inputNumber, setInputNumber] = useState("");

  const handleKeyPress = (char) => {
    playDtmfTone(char);
    setInputNumber((prev) => prev + char);
  };

  const handleBackspace = () => {
    setInputNumber((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setInputNumber("");
  };

  // Instant lead match as user types
  const matchedProspect = useMemo(() => {
    const clean = inputNumber.replace(/\D/g, "");
    if (clean.length < 4) return null;
    return KNOWN_PROSPECTS.find((p) => p.phone.includes(clean)) || null;
  }, [inputNumber]);

  const handleDial = () => {
    if (!inputNumber.trim()) return;

    startCall({
      leadId: matchedProspect ? `lead-${matchedProspect.phone}` : `custom-${Date.now()}`,
      name: matchedProspect ? matchedProspect.name : "Direct Prospect",
      phone: inputNumber.trim(),
      courseInterest: matchedProspect ? matchedProspect.course : "Course Consultation",
    });
  };

  return (
    <div className="flex flex-col p-4 text-[#FAF6EE] select-none">
      {/* Number Display Screen */}
      <div className="relative mb-3.5 bg-[#080d0f] border border-[rgba(98,146,158,0.2)] rounded-xl p-3 flex flex-col items-center justify-center min-h-[68px]">
        {matchedProspect && (
          <div className="flex items-center gap-1.5 mb-1 px-2 py-0.5 rounded-full bg-[#D97706]/15 border border-[#D97706]/30 text-[10.5px] text-[#F6E3CC] font-medium animate-fadeIn">
            <User className="w-3 h-3 text-[#D97706]" />
            <span className="font-semibold">{matchedProspect.name}</span>
            <span className="opacity-60">•</span>
            <span className="truncate max-w-[110px]">{matchedProspect.course}</span>
          </div>
        )}

        <div className="flex items-center justify-between w-full px-1">
          <input
            type="text"
            value={inputNumber}
            onChange={(e) => setInputNumber(e.target.value)}
            placeholder="Dial number or paste..."
            className="w-full bg-transparent text-center text-xl font-mono font-semibold tracking-wider text-white placeholder-[#57686A] focus:outline-none"
          />

          {inputNumber && (
            <button
              type="button"
              onClick={handleBackspace}
              title="Backspace"
              className="p-1 rounded-md text-[#7e939a] hover:text-white hover:bg-[rgba(98,146,158,0.15)] transition-colors active:scale-95"
            >
              <Delete className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 3x4 Touch Keypad Grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {KEYS.map((k) => (
          <button
            key={k.char}
            type="button"
            onClick={() => handleKeyPress(k.char)}
            className="h-12 rounded-xl bg-white/5 hover:bg-white/15 active:bg-[#D97706]/20 border border-white/10 hover:border-[#D97706]/40 flex flex-col items-center justify-center transition-all duration-100 active:scale-95 shadow-sm group cursor-pointer"
          >
            <span className="text-lg font-bold text-white group-hover:text-[#D97706] transition-colors leading-tight">
              {k.char}
            </span>
            {k.sub ? (
              <span className="text-[9px] font-semibold text-[#7e939a] group-hover:text-[#F59E0B] tracking-widest uppercase">
                {k.sub}
              </span>
            ) : (
              <span className="h-[10px]" />
            )}
          </button>
        ))}
      </div>

      {/* Action Row: Speed Match Pill + Call Button */}
      <div className="flex items-center gap-2">
        {matchedProspect && (
          <button
            type="button"
            onClick={() => setInputNumber(matchedProspect.phone)}
            className="flex-1 flex items-center justify-center gap-1.5 h-11 px-3 rounded-xl bg-[#D97706]/15 hover:bg-[#D97706]/25 border border-[#D97706]/30 text-xs text-[#F6E3CC] font-semibold transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            <span className="truncate">Auto-Fill {matchedProspect.name}</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleDial}
          disabled={!inputNumber.trim()}
          className={`flex-1 flex items-center justify-center gap-2 h-11 rounded-xl text-white font-bold text-sm tracking-wide shadow-lg transition-all duration-150 active:scale-95 ${
            inputNumber.trim()
              ? "bg-[#2E7559] hover:bg-[#25634b] hover:shadow-emerald-950/40 border border-emerald-400/40 cursor-pointer"
              : "bg-[#182327] text-[#485b61] border border-transparent cursor-not-allowed"
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>Call Prospect</span>
        </button>
      </div>
    </div>
  );
}
