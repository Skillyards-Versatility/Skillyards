import { SidebarProvider } from "@/components/providers/SidebarProvider";
import { LayoutContent } from "@/components/layout/LayoutContent";
import { getSession } from "@/lib/auth";
import { db, users } from "@repo/db";
import { eq } from "drizzle-orm";

export default async function AuthenticatedLayout({ children }) {
  const session = await getSession();
  let user = session ? { name: session.name, role: session.role, profileImageKey: null } : null;

  if (session) {
    try {
      const [dbUser] = await db
        .select({ profileImageKey: users.profileImageKey })
        .from(users)
        .where(eq(users.id, session.userId))
        .limit(1);
      if (dbUser) {
        user.profileImageKey = dbUser.profileImageKey;
      }
    } catch {
      // ignore
    }
  }

  return (
    <SidebarProvider>
      <LayoutContent user={user}>{children}</LayoutContent>
    </SidebarProvider>
  );
}
