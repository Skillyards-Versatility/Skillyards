"use client";

import { useState } from "react";
import { X, Layers, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createBatch } from "@/actions/batch";

const COURSES = [
  "OJT (Full Stack Development)",
  "OJT (Advanced Digital Marketing)",
  "OJD (Bachelor of Computer Applications)",
  "OJD (Bachelor of Business Administration)",
];

export function CreateBatchModal({ isOpen, onClose, onSuccess, initialCourse = "" }) {
  const [courseName, setCourseName] = useState(initialCourse || COURSES[0]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Batch name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await createBatch({
        name: name.trim(),
        courseName,
        description: description.trim() || undefined,
        status,
      });
      toast.success(`Batch "${name}" created successfully!`);
      setName("");
      setDescription("");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to create batch");
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
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Create New Batch</h2>
            <p className="text-xs text-muted-foreground">Add a new cohort/batch for student enrollment.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Select Course</label>
            <select
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="input"
              required
            >
              {COURSES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Batch Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. OJT Fullstack Batch 3"
              className="input"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Description (Optional)</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Morning Batch 9 AM - 1 PM"
              className="input resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="input"
            >
              <option value="active">Active</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
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
                <><Loader2 className="animate-spin mr-2 h-4 w-4" /> Creating...</>
              ) : (
                "Create Batch"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
