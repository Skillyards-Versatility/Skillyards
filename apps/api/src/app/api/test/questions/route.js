import { getRandomActiveQuestions } from "@/modules/test/test.repository";
import { createProtectedRoute } from "@/lib/middleware";
import { canAccessAssessment } from "@/lib/permissions";

/**
 * SECURED ASSESSMENT QUESTIONS HANDLER
 */
async function getHandler(req, { ctx }) {
  const { searchParams } = new URL(req.url);
  const topicsParam = searchParams.get("topics");
  const topics = topicsParam ? topicsParam.split(",") : [];

  const questions = await getRandomActiveQuestions(topics);

  return Response.json({ success: true, questions });
}

// ── STRUCTURAL ENFORCEMENT ──
export const GET = createProtectedRoute(getHandler, {
  policy: canAccessAssessment
});