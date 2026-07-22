import { TeamDirectoryClient } from "@/components/team/TeamDirectoryClient";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const session = await getSession();
  
  return <TeamDirectoryClient userRole={session?.role || "SALES"} />;
}
