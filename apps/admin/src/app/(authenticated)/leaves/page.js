import { LeavesHubClient } from "@/components/leaves/LeavesHubClient";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LeavesPage() {
  const session = await getSession();
  
  return <LeavesHubClient userRole={session?.role || "SALES"} />;
}
