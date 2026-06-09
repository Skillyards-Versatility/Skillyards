import { desc } from "drizzle-orm";
import { db, enquiries as enquiriesTable } from "@repo/db";
import { getSession } from "@/lib/auth";
import { setCachedEnquiries } from "@/lib/enquiries-cache";

export const dynamic = "force-dynamic";

export async function POST() {
  const session = await getSession();
  if (!["ADMIN", "MANAGER"].includes(session?.role)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const rows = await db
    .select()
    .from(enquiriesTable)
    .orderBy(desc(enquiriesTable.createdAt));

  setCachedEnquiries(rows);

  return Response.json({ success: true, count: rows.length });
}
