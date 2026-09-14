import { IndianRupee } from "lucide-react";

export function FeeSummaryCards({ netPayable, totalPaid, balance }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      <div className="card p-4 sm:p-5">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Total Fee
        </p>
        <p className="text-xl sm:text-2xl font-bold text-foreground mt-2">
          ₹{netPayable.toLocaleString()}
        </p>
      </div>
      <div className="card p-4 sm:p-5 border-primary/20">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Total Paid
        </p>
        <p className="text-xl sm:text-2xl font-bold text-primary mt-2">
          ₹{totalPaid.toLocaleString()}
        </p>
      </div>
      <div className="card p-4 sm:p-5 bg-card relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <IndianRupee className="w-16 h-16" />
        </div>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider relative z-10">
          Balance Due
        </p>
        <p
          className={`text-xl sm:text-2xl font-bold mt-2 relative z-10 ${balance > 0 ? "text-red-500" : "text-foreground"}`}
        >
          ₹{balance.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
