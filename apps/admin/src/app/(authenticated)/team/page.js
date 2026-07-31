import { redirect } from "next/navigation";
import { getSettings } from "@/actions/settings";
import { TeamDirectoryClient } from "@/components/team/TeamDirectoryClient";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const settings = await getSettings();
  if (settings.team_feature === false) redirect("/dashboard");

  const session = await getSession();
  
  return <TeamDirectoryClient userRole={session?.role || "SALES"} />;
}
