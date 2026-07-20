import { BreaksPageClient } from "@/components/breaks/BreaksPageClient";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function BreaksPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return <BreaksPageClient userId={session.userId} userRole={session.role} />;
}
