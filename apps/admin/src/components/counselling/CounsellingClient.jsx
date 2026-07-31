"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Search, Filter, Phone, User, GraduationCap, BookOpen, MessageSquare, Calendar, X, ImageIcon, UploadCloud, Eye, FileText } from "lucide-react";
import { getCounsellingSessions, createCounsellingSession, deleteCounsellingSession } from "@/actions/counselling";
import { getIstDate } from "@/lib/ist";

const SOURCE_OPTIONS = [
  { value: "", label: "All Sources" },
  { value: "walk_in", label: "Walk-in" },
  { value: "phone", label: "Phone" },
  { value: "referral", label: "Referral" },
  { value: "qsp", label: "QSP" },
];

const OUTCOME_OPTIONS = [
  { value: "", label: "All Outcomes" },
  { value: "session_booked", label: "Session Booked" },
  { value: "enrolled", label: "Enrolled" },
  { value: "follow_up", label: "Follow-up" },
  { value: "not_interested", label: "Not Interested" },
  { value: "no_response", label: "No Response" },
];

const OUTCOME_BADGES = {
  session_booked: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  enrolled: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  follow_up: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  not_interested: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  no_response: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
};

const SOURCE_BADGES = {
  walk_in: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  phone: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  referral: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  qsp: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
};

