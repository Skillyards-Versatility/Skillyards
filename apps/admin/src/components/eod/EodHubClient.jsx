"use client";

import Link from "next/link";
import { ClipboardList, Send, History, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getIstDate, isIstBeforeCutoff, isIstSunday, formatIstDate } from "@/lib/ist";
import { getMyEodSubmissions } from "@/actions/eod";

export function EodHubClient({ userName }) {
  const [status, setStatus] = useState(null);
  const today = getIstDate();
  const canSubmit = !isIstSunday() && isIstBeforeCutoff();
  const isSunday = isIstSunday();

  useEffect(() => {
    getMyEodSubmissions().then((res) => {
      if (res.success) {
        const todayReport = res.reports?.find((r) => r.date === today);
        setStatus(todayReport ? "submitted" : "pending");
      }
    });
  }, [today]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">EOD Reports</h1>
        <p className="text-muted-foreground mt-1">
          Submit and track your daily end-of-day reports.
        </p>
      </div>

      {/* Today's Status */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${status === "submitted" ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-amber-100 dark:bg-amber-900/30"}`}>
              {status === "submitted" ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{formatIstDate(today)}</h2>
              <p className="text-sm text-muted-foreground">
                {isSunday
                  ? "No submissions on Sundays"
                  : status === "submitted"
                    ? "Report submitted"
                    : canSubmit
                      ? "Report pending — submit before 6:30 PM IST"
                      : "Cutoff passed — submissions locked"}
              </p>
            </div>
          </div>
          {canSubmit && status !== "submitted" && (
            <Link
              href="/eod/submit"
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-all text-sm"
            >
              <Send className="h-4 w-4" />
              Submit Now
            </Link>
          )}
          {canSubmit && status === "submitted" && (
            <Link
              href="/eod/submit"
              className="flex items-center gap-2 border border-border px-4 py-2.5 rounded-xl font-medium hover:bg-muted transition-all text-sm"
            >
              Edit Report
            </Link>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/eod/submit" className="card p-6 hover:border-primary/50 hover:bg-primary/5 transition-all group">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary/20 transition-colors">
              <Send className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">Submit Report</h3>
              <p className="text-sm text-muted-foreground">Fill in today&apos;s EOD report</p>
            </div>
          </div>
        </Link>
        <Link href="/eod/history" className="card p-6 hover:border-primary/50 hover:bg-primary/5 transition-all group">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary/20 transition-colors">
              <History className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">View History</h3>
              <p className="text-sm text-muted-foreground">Browse past submissions</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
