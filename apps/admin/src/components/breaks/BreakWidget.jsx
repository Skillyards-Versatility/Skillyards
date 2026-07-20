"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Coffee, Square } from "lucide-react";
import { startBreak, endBreak, getActiveBreak } from "@/actions/breaks";
import { toast } from "sonner";

const MAX_SECONDS = 900;

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function BreakWidget({ userId }) {
  const [activeBreak, setActiveBreak] = useState(null);
  const [remaining, setRemaining] = useState(MAX_SECONDS);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    setActiveBreak((prev) => {
      if (!prev) return prev;
      const elapsed = Math.floor((Date.now() - new Date(prev.startedAt).getTime()) / 1000);
      const rem = Math.max(0, MAX_SECONDS - elapsed);
      setRemaining(rem);

      if (rem <= 0) {
        clearTimer();
        endBreak(prev.id).then((res) => {
          if (res.success) {
            toast.warning("Break time limit reached (15 min). Break ended automatically.");
          }
        });
        return null;
      }
      return prev;
    });
  }, [clearTimer]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const b = await getActiveBreak();
      if (!cancelled && b) {
        setActiveBreak(b);
        const elapsed = Math.floor((Date.now() - new Date(b.startedAt).getTime()) / 1000);
        setRemaining(Math.max(0, MAX_SECONDS - elapsed));
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

  const handleStart = async () => {
    setLoading(true);
    const res = await startBreak();
    setLoading(false);

    if (res.success) {
      setActiveBreak(res.break);
      setRemaining(MAX_SECONDS);
      toast.success("Break started! Timer is running.");
    } else {
      toast.error(res.error);
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
      toast.success(`Break ended. Duration: ${formatTime(dur)}`);
    } else {
      toast.error(res.error);
      intervalRef.current = setInterval(tick, 1000);
    }
  };

  const isOngoing = !!activeBreak;
  const progress = ((MAX_SECONDS - remaining) / MAX_SECONDS) * 100;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      <div
        className={`rounded-2xl shadow-xl border backdrop-blur-sm transition-all duration-300 ${
          isOngoing
            ? "bg-white dark:bg-gray-900 border-orange-200 dark:border-orange-800 w-56"
            : "bg-white dark:bg-gray-900 border-green-200 dark:border-green-800 w-auto"
        }`}
      >
        {isOngoing ? (
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-orange-600 dark:text-orange-400 flex items-center gap-1">
                <Coffee className="w-3.5 h-3.5" />
                On Break
              </span>
              <span className="text-xs text-gray-500">{formatTime(remaining)}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-3">
              <div
                className={`h-1.5 rounded-full transition-all duration-1000 ${
                  remaining <= 60
                    ? "bg-red-500"
                    : remaining <= 300
                    ? "bg-yellow-500"
                    : "bg-orange-500"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <button
              onClick={handleEnd}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Square className="w-4 h-4" />
              End Break
            </button>
          </div>
        ) : (
          <button
            onClick={handleStart}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Coffee className="w-4 h-4" />
            {loading ? "Starting..." : "Start Break"}
          </button>
        )}
      </div>
    </div>
  );
}
