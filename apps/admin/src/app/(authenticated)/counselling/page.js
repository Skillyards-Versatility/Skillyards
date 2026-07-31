import { redirect } from "next/navigation";
import { getSettings } from "@/actions/settings";
import { getSession } from "@/lib/auth";
import { CounsellingClient } from "@/components/counselling/CounsellingClient";
import { db, users } from "@repo/db";
import { inArray, or, eq, and } from "drizzle-orm";

import { getBatches } from "@/actions/batch";

export const dynamic = "force-dynamic";

export default async function CounsellingPage() {
  const settings = await getSettings();
  if (settings.counselling_feature === false) redirect("/dashboard");

  const session = await getSession();
  const isAdmin = session?.role === "ADMIN" || session?.role === "MANAGER";
  const canEdit = session?.role === "ADMIN";
  
  const batches = await getBatches(); console.log("BATCHES FETCHED:", batches.length);

  let counselors = [];
  if (isAdmin) {
    counselors = await db
      .select({ id: users.id, name: users.name, role: users.role })
      .from(users)
      .where(
        or(
          eq(users.role, "ADMIN"),
          eq(users.role, "SALES"),
          eq(users.role, "OUTSIDE_SALES"),
          and(eq(users.role, "MANAGER"), eq(users.team, "sales"))
        )
      );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <CounsellingClient isAdmin={isAdmin} canEdit={canEdit} counselors={counselors} batches={batches} />
    </div>
  );
}
