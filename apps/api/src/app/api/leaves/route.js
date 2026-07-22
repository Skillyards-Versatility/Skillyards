import { db, leaves, users } from "@repo/db";
import { eq, desc, and, gte, lte, ne } from "drizzle-orm";
import { createProtectedRoute } from "@/lib/middleware";

async function postHandler(req, { ctx }) {
  try {
    const { startDate, endDate, type, reason } = await req.json();

    if (!startDate || !endDate || !type || !reason) {
      return Response.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const firstDay = new Date(start.getFullYear(), start.getMonth(), 1);
    const lastDay = new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59, 999);

    const [existingLeave] = await db
      .select({ id: leaves.id })
      .from(leaves)
      .where(
        and(
          eq(leaves.userId, ctx.session.userId),
          gte(leaves.startDate, firstDay),
          lte(leaves.startDate, lastDay),
          ne(leaves.status, "REJECTED")
        )
      )
      .limit(1);

    if (existingLeave) {
      return Response.json(
        { success: false, message: "You have already applied for a leave this month." },
        { status: 400 }
      );
    }

    const [result] = await db
      .insert(leaves)
      .values({
        userId: ctx.session.userId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        type,
        reason,
        status: "PENDING"
      })
      .returning();

    ctx.log("LEAVE_APPLIED", { userId: ctx.session.userId, leaveId: result.id });

    return Response.json({ success: true, leave: result });
  } catch (error) {
    ctx.error("LEAVE_APPLY_FAILED", { error: error.message });
    return Response.json(
      { success: false, message: "Failed to apply for leave" },
      { status: 500 }
    );
  }
}

async function getHandler(req, { ctx }) {
  try {
    const [user] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, ctx.session.userId))
      .limit(1);

    let query = db
      .select({
        id: leaves.id,
        startDate: leaves.startDate,
        endDate: leaves.endDate,
        type: leaves.type,
        reason: leaves.reason,
        status: leaves.status,
        rejectionReason: leaves.rejectionReason,
        createdAt: leaves.createdAt,
        userName: users.name,
        userEmail: users.email
      })
      .from(leaves)
      .leftJoin(users, eq(leaves.userId, users.id))
      .orderBy(desc(leaves.createdAt));

    // If regular user, only show their leaves
    if (user.role !== "ADMIN" && user.role !== "MANAGER") {
      query = query.where(eq(leaves.userId, ctx.session.userId));
    }

    const data = await query;

    return Response.json({ success: true, leaves: data });
  } catch (error) {
    ctx.error("LEAVES_FETCH_FAILED", { error: error.message });
    return Response.json(
      { success: false, message: "Failed to fetch leaves" },
      { status: 500 }
    );
  }
}

export const POST = createProtectedRoute(postHandler, {
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
