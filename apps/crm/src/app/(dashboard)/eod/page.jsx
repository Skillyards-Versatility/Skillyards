"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RotateCcw,
  Calendar,
  Send,
  Lock,
  Edit3,
  ShieldCheck,
  History,
  TrendingUp,
  Award,
  X,
  AlertCircle,
  HelpCircle,
  Users,
  GraduationCap,
  PhoneCall,
  Flame,
} from "lucide-react";
import { crmApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function EodPage() {
  const { user, crmRoles } = useAuth();

  const isManager =
    user?.role === "ADMIN" ||
    user?.role === "MANAGER" ||
    crmRoles?.includes("crm_admin") ||
    crmRoles?.includes("sales_manager") ||
    crmRoles?.includes("sales_lead");

  // Selected date (YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Tab view: 'submission' | 'history'
  const [activeTab, setActiveTab] = useState("submission");

  // Preview & Submission states
  const [preview, setPreview] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(true);
  const [previewError, setPreviewError] = useState(null);

  // Form input state
  const [actualsForm, setActualsForm] = useState({
    dials: 0,
    connects: 0,
    talkTimeMinutes: 0,
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // History / Team reports state
  const [reportsList, setReportsList] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyScope, setHistoryScope] = useState("all");

  // Manager Amendment Modal
  const [amendReport, setAmendReport] = useState(null);
  const [amendForm, setAmendForm] = useState({
    dials: 0,
    connects: 0,
    talkTimeMinutes: 0,
    notes: "",
    amendmentReason: "",
  });
  const [amending, setAmending] = useState(false);

  // Revision History Drawer
  const [historyDrawerReport, setHistoryDrawerReport] = useState(null);
  const [detailedHistory, setDetailedHistory] = useState(null);
  const [loadingDetailedHistory, setLoadingDetailedHistory] = useState(false);

  // Load EOD preview
  const fetchPreview = async (date) => {
    setLoadingPreview(true);
    setPreviewError(null);
    try {
      const res = await crmApi.getEodPreview({ date });
      setPreview(res);
      if (res?.currentActuals) {
        setActualsForm({
          dials: res.currentActuals.dials || 0,
          connects: res.currentActuals.connects || 0,
          talkTimeMinutes: res.currentActuals.talkTimeMinutes || 0,
          notes: res.currentActuals.notes || "",
        });
      }
    } catch (err) {
      console.warn("Could not reach backend API server:", err.message);
      setPreviewError(err.message || "Failed to load EOD preview");
      // Resilient fallback baseline preview so that the UI, formula breakdown, and gauges work smoothly in offline dev
      const curDate = date || selectedDate || new Date().toISOString().split("T")[0];
      setPreview((prev) => prev || {
        isOffline: true,
        user: { name: user?.name || "Representative", team: "sales" },
        date: curDate,
        isSunday: new Date(curDate).getDay() === 0,
        isCutoffPassed: false,
        isSubmitted: false,
        isLocked: false,
        targets: {
          configVersion: "v1.0",
          baselineDials: 120,
          baselineConnects: 50,
          talkTimeTargetMinutes: 90,
          completedCounselling: 0,
          counsellingReliefDials: 0,
          counsellingReliefConnects: 0,
          dialTarget: 120,
          connectTarget: 50,
        },
        autoActuals: {
          dials: 0,
          connects: 0,
          talkTimeMinutes: 0,
          counsellingCompleted: 0,
          notes: "",
        },
        currentActuals: {
          dials: 0,
          connects: 0,
          talkTimeMinutes: 0,
          counsellingCompleted: 0,
          notes: "",
        },
      });
    } finally {
      setLoadingPreview(false);
    }
  };

  // Load team/history reports
  const fetchReportsList = async () => {
    setLoadingHistory(true);
    try {
      const params = {
        limit: 50,
      };
      if (historyScope === "my") {
        params.userId = user?.id;
      }
      const res = await crmApi.getEodReports(params);
      setReportsList(res.reports || []);
    } catch (err) {
      console.warn("Could not load EOD reports history from backend:", err.message);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchPreview(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (activeTab === "history") {
      fetchReportsList();
    }
  }, [activeTab, historyScope]);

  // Handle Initial Submission
  const handleSubmitReport = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await crmApi.submitEodReport({
        date: selectedDate,
        actuals: actualsForm,
      });
      await fetchPreview(selectedDate);
      alert("Authoritative EOD Report submitted and locked successfully!");
    } catch (err) {
      alert(err.message || "Failed to submit EOD report");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Manager Amendment Submit
  const handleAmendSubmit = async (e) => {
    e.preventDefault();
    if (!amendForm.amendmentReason?.trim()) {
      alert("An amendment reason is strictly required by audit policy");
      return;
    }
    setAmending(true);
    try {
      await crmApi.amendEodReport(amendReport.id, {
        actuals: {
          dials: amendForm.dials,
          connects: amendForm.connects,
          talkTimeMinutes: amendForm.talkTimeMinutes,
          notes: amendForm.notes,
        },
        amendmentReason: amendForm.amendmentReason,
      });
      setAmendReport(null);
      await fetchPreview(selectedDate);
      if (activeTab === "history") {
        await fetchReportsList();
      }
      alert("EOD report amended with revision increment and audit event logged.");
    } catch (err) {
      alert(err.message || "Failed to amend EOD report");
    } finally {
      setAmending(false);
    }
  };

  // Open Revision History
  const openRevisionHistory = async (report) => {
    setHistoryDrawerReport(report);
    setLoadingDetailedHistory(true);
    try {
      const detailed = await crmApi.getEodReport(report.id);
      setDetailedHistory(detailed);
    } catch (err) {
      console.warn("Could not load report detail from backend:", err.message);
      setDetailedHistory(null);
    } finally {
      setLoadingDetailedHistory(false);
    }
  };

  // Live client attainment calculation preview based on current form values
  const liveAttainment = useMemo(() => {
    if (!preview?.targets) return null;
    const dials = Math.max(0, parseInt(actualsForm.dials, 10) || 0);
    const connects = Math.max(0, parseInt(actualsForm.connects, 10) || 0);
    const talkTime = Math.max(0, parseFloat(actualsForm.talkTimeMinutes) || 0);

    const dialTarget = preview.targets.dialTarget || 1;
    const connectTarget = preview.targets.connectTarget || 1;
    const talkTarget = preview.targets.talkTimeTargetMinutes || 90;

    const dialPct = Math.round((dials / dialTarget) * 1000) / 10;
    const connectPct = Math.round((connects / connectTarget) * 1000) / 10;
    const talkPct = Math.round((talkTime / talkTarget) * 1000) / 10;

    const isMet = dials >= dialTarget && connects >= connectTarget && talkTime >= talkTarget;

    return {
      dialPct,
      connectPct,
      talkPct,
      isMet,
    };
  }, [actualsForm, preview]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="crm-page-title">Server-Authoritative EOD Attainment</h1>
            <span className="crm-badge crm-badge-qualified">Track 3</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-dark-teal-900/80 text-deep-ocean-300 border border-dark-teal-700/50 font-mono">
              SPEC-6 / SPEC-8
            </span>
          </div>
          <p className="crm-page-subtitle">
            Authoritative target calculation, completed counselling target relief, and tamper-proof submission engine.
          </p>
        </div>

        {/* Date Selector & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 bg-platinum-900 border border-platinum-800 rounded-lg px-3 py-1.5">
            <Calendar className="w-3.5 h-3.5 text-deep-ocean-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent border-none text-xs font-mono text-platinum-100 outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={() => fetchPreview(selectedDate)}
            className="crm-btn-secondary"
            title="Recalculate targets from server"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Recalculate
          </button>
        </div>
      </div>

      {/* Offline Mode Banner */}
      {preview?.isOffline && (
        <div className="p-4 rounded-xl bg-pale-oak-950/60 border border-pale-oak-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-pale-oak-900/80 border border-pale-oak-700/70 flex items-center justify-center shrink-0 text-pale-oak-400">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-platinum-100">
                Offline Development Mode (Local Fallback Preview)
              </p>
              <p className="text-platinum-400 mt-0.5">
                Backend server on port 3000 is not reachable. Showing standard baseline targets (120 Dials, 50 Connects, 90m Talk Time). Run <span className="font-mono text-deep-ocean-300">cd apps/api && npm run dev</span> to connect to live database.
              </p>
            </div>
          </div>
          <button
            onClick={() => fetchPreview(selectedDate)}
            className="crm-btn-secondary shrink-0 text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retry Connection
          </button>
        </div>
      )}

      {/* Policy & Formula Banner */}
      <div className="crm-panel p-4 bg-gradient-to-r from-dark-teal-950/80 via-platinum-950 to-deep-ocean-950/40 border border-dark-teal-800/40">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-dark-teal-900/70 border border-dark-teal-700/60 flex items-center justify-center shrink-0 text-deep-ocean-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-platinum-100">
                  Server-Owned Target Engine (Config v1.0)
                </h2>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-dark-teal-900/90 text-platinum-300 border border-dark-teal-700/60 font-mono">
                  Locked Formula
                </span>
              </div>
              <p className="text-xs text-platinum-400 mt-0.5">
                Targets are calculated exclusively by the server: <span className="font-mono text-deep-ocean-300">dialTarget = max(0, 120 - totalCounselling * 15)</span>, <span className="font-mono text-deep-ocean-300">connectTarget = max(30, 50 - totalCounselling * 5)</span>, and <span className="font-mono text-platinum-200">90 min talk time</span>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {preview?.isLocked ? (
              <span className="crm-badge crm-badge-converted flex items-center gap-1.5 !py-1 !px-2.5">
                <Lock className="w-3 h-3" />
                <span>Report Locked (v{preview?.existingReport?.data?.revision || 1})</span>
              </span>
            ) : preview?.isCutoffPassed ? (
              <span className="crm-badge crm-badge-warning flex items-center gap-1.5 !py-1 !px-2.5">
                <Clock className="w-3 h-3" />
                <span>Past 7:30 PM Cutoff</span>
              </span>
            ) : preview?.isSunday ? (
              <span className="crm-badge crm-badge-lost flex items-center gap-1.5 !py-1 !px-2.5">
                <AlertCircle className="w-3 h-3" />
                <span>Closed (Sunday)</span>
              </span>
            ) : (
              <span className="crm-badge crm-badge-completed flex items-center gap-1.5 !py-1 !px-2.5">
                <CheckCircle2 className="w-3 h-3" />
                <span>Submissions Open</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Target Relief Breakdown Banner Card */}
      {preview?.targets && (
        <div className="crm-panel p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-platinum-800 pb-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-pale-oak-400" />
              <h3 className="text-xs font-bold text-platinum-200 uppercase tracking-wider">
                Authoritative Target Relief Calculation
              </h3>
            </div>
            <div className="text-xs text-platinum-400">
              Verified Completed Sessions Today:{" "}
              <span className="font-bold text-deep-ocean-300 font-mono">
                {preview.targets.completedCounselling}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Dials Calculation */}
            <div className="p-3.5 rounded-lg bg-platinum-900 border border-platinum-800 space-y-2">
              <div className="text-platinum-400 flex justify-between font-medium">
                <span>Dials Target Formula</span>
                <span className="text-[10px] text-platinum-500 font-mono">Baseline 120</span>
              </div>
              <div className="font-mono text-sm text-platinum-200">
                120 - ({preview.targets.completedCounselling} × 15) ={" "}
                <span className="text-deep-ocean-300 font-bold text-base">
                  {preview.targets.dialTarget} Dials
                </span>
              </div>
              <p className="text-[11px] text-platinum-500">
                Reduced by {preview.targets.completedCounselling * 15} dials from completed counselling.
              </p>
            </div>

            {/* Connects Calculation */}
            <div className="p-3.5 rounded-lg bg-platinum-900 border border-platinum-800 space-y-2">
              <div className="text-platinum-400 flex justify-between font-medium">
                <span>Connects Target Formula</span>
                <span className="text-[10px] text-platinum-500 font-mono">Floor 30</span>
              </div>
              <div className="font-mono text-sm text-platinum-200">
                50 - ({preview.targets.completedCounselling} × 5) ={" "}
                <span className="text-deep-ocean-300 font-bold text-base">
                  {preview.targets.connectTarget} Connects
                </span>
              </div>
              <p className="text-[11px] text-platinum-500">
                Floor of 30 connects guaranteed to ensure minimum daily pipeline volume.
              </p>
            </div>

            {/* Talk Time Calculation */}
            <div className="p-3.5 rounded-lg bg-platinum-900 border border-platinum-800 space-y-2">
              <div className="text-platinum-400 flex justify-between font-medium">
                <span>Talk-Time Target</span>
                <span className="text-[10px] text-platinum-500 font-mono">Constant</span>
              </div>
              <div className="font-mono text-sm text-platinum-200">
                Fixed Daily Benchmark ={" "}
                <span className="text-deep-ocean-300 font-bold text-base">
                  90 Minutes
                </span>
              </div>
              <p className="text-[11px] text-platinum-500">
                Equivalent to 5,400 seconds of active prospect communication.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* KPI Attainment Gauges Grid */}
      {preview?.targets && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Dial Attainment */}
          <div className="crm-card p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-platinum-400">Dials Attainment</span>
              <span
                className={`font-mono font-bold text-xs ${
                  liveAttainment?.dialPct >= 100
                    ? "text-deep-ocean-300"
                    : "text-pale-oak-400"
                }`}
              >
                {liveAttainment?.dialPct}%
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-platinum-100">
                {actualsForm.dials}
              </span>
              <span className="text-xs text-platinum-500 font-mono">
                / {preview.targets.dialTarget} target
              </span>
            </div>
            <div className="w-full bg-platinum-900 rounded-full h-2 overflow-hidden border border-platinum-800">
              <div
                className={`h-full transition-all duration-300 ${
                  liveAttainment?.dialPct >= 100
                    ? "bg-gradient-to-r from-dark-teal-500 to-deep-ocean-400"
                    : "bg-pale-oak-500"
                }`}
                style={{ width: `${Math.min(liveAttainment?.dialPct || 0, 100)}%` }}
              />
            </div>
          </div>

          {/* Connects Attainment */}
          <div className="crm-card p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-platinum-400">Connects Attainment</span>
              <span
                className={`font-mono font-bold text-xs ${
                  liveAttainment?.connectPct >= 100
                    ? "text-deep-ocean-300"
                    : "text-pale-oak-400"
                }`}
              >
                {liveAttainment?.connectPct}%
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-platinum-100">
                {actualsForm.connects}
              </span>
              <span className="text-xs text-platinum-500 font-mono">
                / {preview.targets.connectTarget} target
              </span>
            </div>
            <div className="w-full bg-platinum-900 rounded-full h-2 overflow-hidden border border-platinum-800">
              <div
                className={`h-full transition-all duration-300 ${
                  liveAttainment?.connectPct >= 100
                    ? "bg-gradient-to-r from-dark-teal-500 to-deep-ocean-400"
                    : "bg-pale-oak-500"
                }`}
                style={{ width: `${Math.min(liveAttainment?.connectPct || 0, 100)}%` }}
              />
            </div>
          </div>

          {/* Talk-Time Attainment */}
          <div className="crm-card p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-platinum-400">Talk Time Attainment</span>
              <span
                className={`font-mono font-bold text-xs ${
                  liveAttainment?.talkPct >= 100
                    ? "text-deep-ocean-300"
                    : "text-pale-oak-400"
                }`}
              >
                {liveAttainment?.talkPct}%
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-platinum-100">
                {actualsForm.talkTimeMinutes}m
              </span>
              <span className="text-xs text-platinum-500 font-mono">
                / 90m target
              </span>
            </div>
            <div className="w-full bg-platinum-900 rounded-full h-2 overflow-hidden border border-platinum-800">
              <div
                className={`h-full transition-all duration-300 ${
                  liveAttainment?.talkPct >= 100
                    ? "bg-gradient-to-r from-dark-teal-500 to-deep-ocean-400"
                    : "bg-pale-oak-500"
                }`}
                style={{ width: `${Math.min(liveAttainment?.talkPct || 0, 100)}%` }}
              />
            </div>
          </div>

          {/* Overall Status Badge */}
          <div className="crm-card p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-platinum-400">
              <span>Overall Achievement</span>
              {liveAttainment?.isMet ? (
                <Award className="w-4 h-4 text-deep-ocean-400" />
              ) : (
                <Flame className="w-4 h-4 text-pale-oak-400" />
              )}
            </div>
            <div className="my-1">
              {liveAttainment?.isMet ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-deep-ocean-950 text-deep-ocean-300 border border-deep-ocean-700/60 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>TARGET MET</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-pale-oak-950 text-pale-oak-300 border border-pale-oak-700/60 font-bold text-sm">
                  <Clock className="w-4 h-4" />
                  <span>DEFICIT PENDING</span>
                </div>
              )}
            </div>
            <p className="text-[10px] text-platinum-500">
              {liveAttainment?.isMet
                ? "All 3 daily operational benchmarks satisfied."
                : "Complete remaining dial, connect, or talk-time requirements."}
            </p>
          </div>
        </div>
      )}

      {/* Tabs: Active Submission vs History */}
      <div className="crm-tab-bar">
        <button
          onClick={() => setActiveTab("submission")}
          className={activeTab === "submission" ? "crm-tab-active" : "crm-tab-inactive"}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>EOD Submission & Verification</span>
          {preview?.isLocked && (
            <span className="crm-tab-badge-active">Locked</span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={activeTab === "history" ? "crm-tab-active" : "crm-tab-inactive"}
        >
          <History className="w-3.5 h-3.5" />
          <span>Submissions & Amendment History</span>
        </button>
      </div>

      {/* TAB 1: SUBMISSION / LOCKED VIEW */}
      {activeTab === "submission" && (
        <div className="crm-panel p-6 space-y-6">
          {loadingPreview ? (
            <div className="py-12 text-center text-platinum-400">
              <div className="w-8 h-8 border-2 border-dark-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs">Calculating authoritative targets and extracting live CRM actuals...</p>
            </div>
          ) : (previewError && !preview) ? (
            <div className="p-8 text-center max-w-lg mx-auto space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-dark-wine-950/80 border border-dark-wine-800/60 flex items-center justify-center mx-auto text-dark-wine-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-semibold text-sm text-platinum-100">
                  Unable to Load Server EOD Preview
                </h3>
                <p className="text-xs text-platinum-400">
                  {previewError}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-platinum-950 border border-platinum-800 text-left font-mono text-[11px] text-platinum-300 space-y-1">
                <div className="text-platinum-500 font-sans text-[10px] uppercase font-bold tracking-wider">
                  Check Service Health:
                </div>
                <div>1. Ensure API backend is running: <span className="text-deep-ocean-400">cd apps/api && npm run dev</span></div>
                <div>2. Verify backend endpoint at: <span className="text-deep-ocean-400">http://localhost:3000/api/crm/me</span></div>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => fetchPreview(selectedDate)}
                  className="crm-btn-primary"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Try Again
                </button>
              </div>
            </div>
          ) : preview?.isLocked ? (
            /* --- LOCKED SUBMITTED REPORT VIEW --- */
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-deep-ocean-950/40 border border-deep-ocean-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-deep-ocean-900/60 border border-deep-ocean-700/60 flex items-center justify-center shrink-0 text-deep-ocean-300">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-platinum-100">
                        EOD Report Formally Submitted & Persisted
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-deep-ocean-900 text-deep-ocean-300 border border-deep-ocean-700">
                        Revision v{preview.existingReport?.data?.revision || 1}
                      </span>
                    </div>
                    <p className="text-xs text-platinum-400 mt-0.5">
                      Submitted on {new Date(preview.existingReport?.submittedAt).toLocaleString("en-GB")} by{" "}
                      <span className="text-platinum-200 font-semibold">{preview.existingReport?.data?.submittedByUserName || preview.user?.name}</span>.
                    </p>
                  </div>
                </div>

                {isManager && (
                  <button
                    onClick={() => {
                      setAmendReport(preview.existingReport);
                      setAmendForm({
                        dials: preview.existingReport.data?.actuals?.dials || 0,
                        connects: preview.existingReport.data?.actuals?.connects || 0,
                        talkTimeMinutes: preview.existingReport.data?.actuals?.talkTimeMinutes || 0,
                        notes: preview.existingReport.data?.actuals?.notes || "",
                        amendmentReason: "",
                      });
                    }}
                    className="crm-btn-secondary shrink-0"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Manager Amend
                  </button>
                )}
              </div>

              {/* Submitted Figures Table */}
              <div className="crm-card p-5 space-y-4">
                <h4 className="text-xs font-bold text-platinum-300 uppercase tracking-wider">
                  Persisted EOD Attainment Snapshot
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                  <div className="p-3 rounded bg-platinum-900 border border-platinum-800">
                    <span className="text-platinum-500 text-[10px] uppercase block">Dials</span>
                    <span className="text-lg font-bold text-platinum-100">
                      {preview.existingReport.data?.actuals?.dials}
                    </span>
                    <span className="text-platinum-500 text-xs"> / {preview.existingReport.data?.targets?.dialTarget}</span>
                  </div>

                  <div className="p-3 rounded bg-platinum-900 border border-platinum-800">
                    <span className="text-platinum-500 text-[10px] uppercase block">Connects</span>
                    <span className="text-lg font-bold text-platinum-100">
                      {preview.existingReport.data?.actuals?.connects}
                    </span>
                    <span className="text-platinum-500 text-xs"> / {preview.existingReport.data?.targets?.connectTarget}</span>
                  </div>

                  <div className="p-3 rounded bg-platinum-900 border border-platinum-800">
                    <span className="text-platinum-500 text-[10px] uppercase block">Talk Time</span>
                    <span className="text-lg font-bold text-platinum-100">
                      {preview.existingReport.data?.actuals?.talkTimeMinutes}m
                    </span>
                    <span className="text-platinum-500 text-xs"> / 90m</span>
                  </div>

                  <div className="p-3 rounded bg-platinum-900 border border-platinum-800">
                    <span className="text-platinum-500 text-[10px] uppercase block">Counselling Credited</span>
                    <span className="text-lg font-bold text-deep-ocean-300">
                      {preview.existingReport.data?.targets?.completedCounselling || 0}
                    </span>
                    <span className="text-platinum-500 text-xs"> sessions</span>
                  </div>
                </div>

                {preview.existingReport.data?.actuals?.notes && (
                  <div className="p-3 rounded bg-platinum-900/60 border border-platinum-800 text-xs text-platinum-300">
                    <span className="font-semibold text-platinum-400 block mb-1">Rep Remarks:</span>
                    "{preview.existingReport.data.actuals.notes}"
                  </div>
                )}

                {preview.existingReport.data?.revisions?.length > 1 && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => openRevisionHistory(preview.existingReport)}
                      className="crm-lead-link text-xs flex items-center gap-1.5"
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>View All {preview.existingReport.data.revisions.length} Revisions</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* --- SUBMISSION FORM --- */
            <form onSubmit={handleSubmitReport} className="space-y-6">
              <div className="flex items-center justify-between border-b border-platinum-800 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-platinum-100">
                    Daily Sales Attainment Verification
                  </h3>
                  <p className="text-xs text-platinum-400 mt-0.5">
                    Call actuals auto-extracted from CRM logs for {preview?.user?.name} on {selectedDate}.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-deep-ocean-400 bg-platinum-900 px-2 py-0.5 rounded border border-platinum-800">
                  Target Config: v1.0
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="crm-label flex justify-between">
                    <span>Total Dials *</span>
                    <span className="text-platinum-500 font-normal">Target: {preview?.targets?.dialTarget}</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={actualsForm.dials}
                    onChange={(e) => setActualsForm({ ...actualsForm, dials: e.target.value })}
                    className="crm-input font-mono text-base font-bold"
                  />
                  <span className="text-[10px] text-platinum-500 mt-1 block">
                    Auto-counted: {preview?.autoActuals?.dials} logged CRM calls
                  </span>
                </div>

                <div>
                  <label className="crm-label flex justify-between">
                    <span>Successful Connects *</span>
                    <span className="text-platinum-500 font-normal">Target: {preview?.targets?.connectTarget}</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={actualsForm.connects}
                    onChange={(e) => setActualsForm({ ...actualsForm, connects: e.target.value })}
                    className="crm-input font-mono text-base font-bold"
                  />
                  <span className="text-[10px] text-platinum-500 mt-1 block">
                    Auto-counted: {preview?.autoActuals?.connects} connected calls
                  </span>
                </div>

                <div>
                  <label className="crm-label flex justify-between">
                    <span>Talk Time (Minutes) *</span>
                    <span className="text-platinum-500 font-normal">Target: 90 mins</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    required
                    value={actualsForm.talkTimeMinutes}
                    onChange={(e) => setActualsForm({ ...actualsForm, talkTimeMinutes: e.target.value })}
                    className="crm-input font-mono text-base font-bold"
                  />
                  <span className="text-[10px] text-platinum-500 mt-1 block">
                    Auto-calculated: {preview?.autoActuals?.talkTimeMinutes}m total duration
                  </span>
                </div>

                <div className="col-span-1 md:col-span-3">
                  <label className="crm-label">Daily Notes & Operational Remarks</label>
                  <textarea
                    rows={3}
                    placeholder="Describe batch promotions discussed, pipeline highlights, student queries handled..."
                    value={actualsForm.notes}
                    onChange={(e) => setActualsForm({ ...actualsForm, notes: e.target.value })}
                    className="crm-textarea"
                  />
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-3 rounded-lg bg-platinum-900/60 border border-platinum-800 text-xs text-platinum-400 space-y-1">
                <div className="font-semibold text-platinum-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-deep-ocean-400" />
                  <span>Audit Enforcement Notice</span>
                </div>
                <p>
                  Upon submission, your actuals are validated, authoritative attainment metrics are locked, and this record can only be altered through a documented manager amendment.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="crm-btn-primary !px-5 !py-2.5"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? "Verifying & Submitting..." : "Submit Authoritative EOD Report"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* TAB 2: TEAM SUBMISSIONS & HISTORY */}
      {activeTab === "history" && (
        <div className="crm-panel overflow-hidden space-y-4 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-platinum-800">
            <div>
              <h3 className="font-bold text-sm text-platinum-100">
                EOD Submissions Ledger
              </h3>
              <p className="text-xs text-platinum-400">
                Audited daily attainment reports with revision history and manager controls.
              </p>
            </div>

            {isManager && (
              <div className="flex items-center bg-platinum-900 border border-platinum-800 rounded-lg p-0.5 text-xs font-medium">
                <button
                  onClick={() => setHistoryScope("all")}
                  className={`px-3 py-1 rounded-md transition-all ${
                    historyScope === "all" ? "bg-dark-teal-700 text-platinum-50 font-semibold" : "text-platinum-400 hover:text-platinum-200"
                  }`}
                >
                  All Team
                </button>
                <button
                  onClick={() => setHistoryScope("my")}
                  className={`px-3 py-1 rounded-md transition-all ${
                    historyScope === "my" ? "bg-dark-teal-700 text-platinum-50 font-semibold" : "text-platinum-400 hover:text-platinum-200"
                  }`}
                >
                  My Submissions
                </button>
              </div>
            )}
          </div>

          {loadingHistory ? (
            <div className="py-12 text-center text-platinum-400">
              <div className="w-8 h-8 border-2 border-dark-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs">Loading EOD reports...</p>
            </div>
          ) : reportsList.length === 0 ? (
            <div className="py-12 text-center text-platinum-400 space-y-2">
              <FileSpreadsheet className="w-8 h-8 text-platinum-600 mx-auto" />
              <p className="font-semibold text-platinum-200 text-sm">No EOD reports found</p>
              <p className="text-xs text-platinum-500">No reports have been submitted for the selected filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="crm-table">
                <thead className="crm-thead">
                  <tr>
                    <th className="crm-th">Date & Rep</th>
                    <th className="crm-th">Dials (Act / Tgt)</th>
                    <th className="crm-th">Connects (Act / Tgt)</th>
                    <th className="crm-th">Talk Time</th>
                    <th className="crm-th">Counselling</th>
                    <th className="crm-th">Status</th>
                    <th className="crm-th text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="crm-tbody">
                  {reportsList.map((r) => {
                    const data = r.data || {};
                    const targets = data.targets || {};
                    const actuals = data.actuals || {};
                    const attainment = data.attainment || {};
                    const isMet = attainment.targetMet;
                    const revision = data.revision || 1;

                    return (
                      <tr key={r.id} className="crm-tr">
                        <td className="crm-td">
                          <div className="font-semibold text-platinum-100">{r.userName || "Staff Member"}</div>
                          <div className="font-mono text-[11px] text-platinum-400">{r.date}</div>
                        </td>

                        <td className="crm-td font-mono">
                          <span className={actuals.dials >= targets.dialTarget ? "text-deep-ocean-300 font-bold" : "text-platinum-300"}>
                            {actuals.dials || 0}
                          </span>
                          <span className="text-platinum-500"> / {targets.dialTarget}</span>
                        </td>

                        <td className="crm-td font-mono">
                          <span className={actuals.connects >= targets.connectTarget ? "text-deep-ocean-300 font-bold" : "text-platinum-300"}>
                            {actuals.connects || 0}
                          </span>
                          <span className="text-platinum-500"> / {targets.connectTarget}</span>
                        </td>

                        <td className="crm-td font-mono">
                          <span>{actuals.talkTimeMinutes || 0}m</span>
                          <span className="text-platinum-500"> / 90m</span>
                        </td>

                        <td className="crm-td font-mono text-deep-ocean-300">
                          {targets.completedCounselling || 0}
                        </td>

                        <td className="crm-td">
                          {isMet ? (
                            <span className="crm-badge crm-badge-completed">Met</span>
                          ) : (
                            <span className="crm-badge crm-badge-warning">Deficit</span>
                          )}
                          {revision > 1 && (
                            <span className="ml-1 text-[10px] font-mono text-pale-oak-400">
                              (v{revision})
                            </span>
                          )}
                        </td>

                        <td className="crm-td text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isManager && (
                              <button
                                onClick={() => {
                                  setAmendReport(r);
                                  setAmendForm({
                                    dials: actuals.dials || 0,
                                    connects: actuals.connects || 0,
                                    talkTimeMinutes: actuals.talkTimeMinutes || 0,
                                    notes: actuals.notes || "",
                                    amendmentReason: "",
                                  });
                                }}
                                className="crm-btn-ghost text-xs"
                                title="Amend report"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                Amend
                              </button>
                            )}

                            <button
                              onClick={() => openRevisionHistory(r)}
                              className="crm-btn-ghost"
                              title="View audit & revision history"
                            >
                              <History className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* --- MODAL: MANAGER AMENDMENT (AUDITED) --- */}
      {amendReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="crm-panel w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-platinum-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-deep-ocean-400" />
                <h3 className="font-bold text-sm text-platinum-100">
                  Manager Amendment — {amendReport.userName} ({amendReport.date})
                </h3>
              </div>
              <button
                onClick={() => setAmendReport(null)}
                className="text-platinum-400 hover:text-platinum-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-platinum-900 rounded-lg border border-platinum-800 text-xs space-y-1">
              <div>Current Revision: <span className="font-mono text-platinum-200">v{amendReport.data?.revision || 1}</span></div>
              <div className="text-platinum-400">
                Submitting this amendment will create <strong className="text-deep-ocean-300">Revision v{(amendReport.data?.revision || 1) + 1}</strong> and archive the prior snapshot.
              </div>
            </div>

            <form onSubmit={handleAmendSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="crm-label">Dials</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={amendForm.dials}
                    onChange={(e) => setAmendForm({ ...amendForm, dials: e.target.value })}
                    className="crm-input font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="crm-label">Connects</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={amendForm.connects}
                    onChange={(e) => setAmendForm({ ...amendForm, connects: e.target.value })}
                    className="crm-input font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="crm-label">Talk (Mins)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    required
                    value={amendForm.talkTimeMinutes}
                    onChange={(e) => setAmendForm({ ...amendForm, talkTimeMinutes: e.target.value })}
                    className="crm-input font-mono font-bold"
                  />
                </div>

                <div className="col-span-3">
                  <label className="crm-label text-dark-wine-300">
                    Mandatory Amendment Reason (Audit Enforced) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Explain why this EOD submission is being modified (e.g. verified telephony disconnect, manual call adjustment approved)..."
                    value={amendForm.amendmentReason}
                    onChange={(e) => setAmendForm({ ...amendForm, amendmentReason: e.target.value })}
                    className="crm-textarea !border-dark-wine-700/60"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-platinum-800">
                <button
                  type="button"
                  onClick={() => setAmendReport(null)}
                  className="crm-btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={amending}
                  className="crm-btn-danger"
                >
                  {amending ? "Amending..." : "Authorize Amendment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DRAWER: REVISION HISTORY & AUDIT TRAIL --- */}
      {historyDrawerReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm">
          <div className="crm-panel w-full max-w-lg h-full p-6 space-y-4 overflow-y-auto rounded-none border-l border-platinum-800">
            <div className="flex items-center justify-between border-b border-platinum-800 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-deep-ocean-400" />
                <h3 className="font-bold text-sm text-platinum-100">
                  EOD Audit & Revision Ledger
                </h3>
              </div>
              <button
                onClick={() => setHistoryDrawerReport(null)}
                className="text-platinum-400 hover:text-platinum-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-platinum-900 rounded-lg border border-platinum-800 text-xs">
              <div className="font-semibold text-platinum-100 text-sm">
                {historyDrawerReport.userName}
              </div>
              <div className="text-platinum-400 mt-1 font-mono">
                Date: {historyDrawerReport.date} • Current: v{historyDrawerReport.data?.revision || 1}
              </div>
            </div>

            {loadingDetailedHistory ? (
              <div className="py-8 text-center text-platinum-500 text-xs">
                Loading revision history...
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold text-platinum-400 uppercase tracking-wider">
                  Revisions Collection
                </h4>

                {detailedHistory?.data?.revisions?.map((rev, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg bg-platinum-900 border border-platinum-800 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-deep-ocean-300">
                        Revision v{rev.revision}
                      </span>
                      <span className="text-[10px] text-platinum-500 font-mono">
                        {new Date(rev.timestamp).toLocaleString("en-GB")}
                      </span>
                    </div>

                    <div className="text-[11px] text-platinum-400">
                      Actor: <span className="text-platinum-200 font-semibold">{rev.actorName}</span>
                    </div>

                    {rev.reason && (
                      <div className="p-2 rounded bg-dark-wine-950/40 border border-dark-wine-800/60 text-[11px] text-platinum-200">
                        <span className="font-bold text-dark-wine-300 block mb-0.5">Amendment Reason:</span>
                        "{rev.reason}"
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-2 font-mono text-[11px] pt-1 border-t border-platinum-800/60">
                      <div>Dials: {rev.actuals?.dials}</div>
                      <div>Connects: {rev.actuals?.connects}</div>
                      <div>Talk: {rev.actuals?.talkTimeMinutes}m</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 border-t border-platinum-800">
              <button
                onClick={() => setHistoryDrawerReport(null)}
                className="crm-btn-secondary w-full"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
