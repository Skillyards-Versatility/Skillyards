"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { IdentityForm } from "@/components/students/enroll/IdentityForm";
import { FeeStructureForm } from "@/components/students/enroll/FeeStructureForm";
import { createStudent } from "@/actions/student";

export default function EnrollStudentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    course: "",
    batchId: "",
    batchName: "",
    baseAmount: "",
    laptopOpted: false,
  });

  const base = Number(formData.baseAmount) || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error("Student name is required.");
      return;
    }
    if (base <= 0) {
      toast.error("Course fee must be greater than 0.");
      return;
    }

    setIsSubmitting(true);

    try {
      const student = await createStudent({
        name: formData.fullName.trim(),
        phone: formData.phone.trim() || undefined,
        email: formData.email.trim() || undefined,
        courseName: formData.course.trim() || undefined,
        batchId: formData.batchId || undefined,
        batchName: formData.batchName || undefined,
        totalFee: base,
        finalFee: base,
        laptopOpted: formData.laptopOpted,
      });

      toast.success("Student enrolled successfully.");
      router.push(`/students/${student.id}`);
    } catch (error) {
      toast.error(error.message || "Failed to enroll student.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <Link href="/students" className="p-2 -ml-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Enroll New Student</h1>
          <p className="text-muted-foreground text-sm font-medium mt-0.5">Register a student, assign a batch, and define their fee structure.</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="card p-6 bg-card space-y-8">
          
          <IdentityForm formData={formData} setFormData={setFormData} />
          
          <FeeStructureForm formData={formData} setFormData={setFormData} />

          <div className="pt-4 border-t border-border flex justify-end gap-3">
            <Link 
              href="/students"
              className="px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted border border-border rounded-lg transition-colors"
            >
              Cancel
            </Link>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center justify-center min-w-[140px] px-4 py-2.5 bg-primary hover:opacity-90 text-primary-foreground font-bold rounded-lg transition-colors focus:ring-4 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <><Loader2 className="animate-spin mr-2 h-4 w-4" /> Enrolling...</>
              ) : "Enroll Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
