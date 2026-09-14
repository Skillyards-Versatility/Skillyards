import { db } from "@repo/db";
import { getDashboardStats } from "@/modules/students/student.service";
import { createProtectedRoute } from "@/lib/middleware";
import { canAccessStudent } from "@/lib/permissions";

/**
 * SECURED STUDENT STATS HANDLER (Dashboard)
 */
async function getHandler() {
  const data = await getDashboardStats(db);
  return Response.json(data);
}

// ── STRUCTURAL ENFORCEMENT ──
export const GET = createProtectedRoute(getHandler, {
  policy: canAccessStudent, // Using canAccessStudent with null resource for list/stats check
});
