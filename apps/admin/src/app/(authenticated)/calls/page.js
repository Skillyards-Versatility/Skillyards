import { redirect } from "next/navigation";
import { getSettings } from "@/actions/settings";
import { getBDACallCounts } from "@/actions/calls";
import { getUsers } from "@/actions/users";
import { getSession } from "@/lib/auth";
import { CallsClient } from "./calls-client";

export const dynamic = "force-dynamic";

export default async function CallsPage() {
  const settings = await getSettings();
  if (settings.calls_feature === false) redirect("/dashboard");

  const session = await getSession();
  
  if (!["ADMIN", "MANAGER"].includes(session?.role)) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground text-sm">You do not have permission to view call logs.</p>
      </div>
    );
  }

  const initialCounts = await getBDACallCounts();
  const allUsers = await getUsers();
  
  // Filter users to only show BDAs (SALES role)
  const bdaUsers = allUsers.filter(u => u.role === "SALES");
  const isAdmin = session?.role === "ADMIN";

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-8">
      <CallsClient initialCounts={initialCounts} allUsers={bdaUsers} isAdmin={isAdmin} />
    </div>
  );
}
