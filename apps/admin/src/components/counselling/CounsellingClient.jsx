"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Search, Phone, User, GraduationCap, BookOpen, MessageSquare, Calendar, X, ImageIcon, UploadCloud, Eye, FileText, Download, ArrowLeft, ArrowRight, Bell, Pencil, Users, CalendarCheck, UserCheck, Clock } from "lucide-react";
import { getCounsellingSessions, createCounsellingSession, updateCounsellingSession, deleteCounsellingSession } from "@/actions/counselling";
import { getIstDate } from "@/lib/ist";

const OUTCOME_DOT = {
  session_booked: "bg-emerald-500",
  enrolled: "bg-blue-500",
  follow_up: "bg-amber-500",
  not_interested: "bg-red-500",
  no_response: "bg-slate-400",
};

const SOURCE_DOT = {
  walk_in: "bg-purple-500",
  phone: "bg-sky-500",
  referral: "bg-orange-500",
  qsp: "bg-teal-500",
};

function getInitials(name) {
  if (!name) return "?";
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() || "").join("") || "?";
}

const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

function KpiCard({ label, value, icon: Icon }) {
  return (
    <div className="card p-4 sm:p-5 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-2xl sm:text-3xl font-bold text-foreground mt-2">{value}</p>
      </div>
      <div className="p-3 bg-primary/10 text-primary rounded-lg shrink-0">
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
}

function FilterChip({ label, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 h-8 rounded-lg text-sm font-medium border transition-colors whitespace-nowrap ${active ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border hover:text-foreground hover:border-primary/30"}`}
    >
      <span className="capitalize">{label}</span>
      <span className={`text-xs tabular-nums ${active ? "text-primary-foreground/70" : "text-muted-foreground/60"}`}>{count}</span>
    </button>
  );
}

export function CounsellingClient({ isAdmin = false, canEdit = false, counselors = [], batches = [] }) {
  const today = getIstDate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 50;

  // Filters
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return getIstDate(d);
  });
  const [endDate, setEndDate] = useState(today);
  const [sourceFilter, setSourceFilter] = useState("");
  const [outcomeFilter, setOutcomeFilter] = useState("");
  const [counselorFilter, setCounselorFilter] = useState("");
  const [bookedByFilter, setBookedByFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showTodayFollowUps, setShowTodayFollowUps] = useState(false);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [startDate, endDate, sourceFilter, outcomeFilter, counselorFilter, bookedByFilter, debouncedSearch, showTodayFollowUps]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // New session form
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    studentName: "",
    phone: "",
    ageOrClass: "",
    courseInterest: "",
    source: "walk_in",
    outcome: "follow_up",
    notes: "",
    sessionDate: today,
    nextFollowUpDate: "",
    counselorId: "", // Empty string means it will default to logged-in user on backend
    bookedById: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

  // View details modal
  const [selectedSession, setSelectedSession] = useState(null);

  // Edit modal
  const [editingSession, setEditingSession] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [editSaving, setEditSaving] = useState(false);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCounsellingSessions({ 
        startDate, 
        endDate, 
        source: sourceFilter || undefined, 
        outcome: outcomeFilter || undefined,
        counselorId: counselorFilter || undefined,
        bookedById: bookedByFilter || undefined,
        search: debouncedSearch || undefined,
        limit,
        offset: (page - 1) * limit,
        showTodayFollowUps: showTodayFollowUps || undefined,
        followUpDate: today
      });
      if (res.success) {
        setSessions(res.sessions || []);
        setSummary(res.summary || null);
        setTotalCount(res.totalCount || 0);
      } else {
        toast.error("Failed to load sessions");
      }
    } catch {
      toast.error("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, sourceFilter, outcomeFilter, counselorFilter, bookedByFilter, debouncedSearch, page, limit, showTodayFollowUps, today]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleExportCSV = () => {
    if (!sessions.length) return toast.error("No sessions to export");
    const headers = ["Date", "Student", "Phone", "Taken By", "Booked By", "Age/Class", "Course", "Source", "Outcome", "Next Follow-up", "Notes"];
    const csvContent = [
      headers.join(","),
      ...sessions.map(s => [
        s.sessionDate,
        `"${s.studentName?.replace(/"/g, '""') || ""}"`,
        s.phone || "",
        `"${s.counselorName || ""}"`,
        `"${s.bookedByName || ""}"`,
        `"${s.ageOrClass || ""}"`,
        `"${s.courseInterest || ""}"`,
        s.source,
        s.outcome,
        s.nextFollowUpDate || "",
        `"${(s.notes || "").replace(/"/g, '""').replace(/\n/g, " ")}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `counselling_sessions_${today}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.studentName.trim()) {
      toast.error("Student name is required");
      return;
    }
    setSubmitting(true);
    try {
      let uploadedImageKey = null;

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await fetch("/api/counselling-sessions/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          uploadedImageKey = uploadData.imageKey;
        } else {
          toast.error(uploadData.message || "Failed to upload image");
          setSubmitting(false);
          return;
        }
      }

      const res = await createCounsellingSession({ ...form, imageKey: uploadedImageKey });
      if (res.success) {
        toast.success("Session logged!");
        setShowForm(false);
        setForm({ studentName: "", phone: "", ageOrClass: "", courseInterest: "", source: "walk_in", outcome: "follow_up", notes: "", sessionDate: today, nextFollowUpDate: "", counselorId: "", bookedById: "" });
        setImageFile(null);
        setImagePreview(null);
        fetchSessions();
      } else {
        toast.error(res.message || "Failed to create session");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this session entry?")) return;
    try {
      const res = await deleteCounsellingSession(id);
      if (res.success) {
        toast.success("Session deleted");
        fetchSessions();
      } else {
        toast.error(res.message || "Failed to delete");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const openEdit = (s) => {
    setEditingSession(s);
    setEditForm({
      studentName: s.studentName || "",
      phone: s.phone || "",
      ageOrClass: s.ageOrClass || "",
      courseInterest: s.courseInterest || "",
      source: s.source || "walk_in",
      outcome: s.outcome || "follow_up",
      notes: s.notes || "",
      sessionDate: s.sessionDate || today,
      nextFollowUpDate: s.nextFollowUpDate || "",
      counselorId: s.counselorId || "",
      bookedById: s.bookedById || "",
      imageKey: s.imageKey || "",
    });
    setEditImageFile(null);
    setEditImagePreview(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.studentName.trim()) {
      toast.error("Student name is required");
      return;
    }
    setEditSaving(true);
    try {
      let imageKey = editForm.imageKey;
      if (editImageFile) {
        const formData = new FormData();
        formData.append("file", editImageFile);
        const uploadRes = await fetch("/api/counselling-sessions/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadData.success) {
          toast.error(uploadData.message || "Failed to upload image");
          return;
        }
        imageKey = uploadData.imageKey;
      }

      const res = await updateCounsellingSession(editingSession.id, { ...editForm, imageKey });
      if (res.success) {
        toast.success("Session updated");
        setEditingSession(null);
        setEditForm(null);
        setEditImageFile(null);
        setEditImagePreview(null);
        fetchSessions();
      } else {
        toast.error(res.message || "Failed to update session");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setEditSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-none mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Counselling Sessions</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isAdmin ? "View all counselors' sessions" : "Log your daily counselling sessions"}
          </p>
        </div>
        <div className="flex flex-row items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
          <button
            onClick={handleExportCSV}
            className="flex-1 sm:flex-none h-11 sm:h-10 px-4 inline-flex items-center justify-center gap-2 text-sm font-semibold rounded-lg text-muted-foreground border border-border hover:text-foreground hover:bg-muted transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex-1 sm:flex-none h-11 sm:h-10 px-4 inline-flex items-center justify-center gap-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Session
          </button>
        </div>
      </div>

      {/* New Session Drawer */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowForm(false)}
          />
          <div className="relative w-full max-w-md h-full bg-card shadow-2xl border-l border-border/50 flex flex-col animate-in slide-in-from-right duration-300 z-10">
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              <div className="flex items-center justify-between p-5 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg leading-tight">Log a Counselling Session</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      New session entry
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <div>
                  <label className="text-xs font-medium block mb-1">Student Name *</label>
                  <input className="input w-full" value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} placeholder="e.g., Amit Sharma" />
                </div>
                {isAdmin && (
                  <div>
                    <label className="text-xs font-medium block mb-1">Taken By (BDA/Counselor)</label>
                    <select className="input w-full" value={form.counselorId} onChange={(e) => setForm({ ...form, counselorId: e.target.value })}>
                      <option value="">Assign to myself (Default)</option>
                      {counselors.map((c) => (
                        <option key={c.id} value={c.id}>{c.name} ({c.role})</option>
                      ))}
                    </select>
                  </div>
                )}
                {isAdmin && (
                  <div>
                    <label className="text-xs font-medium block mb-1">Booked By (BDA)</label>
                    <select className="input w-full" value={form.bookedById} onChange={(e) => setForm({ ...form, bookedById: e.target.value })}>
                      <option value="">Defaults to me</option>
                      {counselors.map((c) => (
                        <option key={c.id} value={c.id}>{c.name} ({c.role})</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-xs font-medium block mb-1">Phone</label>
                    <input className="input w-full" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="9876543210" />
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1">Age / Class</label>
                    <input className="input w-full" value={form.ageOrClass} onChange={(e) => setForm({ ...form, ageOrClass: e.target.value })} placeholder="16 / 12th" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">Course Interest</label>
                  <select 
                    className="input w-full" 
                    value={form.courseInterest} 
                    onChange={(e) => setForm({ ...form, courseInterest: e.target.value })}
                  >
                    <option value="">Select a Batch/Course</option>
                    {Array.from(new Set(batches.filter(b => b.status === "active").map(b => b.courseName))).map(courseName => (
                      <optgroup key={courseName} label={courseName}>
                        {batches
                          .filter(b => b.status === "active" && b.courseName === courseName)
                          .map(b => (
                            <option key={b.id} value={`${b.courseName} - ${b.name}`}>
                              {b.name}
                            </option>
                          ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-xs font-medium block mb-1">Source</label>
                    <select className="input w-full" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
                      <option value="walk_in">Walk-in</option>
                      <option value="phone">Phone</option>
                      <option value="referral">Referral</option>
                      <option value="qsp">QSP</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1">Outcome</label>
                    <select className="input w-full" value={form.outcome} onChange={(e) => setForm({ ...form, outcome: e.target.value })}>
                      <option value="follow_up">Follow-up</option>
                      <option value="session_booked">Session Booked</option>
                      <option value="enrolled">Enrolled</option>
                      <option value="not_interested">Not Interested</option>
                      <option value="no_response">No Response</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-xs font-medium block mb-1">Date</label>
                    <input type="date" className="input w-full" value={form.sessionDate} onChange={(e) => setForm({ ...form, sessionDate: e.target.value })} max={today} />
                  </div>
                  {form.outcome === "follow_up" && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                      <label className="text-xs font-medium block mb-1 text-amber-600 dark:text-amber-500">Next Follow-up</label>
                      <input type="date" className="input w-full border-amber-500/30 focus:border-amber-500/50" value={form.nextFollowUpDate} onChange={(e) => setForm({ ...form, nextFollowUpDate: e.target.value })} min={today} />
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">Notes</label>
                  <textarea className="input w-full min-h-[80px]" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Any additional notes..." />
                </div>

                <div>
                  <label className="text-xs font-medium block mb-1">Attachment (Image/Receipt)</label>
                  <div className="flex items-center gap-4">
                    {imagePreview ? (
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-border shrink-0">
                        <img src={imagePreview} alt="Preview" className="object-cover w-full h-full" />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                          className="absolute top-1 right-1 bg-black/50 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/30 transition-colors shrink-0">
                        <UploadCloud className="w-5 h-5 text-muted-foreground mb-1" />
                        <span className="text-[10px] text-muted-foreground font-medium">Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setImageFile(file);
                              setImagePreview(URL.createObjectURL(file));
                            }
                          }}
                        />
                      </label>
                    )}
                    <div className="text-xs text-muted-foreground flex-1">
                      Upload any relevant image or document screenshot for this counselling session.
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-border/50 bg-card shrink-0 space-y-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Log Session
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="w-full py-2.5 bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold text-sm rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Overview */}
      {summary && summary.total > 0 && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:gap-5 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard label="Total Sessions" value={summary.total} icon={CalendarCheck} />
            <KpiCard label="Follow-ups" value={summary.byOutcome?.follow_up || 0} icon={Clock} />
            <KpiCard label="Session Booked" value={summary.byOutcome?.session_booked || 0} icon={UserCheck} />
            <KpiCard label="Enrolled" value={summary.byOutcome?.enrolled || 0} icon={GraduationCap} />
          </div>
          <div className="card sm:p-4 sm:space-y-3 divide-y divide-border/50 sm:divide-y-0 overflow-hidden sm:overflow-visible">
            <div className="flex items-center sm:items-start sm:flex-wrap px-3 py-3 sm:p-0 bg-muted/20 sm:bg-transparent">
              <span className="text-xs sm:text-sm uppercase sm:normal-case tracking-wider sm:tracking-normal font-semibold sm:font-medium text-muted-foreground w-20 sm:w-16 shrink-0 sm:mt-1.5">Source</span>
              <div className="flex-1 overflow-x-auto sm:overflow-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="flex sm:flex-wrap items-center gap-2 w-max sm:w-auto pr-4 sm:pr-0">
                  {["walk_in", "phone", "referral", "qsp"].map((key) => (
                    <FilterChip
                      key={key}
                      label={key.replace("_", " ")}
                      count={summary.bySource?.[key] || 0}
                      active={sourceFilter === key}
                      onClick={() => setSourceFilter(sourceFilter === key ? "" : key)}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center sm:items-start sm:flex-wrap px-3 py-3 sm:p-0 bg-muted/20 sm:bg-transparent">
              <span className="text-xs sm:text-sm uppercase sm:normal-case tracking-wider sm:tracking-normal font-semibold sm:font-medium text-muted-foreground w-20 sm:w-16 shrink-0 sm:mt-1.5">Outcome</span>
              <div className="flex-1 overflow-x-auto sm:overflow-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="flex sm:flex-wrap items-center gap-2 w-max sm:w-auto pr-4 sm:pr-0">
                  {["follow_up", "session_booked", "enrolled", "not_interested", "no_response"].map((key) => (
                    <FilterChip
                      key={key}
                      label={key.replace("_", " ")}
                      count={summary.byOutcome?.[key] || 0}
                      active={outcomeFilter === key}
                      onClick={() => setOutcomeFilter(outcomeFilter === key ? "" : key)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col xl:flex-row gap-2.5">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search name or phone..."
              className="input h-10 py-0 pl-9 pr-3 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowTodayFollowUps(!showTodayFollowUps)}
            className={`h-10 px-3 sm:px-4 inline-flex items-center justify-center gap-2 text-sm font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 shadow-sm ${showTodayFollowUps ? 'bg-amber-500 text-white border-amber-500' : 'text-muted-foreground border-border hover:text-foreground hover:bg-muted bg-card'}`}
          >
            <Bell className="w-4 h-4" /> <span className="hidden sm:inline">Follow-ups</span>
          </button>
        </div>
        
        <div className="grid grid-cols-2 xl:flex items-center gap-2 xl:w-auto">
          <div className="relative">
            <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input type="date" className="input h-10 py-0 pl-8 pr-2 w-full xl:w-[130px] text-[13px] sm:text-sm" value={startDate} onChange={(e) => setStartDate(e.target.value)} max={today} />
          </div>
          <div className="relative">
            <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input type="date" className="input h-10 py-0 pl-8 pr-2 w-full xl:w-[130px] text-[13px] sm:text-sm" value={endDate} onChange={(e) => setEndDate(e.target.value)} max={today} />
          </div>
          {isAdmin && (
            <>
              <select className="input h-10 py-0 w-full xl:w-40 text-[13px] sm:text-sm" value={counselorFilter} onChange={(e) => setCounselorFilter(e.target.value)}>
                <option value="">All counselors</option>
                {counselors.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select className="input h-10 py-0 w-full xl:w-40 text-[13px] sm:text-sm" value={bookedByFilter} onChange={(e) => setBookedByFilter(e.target.value)}>
                <option value="">All booked by</option>
                {counselors.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </>
          )}
        </div>
      </div>

      {/* Sessions table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/3 bg-muted rounded" />
                  <div className="h-2.5 w-1/2 bg-muted rounded" />
                </div>
                <div className="h-5 w-16 bg-muted rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border border-dashed rounded-xl">
          <div className="p-4 rounded-xl bg-muted/40 mb-3">
            <MessageSquare className="w-8 h-8 opacity-50" />
          </div>
          <p className="font-medium">No counselling sessions found</p>
          <p className="text-sm mt-1">Log your first session to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Mobile Card View (Hidden on sm and larger) */}
          <div className="grid grid-cols-1 gap-3 sm:hidden">
            {sessions.map((s) => (
              <div key={s.id} className="bg-card border border-border/60 rounded-xl p-4 flex flex-col relative overflow-hidden shadow-sm">
                 <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm shrink-0">
                        {getInitials(s.studentName)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-foreground text-[16px] truncate leading-tight">{s.studentName}</h4>
                        <div className="mt-1.5">
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground whitespace-nowrap">
                            <span className={`w-1.5 h-1.5 rounded-full ${OUTCOME_DOT[s.outcome] || "bg-muted-foreground"}`} />
                            {s.outcome?.replace("_", " ") || "—"}
                          </span>
                        </div>
                        {s.courseInterest && (
                          <div className="text-xs text-muted-foreground mt-1.5 leading-relaxed pr-2">
                            {s.courseInterest}
                          </div>
                        )}
                      </div>
                    </div>
                    {canEdit && (
                      <div className="flex items-center shrink-0 -mr-2 -mt-1">
                        <button onClick={() => openEdit(s)} className="p-2 text-muted-foreground hover:text-foreground transition-colors"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(s.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    )}
                 </div>

                 <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-sm text-muted-foreground">
                   {s.phone && (
                     <span className="flex items-center gap-1.5 font-medium text-foreground">
                       <Phone className="w-3.5 h-3.5 text-muted-foreground" /> {s.phone}
                     </span>
                   )}
                   <span className="flex items-center gap-1.5">
                     <Calendar className="w-3.5 h-3.5" /> {s.sessionDate}
                   </span>
                 </div>
                 
                 {s.nextFollowUpDate === today && (
                   <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-500/10 w-max px-2 py-1 rounded-md border border-amber-500/20">
                     <Bell className="w-3.5 h-3.5 animate-pulse" /> Follow-up Due Today
                   </div>
                 )}

                 <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
                    <button
                      onClick={() => setSelectedSession(s)}
                      className="flex-1 h-9 inline-flex items-center justify-center gap-1.5 text-xs font-semibold rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> Details
                    </button>
                    {s.phone && (
                      <div className="flex items-center gap-2">
                        <a href={`tel:${s.phone}`} title="Call" className="w-10 h-9 inline-flex items-center justify-center rounded-lg text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors">
                          <Phone className="w-4 h-4" />
                        </a>
                        <a href={`https://wa.me/${s.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" title="WhatsApp" className="w-10 h-9 inline-flex items-center justify-center rounded-lg text-green-700 dark:text-green-400 bg-green-500/10 hover:bg-green-500/20 transition-colors">
                          <WhatsAppIcon className="w-4 h-4" />
                        </a>
                      </div>
                    )}
                 </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View (Hidden on screens smaller than sm) */}
          <div className="hidden sm:block bg-card border border-border rounded-xl overflow-hidden">
          <div className="w-full">
            <table className="w-full text-sm table-fixed">
              <thead>
                <tr className="border-b border-border">
                  {isAdmin && <th className="text-left p-3 text-xs font-medium text-muted-foreground w-[10%]">Counselor</th>}
                  {isAdmin && <th className="text-left p-3 text-xs font-medium text-muted-foreground w-[10%]">Booked by</th>}
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground w-[20%]">Student</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground w-[11%]">Phone</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground w-[8%]">Source</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground w-[10%]">Outcome</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground w-[6%]">Attachment</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground w-[8%]">Date</th>
                  <th className="text-right p-3 text-xs font-medium text-muted-foreground w-[17%]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
                    {isAdmin && (
                      <td className="p-3">
                        <span className="font-medium text-foreground truncate block">{s.counselorName}</span>
                      </td>
                    )}
                    {isAdmin && (
                      <td className="p-3">
                        {s.bookedByName ? (
                          <span className="text-muted-foreground truncate block">{s.bookedByName}</span>
                        ) : (
                          <span className="text-muted-foreground/50">—</span>
                        )}
                      </td>
                    )}
                    <td className="p-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-muted text-foreground font-medium text-xs flex items-center justify-center shrink-0">
                          {getInitials(s.studentName)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-foreground truncate">{s.studentName}</div>
                          {s.courseInterest && <div className="text-xs text-muted-foreground truncate">{s.courseInterest}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      {s.phone ? (
                        <span className="text-foreground">{s.phone}</span>
                      ) : "—"}
                    </td>
                    <td className="p-3">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${SOURCE_DOT[s.source] || "bg-muted-foreground"}`} />
                        <span className="capitalize">{s.source?.replace("_", " ") || "—"}</span>
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="flex items-center gap-1.5 text-foreground">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${OUTCOME_DOT[s.outcome] || "bg-muted-foreground"}`} />
                        <span className="capitalize truncate">{s.outcome?.replace("_", " ") || "—"}</span>
                      </span>
                    </td>
                    <td className="p-3">
                      {s.imageKey ? (
                        <a href={`/files/${s.imageKey}`} target="_blank" rel="noreferrer" className="block relative w-8 h-8 rounded-md overflow-hidden border border-border hover:opacity-80 transition-opacity">
                          <img src={`/files/${s.imageKey}`} alt="Attachment" className="object-cover w-full h-full" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="p-3 text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        {s.sessionDate}
                        {s.nextFollowUpDate === today && (
                          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-500/15 text-amber-600" title="Follow-up due today">
                            <Bell className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1">
                        {s.phone && (
                          <>
                            <a href={`tel:${s.phone}`} title="Call" className="h-8 w-8 inline-flex items-center justify-center rounded-md text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors">
                              <Phone className="w-4 h-4" />
                            </a>
                            <a href={`https://wa.me/${s.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" title="WhatsApp" className="h-8 w-8 inline-flex items-center justify-center rounded-md text-green-700 dark:text-green-400 bg-green-500/10 hover:bg-green-500/20 transition-colors">
                              <WhatsAppIcon className="w-4 h-4" />
                            </a>
                          </>
                        )}
                        <button
                          onClick={() => setSelectedSession(s)}
                          className="h-8 w-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {canEdit && (
                          <button
                            onClick={() => openEdit(s)}
                            className="h-8 w-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            title="Edit Session"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}
                        {canEdit && (
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="h-8 w-8 inline-flex items-center justify-center rounded-md text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-colors"
                            title="Delete Session"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
          
          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 bg-card border border-border rounded-xl text-xs sm:text-sm text-muted-foreground">
            <div className="font-medium text-center sm:text-left">
              Showing {sessions.length} of {totalCount} session{totalCount !== 1 ? "s" : ""}
            </div>
            <div className="flex items-center gap-1.5 bg-muted/40 p-1 rounded-lg">
              <button 
                disabled={page === 1} 
                onClick={() => setPage(p => p - 1)}
                className="p-2 sm:p-1.5 rounded-md hover:bg-card disabled:opacity-50 transition-colors flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <span className="font-semibold px-3 sm:px-2">Page {page} of {Math.max(1, Math.ceil(totalCount / limit))}</span>
              <button 
                disabled={page >= Math.ceil(totalCount / limit)} 
                onClick={() => setPage(p => p + 1)}
                className="p-2 sm:p-1.5 rounded-md hover:bg-card disabled:opacity-50 transition-colors flex items-center justify-center"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Session Details Drawer */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setSelectedSession(null)}
          />
          
          {/* Sliding Panel */}
          <div className="relative w-full max-w-md h-full bg-card shadow-2xl border-l border-border/50 flex flex-col animate-in slide-in-from-right duration-300 z-10">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border/50">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-muted text-foreground font-medium text-sm flex items-center justify-center shrink-0">
                  {getInitials(selectedSession.studentName)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-lg leading-tight truncate">{selectedSession.studentName}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Logged on {selectedSession.sessionDate}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSession(null)}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* Status Badges */}
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <span className={`w-2 h-2 rounded-full ${SOURCE_DOT[selectedSession.source] || "bg-muted-foreground"}`} />
                  {selectedSession.source?.replace("_", " ") || "No Source"}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-foreground">
                  <span className={`w-2 h-2 rounded-full ${OUTCOME_DOT[selectedSession.outcome] || "bg-muted-foreground"}`} />
                  {selectedSession.outcome?.replace("_", " ") || "No Outcome"}
                </span>
              </div>

              {/* Data Grid */}
              <div className="border border-border rounded-xl divide-y divide-border/60">
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Phone className="w-3 h-3" /> Phone
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{selectedSession.phone || "Not provided"}</span>
                    {selectedSession.phone && (
                      <>
                        <a href={`tel:${selectedSession.phone}`} className="h-7 px-2 inline-flex items-center gap-1 rounded-md bg-green-500/10 text-green-700 hover:bg-green-500/20 transition-colors text-xs font-medium">
                          <Phone className="w-3 h-3" /> Call
                        </a>
                        <a href={`https://wa.me/${selectedSession.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="h-7 px-2 inline-flex items-center gap-1 rounded-md bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 transition-colors text-xs font-medium">
                          <MessageSquare className="w-3 h-3" /> Chat
                        </a>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <GraduationCap className="w-3 h-3" /> Age / Class
                  </span>
                  <span className="font-medium text-sm">{selectedSession.ageOrClass || "Not provided"}</span>
                </div>
                {selectedSession.counselorName && (
                  <div className="flex items-center justify-between gap-3 px-4 py-3">
                    <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <User className="w-3 h-3" /> Taken By
                    </span>
                    <span className="font-medium text-sm">{selectedSession.counselorName}</span>
                  </div>
                )}
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <User className="w-3 h-3" /> Booked By
                  </span>
                  <span className="font-medium text-sm">{selectedSession.bookedByName || "Not specified"}</span>
                </div>
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3" /> Course Interest
                  </span>
                  <span className="font-medium text-sm text-right">{selectedSession.courseInterest || "Not provided"}</span>
                </div>
              </div>

              {/* Notes Section */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 px-1">
                  <FileText className="w-3.5 h-3.5" /> Counselor Notes
                </div>
                <div className="border border-border rounded-xl p-4 min-h-[100px]">
                  {selectedSession.notes ? (
                    <p className="text-sm whitespace-pre-wrap leading-relaxed text-foreground/90">{selectedSession.notes}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic flex items-center gap-2">
                      No notes recorded.
                    </p>
                  )}
                </div>
              </div>

              {/* Attachment Section */}
              {selectedSession.imageKey && (
                <div className="space-y-2 pb-6">
                  <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 px-1">
                    <ImageIcon className="w-3.5 h-3.5" /> Attachment / Receipt
                  </div>
                  <div className="rounded-xl overflow-hidden border border-border bg-muted/20 group relative">
                    <img 
                      src={`/files/${selectedSession.imageKey}`} 
                      alt="Attachment" 
                      className="w-full h-auto object-cover max-h-[300px] transition-transform duration-500 group-hover:scale-105"
                    />
                    <a 
                      href={`/files/${selectedSession.imageKey}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                    >
                      <span className="bg-white/90 text-black px-4 py-2 rounded-lg text-xs font-bold shadow-lg">View Full Image</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="p-5 border-t border-border/50 bg-card shrink-0">
              <button
                onClick={() => setSelectedSession(null)}
                className="w-full py-2.5 bg-primary/10 text-primary hover:bg-primary/20 font-semibold text-sm rounded-xl transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Session Drawer */}
      {editingSession && editForm && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => { setEditingSession(null); setEditForm(null); }}
          />

          <div className="relative w-full max-w-md h-full bg-card shadow-2xl border-l border-border/50 flex flex-col animate-in slide-in-from-right duration-300 z-10">
            <form onSubmit={handleEditSubmit} className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Pencil className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg leading-tight">Edit Session</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Admin correction
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { setEditingSession(null); setEditForm(null); }}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <div>
                  <label className="text-xs font-medium block mb-1">Student Name *</label>
                  <input className="input w-full" value={editForm.studentName} onChange={(e) => setEditForm({ ...editForm, studentName: e.target.value })} />
                </div>
                {canEdit && (
                  <div>
                    <label className="text-xs font-medium block mb-1">Taken By (BDA/Counselor)</label>
                    <select className="input w-full" value={editForm.counselorId} onChange={(e) => setEditForm({ ...editForm, counselorId: e.target.value })}>
                      {editForm.counselorId && !counselors.some((c) => c.id === editForm.counselorId) && (
                        <option value={editForm.counselorId}>{editingSession.counselorName || "Unassigned counselor"}</option>
                      )}
                      {counselors.map((c) => (
                        <option key={c.id} value={c.id}>{c.name} ({c.role})</option>
                      ))}
                    </select>
                  </div>
                )}
                {canEdit && (
                  <div>
                    <label className="text-xs font-medium block mb-1">Booked By (BDA)</label>
                    <select className="input w-full" value={editForm.bookedById} onChange={(e) => setEditForm({ ...editForm, bookedById: e.target.value })}>
                      <option value="">Not specified / Walk-in</option>
                      {counselors.map((c) => (
                        <option key={c.id} value={c.id}>{c.name} ({c.role})</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="text-xs font-medium block mb-1">Phone</label>
                  <input className="input w-full" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">Age / Class</label>
                  <input className="input w-full" value={editForm.ageOrClass} onChange={(e) => setEditForm({ ...editForm, ageOrClass: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">Course Interest</label>
                  <select className="input w-full" value={editForm.courseInterest} onChange={(e) => setEditForm({ ...editForm, courseInterest: e.target.value })}>
                    <option value="">Select a Batch/Course</option>
                    {Array.from(new Set(batches.filter(b => b.status === "active").map(b => b.courseName))).map(courseName => (
                      <optgroup key={courseName} label={courseName}>
                        {batches
                          .filter(b => b.status === "active" && b.courseName === courseName)
                          .map(b => (
                            <option key={b.id} value={`${b.courseName} - ${b.name}`}>
                              {b.name}
                            </option>
                          ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium block mb-1">Source</label>
                    <select className="input w-full" value={editForm.source} onChange={(e) => setEditForm({ ...editForm, source: e.target.value })}>
                      <option value="walk_in">Walk-in</option>
                      <option value="phone">Phone</option>
                      <option value="referral">Referral</option>
                      <option value="qsp">QSP</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1">Outcome</label>
                    <select className="input w-full" value={editForm.outcome} onChange={(e) => setEditForm({ ...editForm, outcome: e.target.value })}>
                      <option value="follow_up">Follow-up</option>
                      <option value="session_booked">Session Booked</option>
                      <option value="enrolled">Enrolled</option>
                      <option value="not_interested">Not Interested</option>
                      <option value="no_response">No Response</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">Date</label>
                  <input type="date" className="input w-full" value={editForm.sessionDate} onChange={(e) => setEditForm({ ...editForm, sessionDate: e.target.value })} />
                </div>
                {editForm.outcome === "follow_up" && (
                  <div className="animate-in fade-in slide-in-from-top-2">
                    <label className="text-xs font-medium block mb-1 text-amber-600 dark:text-amber-500">Next Follow-up Date</label>
                    <input type="date" className="input w-full border-amber-500/30 focus:border-amber-500/50" value={editForm.nextFollowUpDate} onChange={(e) => setEditForm({ ...editForm, nextFollowUpDate: e.target.value })} />
                  </div>
                )}
                <div>
                  <label className="text-xs font-medium block mb-1">Notes</label>
                  <textarea className="input w-full min-h-[80px]" value={editForm.notes} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} />
                </div>

                <div>
                  <label className="text-xs font-medium block mb-1">Attachment (Image/Receipt)</label>
                  <div className="flex items-center gap-4">
                    {editImageFile ? (
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
                        <img src={editImagePreview} alt="Preview" className="object-cover w-full h-full" />
                        <button
                          type="button"
                          onClick={() => { setEditImageFile(null); setEditImagePreview(null); }}
                          className="absolute top-1 right-1 bg-black/50 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : editForm.imageKey ? (
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
                        <img src={`/files/${editForm.imageKey}`} alt="Current" className="object-cover w-full h-full" />
                        <button
                          type="button"
                          onClick={() => setEditForm({ ...editForm, imageKey: "" })}
                          className="absolute top-1 right-1 bg-black/50 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/30 transition-colors">
                        <UploadCloud className="w-5 h-5 text-muted-foreground mb-1" />
                        <span className="text-[10px] text-muted-foreground font-medium">Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setEditImageFile(file);
                              setEditImagePreview(URL.createObjectURL(file));
                            }
                          }}
                        />
                      </label>
                    )}
                    <div className="text-xs text-muted-foreground flex-1">
                      {editForm.imageKey || editImageFile
                        ? "Click the X on the image to remove it, or pick a new file to replace it."
                        : "Upload or replace the attachment for this session."}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-5 border-t border-border/50 bg-card shrink-0 space-y-2">
                <button
                  type="submit"
                  disabled={editSaving}
                  className="w-full py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {editSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => { setEditingSession(null); setEditForm(null); }}
                  className="w-full py-2.5 bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold text-sm rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
