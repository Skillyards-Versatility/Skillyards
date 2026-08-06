import { db } from "@repo/db";
import { submitTest } from "@/modules/test/test.service";
import { createProtectedRoute } from "@/lib/middleware";
import { publicAllow } from "@/lib/permissions";

const TEST_SUBMIT_RATE_LIMIT = {
  prefix: "test-submit",
  burst: { limit: 10, windowMs: 60000 },
  hourly: { limit: 60 },
  daily: { limit: 200 },
  global: { limit: 1000, windowMs: 3600000 },
};

/**
 * PUBLIC ASSESSMENT SUBMISSION HANDLER
 */
async function postHandler(req, { ctx }) {
  const body = await req.json();
  const { sessionId, answers } = body;

  if (!sessionId || !Array.isArray(answers)) {
    return Response.json({ error: "Invalid payload format." }, { status: 400 });
  }

  const result = await submitTest({ db, sessionId, answers });
  ctx.log("ASSESSMENT_SUBMITTED", { sessionId, score: result.score });

  return Response.json({
    success: true,
    score: result.score,
    total: result.total,
    wrongAnswers: result.wrongAnswers,
  });
}

// ── STRUCTURAL ENFORCEMENT ──
export const POST = createProtectedRoute(postHandler, {
  policy: publicAllow,
  isPublic: true,
  rateLimit: TEST_SUBMIT_RATE_LIMIT,
});