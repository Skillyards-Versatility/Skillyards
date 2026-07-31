import { eq, inArray } from "drizzle-orm";
import { db, enquiries as enquiriesTable } from "@repo/db";
import { getSession } from "@/lib/auth";
import { invalidateCache } from "@/lib/enquiries-cache";

export const dynamic = "force-dynamic";

const VALID_STATUSES = ["new", "contacted", "enrolled", "closed"];

export async function PATCH(request) {
  const session = await getSession();
  if (!["ADMIN", "MANAGER"].includes(session?.role)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Single enquiry detail edit (admin only)
  if (body?.id && body?.updates) {
    if (session?.role !== "ADMIN") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id, updates } = body;

    const allowedFields = ["firstName", "lastName", "email", "phone", "message"];
    const sanitized = {};
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        sanitized[field] = String(updates[field]).trim();
      }
    }

    if (Object.keys(sanitized).length === 0) {
      return Response.json({ error: "No editable fields provided" }, { status: 400 });
    }

    if (sanitized.firstName !== undefined && sanitized.firstName === "") {
      return Response.json({ error: "firstName is required" }, { status: 400 });
    }
    if (sanitized.email !== undefined && sanitized.email === "") {
      return Response.json({ error: "email is required" }, { status: 400 });
    }
    if (sanitized.message !== undefined && sanitized.message === "") {
      return Response.json({ error: "message is required" }, { status: 400 });
    }

    const result = await db
      .update(enquiriesTable)
      .set(sanitized)
      .where(eq(enquiriesTable.id, id));

    invalidateCache();

    if (!result?.rowCount) {
      return Response.json({ error: "Enquiry not found" }, { status: 404 });
    }

    return Response.json({ success: true, enquiry: { id, ...sanitized } });
  }

  const { ids, status } = body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return Response.json({ error: "ids must be a non-empty array" }, { status: 400 });
  }

  if (!VALID_STATUSES.includes(status)) {
    return Response.json({ error: `status must be one of: ${VALID_STATUSES.join(", ")}` }, { status: 400 });
  }

  const result = await db
    .update(enquiriesTable)
    .set({ status })
    .where(inArray(enquiriesTable.id, ids));

  invalidateCache();

  const count = result?.rowCount ?? ids.length;

  return Response.json({ success: true, updated: count });
}

export async function DELETE(request) {
  const session = await getSession();
  if (session?.role !== "ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json({ error: "id query param is required" }, { status: 400 });
  }

  const result = await db.delete(enquiriesTable).where(eq(enquiriesTable.id, id));

  invalidateCache();

  if (!result?.rowCount) {
    return Response.json({ error: "Enquiry not found" }, { status: 404 });
  }

  return Response.json({ success: true, deleted: id });
}
