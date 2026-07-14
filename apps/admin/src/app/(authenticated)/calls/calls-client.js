"use client";

import { useState, useMemo } from "react";
import { 
  Search, Phone, PhoneCall, PhoneMissed, Play, Pause, Volume2, Clock, Calendar, User, FileAudio,
  Brain, CheckCircle2, XCircle, AlertCircle, X, MessageSquare, Sparkles, Loader2, ListChecks, ThumbsUp, ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import { API } from "@/lib/api";
import { refreshCall } from "@/actions/calls";

export function CallsClient({ initialCalls }) {
  const [calls, setCalls] = useState(initialCalls);
  const [searchInput, setSearchInput] = useState("");
  const [outcomeFilter, setOutcomeFilter] = useState("");
  const [activeCall, setActiveCall] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [auditingIds, setAuditingIds] = useState([]);

  const handleTriggerAudit = async (call) => {
    if (auditingIds.includes(call.id)) return;

    setAuditingIds((prev) => [...prev, call.id]);
    setCalls((prevCalls) =>
      prevCalls.map((c) =>
        c.id === call.id ? { ...c, aiStatus: "pending" } : c
      )
    );

    try {
      const response = await fetch(`${API}/api/telephony/audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          followUpId: call.id,
          recordingUrl: call.recordingUrl,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        console.error("Failed to trigger audit:", data.message);
        setCalls((prevCalls) =>
          prevCalls.map((c) =>
            c.id === call.id ? { ...c, aiStatus: call.aiStatus || "pending" } : c
          )
        );
        setAuditingIds((prev) => prev.filter((id) => id !== call.id));
        return;
      }

      // Poll for status updates
      let attempts = 0;
      const interval = setInterval(async () => {
        attempts++;
        if (attempts > 60) {
          clearInterval(interval);
          setAuditingIds((prev) => prev.filter((id) => id !== call.id));
          return;
        }

        const updatedCall = await refreshCall(call.id);
        if (updatedCall) {
          setCalls((prevCalls) =>
            prevCalls.map((c) =>
              c.id === call.id
                ? {
                    ...c,
                    aiStatus: updatedCall.aiStatus,
                    transcription: updatedCall.transcription,
                    analysis: updatedCall.analysis,
                  }
                : c
            )
          );

          if (updatedCall.aiStatus === "completed" || updatedCall.aiStatus === "failed") {
            clearInterval(interval);
            setAuditingIds((prev) => prev.filter((id) => id !== call.id));
          }
        }
      }, 3000);
    } catch (error) {
      console.error("Manual audit dispatch failed:", error);
      setAuditingIds((prev) => prev.filter((id) => id !== call.id));
    }
  };

  const filteredCalls = useMemo(() => {
    return calls.filter((call) => {
      const matchesSearch = 
        call.leadPhone.includes(searchInput) ||
        call.telecallerName.toLowerCase().includes(searchInput.toLowerCase());
      
      const matchesOutcome = outcomeFilter === "" || call.outcome === outcomeFilter;

      return matchesSearch && matchesOutcome;
    });
  }, [calls, searchInput, outcomeFilter]);

  const handlePlayCall = (call) => {
    if (!call.recordingUrl) return;
    
    const playUrl = `${API}/api/telephony/playback?key=${call.recordingUrl}`;
    
    if (activeCall?.id === call.id) {
      const audioElement = document.getElementById("global-audio-player");
      if (audioElement) {
        if (isPlaying) {
          audioElement.pause();
          setIsPlaying(false);
        } else {
          audioElement.play().catch(console.error);
          setIsPlaying(true);
        }
      }
    } else {
      setActiveCall(call);
      setAudioUrl(playUrl);
      setIsPlaying(true);
      
      setTimeout(() => {
        const audioElement = document.getElementById("global-audio-player");
        if (audioElement) {
          audioElement.load();
          audioElement.play().catch(console.error);
        }
      }, 50);
    }
  };

  const formatDuration = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatPhoneNumber = (phone) => {
    if (phone.length === 10) {
      return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
    }
    return phone;
  };

  return (
    <div className="space-y-6 relative min-h-[80vh]">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Call Tracker Logs
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track, audit, and listen to outbound sales calls recorded by the mobile app.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground">
          <FileAudio className="h-4 w-4 text-primary" />
          {filteredCalls.length} logs
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by caller or phone..."
            className="input pl-10 pr-4 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={outcomeFilter}
            onChange={(e) => setOutcomeFilter(e.target.value)}
            className="input w-auto text-sm py-2 pr-8"
          >
            <option value="">All outcomes</option>
            <option value="reached">Reached (&gt;15s)</option>
            <option value="not_reached">Not Reached (&le;15s)</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="card overflow-hidden">
        {filteredCalls.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <PhoneCall className="mb-4 h-10 w-10 text-muted-foreground/40 animate-bounce" />
            <h2 className="text-base font-semibold text-foreground">No call logs found</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              {searchInput || outcomeFilter
                ? "No call logs match your filter criteria. Try adjusting your search."
                : "Outbound call logs from the Android tele-calling app will appear here."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-semibold">Telecaller</th>
                  <th className="px-5 py-3 font-semibold">Dialed Number</th>
                  <th className="px-5 py-3 font-semibold">Duration</th>
                  <th className="px-5 py-3 font-semibold">Outcome</th>
                  <th className="px-5 py-3 font-semibold">Time</th>
                  <th className="px-5 py-3 font-semibold">AI Audit</th>
                  <th className="px-5 py-3 font-semibold text-right">Recording</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCalls.map((call) => {
                  const isCallActive = activeCall?.id === call.id;
                  const hasRecording = !!call.recordingUrl;
                  
                  return (
                    <tr
                      key={call.id}
                      className={cn(
                        "align-middle transition-colors",
                        isCallActive ? "bg-primary/[0.04]" : "hover:bg-muted/30"
                      )}
                    >
                      {/* Telecaller */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="font-semibold text-foreground">{call.telecallerName}</span>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-5 py-4 font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          {formatPhoneNumber(call.leadPhone)}
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="px-5 py-4 text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground/60" />
                          {formatDuration(call.duration)}
                        </div>
                      </td>

                      {/* Outcome */}
                      <td className="px-5 py-4">
                        {call.outcome === "reached" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                            <PhoneCall className="h-3 w-3" />
                            Reached
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700 border border-rose-200">
                            <PhoneMissed className="h-3 w-3" />
                            Not Reached
                          </span>
                        )}
                      </td>

                      {/* Contacted At */}
                      <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground/60" />
                          <div>
                            <div>{formatDate(call.contactedAt)}</div>
                            <div className="text-xs">
                              {new Date(call.contactedAt).toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* AI Audit Status */}
                      <td className="px-5 py-4">
                        {call.outcome === "not_reached" ? (
                          <span className="text-xs text-muted-foreground italic">—</span>
                        ) : call.aiStatus === "completed" ? (
                          <button
                            onClick={() => setSelectedAudit(call)}
                            className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-all cursor-pointer shadow-sm"
                          >
                            <Brain className="h-3 w-3 text-indigo-600 animate-pulse" />
                            View Audit ({call.analysis?.leadScore || 0})
                          </button>
                        ) : (call.aiStatus === "processing" || auditingIds.includes(call.id)) ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
                            <Loader2 className="h-3 w-3 animate-spin text-amber-600" />
                            Auditing...
                          </span>
                        ) : call.aiStatus === "failed" ? (
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700 border border-rose-200">
                              <AlertCircle className="h-3 w-3 text-rose-600" />
                              Failed
                            </span>
                            {hasRecording && (
                              <button
                                onClick={() => handleTriggerAudit(call)}
                                className="inline-flex items-center gap-1 rounded bg-indigo-50 border border-indigo-200 px-2 py-0.5 text-[11px] font-bold text-indigo-700 hover:bg-indigo-100 transition-all cursor-pointer shadow-sm shrink-0 animate-pulse"
                              >
                                <Sparkles className="h-2.5 w-2.5 text-indigo-600" />
                                Retry
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 border border-slate-200">
                              Pending
                            </span>
                            {hasRecording && (
                              <button
                                onClick={() => handleTriggerAudit(call)}
                                className="inline-flex items-center gap-1 rounded bg-indigo-50 border border-indigo-200 px-2 py-0.5 text-[11px] font-bold text-indigo-700 hover:bg-indigo-100 transition-all cursor-pointer shadow-sm shrink-0"
                              >
                                <Brain className="h-2.5 w-2.5 text-indigo-600" />
                                Audit
                              </button>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        {hasRecording ? (
                          <button
                            onClick={() => handlePlayCall(call)}
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm transition-all cursor-pointer",
                              isCallActive && isPlaying
                                ? "bg-primary text-primary-foreground"
                                : "bg-card text-foreground hover:bg-muted border border-border"
                            )}
                          >
                            {isCallActive && isPlaying ? (
                              <>
                                <Pause className="h-3.5 w-3.5 fill-current" />
                                Playing
                              </>
                            ) : (
                              <>
                                <Play className="h-3.5 w-3.5 fill-current" />
                                Listen
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">No Audio</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Floating Global Audio Player */}
      {activeCall && (
        <div className="fixed bottom-4 right-4 left-4 lg:left-72 z-40 bg-card border border-border rounded-xl shadow-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary animate-pulse">
              <Volume2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Playing Recording</p>
              <h4 className="text-sm font-bold text-foreground">
                {formatPhoneNumber(activeCall.leadPhone)} &bull; {activeCall.telecallerName}
              </h4>
            </div>
          </div>

          <div className="w-full md:flex-1 md:max-w-xl">
            <audio
              id="global-audio-player"
              src={audioUrl}
              controls
              className="w-full h-9 rounded-lg"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            />
          </div>

          <button
            onClick={() => {
              const audioElement = document.getElementById("global-audio-player");
              if (audioElement) audioElement.pause();
              setActiveCall(null);
              setIsPlaying(false);
            }}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer px-3 py-1.5 rounded-md hover:bg-muted transition-all"
          >
            Close Player
          </button>
        </div>
      )}

      {/* Slide-over Right Drawer for AI Audit Details */}
      {selectedAudit && (
        <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-card border-l border-border shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">AI Auditing Report</h3>
                <p className="text-xs text-muted-foreground">
                  Call ID: {selectedAudit.id.slice(0, 8)}... &bull; Telecaller: {selectedAudit.telecallerName}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedAudit(null)}
              className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Audit Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Summary & Score Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* circular score card */}
              <div className="col-span-1 rounded-xl border border-border p-4 bg-muted/10 flex flex-col items-center justify-center text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Intent Score</p>
                <div className={cn(
                  "relative flex items-center justify-center h-20 w-20 rounded-full border-4 font-bold text-2xl shadow-inner",
                  (selectedAudit.analysis?.leadScore || 0) >= 70 ? "border-emerald-500 text-emerald-600 bg-emerald-50/50" :
                  (selectedAudit.analysis?.leadScore || 0) >= 40 ? "border-amber-500 text-amber-600 bg-amber-50/50" :
                  "border-rose-500 text-rose-600 bg-rose-50/50"
                )}>
                  {selectedAudit.analysis?.leadScore || 0}
                </div>
                <span className="text-[10px] text-muted-foreground mt-2">Scale of 0-100</span>
              </div>

              {/* metadata metrics */}
              <div className="col-span-2 rounded-xl border border-border p-4 bg-muted/10 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold">Call Sentiment</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <ThumbsUp className={cn(
                      "h-4 w-4",
                      selectedAudit.analysis?.sentiment === "Positive" ? "text-emerald-500" :
                      selectedAudit.analysis?.sentiment === "Negative" ? "text-rose-500" : "text-amber-500"
                    )} />
                    <span className="text-sm font-bold text-foreground">{selectedAudit.analysis?.sentiment || "Neutral"}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold">Talk Ratio (Agent : Student)</p>
                  <span className="text-sm font-bold text-foreground block mt-1">
                    {selectedAudit.analysis?.talkRatioAgent || 50}% : {selectedAudit.analysis?.talkRatioCustomer || 50}%
                  </span>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground font-semibold">Summary</p>
                  <p className="text-xs text-foreground mt-1 line-clamp-3">
                    {selectedAudit.analysis?.summary || "No call summary generated."}
                  </p>
                </div>
              </div>
            </div>

            {/* Script Adherence Checkbox */}
            <div className="rounded-xl border border-border p-5 space-y-3">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <ListChecks className="h-4 w-4 text-indigo-500" />
                Script Adherence Rubric
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className={cn(
                  "flex items-center gap-2 rounded-lg border p-3",
                  selectedAudit.analysis?.scriptAdherence?.professional_greeting ? "bg-emerald-50/40 border-emerald-200 text-emerald-800" : "bg-rose-50/40 border-rose-200 text-rose-800"
                )}>
                  {selectedAudit.analysis?.scriptAdherence?.professional_greeting ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-rose-600 shrink-0" />
                  )}
                  <span className="text-xs font-bold">Greeting Standard</span>
                </div>
                <div className={cn(
                  "flex items-center gap-2 rounded-lg border p-3",
                  selectedAudit.analysis?.scriptAdherence?.background_discovery ? "bg-emerald-50/40 border-emerald-200 text-emerald-800" : "bg-rose-50/40 border-rose-200 text-rose-800"
                )}>
                  {selectedAudit.analysis?.scriptAdherence?.background_discovery ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-rose-600 shrink-0" />
                  )}
                  <span className="text-xs font-bold">Background Check</span>
                </div>
                <div className={cn(
                  "flex items-center gap-2 rounded-lg border p-3",
                  selectedAudit.analysis?.scriptAdherence?.counselling_pitched ? "bg-emerald-50/40 border-emerald-200 text-emerald-800" : "bg-rose-50/40 border-rose-200 text-rose-800"
                )}>
                  {selectedAudit.analysis?.scriptAdherence?.counselling_pitched ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-rose-600 shrink-0" />
                  )}
                  <span className="text-xs font-bold">Pitched Counselling</span>
                </div>
              </div>
            </div>

            {/* Coaching & Pitch Objections */}
            <div className="space-y-4">
              {/* Objections Handled */}
              {selectedAudit.analysis?.objectionsHandled?.length > 0 && (
                <div className="rounded-xl border border-border p-4 bg-slate-50/50">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Objections Addressed</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedAudit.analysis.objectionsHandled.map((objection, i) => (
                      <span key={i} className="inline-flex items-center gap-1 rounded bg-amber-50 border border-amber-200 px-2 py-0.5 text-xs text-amber-700 font-semibold">
                        ⚠️ {objection}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Lacking Card */}
              <div className="rounded-xl border border-rose-200 p-4 bg-rose-50/30 flex gap-3">
                <ShieldAlert className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-rose-950">Pitch Deficiencies</h4>
                  <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                    {selectedAudit.analysis?.telecallerLacking || "No visible pitch errors detected. Excellent call."}
                  </p>
                </div>
              </div>

              {/* Improvement Plan */}
              <div className="rounded-xl border border-emerald-200 p-4 bg-emerald-50/30 flex gap-3">
                <Sparkles className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">Coaching Improvement Plan</h4>
                  <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                    {selectedAudit.analysis?.improvementPlan || "Keep maintaining standard pitching quality."}
                  </p>
                </div>
              </div>
            </div>

            {/* Scrollable Transcript */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-indigo-500" />
                Audio Transcript
              </h4>
              <div className="rounded-xl border border-border bg-muted/20 p-4 max-h-72 overflow-y-auto">
                <p className="text-xs leading-relaxed text-foreground whitespace-pre-wrap font-mono">
                  {selectedAudit.transcription || "No transcription generated."}
                </p>
              </div>
            </div>
          </div>

          {/* Footer Audits Actions */}
          <div className="px-6 py-4 border-t border-border bg-muted/30 flex justify-between items-center">
            {selectedAudit.recordingUrl && (
              <button
                onClick={() => handlePlayCall(selectedAudit)}
                className="btn btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                Listen to Call
              </button>
            )}
            <button
              onClick={() => setSelectedAudit(null)}
              className="btn btn-secondary text-xs py-2 px-4"
            >
              Close Audit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
