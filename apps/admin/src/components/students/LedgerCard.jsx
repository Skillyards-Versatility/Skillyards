"use client"
import { ArrowUpRight, ArrowDownRight, Wallet, IndianRupee } from "lucide-react";

export function LedgerCards({ ledger }) {
  const format = (num) => {
    if (num === undefined || num === null) return "N/A";
    return `₹${num.toLocaleString()}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* Total Due */}
      <div className="card p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-muted-foreground uppercase">
            Total Due
          </p>
          <IndianRupee className="w-4 h-4 text-muted-foreground" />
        </div>
        <p className="text-2xl font-bold text-foreground mt-3">
          {format(ledger?.total_due)}
        </p>
      </div>

      {/* Total Paid */}
      <div className="card p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-muted-foreground uppercase">
            Total Paid
          </p>
          <ArrowUpRight className="w-4 h-4 text-primary" />
        </div>
        <p className="text-2xl font-bold text-primary mt-3">
          {format(ledger?.total_paid)}
        </p>
      </div>

      {/* Pending */}
      <div className="card p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-muted-foreground uppercase">
            Pending
          </p>
          <ArrowDownRight className="w-4 h-4 text-muted-foreground" />
        </div>
        <p className="text-2xl font-bold text-foreground mt-3">
          {format(ledger?.pending)}
        </p>
      </div>

      {/* Credit */}
      <div className="card p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-muted-foreground uppercase">
            Credit
          </p>
          <Wallet className="w-4 h-4 text-primary" />
        </div>
        <p className="text-2xl font-bold text-primary mt-3">
          {format(ledger?.credit)}
        </p>
      </div>

    </div>
  );
}