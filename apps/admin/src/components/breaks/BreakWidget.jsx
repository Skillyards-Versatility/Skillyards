"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Coffee, Square, Clock } from "lucide-react";
import { startBreak, endBreak, getActiveBreak, getDailyBreakTotal } from "@/actions/breaks";
import { toast } from "sonner";

const MAX_SECONDS = 900;
const DAILY_LIMIT = 1800;

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function formatMinutes(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (s > 0) return `${m}m ${s}s`;
  return `${m}m`;
}

export function BreakWidget() {
  const [activeBreak, setActiveBreak] = useState(null);
  const [remaining, setRemaining] = useState(MAX_SECONDS);
  const [loading, setLoading] = useState(false);
  const [dailyInfo, setDailyInfo] = useState({ total: 0, remaining: DAILY_LIMIT, overage: 0 });
  const [panelOpen, setPanelOpen] = useState(false);
  const intervalRef = useRef(null);
  const panelRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const refreshDailyInfo = useCallback(async () => {
    const info = await getDailyBreakTotal();
    setDailyInfo(info);
  }, []);

  const tick = useCallback(() => {
    setActiveBreak((prev) => {
      if (!prev) return prev;
      const elapsed = Math.floor((Date.now() - new Date(prev.startedAt).getTime()) / 1000);
      const limit = Math.min(MAX_SECONDS, dailyInfo.remaining);
      const rem = Math.max(0, limit - elapsed);
      setRemaining(rem);

      if (rem <= 0) {
        clearTimer();
        endBreak(prev.id).then((res) => {
          if (res.success) {
            toast.warning("Break time limit reached. Break ended automatically.");
            refreshDailyInfo();
          }
        });
        return null;
      }
      return prev;
    });
  }, [clearTimer, refreshDailyInfo, dailyInfo.remaining]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [b, info] = await Promise.all([getActiveBreak(), getDailyBreakTotal()]);
      if (!cancelled) {
        setDailyInfo(info);
        if (b) {
          setActiveBreak(b);
          const elapsed = Math.floor((Date.now() - new Date(b.startedAt).getTime()) / 1000);
          const limit = Math.min(MAX_SECONDS, info.remaining);
          setRemaining(Math.max(0, limit - elapsed));
        }
      }
    })();
    return () => {
      cancelled = true;
      clearTimer();
    };
  }, [clearTimer]);

  useEffect(() => {
    if (activeBreak) {
      clearTimer();
      intervalRef.current = setInterval(tick, 1000);
    } else {
      clearTimer();
    }
    return () => clearTimer();
  }, [activeBreak, tick, clearTimer]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setPanelOpen(false);
      }
    }
    if (panelOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [panelOpen]);

  const handleStart = async () => {
    setLoading(true);
    const res = await startBreak();
    setLoading(false);

    if (res.success) {
      setActiveBreak(res.break);
      const limit = res.dailyRemaining !== undefined ? Math.min(MAX_SECONDS, res.dailyRemaining) : MAX_SECONDS;
      setRemaining(limit);
      setPanelOpen(false);
      if (res.dailyRemaining !== undefined) {
        setDailyInfo((prev) => ({ ...prev, remaining: res.dailyRemaining }));
      }
      toast.success(`Break started! ${formatTime(limit)} remaining for this break.`);
    } else {
      toast.error(res.error);
      refreshDailyInfo();
    }
  };

  const handleEnd = async () => {
    if (!activeBreak) return;
    setLoading(true);
    clearTimer();
    const res = await endBreak(activeBreak.id);
    setLoading(false);

    if (res.success) {
      const dur = res.break.duration || 0;
      setActiveBreak(null);
      setRemaining(MAX_SECONDS);
      setPanelOpen(false);
      const info = await getDailyBreakTotal();
      setDailyInfo(info);
      if (info.overage > 0) {
        toast.warning(`Break ended (${formatTime(dur)}). Exceeded by ${formatMinutes(info.overage)} of 30m.`);
      } else if (info.remaining > 0) {
        toast.success(`Break ended (${formatTime(dur)}). ${formatTime(info.remaining)} remaining today.`);
      } else {
        toast(`Break ended (${formatTime(dur)}). Daily limit reached.`);
      }
    } else {
      toast.error(res.error);
      intervalRef.current = setInterval(tick, 1000);
    }
  };

  const isOngoing = !!activeBreak;
  const hasOverage = dailyInfo.overage > 0;
  const isLimitDone = dailyInfo.remaining <= 0 && !hasOverage;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50" ref={panelRef}>
      {panelOpen && (
        <div className="absolute bottom-full right-0 mb-4 rounded-2xl shadow-2xl border border-border/50 bg-background/90 backdrop-blur-xl p-5 w-72 animate-in slide-in-from-bottom-2 fade-in duration-200">
          {isOngoing ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">On Break</span>
                </div>
                <span className="text-xl font-mono font-bold text-foreground tracking-tight">{formatTime(remaining)}</span>
              </div>
              <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    remaining <= 60 ? "bg-red-500" : remaining <= 300 ? "bg-amber-500" : "bg-orange-500"
                  }`}
                  style={{ width: `${((Math.max(1, Math.min(MAX_SECONDS, dailyInfo.remaining)) - remaining) / Math.max(1, Math.min(MAX_SECONDS, dailyInfo.remaining))) * 100}%` }}
                />
              </div>
              <div className="bg-muted/30 p-2.5 rounded-xl border border-border/50">
                {hasOverage ? (
                  <p className="text-xs font-medium text-red-500 text-center">Over by {formatMinutes(dailyInfo.overage)} (Limit: 30m)</p>
                ) : (
                  <p className="text-xs font-medium text-muted-foreground text-center">{formatTime(dailyInfo.remaining)} remaining today</p>
                )}
              </div>
              <button
                onClick={handleEnd}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                <Square className="w-4 h-4 fill-current" />
                End Break
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-border/50">
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                  <Coffee className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">Break Time</h3>
                  <p className="text-xs text-muted-foreground">{isLimitDone ? "Limit Reached" : "Take a moment to recharge"}</p>
                </div>
              </div>
              
              <div className="bg-muted/30 p-3 rounded-xl border border-border/50 space-y-1 text-center">
                {hasOverage ? (
                  <p className="text-xs font-bold text-red-500">Exceeded by {formatMinutes(dailyInfo.overage)} (Limit: 30m)</p>
                ) : isLimitDone ? (
                  <p className="text-xs font-bold text-muted-foreground">Daily 30m limit used up</p>
                ) : (
                  <>
                    <p className="text-xs font-bold text-foreground">{formatTime(dailyInfo.remaining)}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Remaining Today</p>
                  </>
                )}
              </div>
              
              {!isLimitDone && !hasOverage && (
                <button
                  onClick={handleStart}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  <Coffee className="w-4 h-4" />
                  {loading ? "Starting..." : "Start Break"}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => {
          if (!panelOpen && !isOngoing && (hasOverage || isLimitDone)) {
            toast.info(isOngoing ? "End your current break first." : "Daily 30m break limit reached.");
            return;
          }
          setPanelOpen(!panelOpen);
        }}
        className={`group relative flex items-center gap-2 overflow-hidden shadow-xl rounded-full transition-all duration-300 cursor-pointer active:scale-95 ${
          panelOpen ? "ring-2 ring-primary/50 ring-offset-2 ring-offset-background" : ""
        } ${
          isOngoing
            ? "px-5 py-3 bg-background/90 backdrop-blur-xl border border-orange-500/30 shadow-[0_4px_20px_rgba(249,115,22,0.15)]"
            : hasOverage
            ? "p-4 bg-background/90 backdrop-blur-xl border border-red-500/50 shadow-[0_4px_20px_rgba(239,68,68,0.15)]"
            : isLimitDone
            ? "p-4 bg-background/90 backdrop-blur-xl border border-border"
            : "p-4 bg-background/90 backdrop-blur-xl border border-border hover:border-primary/50"
        }`}
      >
        {isOngoing && (
          <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-orange-500/30 pointer-events-none" />
        )}
        
        {isOngoing ? (
          <>
            <div className="relative">
              <Coffee className="w-5 h-5 text-orange-500 animate-pulse" />
            </div>
            <span className="text-sm font-bold font-mono text-orange-500 ml-1">{formatTime(remaining)}</span>
          </>
        ) : hasOverage ? (
          <Clock className="w-6 h-6 text-red-500" />
        ) : (
          <>
            <Coffee className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
            <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-1 transition-all duration-300 ease-out text-sm font-bold text-foreground">
              Take Break
            </span>
          </>
        )}
      </button>
    </div>
  );
}
