"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  TrendingUp,
  Award,
  Zap,
  Target,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  GraduationCap,
  Sparkles,
} from "lucide-react";

const TIME_RANGES = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "Quarterly", value: "quarter" },
];

const ANALYTICS_DATA = {
  today: {
    funnel: [
      { stage: "New Inquiries", count: 28, pct: 100, change: "+14%", drop: null },
      { stage: "Contacted / Tele-called", count: 22, pct: 78.5, change: "+8%", drop: "21.5% drop" },
      { stage: "Qualified Prospects", count: 15, pct: 53.5, change: "+12%", drop: "31.8% drop" },
      { stage: "Counselling Conducted", count: 8, pct: 28.5, change: "+5%", drop: "46.6% drop" },
      { stage: "Admissions Enrolled", count: 4, pct: 14.2, change: "+25%", drop: "50.0% drop" },
    ],
    leaderboard: [
      { id: "1", name: "Priya Patel", role: "Sr. Counsellor", enrollments: 2, counselling: 4, dials: 38, attainment: 110, rank: 1, avatarColor: "from-[#D97706] to-[#F59E0B]" },
      { id: "2", name: "Vikram Malhotra", role: "Telecaller Rep", enrollments: 1, counselling: 3, dials: 52, attainment: 94, rank: 2, avatarColor: "from-[#2E7559] to-[#489977]" },
      { id: "3", name: "Amit Kumar", role: "Admissions Lead", enrollments: 1, counselling: 2, dials: 29, attainment: 88, rank: 3, avatarColor: "from-[#B07238] to-[#d68e4c]" },
      { id: "4", name: "Sneha Rao", role: "Education Advisor", enrollments: 0, counselling: 2, dials: 31, attainment: 72, rank: 4, avatarColor: "from-[#57686A] to-[#7e939a]" },
    ],
    pacing: {
      targetRevenue: "₹2,50,000",
      achievedRevenue: "₹2,10,000",
      pctAchieved: 84,
      avgTurnaroundDays: 2.1,
      status: "On Track (+8% vs daily run-rate)",
      statusPositive: true,
    },
  },
  week: {
    funnel: [
      { stage: "New Inquiries", count: 164, pct: 100, change: "+18%", drop: null },
      { stage: "Contacted / Tele-called", count: 128, pct: 78.0, change: "+11%", drop: "22.0% drop" },
      { stage: "Qualified Prospects", count: 84, pct: 51.2, change: "+15%", drop: "34.3% drop" },
      { stage: "Counselling Conducted", count: 46, pct: 28.0, change: "+9%", drop: "45.2% drop" },
      { stage: "Admissions Enrolled", count: 24, pct: 14.6, change: "+22%", drop: "47.8% drop" },
    ],
    leaderboard: [
      { id: "1", name: "Priya Patel", role: "Sr. Counsellor", enrollments: 11, counselling: 19, dials: 184, attainment: 116, rank: 1, avatarColor: "from-[#D97706] to-[#F59E0B]" },
      { id: "2", name: "Vikram Malhotra", role: "Telecaller Rep", enrollments: 7, counselling: 14, dials: 245, attainment: 102, rank: 2, avatarColor: "from-[#2E7559] to-[#489977]" },
      { id: "3", name: "Amit Kumar", role: "Admissions Lead", enrollments: 4, counselling: 9, dials: 138, attainment: 89, rank: 3, avatarColor: "from-[#B07238] to-[#d68e4c]" },
      { id: "4", name: "Sneha Rao", role: "Education Advisor", enrollments: 2, counselling: 7, dials: 119, attainment: 78, rank: 4, avatarColor: "from-[#57686A] to-[#7e939a]" },
    ],
    pacing: {
      targetRevenue: "₹14,00,000",
      achievedRevenue: "₹12,45,000",
      pctAchieved: 88.9,
      avgTurnaroundDays: 3.4,
      status: "Ahead of Benchmark (+12%)",
      statusPositive: true,
    },
  },
  month: {
    funnel: [
      { stage: "New Inquiries", count: 680, pct: 100, change: "+24%", drop: null },
      { stage: "Contacted / Tele-called", count: 532, pct: 78.2, change: "+16%", drop: "21.8% drop" },
      { stage: "Qualified Prospects", count: 354, pct: 52.0, change: "+20%", drop: "33.4% drop" },
      { stage: "Counselling Conducted", count: 198, pct: 29.1, change: "+14%", drop: "44.0% drop" },
      { stage: "Admissions Enrolled", count: 102, pct: 15.0, change: "+28%", drop: "48.4% drop" },
    ],
    leaderboard: [
      { id: "1", name: "Priya Patel", role: "Sr. Counsellor", enrollments: 44, counselling: 78, dials: 740, attainment: 122, rank: 1, avatarColor: "from-[#D97706] to-[#F59E0B]" },
      { id: "2", name: "Vikram Malhotra", role: "Telecaller Rep", enrollments: 31, counselling: 59, dials: 980, attainment: 108, rank: 2, avatarColor: "from-[#2E7559] to-[#489977]" },
      { id: "3", name: "Amit Kumar", role: "Admissions Lead", enrollments: 18, counselling: 41, dials: 590, attainment: 92, rank: 3, avatarColor: "from-[#B07238] to-[#d68e4c]" },
      { id: "4", name: "Sneha Rao", role: "Education Advisor", enrollments: 9, counselling: 28, dials: 480, attainment: 81, rank: 4, avatarColor: "from-[#57686A] to-[#7e939a]" },
    ],
    pacing: {
      targetRevenue: "₹55,00,000",
      achievedRevenue: "₹49,80,000",
      pctAchieved: 90.5,
      avgTurnaroundDays: 4.2,
      status: "Target Attainment High (90.5%)",
      statusPositive: true,
    },
  },
  quarter: {
    funnel: [
      { stage: "New Inquiries", count: 1950, pct: 100, change: "+31%", drop: null },
      { stage: "Contacted / Tele-called", count: 1520, pct: 77.9, change: "+23%", drop: "22.1% drop" },
      { stage: "Qualified Prospects", count: 1010, pct: 51.7, change: "+27%", drop: "33.5% drop" },
      { stage: "Counselling Conducted", count: 565, pct: 28.9, change: "+19%", drop: "44.0% drop" },
      { stage: "Admissions Enrolled", count: 298, pct: 15.2, change: "+35%", drop: "47.2% drop" },
    ],
    leaderboard: [
      { id: "1", name: "Priya Patel", role: "Sr. Counsellor", enrollments: 126, counselling: 218, dials: 2150, attainment: 128, rank: 1, avatarColor: "from-[#D97706] to-[#F59E0B]" },
      { id: "2", name: "Vikram Malhotra", role: "Telecaller Rep", enrollments: 92, counselling: 165, dials: 2940, attainment: 114, rank: 2, avatarColor: "from-[#2E7559] to-[#489977]" },
      { id: "3", name: "Amit Kumar", role: "Admissions Lead", enrollments: 52, counselling: 114, dials: 1720, attainment: 96, rank: 3, avatarColor: "from-[#B07238] to-[#d68e4c]" },
      { id: "4", name: "Sneha Rao", role: "Education Advisor", enrollments: 28, counselling: 82, dials: 1410, attainment: 84, rank: 4, avatarColor: "from-[#57686A] to-[#7e939a]" },
    ],
    pacing: {
      targetRevenue: "₹1,60,00,000",
      achievedRevenue: "₹1,48,50,000",
      pctAchieved: 92.8,
      avgTurnaroundDays: 4.8,
      status: "Quarterly Target Exceeded",
      statusPositive: true,
    },
  },
};

