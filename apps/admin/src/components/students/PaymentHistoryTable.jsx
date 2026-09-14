"use client";

import { FileText, Send, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/format";

export function PaymentHistoryTable({
  transactions,
  activePdfActions,
  onPdfAction,
}) {
  return (
    <div className="card overflow-hidden mt-2">
      <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-border bg-card">
        <h3 className="text-base sm:text-lg font-bold text-foreground">
          Payment History
        </h3>
      </div>

      {transactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left min-w-[600px]">
            <thead className="bg-muted text-muted-foreground border-b border-border text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 sm:px-6 py-3 font-semibold">Date</th>
                <th className="px-4 sm:px-6 py-3 font-semibold">Amount</th>
                <th className="px-4 sm:px-6 py-3 font-semibold">Mode</th>
                <th className="px-4 sm:px-6 py-3 font-semibold">
                  Receipt & Ref.
                </th>
                <th className="px-4 sm:px-6 py-3 font-semibold text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transactions.map((txn) => (
                <tr
                  key={txn.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 sm:px-6 py-4 text-muted-foreground font-medium whitespace-nowrap">
                    {txn.createdAt
                      ? formatDate(txn.createdAt)
                      : txn.date || "-"}
                  </td>
                  <td className="px-4 sm:px-6 py-4 font-bold text-foreground whitespace-nowrap">
                    ₹{txn.amount.toLocaleString()}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-muted text-foreground border border-border whitespace-nowrap uppercase">
                      {txn.method || txn.mode || "-"}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex flex-col text-xs gap-1">
                      <span className="font-semibold text-foreground uppercase">
                        #{(txn.receiptId || txn.id || "").slice(-6)}
                      </span>
                      <span className="text-muted-foreground">
                        Ref: {txn.note || txn.reference || "-"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 relative z-20">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onPdfAction(txn.id, "view")}
                        disabled={!!activePdfActions[txn.id]}
                        className="px-2.5 sm:px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold text-foreground border border-border bg-background rounded-md hover:bg-muted transition-colors disabled:opacity-50 whitespace-nowrap"
                      >
                        {activePdfActions[txn.id] === "view" ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <FileText className="w-3.5 h-3.5" />
                        )}
                        {activePdfActions[txn.id] === "view"
                          ? "Opening..."
                          : "View PDF"}
                      </button>
                      <button
                        onClick={() => onPdfAction(txn.id, "send")}
                        disabled={!!activePdfActions[txn.id]}
                        className="px-2.5 sm:px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20 rounded-md transition-colors disabled:opacity-50 whitespace-nowrap"
                      >
                        {activePdfActions[txn.id] === "send" ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5" />
                        )}
                        {activePdfActions[txn.id] === "send"
                          ? "Sending..."
                          : "Send PDF"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-6 py-12 flex flex-col items-center justify-center text-center">
          <FileText className="w-10 h-10 text-muted-foreground/30 mb-3" />
          <h3 className="text-sm font-bold text-foreground">
            No payment history
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Any payments recorded via the Add Payment panel will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
