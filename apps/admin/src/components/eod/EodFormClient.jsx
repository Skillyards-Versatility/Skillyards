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
    { key: "counsellingDone", label: "Counselling Done", type: "number", placeholder: "0" },
    { key: "counsellingBooked", label: "Counselling Booked", type: "number", placeholder: "0" },
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
  marketing: [
    { 
      key: "activityType", 
      label: "Primary Activity Today", 
      type: "select", 
      options: [
        { label: "Select Activity...", value: "" },
        { label: "Graphic Design", value: "graphic_design" },
        { label: "Video Editing", value: "video_editing" },
        { label: "Ads / PPC", value: "ads_ppc" },
        { label: "Content / Blogs", value: "content_blogs" },
        { label: "Team Management & Strategy", value: "management" },
        { label: "General / Mixed Tasks", value: "general" },
      ]
    },
    // Graphic Design
    { key: "creativesDone", label: "Number of Creatives Done", type: "number", placeholder: "0", condition: { field: "activityType", value: "graphic_design" } },
    { key: "campaignName", label: "Campaign Name / Topic", type: "text", placeholder: "e.g., Summer Sale", condition: { field: "activityType", value: "graphic_design" } },
    { key: "designLinks", label: "Figma / Drive Links", type: "text", placeholder: "https://...", condition: { field: "activityType", value: "graphic_design" } },
    
    // Video Editing
    { key: "minutesEdited", label: "Minutes of Video Edited", type: "number", placeholder: "0", condition: { field: "activityType", value: "video_editing" } },
    { key: "reelsCompleted", label: "Reels / Shorts Completed", type: "number", placeholder: "0", condition: { field: "activityType", value: "video_editing" } },
    { key: "renderStatus", label: "Render/Export Status", type: "text", placeholder: "e.g., Exported and Uploaded", condition: { field: "activityType", value: "video_editing" } },
    
    // Ads / PPC
    { key: "totalSpend", label: "Total Spend Today", type: "text", placeholder: "₹0", condition: { field: "activityType", value: "ads_ppc" } },
    { key: "leadsGenerated", label: "Leads Generated", type: "number", placeholder: "0", condition: { field: "activityType", value: "ads_ppc" } },
    { key: "cpa", label: "Estimated CPA", type: "text", placeholder: "₹0", condition: { field: "activityType", value: "ads_ppc" } },
    
    // Content / Blogs
    { key: "blogsWritten", label: "Blogs/Articles Written", type: "number", placeholder: "0", condition: { field: "activityType", value: "content_blogs" } },
    { key: "wordCount", label: "Total Word Count", type: "number", placeholder: "0", condition: { field: "activityType", value: "content_blogs" } },
    { key: "seoScore", label: "SEO Score / Status", type: "text", placeholder: "e.g., 85/100, Published", condition: { field: "activityType", value: "content_blogs" } },
    
    // Team Management & Strategy
    { key: "reviewsCompleted", label: "Team Reviews / Approvals Completed", type: "number", placeholder: "0", condition: { field: "activityType", value: "management" } },
    { key: "meetingsConducted", label: "Meetings Conducted", type: "number", placeholder: "0", condition: { field: "activityType", value: "management" } },
    { key: "strategicTasks", label: "Strategic Planning / Focus Areas", type: "textarea", placeholder: "What strategic areas were focused on today?", condition: { field: "activityType", value: "management" } },
    { key: "escalations", label: "Escalations or Roadblocks", type: "textarea", placeholder: "Any blockers for the team?", condition: { field: "activityType", value: "management" } },
    
    // General / Mixed Tasks
    { key: "tasksCompleted", label: "Tasks Completed", type: "textarea", placeholder: "List tasks completed...", condition: { field: "activityType", value: "general" } },
    
    // Always show notes
    { key: "notes", label: "Additional Notes", type: "textarea", placeholder: "Any extra information..." },
  ],
  outside_sales: [
    { key: "dialedCalls", label: "Dialed Calls", type: "number", placeholder: "0" },
    { key: "connectedCalls", label: "Connected Calls", type: "number", placeholder: "0" },
    { key: "meetingsScheduled", label: "Meetings Scheduled", type: "number", placeholder: "0" },
    { key: "meetingsDone", label: "Meetings Done", type: "number", placeholder: "0" },
    { key: "siteVisits", label: "Site Visits", type: "number", placeholder: "0" },
    { key: "leadsCollected", label: "Leads Collected", type: "number", placeholder: "0" },
    { key: "notes", label: "Notes", type: "textarea", placeholder: "Additional notes..." },
  ],
};

