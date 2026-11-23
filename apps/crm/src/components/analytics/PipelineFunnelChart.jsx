"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  BarChart3,
  Layers,
  Users,
  PhoneCall,
  ShieldCheck,
  GraduationCap,
  Award,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowDownRight,
  Clock,
  Zap,
} from "lucide-react";

const STAGE_META = [
  {
    icon: Users,
    gradient: "from-[#F59E0B] via-[#D97706] to-[#B45309]",
    fillColor: "#D97706",
    glowColor: "rgba(217, 119, 6, 0.35)",
    borderClass: "border-[#D97706]/35",
    bgClass: "bg-[#D97706]/10",
    textClass: "text-[#B45309]",
    velocity: "Intake velocity: ~15 mins response",
    tip: "Inbound leads require immediate dial within 5-15 mins for 3x higher connect rates.",
  },
  {
    icon: PhoneCall,
    gradient: "from-[#EA580C] via-[#C2410C] to-[#9A3412]",
    fillColor: "#C2410C",
    glowColor: "rgba(194, 65, 12, 0.35)",
    borderClass: "border-[#C2410C]/35",
    bgClass: "bg-[#C2410C]/10",
    textClass: "text-[#C2410C]",
    velocity: "Tele-connect: 2.1 dials per contact",
    tip: "If first call is unanswered, trigger instant WhatsApp Brochure drop to keep prospect warm.",
  },
  {
    icon: ShieldCheck,
    gradient: "from-[#475569] via-[#334155] to-[#1E293B]",
    fillColor: "#334155",
    glowColor: "rgba(51, 65, 85, 0.35)",
    borderClass: "border-[#475569]/35",
    bgClass: "bg-[#475569]/10",
    textClass: "text-[#334155]",
    velocity: "Qualification audit: 1.2 days avg",
    tip: "Verify candidate education background and career goal before booking 1-on-1 demo.",
  },
  {
    icon: GraduationCap,
    gradient: "from-[#348A69] via-[#2E7559] to-[#1e5842]",
    fillColor: "#2E7559",
    glowColor: "rgba(46, 117, 89, 0.35)",
    borderClass: "border-[#2E7559]/35",
    bgClass: "bg-[#2E7559]/10",
    textClass: "text-[#2E7559]",
    velocity: "Demo scheduling: 2.4 days avg",
    tip: "Bottleneck stage! Send automated 2-hour calendar invite & WhatsApp reminder to cut no-shows.",
  },
  {
    icon: CheckCircle2,
    gradient: "from-[#10B981] via-[#059669] to-[#047857]",
    fillColor: "#059669",
    glowColor: "rgba(5, 150, 105, 0.35)",
    borderClass: "border-[#059669]/35",
    bgClass: "bg-[#059669]/10",
    textClass: "text-[#059669]",
    velocity: "Fee settlement: 1.8 days avg",
    tip: "Offer 0% Interest EMI loan option (Liquiloans / Propelld) to close hesitation on tuition fees.",
  },
];

