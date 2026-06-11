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
