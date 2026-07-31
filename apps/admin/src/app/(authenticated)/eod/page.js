import { getSettings } from "@/actions/settings";
import { EodHubClient } from "@/components/eod/EodHubClient";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EodPage() {
  const settings = await getSettings();
  if (settings.eod_feature === false) redirect("/dashboard");

  const session = await getSession();
  
  if (session?.role === "ADMIN") {
    redirect("/eod/history");
  }

  return <EodHubClient userName={session?.name || "User"} />;
}
