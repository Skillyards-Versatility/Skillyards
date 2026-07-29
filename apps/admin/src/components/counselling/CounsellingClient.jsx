"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Search, Filter, Phone, User, GraduationCap, BookOpen, MessageSquare, Calendar, X } from "lucide-react";
import { getCounsellingSessions, createCounsellingSession, deleteCounsellingSession } from "@/actions/counselling";
import { getIstDate } from "@/lib/ist";

const SOURCE_OPTIONS = [
  { value: "", label: "All Sources" },
  { value: "walk_in", label: "Walk-in" },
  { value: "phone", label: "Phone" },
  { value: "referral", label: "Referral" },
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
};

export function CounsellingClient({ isAdmin = false }) {
  const today = getIstDate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);

  // Filters
  const [startDate, setStartDate] = useState(today);
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
  });

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
      const res = await createCounsellingSession(form);
      if (res.success) {
        toast.success("Session logged!");
        setShowForm(false);
        setForm({ studentName: "", phone: "", ageOrClass: "", courseInterest: "", source: "walk_in", outcome: "follow_up", notes: "", sessionDate: today });
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
              <input className="input w-full" value={form.courseInterest} onChange={(e) => setForm({ ...form, courseInterest: e.target.value })} placeholder="e.g., Full Stack" />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">Source</label>
              <select className="input w-full" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
                <option value="walk_in">Walk-in</option>
                <option value="phone">Phone</option>
                <option value="referral">Referral</option>
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
                    <td className="p-3 text-muted-foreground">{s.sessionDate}</td>
                    <td className="p-3 text-right">
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
    </div>
  );
}
