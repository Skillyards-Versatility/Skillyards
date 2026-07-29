import { db, users } from "@repo/db";
import { eq, lt, and, desc } from "drizzle-orm";
import { createProtectedRoute } from "@/lib/middleware";

async function getHandler(req, { ctx }) {
  const allUsers = await db
    .select({
      id: users.id,
      name: users.name,
      role: users.role,
      team: users.team,
      statusEmoji: users.statusEmoji,
      statusText: users.statusText,
      lastSeenAt: users.lastSeenAt,
      profileImageKey: users.profileImageKey,
    })
    .from(users)
    .orderBy(desc(users.lastSeenAt));
  return Response.json({ users: allUsers });
}

async function patchHandler(req, { ctx }) {
  await db
    .update(users)
    .set({ lastSeenAt: new Date() })
    .where(eq(users.id, ctx.session.userId));
  return Response.json({ success: true });
}

export const GET = createProtectedRoute(getHandler, {
  policy: (session) => ({
    authorized: !!session?.userId,
    reason: session?.userId ? "Authenticated" : "Login required",
  }),
});

export const PATCH = createProtectedRoute(patchHandler, {
  policy: (session) => ({
    authorized: !!session?.userId,
    reason: session?.userId ? "Authenticated" : "Login required",
  }),
});
