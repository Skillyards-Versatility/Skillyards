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
  const laptopOptedParam = searchParams.get("laptopOpted");
  const laptopOpted =
    laptopOptedParam === "true"
      ? true
      : laptopOptedParam === "false"
        ? false
        : undefined;

  const data = await getStudentList(db, limit, offset, {
    courseName,
    batchId,
    enrolledIn,
    startDate,
    endDate,
    laptopOpted,
  });
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
    return Response.json({ error: result.error.flatten() }, { status: 400 });
  }

  try {
    const created = await db
      .insert(students)
      .values({
        ...result.data,
        laptopOptedAt: result.data.laptopOpted ? new Date() : null,
      })
      .returning();

    ctx.log("STUDENT_CREATED", { studentId: created[0].id });
    return Response.json(created[0], { status: 201 });
  } catch (dbErr) {
    if (
      dbErr.code === "23505" ||
      dbErr.message?.includes("unique constraint") ||
      dbErr.message?.includes("students_email_unique")
    ) {
      ctx.warn("STUDENT_CREATE_DUPLICATE_EMAIL", { email: result.data.email });
      return Response.json(
        {
          error: result.data.email
            ? `A student with email "${result.data.email}" is already enrolled.`
            : "A student with this information already exists.",
        },
        { status: 409 },
      );
    }

    if (dbErr.code === "23503") {
      ctx.warn("STUDENT_CREATE_FK_VIOLATION", { error: dbErr.message });
      return Response.json(
        { error: "The selected batch or assigned staff member does not exist." },
        { status: 400 },
      );
    }

    ctx.error("STUDENT_CREATE_ERROR", { error: dbErr.message });
    return Response.json(
      { error: dbErr.message || "Failed to create student in database." },
      { status: 500 },
    );
  }
}

// ── STRUCTURAL ENFORCEMENT ──
export const GET = createProtectedRoute(getHandler, {
  policy: canAccessStudent,
});

export const POST = createProtectedRoute(postHandler, {
  policy: canAccessStudent,
});
