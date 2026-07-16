"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  Search, Phone, PhoneCall, PhoneMissed, Play, Pause, Volume2, Clock, Calendar, User, FileAudio,
  Brain, CheckCircle2, XCircle, AlertCircle, X, MessageSquare, Sparkles, Loader2, ListChecks, ThumbsUp, ShieldAlert,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import { API } from "@/lib/api";
import { refreshCall, uploadRecordingAction } from "@/actions/calls";
import { toast } from "sonner";

export function CallsClient({ initialCalls, allUsers = [] }) {
  const [calls, setCalls] = useState(initialCalls);
  const [searchInput, setSearchInput] = useState("");
  const [outcomeFilter, setOutcomeFilter] = useState("");
  const [activeCall, setActiveCall] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [auditingIds, setAuditingIds] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [playbackRate, setPlaybackRate] = useState(1);
  const [selectedTelecallerId, setSelectedTelecallerId] = useState(null);

  // Manual Analyzer states
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedUserForUpload, setSelectedUserForUpload] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [manualDuration, setManualDuration] = useState(0);
  const [manualIsTraining, setManualIsTraining] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadError, setUploadError] = useState("");

  // Filters under cards
  const [durationFilter, setDurationFilter] = useState("all");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

  const computedUsers = useMemo(() => {
    const map = {};
    allUsers.forEach((u) => {
      map[u.id] = {
        id: u.id,
        name: u.name,
        isTraining: u.isTraining,
        totalCalls: 0,
        reachedCalls: 0,
        notReachedCalls: 0,
      };
    });
    calls.forEach((c) => {
      if (!c.telecallerId || !map[c.telecallerId]) return;
      map[c.telecallerId].totalCalls++;
      if (c.outcome === "reached") {
        map[c.telecallerId].reachedCalls++;
      } else {
        map[c.telecallerId].notReachedCalls++;
      }
    });
    return Object.values(map);
  }, [allUsers, calls]);

  const traineeUsers = useMemo(() => computedUsers.filter(u => u.isTraining), [computedUsers]);
  const regularUsers = useMemo(() => computedUsers.filter(u => !u.isTraining), [computedUsers]);

  const getInitials = (name) => {
    if (!name) return "TC";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  useEffect(() => {
    const audioElement = document.getElementById("global-audio-player");
    if (audioElement) {
      audioElement.playbackRate = playbackRate;
    }
  }, [audioUrl, playbackRate]);

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
    if (!selectedTelecallerId) return [];

    return calls.filter((call) => {
      // 1. Matches selected telecaller
      if (call.telecallerId !== selectedTelecallerId) return false;

      // 2. Matches search text
      const matchesSearch = 
        call.leadPhone.includes(searchInput) ||
        call.telecallerName.toLowerCase().includes(searchInput.toLowerCase());
      if (!matchesSearch) return false;
      
      // 3. Matches outcome
      const matchesOutcome = outcomeFilter === "" || call.outcome === outcomeFilter;
      if (!matchesOutcome) return false;

      // 4. Matches duration
      if (durationFilter === "short" && call.duration >= 30) return false;
      if (durationFilter === "medium" && (call.duration < 30 || call.duration > 120)) return false;
      if (durationFilter === "long" && call.duration <= 120) return false;

      // 5. Matches custom date range
      const callDate = new Date(call.contactedAt);
      if (startDateFilter) {
        const start = new Date(startDateFilter);
        start.setHours(0, 0, 0, 0);
        if (callDate < start) return false;
      }
      if (endDateFilter) {
        const end = new Date(endDateFilter);
        end.setHours(23, 59, 59, 999);
        if (callDate > end) return false;
      }

      return true;
    });
  }, [calls, searchInput, outcomeFilter, selectedTelecallerId, durationFilter, startDateFilter, endDateFilter]);

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

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFile(file);
    setUploadError("");

    try {
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      audio.addEventListener("loadedmetadata", () => {
        setManualDuration(Math.round(audio.duration));
        URL.revokeObjectURL(audio.src);
      });
      audio.addEventListener("error", () => {
        setManualDuration(60);
        URL.revokeObjectURL(audio.src);
      });
    } catch (err) {
      console.error("Error loading audio metadata:", err);
      setManualDuration(60);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadError("Please select a recording file.");
      return;
    }
    if (!selectedUserForUpload) {
      setUploadError("Please assign a telecaller.");
      return;
    }
    if (!manualPhone || manualPhone.replace(/\D/g, "").length < 10) {
      setUploadError("Please enter a valid 10-digit phone number.");
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("telecallerId", selectedUserForUpload);
      formData.append("phone", manualPhone);
      formData.append("duration", manualDuration.toString());
      formData.append("isTraining", manualIsTraining.toString());
      formData.append("outcome", "reached");
      formData.append("contactedAt", new Date().toISOString());

      const result = await uploadRecordingAction(formData);

      if (result.success && result.call) {
        setCalls((prev) => [result.call, ...prev]);
        setIsUploadOpen(false);
        setUploadFile(null);
        setSelectedUserForUpload("");
        setManualPhone("");
        setManualDuration(0);
        setManualIsTraining(false);
        toast.success("Recording uploaded. AI Auditing triggered.");
        handleTriggerAudit(result.call);
      } else {
        setUploadError(result.error || "Failed to upload recording.");
      }
    } catch (err) {
      setUploadError(err.message || "Something went wrong.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 relative min-h-[80vh]">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Call Tracker Logs
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track, audit, and listen to outbound sales calls recorded by the mobile app.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-primary-foreground bg-primary hover:bg-primary/95 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            Upload & Analyze Call
          </button>
          {selectedTelecallerId && (
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs font-bold text-foreground animate-fade-in">
              <FileAudio className="h-4 w-4 text-primary" />
              {filteredCalls.length} logs
            </div>
          )}
        </div>
      </div>

      {/* Trainee Profiles Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <Brain className="h-4 w-4 text-amber-500" />
            Trainee BDAs (Trainings)
          </h3>
        </div>
        {traineeUsers.length === 0 ? (
          <p className="text-xs text-muted-foreground italic pl-1">No trainee BDAs configured in User Management.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {traineeUsers.map((tc) => {
              const isSelected = selectedTelecallerId === tc.id;
              return (
                <div
                  key={tc.id}
                  onClick={() => setSelectedTelecallerId(tc.id)}
                  className={cn(
                    "cursor-pointer p-3 rounded-xl border transition-all flex items-center justify-between bg-card hover:bg-muted/40",
                    isSelected
                      ? "border-primary/50 bg-primary/[0.03] shadow-sm ring-1 ring-primary/20"
                      : "border-border hover:border-border/80"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 uppercase",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-amber-100/60 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/55 dark:border-amber-900/30"
                    )}>
                      {getInitials(tc.name)}
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-xs block text-foreground truncate leading-snug">{tc.name}</span>
                      <span className="text-[9px] text-muted-foreground block font-medium truncate">Trainee BDA</span>
                    </div>
                  </div>
                  <div className="shrink-0 pl-1">
                    <span className="text-[10px] font-bold text-foreground bg-muted border border-border px-2 py-0.5 rounded-full">
                      {tc.totalCalls}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Regular Profiles Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <User className="h-4 w-4 text-indigo-500" />
            Regular BDAs & Staff
          </h3>
        </div>
        {regularUsers.length === 0 ? (
          <p className="text-xs text-muted-foreground italic pl-1">No regular BDAs configured in User Management.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {regularUsers.map((tc) => {
              const isSelected = selectedTelecallerId === tc.id;
              return (
                <div
                  key={tc.id}
                  onClick={() => setSelectedTelecallerId(tc.id)}
                  className={cn(
                    "cursor-pointer p-3 rounded-xl border transition-all flex items-center justify-between bg-card hover:bg-muted/40",
                    isSelected
                      ? "border-primary/50 bg-primary/[0.03] shadow-sm ring-1 ring-primary/20"
                      : "border-border hover:border-border/80"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 uppercase",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-indigo-100/60 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200/55 dark:border-indigo-900/30"
                    )}>
                      {getInitials(tc.name)}
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-xs block text-foreground truncate leading-snug">{tc.name}</span>
                      <span className="text-[9px] text-muted-foreground block font-medium truncate">Regular BDA</span>
                    </div>
                  </div>
                  <div className="shrink-0 pl-1">
                    <span className="text-[10px] font-bold text-foreground bg-muted border border-border px-2 py-0.5 rounded-full">
                      {tc.totalCalls}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Workspace with Filters under Cards */}
      {selectedTelecallerId && (
        <div className="space-y-4 pt-4 border-t border-border/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                {getInitials(allUsers.find(u => u.id === selectedTelecallerId)?.name)}
              </div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <span>Call Logs for {allUsers.find(u => u.id === selectedTelecallerId)?.name}</span>
                {allUsers.find(u => u.id === selectedTelecallerId)?.isTraining && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
                    Trainee
                  </span>
                )}
              </h3>
            </div>
            <button
              onClick={() => setSelectedTelecallerId(null)}
              className="text-xs font-bold text-rose-600 hover:text-rose-500 cursor-pointer"
            >
              Clear selection
            </button>
          </div>

          {/* Filter Toolbar */}
          <div className="card p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
            {/* Search */}
            <div className="space-y-1.5 sm:col-span-2 lg:col-span-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                <Search className="h-3 w-3" /> Search
              </label>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by phone..."
                className="input py-2 text-xs w-full bg-background"
              />
            </div>

            {/* Outcome Filter */}
            <div className="space-y-1.5 sm:col-span-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                <Filter className="h-3 w-3" /> Outcome
              </label>
              <select
                value={outcomeFilter}
                onChange={(e) => setOutcomeFilter(e.target.value)}
                className="input py-2 text-xs w-full bg-background pr-8"
              >
                <option value="">All outcomes</option>
                <option value="reached">Reached (&gt;15s)</option>
                <option value="not_reached">Not Reached (&le;15s)</option>
              </select>
            </div>

            {/* Duration Filter */}
            <div className="space-y-1.5 sm:col-span-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                <Clock className="h-3 w-3" /> Duration
              </label>
              <select
                value={durationFilter}
                onChange={(e) => setDurationFilter(e.target.value)}
                className="input py-2 text-xs w-full bg-background pr-8"
              >
                <option value="all">All Durations</option>
                <option value="short">Short (&lt; 30s)</option>
                <option value="medium">Medium (30s - 2m)</option>
                <option value="long">Long (&gt; 2m)</option>
              </select>
            </div>

            {/* Custom Datepicker (From/To) */}
            <div className="space-y-1.5 sm:col-span-2 lg:col-span-1 flex gap-2 w-full">
              <div className="w-1/2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> From
                </label>
                <input
                  type="date"
                  value={startDateFilter}
                  onChange={(e) => setStartDateFilter(e.target.value)}
                  className="input py-2 text-[10px] w-full bg-background"
                />
              </div>
              <div className="w-1/2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> To
                </label>
                <input
                  type="date"
                  value={endDateFilter}
                  onChange={(e) => setEndDateFilter(e.target.value)}
                  className="input py-2 text-[10px] w-full bg-background"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table / Cards Card */}
      {!selectedTelecallerId ? (
        <div className="card p-12 text-center flex flex-col items-center justify-center space-y-4 bg-muted/10 border-dashed border-2 border-border/80">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-full animate-pulse">
            <Brain className="h-10 w-10" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">Select a BDA Profile</h3>
            <p className="text-xs text-muted-foreground max-w-sm mt-1 mx-auto leading-relaxed">
              Choose a team member from the Trainee or Regular sections above to view their call logs, play recordings, and inspect AI-driven compliance reports.
            </p>
          </div>
        </div>
      ) : (
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
          <>
            {/* Mobile/Tablet Card View */}
            <div className="md:hidden divide-y divide-border">
              {filteredCalls.map((call) => {
                const isCallActive = activeCall?.id === call.id;
                const hasRecording = !!call.recordingUrl;
                
                return (
                  <div
                    key={call.id}
                    className={cn(
                      "p-4 space-y-4 transition-colors",
                      isCallActive ? "bg-primary/[0.04]" : "hover:bg-muted/10"
                    )}
                  >
                    {/* Top line: Caller info and Time */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground text-sm">{call.telecallerName}</div>
                          <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(call.contactedAt)}</span>
                            <span>&bull;</span>
                            <span>
                              {new Date(call.contactedAt).toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Outcome Badge */}
                      <div>
                        {call.outcome === "reached" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                            <PhoneCall className="h-3 w-3" />
                            Reached
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200">
                            <PhoneMissed className="h-3 w-3" />
                            Not Reached
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Mid Section: Phone and Duration */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-muted/20 p-2.5 rounded-lg border border-border/50">
                      <div className="space-y-1">
                        <span className="text-[10px] text-muted-foreground font-semibold block uppercase">Number</span>
                        <span className="font-medium text-foreground flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground/75" />
                          {formatPhoneNumber(call.leadPhone)}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-muted-foreground font-semibold block uppercase">Duration</span>
                        <span className="text-foreground flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground/75" />
                          {formatDuration(call.duration)}
                        </span>
                      </div>
                    </div>

                    {/* Bottom section: Audit Status & Play Action */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      {/* AI Audit Status */}
                      <div>
                        {call.outcome === "not_reached" ? (
                          <span className="text-xs text-muted-foreground italic">No Audit Needed</span>
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
                      </div>

                      {/* Recording Action */}
                      <div>
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
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
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
          </>
        )}
      </div>
      )}

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

          <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border shrink-0">
            {[1, 1.5, 2, 2.5, 3].map((rate) => (
              <button
                key={rate}
                onClick={() => setPlaybackRate(rate)}
                className={cn(
                  "px-2 py-1 text-[10px] font-bold rounded transition-all cursor-pointer",
                  playbackRate === rate
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {rate}x
              </button>
            ))}
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
              <div className="flex border-b border-border bg-muted/10 px-6 gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={cn(
                    "px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0",
                    activeTab === "overview" ? "border-indigo-600 text-indigo-600" : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  Overview & Scores
                </button>
                <button
                  onClick={() => setActiveTab("script")}
                  className={cn(
                    "px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0",
                    activeTab === "script" ? "border-indigo-600 text-indigo-600" : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  Script Adherence
                </button>
                <button
                  onClick={() => setActiveTab("objections")}
                  className={cn(
                    "px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0",
                    activeTab === "objections" ? "border-indigo-600 text-indigo-600" : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  Objections & Compliance
                </button>
                <button
                  onClick={() => setActiveTab("coaching")}
                  className={cn(
                    "px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0",
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
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                      <div className="col-span-1 sm:col-span-2 rounded-xl border border-border p-4 bg-muted/10 grid grid-cols-2 gap-3">
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
                      <div className="mt-3 pt-3 border-t border-border flex flex-col sm:flex-row sm:justify-between gap-2 text-xs text-muted-foreground">
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-muted-foreground block font-semibold">Agent Tone</span>
                          <span className="font-bold text-foreground capitalize">{normalizedAnalysis.toneAndDelivery?.tone?.replace("_", " ")}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block font-semibold">Talk-to-Listen Balance</span>
                          <span className="font-bold text-foreground capitalize">{normalizedAnalysis.toneAndDelivery?.talkToListenBalance?.replace("_", " ")}</span>
                        </div>
                      </div>

                      {normalizedAnalysis.toneAndDelivery?.monologueFlagged && (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 space-y-1">
                          <span className="font-bold flex items-center gap-1">⚠️ Monologue Alert: Turn-taking issue</span>
                          <p className="leading-relaxed">{normalizedAnalysis.toneAndDelivery.monologueFeedback}</p>
                        </div>
                      )}

                      <div className="pt-3 border-t border-border">
                        <span className="text-muted-foreground block text-xs font-semibold mb-1">Recommended Next Action</span>
                        <p className="text-xs font-bold text-indigo-600 bg-indigo-50/50 border border-indigo-100 p-2.5 rounded-lg">
                          👉 {normalizedAnalysis.recommendedNextAction}
                        </p>
                      </div>
                    </div>

                    {/* Language & Sentence Framing Quality */}
                    {normalizedAnalysis.language && typeof normalizedAnalysis.language.grammarScore !== "undefined" && (
                      <div className="rounded-xl border border-border p-5 space-y-4">
                        <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                          <Brain className="h-4 w-4 text-indigo-500" />
                          Language, Grammar & Delivery Quality
                        </h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="border border-border rounded-lg p-3 bg-muted/5 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-muted-foreground block uppercase font-semibold">Grammar Score</span>
                              <span className="text-sm font-bold text-foreground">{normalizedAnalysis.language.grammarScore}/100</span>
                            </div>
                            <div className={cn(
                              "h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-bold",
                              normalizedAnalysis.language.grammarScore >= 70 ? "border-emerald-500 text-emerald-600" :
                              normalizedAnalysis.language.grammarScore >= 40 ? "border-amber-500 text-amber-600" : "border-rose-500 text-rose-600"
                            )}>
                              {normalizedAnalysis.language.grammarScore}
                            </div>
                          </div>

                          <div className="border border-border rounded-lg p-3 bg-muted/5 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-muted-foreground block uppercase font-semibold">Sentence Framing</span>
                              <span className="text-sm font-bold text-foreground">{normalizedAnalysis.language.sentenceFramingScore}/100</span>
                            </div>
                            <div className={cn(
                              "h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-bold",
                              normalizedAnalysis.language.sentenceFramingScore >= 70 ? "border-emerald-500 text-emerald-600" :
                              normalizedAnalysis.language.sentenceFramingScore >= 40 ? "border-amber-500 text-amber-600" : "border-rose-500 text-rose-600"
                            )}>
                              {normalizedAnalysis.language.sentenceFramingScore}
                            </div>
                          </div>
                        </div>

                        {normalizedAnalysis.language.sentenceFramingFeedback && (
                          <div className="text-xs text-muted-foreground bg-muted/10 p-3 rounded-lg leading-relaxed">
                            <span className="font-bold text-foreground block mb-1">Sentence Framing & Grammar Review:</span>
                            {normalizedAnalysis.language.sentenceFramingFeedback}
                          </div>
                        )}

                        {normalizedAnalysis.language.fillerRepetitions?.length > 0 && (
                          <div className="text-xs">
                            <span className="text-muted-foreground font-semibold block mb-1">Overused Fillers / Repetitions:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {normalizedAnalysis.language.fillerRepetitions.map((f, i) => (
                                <span key={i} className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-medium text-slate-700 capitalize">
                                  {f}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {normalizedAnalysis.language.redundantTranslations && (
                          <div className="text-xs bg-amber-50/50 border border-amber-100 p-3 rounded-lg text-amber-900">
                            <span className="font-bold block mb-0.5">⚠️ Redundant Dual-Language Translation Detected</span>
                            <p className="italic font-medium mb-1">&ldquo;{normalizedAnalysis.language.redundantTranslationFeedback}&rdquo;</p>
                            <p className="text-[10px] text-amber-700">Counselor repeats concepts consecutively in both languages, which breaks call pacing.</p>
                          </div>
                        )}

                        {normalizedAnalysis.language.clarityConcerns?.length > 0 && (
                          <div className="text-xs bg-rose-50/30 border border-rose-100 p-3 rounded-lg text-rose-900">
                            <span className="font-bold block mb-1">⚠️ Customer Language Clarity Issues:</span>
                            <ul className="list-disc pl-4 space-y-1 text-rose-950 font-medium">
                              {normalizedAnalysis.language.clarityConcerns.map((c, i) => (
                                <li key={i}>{c}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
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

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                <div className="bg-rose-50/30 p-2.5 rounded border border-rose-100/50">
                                  <span className="text-[10px] font-semibold text-rose-800 block mb-1">Customer Quote</span>
                                  <p className="italic text-foreground">&ldquo;{obj.customerQuote}&rdquo;</p>
                                </div>
                                <div className="bg-emerald-50/30 p-2.5 rounded border border-emerald-100/50">
                                  <span className="text-[10px] font-semibold text-emerald-800 block mb-1">Counselor Response</span>
                                  <p className="text-foreground">{obj.counselorResponse}</p>
                                </div>
                              </div>

                              {obj.costEscalated && (
                                <div className="text-xs bg-rose-50 border border-rose-200 p-3 rounded-lg text-rose-950">
                                  <span className="font-bold text-rose-900 block mb-0.5">⚠️ Pricing/Cost Escalation Warning:</span>
                                  <p className="leading-relaxed">{obj.costEscalationDetails}</p>
                                </div>
                              )}

                              {/* LACE indicators */}
                              <div className="pt-2 border-t border-border flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-[10px] font-bold">
                                <span className="text-muted-foreground uppercase shrink-0">LACE Rubric:</span>
                                <div className="flex flex-wrap gap-x-3 gap-y-1">
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

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
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

                      {/* Pitch Alignment & Career Counseling Quality */}
                      {normalizedAnalysis.coaching?.counsellingQuality && (
                        <div className="rounded-xl border border-border p-4 space-y-4 bg-muted/5 text-xs">
                          <h5 className="font-bold text-foreground text-sm flex items-center gap-1.5 pb-2 border-b border-border">
                            <Brain className="h-4 w-4 text-indigo-500" />
                            Consultative Counseling Quality Assessment
                          </h5>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-3 border border-border rounded-lg bg-card space-y-1">
                              <span className="text-[10px] text-muted-foreground block font-semibold uppercase">Counselling Style</span>
                              <span className={cn(
                                "font-bold text-xs px-2 py-0.5 rounded border inline-block",
                                normalizedAnalysis.coaching.counsellingQuality.isConsultative
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-rose-50 text-rose-700 border-rose-200"
                              )}>
                                {normalizedAnalysis.coaching.counsellingQuality.isConsultative ? "Consultative Advisor" : "Transactional / Sales Pitch"}
                              </span>
                            </div>

                            <div className="p-3 border border-border rounded-lg bg-card space-y-1">
                              <span className="text-[10px] text-muted-foreground block font-semibold uppercase">Counselor Empathy</span>
                              <span className={cn(
                                "font-bold text-xs px-2 py-0.5 rounded border inline-block capitalize",
                                normalizedAnalysis.coaching.counsellingQuality.empathyRating === "excellent" || normalizedAnalysis.coaching.counsellingQuality.empathyRating === "good"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : normalizedAnalysis.coaching.counsellingQuality.empathyRating === "neutral"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-rose-50 text-rose-700 border-rose-200"
                              )}>
                                {normalizedAnalysis.coaching.counsellingQuality.empathyRating}
                              </span>
                            </div>
                          </div>

                          {normalizedAnalysis.coaching.pitchAlignment && (
                            <div className="p-3 border border-border rounded-lg bg-card space-y-1">
                              <div className="flex items-center gap-1.5 mb-1">
                                <span className="text-[10px] text-muted-foreground font-semibold uppercase">Lead-Pitch Alignment:</span>
                                <span className={cn(
                                  "font-bold text-[10px] px-1.5 py-0.2 rounded border",
                                  normalizedAnalysis.coaching.pitchAlignment.isAligned
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-rose-50 text-rose-700 border-rose-200"
                                )}>
                                  {normalizedAnalysis.coaching.pitchAlignment.isAligned ? "Aligned" : "Misaligned"}
                                </span>
                              </div>
                              <p className="text-foreground leading-relaxed font-medium">{normalizedAnalysis.coaching.pitchAlignment.feedback}</p>
                            </div>
                          )}

                          <div className="space-y-3 pt-2">
                            <div className="space-y-1">
                              <span className="text-muted-foreground block font-semibold">Career Pathway Guidance:</span>
                              <p className="text-foreground leading-relaxed bg-card p-3 border border-border rounded-lg font-medium">{normalizedAnalysis.coaching.counsellingQuality.pathwayExplanation}</p>
                            </div>

                            <div className="space-y-1">
                              <span className="text-muted-foreground block font-semibold">Advice for Confused / Lost Students:</span>
                              <p className="text-foreground leading-relaxed bg-card p-3 border border-border rounded-lg font-medium">{normalizedAnalysis.coaching.counsellingQuality.lostStudentSupport}</p>
                            </div>
                          </div>
                        </div>
                      )}
 
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
      )}

      {/* Upload and Analyze Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg p-6 relative flex flex-col space-y-4 animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsUploadOpen(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div>
              <h3 className="text-lg font-bold text-foreground">Upload & Analyze Call</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Upload a call recording, assign it to a BDA, and trigger AI compliance auditing.
              </p>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 pt-2">
              {/* File Upload Drop Area */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Call Recording File</label>
                <div className={cn(
                  "border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-muted/10",
                  uploadFile ? "border-emerald-500/50 bg-emerald-50/5 dark:bg-emerald-950/5" : "border-border hover:border-primary/50"
                )}>
                  <input 
                    type="file" 
                    accept="audio/*" 
                    onChange={handleFileChange}
                    className="hidden" 
                    id="recording-file-input"
                  />
                  <label htmlFor="recording-file-input" className="cursor-pointer w-full h-full flex flex-col items-center justify-center space-y-1">
                    {uploadFile ? (
                      <>
                        <FileAudio className="h-8 w-8 text-emerald-500 animate-bounce" />
                        <span className="text-xs font-bold text-foreground max-w-[250px] truncate">{uploadFile.name}</span>
                        <span className="text-[10px] text-muted-foreground">{(uploadFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                      </>
                    ) : (
                      <>
                        <FileAudio className="h-8 w-8 text-muted-foreground/50" />
                        <span className="text-xs font-bold text-foreground">Click to upload audio file</span>
                        <span className="text-[10px] text-muted-foreground">Supports MP3, WAV, M4A, etc.</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Assign Telecaller Profile */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Assign BDA / Telecaller</label>
                <select
                  value={selectedUserForUpload}
                  onChange={(e) => {
                    setSelectedUserForUpload(e.target.value);
                    const user = allUsers.find(u => u.id === e.target.value);
                    if (user) {
                      setManualIsTraining(user.isTraining);
                    }
                  }}
                  className="input text-xs w-full py-2 bg-background border-border"
                  required
                >
                  <option value="">Select BDA Profile...</option>
                  <optgroup label="Trainee BDAs">
                    {allUsers.filter(u => u.isTraining).map(u => (
                      <option key={u.id} value={u.id}>{u.name} (Trainee)</option>
                    ))}
                  </optgroup>
                  <optgroup label="Regular BDAs">
                    {allUsers.filter(u => !u.isTraining).map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Dialed Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Dialed Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g., 9876543210"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="input text-xs w-full py-2"
                    required
                  />
                </div>

                {/* Duration */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Duration (auto-filled)</label>
                  <input
                    type="text"
                    value={manualDuration > 0 ? formatDuration(manualDuration) : "No audio loaded"}
                    disabled
                    className="input text-xs w-full py-2 bg-muted/30 text-muted-foreground font-semibold"
                  />
                </div>
              </div>

              {/* Training Period Toggle */}
              <div className="flex items-center gap-2 py-1">
                <input
                  id="modal-is-training"
                  type="checkbox"
                  checked={manualIsTraining}
                  onChange={(e) => setManualIsTraining(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                />
                <label htmlFor="modal-is-training" className="text-xs font-semibold text-foreground cursor-pointer select-none">
                  Trainee Session (Save to separate Trainings section)
                </label>
              </div>

              {uploadError && (
                <div className="text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/50 p-2.5 rounded-lg">
                  {uploadError}
                </div>
              )}

              {/* Progress/Upload Loader */}
              {uploading ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-primary">
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Uploading & Triggering Audit...
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary animate-pulse w-4/5 rounded-full" />
                  </div>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-all cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  Analyze Recording
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
