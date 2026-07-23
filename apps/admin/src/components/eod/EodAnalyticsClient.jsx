"use client";

import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { Loader2, Calendar, Filter, BarChart3 } from "lucide-react";
import { getEodAnalytics } from "@/actions/eod";
import { getIstDate } from "@/lib/ist";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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

const METRIC_COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899", "#14b8a6"];

export function EodAnalyticsClient({ isAdmin = false, isManager = false }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ timeSeries: [], teamAggregates: [], userAggregates: [] });
  
  const [teamFilter, setTeamFilter] = useState("");
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(getIstDate());
  const [selectedMetric, setSelectedMetric] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getEodAnalytics({ startDate, endDate, team: teamFilter || undefined });
      if (res.success) {
        setData({
          timeSeries: res.timeSeries || [],
          teamAggregates: res.teamAggregates || [],
          userAggregates: res.userAggregates || []
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
  }, [teamFilter, startDate, endDate]);

  // Extract all available metrics dynamically
  const availableMetrics = useMemo(() => {
    const metrics = new Set();
    data.timeSeries.forEach(day => {
      Object.keys(day).forEach(key => {
        if (key !== "date") metrics.add(key);
      });
    });
    return Array.from(metrics);
  }, [data.timeSeries]);

  // Auto-select first metric if none selected
  useEffect(() => {
    if (availableMetrics.length > 0 && !selectedMetric) {
      setSelectedMetric(availableMetrics[0]);
    }
  }, [availableMetrics, selectedMetric]);

  if (!isAdmin && !isManager) {
    return <div className="p-8 text-center text-muted-foreground">Unauthorized to view analytics.</div>;
  }

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/50">
        <div>
          <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" /> EOD Performance Analytics
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Visualize team performance and metrics over time.</p>
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
          
          {isAdmin && (
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
      ) : availableMetrics.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground border border-dashed rounded-lg bg-slate-50/50 dark:bg-slate-900/20">
          <BarChart3 className="h-12 w-12 mb-4 text-slate-300 dark:text-slate-700" />
          <p className="text-base font-medium">No numerical data found for this period.</p>
          <p className="text-sm mt-1">EOD forms must contain numeric fields to render analytics.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Metric Selector */}
          <div className="flex flex-wrap gap-2">
            {availableMetrics.map((metric) => (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  selectedMetric === metric
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-background text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                {metric.replace(/([A-Z])/g, " $1").toUpperCase()}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Time Series Line Chart */}
            <div className="bg-card border border-border rounded-xl shadow-sm p-5 lg:col-span-2">
              <h3 className="font-medium text-sm text-muted-foreground mb-6 uppercase tracking-wider">
                {selectedMetric.replace(/([A-Z])/g, " $1")} Trend
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.timeSeries} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
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
                      contentStyle={{ backgroundColor: "hsl(var(--background))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
                      itemStyle={{ color: "hsl(var(--foreground))" }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey={selectedMetric} 
                      stroke={METRIC_COLORS[0]} 
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* User Aggregates Bar Chart */}
            <div className="bg-card border border-border rounded-xl shadow-sm p-5">
              <h3 className="font-medium text-sm text-muted-foreground mb-6 uppercase tracking-wider">
                Top Performers: {selectedMetric.replace(/([A-Z])/g, " $1")}
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={[...data.userAggregates].sort((a, b) => (b[selectedMetric] || 0) - (a[selectedMetric] || 0)).slice(0, 10)} 
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      type="number"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="user" 
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      width={100}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "hsl(var(--background))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
                      itemStyle={{ color: "hsl(var(--foreground))" }}
                      cursor={{ fill: "hsl(var(--muted))" }}
                    />
                    <Bar dataKey={selectedMetric} fill={METRIC_COLORS[1]} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Team Aggregates Pie/Bar Chart */}
            <div className="bg-card border border-border rounded-xl shadow-sm p-5">
              <h3 className="font-medium text-sm text-muted-foreground mb-6 uppercase tracking-wider">
                Team Distribution: {selectedMetric.replace(/([A-Z])/g, " $1")}
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={[...data.teamAggregates].sort((a, b) => (b[selectedMetric] || 0) - (a[selectedMetric] || 0))}
                    margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="team" 
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
                      contentStyle={{ backgroundColor: "hsl(var(--background))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
                      itemStyle={{ color: "hsl(var(--foreground))" }}
                      cursor={{ fill: "hsl(var(--muted))" }}
                    />
                    <Bar dataKey={selectedMetric} fill={METRIC_COLORS[2]} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
