"use client";

import { useState, useEffect, useCallback } from "react";
import { Coffee, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { getAllBreaks, getBreakStats } from "@/actions/breaks";
import { getMyBreaks } from "@/actions/breaks";
import { getIstDate } from "@/lib/ist";

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

function StatsCards({ stats }) {
  const totalBreaks = stats.reduce((sum, s) => sum + s.breakCount, 0);
  const totalDuration = stats.reduce((sum, s) => sum + s.totalDuration, 0);
  const avgDuration = totalBreaks > 0 ? Math.round(totalDuration / totalBreaks) : 0;
  const topUser = stats.length > 0 ? stats[0] : null;

  const cards = [
    { label: "Total Breaks", value: totalBreaks, color: "text-orange-600" },
    { label: "Avg Duration", value: formatDuration(avgDuration), color: "text-blue-600" },
    { label: "Team Break Time", value: formatDuration(totalDuration), color: "text-purple-600" },
    { label: "Most Breaks", value: topUser ? topUser.userName : "—", sub: topUser ? `${topUser.breakCount} breaks` : "", color: "text-green-600" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <div key={card.label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
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

function UserBreakCards({ stats }) {
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
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4"
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
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  {formatDuration(b.duration)}
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 animate-pulse">
                  Active
                </span>
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

  const fetchData = useCallback(async () => {
    const data = await getMyBreaks(selectedDate);
    setBreaks(data);
    setLoading(false);
  }, [selectedDate]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchData();
    })();
  }, [fetchData]);

  const completedBreaks = breaks.filter((b) => b.endedAt);
  const totalDuration = completedBreaks.reduce((sum, b) => sum + (b.duration || 0), 0);
  const activeBreak = breaks.find((b) => !b.endedAt);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Coffee className="w-6 h-6 text-orange-600" />
          My Breaks
        </h1>
        <p className="text-sm text-gray-500 mt-1">View your break history</p>
      </div>

      <DateNavigator
        selectedDate={selectedDate}
        onPrev={onPrev}
        onNext={onNext}
        onToday={onToday}
        isToday={isToday}
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-xs text-gray-500">Breaks Taken</p>
          <p className="text-2xl font-bold">{completedBreaks.length}{activeBreak ? " + 1 active" : ""}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-xs text-gray-500">Total Time</p>
          <p className="text-2xl font-bold">{formatDuration(totalDuration)}</p>
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

function AdminBreaksView({ selectedDate, onPrev, onNext, onToday, isToday }) {
  const [stats, setStats] = useState([]);
  const [allBreaks, setAllBreaks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchData = useCallback(async () => {
    const [statsData, breaksData] = await Promise.all([
      getBreakStats(selectedDate),
      getAllBreaks(selectedDate),
    ]);
    setStats(statsData);
    setAllBreaks(breaksData);
    setLoading(false);
  }, [selectedDate]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchData();
    })();
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
        <>
          <StatsCards stats={stats} />

          {activeTab === "overview" ? (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Per-User Summary
              </h2>
              <UserBreakCards stats={stats} />
            </div>
          ) : (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Break Timeline ({allBreaks.length})
              </h2>
              <BreakTimeline breaks={allBreaks} showUser={true} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function BreaksPageClient({ userId, userRole }) {
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
