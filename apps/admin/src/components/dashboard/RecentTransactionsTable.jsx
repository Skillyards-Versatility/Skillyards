import Link from "next/link";
import { ArrowRight, Ban } from "lucide-react";

export function RecentTransactionsTable({ students }) {
  return (
    <div className="card overflow-hidden">
      <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-border flex items-center justify-between bg-card text-card-foreground gap-3">
        <h2 className="text-base sm:text-lg font-bold text-foreground">
          Outstanding Balances
        </h2>
        <Link
          href="/students"
          className="text-sm font-medium text-primary hover:opacity-80 flex items-center gap-1 group shrink-0"
        >
          View All{" "}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {students.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left min-w-[500px]">
            <thead className="bg-muted text-muted-foreground border-b border-border">
              <tr>
                <th className="px-4 sm:px-6 py-3 font-semibold">Student</th>
                <th className="px-4 sm:px-6 py-3 font-semibold">Email</th>
                <th className="px-4 sm:px-6 py-3 font-semibold text-right">
                  Net Payable
                </th>
                <th className="px-4 sm:px-6 py-3 font-semibold text-right">
                  Collected
                </th>
                <th className="px-4 sm:px-6 py-3 font-semibold text-right">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 sm:px-6 py-4 font-semibold text-foreground">
                    <Link
                      href={`/students/${s.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {s.name}
                    </Link>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-muted-foreground">
                    {s.email || s.phone || "—"}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right font-medium">
                    ₹{(s.finalFee || 0).toLocaleString()}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right font-medium text-primary">
                    ₹{(s.totalPaid || 0).toLocaleString()}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                      ₹{(s.balance || 0).toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-6 py-12 flex flex-col items-center justify-center text-center bg-card">
          <Ban className="w-10 h-10 text-muted-foreground/50 mb-3" />
          <h3 className="text-base font-semibold text-foreground">
            No outstanding balances
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            All enrolled students are fully paid up.
          </p>
        </div>
      )}
    </div>
  );
}
