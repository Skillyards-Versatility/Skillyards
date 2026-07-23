"use client";

import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { Loader2, Calendar, Filter, BarChart3, TrendingUp, Activity, UserCircle, ArrowLeft } from "lucide-react";
import { getEodAnalytics } from "@/actions/eod";
import { getIstDate } from "@/lib/ist";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";

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

export function EodAnalyticsClient({ isAdmin = false, isManager = false }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ timeSeries: [], teamAggregates: [], userAggregates: [], reports: [] });
  
  const [teamFilter, setTeamFilter] = useState("");
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(getIstDate());
  
  // New drill-down states
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
    setSelectedUser(null);
    setSelectedUserMetric("");
  }, [teamFilter, startDate, endDate]);

  if (!isAdmin && !isManager) {
    return <div className="p-8 text-center text-muted-foreground">Unauthorized to view analytics.</div>;
  }

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
          
          // Define a strict priority order for which metrics to display on the Roster Cards
          const PRIORITY_KEYS = [
            "dialedCalls", 
            "connectedCalls", 
            "counsellingDone", 
            "counsellingBooked",
            "sessionBooked",
            "classesTaken",
            "bugsFixed",
            "deploymentsDone",
            "reelsEdited"
          ];

          // Sort the user's metrics based on the PRIORITY_KEYS index, fallback to alphabetical
          const metrics = Object.entries(userObj)
            .filter(([k]) => k !== "user" && k !== "image")
            .sort((a, b) => {
              const idxA = PRIORITY_KEYS.indexOf(a[0]);
              const idxB = PRIORITY_KEYS.indexOf(b[0]);
              if (idxA !== -1 && idxB !== -1) return idxA - idxB;
              if (idxA !== -1) return -1;
              if (idxB !== -1) return 1;
              return b[1] - a[1]; // fallback to value-based if unknown
            })
            .slice(0, 4);

          return (
            <div 
              key={userObj.user} 
              onClick={() => setSelectedUser(userObj.user)}
              className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center gap-4 mb-6">
                {userObj.image ? (
                  <img 
                    src={`/api/files/${userObj.image}`}
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
              
              <div className="space-y-3">
                {metrics.length > 0 ? metrics.map(([mKey, mVal]) => (
                  <div key={mKey} className="flex items-center justify-between bg-muted/30 p-2.5 rounded-lg border border-border/50">
                    <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
                      {mKey.replace(/([A-Z])/g, " $1")}
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      {mVal.toLocaleString()}
                    </span>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground text-center py-2">No numeric data reported</p>
                )}
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

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
        
        {/* Metric Selector Pills */}
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

        {/* User KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-200/50 dark:border-blue-900/30 rounded-2xl p-5 shadow-sm">
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
          
          <div className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-200/50 dark:border-emerald-900/30 rounded-2xl p-5 shadow-sm">
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

        {/* Personal Time Series Area Chart */}
        <div className="bg-card border border-border/60 rounded-2xl shadow-sm p-6 relative overflow-hidden group">
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/50">
        <div>
          <div className="flex items-center gap-3">
            {selectedUser && (
              <button 
                onClick={() => setSelectedUser(null)}
                className="p-1.5 bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" /> 
              {selectedUser ? `${selectedUser}'s Analytics` : "Team Analytics"}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {selectedUser ? `Detailed performance metrics for ${selectedUser}.` : "Select an employee to view their detailed performance metrics."}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 bg-background border border-border/60 rounded-md px-3 py-1.5 shadow-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <input
              type="date"
              className="bg-transparent border-none text-sm focus:ring-0 p-0 w-[110px]"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span className="text-muted-foreground text-sm px-1">to</span>
            <input
              type="date"
              className="bg-transparent border-none text-sm focus:ring-0 p-0 w-[110px]"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          
          {isAdmin && !selectedUser && (
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <select
                className="bg-background border border-border/60 text-sm rounded-md focus:ring-1 focus:ring-primary pl-9 pr-8 py-2 appearance-none shadow-sm cursor-pointer min-w-[140px]"
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

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p className="text-sm">Crunching numbers...</p>
        </div>
      ) : selectedUser ? (
        renderDrillDownView()
      ) : (
        renderRosterView()
      )}
    </div>
  );
}
