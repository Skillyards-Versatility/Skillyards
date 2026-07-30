import { getSession } from "@/lib/auth";
import { CounsellingClient } from "@/components/counselling/CounsellingClient";
import { db, users } from "@repo/db";
import { inArray, or, eq, and } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function CounsellingPage() {
  const session = await getSession();
  const isAdmin = session?.role === "ADMIN" || session?.role === "MANAGER";

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
      <CounsellingClient isAdmin={isAdmin} counselors={counselors} />
    </div>
  );
}
