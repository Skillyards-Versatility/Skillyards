import { EodAnalyticsClient } from "@/components/eod/EodAnalyticsClient";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function EodAnalyticsPage() {
  const session = await getSession();
  const isAdmin = session?.role === "ADMIN";
  const isManager = session?.role === "MANAGER";

  return (
    <div className="space-y-6">
      <EodAnalyticsClient isAdmin={isAdmin} isManager={isManager} />
    </div>
  );
}