const STAGE_COLORS = [
  "from-[#21353b] to-[#2d4952]", // Stage 1
  "from-[#2c4752] to-[#3f6575]", // Stage 2
  "from-[#385b6b] to-[#4a778c]", // Stage 3
  "from-[#235843] to-[#2E7559]", // Stage 4
  "from-[#1b6b47] to-[#10b981]", // Stage 5
];

export function ExecutiveAnalyticsCockpit() {
  const [selectedRange, setSelectedRange] = useState("month");
  const [eodDials, setEodDials] = useState(24);

  // Read live local EOD dials if rep dialed via softphone
  useEffect(() => {
    try {
      const stored = localStorage.getItem("skillyards_eod_attributables");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.dials) setEodDials(parsed.dials);
      }
    } catch {}
  }, []);

  const data = ANALYTICS_DATA[selectedRange] || ANALYTICS_DATA.month;

  return (
    <div className="space-y-6">
      {/* Analytics Section Header & Range Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#2E7559]">
              Executive Performance Engine
            </span>
          </div>
          <h2 className="text-lg font-bold text-[#1C2527] mt-0.5">
            Admissions Pipeline Funnel & Rep Attainment
          </h2>
        </div>

        {/* Range Selector Pill */}
        <div className="flex items-center bg-[#FAF6EE] p-1 rounded-xl border border-[rgba(71,86,87,0.18)] shadow-xs">
          {TIME_RANGES.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setSelectedRange(r.value)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                selectedRange === r.value
                  ? "bg-[#0c1316] text-white shadow-xs"
                  : "text-[#57686A] hover:text-[#1C2527]"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: 2/3 Pipeline Funnel + 1/3 Sales Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* =========================================================================
            PANEL 1: MULTI-STAGE CONVERSION FUNNEL (2 COLUMNS)
            ========================================================================= */}
        <div className="lg:col-span-2 bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(71,86,87,0.14)]">
              <div>
                <h3 className="text-sm font-bold text-[#1C2527] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#D97706]" />
                  <span>Pipeline Stage-by-Stage Conversion Funnel</span>
                </h3>
                <p className="text-[11px] text-[#57686A] mt-0.5">
                  Tracks velocity and drop-off from initial web intake down to confirmed enrollment
                </p>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-[#2E7559]/15 border border-[#2E7559]/30 text-[11px] font-bold text-[#1e5842]">
                Conversion: {data.funnel[4].pct}%
              </span>
            </div>

            {/* Funnel Stages List */}
            <div className="mt-5 space-y-4">
              {data.funnel.map((item, idx) => (
                <div key={item.stage} className="space-y-1.5 group">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-[#0c1316] text-white font-mono text-[10px] font-bold flex items-center justify-center shadow-xs">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-[#1C2527]">{item.stage}</span>
                      {item.drop && (
                        <span className="text-[10px] font-semibold text-[#889C9E] bg-white px-1.5 py-0.2 rounded border border-[rgba(71,86,87,0.1)]">
                          {item.drop}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-bold text-[#1C2527] text-sm">
                        {item.count.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-[#57686A]">({item.pct}%)</span>
                    </div>
                  </div>

                  {/* Horizontal Bar with Proportional Width */}
                  <div className="w-full h-3.5 bg-white rounded-full overflow-hidden border border-[rgba(71,86,87,0.12)] p-0.5 shadow-inner">
                    <div
                      style={{ width: `${item.pct}%` }}
                      className={`h-full rounded-full bg-gradient-to-r ${STAGE_COLORS[idx]} transition-all duration-500 shadow-xs relative group-hover:brightness-110`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Insights Banner */}
          <div className="mt-6 pt-4 border-t border-[rgba(71,86,87,0.12)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/70 p-3 rounded-xl border">
            <div className="flex items-center gap-2 text-xs">
              <Sparkles className="w-4 h-4 text-[#D97706] shrink-0" />
              <span className="text-[#2E3A3C]">
                <strong>Key Optimization Note:</strong> Highest drop-off is between{" "}
                <em>Qualified</em> to <em>Counselling Conducted</em> (44%).
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#D97706] hover:text-[#B45309] hover:underline cursor-pointer shrink-0">
              Improve Follow-up Timing →
            </span>
          </div>
        </div>

        {/* =========================================================================
            PANEL 2: SALES TEAM LEADERBOARD (1 COLUMN)
            ========================================================================= */}
        <div className="bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(71,86,87,0.14)]">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#D97706]" />
                <h3 className="text-sm font-bold text-[#1C2527]">Sales Leaderboard</h3>
              </div>
              <span className="text-[10.5px] font-bold text-[#57686A] uppercase tracking-wider">
                Ranked by Attainment
              </span>
            </div>

            {/* Reps Ranking List */}
            <div className="mt-4 space-y-3">
              {data.leaderboard.map((rep) => {
                const isFirst = rep.rank === 1;

                return (
                  <div
                    key={rep.id}
                    className={`p-3 rounded-xl border transition-all duration-150 ${
                      isFirst
                        ? "bg-white border-[#D97706]/40 shadow-sm ring-1 ring-[#D97706]/20"
                        : "bg-white/80 border-[rgba(71,86,87,0.12)] hover:border-[rgba(71,86,87,0.25)]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Rank Badge */}
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                            rep.rank === 1
                              ? "bg-[#D97706] text-white shadow-xs"
                              : rep.rank === 2
                              ? "bg-slate-300 text-slate-800"
                              : rep.rank === 3
                              ? "bg-amber-700/80 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {rep.rank}
                        </div>

                        {/* Avatar & Details */}
                        <div
                          className={`w-7 h-7 rounded-lg bg-gradient-to-br ${rep.avatarColor} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs`}
                        >
                          {rep.name[0]}
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#1C2527] truncate">
                            {rep.name}
                          </h4>
                          <span className="text-[10px] text-[#57686A] truncate block">
                            {rep.role}
                          </span>
                        </div>
                      </div>

                      {/* Attainment Percent Badge */}
                      <div className="text-right shrink-0">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                            rep.attainment >= 100
                              ? "bg-[#2E7559]/15 text-[#1e5842] border border-[#2E7559]/30"
                              : "bg-[#D97706]/12 text-[#92400E] border border-[#D97706]/25"
                          }`}
                        >
                          {rep.attainment}%
                        </span>
                      </div>
                    </div>

                    {/* Mini Stats Bar */}
                    <div className="mt-2.5 pt-2 border-t border-[rgba(71,86,87,0.08)] flex items-center justify-between text-[10.5px] text-[#57686A]">
                      <span>
                        Enrolled: <strong className="text-[#1C2527]">{rep.enrollments}</strong>
                      </span>
                      <span>
                        Sessions: <strong className="text-[#1C2527]">{rep.counselling}</strong>
                      </span>
                      <span>
                        Dials: <strong className="text-[#1C2527]">{rep.dials}</strong>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[rgba(71,86,87,0.12)] text-center">
            <span className="text-[11px] font-semibold text-[#D97706] hover:text-[#B45309] hover:underline cursor-pointer">
              View Detailed Roster & Capacity →
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          PANEL 3: REVENUE PACING & OPERATIONAL VELOCITY CARDS (3 BOXES)
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Revenue Attainment Gauge */}
        <div className="bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] rounded-2xl p-4.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#57686A] uppercase tracking-wider">
              Revenue Attainment
            </span>
            <Target className="w-4 h-4 text-[#D97706]" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#1C2527] font-mono">
              {data.pacing.achievedRevenue}
            </span>
            <span className="text-xs text-[#57686A] font-semibold">
              Goal: {data.pacing.targetRevenue}
            </span>
          </div>
          <div className="mt-2.5 w-full h-2.5 bg-white rounded-full overflow-hidden border border-[rgba(71,86,87,0.12)] p-0.5">
            <div
              style={{ width: `${Math.min(data.pacing.pctAchieved, 100)}%` }}
              className="h-full rounded-full bg-gradient-to-r from-[#D97706] to-[#2E7559] transition-all duration-500 shadow-xs"
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-[#2E7559] font-bold">
            <span>{data.pacing.pctAchieved}% of target</span>
            <span className="text-[#57686A] font-normal">{data.pacing.status}</span>
          </div>
        </div>

        {/* Lead-to-Session Turnaround Time */}
        <div className="bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] rounded-2xl p-4.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#57686A] uppercase tracking-wider">
              Avg. Turnaround Velocity
            </span>
            <Clock className="w-4 h-4 text-[#B07238]" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#1C2527] font-mono">
              {data.pacing.avgTurnaroundDays} <span className="text-sm font-sans font-bold">days</span>
            </span>
            <span className="text-[11px] bg-[#B07238]/15 text-[#8f5620] font-bold px-2 py-0.5 rounded-full border border-[#B07238]/30">
              Fast Intake
            </span>
          </div>
          <p className="mt-3 text-[11px] text-[#57686A] leading-relaxed">
            Time elapsed from website lead registration to scheduled 1-on-1 counseling session.
          </p>
        </div>

        {/* Telephony Dials & Activity Gauge */}
        <div className="bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] rounded-2xl p-4.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#57686A] uppercase tracking-wider">
              Daily Tele-calling Attainment
            </span>
            <Zap className="w-4 h-4 text-[#2E7559]" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#1C2527] font-mono">
              {eodDials} <span className="text-sm font-sans font-bold">calls</span>
            </span>
            <span className="text-[11px] bg-[#2E7559]/15 text-[#1e5842] font-bold px-2 py-0.5 rounded-full border border-[#2E7559]/30">
              Live Softphone
            </span>
          </div>
          <p className="mt-3 text-[11px] text-[#57686A] leading-relaxed">
            Automatically captured from in-app softphone dialer & credited to rep EOD ledger.
          </p>
        </div>
      </div>
    </div>
  );
}
