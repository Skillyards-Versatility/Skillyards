import { getSession } from "@/lib/auth";
import { CounsellingClient } from "@/components/counselling/CounsellingClient";

export const dynamic = "force-dynamic";

export default async function CounsellingPage() {
  const session = await getSession();
  const isAdmin = session?.role === "ADMIN" || session?.role === "MANAGER";

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <CounsellingClient isAdmin={isAdmin} />
    </div>
  );
}
