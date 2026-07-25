"use client";

import { useState, useEffect, useCallback } from "react";
import { Coffee, Clock, ChevronLeft, ChevronRight, X } from "lucide-react";
import { getAllBreaks, getBreakStats } from "@/actions/breaks";
import { getMyBreaks, savePushSubscription } from "@/actions/breaks";
import { getIstDate } from "@/lib/ist";
import { subscribeToPushNotifications } from "@/lib/push";
import { Bell } from "lucide-react";

const PRIVILEGED_ROLES = ["ADMIN", "HR", "MANAGER"];

function formatDuration(seconds) {
  if (!seconds || seconds === 0) return "0m";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function formatTime(timestamp) {
  if (!timestamp) return "—";
  const d = new Date(timestamp);
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
}

function shiftDate(dateStr, days) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

function formatDisplayDate(dateStr) {
  if (!dateStr) return "—";
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

function DateNavigator({ selectedDate, onPrev, onNext, onToday, isToday }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onPrev}
        className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="text-sm font-medium min-w-[180px] text-center">
        {formatDisplayDate(selectedDate)}
      </span>
      <button
        onClick={onNext}
        disabled={isToday}
        className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 cursor-pointer"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
      {!isToday && (
        <button
          onClick={onToday}
          className="ml-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
        >
          Today
        </button>
      )}
    </div>
  );
}

