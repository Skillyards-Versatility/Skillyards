import { db } from "@repo/db";
import { students } from "@repo/db"; 
import { validateCreateStudent } from "@/modules/students/student.schema";
import { getStudentList } from "@/modules/students/student.service";
import { createProtectedRoute } from "@/lib/middleware";
import { canAccessStudent } from "@/lib/permissions";

/**
 * SECURED STUDENT LIST HANDLER
 */
async function getHandler(req) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "100");
  const offset = parseInt(searchParams.get("offset") || "0");
  const courseName = searchParams.get("courseName");
  const batchId = searchParams.get("batchId");
  const enrolledIn = searchParams.get("enrolledIn");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const data = await getStudentList(db, limit, offset, { courseName, batchId, enrolledIn, startDate, endDate });
  return Response.json(data);
}

/**
 * SECURED STUDENT CREATE HANDLER
 */
async function postHandler(req, { ctx }) {
  const body = await req.json();
  const result = validateCreateStudent(body);

  if (!result.success) {
    ctx.warn("VALIDATION_FAILURE", { errors: result.error.flatten() });
    return Response.json(
      { error: result.error.flatten() },
      { status: 400 }
    );
  }

  const created = await db
    .insert(students)
    .values(result.data)
    .returning();

  ctx.log("STUDENT_CREATED", { studentId: created[0].id });
  return Response.json(created[0], { status: 201 });
}

// ── STRUCTURAL ENFORCEMENT ──
export const GET = createProtectedRoute(getHandler, {
  policy: canAccessStudent
});

export const POST = createProtectedRoute(postHandler, {
  policy: canAccessStudent
});