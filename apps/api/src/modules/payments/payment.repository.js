import { eq, desc, ne, asc, sum, inArray, and, sql } from "drizzle-orm";
import { payments, installments, paymentAllocations, plans } from "@repo/db";

export async function getNextReceiptNumber(db) {
  const currentYear = new Date().getFullYear();
  const startsWith = `SY-${currentYear}-`;

  const result = await db
    .select({
      count: sql`count(*)`,
    })
    .from(payments)
    .where(sql`EXTRACT(YEAR FROM ${payments.createdAt}) = ${currentYear}`);

  const nextSequence = Number(result[0]?.count || 0) + 1;
  return `${startsWith}${String(nextSequence).padStart(4, "0")}`;
}


export async function getPaymentsByStudentId(db, studentId) {
  return db
    .select()
    .from(payments)
    .where(eq(payments.studentId, studentId))
    .orderBy(desc(payments.createdAt));
}

export async function createPayment(db, data) {
  const result = await db
    .insert(payments)
    .values(data)
    .returning();

  return result[0];
}

export async function getUnpaidInstallments(db, studentId) {
  return db
    .select()
    .from(installments)
    .where(
      and(
        eq(installments.studentId, studentId),
        ne(installments.status, "paid")
      )
    )
    .orderBy(asc(installments.dueDate));
}

export async function getTotalPaidForInstallment(db, installmentId) {
  const result = await db
    .select({
      total: sum(paymentAllocations.amount),
    })
    .from(paymentAllocations)
    .where(eq(paymentAllocations.installmentId, installmentId));

  return Number(result[0]?.total || 0);
}

export async function updateInstallmentStatus(db, installmentId) {
  const installment = await db
    .select()
    .from(installments)
    .where(eq(installments.id, installmentId))
    .limit(1);

  if (!installment.length) return;

  const inst = installment[0];

  const totalPaid = await getTotalPaidForInstallment(db, installmentId);

  let status = "scheduled";

  if (totalPaid === 0) {
    status = "scheduled";
  } else if (totalPaid < inst.amountDue) {
    status = "partial";
  } else {
    status = "paid";
  }

  await db
    .update(installments)
    .set({ status })
    .where(eq(installments.id, installmentId));
}

export async function createPaymentAllocation(db, data) {
  const result = await db
    .insert(paymentAllocations)
    .values(data)
    .returning();

  return result[0];
}

export async function getTotalPaidForStudent(db, studentId) {
  const result = await db
    .select({
      total: sum(payments.amount),
    })
    .from(payments)
    .where(eq(payments.studentId, studentId));

  return Number(result[0]?.total || 0);
}

export async function getTotalDueForStudent(db, studentId) {
  const result = await db
    .select()
    .from(plans)
    .where(eq(plans.studentId, studentId))
    .orderBy(desc(plans.createdAt))
    .limit(1);

  const plan = result[0];

  return plan ? plan.totalAmount : 0;
}

export async function getPaymentsByStudentIdRaw(db, studentId) {
  return db
    .select()
    .from(payments)
    .where(eq(payments.studentId, studentId))
    .orderBy(desc(payments.createdAt));
}

export async function getAllocationsByPaymentIds(db, paymentIds) {
  if (!paymentIds.length) return [];

  return db
    .select()
    .from(paymentAllocations)
    .where(inArray(paymentAllocations.paymentId, paymentIds));
}

export async function getPaymentById(db, paymentId) {
  const result = await db
    .select()
    .from(payments)
    .where(eq(payments.id, paymentId))
    .limit(1);

  return result[0];
}

export async function getAllocationsByPaymentId(db, paymentId) {
  return db
    .select()
    .from(paymentAllocations)
    .where(eq(paymentAllocations.paymentId, paymentId));
}

export async function claimPaymentForGeneration(db, paymentId, jobId) {
  console.log("[DB][CLAIM]", { paymentId, jobId });
  
  const result = await db
    .update(payments)
    .set({ 
      receiptStatus: "generating", 
      receiptJobId: jobId,
      receiptRequestedAt: new Date()
    })
    .where(
      and(
        eq(payments.id, paymentId),
        ne(payments.receiptStatus, "generating")
      )
    )
    .returning();

  return result[0];
}

export async function resetStaleLock(db, paymentId) {
  console.log("[DB][RESET_STALE]", { paymentId });
  
  return db
    .update(payments)
    .set({ receiptStatus: "failed" })
    .where(eq(payments.id, paymentId))
    .returning();
}

export async function completePaymentGeneration(db, paymentId, jobId, data) {
  console.log("[DB][COMPLETE]", { paymentId, jobId, status: data.receiptStatus });

  const result = await db
    .update(payments)
    .set(data)
    .where(
      and(
        eq(payments.id, paymentId),
        eq(payments.receiptJobId, jobId) // Ownership validation
      )
    )
    .returning();

  if (result.length === 0) {
    console.warn("[DB][COMPLETE][IGNORE] Stale or invalid jobId", { paymentId, jobId });
  }

  return result[0];
}

export async function updatePayment(db, paymentId, data) {
  console.log("updatePayment CALLED", { paymentId, data });

  const result = await db
    .update(payments)
    .set(data)
    .where(eq(payments.id, paymentId))
    .returning();

  console.log("updatePayment RESULT", result);

  return result[0];
}