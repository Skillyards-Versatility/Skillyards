import * as paymentRepo from "./payment.repository";
import * as studentRepo from "../students/student.repository";
import { installments } from "@repo/db";
import { eq } from "drizzle-orm";

export async function addPayment(db, studentId, input) {
  const { amount, method, note, installmentId } = input;

  if (!amount || amount <= 0) {
    throw new Error("Invalid payment amount");
  }

  const student = await studentRepo.getStudentById(db, studentId);
  if (!student) {
    throw new Error("Student not found");
  }

  const receiptNumber = await paymentRepo.getNextReceiptNumber(db);

  const payment = await paymentRepo.createPayment(db, {
    studentId,
    amount,
    method: method || "cash",
    note: note || null,
    installmentId: null,
    receiptNumber,
  });

  let remaining = amount;

  let installmentsToProcess = [];

  if (installmentId) {
    const selected = await db
      .select()
      .from(installments)
      .where(eq(installments.id, installmentId))
      .limit(1);

    if (selected.length) {
      installmentsToProcess.push(selected[0]);
    }
  }

  const unpaid = await paymentRepo.getUnpaidInstallments(db, studentId);

  for (const inst of unpaid) {
    if (installmentsToProcess.find((i) => i.id === inst.id)) continue;
    installmentsToProcess.push(inst);
  }

  const touchedInstallments = new Set();

  for (const inst of installmentsToProcess) {
    if (remaining <= 0) break;

    const totalPaid = await paymentRepo.getTotalPaidForInstallment(db, inst.id);

    const remainingDue = inst.amountDue - totalPaid;

    if (remainingDue <= 0) continue;

    let allocatedAmount = 0;

    if (remaining >= remainingDue) {
      allocatedAmount = remainingDue;
      remaining -= remainingDue;
    } else {
      allocatedAmount = remaining;
      remaining = 0;
    }

    await paymentRepo.createPaymentAllocation(db, {
      paymentId: payment.id,
      installmentId: inst.id,
      amount: allocatedAmount,
    });

    touchedInstallments.add(inst.id);
  }

  for (const id of touchedInstallments) {
    await paymentRepo.updateInstallmentStatus(db, id);
  }

  return payment;
}

export async function getPaymentsWithAllocations(db, studentId) {
  const payments = await paymentRepo.getPaymentsByStudentIdRaw(db, studentId);

  if (!payments.length) return [];

  const paymentIds = payments.map((p) => p.id);

  const allocations = await paymentRepo.getAllocationsByPaymentIds(
    db,
    paymentIds,
  );

  const allocationMap = {};

  for (const alloc of allocations) {
    if (!allocationMap[alloc.paymentId]) {
      allocationMap[alloc.paymentId] = [];
    }

    allocationMap[alloc.paymentId].push({
      installmentId: alloc.installmentId,
      amount: alloc.amount,
    });
  }

  const result = payments.map((p) => ({
    ...p,
    allocations: allocationMap[p.id] || [],
  }));

  return result;
}