function StatsCards({ stats, allBreaks, totalUsers, onBreakClick, onFlaggedClick }) {
  const activeBreakCount = allBreaks.filter(b => !b.endedAt).length;
  const totalBreaks = stats.reduce((sum, s) => sum + s.breakCount, 0);
  const totalDuration = stats.reduce((sum, s) => sum + s.totalDuration, 0);
  const avgDuration = totalBreaks > 0 ? Math.round(totalDuration / totalBreaks) : 0;
  // Calculate flagged users based on 10-minute (600s) PER BREAK limit OR 30-minute (1800s) DAILY limit
  const flaggedUsersSet = new Set();
  
  // Group breaks by user
  const userBreaks = {};
  for (const b of allBreaks) {
    if (!userBreaks[b.userId]) {
      userBreaks[b.userId] = { total: 0, breaks: [], userTeam: b.userTeam, userName: b.userName };
    }
    const dur = b.endedAt ? b.duration : Math.floor((new Date() - new Date(b.startedAt)) / 1000);
    userBreaks[b.userId].total += dur;
    userBreaks[b.userId].breaks.push({ ...b, calculatedDuration: dur });
    
    // Flag if any single break exceeds 10 minutes
    if (dur > 600) {
      flaggedUsersSet.add(b.userId);
    }
  }

  // Flag if total daily breaks exceed 30 minutes
  for (const userId of Object.keys(userBreaks)) {
    if (userBreaks[userId].total > 1800) {
      flaggedUsersSet.add(userId);
    }
  }

  const flaggedCount = flaggedUsersSet.size;

  const topUser = stats.length > 0 ? stats[0] : null;

  const cards = [
    { label: "Active Employees", value: totalUsers - activeBreakCount, color: "text-green-600" },
    { label: "Inactive Employees", value: activeBreakCount, color: "text-orange-600", clickable: true },
    { label: "Avg Duration", value: formatDuration(avgDuration), color: "text-blue-600" },
    { label: "Most Breaks", value: topUser ? topUser.userName : "—", sub: topUser ? `${topUser.breakCount} breaks` : "", color: "text-purple-600" },
    { label: "Flagged (Overage)", value: flaggedCount, color: "text-red-600", clickable: true },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {cards.map((card) => (
        <div 
          key={card.label} 
          onClick={card.label === "Inactive Employees" ? onBreakClick : card.label === "Flagged (Overage)" ? onFlaggedClick : undefined}
          className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 ${
            card.clickable 
              ? `cursor-pointer hover:shadow-md hover:ring-1 hover:ring-${card.color.split('-')[1]}-500/50 transition-all active:scale-[0.98]` 
              : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 ${card.color}`}>
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">{card.label}</p>
              <p className="text-lg font-semibold">{card.value}</p>
              {card.sub && <p className="text-xs text-gray-400">{card.sub}</p>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function UserBreakCards({ stats, onUserClick }) {
  if (stats.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Coffee className="w-10 h-10 mx-auto mb-2 opacity-50" />
        <p>No breaks recorded for this date.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {stats.map((s) => (
        <div
          key={s.userId}
          onClick={() => onUserClick && onUserClick(s)}
          className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 ${
            onUserClick ? "cursor-pointer hover:shadow-md hover:ring-1 hover:ring-blue-500/50 transition-all active:scale-[0.98]" : ""
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-medium text-sm">{s.userName}</p>
              {s.userTeam && (
                <p className="text-xs text-gray-500 capitalize">{s.userTeam.replace("_", " ")}</p>
              )}
            </div>
            <span className="text-lg font-bold text-orange-600">{s.breakCount}</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Total: {formatDuration(s.totalDuration)}</span>
            <span>Avg: {formatDuration(s.avgDuration)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function BreakTimeline({ breaks, showUser }) {
  if (breaks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock className="w-10 h-10 mx-auto mb-2 opacity-50" />
        <p>No breaks recorded for this date.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {breaks.map((b) => (
        <div
          key={b.id}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                <Coffee className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                {showUser && <p className="font-medium text-sm">{b.userName}</p>}
                <p className="text-xs text-gray-500">
                  {formatTime(b.startedAt)} — {b.endedAt ? formatTime(b.endedAt) : "Active"}
                </p>
              </div>
            </div>
            <div className="text-right">
              {b.endedAt ? (
                <div className="flex flex-col items-end gap-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    b.duration > 600 
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 ring-1 ring-inset ring-red-200 dark:ring-red-900/50' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}>
                    {formatDuration(b.duration)}
                  </span>
                  {b.duration > 600 && showUser && (
                    <span className="text-[10px] font-bold text-red-600 dark:text-red-400 flex items-center uppercase tracking-wider">
                      Flagged (Overage)
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-end gap-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 animate-pulse">
                    Active
                  </span>
                  {(() => {
                    const activeSeconds = Math.floor((new Date() - new Date(b.startedAt)) / 1000);
                    if (activeSeconds > 600 && showUser) {
                      return (
                         <span className="text-[10px] font-bold text-red-600 dark:text-red-400 flex items-center uppercase tracking-wider animate-pulse">
                           Flagged (Overage)
                         </span>
                      );
                    }
                    return null;
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MyBreaksView({ selectedDate, onPrev, onNext, onToday, isToday, today }) {
  const [breaks, setBreaks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pushStatus, setPushStatus] = useState("unknown"); // unknown, unsupported, denied, granted

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPushStatus(Notification.permission);
      
      // Always ensure service worker is registered if they are already granted
      if (Notification.permission === "granted") {
        import("@/lib/push").then(m => m.registerServiceWorker());
      }
    } else {
      setPushStatus("unsupported");
    }
  }, []);

  const handleEnablePush = async () => {
    const res = await subscribeToPushNotifications();
    if (res.success) {
      await savePushSubscription(res.subscription);
      setPushStatus("granted");
      toast.success("Push notifications enabled!");
    } else {
      toast.error(res.message || "Failed to enable notifications");
      if (typeof window !== "undefined" && "Notification" in window) {
        setPushStatus(Notification.permission);
      }
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const data = await getMyBreaks(selectedDate);
      setBreaks(data || []);
    } catch {
      setBreaks([]);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  const completedBreaks = breaks.filter((b) => b.endedAt);
  const totalDuration = completedBreaks.reduce((sum, b) => sum + (b.duration || 0), 0);
  const activeBreak = breaks.find((b) => !b.endedAt);
  const completedBreaksCount = completedBreaks.reduce((sum, b) => sum + Math.ceil((b.duration || 0) / 600), 0);
  const remainingTime = Math.max(0, 1800 - totalDuration);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Coffee className="w-6 h-6 text-orange-600" />
          My Breaks
        </h1>
        <p className="text-sm text-gray-500 mt-1">View your break history</p>
      </div>

      {(pushStatus === "default" || pushStatus === "unknown") && (
        <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/50 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg shrink-0 mt-0.5">
              <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300">Enable Notifications</h3>
              <p className="text-xs text-blue-700/80 dark:text-blue-400/80 mt-1">Get an alert 1 minute before your break time runs out.</p>
            </div>
          </div>
          <button 
            onClick={handleEnablePush}
            className="shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Enable Alerts
          </button>
        </div>
      )}

      <DateNavigator
        selectedDate={selectedDate}
        onPrev={onPrev}
        onNext={onNext}
        onToday={onToday}
        isToday={isToday}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-xs text-gray-500">Breaks Taken</p>
          <p className="text-2xl font-bold">{completedBreaksCount}{activeBreak ? " + 1 active" : ""}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-xs text-gray-500">Total Time</p>
          <p className="text-2xl font-bold">{formatDuration(totalDuration)}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-xs text-gray-500">Daily Remaining Time</p>
          <p className="text-2xl font-bold">{formatDuration(remainingTime)} / 30m</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Today&apos;s Breaks ({breaks.length})
          </h2>
          <BreakTimeline breaks={breaks} showUser={false} />
        </div>
      )}
    </div>
  );
}

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

function AdminBreaksView({ selectedDate, onPrev, onNext, onToday, isToday, users }) {
  const [stats, setStats] = useState([]);
  const [allBreaks, setAllBreaks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [teamFilter, setTeamFilter] = useState("");
  const [showActiveModal, setShowActiveModal] = useState(false);
  const [showFlaggedModal, setShowFlaggedModal] = useState(false);
  const [selectedUserTimeline, setSelectedUserTimeline] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [statsData, breaksData] = await Promise.all([
        getBreakStats(selectedDate),
        getAllBreaks(selectedDate),
      ]);
      setStats(statsData || []);
      setAllBreaks(breaksData || []);
    } catch {
      setStats([]);
      setAllBreaks([]);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Coffee className="w-6 h-6 text-orange-600" />
          Break Tracker
        </h1>
        <p className="text-sm text-gray-500 mt-1">Track team breaks and time usage</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <DateNavigator
          selectedDate={selectedDate}
          onPrev={onPrev}
          onNext={onNext}
          onToday={onToday}
          isToday={isToday}
        />

        <select
          className="p-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 outline-none focus:ring-1 focus:ring-primary"
          value={teamFilter}
          onChange={(e) => setTeamFilter(e.target.value)}
        >
          {TEAM_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === "overview"
                ? "bg-white dark:bg-gray-700 shadow-sm"
                : "hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("timeline")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === "timeline"
                ? "bg-white dark:bg-gray-700 shadow-sm"
                : "hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            Timeline
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
          <div className="h-48 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
        </div>
      ) : (
        (() => {
          const filteredStats = teamFilter ? stats.filter(s => s.userTeam === teamFilter) : stats;
          const filteredBreaks = teamFilter ? allBreaks.filter(b => b.userTeam === teamFilter) : allBreaks;
          const filteredUsersCount = teamFilter ? users.filter(u => u.team === teamFilter).length : users.length;
          
          return (
            <>
              <StatsCards 
                stats={filteredStats} 
                allBreaks={filteredBreaks} 
                totalUsers={filteredUsersCount} 
                onBreakClick={() => setShowActiveModal(true)}
                onFlaggedClick={() => setShowFlaggedModal(true)}
              />

              {activeTab === "overview" ? (
                <div>
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Per-User Summary
                  </h2>
                  <UserBreakCards 
                    stats={filteredStats} 
                    onUserClick={(userStats) => setSelectedUserTimeline(userStats)}
                  />
                </div>
              ) : (
                <div>
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Break Timeline ({filteredBreaks.length})
                  </h2>
                  <BreakTimeline breaks={filteredBreaks} showUser={true} />
                </div>
              )}
            </>
          );
        })()
      )}
      
      {showActiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Coffee className="w-5 h-5 text-orange-600" />
                Currently On Break ({allBreaks.filter(b => !b.endedAt && (!teamFilter || b.userTeam === teamFilter)).length})
              </h2>
              <button 
                onClick={() => setShowActiveModal(false)}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-5 space-y-3 flex-1">
              {(() => {
                const active = allBreaks.filter(b => !b.endedAt && (!teamFilter || b.userTeam === teamFilter));
                if (active.length === 0) {
                  return <div className="text-center py-8 text-gray-500">No one is currently on break.</div>;
                }
                return active.sort((a,b) => new Date(a.startedAt) - new Date(b.startedAt)).map(b => {
                  const activeSeconds = Math.floor((new Date() - new Date(b.startedAt)) / 1000);
                  const isFlagged = activeSeconds > 600;
                  return (
                    <div key={b.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                      <div>
                        <p className="font-medium text-sm">{b.userName}</p>
                        <p className="text-xs text-gray-500 capitalize">{b.userTeam?.replace("_", " ") || "No Team"}</p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isFlagged 
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 ring-1 ring-inset ring-red-200 dark:ring-red-900/50"
                            : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 animate-pulse"
                        }`}>
                          {formatDuration(activeSeconds)}
                        </span>
                        {isFlagged && (
                          <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider animate-pulse">
                            Flagged
                          </span>
                        )}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}

      {showFlaggedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Coffee className="w-5 h-5 text-red-600" />
                Flagged Employees
              </h2>
              <button 
                onClick={() => setShowFlaggedModal(false)}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-5 space-y-3 flex-1">
              {(() => {
                // We already grouped by user in StatsCards, but that was scoped locally. 
                // We can recalculate here since it's cheap, or just do it again.
                const flaggedUsersMap = new Map();
                for (const b of allBreaks) {
                  if (teamFilter && b.userTeam !== teamFilter) continue;
                  
                  if (!flaggedUsersMap.has(b.userId)) {
                    flaggedUsersMap.set(b.userId, { total: 0, userName: b.userName, userTeam: b.userTeam, isActive: false, hasOverage: false, overageSeconds: 0 });
                  }
                  
                  const dur = b.endedAt ? b.duration : Math.floor((new Date() - new Date(b.startedAt)) / 1000);
                  const data = flaggedUsersMap.get(b.userId);
                  data.total += dur;
                  if (!b.endedAt) data.isActive = true;
                  if (dur > 600) {
                    data.hasOverage = true;
                    data.overageSeconds += (dur - 600);
                  }
                }
                
                for (const data of flaggedUsersMap.values()) {
                  if (data.total > 1800) {
                    data.hasOverage = true;
                    const dailyOverage = data.total - 1800;
                    data.overageSeconds = Math.max(data.overageSeconds, dailyOverage);
                  }
                }
                
                const flagged = Array.from(flaggedUsersMap.values()).filter(u => u.hasOverage);

                if (flagged.length === 0) {
                  return <div className="text-center py-8 text-gray-500">No flagged employees for this date.</div>;
                }
                
                return flagged.sort((a,b) => b.total - a.total).map(u => {
                  return (
                    <div key={u.userName} className="flex items-center justify-between p-3 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10">
                      <div>
                        <p className="font-medium text-sm text-red-900 dark:text-red-300">{u.userName}</p>
                        <p className="text-xs text-red-700/70 dark:text-red-400/70 capitalize">{u.userTeam?.replace("_", " ") || "No Team"}</p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 ring-1 ring-inset ring-red-200 dark:ring-red-900/50">
                          {u.isActive ? "Active Break" : `+ ${formatDuration(u.overageSeconds)}`}
                        </span>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}
      
      {selectedUserTimeline && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                {selectedUserTimeline.userName}&apos;s Timeline
              </h2>
              <button 
                onClick={() => setSelectedUserTimeline(null)}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-5 space-y-3 flex-1">
              <BreakTimeline 
                breaks={allBreaks.filter(b => b.userId === selectedUserTimeline.userId)} 
                showUser={false} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function BreaksPageClient({ userId, userRole, users = [] }) {
  const today = getIstDate();
  const [selectedDate, setSelectedDate] = useState(today);
  const isToday = selectedDate === today;
  const privileged = PRIVILEGED_ROLES.includes(userRole);

  const handlePrevDay = () => setSelectedDate((d) => shiftDate(d, -1));
  const handleNextDay = () => setSelectedDate((d) => shiftDate(d, 1));
  const handleToday = () => setSelectedDate(today);

  if (privileged) {
    return (
      <AdminBreaksView
        selectedDate={selectedDate}
        onPrev={handlePrevDay}
        onNext={handleNextDay}
        onToday={handleToday}
        isToday={isToday}
        users={users}
      />
    );
  }

  return (
    <MyBreaksView
      selectedDate={selectedDate}
      onPrev={handlePrevDay}
      onNext={handleNextDay}
      onToday={handleToday}
      isToday={isToday}
      today={today}
    />
  );
}
