import { SidebarProvider } from "@/components/providers/SidebarProvider";
import { LayoutContent } from "@/components/layout/LayoutContent";
import { BreakWidget } from "@/components/breaks/BreakWidget";
import { getSession } from "@/lib/auth";
import { db, users } from "@repo/db";
import { eq } from "drizzle-orm";

export default async function AuthenticatedLayout({ children }) {
  const session = await getSession();
  let user = session ? { name: session.name, role: session.role, userId: session.userId, profileImageKey: null } : null;

  if (session) {
    try {
      const [dbUser] = await db
        .select({ 
          profileImageKey: users.profileImageKey,
          statusEmoji: users.statusEmoji,
          statusText: users.statusText
        })
        .from(users)
        .where(eq(users.id, session.userId))
        .limit(1);
      if (dbUser) {
        user.profileImageKey = dbUser.profileImageKey;
        user.statusEmoji = dbUser.statusEmoji;
        user.statusText = dbUser.statusText;
      }
    } catch {
      // ignore
    }
  }

  return (
    <SidebarProvider>
      <LayoutContent user={user}>{children}</LayoutContent>
      {session && <BreakWidget />}
    </SidebarProvider>
  );
}
