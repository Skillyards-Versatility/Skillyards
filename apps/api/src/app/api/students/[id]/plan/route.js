import { db, plans } from "@repo/db";
import { eq } from "drizzle-orm";
import { createPlanWithInstallments, getPlanWithInstallments } from "@/modules/plans/plan.service";
import { getStudentById } from "@/modules/students/student.repository";
import { createProtectedRoute } from "@/lib/middleware";
import { canAccessStudent } from "@/lib/permissions";

/**
 * SECURED STUDENT PLAN LIST HANDLER
 */
async function getHandler(req, { context, ctx, resource: student }) {
  const { id: studentId } = await context.params;
  const data = await getPlanWithInstallments(db, studentId);

  return Response.json({
    success: true,
    data,
  });
}

/**
 * SECURED STUDENT PLAN CREATE HANDLER
 */
async function postHandler(req, { context, ctx, resource: student }) {
  const { id: studentId } = await context.params;
  const body = await req.json();

  const plan = await createPlanWithInstallments(db, studentId, body);

  ctx.log("PLAN_CREATED", { studentId, planId: plan.id });
  return Response.json({
    success: true,
    data: plan,
  }, { status: 201 });
}

/**
 * SECURED STUDENT PLAN EDIT HANDLER (Admin only)
 */
async function patchHandler(req, { context, ctx, resource: student }) {
  if (ctx.session.role !== "ADMIN") {
    return Response.json({ error: "Admin access required to edit plans" }, { status: 403 });
  }

  const { id: studentId } = await context.params;
  const body = await req.json();
  const { totalAmount } = body;

  if (!totalAmount || totalAmount <= 0) {
    return Response.json({ error: "Invalid total amount" }, { status: 400 });
  }

  const [plan] = await db
    .select({ id: plans.id, type: plans.type, totalAmount: plans.totalAmount })
    .from(plans)
    .where(eq(plans.studentId, studentId))
    .limit(1);

  if (!plan) {
    return Response.json({ error: "No plan found for student" }, { status: 404 });
  }

  if (plan.type !== "flexible" && totalAmount !== plan.totalAmount) {
    // For non-flexible plans, installments split the total — require the total to stay
    // consistent with already-scheduled installments.
    const { installments } = await getPlanWithInstallments(db, studentId);
    const scheduled = (installments || []).reduce((s, i) => s + i.amountDue, 0);
    if (scheduled !== totalAmount) {
      return Response.json({
        error: "Total amount must equal the sum of scheduled installments. Edit installments first or assign a new plan.",
      }, { status: 400 });
    }
  }

  const [updated] = await db
    .update(plans)
    .set({ totalAmount })
    .where(eq(plans.id, plan.id))
    .returning();

  ctx.log("PLAN_UPDATED", { studentId, planId: plan.id, totalAmount });

  return Response.json({ success: true, data: updated });
}

// ── STRUCTURAL ENFORCEMENT ──
export const GET = createProtectedRoute(getHandler, {
  policy: canAccessStudent,
  resourceLoader: (id) => getStudentById(db, id)
});

export const POST = createProtectedRoute(postHandler, {
  policy: canAccessStudent,
  resourceLoader: (id) => getStudentById(db, id)
});

export const PATCH = createProtectedRoute(patchHandler, {
  policy: canAccessStudent,
  resourceLoader: (id) => getStudentById(db, id)
});