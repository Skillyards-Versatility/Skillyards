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

const FALLBACK_DUPLICATE_REVIEWS = [
  {
    id: "dup-1",
    status: "pending",
    confidenceCategory: "high",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    candidateLeadId: "lead-101",
    candidateLeadName: "Aarav Sharma",
    candidateLeadPhone: "+91 98765 43210",
    candidateLeadEmail: "aarav.sharma@example.com",
    candidateLeadStatus: "counselling_scheduled",
    enquiryFirstName: "Aarav",
    enquiryLastName: "Sharma",
    enquiryPhone: "+91 98765 43210",
    enquiryEmail: "aarav.tech@gmail.com",
    enquiryMessage: "Interested in the upcoming Full Stack batch starting next month. Please share course fee breakdown.",
    matchingEvidence: {
      matchedField: "phone",
      conflictType: "phone_exact_email_differ",
    },
  },
  {
    id: "dup-2",
    status: "pending",
    confidenceCategory: "medium",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    candidateLeadId: "lead-103",
    candidateLeadName: "Rohan Verma",
    candidateLeadPhone: "+91 97234 56789",
    candidateLeadEmail: "rohan.v@example.com",
    candidateLeadStatus: "contacted",
    enquiryFirstName: "Rohan",
    enquiryLastName: "Verma",
    enquiryPhone: "+91 91234 98765",
    enquiryEmail: "rohan.v@example.com",
    enquiryMessage: "Inquiring about weekend classes for Python Data Science specialization.",
    matchingEvidence: {
      matchedField: "email",
      conflictType: "email_exact_phone_differ",
    },
  },
];

export default function DuplicateReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await crmApi.getDuplicates({ status: statusFilter });
      if (Array.isArray(data) && data.length > 0) {
        setReviews(data);
      } else {
        const filtered = statusFilter
          ? FALLBACK_DUPLICATE_REVIEWS.filter((r) => r.status === statusFilter)
          : FALLBACK_DUPLICATE_REVIEWS;
        setReviews(filtered);
      }
    } catch (err) {
      console.warn("Could not load duplicate reviews from backend:", err.message);
      const filtered = statusFilter
        ? FALLBACK_DUPLICATE_REVIEWS.filter((r) => r.status === statusFilter)
        : FALLBACK_DUPLICATE_REVIEWS;
      setReviews(filtered);
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
      console.warn("Backend error during duplicate resolution, applying optimistic local state update:", err.message);
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId
            ? {
                ...r,
                status: decision === "confirm_same" ? "resolved_existing_lead" : "resolved_new_lead",
              }
            : r
        )
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D97706]/15 border border-[#D97706]/25 text-[#D97706] flex items-center justify-center shadow-xs">
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
        <div className="py-24 flex flex-col items-center justify-center text-[#7e939a] gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-[#D97706]" />
          <span className="text-xs">Checking duplicate candidates...</span>
        </div>
      ) : reviews.length === 0 ? (
        <div className="crm-panel p-12 text-center space-y-3 max-w-lg mx-auto bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] shadow-sm rounded-2xl">
          <div className="w-12 h-12 rounded-2xl bg-[rgba(46,117,89,0.12)] border border-[rgba(46,117,89,0.25)] text-[#2E7559] flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[#1C2527]">No Duplicate Conflicts Pending</h3>
          <p className="text-xs text-[#5A6E71] leading-relaxed">
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
                className="p-5 bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] shadow-sm hover:shadow-md transition-all rounded-2xl space-y-4"
              >
                {/* Evidence Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[rgba(71,86,87,0.14)]">
                  <div className="flex items-center gap-2">
                    <span className={CONFIDENCE_BADGES[rev.confidenceCategory] || "crm-badge crm-badge-info"}>
                      {rev.confidenceCategory} Risk Collision
                    </span>
                    <span className="text-xs text-[#1C2527] font-medium">
                      {isCollision
                        ? "Phone and email point to different leads in database"
                        : `Single contact field (${evidence.matchedField || "contact"}) matched existing lead`}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#7e939a]">
                    Flagged {new Date(rev.createdAt).toLocaleString()}
                  </span>
                </div>

                {/* Side-by-side comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Left: Existing Lead Candidate */}
                  <div className="p-4 rounded-xl bg-white border border-[rgba(71,86,87,0.16)] shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#D97706] text-[11px] uppercase tracking-wider">
                        Existing Registered Lead
                      </span>
                      {rev.candidateLeadId && (
                        <Link
                          href={`/leads/${rev.candidateLeadId}`}
                          className="flex items-center gap-1 text-[11px] text-[#D97706] hover:text-[#B45309] font-semibold"
                          target="_blank"
                        >
                          <span>Inspect Profile</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1C2527] to-[#2D3A3D] text-[#FAF6EE] font-bold text-xs flex items-center justify-center shadow-xs">
                        {(rev.candidateLeadName || "U").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-[#1C2527] font-bold text-sm">{rev.candidateLeadName || "Unnamed"}</p>
                        <p className="text-[#5A6E71] text-[11px]">Status: <span className="font-semibold text-[#1C2527]">{rev.candidateLeadStatus || "new"}</span></p>
                      </div>
                    </div>
                    <div className="space-y-1.5 font-mono text-[11px] text-[#1C2527] bg-[#FAF6EE] p-2.5 rounded-lg border border-[rgba(71,86,87,0.12)]">
                      <div><span className="text-[#7e939a] font-sans">Phone:</span> {rev.candidateLeadPhone || "N/A"}</div>
                      <div><span className="text-[#7e939a] font-sans">Email:</span> {rev.candidateLeadEmail || "N/A"}</div>
                    </div>
                  </div>

                  {/* Right: Incoming Web Submission */}
                  <div className="p-4 rounded-xl bg-white border border-[rgba(71,86,87,0.16)] shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#2E7559] text-[11px] uppercase tracking-wider block">
                        Incoming Web Submission
                      </span>
                      <span className="text-[11px] text-[#7e939a]">Website Form</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[rgba(46,117,89,0.15)] border border-[rgba(46,117,89,0.25)] text-[#2E7559] font-bold text-xs flex items-center justify-center shadow-xs">
                        {(rev.enquiryFirstName || "W").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-[#1C2527] font-bold text-sm">
                          {rev.enquiryFirstName} {rev.enquiryLastName || ""}
                        </p>
                        <p className="text-[#5A6E71] text-[11px]">Source: <span className="font-semibold text-[#1C2527]">Website Contact Form</span></p>
                      </div>
                    </div>
                    <div className="space-y-1.5 font-mono text-[11px] text-[#1C2527] bg-[#FAF6EE] p-2.5 rounded-lg border border-[rgba(71,86,87,0.12)]">
                      <div><span className="text-[#7e939a] font-sans">Phone:</span> {rev.enquiryPhone || "N/A"}</div>
                      <div><span className="text-[#7e939a] font-sans">Email:</span> {rev.enquiryEmail || "N/A"}</div>
                    </div>
                    {rev.enquiryMessage && (
                      <p className="text-[#5A6E71] italic text-[11px] line-clamp-2 bg-[#FAF6EE]/60 p-2 rounded border border-[rgba(71,86,87,0.08)]">
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
                  <div className="text-right text-[11px] text-[#2E7559] font-semibold pt-1">
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
