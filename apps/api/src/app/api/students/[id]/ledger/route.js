import { db } from "@repo/db";
import { getStudentLedger } from "@/modules/payments/ledger.service";
import { getStudentById } from "@/modules/students/student.repository";
import { createProtectedRoute } from "@/lib/middleware";
import { canAccessStudent } from "@/lib/permissions";

/**
 * SECURED STUDENT LEDGER HANDLER
 */
async function getHandler(req, { context, ctx, resource: student }) {
  const { id: studentId } = await context.params;
  const ledger = await getStudentLedger(db, studentId);

  return Response.json({
    success: true,
    data: ledger,
  });
}

// ── STRUCTURAL ENFORCEMENT ──
export const GET = createProtectedRoute(getHandler, {
  policy: canAccessStudent,
  resourceLoader: (id) => getStudentById(db, id),
});
