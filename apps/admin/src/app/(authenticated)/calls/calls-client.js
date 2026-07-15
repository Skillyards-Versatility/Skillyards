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
  const [activeTab, setActiveTab] = useState("overview");

  const normalizedAnalysis = useMemo(() => {
    if (!selectedAudit || !selectedAudit.analysis) return null;
    const raw = selectedAudit.analysis;
    
    if (raw.scores) {
      return raw;
    }
    
    // Map old schema to new structure
    return {
      callSummary: raw.summary || "No call summary generated.",
      language: {
        primary: raw.language?.primary || "hinglish",
        codeSwitching: raw.language?.codeSwitching || "none",
        transcriptQualityConcern: false
      },
      leadProfile: {
        prospectName: raw.leadProfile?.prospectName || "Student",
        speakingWith: raw.leadProfile?.speakingWith || "student",
        programInterest: raw.leadProfile?.programInterest || "undecided",
        personaGuess: raw.leadProfile?.personaGuess || "unknown",
        decisionMaker: raw.leadProfile?.decisionMaker || "unknown",
        budgetSensitivity: raw.leadProfile?.budgetSensitivity || "unknown",
        leadGrade: raw.leadProfile?.leadGrade || (raw.leadScore >= 70 ? "A_hot" : raw.leadScore >= 40 ? "B_warm" : "C_cold")
      },
      callOutcome: raw.callOutcome || "undecided",
      scriptAdherence: {
        authorityIntro: { status: raw.scriptAdherence?.professional_greeting ? "completed" : "missed", evidence: "Fallback audit metadata" },
        permissionOpener: { status: "not_applicable", evidence: "" },
        patternInterrupt: { status: "not_applicable", evidence: "" },
        situationDiscovery: { status: raw.scriptAdherence?.background_discovery ? "completed" : "missed", evidence: "Fallback audit metadata" },
        problemGapIdentified: { status: "not_applicable", evidence: "" },
        implicationAmplified: { status: "not_applicable", evidence: "" },
        qualificationQuestions: { status: "not_applicable", evidence: "" },
        decisionMakerIdentified: { status: "not_applicable", evidence: "" },
        valueStackPitch: { status: "not_applicable", evidence: "" },
        programModelExplained: { status: "not_applicable", evidence: "" },
        objectionHandling: { status: raw.objectionsHandled?.length > 0 ? "completed" : "not_applicable", evidence: "" },
        softCTA: { status: "not_applicable", evidence: "" },
        strongCTA: { status: raw.scriptAdherence?.counselling_pitched ? "completed" : "missed", evidence: "Fallback audit metadata" },
        urgencyCreated: { status: "not_applicable", evidence: "" },
        nextStepConfirmed: { status: "not_applicable", evidence: "" }
      },
      objectionsRaised: (raw.objectionsHandled || []).map(obj => ({
        objectionType: "other",
        customerQuote: "Objection raised by customer",
        counselorResponse: raw.improvementPlan || "",
        laceAdherence: { listened: true, accepted: true, clarified: true, executed: true },
        handledEffectively: "adequate"
      })),
      complianceFlags: [],
      toneAndDelivery: {
        tone: raw.toneAndDelivery?.tone || "calm_confident",
        talkToListenBalance: raw.toneAndDelivery?.talkToListenBalance || "good",
        languageProfessionalism: raw.toneAndDelivery?.languageProfessionalism || "acceptable",
        concerns: []
      },
      scores: {
        overall: raw.leadScore || 0,
        scriptAdherenceScore: raw.scriptAdherence?.professional_greeting ? 80 : 40,
        compliance: 100,
        communication: 70,
        objectionHandling: raw.objectionsHandled?.length > 0 ? 80 : 50,
        discoveryQuality: raw.scriptAdherence?.background_discovery ? 80 : 40
      },
      coaching: {
        strengths: ["Historical audit record"],
        improvements: [raw.telecallerLacking].filter(Boolean),
        exampleQuotes: []
      },
      recommendedNextAction: raw.recommendedNextAction || "Follow up with prospect."
    };
  }, [selectedAudit]);

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

          {!normalizedAnalysis ? (
            <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center space-y-4">
              <Brain className="h-16 w-16 text-muted-foreground/30 animate-pulse" />
              <div>
                <h4 className="text-base font-bold text-foreground capitalize">
                  Audit Status: {selectedAudit.aiStatus || "Not Audited"}
                </h4>
                <p className="text-xs text-muted-foreground max-w-xs mt-1 leading-relaxed">
                  {selectedAudit.aiStatus === "processing"
                    ? "The AI auditor is currently transcribing and scoring this recording. Please check back in a moment."
                    : selectedAudit.aiStatus === "pending"
                    ? "This call is in the queue to be audited. It will process automatically shortly."
                    : selectedAudit.aiStatus === "failed"
                    ? "The auditing pipeline failed to process this call recording. This can happen due to poor audio quality or network issues."
                    : "No audit exists for this call recording. Trigger an audit to analyze lead sentiment and script compliance."}
                </p>
              </div>
              
              {["pending", "processing"].includes(selectedAudit.aiStatus) ? (
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Processing Audit...</span>
                </div>
              ) : (
                <button
                  onClick={() => handleTriggerAudit(selectedAudit)}
                  className="btn btn-primary text-xs py-2 px-4 cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Trigger Audit Now
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Tabs Navigation */}
              <div className="flex border-b border-border bg-muted/10 px-6 gap-2">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={cn(
                    "px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer",
                    activeTab === "overview" ? "border-indigo-600 text-indigo-600" : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  Overview & Scores
                </button>
                <button
                  onClick={() => setActiveTab("script")}
                  className={cn(
                    "px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer",
                    activeTab === "script" ? "border-indigo-600 text-indigo-600" : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  Script Adherence
                </button>
                <button
                  onClick={() => setActiveTab("objections")}
                  className={cn(
                    "px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer",
                    activeTab === "objections" ? "border-indigo-600 text-indigo-600" : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  Objections & Compliance
                </button>
                <button
                  onClick={() => setActiveTab("coaching")}
                  className={cn(
                    "px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer",
                    activeTab === "coaching" ? "border-indigo-600 text-indigo-600" : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  Coaching & Transcript
                </button>
              </div>

              {/* Audit Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* 1. OVERVIEW TAB */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    {/* Warning Banner */}
                    {normalizedAnalysis.language?.transcriptQualityConcern && (
                      <div className="flex items-center gap-2.5 p-3.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-xs font-semibold">
                        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                        <span>Low audio/transcript quality detected. Audit scores and analysis are approximate.</span>
                      </div>
                    )}

                    {/* Score Dashboard Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Overall Quality Score */}
                      <div className="col-span-1 rounded-xl border border-border p-4 bg-muted/10 flex flex-col items-center justify-center text-center">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Overall Audit</p>
                        <div className={cn(
                          "relative flex items-center justify-center h-20 w-20 rounded-full border-4 font-bold text-2xl shadow-inner",
                          (normalizedAnalysis.scores?.overall || 0) >= 70 ? "border-emerald-500 text-emerald-600 bg-emerald-50/50" :
                          (normalizedAnalysis.scores?.overall || 0) >= 40 ? "border-amber-500 text-amber-600 bg-amber-50/50" :
                          "border-rose-500 text-rose-600 bg-rose-50/50"
                        )}>
                          {normalizedAnalysis.scores?.overall || 0}
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-2">Scale of 0-100</span>
                      </div>

                      {/* Sub-Scores Grid */}
                      <div className="col-span-2 rounded-xl border border-border p-4 bg-muted/10 grid grid-cols-2 gap-3">
                        <div className="border-l-2 pl-2.5 border-indigo-500">
                          <p className="text-[10px] uppercase font-semibold text-muted-foreground">Script Adherence</p>
                          <span className="text-sm font-bold text-foreground">{normalizedAnalysis.scores?.scriptAdherenceScore || 0}/100</span>
                        </div>
                        <div className="border-l-2 pl-2.5 border-indigo-500">
                          <p className="text-[10px] uppercase font-semibold text-muted-foreground">Discovery Quality</p>
                          <span className="text-sm font-bold text-foreground">{normalizedAnalysis.scores?.discoveryQuality || 0}/100</span>
                        </div>
                        <div className="border-l-2 pl-2.5 border-indigo-500">
                          <p className="text-[10px] uppercase font-semibold text-muted-foreground">Objection Handling</p>
                          <span className="text-sm font-bold text-foreground">{normalizedAnalysis.scores?.objectionHandling || 0}/100</span>
                        </div>
                        <div className="border-l-2 pl-2.5 border-indigo-500">
                          <p className="text-[10px] uppercase font-semibold text-muted-foreground">Communication</p>
                          <span className="text-sm font-bold text-foreground">{normalizedAnalysis.scores?.communication || 0}/100</span>
                        </div>
                        <div className="col-span-2 border-l-2 pl-2.5 border-indigo-500">
                          <p className="text-[10px] uppercase font-semibold text-muted-foreground">Compliance Rating</p>
                          <span className={cn(
                            "text-sm font-bold",
                            (normalizedAnalysis.scores?.compliance || 100) >= 80 ? "text-emerald-600" :
                            (normalizedAnalysis.scores?.compliance || 100) >= 55 ? "text-amber-600" : "text-rose-600"
                          )}>{normalizedAnalysis.scores?.compliance || 0}/100</span>
                        </div>
                      </div>
                    </div>

                    {/* Call Summary */}
                    <div className="rounded-xl border border-border p-5 bg-muted/5">
                      <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-1.5">
                        <MessageSquare className="h-4 w-4 text-indigo-500" />
                        Call Summary
                      </h4>
                      <p className="text-xs text-foreground leading-relaxed">
                        {normalizedAnalysis.callSummary}
                      </p>
                      <div className="mt-3 pt-3 border-t border-border flex justify-between text-xs text-muted-foreground">
                        <span>Outcome: <strong className="text-foreground capitalize">{normalizedAnalysis.callOutcome?.replace("_", " ")}</strong></span>
                        <span>Language: <strong className="text-foreground capitalize">{normalizedAnalysis.language?.primary}</strong></span>
                      </div>
                    </div>

                    {/* Lead Profile Metadata */}
                    <div className="rounded-xl border border-border p-5 space-y-4">
                      <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                        <User className="h-4 w-4 text-indigo-500" />
                        Prospect Profiling & Insights
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <span className="text-muted-foreground block font-semibold">Prospect Name</span>
                          <span className="font-bold text-foreground">{normalizedAnalysis.leadProfile?.prospectName || "Unknown"}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-muted-foreground block font-semibold">Speaking With</span>
                          <span className="font-bold text-foreground capitalize">{normalizedAnalysis.leadProfile?.speakingWith}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-muted-foreground block font-semibold">Program Interest</span>
                          <span className="font-bold text-foreground uppercase">{normalizedAnalysis.leadProfile?.programInterest?.replace("_", " ")}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-muted-foreground block font-semibold">Lead Grade (CRM)</span>
                          <span className={cn(
                            "font-bold uppercase px-2 py-0.5 rounded text-[10px] inline-block",
                            normalizedAnalysis.leadProfile?.leadGrade === "A_hot" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                            normalizedAnalysis.leadProfile?.leadGrade === "B_warm" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                            normalizedAnalysis.leadProfile?.leadGrade === "C_cold" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                            "bg-muted text-muted-foreground"
                          )}>
                            {normalizedAnalysis.leadProfile?.leadGrade?.replace("_", " ")}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-muted-foreground block font-semibold">Buyer Persona</span>
                          <span className="font-bold text-foreground capitalize">{normalizedAnalysis.leadProfile?.personaGuess?.replace("_", " ")}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-muted-foreground block font-semibold">Budget Sensitivity</span>
                          <span className="font-bold text-foreground capitalize">{normalizedAnalysis.leadProfile?.budgetSensitivity}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tone, Delivery & Recommended Action */}
                    <div className="rounded-xl border border-border p-5 space-y-4">
                      <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                        <ThumbsUp className="h-4 w-4 text-indigo-500" />
                        Delivery & Communication Quality
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-muted-foreground block font-semibold">Agent Tone</span>
                          <span className="font-bold text-foreground capitalize">{normalizedAnalysis.toneAndDelivery?.tone?.replace("_", " ")}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block font-semibold">Talk-to-Listen Balance</span>
                          <span className="font-bold text-foreground capitalize">{normalizedAnalysis.toneAndDelivery?.talkToListenBalance?.replace("_", " ")}</span>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-border">
                        <span className="text-muted-foreground block text-xs font-semibold mb-1">Recommended Next Action</span>
                        <p className="text-xs font-bold text-indigo-600 bg-indigo-50/50 border border-indigo-100 p-2.5 rounded-lg">
                          👉 {normalizedAnalysis.recommendedNextAction}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. SCRIPT ADHERENCE TAB */}
                {activeTab === "script" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-border">
                      <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                        <ListChecks className="h-4 w-4 text-indigo-500" />
                        15-Stage Script Adherence Rubric
                      </h4>
                      <span className="text-xs font-semibold text-muted-foreground">
                        Score: {normalizedAnalysis.scores?.scriptAdherenceScore || 0}/100
                      </span>
                    </div>

                    <div className="space-y-3">
                      {Object.entries(normalizedAnalysis.scriptAdherence || {}).map(([stageKey, stageData]) => {
                        const label = {
                          authorityIntro: "Authority Intro",
                          permissionOpener: "Permission Opener",
                          patternInterrupt: "Pattern Interrupt",
                          situationDiscovery: "Situation Discovery",
                          problemGapIdentified: "Problem/Gap Identified",
                          implicationAmplified: "Implication Amplified",
                          qualificationQuestions: "Qualification Questions",
                          decisionMakerIdentified: "Decision Maker Identified",
                          valueStackPitch: "Value Stack Pitch",
                          programModelExplained: "Program Model Explained",
                          objectionHandling: "Objection Handling",
                          softCTA: "Soft CTA",
                          strongCTA: "Strong CTA",
                          urgencyCreated: "Urgency Created",
                          nextStepConfirmed: "Next Step Confirmed"
                        }[stageKey] || stageKey;

                        return (
                          <div key={stageKey} className="flex flex-col gap-1.5 p-3 rounded-lg border border-border bg-muted/5 hover:bg-muted/10 transition-colors">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-foreground">{label}</span>
                              <span className={cn(
                                "text-[10px] font-bold px-2 py-0.5 rounded capitalize",
                                stageData.status === "completed" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                                stageData.status === "partial" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                                stageData.status === "missed" ? "bg-rose-50 text-rose-700 border border-rose-200" :
                                "bg-muted text-muted-foreground border border-border"
                              )}>
                                {stageData.status?.replace("_", " ")}
                              </span>
                            </div>
                            {stageData.evidence && (
                              <p className="text-[11px] text-muted-foreground italic leading-relaxed pl-2 border-l-2 border-muted">
                                &ldquo;{stageData.evidence}&rdquo;
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. OBJECTIONS & COMPLIANCE TAB */}
                {activeTab === "objections" && (
                  <div className="space-y-6">
                    {/* Objections section */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5 pb-2 border-b border-border">
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                        Objections Raised & LACE Audit
                      </h4>

                      {normalizedAnalysis.objectionsRaised?.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic">No objections were raised by the prospect during this call.</p>
                      ) : (
                        <div className="space-y-4">
                          {normalizedAnalysis.objectionsRaised?.map((obj, idx) => (
                            <div key={idx} className="rounded-xl border border-border p-4 space-y-3 bg-muted/5">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-foreground uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
                                  {obj.objectionType?.replace("_", " ")}
                                </span>
                                <span className={cn(
                                  "text-xs font-semibold capitalize",
                                  obj.handledEffectively === "well" ? "text-emerald-600" :
                                  obj.handledEffectively === "adequate" ? "text-amber-600" : "text-rose-600"
                                )}>
                                  Handled: {obj.handledEffectively}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                <div className="bg-rose-50/30 p-2.5 rounded border border-rose-100/50">
                                  <span className="text-[10px] font-semibold text-rose-800 block mb-1">Customer Quote</span>
                                  <p className="italic text-foreground">&ldquo;{obj.customerQuote}&rdquo;</p>
                                </div>
                                <div className="bg-emerald-50/30 p-2.5 rounded border border-emerald-100/50">
                                  <span className="text-[10px] font-semibold text-emerald-800 block mb-1">Counselor Response</span>
                                  <p className="text-foreground">{obj.counselorResponse}</p>
                                </div>
                              </div>

                              {/* LACE indicators */}
                              <div className="pt-2 border-t border-border flex items-center gap-4 text-[10px] font-bold">
                                <span className="text-muted-foreground uppercase">LACE Rubric:</span>
                                <div className="flex gap-3">
                                  <span className={cn("flex items-center gap-1", obj.laceAdherence?.listened ? "text-emerald-600" : "text-muted-foreground/50")}>
                                    <CheckCircle2 className="h-3.5 w-3.5" /> Listened
                                  </span>
                                  <span className={cn("flex items-center gap-1", obj.laceAdherence?.accepted ? "text-emerald-600" : "text-muted-foreground/50")}>
                                    <CheckCircle2 className="h-3.5 w-3.5" /> Accepted
                                  </span>
                                  <span className={cn("flex items-center gap-1", obj.laceAdherence?.clarified ? "text-emerald-600" : "text-muted-foreground/50")}>
                                    <CheckCircle2 className="h-3.5 w-3.5" /> Clarified
                                  </span>
                                  <span className={cn("flex items-center gap-1", obj.laceAdherence?.executed ? "text-emerald-600" : "text-muted-foreground/50")}>
                                    <CheckCircle2 className="h-3.5 w-3.5" /> Executed
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Compliance & Risk flags */}
                    <div className="space-y-4 pt-4">
                      <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5 pb-2 border-b border-border">
                        <ShieldAlert className="h-4 w-4 text-rose-500" />
                        Compliance & Mis-selling Monitor
                      </h4>

                      {normalizedAnalysis.complianceFlags?.length === 0 ? (
                        <div className="flex items-center gap-2.5 p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-semibold">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                          <span>No compliance concerns or mis-selling claims flagged. Counselor adhered strictly to verified facts.</span>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {normalizedAnalysis.complianceFlags?.map((flag, idx) => (
                            <div key={idx} className="rounded-xl border border-rose-200 bg-rose-50/20 p-4 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-rose-900 capitalize">
                                  🚨 {flag.claimType?.replace("_", " ")}
                                </span>
                                <span className={cn(
                                  "text-[10px] font-bold px-2 py-0.5 rounded uppercase border",
                                  flag.riskLevel === "high" ? "bg-rose-100 text-rose-700 border-rose-300" :
                                  flag.riskLevel === "medium" ? "bg-amber-100 text-amber-700 border-amber-300" :
                                  "bg-blue-100 text-blue-700 border-blue-300"
                                )}>
                                  {flag.riskLevel} Risk
                                </span>
                              </div>
                              <div className="bg-rose-50/50 p-2.5 rounded border border-rose-100 text-xs italic text-rose-950">
                                &ldquo;{flag.verbatimQuote}&rdquo;
                              </div>
                              <p className="text-xs text-rose-800 leading-relaxed">
                                {flag.note}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 4. COACHING & TRANSCRIPT TAB */}
                {activeTab === "coaching" && (
                  <div className="space-y-6">
                    {/* Coaching Plan */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5 pb-2 border-b border-border">
                        <Sparkles className="h-4 w-4 text-indigo-500" />
                        Manager Coaching Rubric
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        {/* Strengths */}
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50/20 p-4 space-y-2">
                          <span className="font-bold text-emerald-900 block">💪 Key Strengths</span>
                          {normalizedAnalysis.coaching?.strengths?.length === 0 ? (
                            <p className="text-muted-foreground italic">None listed.</p>
                          ) : (
                            <ul className="list-disc pl-4 space-y-1 text-emerald-800 font-semibold">
                              {normalizedAnalysis.coaching.strengths.map((str, i) => (
                                <li key={i}>{str}</li>
                              ))}
                            </ul>
                          )}
                        </div>

                        {/* Improvements */}
                        <div className="rounded-xl border border-rose-200 bg-rose-50/20 p-4 space-y-2">
                          <span className="font-bold text-rose-900 block">⚠️ Areas of Improvement</span>
                          {normalizedAnalysis.coaching?.improvements?.length === 0 ? (
                            <p className="text-muted-foreground italic">None listed.</p>
                          ) : (
                            <ul className="list-disc pl-4 space-y-1 text-rose-800 font-semibold">
                              {normalizedAnalysis.coaching.improvements.map((imp, i) => (
                                <li key={i}>{imp}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>

                      {/* Highlight Quotes */}
                      {normalizedAnalysis.coaching?.exampleQuotes?.length > 0 && (
                        <div className="rounded-xl border border-border p-4 space-y-2.5 bg-muted/5 text-xs">
                          <span className="font-bold text-foreground block">🗣️ Call Action Highlights (Quotes)</span>
                          <div className="space-y-2">
                            {normalizedAnalysis.coaching.exampleQuotes.map((q, i) => (
                              <div key={i} className="flex gap-2 items-start py-1">
                                <span className="font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded px-1.5 py-0.5 text-[9px] uppercase shrink-0 mt-0.5">
                                  {q.label}
                                </span>
                                <span className="italic text-foreground">&ldquo;{q.quote}&rdquo;</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Verbatim Transcript */}
                    <div className="space-y-2.5 pt-4">
                      <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5 pb-2 border-b border-border">
                        <MessageSquare className="h-4 w-4 text-indigo-500" />
                        Audio Transcript
                      </h4>
                      <div className="rounded-xl border border-border bg-muted/20 p-4 max-h-[30rem] overflow-y-auto">
                        <p className="text-xs leading-relaxed text-foreground whitespace-pre-wrap font-mono">
                          {selectedAudit.transcription || "No transcription generated."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Footer Audits Actions */}
              <div className="px-6 py-4 border-t border-border bg-muted/30 flex justify-between items-center">
                {selectedAudit.recordingUrl && (
                  <button
                    onClick={() => handlePlayCall(selectedAudit)}
                    className="btn btn-primary text-xs py-2 px-4 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    Listen to Call
                  </button>
                )}
                <button
                  onClick={() => setSelectedAudit(null)}
                  className="btn btn-secondary text-xs py-2 px-4 cursor-pointer"
                >
                  Close Audit
                </button>
              </div>
            </>
          )}
    </div>
  );
}
