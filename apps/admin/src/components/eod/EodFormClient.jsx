"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Upload, CheckCircle2, AlertCircle } from "lucide-react";
import { getIstDate, isIstBeforeCutoff, isIstSunday } from "@/lib/ist";
import { submitEodReport, uploadScreenshot } from "@/actions/eod";

const TEAM_FIELDS = {
  sales: [
    { key: "dialedCalls", label: "Dialed Calls", type: "number", placeholder: "0" },
    { key: "connectedCalls", label: "Connected Calls", type: "number", placeholder: "0" },
    { key: "counsellingVirtual", label: "Counselling (Virtual)", type: "number", placeholder: "0" },
    { key: "counsellingWalkin", label: "Counselling (Walk-in)", type: "number", placeholder: "0" },
    { key: "sessionBooked", label: "Sessions Booked", type: "number", placeholder: "0" },
    { key: "admissionRegistration", label: "Admissions / Registrations", type: "number", placeholder: "0" },
    { key: "admissionProjection", label: "Admission Projection", type: "number", placeholder: "0" },
    { key: "notes", label: "Notes", type: "textarea", placeholder: "Any additional notes..." },
  ],
  tech: [
    { key: "classesTaken", label: "Classes Taken", type: "number", placeholder: "0" },
    { key: "projectsWorkedOn", label: "Projects Worked On", type: "number", placeholder: "0" },
    { key: "bugsFixed", label: "Bugs Fixed", type: "number", placeholder: "0" },
    { key: "deploymentsDone", label: "Deployments Done", type: "number", placeholder: "0" },
    { key: "notes", label: "Notes", type: "textarea", placeholder: "Any additional notes..." },
  ],
  hr: [
    { key: "interviewsConducted", label: "Interviews Conducted", type: "number", placeholder: "0" },
    { key: "hires", label: "Hires", type: "number", placeholder: "0" },
    { key: "attrition", label: "Attrition", type: "number", placeholder: "0" },
    { key: "policiesNotes", label: "Policies / Notes", type: "textarea", placeholder: "Notes on policies..." },
  ],
  ceo_office: [
    { key: "keyPriorities", label: "Key Priorities", type: "textarea", placeholder: "List key priorities..." },
    { key: "decisionsMade", label: "Decisions Made", type: "textarea", placeholder: "Decisions taken today..." },
    { key: "escalations", label: "Escalations", type: "textarea", placeholder: "Any escalations..." },
  ],
  admin_head: [
    { key: "tasksCompleted", label: "Tasks Completed", type: "textarea", placeholder: "List tasks completed..." },
    { key: "expenses", label: "Expenses", type: "text", placeholder: "₹0" },
    { key: "vendorPayments", label: "Vendor Payments", type: "text", placeholder: "₹0" },
    { key: "facilityIssues", label: "Facility Issues", type: "textarea", placeholder: "Any issues..." },
  ],
};

const TEAM_LABELS = {
  sales: "Sales",
  tech: "Tech",
  hr: "HR",
  ceo_office: "CEO Office",
  admin_head: "Admin Head",
};

export function EodFormClient({ team, existingReport }) {
  const router = useRouter();
  const [formData, setFormData] = useState(existingReport?.data || {});
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const fields = TEAM_FIELDS[team] || [];
  const today = getIstDate();
  const canSubmit = !isIstSunday() && isIstBeforeCutoff();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5MB");
      return;
    }
    if (!["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(file.type)) {
      toast.error("Only PNG, JPEG, and WebP images are allowed");
      return;
    }
    setScreenshotFile(file);
    setScreenshotPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) {
      toast.error("Submission cutoff (6:30 PM IST) has passed");
      return;
    }

    setSubmitting(true);
    try {
      let screenshotKey = existingReport?.screenshotKey || null;

      if (screenshotFile) {
        const uploadRes = await uploadScreenshot(screenshotFile);
        if (!uploadRes.success) {
          toast.error(uploadRes.message || "Screenshot upload failed");
          setSubmitting(false);
          return;
        }
        screenshotKey = uploadRes.screenshotKey;
      }

      const res = await submitEodReport({
        date: today,
        data: formData,
        screenshotKey,
      });

      if (res.success) {
        setSuccess(true);
        toast.success(existingReport ? "Report updated!" : "Report submitted!");
        setTimeout(() => router.push("/eod"), 1500);
      } else {
        toast.error(res.message || "Failed to submit report");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  if (success) {
    return (
      <div className="card p-12 text-center">
        <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Report Submitted!</h2>
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    );
  }

  if (!canSubmit) {
    return (
      <div className="card p-12 text-center">
        <AlertCircle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">
          {isIstSunday() ? "Submissions Closed on Sundays" : "Cutoff Time Passed"}
        </h2>
        <p className="text-muted-foreground">
          EOD reports must be submitted before 6:30 PM IST.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-1">{TEAM_LABELS[team] || team} Report</h2>
        <p className="text-sm text-muted-foreground mb-6">{today}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field.key} className={field.type === "textarea" ? "md:col-span-2" : ""}>
              <label className="text-sm font-medium block mb-1.5">{field.label}</label>
              {field.type === "textarea" ? (
                <textarea
                  className="input w-full min-h-[80px] resize-y"
                  placeholder={field.placeholder}
                  value={formData[field.key] || ""}
                  onChange={(e) => updateField(field.key, e.target.value)}
                />
              ) : (
                <input
                  type={field.type}
                  className="input w-full"
                  placeholder={field.placeholder}
                  value={formData[field.key] || ""}
                  onChange={(e) => updateField(field.key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Screenshot */}
      <div className="card p-6">
        <h3 className="text-sm font-semibold mb-3">Screenshot (optional)</h3>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 border border-dashed border-border rounded-xl px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors text-sm">
            <Upload className="h-4 w-4" />
            {screenshotFile ? screenshotFile.name : "Choose image"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          {screenshotPreview && (
            <img src={screenshotPreview} alt="Preview" className="h-16 w-16 rounded-lg object-cover border" />
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-2">PNG, JPEG, or WebP — max 5MB</p>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-all disabled:opacity-50"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          {existingReport ? "Update Report" : "Submit Report"}
        </button>
      </div>
    </form>
  );
}
