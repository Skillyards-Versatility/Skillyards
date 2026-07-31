import { redirect } from "next/navigation";
import { getSettings } from "@/actions/settings";
import { EodAnalyticsClient } from "@/components/eod/EodAnalyticsClient";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function EodAnalyticsPage() {
  const settings = await getSettings();
  if (settings.eod_analytics_feature === false) redirect("/dashboard");

  const session = await getSession();
  const isAdmin = session?.role === "ADMIN";
  const isManager = session?.role === "MANAGER";

  return (
    <div className="space-y-6">
      <EodAnalyticsClient isAdmin={isAdmin} isManager={isManager} userName={session?.name} />
    </div>
  );
}
