"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { X, Loader2 } from "lucide-react";
import { updateStudent } from "@/actions/student";
import { LaptopOptedToggle } from "@/components/ui/LaptopOptedToggle";

const COURSES = [
  "OJT (Full Stack Development)",
  "OJT (Advanced Digital Marketing)",
  "OJD (Bachelor of Computer Applications)",
  "OJD (Bachelor of Business Administration)",
];

export function EditStudentModal({ isOpen, onClose, student, batches = [], onSuccess }) {
  const [form, setForm] = useState(() => ({
    name: student?.name || "",
    phone: student?.phone || "",
    email: student?.email || "",
    courseName: student?.courseName || "",
    batchId: student?.batchId || "",
    totalFee: student?.totalFee ?? "",
    finalFee: student?.finalFee ?? "",
    laptopOpted: student?.laptopOpted ?? false,
  }));

  useEffect(() => {
    if (student) {
      setForm({
        name: student.name || "",
        phone: student.phone || "",
        email: student.email || "",
        courseName: student.courseName || "",
        batchId: student.batchId || "",
        totalFee: student.totalFee ?? "",
        finalFee: student.finalFee ?? "",
        laptopOpted: student.laptopOpted ?? false,
      });
    }
  }, [student]);
  const [saving, setSaving] = useState(false);

  if (!isOpen || !student) return null;

  const availableBatches = form.courseName
    ? batches.filter((b) => b.courseName === form.courseName)
    : batches;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    const totalFee = Number(form.totalFee);
    const finalFee = Number(form.finalFee);
    if (!totalFee || totalFee <= 0 || !finalFee || finalFee <= 0) {
      toast.error("Total fee and final fee must be positive numbers");
      return;
    }
    if (finalFee > totalFee) {
      toast.error("Final fee cannot exceed total fee");
      return;
    }

    setSaving(true);
    try {
      const matchedBatch = batches.find((b) => b.id === form.batchId);
      await updateStudent(student.id, {
        name: form.name.trim(),
        phone: form.phone.trim() || null,
        email: form.email.trim() || null,
        courseName: form.courseName || null,
        batchId: form.batchId || null,
        batchName: matchedBatch?.name || null,
        totalFee,
        finalFee,
        laptopOpted: form.laptopOpted,
      });
      toast.success("Student updated");
      onClose();
      onSuccess?.();
    } catch (err) {
      toast.error(err.message || "Failed to update student");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-card border border-border/60 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <form onSubmit={handleSubmit} className="flex flex-col max-h-full">
          <div className="flex items-center justify-between p-5 border-b border-border/50">
            <div>
              <h3 className="font-semibold text-lg">Edit Student</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Admin correction of student details</p>
            </div>
            <button type="button" onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-4 overflow-y-auto">
            <div>
              <label className="text-xs font-medium block mb-1">Full Name *</label>
              <input className="input w-full" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium block mb-1">Phone</label>
                <input className="input w-full" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="10-digit mobile" />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">Email</label>
                <input className="input w-full" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="student@example.com" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">Course</label>
              <select
                className="input w-full"
                value={form.courseName}
                onChange={(e) => {
                  setForm({ ...form, courseName: e.target.value, batchId: "" });
                }}
              >
                <option value="">Select Course</option>
                {COURSES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">Batch</label>
              <select className="input w-full" value={form.batchId} onChange={(e) => setForm({ ...form, batchId: e.target.value })}>
                <option value="">Unassigned</option>
                {availableBatches.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium block mb-1">Total Fee (₹)</label>
                <input type="number" min="0" className="input w-full" value={form.totalFee} onChange={(e) => setForm({ ...form, totalFee: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">Final Fee (₹)</label>
                <input type="number" min="0" className="input w-full" value={form.finalFee} onChange={(e) => setForm({ ...form, finalFee: e.target.value })} />
              </div>
            </div>
            <div className="pt-2">
              <LaptopOptedToggle
                id="editLaptopOpted"
                value={form.laptopOpted || false}
                onChange={(v) => setForm({ ...form, laptopOpted: v })}
              />
            </div>
          </div>

          <div className="p-5 border-t border-border/50 space-y-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold text-sm rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