const MANAGER_FIELDS = [
  { key: "reviewsCompleted", label: "Team Reviews / Approvals Completed", type: "number", placeholder: "0" },
  { key: "meetingsConducted", label: "Meetings Conducted", type: "number", placeholder: "0" },
  { key: "strategicTasks", label: "Strategic Planning / Focus Areas", type: "textarea", placeholder: "What strategic areas were focused on today?" },
  { key: "escalations", label: "Escalations or Roadblocks", type: "textarea", placeholder: "Any blockers for the team?" },
  { key: "tasksCompleted", label: "General Tasks Completed", type: "textarea", placeholder: "List tasks completed..." },
  { key: "notes", label: "Additional Notes", type: "textarea", placeholder: "Any extra information..." },
];

const EDITOR_FIELDS = [
  { key: "videosShot", label: "Long-form Videos Shot", type: "number", placeholder: "0" },
  { key: "videosEdited", label: "Long-form Videos Edited", type: "number", placeholder: "0" },
  { key: "reelsShot", label: "Reels / Shorts Shot", type: "number", placeholder: "0" },
  { key: "reelsEdited", label: "Reels / Shorts Edited", type: "number", placeholder: "0" },
  { key: "tasksCompleted", label: "General Tasks Completed", type: "textarea", placeholder: "List any other tasks completed..." },
  { key: "notes", label: "Additional Notes", type: "textarea", placeholder: "Any extra information..." },
];

const TEAM_LABELS = {
  sales: "Sales",
  tech: "Tech",
  hr: "HR",
  ceo_office: "CEO Office",
  admin_head: "Admin Head",
  marketing: "Marketing",
  outside_sales: "Outside Sales",
};

export function EodFormClient({ team, role, existingReport }) {
  const router = useRouter();
  const [formData, setFormData] = useState(existingReport?.data || {});
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const today = getIstDate();
  const [reportDate, setReportDate] = useState(existingReport?.date || today);
  let fields = [];
  if (role === "EDITOR") {
    fields = EDITOR_FIELDS;
  } else if (role === "MANAGER") {
    const teamFields = TEAM_FIELDS[team] || [];
    const managerFields = MANAGER_FIELDS;
    
    // Combine team fields and manager fields, keeping team fields first and removing duplicates like 'notes'
    const combined = [...teamFields];
    managerFields.forEach(mf => {
      if (!combined.some(tf => tf.key === mf.key)) {
        combined.push(mf);
      }
    });
    fields = combined;
  } else {
    fields = TEAM_FIELDS[team] || [];
  }
  
  // Cutoff still applies to current time. Sunday check applies to the selected report date.
  const isSelectedSunday = new Date(reportDate).getDay() === 0;
  const canSubmit = !isSelectedSunday && isIstBeforeCutoff();

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
      toast.error("Submission cutoff (7:30 PM IST) has passed");
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
        date: reportDate,
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
      <div className="card p-6 sm:p-12 text-center">
        <CheckCircle2 className="h-12 sm:h-16 w-12 sm:w-16 text-emerald-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Report Submitted!</h2>
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    );
  }

  if (!canSubmit) {
    return (
      <div className="card p-6 sm:p-12 text-center">
        <AlertCircle className="h-12 sm:h-16 w-12 sm:w-16 text-amber-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">
          {isSelectedSunday ? "Submissions Closed on Sundays" : "Cutoff Time Passed"}
        </h2>
        <p className="text-muted-foreground">
          EOD reports must be submitted before 7:30 PM IST.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="card p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-1">{role === "MANAGER" ? "Manager" : role === "EDITOR" ? "Video Editor" : (TEAM_LABELS[team] || team)} Report</h2>
            <p className="text-sm text-muted-foreground">Select the date for this report.</p>
          </div>
          <input
            type="date"
            className="input text-sm"
            value={reportDate}
            max={today}
            onChange={(e) => setReportDate(e.target.value)}
            disabled={!!existingReport}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {fields
            .filter((field) => {
              if (!field.condition) return true;
              return formData[field.condition.field] === field.condition.value;
            })
            .map((field) => (
            <div key={field.key} className={field.type === "textarea" || field.type === "select" ? "sm:col-span-2" : ""}>
              <label className="text-sm font-medium block mb-1.5">{field.label}</label>
              {field.type === "select" ? (
                <select
                  className="input w-full"
                  value={formData[field.key] || ""}
                  onChange={(e) => updateField(field.key, e.target.value)}
                >
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
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
      <div className="card p-4 sm:p-6">
        <h3 className="text-sm font-semibold mb-3">Screenshot (optional)</h3>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <label className="flex items-center gap-2 border border-dashed border-border rounded-xl px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors text-sm">
            <Upload className="h-4 w-4 shrink-0" />
            <span className="truncate">{screenshotFile ? screenshotFile.name : "Choose image"}</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          {screenshotPreview && (
            <img src={screenshotPreview} alt="Preview" className="h-12 w-12 sm:h-16 sm:w-16 rounded-lg object-cover border shrink-0" />
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-2">PNG, JPEG, or WebP — max 5MB</p>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-all disabled:opacity-50"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          {existingReport ? "Update Report" : "Submit Report"}
        </button>
      </div>
    </form>
  );
}
