import { db, students } from "@repo/db";
import { eq } from "drizzle-orm";
import { getStudentDetail } from "@/modules/students/student.service";
import { getStudentById } from "@/modules/students/student.repository";
import { validateCreateStudent } from "@/modules/students/student.schema";
import { createProtectedRoute } from "@/lib/middleware";
import { canAccessStudent } from "@/lib/permissions";

/**
 * SECURED STUDENT DETAIL HANDLER
 * 
 * Structural enforcement ensures:
 * - Session is valid
 * - Student record is pre-loaded (req.resource)
 * - Access is verified via canAccessStudent policy
 * - Rate limiting and Request correlation active
 */
async function getHandler(req, { context, ctx, resource: student }) {
  const { id: studentId } = await context.params;
  const data = await getStudentDetail(db, studentId);
  return Response.json(data);
}

/**
 * SECURED STUDENT EDIT HANDLER (Admin only)
 * Corrects mistakes in student identity/contact/course/fee details.
 */
async function patchHandler(req, { context, ctx, resource: student }) {
  if (ctx.session.role !== "ADMIN") {
    return Response.json({ error: "Admin access required to edit students" }, { status: 403 });
  }

  const { id: studentId } = await context.params;
  const body = await req.json();

  const result = validateCreateStudent({ ...student, ...body });

  if (!result.success) {
    ctx.warn("STUDENT_UPDATE_VALIDATION_FAILURE", { errors: result.error.flatten() });
    return Response.json(
      { error: result.error.flatten() },
      { status: 400 }
    );
  }

  const laptopStatusChanged = Boolean(student.laptopOpted) !== Boolean(result.data.laptopOpted);
  const setValues = {
    ...result.data,
    updatedAt: new Date(),
  };

  if (laptopStatusChanged) {
    setValues.laptopOptedAt = result.data.laptopOpted ? new Date() : null;
  } else if (result.data.laptopOpted && !student.laptopOptedAt) {
    setValues.laptopOptedAt = new Date();
  }

  const [updated] = await db
    .update(students)
    .set(setValues)
    .where(eq(students.id, studentId))
    .returning();

  ctx.log("STUDENT_UPDATED", { studentId });

  return Response.json(updated);
}

/**
 * SECURED STUDENT DELETE HANDLER (Admin only)
 * Removes a mistakenly-entered student. Plans, installments, payments and
 * allocations are removed via DB cascades.
 */
async function deleteHandler(req, { context, ctx, resource: student }) {
  if (ctx.session.role !== "ADMIN") {
    return Response.json({ error: "Admin access required to delete students" }, { status: 403 });
  }

  const { id: studentId } = await context.params;

  await db.delete(students).where(eq(students.id, studentId));

  ctx.log("STUDENT_DELETED", { studentId });

  return Response.json({ success: true, deleted: studentId });
}

// ── STRUCTURAL ENFORCEMENT ──
export const GET = createProtectedRoute(getHandler, {
  policy: canAccessStudent,
  resourceLoader: (id) => getStudentById(db, id)
});

export const PATCH = createProtectedRoute(patchHandler, {
  policy: canAccessStudent,
  resourceLoader: (id) => getStudentById(db, id)
});

export const DELETE = createProtectedRoute(deleteHandler, {
  policy: canAccessStudent,
  resourceLoader: (id) => getStudentById(db, id)
});