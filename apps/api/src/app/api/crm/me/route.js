import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm, getUserCrmRoles } from "@/modules/crm/crm.permissions";
import { success } from "@/utils/response";
import { db } from "@repo/db";
import { users } from "@repo/db/schema";
import { eq } from "drizzle-orm";

async function getMeHandler(req, { ctx }) {
  const session = ctx.session;
  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      team: users.team,
    })
    .from(users)
    .where(eq(users.id, session.userId));

  const crmRoles = await getUserCrmRoles(session.userId);

  return Response.json(
    success(
      {
        user: user || { id: session.userId, email: session.email, role: session.role },
        crmRoles,
      },
      "CRM session retrieved"
    )
  );
}

export const GET = createProtectedRoute(getMeHandler, {
  policy: canAccessCrm,
});
