"use client";

import { useMemo, useState } from "react";
import { PhoneCall, Target, TrendingUp, CheckCircle2, ChevronRight, AlertTriangle, Sparkles } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// Helper to format full names to short names for chart X-axis labels (e.g. "Saurabh Verma" -> "Saurabh V.")
const getShortName = (fullName) => {
  if (!fullName) return "";
  const parts = fullName.trim().split(" ");
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
};

// Custom Tooltip with Target Flag Status and Full Name Display
const CustomTargetTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const dataObj = payload[0]?.payload;
    const isMet = dataObj?.isTargetMet;
    const fullName = dataObj?.fullName || label;

    return (
      <div className="bg-background/95 backdrop-blur-xl border border-border/80 rounded-2xl p-3.5 shadow-2xl space-y-2 text-xs min-w-[210px] z-[150]">
        <div className="flex items-center justify-between gap-3 border-b border-border/50 pb-2 font-bold text-foreground">
          <span className="font-extrabold text-sm">{fullName}</span>
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 ${
            isMet ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
          }`}>
            {isMet ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <AlertTriangle className="w-3 h-3 text-amber-500" />}
            {isMet ? "Met 🔥" : `${dataObj?.connectedAchievedPct}%`}
          </span>
        </div>

        <div className="space-y-1.5 pt-1">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 font-medium text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-full shadow-2xs shrink-0" style={{ backgroundColor: entry.fill }} />
                <span className="truncate">{entry.name}:</span>
              </span>
              <span className="font-extrabold text-foreground shrink-0">{Number(entry.value).toLocaleString()}</span>
            </div>
          ))}
        </div>

        {dataObj?.counselling > 0 && (
          <div className="pt-2 border-t border-border/40 text-[11px] text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            {dataObj.counselling} counselling · {dataObj.walkin} walk-in
          </div>
        )}
      </div>
    );
  }
  return null;
};

export function SalesCallersComparison({ reports = [], onSelectUser }) {
  const [activeViewMode, setActiveViewMode] = useState("targets"); // "targets" | "conversions"

  // Aggregate sales caller data with dynamic day-by-day target calculations
  const callersData = useMemo(() => {
    const salesReports = reports.filter((r) => r.team?.toLowerCase() === "sales");
    const callerMap = {};

    salesReports.forEach((r) => {
      const userName = r.userName;
      if (!userName) return;

      if (!callerMap[userName]) {
        callerMap[userName] = {
          name: userName,
          shortName: getShortName(userName),
          image: r.profileImageKey,
          reportCount: 0,
          actualDialed: 0,
          actualConnected: 0,
          counsellingDone: 0,
          walkinCounselling: 0,
          sessionBooked: 0,
          talkTimeMinutes: 0,
          targetDialed: 0,
          targetConnected: 0,
        };
      }

      const d = r.data || {};
      const dialed = Number(d.dialedCalls || 0);
      const connected = Number(d.connectedCalls || 0);
      const counselling = Number(d.counsellingDone || d.counsellingWalkin || d.counsellingVirtual || 0);
      const walkin = Number(d.walkinCounselling || 0);
      const totalCounselling = counselling + walkin;
      const session = Number(d.sessionBooked || 0);
      const talkTime = Number(d.talkTime || 0);

      callerMap[userName].reportCount += 1;
      callerMap[userName].actualDialed += dialed;
      callerMap[userName].actualConnected += connected;
      callerMap[userName].counsellingDone += counselling;
      callerMap[userName].walkinCounselling += walkin;
      callerMap[userName].sessionBooked += session;
      callerMap[userName].talkTimeMinutes += talkTime;

      // Dynamic Daily Target Math per report day
      const dayTargetDialed = Math.max(0, 120 - totalCounselling * 20);
      const dayTargetConnected = Math.max(30, 50 - totalCounselling * 10);

      callerMap[userName].targetDialed += dayTargetDialed;
      callerMap[userName].targetConnected += dayTargetConnected;
    });

    return Object.values(callerMap).map((caller) => {
      const connectRate = caller.actualDialed > 0 ? ((caller.actualConnected / caller.actualDialed) * 100).toFixed(1) : "0.0";
      const dialedAchievedPct = caller.targetDialed > 0 ? Math.round((caller.actualDialed / caller.targetDialed) * 100) : 0;
      const connectedAchievedPct = caller.targetConnected > 0 ? Math.round((caller.actualConnected / caller.targetConnected) * 100) : 0;
      const totalCounselling = caller.counsellingDone + caller.walkinCounselling;

      return {
        ...caller,
        totalCounselling,
        connectRate,
        dialedAchievedPct,
        connectedAchievedPct,
        isTargetMet: dialedAchievedPct >= 100 && connectedAchievedPct >= 100,
      };
    }).sort((a, b) => b.actualConnected - a.actualConnected);
  }, [reports]);

  // Clean Chart Data
  const chartData = useMemo(() => {
    return callersData.map((c) => ({
      name: c.shortName,
      fullName: c.name,
      // Target View
      "Actual Connected": c.actualConnected,
      "Target Connected": c.targetConnected,
      // Conversions View
      "Dialed Calls": c.actualDialed,
      "Connected Calls": c.actualConnected,
      "Counsellings": c.totalCounselling,
      "Sessions Booked": c.sessionBooked,
      isTargetMet: c.isTargetMet,
      connectedAchievedPct: c.connectedAchievedPct,
      counselling: c.counsellingDone,
      walkin: c.walkinCounselling,
    }));
  }, [callersData]);

  if (callersData.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border/60 rounded-3xl p-4 sm:p-6 shadow-xs space-y-5 animate-in fade-in duration-300">
      {/* Sleek Mobile-Friendly Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 mb-2">
            <Target className="w-3.5 h-3.5" />
            Sales Calling Matrix
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-foreground flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            Sales Callers Comparison
          </h3>
        </div>

        {/* Responsive View Mode Toggle Switch */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-1 bg-muted/50 p-1 rounded-2xl border border-border/60 w-full sm:w-auto">
          <button
            onClick={() => setActiveViewMode("targets")}
            className={`px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-extrabold transition-all cursor-pointer text-center ${
              activeViewMode === "targets"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🎯 Calls vs Target
          </button>
          <button
            onClick={() => setActiveViewMode("conversions")}
            className={`px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-extrabold transition-all cursor-pointer text-center ${
              activeViewMode === "conversions"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🎓 Output Breakdown
          </button>
        </div>
      </div>

      {/* CHART SECTION WITH HORIZONTAL SCROLL FOR MOBILE */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <h4 className="text-[11px] sm:text-xs font-extrabold text-muted-foreground uppercase tracking-wider">
            {activeViewMode === "targets" ? "Actual Connected (Indigo) vs Target (Amber)" : "Dialed, Connected, Counsellings & Sessions"}
          </h4>
          
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-2xs" /> 🚩 Met
            </span>
            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-2xs" /> ⚠️ Pending
            </span>
          </div>
        </div>

        {/* Scrollable Container on Mobile */}
        <div className="overflow-x-auto custom-scrollbar no-scrollbar w-full pt-2">
          <div className="min-w-[500px] sm:min-w-full h-[320px] sm:h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 15, right: 15, left: -20, bottom: 45 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "hsl(var(--foreground))", fontSize: 11, fontWeight: 700 }}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                  height={50}
                />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTargetTooltip />} />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px", fontWeight: "bold" }} />

                {activeViewMode === "targets" ? (
                  <>
                    <Bar dataKey="Actual Connected" fill="#4f46e5" radius={[6, 6, 0, 0]} maxBarSize={36} />
                    <Bar dataKey="Target Connected" fill="#f59e0b" radius={[6, 6, 0, 0]} maxBarSize={36} opacity={0.85} />
                  </>
                ) : (
                  <>
                    <Bar dataKey="Dialed Calls" fill="#2563eb" radius={[6, 6, 0, 0]} maxBarSize={26} />
                    <Bar dataKey="Connected Calls" fill="#059669" radius={[6, 6, 0, 0]} maxBarSize={26} />
                    <Bar dataKey="Counsellings" fill="#9333ea" radius={[6, 6, 0, 0]} maxBarSize={26} />
                    <Bar dataKey="Sessions Booked" fill="#d97706" radius={[6, 6, 0, 0]} maxBarSize={26} />
                  </>
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Caller Scorecard Grid */}
      <div className="pt-4 border-t border-border/40 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
            Individual Scorecard ({callersData.length} Callers)
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {callersData.map((caller) => (
            <div
              key={caller.name}
              onClick={() => onSelectUser && onSelectUser(caller.name)}
              className="bg-background border border-border/60 rounded-2xl p-3.5 sm:p-4 shadow-2xs hover:border-indigo-500/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    {caller.image ? (
                      <img src={`/api/files/${caller.image}`} alt={caller.name} className="w-8 h-8 rounded-full object-cover border border-indigo-500/20 shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-extrabold text-xs shrink-0">
                        {caller.name.charAt(0)}
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <div className="font-bold text-sm text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center gap-1 truncate">
                        <span className="truncate">{caller.name}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-indigo-600 shrink-0 transition-colors" />
                      </div>
                      <div className="text-[11px] text-muted-foreground">{caller.reportCount} reports</div>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 ${
                      caller.isTargetMet
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {caller.isTargetMet ? "Target Met 🔥" : `⚠️ ${caller.connectedAchievedPct}%`}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="bg-indigo-500/5 p-2 rounded-xl border border-indigo-500/10">
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold">Connected / Target</span>
                    <div className="font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">
                      {caller.actualConnected} <span className="text-muted-foreground font-normal">/ {caller.targetConnected}</span>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-2 rounded-xl">
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold">Dialed / Target</span>
                    <div className="font-extrabold text-foreground mt-0.5">
                      {caller.actualDialed} <span className="text-muted-foreground font-normal">/ {caller.targetDialed}</span>
                    </div>
                  </div>

                  <div className="bg-purple-500/5 p-2 rounded-xl border border-purple-500/10">
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold">Total Counselling</span>
                    <div className="font-extrabold text-purple-600 dark:text-purple-400 mt-0.5">{caller.totalCounselling}</div>
                    <div className="text-[9px] text-muted-foreground mt-0.5">{caller.counsellingDone} done · {caller.walkinCounselling} walk-in</div>
                  </div>

                  <div className="bg-emerald-500/5 p-2 rounded-xl border border-emerald-500/10">
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold">Connect Rate</span>
                    <div className="font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">{caller.connectRate}%</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
