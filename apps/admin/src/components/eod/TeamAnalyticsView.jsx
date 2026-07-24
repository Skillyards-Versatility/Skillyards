"use client";

import { useMemo, useState } from "react";
import { Users, PhoneCall, Code, Megaphone, UserCheck, Briefcase, ChevronRight, Award, TrendingUp, Layers } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { SalesCallersComparison } from "./SalesCallersComparison";

const TEAM_METADATA = {
  sales: {
    label: "Sales Team",
    icon: PhoneCall,
    color: "from-blue-500/10 to-indigo-500/5 border-blue-500/30 text-blue-600 dark:text-blue-400",
    badge: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
  },
  tech: {
    label: "Tech Team",
    icon: Code,
    color: "from-emerald-500/10 to-teal-500/5 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
  },
  marketing: {
    label: "Marketing Team",
    icon: Megaphone,
    color: "from-purple-500/10 to-pink-500/5 border-purple-500/30 text-purple-600 dark:text-purple-400",
    badge: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
  },
  hr: {
    label: "HR Team",
    icon: UserCheck,
    color: "from-amber-500/10 to-orange-500/5 border-amber-500/30 text-amber-600 dark:text-amber-400",
    badge: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
  },
  ceo_office: {
    label: "CEO Office",
    icon: Award,
    color: "from-rose-500/10 to-red-500/5 border-rose-500/30 text-rose-600 dark:text-rose-400",
    badge: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
  },
  admin_head: {
    label: "Admin Head",
    icon: Layers,
    color: "from-sky-500/10 to-cyan-500/5 border-sky-500/30 text-sky-600 dark:text-sky-400",
    badge: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20",
  },
  outside_sales: {
    label: "Outside Sales",
    icon: Briefcase,
    color: "from-indigo-500/10 to-violet-500/5 border-indigo-500/30 text-indigo-600 dark:text-indigo-400",
    badge: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
  },
};

