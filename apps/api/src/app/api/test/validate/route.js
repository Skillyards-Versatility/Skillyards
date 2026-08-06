import { db, testLeads } from "@repo/db";
import { eq } from "drizzle-orm";
import { createProtectedRoute } from "@/lib/middleware";
import { publicAllow } from "@/lib/permissions";

const TEST_VALIDATE_RATE_LIMIT = {
  prefix: "test-validate",
  burst: { limit: 30, windowMs: 60000 },
  hourly: { limit: 300 },
  daily: { limit: 1000 },
};

/**
 * PUBLIC ASSESSMENT VALIDATION HANDLER
 */
async function getHandler(req, { ctx }) {
  const { searchParams } = new URL(req.url);
  const leadId = searchParams.get("leadId");

  if (!leadId) {
    return Response.json({ error: "Missing leadId" }, { status: 400 });
  }

  const result = await db
    .select()
    .from(testLeads)
    .where(eq(testLeads.id, leadId))
    .limit(1);

  if (!result.length) {
    ctx.warn("LEAD_VALIDATION_NOT_FOUND", { leadId });
    return Response.json({ error: "Invalid lead" }, { status: 404 });
  }

  ctx.log("LEAD_VALIDATED", { leadId });

  return Response.json({ lead: result[0] });
}

// ── STRUCTURAL ENFORCEMENT ──
export const GET = createProtectedRoute(getHandler, {
  policy: publicAllow,
  isPublic: true,
  rateLimit: TEST_VALIDATE_RATE_LIMIT,
});