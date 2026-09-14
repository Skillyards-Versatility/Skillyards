import { db } from "@repo/db";
import { addFlexibleInstallment } from "@/modules/plans/plan.service";
import { getStudentById } from "@/modules/students/student.repository";
import { createProtectedRoute } from "@/lib/middleware";
import { canAccessStudent } from "@/lib/permissions";

/**
 * SECURED STUDENT INSTALLMENT CREATE HANDLER
 */
async function postHandler(req, { context, ctx, resource: student }) {
  const { id: studentId } = await context.params;
  const body = await req.json();

  const installment = await addFlexibleInstallment(db, studentId, body);

  ctx.log("INSTALLMENT_ADDED", { studentId, installmentId: installment.id });
  return Response.json({ success: true, data: installment }, { status: 201 });
}

// ── STRUCTURAL ENFORCEMENT ──
export const POST = createProtectedRoute(postHandler, {
  policy: canAccessStudent,
  resourceLoader: (id) => getStudentById(db, id),
});
