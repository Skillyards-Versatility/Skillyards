import { db } from "@repo/db";
import {
  addPayment,
  getPaymentsWithAllocations,
} from "@/modules/payments/payment.service";
import { validateCreatePayment } from "@/modules/payments/payment.schema";
import { getStudentById } from "@/modules/students/student.repository";
import { createProtectedRoute } from "@/lib/middleware";
import { canAccessStudent } from "@/lib/permissions";

/**
 * SECURED STUDENT PAYMENTS LIST HANDLER
 */
async function getHandler(req, { context, ctx, resource: student }) {
  const { id: studentId } = await context.params;
  const data = await getPaymentsWithAllocations(db, studentId);

  return Response.json({
    success: true,
    data,
  });
}

/**
 * SECURED STUDENT PAYMENT CREATE HANDLER
 */
async function postHandler(req, { context, ctx, resource: student }) {
  const { id: studentId } = await context.params;
  const body = await req.json();
  const result = validateCreatePayment(body);

  if (!result.success) {
    ctx.warn("VALIDATION_FAILURE", { errors: result.error.flatten() });
    return Response.json({ error: result.error.flatten() }, { status: 400 });
  }

  const payment = await addPayment(db, studentId, result.data);
  ctx.log("PAYMENT_CREATED", { studentId, amount: result.data.amount });

  return Response.json(payment, { status: 201 });
}

// ── STRUCTURAL ENFORCEMENT ──
export const GET = createProtectedRoute(getHandler, {
  policy: canAccessStudent,
  resourceLoader: (id) => getStudentById(db, id),
});

export const POST = createProtectedRoute(postHandler, {
  policy: canAccessStudent,
  resourceLoader: (id) => getStudentById(db, id),
});
