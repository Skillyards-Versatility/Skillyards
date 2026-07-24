"use client";

import { useState, useEffect } from "react";
import { X, UserCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { assignStudentBatch } from "@/actions/batch";

export function AssignBatchModal({ isOpen, onClose, student, batches, onSuccess }) {
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (student) {
      setSelectedBatchId(student.batchId || "");
    }
  }, [student]);

  if (!isOpen || !student) return null;

  // Filter batches for student's course if courseName exists
  const availableBatches = student.courseName
    ? batches.filter((b) => b.courseName === student.courseName)
    : batches;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const selectedBatch = batches.find((b) => b.id === selectedBatchId);
      const batchName = selectedBatch ? selectedBatch.name : null;
      const batchId = selectedBatch ? selectedBatch.id : null;

      await assignStudentBatch(student.id, batchId, batchName);
      toast.success(
        batchName
          ? `Assigned ${student.name} to "${batchName}"`
          : `Removed batch assignment for ${student.name}`
      );
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to assign batch");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="card max-w-md w-full p-6 shadow-2xl space-y-6 relative border border-border bg-card">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Assign Student Batch</h2>
            <p className="text-xs text-muted-foreground">Assign custom batch to student record.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 bg-muted/40 rounded-lg text-xs space-y-1">
            <div><span className="font-semibold text-foreground">Student:</span> {student.name}</div>
            <div><span className="font-semibold text-foreground">Course:</span> {student.courseName || "Not assigned"}</div>
            <div><span className="font-semibold text-foreground">Current Batch:</span> {student.batchName || "Unassigned"}</div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Select Target Batch</label>
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="input"
            >
              <option value="">-- Unassigned --</option>
              {availableBatches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.courseName})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4 border-t border-border flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted border border-border rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center min-w-[120px] px-4 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? (
                <><Loader2 className="animate-spin mr-2 h-4 w-4" /> Saving...</>
              ) : (
                "Save Batch"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
