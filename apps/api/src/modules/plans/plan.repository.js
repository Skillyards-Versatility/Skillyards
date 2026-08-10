import { plans, installments } from "@repo/db";
import { eq, desc } from "drizzle-orm";

export async function createPlan(db, data) {
  const result = await db
    .insert(plans)
    .values(data)
    .returning();

  return result[0];
}

export async function createInstallments(db, data) {
  const result = await db
    .insert(installments)
    .values(data)
    .returning();

  return result;
}

export async function getPlanByStudentId(db, studentId) {
  const result = await db
    .select()
    .from(plans)
    .where(eq(plans.studentId, studentId))
    .orderBy(desc(plans.createdAt))
    .limit(1);

  return result[0];
}

export async function getInstallmentsByPlanId(db, planId) {
  return db
    .select()
    .from(installments)
    .where(eq(installments.planId, planId));
}