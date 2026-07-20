import { db, eodReports } from "@repo/db";
import { eq, desc } from "drizzle-orm";
import { createProtectedRoute } from "@/lib/middleware";

async function getHandler(req, { ctx }) {
  try {
    const reports = await db
      .select()
      .from(eodReports)
      .where(eq(eodReports.userId, ctx.session.userId))
      .orderBy(desc(eodReports.date));

    return Response.json({ success: true, reports });
  } catch (error) {
    ctx.error("EOD_MINE_FETCH_FAILED", { error: error.message });
    return Response.json(
      { success: false, message: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}

export const GET = createProtectedRoute(getHandler, {
  isPublic: false,
  policy: (session) => ({
    authorized: !!session?.userId,
    reason: session?.userId ? "Authenticated" : "Login required",
  }),
});
