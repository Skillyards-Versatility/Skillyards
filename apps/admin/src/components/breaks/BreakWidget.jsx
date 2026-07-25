"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Coffee, Square, Clock } from "lucide-react";
import { startBreak, endBreak, getActiveBreak, getDailyBreakTotal } from "@/actions/breaks";
import { toast } from "sonner";

const MAX_BREAK_SECONDS = 600;
const MAX_BREAKS = 3;

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
  const [elapsed, setElapsed] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dailyInfo, setDailyInfo] = useState({ breakCount: 0, maxBreaks: MAX_BREAKS, maxSeconds: MAX_BREAK_SECONDS, totalDuration: 0, totalOverage: 0, remainingDailySeconds: 1800 });
  const [panelOpen, setPanelOpen] = useState(false);
  const [cooldown, setCooldown] = useState({ active: false, remaining: 0 });
  const intervalRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    let active = false;
    let remaining = 0;
    if (dailyInfo.lastEndedAt && dailyInfo.lastDuration > 60) {
      const diff = Date.now() - new Date(dailyInfo.lastEndedAt).getTime();
      const cooldownMs = 30 * 60 * 1000;
      if (diff < cooldownMs) {
        active = true;
        remaining = Math.ceil((cooldownMs - diff) / 60000);
      }
    }

    const t = setTimeout(() => {
      setCooldown(prev => {
        if (prev.active === active && prev.remaining === remaining) return prev;
        return { active, remaining };
      });
    }, 0);

    if (active) {
      const interval = setInterval(() => {
        const diff = Date.now() - new Date(dailyInfo.lastEndedAt).getTime();
        const cooldownMs = 30 * 60 * 1000;
        if (diff < cooldownMs) {
          setCooldown({ active: true, remaining: Math.ceil((cooldownMs - diff) / 60000) });
        } else {
          setCooldown({ active: false, remaining: 0 });
        }
      }, 30000);
      return () => {
        clearTimeout(t);
        clearInterval(interval);
      };
    }

    return () => clearTimeout(t);
  }, [dailyInfo.lastEndedAt, dailyInfo.lastDuration]);

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
      const currentElapsed = Math.floor((Date.now() - new Date(prev.startedAt).getTime()) / 1000);
      setElapsed(currentElapsed);
      return prev;
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [b, info] = await Promise.all([getActiveBreak(), getDailyBreakTotal()]);
      if (!cancelled) {
        setDailyInfo(info);
        if (b) {
          setActiveBreak(b);
          setElapsed(Math.floor((Date.now() - new Date(b.startedAt).getTime()) / 1000));
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
      setElapsed(0);
      setPanelOpen(false);
      refreshDailyInfo();
      const allowedSecs = res.maxSeconds || MAX_BREAK_SECONDS;
      const allowedMins = Math.floor(allowedSecs / 60);
      const remainingSecondsPart = allowedSecs % 60;
      const remainingStr = remainingSecondsPart > 0 ? `${allowedMins}m ${remainingSecondsPart}s` : `${allowedMins}m`;
      toast.success(`Break started! ${remainingStr} remaining for this break.`);
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
      setElapsed(0);
      setPanelOpen(false);
      const info = await getDailyBreakTotal();
      setDailyInfo(info);
      
      const breakOverage = Math.max(0, dur - (info.maxSeconds || MAX_BREAK_SECONDS));
      if (breakOverage > 0) {
        toast.warning(`Break ended. You went ${formatMinutes(breakOverage)} over the limit!`);
      } else {
        toast.success(`Break ended successfully (${formatTime(dur)}).`);
      }
    } else {
      toast.error(res.error);
      intervalRef.current = setInterval(tick, 1000);
    }
  };

  const isOngoing = !!activeBreak;
  const maxSec = dailyInfo.maxSeconds || MAX_BREAK_SECONDS;
  const currentOverage = isOngoing ? Math.max(0, elapsed - maxSec) : 0;
  const isLimitDone = dailyInfo.breakCount >= (dailyInfo.maxBreaks || MAX_BREAKS) || (dailyInfo.remainingDailySeconds !== undefined && dailyInfo.remainingDailySeconds <= 0);
  
  const displayRemaining = Math.max(0, maxSec - elapsed);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50" ref={panelRef}>
      {panelOpen && (
        <div className="absolute bottom-full right-0 mb-4 rounded-2xl shadow-2xl border border-border/50 bg-background/90 backdrop-blur-xl p-5 w-72 animate-in slide-in-from-bottom-2 fade-in duration-200">
          {isOngoing ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Break {dailyInfo.breakCount || 1} of {dailyInfo.maxBreaks || 3}</span>
                </div>
                <span className={`text-xl font-mono font-bold tracking-tight ${currentOverage > 0 ? "text-red-500" : "text-foreground"}`}>
                  {currentOverage > 0 ? `+ ${formatTime(currentOverage)}` : formatTime(displayRemaining)}
                </span>
              </div>
              <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    currentOverage > 0 ? "bg-red-500 animate-pulse" : displayRemaining <= 60 ? "bg-red-500" : displayRemaining <= 300 ? "bg-amber-500" : "bg-orange-500"
                  }`}
                  style={{ width: `${currentOverage > 0 ? 100 : (displayRemaining / maxSec) * 100}%` }}
                />
              </div>
              <div className="bg-muted/30 p-2.5 rounded-xl border border-border/50">
                {currentOverage > 0 ? (
                  <p className="text-xs font-medium text-red-500 text-center">Exceeded limit of {formatMinutes(maxSec)}!</p>
                ) : (
                  <p className="text-xs font-medium text-muted-foreground text-center">{formatTime(displayRemaining)} remaining for this break</p>
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
                  <p className="text-xs text-muted-foreground">{isLimitDone ? "Limit Reached" : `Ready for break ${dailyInfo.breakCount + 1}`}</p>
                </div>
              </div>
              
              <div className="bg-muted/30 p-3 rounded-xl border border-border/50 space-y-1 text-center">
                {isLimitDone ? (
                  <p className="text-xs font-bold text-muted-foreground">Daily limit of 3 breaks or 30m reached.</p>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold px-2">
                      <span className="text-muted-foreground">Breaks Taken:</span>
                      <span className="text-foreground">{dailyInfo.breakCount} / {dailyInfo.maxBreaks || 3}</span>
                    </div>
                    <div className="flex justify-between text-xs font-semibold px-2">
                      <span className="text-muted-foreground">Remaining:</span>
                      <span className="text-foreground">{formatMinutes(dailyInfo.remainingDailySeconds !== undefined ? dailyInfo.remainingDailySeconds : 1800)} / 30m</span>
                    </div>
                  </div>
                )}
              </div>
              
              {!isLimitDone && (
                <button
                  onClick={handleStart}
                  disabled={loading || cooldown.active}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-bold shadow-md transition-all active:scale-[0.98] cursor-pointer ${
                    cooldown.active
                      ? "bg-slate-400 cursor-not-allowed opacity-70"
                      : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg"
                  }`}
                >
                  <Coffee className="w-4 h-4" />
                  {loading ? "Starting..." : cooldown.active ? `Cooldown: Wait ${cooldown.remaining}m` : "Start Break"}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => {
          if (!panelOpen && !isOngoing && isLimitDone) {
            toast.info("Daily break limit reached (3 breaks or 30m total).");
            return;
          }
          setPanelOpen(!panelOpen);
        }}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95 text-white ${
          panelOpen ? "ring-2 ring-amber-500 ring-offset-2 ring-offset-background" : ""
        } ${
          isOngoing
            ? currentOverage > 0 
              ? "bg-red-500 hover:bg-red-600 shadow-[0_4px_20px_rgba(239,68,68,0.3)] animate-pulse" 
              : "bg-orange-500 hover:bg-orange-600 shadow-[0_4px_20px_rgba(249,115,22,0.3)] animate-pulse"
            : isLimitDone
            ? "bg-slate-400 hover:bg-slate-500"
            : "bg-amber-500 hover:bg-amber-600 shadow-[0_4px_20px_rgba(245,158,11,0.3)]"
        }`}
      >
        {isOngoing ? (
          <span className={`text-xs font-bold font-mono tracking-tighter ${currentOverage > 0 ? "text-white" : ""}`}>
            {currentOverage > 0 ? `+${formatTime(currentOverage)}` : formatTime(displayRemaining)}
          </span>
        ) : isLimitDone ? (
          <Clock className="w-6 h-6" />
        ) : (
          <Coffee className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}
