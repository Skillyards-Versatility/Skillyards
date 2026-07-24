"use client";

import { useState } from "react";
import { Calendar, ChevronDown, Sparkles } from "lucide-react";
import { getIstDate } from "@/lib/ist";

export function DatePresetSelector({ startDate, endDate, setStartDate, setEndDate }) {
  const [activePreset, setActivePreset] = useState("today");
  const [showCustomInputs, setShowCustomInputs] = useState(false);

  const getIstToday = () => {
    return getIstDate();
  };

  const calculatePreset = (presetKey) => {
    const todayStr = getIstToday();
    const todayDate = new Date(todayStr + "T00:00:00Z");

    if (presetKey === "today") {
      setStartDate(todayStr);
      setEndDate(todayStr);
      setShowCustomInputs(false);
    } else if (presetKey === "yesterday") {
      const y = new Date(todayDate);
      y.setUTCDate(y.getUTCDate() - 1);
      const yStr = y.toISOString().split("T")[0];
      setStartDate(yStr);
      setEndDate(yStr);
      setShowCustomInputs(false);
    } else if (presetKey === "prev2day") {
      const p2 = new Date(todayDate);
      p2.setUTCDate(p2.getUTCDate() - 2);
      const p2Str = p2.toISOString().split("T")[0];
      setStartDate(p2Str);
      setEndDate(p2Str);
      setShowCustomInputs(false);
    } else if (presetKey === "last7") {
      const l7 = new Date(todayDate);
      l7.setUTCDate(l7.getUTCDate() - 6);
      setStartDate(l7.toISOString().split("T")[0]);
      setEndDate(todayStr);
      setShowCustomInputs(false);
    } else if (presetKey === "last30") {
      const l30 = new Date(todayDate);
      l30.setUTCDate(l30.getUTCDate() - 29);
      setStartDate(l30.toISOString().split("T")[0]);
      setEndDate(todayStr);
      setShowCustomInputs(false);
    } else if (presetKey === "custom") {
      setShowCustomInputs(true);
    }
  };

  const handlePresetClick = (presetKey) => {
    setActivePreset(presetKey);
    calculatePreset(presetKey);
  };

  const presets = [
    { key: "today", label: "Today" },
    { key: "yesterday", label: "Yesterday" },
    { key: "prev2day", label: "Prev to Prev" },
    { key: "last7", label: "7 Days" },
    { key: "last30", label: "30 Days" },
    { key: "custom", label: "Custom" },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
      {/* Scrollable Segmented Pills */}
      <div className="flex items-center gap-1 bg-muted/60 dark:bg-slate-900/60 backdrop-blur-md p-1 rounded-2xl border border-border/60 shadow-inner overflow-x-auto custom-scrollbar no-scrollbar max-w-full">
        {presets.map((p) => {
          const isActive = activePreset === p.key;
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => handlePresetClick(p.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 ${
                isActive
                  ? "bg-background text-primary shadow-sm ring-1 ring-border/50 font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/40"
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Custom Date Picker Inputs Container */}
      <div className="flex items-center gap-2 bg-background border border-border/60 rounded-2xl px-3 py-1.5 shadow-2xs">
        <Calendar className="h-4 w-4 text-primary shrink-0" />
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <input
            type="date"
            className="bg-transparent border-none text-xs font-semibold text-foreground focus:ring-0 p-0 w-[100px] cursor-pointer"
            value={startDate}
            onChange={(e) => {
              setActivePreset("custom");
              setStartDate(e.target.value);
            }}
          />
          <span className="text-muted-foreground font-bold text-[11px] uppercase tracking-wider">to</span>
          <input
            type="date"
            className="bg-transparent border-none text-xs font-semibold text-foreground focus:ring-0 p-0 w-[100px] cursor-pointer"
            value={endDate}
            onChange={(e) => {
              setActivePreset("custom");
              setEndDate(e.target.value);
            }}
          />
        </div>
      </div>
    </div>
  );
}
