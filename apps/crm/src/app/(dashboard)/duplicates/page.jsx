"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CopyCheck,
  CheckCircle2,
  Loader2,
  RefreshCw,
  GitMerge,
  ExternalLink,
} from "lucide-react";
import { crmApi } from "@/lib/api";

const CONFIDENCE_BADGES = {
  high: "crm-badge crm-badge-danger",
  medium: "crm-badge crm-badge-warning",
  low: "crm-badge crm-badge-info",
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
      console.warn("Could not load duplicate reviews from backend:", err.message);
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
            <div className="w-8 h-8 rounded-lg bg-dark-teal-900/60 border border-dark-teal-700/50 text-dark-teal-300 flex items-center justify-center">
              <CopyCheck className="w-4 h-4" />
            </div>
            <h1 className="crm-page-title">Duplicate Candidate Reviews</h1>
          </div>
          <p className="crm-page-subtitle">
            Human-in-the-loop review queue preventing accidental merges and identity collisions.
          </p>
        </div>

        <button
          onClick={fetchReviews}
          className="crm-btn-secondary self-start"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="crm-tab-bar">
        {[
          { label: "Pending Review", value: "pending" },
          { label: "Resolved", value: "resolved_existing_lead" },
          { label: "All Cases", value: "" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={statusFilter === tab.value ? "crm-tab-active" : "crm-tab-inactive"}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Review List */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-platinum-400 gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-dark-teal-400" />
          <span className="text-xs">Checking duplicate candidates...</span>
        </div>
      ) : reviews.length === 0 ? (
        <div className="crm-panel p-12 text-center space-y-3 max-w-lg mx-auto">
          <CheckCircle2 className="w-10 h-10 text-deep-ocean-400 mx-auto" />
          <h3 className="text-sm font-bold text-platinum-50">No Duplicate Conflicts Pending</h3>
          <p className="text-xs text-platinum-400 leading-relaxed">
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
                className="crm-panel p-5 space-y-4"
              >
                {/* Evidence Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-platinum-800">
                  <div className="flex items-center gap-2">
                    <span className={CONFIDENCE_BADGES[rev.confidenceCategory] || "crm-badge crm-badge-info"}>
                      {rev.confidenceCategory} Risk Collision
                    </span>
                    <span className="text-xs text-platinum-200 font-medium">
                      {isCollision
                        ? "Phone and email point to different leads in database"
                        : `Single contact field (${evidence.matchedField || "contact"}) matched existing lead`}
                    </span>
                  </div>
                  <span className="text-[10px] text-platinum-500">
                    Flagged {new Date(rev.createdAt).toLocaleString()}
                  </span>
                </div>

                {/* Side-by-side comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Left: Existing Lead Candidate */}
                  <div className="p-4 rounded-xl bg-platinum-900 border border-platinum-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-dark-teal-300 text-[11px] uppercase tracking-wider">
                        Existing Registered Lead
                      </span>
                      {rev.candidateLeadId && (
                        <Link
                          href={`/leads/${rev.candidateLeadId}`}
                          className="flex items-center gap-1 text-[11px] text-dark-teal-400 hover:text-dark-teal-300 font-medium"
                          target="_blank"
                        >
                          <span>Inspect Profile</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                    <div>
                      <p className="text-platinum-50 font-bold text-sm">{rev.candidateLeadName || "Unnamed"}</p>
                      <p className="text-platinum-400 text-[11px]">Status: {rev.candidateLeadStatus || "new"}</p>
                    </div>
                    <div className="space-y-1 font-mono text-[11px] text-platinum-200 bg-platinum-950/80 p-2 rounded-lg border border-platinum-800/80">
                      <div>Phone: {rev.candidateLeadPhone || "N/A"}</div>
                      <div>Email: {rev.candidateLeadEmail || "N/A"}</div>
                    </div>
                  </div>

                  {/* Right: Incoming Web Submission */}
                  <div className="p-4 rounded-xl bg-platinum-900 border border-platinum-800 space-y-2.5">
                    <span className="font-semibold text-deep-ocean-400 text-[11px] uppercase tracking-wider block">
                      Incoming Web Submission
                    </span>
                    <div>
                      <p className="text-platinum-50 font-bold text-sm">
                        {rev.enquiryFirstName} {rev.enquiryLastName || ""}
                      </p>
                      <p className="text-platinum-400 text-[11px]">Source: Website Contact Form</p>
                    </div>
                    <div className="space-y-1 font-mono text-[11px] text-platinum-200 bg-platinum-950/80 p-2 rounded-lg border border-platinum-800/80">
                      <div>Phone: {rev.enquiryPhone || "N/A"}</div>
                      <div>Email: {rev.enquiryEmail || "N/A"}</div>
                    </div>
                    {rev.enquiryMessage && (
                      <p className="text-platinum-400 italic text-[11px] line-clamp-2">
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
                      className="crm-btn-secondary"
                    >
                      {isProcessing ? "Processing..." : "Confirm Separate People"}
                    </button>

                    <button
                      onClick={() => handleResolve(rev.id, "confirm_same")}
                      disabled={isProcessing}
                      className="crm-btn-primary"
                    >
                      <GitMerge className="w-3.5 h-3.5" />
                      <span>{isProcessing ? "Resolving..." : "Confirm Same Person (Associate)"}</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-right text-[11px] text-deep-ocean-400 font-semibold pt-1">
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
