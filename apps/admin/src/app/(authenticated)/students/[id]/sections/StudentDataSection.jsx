import { StudentDetailClient } from "../StudentDetailClient";
import { API } from "@/lib/api";
import { formatDate } from "@/lib/format";

async function fetchPlan(studentId) {
  const res = await fetch(`${API}/api/students/${studentId}/plan`, { cache: "no-store" });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data ?? null;
}

async function fetchPayments(studentId) {
  const res = await fetch(`${API}/api/students/${studentId}/payments`, { cache: "no-store" });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data ?? [];
}


export async function StudentDataSection({ student, plan, payments = [], canEdit = false }) {
  const studentId = student.id;

  const allocationMap = {};
  for (const txn of payments) {
    for (const alloc of txn.allocations ?? []) {
      allocationMap[alloc.installmentId] = (allocationMap[alloc.installmentId] || 0) + alloc.amount;
    }
  }

  const sortedInstallments = [...(plan?.installments || [])].sort(
    (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
  );

  const installmentLabelMap = {};
  sortedInstallments.forEach((inst, i) => {
    installmentLabelMap[inst.id] = `Installment ${i + 1}`;
  });

  const TYPE_LABEL = { full: "Full Pay", emi: "EMI", custom: "Custom", flexible: "Flexible" };

  const initialPlan = plan ? {
    id: plan.id,
    type: TYPE_LABEL[plan.type] ?? plan.type,
    total: plan.totalAmount,
    installments: sortedInstallments.length,
    startDate: sortedInstallments[0]?.dueDate ? formatDate(sortedInstallments[0].dueDate) : null,
  } : null;

  const initialInstallments = sortedInstallments.map((inst) => ({
    id: inst.id,
    dueDate: formatDate(inst.dueDate),
    amount: inst.amountDue,
    paid: allocationMap[inst.id] || 0,
  }));

  const initialTransactions = payments.map((txn) => {
    const labels = (txn.allocations || [])
      .map((a) => installmentLabelMap[a.installmentId])
      .filter(Boolean)
      .join(", ");
    return {
      id: txn.id,
      date: formatDate(txn.createdAt),
      amount: txn.amount,
      mode: txn.method,
      allocatedTo: labels || txn.note || "—",
    };
  });

  return (
    <StudentDetailClient
      student={student}
      initialPlan={initialPlan}
      initialInstallments={initialInstallments}
      initialTransactions={initialTransactions}
      canEdit={canEdit}
    />
  );
}
