"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Calendar, Users, FileText, Clock, CheckCircle2, Filter } from "lucide-react";
import { getEodHistory } from "@/actions/eod";
import { formatIstDate, getIstDate } from "@/lib/ist";

const TEAM_LABELS = {
  sales: "Sales",
  tech: "Tech",
  hr: "HR",
  ceo_office: "CEO Office",
  admin_head: "Admin Head",
  marketing: "Marketing",
  outside_sales: "Outside Sales",
};

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

export function EodHistoryClient() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teamFilter, setTeamFilter] = useState("");
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 14);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(getIstDate());

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await getEodHistory({ startDate, endDate, team: teamFilter || undefined });
      if (res.success) {
        setReports(res.reports);
      } else {
        toast.error("Failed to load history");
      }
    } catch {
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [teamFilter, startDate, endDate]);

  // Group by date
  const grouped = {};
  for (const r of reports) {
    if (!grouped[r.date]) grouped[r.date] = [];
    grouped[r.date].push(r);
  }

  const dates = Object.keys(grouped).sort().reverse();

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="card p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
          <input
            type="date"
            className="input text-sm py-1.5"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span className="text-muted-foreground text-sm hidden sm:inline">to</span>
          <input
            type="date"
            className="input text-sm py-1.5"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <select
            className="input text-sm py-1.5"
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
          >
            {TEAM_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="card p-6 sm:p-12 text-center text-muted-foreground">Loading...</div>
      ) : dates.length === 0 ? (
        <div className="card p-6 sm:p-12 text-center text-muted-foreground">
          <FileText className="h-10 sm:h-12 w-10 sm:w-12 mx-auto mb-3 opacity-30" />
          <p>No reports found for this period.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {dates.map((date) => (
            <div key={date}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatIstDate(date)}
              </h3>
              <div className="space-y-2">
                {grouped[date].map((report) => (
                  <div key={report.id} className="card p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                          {(report.userName || "U").charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{report.userName}</div>
                          <div className="text-xs text-muted-foreground">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                              report.team === "sales" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                              report.team === "tech" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" :
                              report.team === "hr" ? "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400" :
                              report.team === "ceo_office" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                              report.team === "admin_head" ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400" :
                              report.team === "marketing" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                              report.team === "outside_sales" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" :
                              "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                            }`}>
                              {TEAM_LABELS[report.team] || report.team}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground pl-12 sm:pl-0">
                        {report.emailedAt && (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                            Emailed
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(report.submittedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" })}
                        </span>
                      </div>
                    </div>
                    {/* Show key data fields */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {Object.entries(report.data || {}).filter(([k, v]) => v && k !== "notes").slice(0, 5).map(([k, v]) => (
                        <span key={k} className="text-xs bg-muted px-2 py-1 rounded-md">
                          <span className="text-muted-foreground">{k.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}:</span>{" "}
                          <span className="font-medium">{v}</span>
                        </span>
                      ))}
                    </div>
                    {report.data?.notes && (
                      <p className="mt-2 text-xs text-muted-foreground italic line-clamp-2">{report.data.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
