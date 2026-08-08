"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserCheck, ChevronLeft, ChevronRight } from "lucide-react";

export function LatestStudentsTable({
  students,
  enrolledIn,
  laptopOpted = "all",
  initialStartDate = "",
  initialEndDate = "",
  currentPage = 1,
  hasNextPage = false,
}) {
  const router = useRouter();
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleApply = (e) => {
    e.preventDefault();
    if (!startDate) return;
    router.push(`/dashboard?enrolledIn=custom&startDate=${startDate}&endDate=${endDate}&latestPage=1`, { scroll: false });
  };

  return (
    <div className="card overflow-hidden">
      <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between bg-card text-card-foreground gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-foreground">Latest Enrolled Students</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Students registered in the selected period.</p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Link
            href={`/dashboard?enrolledIn=current&latestPage=1`}
            scroll={false}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              enrolledIn === "current"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            This Month
          </Link>
          <Link
            href={`/dashboard?enrolledIn=past&latestPage=1`}
            scroll={false}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              enrolledIn === "past"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Last Month
          </Link>
          <Link
            href={`/dashboard?enrolledIn=all&latestPage=1`}
            scroll={false}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              enrolledIn === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            All Time
          </Link>
          <Link
            href={`/dashboard?enrolledIn=custom&latestPage=1`}
            scroll={false}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              enrolledIn === "custom"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Custom Range
          </Link>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-2.5 border-b border-border bg-muted/20 flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-muted-foreground font-semibold mr-1">Laptop:</span>
        {[
          { value: "all", label: "All" },
          { value: "opted", label: "Opted" },
          { value: "not_opted", label: "Not Opted" },
        ].map((opt) => (
          <Link
            key={opt.value}
            href={`/dashboard?enrolledIn=${enrolledIn}&startDate=${startDate}&endDate=${endDate}&laptopOpted=${opt.value}&latestPage=1`}
            scroll={false}
            className={`px-3 py-1 rounded-md font-bold transition-all ${
              laptopOpted === opt.value
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground border border-border hover:bg-muted"
            }`}
          >
            {opt.label}
          </Link>
        ))}
      </div>

      {enrolledIn === "custom" && (
        <form onSubmit={handleApply} className="p-4 border-b border-border bg-muted/20 flex flex-wrap items-end gap-3 text-xs">
          <div className="flex flex-col gap-1.5">
            <span className="font-semibold text-muted-foreground">Start Date</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs focus:ring-1 focus:ring-primary focus:outline-none w-36"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-semibold text-muted-foreground">End Date</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs focus:ring-1 focus:ring-primary focus:outline-none w-36"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-primary text-primary-foreground hover:opacity-90 transition-opacity h-[30px]"
          >
            Apply
          </button>
        </form>
      )}

      {students.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[500px]">
              <thead className="bg-muted text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-4 sm:px-6 py-3 font-semibold">Student</th>
                  <th className="px-4 sm:px-6 py-3 font-semibold">Course</th>
                  <th className="px-4 sm:px-6 py-3 font-semibold">Laptop</th>
                  <th className="px-4 sm:px-6 py-3 font-semibold">Enrolled On</th>
                  <th className="px-4 sm:px-6 py-3 font-semibold text-right">Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 sm:px-6 py-4 font-semibold text-foreground">
                      <Link href={`/students/${s.id}`} className="hover:text-primary transition-colors">
                        {s.name}
                      </Link>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-muted-foreground">{s.courseName || "—"}</td>
                    <td className="px-4 sm:px-6 py-4">
                      {s.laptopOpted ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60 text-xs font-bold">
                          Opted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-gray-100 text-gray-700 dark:bg-gray-850 dark:text-gray-400 border border-gray-200 dark:border-gray-800 text-xs font-semibold">
                          Not Opted
                        </span>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-muted-foreground">{formatDate(s.createdAt)}</td>
                    <td className="px-4 sm:px-6 py-4 text-right font-medium text-primary">
                      ₹{(s.finalFee || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── PAGINATION CONTROLS ── */}
          <div className="px-4 sm:px-6 py-3 border-t border-border flex items-center justify-between bg-card">
            <span className="text-xs text-muted-foreground font-semibold">
              Page {currentPage}
            </span>
            <div className="flex gap-2">
              <Link
                href={`/dashboard?enrolledIn=${enrolledIn}&startDate=${startDate}&endDate=${endDate}&laptopOpted=${laptopOpted}&latestPage=${currentPage - 1}`}
                scroll={false}
                className={`px-3 py-1.5 border border-border rounded-lg text-xs font-bold transition-all flex items-center gap-1 hover:bg-muted text-foreground ${
                  currentPage <= 1 ? "pointer-events-none opacity-40" : ""
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </Link>
              <Link
                href={`/dashboard?enrolledIn=${enrolledIn}&startDate=${startDate}&endDate=${endDate}&laptopOpted=${laptopOpted}&latestPage=${currentPage + 1}`}
                scroll={false}
                className={`px-3 py-1.5 border border-border rounded-lg text-xs font-bold transition-all flex items-center gap-1 hover:bg-muted text-foreground ${
                  !hasNextPage ? "pointer-events-none opacity-40" : ""
                }`}
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className="px-6 py-12 flex flex-col items-center justify-center text-center bg-card">
          <UserCheck className="w-10 h-10 text-muted-foreground/50 mb-3" />
          <h3 className="text-base font-semibold text-foreground">No students enrolled</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            There are no enrollments for the selected period.
          </p>
        </div>
      )}
    </div>
  );
}
