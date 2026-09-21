"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { X, Loader2 } from "lucide-react";
import { updateStudent } from "@/actions/student";
import { LaptopOptedToggle } from "@/components/ui/LaptopOptedToggle";
import { StudentPhotoUpload } from "@/components/students/StudentPhotoUpload";

const COURSES = [
  "OJT (Full Stack Development)",
  "OJT (Advanced Digital Marketing)",
  "OJD (Bachelor of Computer Applications)",
  "OJD (Bachelor of Business Administration)",
];

export function EditStudentModal({
  isOpen,
  onClose,
  student,
  batches = [],
  onSuccess,
}) {
  const [form, setForm] = useState(() => ({
    name: student?.name || "",
    phone: student?.phone || "",
    email: student?.email || "",
    courseName: student?.courseName || "",
    batchId: student?.batchId || "",
    totalFee: student?.totalFee ?? "",
    finalFee: student?.finalFee ?? "",
    laptopOpted: student?.laptopOpted ?? false,
    photoKey: student?.photoKey || null,
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
        photoKey: student.photoKey || null,
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
        photoKey: form.photoKey ?? null,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90dvh] sm:max-h-[85vh] overflow-hidden">
        <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1">
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border bg-card shrink-0">
            <div>
              <h3 className="font-bold text-base sm:text-lg text-foreground">
                Edit Student
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Admin correction of student details
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 sm:p-5 space-y-4 overflow-y-auto min-h-0 flex-1">
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border">
              <StudentPhotoUpload
                photoKey={form.photoKey}
                name={form.name}
                onChange={(newKey) =>
                  setForm((prev) => ({ ...prev, photoKey: newKey }))
                }
                size="md"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                Full Name *
              </label>
              <input
                className="input w-full"
                suppressHydrationWarning
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Student full name"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                  Phone
                </label>
                <input
                  className="input w-full"
                  suppressHydrationWarning
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="10-digit mobile"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                  Email
                </label>
                <input
                  className="input w-full"
                  type="email"
                  suppressHydrationWarning
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="student@example.com"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                Course
              </label>
              <select
                className="input w-full bg-background text-foreground"
                value={form.courseName}
                onChange={(e) => {
                  setForm({ ...form, courseName: e.target.value, batchId: "" });
                }}
              >
                <option value="" className="bg-card text-foreground">
                  Select Course
                </option>
                {COURSES.map((c) => (
                  <option key={c} value={c} className="bg-card text-foreground">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                Batch
              </label>
              <select
                className="input w-full bg-background text-foreground"
                value={form.batchId}
                onChange={(e) => setForm({ ...form, batchId: e.target.value })}
              >
                <option value="" className="bg-card text-foreground">
                  Unassigned
                </option>
                {availableBatches.map((b) => (
                  <option key={b.id} value={b.id} className="bg-card text-foreground">
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                  Total Fee (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  className="input w-full font-semibold"
                  value={form.totalFee}
                  onChange={(e) =>
                    setForm({ ...form, totalFee: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                  Final Fee (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  className="input w-full font-semibold"
                  value={form.finalFee}
                  onChange={(e) =>
                    setForm({ ...form, finalFee: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="pt-1">
              <LaptopOptedToggle
                id="editLaptopOpted"
                value={form.laptopOpted || false}
                onChange={(v) => setForm({ ...form, laptopOpted: v })}
              />
            </div>
          </div>

          <div className="p-4 sm:p-5 border-t border-border bg-card/95 backdrop-blur-xs shrink-0 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 bg-card hover:bg-muted text-foreground border border-border font-semibold text-sm rounded-xl transition-colors cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-5 py-2.5 bg-primary text-primary-foreground hover:opacity-90 font-bold text-sm rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
