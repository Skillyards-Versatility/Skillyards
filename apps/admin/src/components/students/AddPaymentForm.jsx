"use client";

import { useEffect } from "react";
import { CreditCard, Loader2, X } from "lucide-react";

export function AddPaymentForm({
  open,
  onClose,
  isSubmitting,
  paymentForm,
  setPaymentForm,
  onSubmit,
  installmentContext,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" />

      {/* Panel */}
      <div className="relative w-full max-w-2xl card p-8 sm:p-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" />
            Record Payment
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Installment context */}
          {installmentContext && (
            <div className="rounded-lg bg-muted/50 border border-border px-4 py-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase">
                {installmentContext.label}
              </span>
              <span className="text-sm font-bold text-foreground">
                ₹{installmentContext.remaining.toLocaleString()} due
              </span>
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
              Amount (₹)
            </label>
            <input
              type="number"
              required
              min="1"
              value={paymentForm.amount}
              onChange={(e) =>
                setPaymentForm({ ...paymentForm, amount: e.target.value })
              }
              className="input font-semibold"
              placeholder="Enter amount"
            />
          </div>

          {/* Mode */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
              Payment Mode
            </label>
            <select
              className="input"
              value={paymentForm.mode}
              onChange={(e) =>
                setPaymentForm({ ...paymentForm, mode: e.target.value })
              }
            >
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>

          {/* Reference */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
              Reference ID (Optional)
            </label>
            <input
              type="text"
              value={paymentForm.reference}
              onChange={(e) =>
                setPaymentForm({ ...paymentForm, reference: e.target.value })
              }
              className="input"
              placeholder="Txn ID / UTR"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 flex items-center justify-center py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Processing...
              </>
            ) : (
              "Record Payment"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
