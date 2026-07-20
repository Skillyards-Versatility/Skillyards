import { EodHubClient } from "@/components/eod/EodHubClient";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function EodPage() {
  const session = await getSession();
  return <EodHubClient userName={session?.name || "User"} />;
}
