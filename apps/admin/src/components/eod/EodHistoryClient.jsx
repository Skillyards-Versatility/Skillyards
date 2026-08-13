"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Calendar, Users, FileText, Clock, CheckCircle2, Filter, Send, Mail, Loader2, AlertCircle, X } from "lucide-react";
import { getEodHistory, triggerEodEmails } from "@/actions/eod";
import { formatIstDate, getIstDate } from "@/lib/ist";
import { DatePresetSelector } from "./DatePresetSelector";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

const TEAM_LABELS = {
  sales: "Sales",
  tech: "Tech",
  hr: "HR",
  ceo_office: "CEO Office",
  admin_head: "Admin Head",
  marketing: "Marketing",
  outside_sales: "Outside Sales",
};

const TEAM_OPTIONS = [
  { value: "", label: "All Teams" },
  { value: "sales", label: "Sales" },
  { value: "tech", label: "Tech" },
  { value: "hr", label: "HR" },
  { value: "ceo_office", label: "CEO Office" },
  { value: "admin_head", label: "Admin Head" },
  { value: "marketing", label: "Marketing" },
  { value: "outside_sales", label: "Outside Sales" },
];

export function EodHistoryClient({ isAdmin = false, isManager = false, settings = {} }) {
  const [reports, setReports] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teamFilter, setTeamFilter] = useState("");
  const [startDate, setStartDate] = useState(getIstDate());
  const [endDate, setEndDate] = useState(getIstDate());
  const [triggering, setTriggering] = useState(null);
  const [sendingUserId, setSendingUserId] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  const emailsEnabled = settings?.emails_feature !== false;
  const eodEmailsEnabled = settings?.eod_emails_feature !== false;
  const canSendEmails = emailsEnabled && eodEmailsEnabled;

  const [confirmBulkEmail, setConfirmBulkEmail] = useState(null);
  const [confirmIndividualEmail, setConfirmIndividualEmail] = useState(null);

  const handleTriggerEmails = (targetDate) => {
    setConfirmBulkEmail(targetDate);
  };

  const executeTriggerEmails = async (targetDate) => {
    setTriggering(targetDate);
    try {
      const res = await triggerEodEmails({ date: targetDate });
      if (res.success) {
        toast.success(`Sent ${res.reportsSent} team reports and ${res.warningsSent} warnings. ${res.failed?.length ? `(${res.failed.length} failed)` : ""}`);
        fetchHistory();
      } else {
        toast.error(res.error || res.message || "Failed to send emails");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setTriggering(null);
    }
  };

  const handleSendIndividual = (userId, userName, date, type = "warning") => {
    setConfirmIndividualEmail({ userId, userName, date, type });
  };

  const executeSendIndividual = async ({ userId, userName, date, type }) => {
    setSendingUserId(userId);
    try {
      const res = await triggerEodEmails({ date, userId });
      if (res.success) {
        if (type === "warning" && res.warningsSent > 0) {
          toast.success(`Warning email sent to ${userName}.`);
        } else if (type === "warning" && res.warningsSkipped > 0) {
          toast.info(`Warning already sent to ${userName} for this date.`);
        } else if (type === "report" && res.reportsSent > 0) {
          toast.success(`Team report re-triggered for ${userName}'s team.`);
        } else {
          toast.info(`Action successful for ${userName}.`);
        }
        fetchHistory();
      } else {
        toast.error(res.error || res.message || "Failed to send email");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setSendingUserId(null);
    }
  };

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await getEodHistory({ startDate, endDate, team: teamFilter || undefined });
      if (res.success) {
        setReports(res.reports);
        if (res.activeUsers) setActiveUsers(res.activeUsers);
      } else {
        toast.error("Failed to load history");
      }
    } catch {
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [teamFilter, startDate, endDate]);

  // Group reports by date
  const grouped = {};
  for (const r of reports) {
    if (!grouped[r.date]) grouped[r.date] = [];
    grouped[r.date].push(r);
  }

  // Generate all dates between startDate and endDate
  const dates = [];
  if (startDate && endDate) {
    let curr = new Date(startDate);
    const end = new Date(endDate);
    while (curr <= end) {
      dates.push(curr.toISOString().split("T")[0]);
      curr.setDate(curr.getDate() + 1);
    }
    dates.reverse();
  }

  // Helper to compute missing users for a specific date
  const getMissingUsers = (date, submittedReports = []) => {
    if (!isAdmin && !isManager) return [];
    const d = new Date(date);
    if (d.getDay() === 0) return []; // No EOD on Sundays

    let relevantUsers = activeUsers.filter(u => u.team);
    if (teamFilter) {
      relevantUsers = relevantUsers.filter(u => u.team === teamFilter);
    }

    const submittedUserIds = new Set(submittedReports.map(r => r.userId));
    return relevantUsers.filter(u => !submittedUserIds.has(u.id));
  };

  const teamColor = (team) => {
    const colors = {
      sales: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/50",
      tech: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800/50",
      hr: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400 border-pink-200 dark:border-pink-800/50",
      ceo_office: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/50",
      admin_head: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700",
      marketing: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50",
      outside_sales: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800/50",
    };
    return colors[team] || "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700";
  };

  // Filter dates to only those that have either reports or missing users
  const activeDates = dates.filter(date => {
    const dateReports = grouped[date] || [];
    const missing = getMissingUsers(date, dateReports);
    return dateReports.length > 0 || missing.length > 0;
  });

  return (
    <div className="space-y-10 pb-12 max-w-6xl mx-auto">
      {/* Sleek Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/50">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">EOD History</h2>
          <p className="text-sm text-muted-foreground mt-1">Review past submissions and trigger reminder emails.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <DatePresetSelector
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
          
          {isAdmin && (
            <div className="relative shrink-0">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <select
                className="w-full sm:w-auto bg-background border border-border/60 text-xs font-semibold rounded-2xl focus:ring-1 focus:ring-primary pl-9 pr-8 py-2 appearance-none shadow-2xs cursor-pointer min-w-[130px]"
                value={teamFilter}
                onChange={(e) => setTeamFilter(e.target.value)}
              >
                {TEAM_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}

          {canSendEmails && (isAdmin || isManager) && (
            <button 
              onClick={() => handleTriggerEmails(endDate)} 
              disabled={!!triggering}
              className="bg-primary text-primary-foreground text-xs font-bold py-2.5 px-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-xs disabled:opacity-70 disabled:cursor-not-allowed shrink-0 cursor-pointer"
            >
              {triggering === endDate ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Send Bulk Emails
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p className="text-sm">Loading history...</p>
        </div>
      ) : activeDates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground border border-dashed rounded-lg bg-slate-50/50 dark:bg-slate-900/20">
          <FileText className="h-12 w-12 mb-4 text-slate-300 dark:text-slate-700" />
          <p className="text-base font-medium">No reports or pending submissions found.</p>
          <p className="text-sm mt-1">Try adjusting your date range filters.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {activeDates.map((date) => {
            const dateReports = grouped[date] || [];
            const missingUsers = getMissingUsers(date, dateReports);
            
            return (
              <div key={date} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <h3 className="text-lg font-medium tracking-tight whitespace-nowrap">
                    {formatIstDate(date)}
                  </h3>
                  {(canSendEmails && (isAdmin || isManager)) && (
                    <button 
                      onClick={() => handleTriggerEmails(date)}
                      disabled={triggering === date}
                      className="bg-primary/10 text-primary hover:bg-primary/20 text-xs font-medium py-1 px-2.5 rounded flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      {triggering === date ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                      Trigger Mails
                    </button>
                  )}
                  <div className="h-px bg-border/60 flex-1"></div>
                </div>
                
                {missingUsers.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                      <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Pending Submissions <span className="text-muted-foreground">({missingUsers.length})</span>
                      </h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {missingUsers.map(u => (
                        <div key={u.id} className="group flex items-center justify-between bg-background border border-border/60 hover:border-border rounded-md px-4 py-3 shadow-sm transition-colors">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-medium text-xs border border-border/50 shrink-0 overflow-hidden">
                              {u.profileImageKey ? (
                                <img src={`/files/${u.profileImageKey}`} alt={u.name} className="h-full w-full object-cover" />
                              ) : (
                                (u.name || "U").charAt(0)
                              )}
                            </div>
                            <div className="flex flex-col overflow-hidden">
                              <span className="text-sm font-medium truncate">{u.name}</span>
                              <span className="text-xs text-muted-foreground">{TEAM_LABELS[u.team] || u.team}</span>
                            </div>
                          </div>
                          {canSendEmails && (isAdmin || isManager) && (
                            <button
                              onClick={() => handleSendIndividual(u.id, u.name, date, "warning")}
                              disabled={sendingUserId === u.id}
                              className="text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                              title={`Send reminder to ${u.name}`}
                            >
                              {sendingUserId === u.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Mail className="h-4 w-4" />
                              )}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    Submitted Reports <span className="text-muted-foreground">({dateReports.length})</span>
                  </h4>
                  
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {dateReports.map((report) => (
                      <div key={report.id} className="flex flex-col bg-background border border-border/60 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all group">
                        <div 
                          className="p-4 sm:p-5 flex-1 cursor-pointer"
                          onClick={() => setSelectedReport(report)}
                        >
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-medium text-sm border border-border/50 overflow-hidden shrink-0">
                                {report.profileImageKey ? (
                                  <img src={`/files/${report.profileImageKey}`} alt={report.userName} className="h-full w-full object-cover" />
                                ) : (
                                  (report.userName || "U").charAt(0)
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-sm">{report.userName}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">{TEAM_LABELS[report.team] || report.team}</div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end gap-2 shrink-0">
                              {new Date(report.submittedAt).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }) > report.date && (
                                <span className="inline-flex items-center bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  Late
                                </span>
                              )}
                              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                <Clock className="h-3 w-3" />
                                {new Date(report.submittedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" })}
                              </span>
                              
                              {report.emailedAt ? (
                                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  Emailed
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 text-xs font-medium">
                                  <Clock className="h-3.5 w-3.5" />
                                  Pending Email
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2 bg-slate-50/50 dark:bg-slate-900/30 rounded-md p-3 border border-border/40">
                            {Object.entries(report.data || {}).filter(([k, v]) => v && k !== "notes").slice(0, 6).map(([k, v]) => (
                              <div key={k} className="flex flex-col">
                                <span className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1 truncate">
                                  {k.replace(/([A-Z])/g, " $1")}
                                </span>
                                <span className="text-sm font-medium truncate" title={String(v)}>
                                  {v}
                                </span>
                              </div>
                            ))}
                          </div>
                          
                          {report.data?.notes && (
                            <div className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-background border-l-2 border-border pl-3 italic">
                              {report.data.notes}
                            </div>
                          )}
                        </div>

                        {canSendEmails && (isAdmin || isManager) && (
                          <div className="bg-slate-50 dark:bg-slate-900/50 px-4 py-3 border-t border-border/60 flex justify-end">
                            <button
                              onClick={() => handleSendIndividual(report.userId, report.userName, date, "report")}
                              disabled={sendingUserId === report.userId}
                              className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-foreground flex items-center gap-1.5 transition-colors disabled:opacity-50"
                            >
                              {sendingUserId === report.userId ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Send className="h-3.5 w-3.5" />
                              )}
                              Send Team Report
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setSelectedReport(null)}
          />
          <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-border bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-medium text-sm border border-border/50 overflow-hidden shrink-0">
                  {selectedReport.profileImageKey ? (
                    <img src={`/files/${selectedReport.profileImageKey}`} alt={selectedReport.userName} className="h-full w-full object-cover" />
                  ) : (
                    (selectedReport.userName || "U").charAt(0)
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground leading-tight">{selectedReport.userName}</h3>
                  <div className="text-sm text-muted-foreground mt-0.5 flex items-center gap-2">
                    <span>{TEAM_LABELS[selectedReport.team] || selectedReport.team}</span>
                    <span>•</span>
                    <span>{formatIstDate(selectedReport.date)}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedReport(null)}
                className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Object.entries(selectedReport.data || {}).filter(([k]) => k !== "notes").map(([k, v]) => (
                  <div key={k} className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-border/50 flex flex-col">
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1.5">
                      {k.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <span className="text-base font-semibold text-foreground whitespace-pre-wrap break-words">
                      {v || "-"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Notes */}
              {selectedReport.data?.notes && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground">Additional Notes</h4>
                  <div className="bg-muted/30 p-4 rounded-xl border border-border/50 text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {selectedReport.data.notes}
                  </div>
                </div>
              )}

              {/* Screenshot */}
              {selectedReport.screenshotKey && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground">Attached Screenshot</h4>
                  <div className="rounded-xl border border-border/50 overflow-hidden bg-muted/20">
                    <img 
                      src={`/files/${selectedReport.screenshotKey}`} 
                      alt="EOD Screenshot"
                      className="w-full h-auto object-contain max-h-[500px]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirm Bulk Emails */}
      {confirmBulkEmail && (
        <ConfirmDialog
          title="Send Bulk Emails"
          message={`Send bulk EOD emails for ${confirmBulkEmail}?`}
          confirmLabel="Send Emails"
          onConfirm={() => {
            executeTriggerEmails(confirmBulkEmail);
            setConfirmBulkEmail(null);
          }}
          onCancel={() => setConfirmBulkEmail(null)}
        />
      )}

      {/* Confirm Individual Email */}
      {confirmIndividualEmail && (
        <ConfirmDialog
          title="Send Email"
          message={`Send ${confirmIndividualEmail.type === "warning" ? "missing EOD warning" : "EOD team report"} for ${confirmIndividualEmail.userName} on ${formatIstDate(confirmIndividualEmail.date)}?`}
          confirmLabel="Send Email"
          onConfirm={() => {
            executeSendIndividual(confirmIndividualEmail);
            setConfirmIndividualEmail(null);
          }}
          onCancel={() => setConfirmIndividualEmail(null)}
        />
      )}
    </div>
  );
}
