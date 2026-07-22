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

      {/* Today's Status Banner */}
      <div className={`rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg transition-all ${status === "submitted" ? "bg-gradient-to-br from-emerald-500 to-emerald-700" : "bg-gradient-to-br from-amber-500 to-orange-600"}`}>
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
          {status === "submitted" ? <CheckCircle2 className="h-48 w-48" /> : <Clock className="h-48 w-48" />}
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              {isSunday ? "Rest Day" : status === "submitted" ? "Completed" : canSubmit ? "Action Required" : "Locked"}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{formatIstDate(today)}</h2>
            <p className="text-white/90 text-sm sm:text-base max-w-sm mt-1">
              {isSunday
                ? "Take a break! No EOD submissions are required on Sundays."
                : status === "submitted"
                  ? "Great job! Your end-of-day report has been successfully submitted."
                  : canSubmit
                    ? "Your report is pending. Please submit before 7:30 PM IST."
                    : "The submission window for today has closed."}
            </p>
          </div>
          
          {canSubmit && status !== "submitted" && (
            <Link
              href="/eod/submit"
              className="flex items-center justify-center gap-2 bg-white text-amber-700 hover:bg-white/90 px-6 py-3.5 rounded-xl font-bold transition-all shadow-sm hover:shadow-md active:scale-[0.98] whitespace-nowrap w-full sm:w-auto text-base"
            >
              <Send className="h-5 w-5" />
              Submit Report
            </Link>
          )}
          {canSubmit && status === "submitted" && (
            <Link
              href="/eod/submit"
              className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/20 px-6 py-3.5 rounded-xl font-bold transition-all active:scale-[0.98] whitespace-nowrap w-full sm:w-auto text-base"
            >
              Update Report
            </Link>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/eod/submit" className="card p-5 sm:p-6 hover:shadow-md hover:border-primary/30 hover:bg-primary/5 transition-all group active:scale-[0.98]">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-primary/10 rounded-2xl text-primary group-hover:bg-primary/20 group-hover:scale-110 transition-all shrink-0">
              <Send className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Submit Report</h3>
              <p className="text-sm text-muted-foreground mt-0.5">Fill in today&apos;s EOD report</p>
            </div>
          </div>
        </Link>
        <Link href="/eod/history" className="card p-5 sm:p-6 hover:shadow-md hover:border-primary/30 hover:bg-primary/5 transition-all group active:scale-[0.98]">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-primary/10 rounded-2xl text-primary group-hover:bg-primary/20 group-hover:scale-110 transition-all shrink-0">
              <History className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">View History</h3>
              <p className="text-sm text-muted-foreground mt-0.5">Browse past submissions</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
