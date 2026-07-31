import { redirect } from "next/navigation";
import { getSettings } from "@/actions/settings";
import { LeavesHubClient } from "@/components/leaves/LeavesHubClient";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LeavesPage() {
  const settings = await getSettings();
  if (settings.leaves_feature === false) redirect("/dashboard");

  const session = await getSession();
  
  return <LeavesHubClient userRole={session?.role || "SALES"} />;
}
