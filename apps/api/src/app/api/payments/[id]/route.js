import { db } from "@repo/db";
import { validateCreatePayment } from "@/modules/payments/payment.schema";
import { addPayment } from "@/modules/payments/payment.service";
import { getStudentById } from "@/modules/students/student.repository";
import { createProtectedRoute } from "@/lib/middleware";
import { canAccessStudent } from "@/lib/permissions";

/**
 * SECURED STUDENT PAYMENT HANDLER
 *
 * Enforced by createProtectedRoute:
 * - Session verified
 * - Student record loaded (req.resource)
 * - Authorized for this student (canAccessStudent)
 * - Rate limiting applied
 */
async function postHandler(req, { context, ctx, resource: student }) {
  const studentId = (await context.params).id;
  const body = await req.json();

  const result = validateCreatePayment(body);
  if (!result.success) {
    ctx.warn("VALIDATION_FAILURE", { errors: result.error.flatten() });
    return Response.json({ error: result.error.flatten() }, { status: 400 });
  }

  // Side effect: only happens AFTER Authz
  const payment = await addPayment(db, studentId, result.data);
  ctx.log("PAYMENT_CREATED", { studentId, amount: result.data.amount });

  return Response.json(payment, { status: 201 });
}

// ── STRUCTURAL ENFORCEMENT ──
export const POST = createProtectedRoute(postHandler, {
  policy: canAccessStudent,
  resourceLoader: (id) => getStudentById(db, id),
});

export const OPTIONS = createProtectedRoute(() => {}, { isPublic: true });
