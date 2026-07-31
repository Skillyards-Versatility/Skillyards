"use client";

import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { Loader2, Calendar, Filter, BarChart3, TrendingUp, Activity, UserCircle, ArrowLeft, Building2, User } from "lucide-react";
import { getEodAnalytics } from "@/actions/eod";
import { getIstDate } from "@/lib/ist";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TeamAnalyticsView } from "./TeamAnalyticsView";
import { DatePresetSelector } from "./DatePresetSelector";

const TEAM_OPTIONS = [
  { value: "", label: "All Teams" },
  { value: "sales", label: "Sales" },
  { value: "tech", label: "Tech" },
  { value: "hr", label: "HR" },
  { value: "ceo_office", label: "CEO Office" },
  { value: "admin_head", label: "Admin Head" },
  { value: "marketing", label: "Marketing" },
  { value: "outside_sales", label: "Outside Sales" },
];

export function EodAnalyticsClient({ isAdmin = false, isManager = false, userName = null }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ timeSeries: [], teamAggregates: [], userAggregates: [], reports: [] });
  
  const [activeTab, setActiveTab] = useState("team"); // "team" | "user"
  const [teamFilter, setTeamFilter] = useState("");
  const [startDate, setStartDate] = useState(getIstDate());
  const [endDate, setEndDate] = useState(getIstDate());
  
  // Drill-down states
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserMetric, setSelectedUserMetric] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getEodAnalytics({ startDate, endDate, team: teamFilter || undefined });
      if (res.success) {
        setData({
          timeSeries: res.timeSeries || [],
          teamAggregates: res.teamAggregates || [],
          userAggregates: res.userAggregates || [],
          reports: res.reports || []
        });
        
        // Auto-select logged-in user if they are a regular employee
        if (!isAdmin && !isManager && userName && !selectedUser) {
          setSelectedUser(userName);
          setActiveTab("user");
        }
      } else {
        toast.error("Failed to load analytics");
      }
    } catch {
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    if (isAdmin || isManager) {
      setSelectedUser(null);
    }
    setSelectedUserMetric("");
  }, [teamFilter, startDate, endDate]);

  // Calculate Personal Time Series if a user is selected
  const userTimeSeries = useMemo(() => {
    if (!selectedUser) return [];
    const ts = {};
    data.reports.forEach(report => {
      if (report.userName === selectedUser) {
        const date = report.date;
        if (!ts[date]) ts[date] = { date };
        Object.entries(report.data || {}).forEach(([k, v]) => {
          const numValue = Number(v);
          if (!isNaN(numValue) && typeof v !== 'boolean' && k !== "notes") {
            ts[date][k] = (ts[date][k] || 0) + numValue;
          }
        });
      }
    });
    return Object.values(ts).sort((a, b) => a.date.localeCompare(b.date));
  }, [selectedUser, data.reports]);

  // Determine available metrics for the selected user
  const userAvailableMetrics = useMemo(() => {
    if (!selectedUser) return [];
    const metrics = new Set();
    userTimeSeries.forEach(day => {
      Object.keys(day).forEach(key => {
        if (key !== "date") metrics.add(key);
      });
    });
    return Array.from(metrics);
  }, [userTimeSeries]);

  // Auto-select metric for the drill-down view
  useEffect(() => {
    if (selectedUser && userAvailableMetrics.length > 0 && (!selectedUserMetric || !userAvailableMetrics.includes(selectedUserMetric))) {
      setSelectedUserMetric(userAvailableMetrics[0]);
    }
  }, [selectedUser, userAvailableMetrics, selectedUserMetric]);

  const dateDiff = Math.max(1, (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));

  // --- RENDER ROSTER VIEW ---
  const renderRosterView = () => {
    if (data.userAggregates.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground border border-dashed rounded-xl bg-slate-50/50 dark:bg-slate-900/20">
          <UserCircle className="h-12 w-12 mb-4 text-slate-300 dark:text-slate-700" />
          <p className="text-base font-medium">No employees found for this criteria.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.userAggregates.map(userObj => {
          const PRIORITY_KEYS = [
            "dialedCalls", 
            "connectedCalls", 
            "talkTime",
            "counsellingDone", 
            "counsellingBooked",
            "walkinCounselling",
            "sessionBooked",
            "meetingsConducted",
            "reviewsCompleted",
            "classesTaken",
            "projectsWorkedOn",
            "bugsFixed",
            "deploymentsDone",
            "reelsEdited"
          ];

          const metrics = Object.entries(userObj)
            .filter(([k]) => k !== "user" && k !== "image")
            .sort((a, b) => {
              const idxA = PRIORITY_KEYS.indexOf(a[0]);
              const idxB = PRIORITY_KEYS.indexOf(b[0]);
              if (idxA !== -1 && idxB !== -1) return idxA - idxB;
              if (idxA !== -1) return -1;
              if (idxB !== -1) return 1;
              return b[1] - a[1];
            })
            .slice(0, 6);

          return (
            <div 
              key={userObj.user} 
              onClick={() => {
                setSelectedUser(userObj.user);
                setActiveTab("user");
              }}
              className="bg-card border border-border/60 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center gap-4 mb-6">
                {userObj.image ? (
                  <img 
                    src={`/files/${userObj.image}`}
                    alt={userObj.user}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary/20 group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
                    {userObj.user.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-foreground">{userObj.user}</h3>
                  <p className="text-xs text-muted-foreground">Click to view details</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                {metrics.map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                    <span className="font-semibold text-lg">{value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // --- RENDER DRILL-DOWN VIEW ---
  const renderDrillDownView = () => {
    if (userAvailableMetrics.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground border border-dashed rounded-xl bg-slate-50/50 dark:bg-slate-900/20">
          <p className="text-base font-medium">No numerical data found for {selectedUser}.</p>
        </div>
      );
    }

    const totalValue = userTimeSeries.reduce((sum, item) => sum + (item[selectedUserMetric] || 0), 0);
    const dailyAverage = (totalValue / dateDiff).toFixed(1);

    const isSalesRole = userAvailableMetrics.includes("dialedCalls");
    let currentStreak = 0;
    let maxStreak = 0;
    
    const TARGET_TALK_TIME = 90;

    if (isSalesRole) {
      const getDayTargetDialed = (day) => {
        const totalCouns = (day.counsellingDone || 0) + (day.walkinCounselling || 0);
        return Math.max(0, 120 - totalCouns * 15);
      };
      const getDayTargetConnected = (day) => {
        const totalCouns = (day.counsellingDone || 0) + (day.walkinCounselling || 0);
        return Math.max(30, 50 - totalCouns * 5);
      };

      let tempStreak = 0;
      for (let i = userTimeSeries.length - 1; i >= 0; i--) {
        const d = userTimeSeries[i];
        if ((d.dialedCalls || 0) >= getDayTargetDialed(d) && (d.connectedCalls || 0) >= getDayTargetConnected(d) && (d.talkTime || 0) >= TARGET_TALK_TIME) {
          tempStreak++;
        } else {
          break;
        }
      }
      currentStreak = tempStreak;

      let highestTemp = 0;
      userTimeSeries.forEach(day => {
        if ((day.dialedCalls || 0) >= getDayTargetDialed(day) && (day.connectedCalls || 0) >= getDayTargetConnected(day) && (day.talkTime || 0) >= TARGET_TALK_TIME) {
          highestTemp++;
          if (highestTemp > maxStreak) maxStreak = highestTemp;
        } else {
          highestTemp = 0;
        }
      });
    }

    const latestDay = userTimeSeries.length > 0 ? userTimeSeries[userTimeSeries.length - 1] : null;
    const latestDialed = latestDay?.dialedCalls || 0;
    const latestConnected = latestDay?.connectedCalls || 0;
    const latestTalkTime = latestDay?.talkTime || 0;
    const latestTotalCouns = (latestDay?.counsellingDone || 0) + (latestDay?.walkinCounselling || 0);
    const dayTargetDialed = Math.max(0, 120 - latestTotalCouns * 15);
    const dayTargetConnected = Math.max(30, 50 - latestTotalCouns * 5);

    const batCalls = dayTargetDialed > 0 ? Math.min(100, Math.round((latestDialed / dayTargetDialed) * 100)) : 100;
    const batConn = dayTargetConnected > 0 ? Math.min(100, Math.round((latestConnected / dayTargetConnected) * 100)) : 100;
    const batTalk = Math.min(100, Math.round((latestTalkTime / TARGET_TALK_TIME) * 100));

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex flex-wrap gap-2 bg-muted/30 p-1.5 rounded-2xl border border-border/50 shadow-inner">
          {userAvailableMetrics.map((metric) => (
            <button
              key={metric}
              onClick={() => setSelectedUserMetric(metric)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                selectedUserMetric === metric
                  ? "bg-white dark:bg-gray-800 text-primary shadow-md ring-1 ring-border/50"
                  : "text-muted-foreground hover:bg-white/50 dark:hover:bg-gray-800/50 hover:text-foreground"
              }`}
            >
              {metric.replace(/([A-Z])/g, " $1").toUpperCase()}
            </button>
          ))}
        </div>

        {isSalesRole && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-xs relative overflow-hidden flex flex-col items-center justify-center min-h-[220px]">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
              <h3 className="font-semibold text-sm text-muted-foreground mb-4 uppercase tracking-wider w-full text-left">Daily Targets</h3>
              
              <div className="w-full space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span>Dialed ({dayTargetDialed})</span>
                    <span className={batCalls >= 100 ? "text-emerald-500" : ""}>{latestDialed}</span>
                  </div>
                  <div className="w-full h-3 bg-muted/30 rounded-full overflow-hidden border border-border/50">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${batCalls >= 100 ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : batCalls >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                      style={{ width: `${Math.max(2, batCalls)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span>Connected ({dayTargetConnected})</span>
                    <span className={batConn >= 100 ? "text-emerald-500" : ""}>{latestConnected}</span>
                  </div>
                  <div className="w-full h-3 bg-muted/30 rounded-full overflow-hidden border border-border/50">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${batConn >= 100 ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : batConn >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                      style={{ width: `${Math.max(2, batConn)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span>Talk Time ({TARGET_TALK_TIME}m)</span>
                    <span className={batTalk >= 100 ? "text-emerald-500" : ""}>{latestTalkTime}m</span>
                  </div>
                  <div className="w-full h-3 bg-muted/30 rounded-full overflow-hidden border border-border/50">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${batTalk >= 100 ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : batTalk >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                      style={{ width: `${Math.max(2, batTalk)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-xs relative overflow-hidden lg:col-span-1 min-h-[220px]">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
              <h3 className="font-semibold text-sm text-muted-foreground mb-4 uppercase tracking-wider text-center">Conversion Funnel</h3>
              
              <div className="flex flex-col items-center justify-center h-full space-y-1.5 w-full max-w-[200px] mx-auto pb-4">
                <div className="bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 w-full rounded-md py-1.5 text-center text-xs font-bold border border-indigo-500/30">
                  Dialed: {userTimeSeries.reduce((s, i) => s + (i.dialedCalls || 0), 0).toLocaleString()}
                </div>
                <div className="bg-blue-500/20 text-blue-700 dark:text-blue-300 w-4/5 rounded-md py-1.5 text-center text-xs font-bold border border-blue-500/30">
                  Connected: {userTimeSeries.reduce((s, i) => s + (i.connectedCalls || 0), 0).toLocaleString()}
                </div>
                <div className="bg-amber-500/20 text-amber-700 dark:text-amber-300 w-3/5 rounded-md py-1.5 text-center text-xs font-bold border border-amber-500/30">
                  Counselled: {userTimeSeries.reduce((s, i) => s + (i.counsellingDone || 0) + (i.walkinCounselling || 0), 0).toLocaleString()}
                </div>
                <div className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 w-2/5 rounded-md py-1.5 text-center text-xs font-bold border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                  Sessions: {userTimeSeries.reduce((s, i) => s + (i.sessionBooked || 0), 0).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-xs relative overflow-hidden min-h-[220px] flex flex-col items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 to-transparent pointer-events-none" />
              
              <div className={`relative flex items-center justify-center transition-all duration-700 ${currentStreak > 0 ? "scale-110" : "grayscale opacity-50"}`}>
                <div className="absolute inset-0 bg-orange-500 blur-2xl opacity-20 rounded-full animate-pulse" />
                <span className="text-7xl drop-shadow-xl" style={{ filter: currentStreak > 0 ? 'drop-shadow(0 0 20px rgba(249, 115, 22, 0.6))' : 'none' }}>
                  🔥
                </span>
                {currentStreak > 0 && (
                  <span className="absolute -bottom-2 bg-background border border-orange-500/50 text-orange-500 font-bold px-3 py-1 rounded-full text-sm shadow-md whitespace-nowrap">
                    {currentStreak} Days
                  </span>
                )}
              </div>
              
              <div className="mt-8 text-center px-4">
                <p className="font-bold text-foreground">
                  {currentStreak > 0 ? `Active Hot Streak!` : "Streak Lost"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Hit dial, connect & talk time targets to {currentStreak > 0 ? "keep it alive." : "reignite the fire."}
                </p>
                <p className="text-xs text-orange-500/70 font-semibold mt-2">
                  All-time best: {maxStreak} days
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-200/50 dark:border-blue-900/30 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total {selectedUserMetric.replace(/([A-Z])/g, " $1")}</h3>
            </div>
            <p className="text-4xl font-bold text-foreground">
              {totalValue.toLocaleString()}
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-200/50 dark:border-emerald-900/30 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Daily Avg</h3>
            </div>
            <p className="text-4xl font-bold text-foreground">
              {dailyAverage}
            </p>
          </div>
        </div>

        <div className="bg-card border border-border/60 rounded-2xl shadow-xs p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <h3 className="font-semibold text-sm text-foreground mb-6 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            Performance Trend
          </h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userTimeSeries} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)", borderColor: "hsl(var(--border))", borderRadius: "12px", boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1)" }}
                  itemStyle={{ color: "hsl(var(--foreground))", fontWeight: "bold" }}
                />
                <Area 
                  type="monotone" 
                  dataKey={selectedUserMetric} 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorMetric)"
                  activeDot={{ r: 6, fill: "hsl(var(--primary))", stroke: "white", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Main Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/50">
        <div>
          <div className="flex items-center gap-3">
            {selectedUser && (isAdmin || isManager) && (
              <button 
                onClick={() => setSelectedUser(null)}
                className="p-1.5 bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" /> 
              {selectedUser ? `${selectedUser}'s Analytics` : "EOD Analytics Dashboard"}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {selectedUser ? `Detailed performance metrics for ${selectedUser}.` : "Track team output and employee EOD submissions."}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <DatePresetSelector
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
          
          {isAdmin && !selectedUser && (
            <div className="relative shrink-0">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <select
                className="w-full sm:w-auto bg-background border border-border/60 text-xs font-semibold rounded-2xl focus:ring-1 focus:ring-primary pl-9 pr-8 py-2 appearance-none shadow-2xs cursor-pointer min-w-[130px]"
                value={teamFilter}
                onChange={(e) => setTeamFilter(e.target.value)}
              >
                {TEAM_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Main Tab Navigation Header (Only if no specific user drill-down is open) */}
      {!selectedUser && (
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 border-b border-border pb-1.5">
          <button
            onClick={() => setActiveTab("team")}
            className={`inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer text-center ${
              activeTab === "team"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Building2 className="w-4 h-4 shrink-0" />
            <span className="truncate">Team Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab("user")}
            className={`inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer text-center ${
              activeTab === "user"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <User className="w-4 h-4 shrink-0" />
            <span className="truncate">Individual Roster</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
          <p className="text-sm font-medium">Crunching analytics numbers...</p>
        </div>
      ) : selectedUser ? (
        renderDrillDownView()
      ) : activeTab === "team" ? (
        <TeamAnalyticsView
          teamAggregates={data.teamAggregates}
          reports={data.reports}
          onSelectUser={(userName) => {
            setSelectedUser(userName);
            setActiveTab("user");
          }}
        />
      ) : (
        renderRosterView()
      )}
    </div>
  );
}