export function CounsellingClient({ isAdmin = false, counselors = [], batches = [] }) {
  const today = getIstDate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);

  // Calculate 7 days ago for default start date
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return getIstDate(d);
  });

  const [endDate, setEndDate] = useState(today);
  const [sourceFilter, setSourceFilter] = useState("");
  const [outcomeFilter, setOutcomeFilter] = useState("");

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
    counselorId: "", // Empty string means it will default to logged-in user on backend
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // View details modal
  const [selectedSession, setSelectedSession] = useState(null);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCounsellingSessions({ startDate, endDate, source: sourceFilter || undefined, outcome: outcomeFilter || undefined });
      if (res.success) {
        setSessions(res.sessions || []);
        setSummary(res.summary || null);
      } else {
        toast.error("Failed to load sessions");
      }
    } catch {
      toast.error("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, sourceFilter, outcomeFilter]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

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
        setForm({ studentName: "", phone: "", ageOrClass: "", courseInterest: "", source: "walk_in", outcome: "follow_up", notes: "", sessionDate: today, counselorId: "" });
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

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Counselling Sessions
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {isAdmin ? "View all counselors' sessions" : "Log your daily counselling sessions"}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "New Session"}
        </button>
      </div>

      {/* Quick-add form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-border/60 rounded-2xl p-4 sm:p-5 space-y-4">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" />
            Log a Counselling Session
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium block mb-1">Student Name *</label>
              <input className="input w-full" value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} placeholder="e.g., Amit Sharma" />
            </div>
            {isAdmin && (
              <div>
                <label className="text-xs font-medium block mb-1">Assign to BDA/Counselor</label>
                <select className="input w-full" value={form.counselorId} onChange={(e) => setForm({ ...form, counselorId: e.target.value })}>
                  <option value="">Assign to myself (Default)</option>
                  {counselors.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.role})</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="text-xs font-medium block mb-1">Phone</label>
              <input className="input w-full" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="e.g., 9876543210" />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">Age / Class</label>
              <input className="input w-full" value={form.ageOrClass} onChange={(e) => setForm({ ...form, ageOrClass: e.target.value })} placeholder="e.g., 16 / 12th" />
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
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="text-xs font-medium block mb-1">Notes</label>
              <textarea className="input w-full min-h-[60px]" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Any additional notes..." />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">Date</label>
              <input type="date" className="input w-full" value={form.sessionDate} onChange={(e) => setForm({ ...form, sessionDate: e.target.value })} max={today} />
            </div>
            
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="text-xs font-medium block mb-1">Attachment (Image/Receipt)</label>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
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
          <div className="flex justify-end pt-2">
            <button type="submit" disabled={submitting} className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-xl text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Log Session
            </button>
          </div>
        </form>
      )}

      {/* Summary stats */}
      {summary && summary.total > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-card border border-border/60 rounded-xl p-3 text-center">
            <div className="text-xs text-muted-foreground uppercase font-bold">Total</div>
            <div className="text-xl font-extrabold text-foreground">{summary.total}</div>
          </div>
          {Object.entries(summary.bySource || {}).map(([key, count]) => (
            <div key={key} className="bg-card border border-border/60 rounded-xl p-3 text-center">
              <div className="text-xs text-muted-foreground uppercase font-bold capitalize">{key.replace("_", " ")}</div>
              <div className="text-xl font-extrabold text-foreground">{count}</div>
            </div>
          ))}
          {Object.entries(summary.byOutcome || {}).map(([key, count]) => (
            <div key={key} className="bg-card border border-border/60 rounded-xl p-3 text-center">
              <div className="text-xs text-muted-foreground uppercase font-bold capitalize">{key.replace("_", " ")}</div>
              <div className="text-xl font-extrabold text-foreground">{count}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-muted/30 p-3 rounded-2xl border border-border/60">
        <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
          <input type="date" className="input text-sm py-1.5 w-[140px]" value={startDate} onChange={(e) => setStartDate(e.target.value)} max={today} />
          <span className="text-xs text-muted-foreground">to</span>
          <input type="date" className="input text-sm py-1.5 w-[140px]" value={endDate} onChange={(e) => setEndDate(e.target.value)} max={today} />
        </div>
        <select className="input text-sm py-1.5" value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
          {SOURCE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select className="input text-sm py-1.5" value={outcomeFilter} onChange={(e) => setOutcomeFilter(e.target.value)}>
          {OUTCOME_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Sessions table */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin mr-3" />
          Loading sessions...
        </div>
      ) : sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border border-dashed rounded-2xl">
          <MessageSquare className="w-10 h-10 mb-3 opacity-40" />
          <p className="font-medium">No counselling sessions found</p>
          <p className="text-sm mt-1">Log your first session to get started.</p>
        </div>
      ) : (
        <div className="bg-card border border-border/60 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30">
                  {isAdmin && <th className="text-left p-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Counselor</th>}
                  <th className="text-left p-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Student</th>
                  <th className="text-left p-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Phone</th>
                  <th className="text-left p-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Source</th>
                  <th className="text-left p-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Outcome</th>
                  <th className="text-left p-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Attachment</th>
                  <th className="text-left p-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Date</th>
                  <th className="text-right p-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s.id} className="border-b border-border/40 hover:bg-muted/20 transition-colors">
                    {isAdmin && (
                      <td className="p-3">
                        <span className="font-medium text-foreground">{s.counselorName}</span>
                      </td>
                    )}
                    <td className="p-3">
                      <div className="font-medium text-foreground">{s.studentName}</div>
                      {s.courseInterest && <div className="text-[11px] text-muted-foreground">{s.courseInterest}</div>}
                    </td>
                    <td className="p-3 text-muted-foreground">{s.phone || "—"}</td>
                    <td className="p-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${SOURCE_BADGES[s.source] || ""}`}>
                        {s.source?.replace("_", " ") || "—"}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${OUTCOME_BADGES[s.outcome] || ""}`}>
                        {s.outcome?.replace("_", " ") || "—"}
                      </span>
                    </td>
                    <td className="p-3">
                      {s.imageKey ? (
                        <a href={`/files/${s.imageKey}`} target="_blank" rel="noreferrer" className="block relative w-8 h-8 rounded overflow-hidden border border-border hover:opacity-80 transition-opacity">
                          <img src={`/files/${s.imageKey}`} alt="Attachment" className="object-cover w-full h-full" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="p-3 text-muted-foreground">{s.sessionDate}</td>
                    <td className="p-3 text-right">
                        <button
                          onClick={() => setSelectedSession(s)}
                          className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 text-xs text-muted-foreground border-t border-border/40">
            {sessions.length} session{sessions.length !== 1 ? "s" : ""}
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
            <div className="flex items-center justify-between p-5 border-b border-border/50 bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-sm border border-primary/10">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg leading-tight">{selectedSession.studentName}</h3>
                  <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
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
            <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-gradient-to-b from-transparent to-muted/10">
              
              {/* Status Badges */}
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${SOURCE_BADGES[selectedSession.source] || "bg-muted text-muted-foreground border-border/50"}`}>
                  <Search className="w-3.5 h-3.5" /> {selectedSession.source?.replace("_", " ") || "No Source"}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${OUTCOME_BADGES[selectedSession.outcome] || "bg-muted text-muted-foreground border-border/50"}`}>
                  <MessageSquare className="w-3.5 h-3.5" /> {selectedSession.outcome?.replace("_", " ") || "No Outcome"}
                </span>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card p-4 rounded-xl border border-border/50 shadow-sm">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-primary/70" /> Phone
                  </div>
                  <div className="font-medium text-sm">{selectedSession.phone || "Not provided"}</div>
                </div>
                <div className="bg-card p-4 rounded-xl border border-border/50 shadow-sm">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <GraduationCap className="w-3 h-3 text-primary/70" /> Age / Class
                  </div>
                  <div className="font-medium text-sm">{selectedSession.ageOrClass || "Not provided"}</div>
                </div>
                <div className="col-span-2 bg-card p-4 rounded-xl border border-border/50 shadow-sm">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3 text-primary/70" /> Course Interest
                  </div>
                  <div className="font-medium text-sm">{selectedSession.courseInterest || "Not provided"}</div>
                </div>
              </div>

              {/* Notes Section */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 px-1">
                  <FileText className="w-3.5 h-3.5" /> Counselor Notes
                </div>
                <div className="bg-card p-4 rounded-xl border border-border/50 shadow-sm min-h-[100px]">
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
                  <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 px-1">
                    <ImageIcon className="w-3.5 h-3.5" /> Attachment / Receipt
                  </div>
                  <div className="rounded-xl overflow-hidden border border-border/50 bg-muted/20 shadow-sm group relative">
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
    </div>
  );
}
