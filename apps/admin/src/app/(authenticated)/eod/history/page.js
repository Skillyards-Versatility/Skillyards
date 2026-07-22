import { EodHistoryClient } from "@/components/eod/EodHistoryClient";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function EodHistoryPage() {
  const session = await getSession();
  const isAdmin = session?.role === "ADMIN";
  const isManager = session?.role === "MANAGER";

  return (
    <div className="space-y-6">
      <EodHistoryClient isAdmin={isAdmin} isManager={isManager} />
    </div>
  );
}
