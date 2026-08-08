"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Loader2, Pencil } from "lucide-react";
import { addStudentPayment, addFlexibleInstallment, updateStudentPlan, updateInstallment } from "@/actions/student";
import { formatDate } from "@/lib/format";
import { EditStudentModal } from "@/components/students/EditStudentModal";

import { PlanSection } from "@/components/students/PlanSection";
import { InstallmentsTable } from "@/components/students/InstallmentsTable";
import { TransactionsTable } from "@/components/students/TransactionTable";
import { AddPaymentForm } from "@/components/students/AddPaymentForm";
import { AddInstallmentForm } from "@/components/students/AddInstallmentForm";
import { AssignPlanWizard } from "@/components/students/AssignPlanWizard";

export function StudentDetailClient({ student, initialTransactions, initialPlan, initialInstallments, canEdit = false, batches = [] }) {
  const router = useRouter();

  const [plan, setPlan] = useState(initialPlan ?? null);
  const [editDetailsOpen, setEditDetailsOpen] = useState(false);
  const [installments, setInstallments] = useState(initialInstallments ?? []);
  const [transactions, setTransactions] = useState(initialTransactions);

  useEffect(() => { setPlan(initialPlan ?? null); }, [initialPlan]);
  useEffect(() => { setInstallments(initialInstallments ?? []); }, [initialInstallments]);
  useEffect(() => { setTransactions(initialTransactions ?? []); }, [initialTransactions]);

  const [wizardOpen, setWizardOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [installmentModalOpen, setInstallmentModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingInstallment, setIsAddingInstallment] = useState(false);

  const [planEditOpen, setPlanEditOpen] = useState(false);
  const [planEditForm, setPlanEditForm] = useState({ total: "" });
  const [isSavingPlan, setIsSavingPlan] = useState(false);

  const [installmentEditOpen, setInstallmentEditOpen] = useState(false);
  const [installmentEditForm, setInstallmentEditForm] = useState(null);
  const [isSavingInstallment, setIsSavingInstallment] = useState(false);

  const [paymentForm, setPaymentForm] = useState({ amount: "", mode: "upi", reference: "" });
  const [installmentContext, setInstallmentContext] = useState(null);

  const openPaymentModal = (installmentId = "") => {
    if (installmentId) {
      const instIdx = installments.findIndex((i) => i.id === installmentId);
      const inst = installments[instIdx];
      if (!inst) return;
      const remaining = inst.amount - inst.paid;
      setInstallmentContext({ label: `Installment ${instIdx + 1}`, remaining });
      setPaymentForm({ amount: String(remaining), mode: "upi", reference: "", installmentId });
    } else {
      setInstallmentContext(null);
      setPaymentForm({ amount: "", mode: "upi", reference: "", installmentId: "" });
    }
    setModalOpen(true);
  };

  const handlePlanCreated = () => {
    router.refresh();
    toast.success("Fee plan assigned");
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    const amount = Number(paymentForm.amount);
    if (!amount || amount <= 0) { toast.error("Invalid amount"); return; }

    setIsSubmitting(true);
    try {
      const payment = await addStudentPayment(student.id, {
        amount,
        method: paymentForm.mode,
        note: paymentForm.reference || undefined,
      });

      const instNum = paymentForm.installmentId
        ? installments.findIndex((i) => i.id === paymentForm.installmentId) + 1
        : 0;

      setTransactions(prev => [{
        id: payment.id,
        date: formatDate(payment.createdAt),
        amount: payment.amount,
        mode: payment.method,
        allocatedTo: instNum > 0 ? `Installment ${instNum}` : "Auto",
      }, ...prev]);

      setModalOpen(false);
      router.refresh();
      toast.success("Payment recorded");
    } catch (err) {
      toast.error(err.message || "Failed to record payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddInstallment = async ({ amount, dueDate }) => {
    setIsAddingInstallment(true);
    try {
      const inst = await addFlexibleInstallment(student.id, { amount, dueDate });
      setInstallments(prev => [...prev, {
        id: inst.id,
        dueDate: formatDate(inst.dueDate),
        amount: inst.amountDue,
        paid: 0,
      }]);
      setInstallmentModalOpen(false);
      router.refresh();
      toast.success("Installment added");
    } catch (err) {
      toast.error(err.message || "Failed to add installment");
    } finally {
      setIsAddingInstallment(false);
    }
  };

  const openPlanEdit = () => {
    if (!plan) return;
    setPlanEditForm({ total: String(plan.total ?? "") });
    setPlanEditOpen(true);
  };

  const handlePlanEditSubmit = async (e) => {
    e.preventDefault();
    const total = Number(planEditForm.total);
    if (!total || total <= 0) {
      toast.error("Invalid total amount");
      return;
    }
    setIsSavingPlan(true);
    try {
      await updateStudentPlan(student.id, { totalAmount: total });
      setPlan(prev => prev ? { ...prev, total } : prev);
      setPlanEditOpen(false);
      router.refresh();
      toast.success("Plan updated");
    } catch (err) {
      toast.error(err.message || "Failed to update plan");
    } finally {
      setIsSavingPlan(false);
    }
  };

  const openInstallmentEdit = (inst) => {
    setInstallmentEditForm({
      id: inst.id,
      amount: String(inst.amount ?? ""),
      dueDate: inst.dueDateISO ?? inst.dueDate ?? "",
    });
    setInstallmentEditOpen(true);
  };

  const handleInstallmentEditSubmit = async (e) => {
    e.preventDefault();
    if (!installmentEditForm) return;
    const amount = Number(installmentEditForm.amount);
    if (!amount || amount <= 0) {
      toast.error("Invalid amount");
      return;
    }
    if (!installmentEditForm.dueDate) {
      toast.error("Due date is required");
      return;
    }
    setIsSavingInstallment(true);
    try {
      await updateInstallment(student.id, installmentEditForm.id, {
        amountDue: amount,
        dueDate: installmentEditForm.dueDate,
      });
      setInstallments(prev =>
        prev.map(i =>
          i.id === installmentEditForm.id
            ? { ...i, amount, dueDate: formatDate(installmentEditForm.dueDate) }
            : i
        )
      );
      setInstallmentEditOpen(false);
      setInstallmentEditForm(null);
      router.refresh();
      toast.success("Installment updated");
    } catch (err) {
      toast.error(err.message || "Failed to update installment");
    } finally {
      setIsSavingInstallment(false);
    }
  };

  const scheduledTotal = installments.reduce((s, i) => s + i.amount, 0);
  const flexibleRemaining = plan ? (plan.total - scheduledTotal) : 0;
  const totalPaid = installments.reduce((s, i) => s + (i.paid ?? 0), 0);
  const isFullyPaid = !!plan && totalPaid >= plan.total;
  const isFlexibleNoExtraInstallments = plan?.type === "Flexible" && (
    installments.length === 0 ||
    (totalPaid >= scheduledTotal && flexibleRemaining > 0)
  );
  const addPaymentDisabled = !plan || isFullyPaid || isFlexibleNoExtraInstallments;

  return (
    <div className="space-y-6">

      <div className="flex justify-end">
        <button
          onClick={() => openPaymentModal()}
          disabled={addPaymentDisabled}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:opacity-90 shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Add Payment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student Details Card */}
        <div className="card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">
              Student Details
            </h3>
            {canEdit && (
              <button
                onClick={() => setEditDetailsOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:text-primary hover:bg-primary/10 border border-border rounded-lg transition-colors cursor-pointer"
                title="Edit Details"
              >
                <Pencil className="w-3 h-3" /> Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
            <div>
              <p className="text-muted-foreground text-xs mb-1">Phone Number</p>
              <p className="font-semibold text-foreground">
                {student.phone || "—"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">Email Address</p>
              <p className="font-semibold text-foreground truncate">
                {student.email || "—"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">Assigned Batch</p>
              <p className="font-semibold text-foreground">
                {student.batchName ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
                    {student.batchName}
                  </span>
                ) : (
                  <span className="text-muted-foreground italic font-normal">Unassigned</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">Laptop Option</p>
              <p className="font-semibold text-foreground">
                {student.laptopOpted ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60 text-xs font-bold">
                    Opted{student.laptopOptedAt ? ` · ${new Date(student.laptopOptedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}` : ""}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-gray-100 text-gray-700 dark:bg-gray-850 dark:text-gray-400 border border-gray-200 dark:border-gray-800 text-xs font-semibold">
                    Not Opted
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        <PlanSection plan={plan} onAssignPlan={() => setWizardOpen(true)} onEditPlan={canEdit ? openPlanEdit : undefined} canEdit={canEdit} />
      </div>

      <InstallmentsTable
        installments={installments}
        onPay={openPaymentModal}
        onAddInstallment={plan?.type === "Flexible" && flexibleRemaining > 0 ? () => setInstallmentModalOpen(true) : undefined}
        onEditInstallment={canEdit ? openInstallmentEdit : undefined}
        canEdit={canEdit}
        unscheduled={plan?.type === "Flexible" ? flexibleRemaining : 0}
      />

      <TransactionsTable transactions={transactions} />

      <AssignPlanWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        student={student}
        studentId={student.id}
        onPlanCreated={handlePlanCreated}
      />

      <AddInstallmentForm
        open={installmentModalOpen}
        onClose={() => setInstallmentModalOpen(false)}
        onSubmit={handleAddInstallment}
        remaining={flexibleRemaining}
        isSubmitting={isAddingInstallment}
      />

      <AddPaymentForm
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        installmentContext={installmentContext}
        isSubmitting={isSubmitting}
        paymentForm={paymentForm}
        setPaymentForm={setPaymentForm}
        onSubmit={handleSubmitPayment}
      />

      {/* Edit Plan Modal */}
      {planEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setPlanEditOpen(false)} />
          <form onSubmit={handlePlanEditSubmit} className="relative w-full max-w-sm bg-card border border-border/60 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Edit Fee Plan</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Admin correction of plan total</p>
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">Total Amount (₹)</label>
              <input
                type="number"
                min="0"
                className="input w-full"
                value={planEditForm.total}
                onChange={(e) => setPlanEditForm({ ...planEditForm, total: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <button
                type="submit"
                disabled={isSavingPlan}
                className="w-full py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSavingPlan && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setPlanEditOpen(false)}
                className="w-full py-2.5 bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold text-sm rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Installment Modal */}
      {installmentEditOpen && installmentEditForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setInstallmentEditOpen(false)} />
          <form onSubmit={handleInstallmentEditSubmit} className="relative w-full max-w-sm bg-card border border-border/60 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Edit Installment</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Admin correction of installment details</p>
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">Amount (₹)</label>
              <input
                type="number"
                min="0"
                className="input w-full"
                value={installmentEditForm.amount}
                onChange={(e) => setInstallmentEditForm({ ...installmentEditForm, amount: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">Due Date</label>
              <input
                type="date"
                className="input w-full"
                value={installmentEditForm.dueDate}
                onChange={(e) => setInstallmentEditForm({ ...installmentEditForm, dueDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <button
                type="submit"
                disabled={isSavingInstallment}
                className="w-full py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSavingInstallment && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => { setInstallmentEditOpen(false); setInstallmentEditForm(null); }}
                className="w-full py-2.5 bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold text-sm rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {editDetailsOpen && (
        <EditStudentModal
          isOpen={editDetailsOpen}
          onClose={() => setEditDetailsOpen(false)}
          student={student}
          batches={batches}
          onSuccess={() => {
            router.refresh();
          }}
        />
      )}

    </div>
  );
}
