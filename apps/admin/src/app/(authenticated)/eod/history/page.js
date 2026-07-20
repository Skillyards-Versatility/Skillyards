import { EodHistoryClient } from "@/components/eod/EodHistoryClient";

export const dynamic = "force-dynamic";

export default function EodHistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">EOD History</h1>
        <p className="text-muted-foreground mt-1">Browse past EOD report submissions.</p>
      </div>
      <EodHistoryClient />
    </div>
  );
}
