import { db, users } from "@repo/db";
import { eq } from "drizzle-orm";
import { createProtectedRoute } from "@/lib/middleware";

async function patchHandler(req, { ctx }) {
  try {
    const { statusEmoji, statusText, statusClearAt } = await req.json();

    const [updatedUser] = await db
      .update(users)
      .set({
        statusEmoji: statusEmoji || null,
        statusText: statusText || null,
        statusClearAt: statusClearAt ? new Date(statusClearAt) : null,
      })
      .where(eq(users.id, ctx.session.userId))
      .returning();

    ctx.log("USER_STATUS_UPDATED", { userId: ctx.session.userId, statusEmoji, statusText });

    return Response.json({ success: true, user: updatedUser });
  } catch (error) {
    ctx.error("USER_STATUS_UPDATE_FAILED", { error: error.message });
    return Response.json(
      { success: false, message: "Failed to update status" },
      { status: 500 }
    );
  }
}

async function getHandler(req, { ctx }) {
  try {
    // Only return active statuses for users in the same team/company
    // We'll fetch all users for now, or you could filter by team
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        team: users.team,
        statusEmoji: users.statusEmoji,
        statusText: users.statusText,
        statusClearAt: users.statusClearAt,
        profileImageKey: users.profileImageKey
      })
      .from(users);

    return Response.json({ success: true, users: allUsers });
  } catch (error) {
    ctx.error("USER_STATUS_FETCH_FAILED", { error: error.message });
    return Response.json(
      { success: false, message: "Failed to fetch statuses" },
      { status: 500 }
    );
  }
}

export const PATCH = createProtectedRoute(patchHandler, {
  isPublic: false,
  policy: (session) => ({
    authorized: !!session?.userId,
    reason: session?.userId ? "Authenticated" : "Login required",
  }),
});

export const GET = createProtectedRoute(getHandler, {
  isPublic: false,
  policy: (session) => ({
    authorized: !!session?.userId,
    reason: session?.userId ? "Authenticated" : "Login required",
  }),
});
