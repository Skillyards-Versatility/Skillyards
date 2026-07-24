import { db } from "@repo/db";
import { assignBatchToStudent } from "@/modules/students/student.service";
import { getStudentById } from "@/modules/students/student.repository";
import { createProtectedRoute } from "@/lib/middleware";
import { canAccessStudent } from "@/lib/permissions";

async function patchHandler(req, { context, ctx }) {
  const { id: studentId } = await context.params;
  const body = await req.json();
  const { batchId, batchName } = body;

  const updated = await assignBatchToStudent(db, studentId, batchId, batchName);

  if (!updated) {
    return Response.json({ error: "Student not found or failed to update" }, { status: 404 });
  }

  ctx.log("STUDENT_BATCH_UPDATED", { studentId, batchId, batchName });
  return Response.json(updated);
}

export const PATCH = createProtectedRoute(patchHandler, {
  policy: canAccessStudent,
  resourceLoader: (id) => getStudentById(db, id),
});
