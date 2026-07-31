import { getSettings } from "@/actions/settings";
import { BreaksPageClient } from "@/components/breaks/BreaksPageClient";
import { getSession } from "@/lib/auth";
import { getUsers } from "@/actions/users";
import { redirect } from "next/navigation";

export default async function BreaksPage() {
  const settings = await getSettings();
  if (settings.breaks_feature === false) redirect("/dashboard");

  const session = await getSession();
  if (!session) redirect("/login");

  const allUsers = await getUsers();

  return <BreaksPageClient userId={session.userId} userRole={session.role} users={allUsers} />;
}
