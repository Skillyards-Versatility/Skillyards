import { getCalls } from "@/actions/calls";
import { getSession } from "@/lib/auth";
import { CallsClient } from "./calls-client";

export const dynamic = "force-dynamic";

export default async function CallsPage() {
  const session = await getSession();
  
  if (!["ADMIN", "MANAGER"].includes(session?.role)) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground text-sm">You do not have permission to view call logs.</p>
      </div>
    );
  }

  const initialCalls = await getCalls();

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-8">
      <CallsClient initialCalls={initialCalls} />
    </div>
  );
}
