import { db } from "@repo/db";
import { validateCreateBatch } from "@/modules/batches/batches.schema";
import { getBatchesList, createBatch } from "@/modules/batches/batches.service";
import { createProtectedRoute } from "@/lib/middleware";
import { canAccessStudent } from "@/lib/permissions";

async function getHandler(req) {
  const { searchParams } = new URL(req.url);
  const courseName = searchParams.get("courseName");

  const data = await getBatchesList(db, courseName);
  return Response.json(data);
}

async function postHandler(req, { ctx }) {
  const body = await req.json();
  const result = validateCreateBatch(body);

  if (!result.success) {
    ctx.warn("VALIDATION_FAILURE", { errors: result.error.flatten() });
    return Response.json(
      { error: result.error.flatten() },
      { status: 400 }
    );
  }

  const created = await createBatch(db, result.data);
  ctx.log("BATCH_CREATED", { batchId: created.id });
  return Response.json(created, { status: 201 });
}

export const GET = createProtectedRoute(getHandler, {
  policy: canAccessStudent,
});

export const POST = createProtectedRoute(postHandler, {
  policy: canAccessStudent,
});
