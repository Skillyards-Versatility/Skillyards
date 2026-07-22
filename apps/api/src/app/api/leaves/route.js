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
    const end = new Date(endDate);

    if (type !== "UNPAID") {
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
            ne(leaves.status, "REJECTED"),
            ne(leaves.type, "UNPAID")
          )
        )
        .limit(1);

      if (existingLeave) {
        return Response.json(
          { success: false, message: "You have already used your paid leave allowance for this month." },
          { status: 400 }
        );
      }
    }

    const timeDiff = end.getTime() - start.getTime();
    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

    let result;

    if (type !== "UNPAID" && dayDiff > 1) {
      // Split into 1 day paid, rest unpaid
      const [paidLeave] = await db.insert(leaves).values({
        userId: ctx.session.userId,
        startDate: start,
        endDate: start,
        type,
        reason,
        status: "PENDING"
      }).returning();
      
      const unpaidStart = new Date(start);
      unpaidStart.setDate(unpaidStart.getDate() + 1);

      await db.insert(leaves).values({
        userId: ctx.session.userId,
        startDate: unpaidStart,
        endDate: end,
        type: "UNPAID",
        reason: `${reason} (Auto-split unpaid portion)`,
        status: "PENDING"
      });

      result = paidLeave;
    } else {
      const [inserted] = await db
        .insert(leaves)
        .values({
          userId: ctx.session.userId,
          startDate: start,
          endDate: end,
          type,
          reason,
          status: "PENDING"
        })
        .returning();
      result = inserted;
    }

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
