import * as planRepo from "./plan.repository";
import * as studentRepo from "../students/student.repository";

export async function createPlanWithInstallments(db, studentId, input) {
  const { type, totalAmount, installments } = input;

  const VALID_TYPES = ["full", "emi", "custom", "flexible"];

  if (!VALID_TYPES.includes(type)) {
    throw new Error("Invalid plan type");
  }

  if (!totalAmount || totalAmount <= 0) {
    throw new Error("Invalid total amount");
  }

  const student = await studentRepo.getStudentById(db, studentId);
  if (!student) {
    throw new Error("Student not found");
  }

  const plan = await planRepo.createPlan(db, {
    studentId,
    totalAmount,
    type,
  });

  let installmentData = [];

  if (type === "full") {
    installmentData = [
      {
        studentId,
        planId: plan.id,
        amountDue: totalAmount,
        dueDate: new Date(),
      },
    ];
  } else if (type === "emi") {
    if (!installments || installments.length === 0) {
      throw new Error("Installments required for EMI plan");
    }

    const emiAmount = Math.floor(totalAmount / installments.length);

    installmentData = installments.map((inst, index) => ({
      studentId,
      planId: plan.id,
      amountDue:
        index === installments.length - 1
          ? totalAmount - emiAmount * (installments.length - 1)
          : emiAmount,
      dueDate: new Date(inst.dueDate),
    }));
  } else if (type === "custom") {
    if (!installments || installments.length === 0) {
      throw new Error("Installments required for custom plan");
    }

    const sum = installments.reduce((acc, i) => acc + (i.amount || 0), 0);

    if (sum !== totalAmount) {
      throw new Error("Installment sum must equal total amount");
    }

    installmentData = installments.map((inst) => ({
      studentId,
      planId: plan.id,
      amountDue: inst.amount,
      dueDate: new Date(inst.dueDate),
    }));
  } else if (type === "flexible") {
    if (!installments || installments.length === 0) {
      throw new Error("At least one installment is required for flexible plan");
    }

    const sum = installments.reduce((acc, i) => acc + (i.amount || 0), 0);

    if (sum > totalAmount) {
      throw new Error("Installment sum cannot exceed total amount");
    }

    installmentData = installments.map((inst) => ({
      studentId,
      planId: plan.id,
      amountDue: inst.amount,
      dueDate: new Date(inst.dueDate),
    }));
  } else {
    throw new Error("Invalid plan type");
  }

  await planRepo.createInstallments(db, installmentData);

  return plan;
}

export async function addFlexibleInstallment(db, studentId, input) {
  const { amount, dueDate } = input;

  if (!amount || amount <= 0) throw new Error("Amount must be greater than 0");
  if (!dueDate) throw new Error("Due date is required");

  const plan = await planRepo.getPlanByStudentId(db, studentId);
  if (!plan) throw new Error("No plan found for student");
  if (plan.type !== "flexible")
    throw new Error("Installments can only be added to flexible plans");

  const existing = await planRepo.getInstallmentsByPlanId(db, plan.id);
  const totalScheduled = existing.reduce((sum, i) => sum + i.amountDue, 0);
  const remaining = plan.totalAmount - totalScheduled;

  if (amount > remaining) {
    throw new Error(`Amount exceeds remaining balance of ₹${remaining}`);
  }

  const [installment] = await planRepo.createInstallments(db, [
    {
      studentId,
      planId: plan.id,
      amountDue: amount,
      dueDate: new Date(dueDate),
    },
  ]);

  return installment;
}

export async function getPlanWithInstallments(db, studentId) {
  const plan = await planRepo.getPlanByStudentId(db, studentId);

  if (!plan) return null;

  const installments = await planRepo.getInstallmentsByPlanId(db, plan.id);

  return {
    ...plan,
    installments,
  };
}
