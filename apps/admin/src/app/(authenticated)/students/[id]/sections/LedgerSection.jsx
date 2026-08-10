import { LedgerCards } from "@/components/students/LedgerCard";

import { API } from "@/lib/api";

async function fetchLedger(studentId) {
  const res = await fetch(`${API}/api/students/${studentId}/ledger`, { cache: "no-store" });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data ?? null;
}

export async function LedgerSection({ ledger }) {
  const totalDue = ledger?.totalDue ?? 0;

  return (
    <div className="space-y-4">
      <LedgerCards ledger={{
        total_due: ledger?.totalDue,
        total_paid: ledger?.totalPaid,
        pending: ledger?.pending,
        credit: ledger?.credit,
      }} />

      {totalDue === 0 && (
        <div className="p-4 bg-muted/50 rounded-lg border border-border flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Note:</span> No active payment plan has been assigned to this student yet.
          </div>
        </div>
      )}
    </div>
  );
}
