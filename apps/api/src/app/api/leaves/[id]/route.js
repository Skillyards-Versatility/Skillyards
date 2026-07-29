import { db, leaves, users } from "@repo/db";
import { eq } from "drizzle-orm";
import { createProtectedRoute } from "@/lib/middleware";
import { sendLeaveStatusNotification } from "@/modules/notifications/email.service";

async function patchHandler(req, { context, ctx, resource }) {
  try {
    const { id } = await context.params;
    const { status, rejectionReason } = await req.json();

    if (!status || !["APPROVED", "REJECTED"].includes(status)) {
      return Response.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    // Verify caller is ADMIN or MANAGER
    const [user] = await db
      .select({ role: users.role, name: users.name })
      .from(users)
      .where(eq(users.id, ctx.session.userId))
      .limit(1);

    if (user.role !== "ADMIN" && user.role !== "MANAGER") {
      return Response.json(
        { success: false, message: "Unauthorized to update leave status" },
        { status: 403 }
      );
    }

    // Prevent self-approval
    const [leaveRecord] = await db
      .select({ userId: leaves.userId })
      .from(leaves)
      .where(eq(leaves.id, id))
      .limit(1);

    if (!leaveRecord) {
      return Response.json(
        { success: false, message: "Leave not found" },
        { status: 404 }
      );
    }

    if (leaveRecord.userId === ctx.session.userId) {
      return Response.json(
        { success: false, message: "You cannot approve or reject your own leave" },
        { status: 403 }
      );
    }

    const updateData = {
      status,
      approvedById: ctx.session.userId,
      updatedAt: new Date()
    };

    if (status === "REJECTED" && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const [result] = await db
      .update(leaves)
      .set(updateData)
      .where(eq(leaves.id, id))
      .returning();

    ctx.log("LEAVE_STATUS_UPDATED", { userId: ctx.session.userId, leaveId: id, status });

    // Notify applicant
    try {
      const [applicant] = await db
        .select({ name: users.name, email: users.email })
        .from(users)
        .where(eq(users.id, leaveRecord.userId))
        .limit(1);

      if (applicant) {
        sendLeaveStatusNotification({
          to: applicant.email,
          applicantName: applicant.name,
          type: result.type,
          startDate: result.startDate,
          endDate: result.endDate,
          isHalfDay: result.isHalfDay,
          halfDayPeriod: result.halfDayPeriod,
          status: result.status,
          approvedByName: user.name,
          rejectionReason: result.rejectionReason,
        }).catch((err) =>
          ctx.error("LEAVE_STATUS_NOTIFICATION_FAILED", { error: err.message })
        );
      }
    } catch (notifErr) {
      ctx.error("LEAVE_STATUS_NOTIFICATION_ERROR", { error: notifErr.message });
    }

    return Response.json({ success: true, leave: result });
  } catch (error) {
    ctx.error("LEAVE_UPDATE_FAILED", { error: error.message });
    return Response.json(
      { success: false, message: "Failed to update leave" },
      { status: 500 }
    );
  }
}

export const PATCH = createProtectedRoute(patchHandler, {
  isPublic: false,
  resourceLoader: async (id) => {
    const [leave] = await db.select().from(leaves).where(eq(leaves.id, id)).limit(1);
    return leave || null;
  },
  policy: (session, resource) => ({
    authorized: !!session?.userId,
    reason: session?.userId ? "Authenticated" : "Login required",
  }),
});