export function TeamAnalyticsView({ teamAggregates = [], reports = [], onSelectUser }) {
  const [selectedTeamFilter, setSelectedTeamFilter] = useState("all");

  // Calculate team breakdown with members and metrics
  const processedTeams = useMemo(() => {
    return teamAggregates.map((teamObj) => {
      const teamKey = teamObj.team?.toLowerCase();
      const meta = TEAM_METADATA[teamKey] || {
        label: teamObj.team.toUpperCase(),
        icon: Briefcase,
        color: "from-slate-500/10 to-gray-500/5 border-slate-500/30 text-slate-600",
        badge: "bg-slate-500/10 text-slate-700 border-slate-500/20",
      };

      // Filter reports belonging to this team
      const teamReports = reports.filter((r) => r.team?.toLowerCase() === teamKey);

      // Members in this team
      const membersMap = {};
      teamReports.forEach((r) => {
        if (!membersMap[r.userName]) {
          membersMap[r.userName] = {
            name: r.userName,
            image: r.profileImageKey,
            reportCount: 0,
            metrics: {},
          };
        }
        membersMap[r.userName].reportCount += 1;
        Object.entries(r.data || {}).forEach(([k, v]) => {
          const num = Number(v);
          if (!isNaN(num) && typeof v !== "boolean" && k !== "notes") {
            membersMap[r.userName].metrics[k] = (membersMap[r.userName].metrics[k] || 0) + num;
          }
        });
      });

      const members = Object.values(membersMap).sort((a, b) => b.reportCount - a.reportCount);

      // Key Efficiency Rates
      const dialed = Number(teamObj.dialedCalls || 0);
      const connected = Number(teamObj.connectedCalls || 0);
      const connectRate = dialed > 0 ? ((connected / dialed) * 100).toFixed(1) : "0.0";

      return {
        ...teamObj,
        teamKey,
        meta,
        members,
        connectRate,
        reportsCount: teamReports.length,
      };
    });
  }, [teamAggregates, reports]);

  // High-level aggregate totals
  const overallTotals = useMemo(() => {
    let totalMembers = 0;
    let totalReports = reports.length;
    let totalSalesCalls = 0;
    let totalTalkTime = 0;

    processedTeams.forEach((t) => {
      totalMembers += t.memberCount || 0;
      totalSalesCalls += Number(t.dialedCalls || 0);
      totalTalkTime += Number(t.talkTimeMinutes || 0);
    });

    return {
      totalMembers,
      totalReports,
      totalSalesCalls,
      totalTalkTimeHours: (totalTalkTime / 60).toFixed(1),
    };
  }, [reports, processedTeams]);

  // Chart data for team comparison
  const comparisonChartData = useMemo(() => {
    return processedTeams.map((t) => ({
      name: t.meta.label.replace(" Team", ""),
      Reports: t.reportsCount,
      Members: t.memberCount,
      "Dialed Calls": t.dialedCalls || 0,
      "Connected Calls": t.connectedCalls || 0,
    }));
  }, [processedTeams]);

  // Filtered teams based on user choice
  const displayedTeams = useMemo(() => {
    if (selectedTeamFilter === "all") return processedTeams;
    return processedTeams.filter((t) => t.teamKey === selectedTeamFilter);
  }, [processedTeams, selectedTeamFilter]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* High-Level Department Summary Bar - Mobile Optimized 1-Col to 2-Col */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-card border border-border/60 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <div className="text-[11px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-wider truncate">Active Employees</div>
            <div className="text-xl sm:text-2xl font-extrabold text-foreground">{overallTotals.totalMembers}</div>
          </div>
        </div>

        <div className="bg-card border border-border/60 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400 shrink-0">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <div className="text-[11px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-wider truncate">Total Sales Calls</div>
            <div className="text-xl sm:text-2xl font-extrabold text-foreground">{overallTotals.totalSalesCalls.toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-card border border-border/60 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <div className="text-[11px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-wider truncate">Talk Time (Hours)</div>
            <div className="text-xl sm:text-2xl font-extrabold text-foreground">{overallTotals.totalTalkTimeHours} hrs</div>
          </div>
        </div>

        <div className="bg-card border border-border/60 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="p-3 bg-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <div className="text-[11px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-wider truncate">EOD Reports Submitted</div>
            <div className="text-xl sm:text-2xl font-extrabold text-foreground">{overallTotals.totalReports}</div>
          </div>
        </div>
      </div>

      {/* DEDICATED SALES CALLERS COMPARISON SECTION */}
      <SalesCallersComparison reports={reports} onSelectUser={onSelectUser} />


      {/* Department Breakdowns Grid */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-base text-foreground tracking-tight">
          Departmental Deep-Dive ({displayedTeams.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedTeams.map((t) => {
            const Icon = t.meta.icon;
            return (
              <div key={t.teamKey} className="bg-card border border-border/60 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between gap-3 border-b border-border/40 pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-2xl bg-gradient-to-br ${t.meta.color} border border-border/40`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{t.meta.label}</h4>
                      <div className="text-xs text-muted-foreground">{t.memberCount} Team Members</div>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${t.meta.badge}`}>
                    {t.reportsCount} Reports
                  </span>
                </div>

                {t.dialedCalls > 0 && (
                  <div className="grid grid-cols-3 gap-2 bg-muted/30 p-2.5 rounded-2xl text-center">
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase font-bold">Dialed</div>
                      <div className="text-sm font-extrabold text-foreground">{t.dialedCalls}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase font-bold">Connected</div>
                      <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{t.connectedCalls}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase font-bold">Connect Rate</div>
                      <div className="text-sm font-extrabold text-blue-600 dark:text-blue-400">{t.connectRate}%</div>
                    </div>
                  </div>
                )}

                {/* Team Members List */}
                <div className="space-y-2 pt-1">
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Member Roster ({t.members.length})
                  </div>
                  {t.members.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">No submissions for selected date range.</p>
                  ) : (
                    <div className="space-y-1.5 max-h-[180px] overflow-y-auto custom-scrollbar pr-1">
                      {t.members.map((m) => (
                        <div
                          key={m.name}
                          onClick={() => onSelectUser && onSelectUser(m.name)}
                          className="flex items-center justify-between bg-background border border-border/40 hover:border-primary/50 p-2.5 rounded-2xl text-xs transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            {m.image ? (
                              <img src={`/api/files/${m.image}`} alt={m.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                                {m.name.charAt(0)}
                              </div>
                            )}
                            <span className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                              {m.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] text-muted-foreground">{m.reportCount} EOD(s)</span>
                            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
