import { EodFormClient } from "@/components/eod/EodFormClient";
import { getSession } from "@/lib/auth";
import { db, users, eodReports } from "@repo/db";
import { eq, and } from "drizzle-orm";
import { getIstDate } from "@/lib/ist";

export const dynamic = "force-dynamic";

export default async function EodSubmitPage() {
  const session = await getSession();

  const [user] = await db
    .select({ team: users.team })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  const today = getIstDate();
  const [existing] = await db
    .select()
    .from(eodReports)
    .where(and(eq(eodReports.userId, session.userId), eq(eodReports.date, today)))
    .limit(1);

  if (!user?.team) {
    return (
      <div className="card p-12 text-center">
        <p className="text-muted-foreground">You are not assigned to a team. Please contact an admin.</p>
      </div>
    );
  }

  return <EodFormClient team={user.team} existingReport={existing || null} />;
}
