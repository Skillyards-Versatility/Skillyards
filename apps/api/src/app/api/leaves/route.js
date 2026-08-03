import { db, leaves, users } from "@repo/db";
import { eq, desc, and, or, gte, lte, ne } from "drizzle-orm";
import { createProtectedRoute } from "@/lib/middleware";
import { sendLeaveNotification } from "@/modules/notifications/email.service";

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
    
    // Validate: no past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startNormalized = new Date(start);
    startNormalized.setHours(0, 0, 0, 0);

    if (startNormalized < today) {
      return Response.json(
        { success: false, message: "Leave cannot be applied for past dates." },
        { status: 400 }
      );
    }

    // Validate: at least 2 days notice (only for full-day leaves)
    if (!isHalfDay) {
      const diffDays = Math.ceil((startNormalized.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < 2) {
        return Response.json(
          { success: false, message: "Leave must be applied at least 2 days in advance." },
          { status: 400 }
        );
      }
    }

    // Check for overlapping leaves
    const [overlap] = await db
      .select({ id: leaves.id })
      .from(leaves)
      .where(
        and(
          eq(leaves.userId, ctx.session.userId),
          ne(leaves.status, "REJECTED"),
          lte(leaves.startDate, end),
          gte(leaves.endDate, start)
        )
      )
      .limit(1);

    if (overlap) {
      return Response.json(
        { success: false, message: "You already have a leave application that overlaps with these dates." },
        { status: 400 }
      );
    }

    // Convert current time to IST (UTC+5:30) for cutoff evaluations
    const nowUtc = new Date();
    const nowIST = new Date(nowUtc.getTime() + (5.5 * 60 * 60 * 1000));
    
    // Convert to local date boundaries for comparison
    const leaveDayStart = new Date(start);
    leaveDayStart.setHours(0, 0, 0, 0);

    // Time cutoff validation for Half Days
    if (isHalfDay) {
      if (halfDayPeriod === "MORNING") {
        const morningCutoff = new Date(leaveDayStart);
        morningCutoff.setHours(9, 30, 0, 0); // 9:30 AM
        if (nowIST >= morningCutoff) {
          return Response.json(
            { success: false, message: "Morning half-days must be applied before 9:30 AM on the same day." },
            { status: 400 }
          );
        }
      } else if (halfDayPeriod === "EVENING") {
        const noonCutoff = new Date(leaveDayStart);
        noonCutoff.setHours(14, 0, 0, 0); // 2:00 PM
        if (nowIST >= noonCutoff) {
          return Response.json(
            { success: false, message: "Evening half-days must be applied before 2:00 PM on the same day." },
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

    // Calculate contiguous blocks excluding Sundays
    const blocks = [];
    let currentBlock = null;
    let curr = new Date(start);
    
    // For half days, start === end, so this loops exactly once
    while (curr <= end) {
      if (curr.getDay() !== 0) { // 0 is Sunday
        if (!currentBlock) {
          currentBlock = { start: new Date(curr), end: new Date(curr) };
        } else {
          currentBlock.end = new Date(curr);
        }
      } else {
        if (currentBlock) {
          blocks.push(currentBlock);
          currentBlock = null;
        }
      }
      curr.setDate(curr.getDate() + 1);
    }
    if (currentBlock) {
      blocks.push(currentBlock);
    }

    if (blocks.length === 0) {
      return Response.json(
        { success: false, message: "Selected leave period only contains Sundays (off days)." },
        { status: 400 }
      );
    }

    // Calculate total requested working days
    let requestedDays = 0;
    if (isHalfDay) {
      requestedDays = 0.5;
    } else {
      blocks.forEach(b => {
        const tDiff = b.end.getTime() - b.start.getTime();
        requestedDays += Math.ceil(tDiff / (1000 * 3600 * 24)) + 1;
      });
    }

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
          // Compute working days in existing leaves to be safe, though existing leaves already exclude Sundays
          // We will just do standard diff here since they were inserted as valid blocks
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
        if (maxAllowedDays === 1.0 && !isHalfDay && requestedDays > 1) {
          // Allow split
        } else {
          return Response.json(
            { success: false, message: `Leave limit exceeded. You have ${maxAllowedDays} paid leaves remaining this month.` },
            { status: 400 }
          );
        }
      }
    }

    let result;

    if (isHalfDay) {
      // Half days are exactly one block of 1 day
      const [inserted] = await db.insert(leaves).values({
        userId: ctx.session.userId,
        startDate: blocks[0].start,
        endDate: blocks[0].end,
        type,
        reason,
        status: "PENDING",
        isHalfDay: true,
        halfDayPeriod
      }).returning();
      result = inserted;
    } else if (type !== "UNPAID" && requestedDays > 1) {
      // Split logic: first day of first block is PAID, everything else is UNPAID
      let isFirstDay = true;
      for (const b of blocks) {
        let currentDay = new Date(b.start);
        while (currentDay <= b.end) {
          if (isFirstDay) {
            const [paidLeave] = await db.insert(leaves).values({
              userId: ctx.session.userId,
              startDate: currentDay,
              endDate: currentDay,
              type,
              reason,
              status: "PENDING",
              isHalfDay: false
            }).returning();
            result = paidLeave; // Return the paid leave record as result
            isFirstDay = false;
          } else {
            // Group the remaining contiguous days in this block? 
            // For simplicity, we can insert the rest of the block as a single UNPAID leave
            await db.insert(leaves).values({
              userId: ctx.session.userId,
              startDate: currentDay,
              endDate: b.end,
              type: "UNPAID",
              reason: `${reason} (Auto-split unpaid portion)`,
              status: "PENDING",
              isHalfDay: false
            });
            break; // Break the while loop since we inserted the rest of the block
          }
          currentDay.setDate(currentDay.getDate() + 1);
        }
      }
    } else {
      // Insert all blocks directly (either UNPAID or a 1-day PAID leave)
      for (let i = 0; i < blocks.length; i++) {
        const [inserted] = await db.insert(leaves).values({
          userId: ctx.session.userId,
          startDate: blocks[i].start,
          endDate: blocks[i].end,
          type,
          reason,
          status: "PENDING",
          isHalfDay: false
        }).returning();
        
        if (i === 0) result = inserted;
      }
    }

    ctx.log("LEAVE_APPLIED", { userId: ctx.session.userId, leaveId: result.id, isHalfDay });

    try {
      const [applicant] = await db
        .select({ name: users.name })
        .from(users)
        .where(eq(users.id, ctx.session.userId))
        .limit(1);

      const notifiers = await db
        .select({ name: users.name, email: users.email })
        .from(users)
        .where(or(eq(users.role, "HR"), eq(users.role, "ADMIN")));

      const leave = {
        applicantName: applicant?.name || "Unknown",
        type: result.type,
        reason: result.reason,
        startDate: result.startDate,
        endDate: result.endDate,
        isHalfDay: result.isHalfDay,
        halfDayPeriod: result.halfDayPeriod,
      };

      for (const n of notifiers) {
        sendLeaveNotification({ to: n.email, recipientName: n.name, leave }).catch((err) =>
          ctx.error("LEAVE_NOTIFICATION_FAILED", { userId: n.name, error: err.message })
        );
      }
    } catch (notifErr) {
      ctx.error("LEAVE_NOTIFICATION_ERROR", { error: notifErr.message });
    }

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
    
    let calendarLeaves = [];
    if (user.role !== "ADMIN" && user.role !== "MANAGER") {
      calendarLeaves = await db
        .select({
          id: leaves.id,
          startDate: leaves.startDate,
          endDate: leaves.endDate,
          type: leaves.type,
          status: leaves.status,
          isHalfDay: leaves.isHalfDay,
          halfDayPeriod: leaves.halfDayPeriod,
          userName: users.name,
        })
        .from(leaves)
        .leftJoin(users, eq(leaves.userId, users.id))
        .where(
          and(
            eq(leaves.status, "APPROVED"),
            ne(leaves.userId, ctx.session.userId)
          )
        );
    }

    // Calculate current month's paid leave balance for the logged-in user
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

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

    const availableBalance = 1.0 - totalPaidTaken;

    return Response.json({ success: true, leaves: data, calendarLeaves, availableBalance });
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
