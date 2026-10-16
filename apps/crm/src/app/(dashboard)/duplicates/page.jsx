"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CopyCheck,
  AlertTriangle,
  CheckCircle2,
  Users,
  ArrowRight,
  Loader2,
  RefreshCw,
  GitMerge,
  ExternalLink,
  ShieldAlert,
  HelpCircle,
} from "lucide-react";
import { crmApi } from "@/lib/api";

const CONFIDENCE_COLORS = {
  high: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  low: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export default function DuplicateReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await crmApi.getDuplicates({ status: statusFilter });
      setReviews(data || []);
    } catch (err) {
      console.error("Failed to load duplicate reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [statusFilter]);

  const handleResolve = async (reviewId, decision) => {
    try {
      setActionLoadingId(reviewId);
      await crmApi.resolveDuplicate(reviewId, {
        decision,
        reason:
          decision === "confirm_same"
            ? "Verified by sales manager as the same prospect"
            : "Verified as separate individual prospect",
      });
      await fetchReviews();
    } catch (err) {
      alert(err.message || "Failed to resolve duplicate review");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <CopyCheck className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white">Duplicate Candidate Reviews</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Human-in-the-loop review queue preventing accidental merges and identity collisions.
          </p>
        </div>

        <button
          onClick={fetchReviews}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium self-start transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        {[
          { label: "Pending Review", value: "pending" },
          { label: "Resolved", value: "resolved_existing_lead" },
          { label: "All Cases", value: "" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              statusFilter === tab.value
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Review List */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-slate-500 gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
          <span className="text-xs">Checking duplicate candidates...</span>
        </div>
      ) : reviews.length === 0 ? (
        <div className="glass-panel p-12 rounded-xl text-center space-y-3 max-w-lg mx-auto">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Duplicate Conflicts Pending</h3>
          <p className="text-xs text-slate-400">
            Incoming website enquiries are cleanly mapped to canonical leads. Any identity collisions will appear here for manager review.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => {
            const isProcessing = actionLoadingId === rev.id;
            const evidence = rev.matchingEvidence || {};
            const isCollision = evidence.conflictType === "phone_email_split";

            return (
              <div
                key={rev.id}
                className="glass-panel rounded-xl border border-slate-800 p-5 space-y-4 hover:border-slate-700 transition-colors"
              >
                {/* Evidence Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${
                        CONFIDENCE_COLORS[rev.confidenceCategory] || "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {rev.confidenceCategory} Risk Collision
                    </span>
                    <span className="text-xs text-slate-300 font-medium">
                      {isCollision
                        ? "Phone and email point to different leads in database"
                        : `Single contact field (${evidence.matchedField || "contact"}) matched existing lead`}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    Flagged {new Date(rev.createdAt).toLocaleString()}
                  </span>
                </div>

                {/* Side-by-side comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Left: Existing Lead Candidate */}
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-indigo-400 text-[11px] uppercase tracking-wider">
                        Existing Registered Lead
                      </span>
                      {rev.candidateLeadId && (
                        <Link
                          href={`/leads/${rev.candidateLeadId}`}
                          className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
                          target="_blank"
                        >
                          <span>Inspect Profile</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{rev.candidateLeadName || "Unnamed"}</p>
                      <p className="text-slate-400 text-[11px]">Status: {rev.candidateLeadStatus || "new"}</p>
                    </div>
                    <div className="space-y-1 font-mono text-[11px] text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                      <div>Phone: {rev.candidateLeadPhone || "N/A"}</div>
                      <div>Email: {rev.candidateLeadEmail || "N/A"}</div>
                    </div>
                  </div>

                  {/* Right: Incoming Web Submission */}
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-2.5">
                    <span className="font-semibold text-emerald-400 text-[11px] uppercase tracking-wider block">
                      Incoming Web Submission
                    </span>
                    <div>
                      <p className="text-white font-bold text-sm">
                        {rev.enquiryFirstName} {rev.enquiryLastName || ""}
                      </p>
                      <p className="text-slate-400 text-[11px]">Source: Website Contact Form</p>
                    </div>
                    <div className="space-y-1 font-mono text-[11px] text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                      <div>Phone: {rev.enquiryPhone || "N/A"}</div>
                      <div>Email: {rev.enquiryEmail || "N/A"}</div>
                    </div>
                    {rev.enquiryMessage && (
                      <p className="text-slate-400 italic text-[11px] line-clamp-2">
                        "{rev.enquiryMessage}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Manager Action Bar */}
                {rev.status === "pending" ? (
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => handleResolve(rev.id, "confirm_separate")}
                      disabled={isProcessing}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold disabled:opacity-50 transition-colors"
                    >
                      {isProcessing ? "Processing..." : "Confirm Separate People"}
                    </button>

                    <button
                      onClick={() => handleResolve(rev.id, "confirm_same")}
                      disabled={isProcessing}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-colors"
                    >
                      <GitMerge className="w-3.5 h-3.5" />
                      <span>{isProcessing ? "Resolving..." : "Confirm Same Person (Associate)"}</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-right text-[11px] text-emerald-400 font-semibold pt-1">
                    ✓ Resolved: {rev.status.replace(/_/g, " ")}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
