import { EodFormClient } from "@/components/eod/EodFormClient";
import { getSession } from "@/lib/auth";
import { db, users, eodReports, counsellingSessions } from "@repo/db";
import { eq, and, sql } from "drizzle-orm";
import { getIstDate } from "@/lib/ist";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EodSubmitPage() {
  const session = await getSession();

  if (session?.role === "ADMIN") {
    redirect("/eod/history");
  }

  const [user] = await db
    .select({ team: users.team, role: users.role })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  const today = getIstDate();
  const [existing] = await db
    .select()
    .from(eodReports)
    .where(and(eq(eodReports.userId, session.userId), eq(eodReports.date, today)))
    .limit(1);

  // Auto-populate counselling counts from session logs
  const [counsellingCounts] = await db
    .select({
      total: sql`count(*)::int`,
      walkIn: sql`sum(case when source = 'walk_in' then 1 else 0 end)::int`,
      phoneReferral: sql`sum(case when source in ('phone', 'referral') then 1 else 0 end)::int`,
      booked: sql`sum(case when outcome in ('session_booked', 'enrolled') then 1 else 0 end)::int`,
    })
    .from(counsellingSessions)
    .where(and(eq(counsellingSessions.counselorId, session.userId), eq(counsellingSessions.sessionDate, today)));

  const counsellingDefaults = {
    counsellingDone: counsellingCounts?.phoneReferral || 0,
    counsellingBooked: counsellingCounts?.booked || 0,
    walkinCounselling: counsellingCounts?.walkIn || 0,
  };

  if (!user?.team) {
    return (
      <div className="card p-12 text-center">
        <p className="text-muted-foreground">You are not assigned to a team. Please contact an admin.</p>
      </div>
    );
  }

  return <EodFormClient team={user.team} role={user.role} existingReport={existing || null} counsellingDefaults={counsellingDefaults} />;
}