export function PipelineFunnelChart({
  stages = [],
  title = "Pipeline Stage-by-Stage Conversion Funnel",
  subtitle = "Tracks velocity, volume retention, and drop-off from initial web intake down to confirmed enrollment",
}) {
  const [viewMode, setViewMode] = useState("waterfall"); // "waterfall" | "stepped" | "matrix"
  const [selectedStageIdx, setSelectedStageIdx] = useState(3); // default highlight bottleneck stage (Counselling)

  if (!stages || stages.length === 0) {
    return null;
  }

  const overallConversion = stages[stages.length - 1]?.pct || 15.0;
  const totalVolume = stages[0]?.count || 680;
  const activeStage = stages[selectedStageIdx] || stages[0];
  const activeMeta = STAGE_META[selectedStageIdx] || STAGE_META[0];

  return (
    <div className="crm-table-box p-4 sm:p-5 lg:p-6 space-y-5">
      {/* =========================================================================
          HEADER BAR: Title, Subtitle, Overall Metric Badge & Chart Mode Switcher
          ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-[rgba(71,86,87,0.14)]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] text-white flex items-center justify-center shadow-xs">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-[#1C2527] tracking-tight">
              {title}
            </h3>
          </div>
          <p className="text-xs text-[#57686A] mt-0.5 max-w-2xl">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start lg:self-center flex-wrap">
          {/* Conversion Edge Badge */}
          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#2E7559]/15 to-[#10B981]/15 border border-[#2E7559]/30 text-xs font-bold text-[#1e5842] flex items-center gap-1.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#2E7559]" />
            <span>Admissions Yield: <strong>{overallConversion}%</strong></span>
          </span>

          {/* Mode Tabs */}
          <div className="flex items-center bg-[#F4E9D8] p-0.5 rounded-xl border border-[#D97706]/20">
            <button
              type="button"
              onClick={() => setViewMode("waterfall")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "waterfall"
                  ? "bg-white text-[#D97706] shadow-xs"
                  : "text-[#57686A] hover:text-[#1C2527]"
              }`}
              title="Interactive Waterfall Pillars"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Waterfall Flow</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("stepped")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "stepped"
                  ? "bg-white text-[#D97706] shadow-xs"
                  : "text-[#57686A] hover:text-[#1C2527]"
              }`}
              title="Stepped 3D Funnel"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">3D Funnel</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("matrix")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "matrix"
                  ? "bg-white text-[#D97706] shadow-xs"
                  : "text-[#57686A] hover:text-[#1C2527]"
              }`}
              title="Stage Metrics Table"
            >
              <Clock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Velocity Matrix</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          VIEW MODE 1: INTERACTIVE WATERFALL FLOW PILLARS
          ========================================================================= */}
      {viewMode === "waterfall" && (
        <div className="space-y-4">
          {/* Visual SVG Flow Diagram */}
          <div className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EB] to-[#F5ECE0] rounded-2xl p-4 sm:p-6 border border-[#D97706]/20 shadow-inner overflow-x-auto">
            {/* Background Stage Reference Grid Lines */}
            <div className="absolute inset-x-6 top-8 bottom-28 flex flex-col justify-between pointer-events-none opacity-40">
              <div className="border-b border-dashed border-[#7E9396]/30 flex justify-between text-[9px] text-[#7E9396] font-mono">
                <span>100% Intake</span>
                <span>{totalVolume} Leads</span>
              </div>
              <div className="border-b border-dashed border-[#7E9396]/30 flex justify-between text-[9px] text-[#7E9396] font-mono">
                <span>75% Benchmark</span>
                <span>{Math.round(totalVolume * 0.75)} Leads</span>
              </div>
              <div className="border-b border-dashed border-[#7E9396]/30 flex justify-between text-[9px] text-[#7E9396] font-mono">
                <span>50% Qualification</span>
                <span>{Math.round(totalVolume * 0.5)} Leads</span>
              </div>
              <div className="border-b border-dashed border-[#7E9396]/30 flex justify-between text-[9px] text-[#7E9396] font-mono">
                <span>25% Counselling</span>
                <span>{Math.round(totalVolume * 0.25)} Leads</span>
              </div>
            </div>

            {/* 5 Stages Waterfall Pillars Container */}
            <div className="relative min-w-[620px] h-64 flex items-end justify-between gap-3 pt-6 pb-2 z-10 px-2 sm:px-4">
              {stages.map((stage, idx) => {
                const meta = STAGE_META[idx] || STAGE_META[0];
                const Icon = meta.icon;
                const isSelected = selectedStageIdx === idx;
                const prevStage = idx > 0 ? stages[idx - 1] : null;
                const retentionFromPrev = prevStage
                  ? Math.round((stage.count / prevStage.count) * 100)
                  : 100;

                // Scale pillar height smoothly between 24% and 100% of available height
                const heightPct = Math.max(22, stage.pct);

                return (
                  <div
                    key={stage.stage}
                    onClick={() => setSelectedStageIdx(idx)}
                    className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group"
                  >
                    {/* Top Stat Badge (Volume & Retention) */}
                    <div
                      className={`mb-2 text-center transition-all duration-200 transform ${
                        isSelected ? "-translate-y-1 scale-105" : "group-hover:-translate-y-0.5"
                      }`}
                    >
                      <div className="font-mono font-black text-xs sm:text-sm text-[#1C2527]">
                        {stage.count.toLocaleString()}
                      </div>
                      <div
                        className={`inline-block px-1.5 py-0.2 rounded-md text-[10px] font-bold font-mono border ${
                          isSelected
                            ? "bg-[#D97706] text-white border-[#B45309] shadow-xs"
                            : "bg-white text-[#5A6E71] border-[rgba(71,86,87,0.18)]"
                        }`}
                      >
                        {stage.pct}%
                      </div>
                    </div>

                    {/* Proportional Waterfall Bar / Pillar */}
                    <div className="w-full max-w-[84px] relative flex flex-col justify-end">
                      {/* Connecting Drop Badge to next pillar (rendered between pillars) */}
                      {idx < stages.length - 1 && (
                        <div
                          className="absolute -right-4 sm:-right-5 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center pointer-events-none"
                          title={`Drop-off: ${stages[idx + 1].drop}`}
                        >
                          <div
                            className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold whitespace-nowrap shadow-xs border flex items-center gap-0.5 ${
                              idx === 2
                                ? "bg-rose-50 text-rose-700 border-rose-300 animate-pulse"
                                : "bg-white/95 text-[#7E9396] border-[rgba(71,86,87,0.2)]"
                            }`}
                          >
                            <ArrowDownRight className="w-2.5 h-2.5" />
                            <span>{stages[idx + 1].drop || "Drop"}</span>
                          </div>
                        </div>
                      )}

                      {/* Main Pillar Body */}
                      <div
                        style={{ height: `${heightPct * 1.6}px` }}
                        className={`w-full rounded-2xl bg-gradient-to-t ${meta.gradient} transition-all duration-300 relative overflow-hidden shadow-md ${
                          isSelected
                            ? "ring-3 ring-[#D97706] ring-offset-2 ring-offset-[#FAF6EE] shadow-lg brightness-105"
                            : "group-hover:brightness-110 group-hover:shadow-lg opacity-90 group-hover:opacity-100"
                        }`}
                      >
                        {/* Glossy top bevel reflection */}
                        <div className="absolute inset-x-0 top-0 h-1.5 bg-white/40 rounded-t-2xl" />

                        {/* Stage Number Badge */}
                        <div className="absolute bottom-2 inset-x-0 flex items-center justify-center">
                          <span className="w-6 h-6 rounded-full bg-white/25 backdrop-blur-xs text-white text-[11px] font-mono font-bold flex items-center justify-center border border-white/40 shadow-xs">
                            {idx + 1}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Stage Label & Icon */}
                    <div className="mt-3 text-center max-w-[110px]">
                      <div className="flex items-center justify-center gap-1 mb-0.5">
                        <Icon className={`w-3.5 h-3.5 ${meta.textClass}`} />
                        <span className="text-[11px] font-bold text-[#1C2527] leading-tight line-clamp-2">
                          {stage.stage}
                        </span>
                      </div>
                      <span className="text-[9.5px] text-[#7E9396] block truncate">
                        {retentionFromPrev}% retained
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Flow Insight Pill */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#5A6E71] px-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              <span>Click or tap any stage pillar above to inspect specific drop-off metrics and counsellor actions.</span>
            </span>
            <span className="font-mono text-[11px] text-[#B45309] font-bold">
              Bottleneck: Stage 3 ➔ 4 (-44% Drop)
            </span>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW MODE 2: 3D STEPPED FUNNEL (TAPERED TRAPEZOIDS)
          ========================================================================= */}
      {viewMode === "stepped" && (
        <div className="space-y-3 bg-gradient-to-b from-[#FFFDF9] to-[#F5ECE0] p-4 sm:p-6 rounded-2xl border border-[#D97706]/20 shadow-inner">
          <div className="max-w-2xl mx-auto space-y-2.5">
            {stages.map((stage, idx) => {
              const meta = STAGE_META[idx] || STAGE_META[0];
              const Icon = meta.icon;
              const isSelected = selectedStageIdx === idx;
              // Narrowing widths from 100% down to 36%
              const widthPcts = [100, 84, 68, 52, 38];
              const currentWidth = widthPcts[idx] || 50;

              return (
                <div
                  key={stage.stage}
                  onClick={() => setSelectedStageIdx(idx)}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <div
                    style={{ width: `${currentWidth}%` }}
                    className={`p-3 rounded-2xl bg-gradient-to-r ${meta.gradient} text-white shadow-md transition-all duration-200 relative ${
                      isSelected
                        ? "ring-3 ring-[#D97706] ring-offset-2 ring-offset-[#FAF6EE] scale-[1.02] shadow-xl"
                        : "group-hover:scale-[1.01] group-hover:brightness-110 opacity-95"
                    }`}
                  >
                    {/* Top sheen */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-white/35 rounded-t-2xl" />

                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-5 h-5 rounded-lg bg-black/25 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 border border-white/20">
                          {idx + 1}
                        </span>
                        <Icon className="w-4 h-4 shrink-0 text-white/90" />
                        <span className="font-bold truncate text-xs sm:text-sm">
                          {stage.stage}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 font-mono">
                        <span className="font-black text-xs sm:text-sm">
                          {stage.count.toLocaleString()} leads
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-black/25 text-[10px] font-bold border border-white/25">
                          {stage.pct}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stage Drop Connector */}
                  {idx < stages.length - 1 && (
                    <div className="my-1 flex items-center gap-1.5 text-[10px] font-mono text-[#7E9396]">
                      <ArrowDownRight className="w-3 h-3 text-[#D97706]" />
                      <span className="font-bold text-[#C2410C]">
                        {stages[idx + 1].drop || "Drop-off"}
                      </span>
                      <span>({stages[idx].count - stages[idx + 1].count} lost prospects)</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW MODE 3: STAGE VELOCITY & CONVERSION MATRIX TABLE
          ========================================================================= */}
      {viewMode === "matrix" && (
        <div className="overflow-x-auto rounded-xl border border-[rgba(71,86,87,0.18)]">
          <table className="crm-table w-full min-w-[620px] text-xs">
            <thead className="crm-thead">
              <tr>
                <th className="crm-th">Stage Particulars</th>
                <th className="crm-th text-center">Volume</th>
                <th className="crm-th text-center">Yield %</th>
                <th className="crm-th text-center">Drop-off Loss</th>
                <th className="crm-th">Turnaround Benchmark</th>
                <th className="crm-th text-right">Action Advice</th>
              </tr>
            </thead>
            <tbody className="crm-tbody divide-y divide-[rgba(71,86,87,0.1)]">
              {stages.map((stage, idx) => {
                const meta = STAGE_META[idx] || STAGE_META[0];
                const Icon = meta.icon;
                const prev = idx > 0 ? stages[idx - 1] : null;
                const droppedCount = prev ? prev.count - stage.count : 0;

                return (
                  <tr
                    key={stage.stage}
                    onClick={() => setSelectedStageIdx(idx)}
                    className={`hover:bg-[#FAF6EE]/80 transition-colors cursor-pointer ${
                      selectedStageIdx === idx ? "bg-[#FAF6EE] font-bold" : ""
                    }`}
                  >
                    <td className="crm-td">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-lg ${meta.bgClass} ${meta.textClass} flex items-center justify-center shrink-0`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="font-bold text-[#1C2527]">{stage.stage}</p>
                          <p className="text-[10px] text-[#7E9396]">{meta.velocity}</p>
                        </div>
                      </div>
                    </td>
                    <td className="crm-td text-center font-mono font-bold text-sm">
                      {stage.count.toLocaleString()}
                    </td>
                    <td className="crm-td text-center">
                      <span className="px-2 py-0.5 rounded-full bg-[#2E7559]/15 text-[#2E7559] font-bold font-mono text-[11px]">
                        {stage.pct}%
                      </span>
                    </td>
                    <td className="crm-td text-center">
                      {stage.drop ? (
                        <span className="text-[#C2410C] font-mono font-bold text-[11px]">
                          -{droppedCount} ({stage.drop})
                        </span>
                      ) : (
                        <span className="text-[#7E9396] font-mono text-[11px]">Baseline</span>
                      )}
                    </td>
                    <td className="crm-td text-[#57686A]">
                      {meta.velocity}
                    </td>
                    <td className="crm-td text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStageIdx(idx);
                        }}
                        className="text-[11px] font-bold text-[#D97706] hover:underline"
                      >
                        Inspect Details →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* =========================================================================
          STAGE DEEP-DIVE INSPECTION CARD (Dynamically Updates on Click/Hover)
          ========================================================================= */}
      <div className={`p-4 rounded-xl border ${activeMeta.borderClass} bg-gradient-to-br from-white via-[#FAF6EE] to-[#F5ECE0] shadow-xs space-y-2`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[rgba(71,86,87,0.1)] pb-2.5">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${activeMeta.gradient} text-white flex items-center justify-center shadow-xs`}>
              <activeMeta.icon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#1C2527]">
                  Stage {selectedStageIdx + 1}: {activeStage.stage}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-black/10 text-[#1C2527] font-mono text-[10px] font-bold">
                  {activeStage.count} Active Leads ({activeStage.pct}% of Intake)
                </span>
              </div>
              <p className="text-[11px] text-[#5A6E71]">
                {activeMeta.velocity}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
            {activeStage.drop && (
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold border border-rose-300">
                Drop: {activeStage.drop}
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full bg-[#2E7559]/15 text-[#2E7559] font-bold border border-[#2E7559]/30">
              Yield: {activeStage.pct}%
            </span>
          </div>
        </div>

        {/* Prescriptive Counsellor Recommendation */}
        <div className="flex items-start gap-2 text-xs pt-1">
          <Zap className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
          <p className="text-[#2E3A3C] leading-relaxed">
            <strong>Recommended Sales Action:</strong> {activeMeta.tip}
          </p>
        </div>
      </div>
    </div>
  );
}
