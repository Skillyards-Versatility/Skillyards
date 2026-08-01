import { db, installments, plans } from "@repo/db";
import { eq } from "drizzle-orm";
import { getStudentById } from "@/modules/students/student.repository";
import { createProtectedRoute } from "@/lib/middleware";
import { canAccessStudent } from "@/lib/permissions";

/**
 * SECURED INSTALLMENT EDIT HANDLER (Admin only)
 * Corrects installment amount/due-date mistakes.
 */
async function patchHandler(req, { context, ctx, resource: student }) {
  if (ctx.session.role !== "ADMIN") {
    return Response.json({ error: "Admin access required to edit installments" }, { status: 403 });
  }

  const { id: studentId, installmentId } = await context.params;
  const body = await req.json();
  const { amountDue, dueDate } = body;

  const [existing] = await db
    .select({ id: installments.id, planId: installments.planId })
    .from(installments)
    .where(eq(installments.id, installmentId))
    .limit(1);

  if (!existing) {
    return Response.json({ error: "Installment not found" }, { status: 404 });
  }

  const [plan] = await db
    .select({ id: plans.id })
    .from(plans)
    .where(eq(plans.studentId, studentId))
    .limit(1);

  if (!plan || existing.planId !== plan.id) {
    return Response.json({ error: "Installment does not belong to this student's plan" }, { status: 404 });
  }

  if (amountDue !== undefined && (Number(amountDue) <= 0 || !Number.isInteger(Number(amountDue)))) {
    return Response.json({ error: "Amount must be a positive integer" }, { status: 400 });
  }

  if (dueDate !== undefined && Number.isNaN(new Date(dueDate).getTime())) {
    return Response.json({ error: "Invalid due date" }, { status: 400 });
  }

  const values = {};
  if (amountDue !== undefined) values.amountDue = Number(amountDue);
  if (dueDate !== undefined) values.dueDate = new Date(dueDate);

  const [updated] = await db
    .update(installments)
    .set(values)
    .where(eq(installments.id, installmentId))
    .returning();

  ctx.log("INSTALLMENT_UPDATED", { studentId, installmentId });

  return Response.json({ success: true, data: updated });
}

export const PATCH = createProtectedRoute(patchHandler, {
  policy: canAccessStudent,
  resourceLoader: (id) => getStudentById(db, id),
});
