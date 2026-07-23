import { db, leaves, users } from "@repo/db";
import { eq, desc, and, gte, lte, ne } from "drizzle-orm";
import { createProtectedRoute } from "@/lib/middleware";

async function postHandler(req, { ctx }) {
  try {
    const { startDate, endDate, type, reason, isHalfDay, halfDayPeriod } = await req.json();

    if (!startDate || (!isHalfDay && !endDate) || !type || !reason) {
      return Response.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = isHalfDay ? new Date(startDate) : new Date(endDate);
    
    // Convert current time to IST (UTC+5:30) for cutoff evaluations
    const nowUtc = new Date();
    const nowIST = new Date(nowUtc.getTime() + (5.5 * 60 * 60 * 1000));
    
    // Convert to local date boundaries for comparison
    const leaveDayStart = new Date(start);
    leaveDayStart.setHours(0, 0, 0, 0);

    // Time cutoff validation for Half Days
    if (isHalfDay) {
      if (halfDayPeriod === "MORNING") {
        if (nowIST >= leaveDayStart) {
          return Response.json(
            { success: false, message: "Morning half-days must be applied before the day begins." },
            { status: 400 }
          );
        }
      } else if (halfDayPeriod === "EVENING") {
        const noonCutoff = new Date(leaveDayStart);
        noonCutoff.setHours(12, 0, 0, 0);
        if (nowIST >= noonCutoff) {
          return Response.json(
            { success: false, message: "Evening half-days must be applied before 12:00 PM on the same day." },
            { status: 400 }
          );
        }
      } else {
        return Response.json(
          { success: false, message: "Invalid half day period" },
          { status: 400 }
        );
      }
    }

    const timeDiff = end.getTime() - start.getTime();
    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    const requestedDays = isHalfDay ? 0.5 : dayDiff;

    if (type !== "UNPAID") {
      const firstDay = new Date(start.getFullYear(), start.getMonth(), 1);
      const lastDay = new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59, 999);

      // Fetch all paid leaves for the month
      const existingLeaves = await db
        .select({ id: leaves.id, isHalfDay: leaves.isHalfDay, startDate: leaves.startDate, endDate: leaves.endDate })
        .from(leaves)
        .where(
          and(
            eq(leaves.userId, ctx.session.userId),
            gte(leaves.startDate, firstDay),
            lte(leaves.startDate, lastDay),
            ne(leaves.status, "REJECTED"),
            ne(leaves.type, "UNPAID")
          )
        );

      let totalPaidTaken = 0;
      for (const l of existingLeaves) {
        if (l.isHalfDay) {
          totalPaidTaken += 0.5;
        } else {
          const tDiff = l.endDate.getTime() - l.startDate.getTime();
          totalPaidTaken += Math.ceil(tDiff / (1000 * 3600 * 24)) + 1;
        }
      }
      
      const maxAllowedDays = 1.0 - totalPaidTaken;

      if (maxAllowedDays <= 0) {
        return Response.json(
          { success: false, message: "You have already used your paid leave allowance for this month." },
          { status: 400 }
        );
      }

      if (requestedDays > maxAllowedDays) {
        // We only auto-split if they have a full 1.0 day available and request multi-days
        if (maxAllowedDays === 1.0 && !isHalfDay && requestedDays > 1) {
          // Allowed to proceed, it will be split by the logic below
        } else {
          return Response.json(
            { success: false, message: `Leave limit exceeded. You have ${maxAllowedDays} paid leaves remaining this month.` },
            { status: 400 }
          );
        }
      }
    }

    let result;

    if (type !== "UNPAID" && !isHalfDay && dayDiff > 1) {
      // Split into 1 day paid, rest unpaid
      const [paidLeave] = await db.insert(leaves).values({
        userId: ctx.session.userId,
        startDate: start,
        endDate: start,
        type,
        reason,
        status: "PENDING",
        isHalfDay: false
      }).returning();
      
      const unpaidStart = new Date(start);
      unpaidStart.setDate(unpaidStart.getDate() + 1);

      await db.insert(leaves).values({
        userId: ctx.session.userId,
        startDate: unpaidStart,
        endDate: end,
        type: "UNPAID",
        reason: `${reason} (Auto-split unpaid portion)`,
        status: "PENDING",
        isHalfDay: false
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
          status: "PENDING",
          isHalfDay: isHalfDay || false,
          halfDayPeriod: isHalfDay ? halfDayPeriod : null
        })
        .returning();
      result = inserted;
    }

    ctx.log("LEAVE_APPLIED", { userId: ctx.session.userId, leaveId: result.id, isHalfDay });

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
        isHalfDay: leaves.isHalfDay,
        halfDayPeriod: leaves.halfDayPeriod,
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
