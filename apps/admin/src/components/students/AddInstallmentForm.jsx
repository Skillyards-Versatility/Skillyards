"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { DateInput } from "@/components/ui/date-input";

export function AddInstallmentForm({
  open,
  onClose,
  onSubmit,
  remaining,
  isSubmitting,
}) {
  const [form, setForm] = useState({ date: "", amount: "" });

  useEffect(() => {
    if (!open) setForm({ date: "", amount: "" });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const amount = Number(form.amount) || 0;
  const isValid = form.date && amount > 0 && amount <= remaining;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    onSubmit({ amount, dueDate: form.date });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" />

      <div className="relative w-full max-w-sm card p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground">Add Installment</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="rounded-lg bg-muted/50 border border-border px-4 py-3 flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase">
            Remaining Balance
          </span>
          <span className="text-base font-bold text-foreground">
            ₹{remaining.toLocaleString()}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
              Due Date
            </label>
            <DateInput
              required
              value={form.date}
              onChange={(iso) => setForm((f) => ({ ...f, date: iso }))}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
              Amount (₹)
            </label>
            <input
              type="number"
              min="1"
              max={remaining}
              required
              className="input font-semibold"
              placeholder={`Max ₹${remaining.toLocaleString()}`}
              value={form.amount}
              onChange={(e) =>
                setForm((f) => ({ ...f, amount: e.target.value }))
              }
            />
            {amount > remaining && (
              <p className="text-xs text-destructive mt-1">
                Exceeds remaining balance
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-border rounded-lg font-semibold text-sm hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="flex-1 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Add Installment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
