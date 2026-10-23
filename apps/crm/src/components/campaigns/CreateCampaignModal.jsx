"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Target,
  Sparkles,
  Link as LinkIcon,
  Copy,
  Check,
  Calendar,
  IndianRupee,
  Layers,
  Share2,
} from "lucide-react";
import { crmApi } from "@/lib/api";

const PLATFORMS = [
  { id: "meta_ads", name: "Meta Ads (IG & FB)", icon: "📱", defaultMedium: "paid_social", defaultSource: "meta" },
  { id: "google_search", name: "Google Search Ads", icon: "🔍", defaultMedium: "cpc", defaultSource: "google" },
  { id: "youtube", name: "YouTube Video Ads", icon: "▶️", defaultMedium: "video_cpc", defaultSource: "youtube" },
  { id: "linkedin", name: "LinkedIn Ads (B2B)", icon: "💼", defaultMedium: "sponsored_content", defaultSource: "linkedin" },
  { id: "college_workshop", name: "College Event / QR", icon: "🎓", defaultMedium: "offline_qr", defaultSource: "college_event" },
  { id: "organic_referral", name: "Alumni Referral Link", icon: "🤝", defaultMedium: "ambassador", defaultSource: "referral" },
];

const COURSES = [
  "Full Stack Web Development (MERN)",
  "Data Science & Applied AI Accelerator",
  "Product Design (UI/UX) Mastery",
  "Cloud Computing & DevOps Engineering",
  "All Technical Programs",
];

export function CreateCampaignModal({ isOpen, onClose, onCreated }) {
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState("meta_ads");
  const [targetCourse, setTargetCourse] = useState(COURSES[0]);
  const [budget, setBudget] = useState("50000");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0]
  );

  // UTM Parameters
  const [utmSource, setUtmSource] = useState("meta");
  const [utmMedium, setUtmMedium] = useState("paid_social");
  const [utmCampaign, setUtmCampaign] = useState("");
  const [utmContent, setUtmContent] = useState("creative_video_1");

  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // When platform changes, update default source & medium
  useEffect(() => {
    const sel = PLATFORMS.find((p) => p.id === platform);
    if (sel) {
      setUtmSource(sel.defaultSource);
      setUtmMedium(sel.defaultMedium);
    }
  }, [platform]);

  // When name changes, auto-suggest utm_campaign
  useEffect(() => {
    if (name) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_")
        .slice(0, 32);
      setUtmCampaign(slug);
    }
  }, [name]);

  // Real-time Generated Tracking URL
  const generatedTrackingUrl = useMemo(() => {
    const baseUrl = "https://skillyards.com/courses";
    const params = new URLSearchParams();
    if (utmSource) params.set("utm_source", utmSource);
    if (utmMedium) params.set("utm_medium", utmMedium);
    if (utmCampaign) params.set("utm_campaign", utmCampaign);
    if (utmContent) params.set("utm_content", utmContent);
    return `${baseUrl}?${params.toString()}`;
  }, [utmSource, utmMedium, utmCampaign, utmContent]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedTrackingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !budget) {
      alert("Please enter campaign name and budget.");
      return;
    }

    setIsSubmitting(true);
    const campaignId = `camp-${Date.now()}`;
    const code = `CAMP-${platform.slice(0, 4).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const newCampaign = {
      id: campaignId,
      name: name.trim(),
      code,
      platform,
      targetCourse,
      status: "active",
      budget: Number(budget),
      spend: 0,
      impressions: 0,
      clicks: 0,
      leadsGenerated: 0,
      counsellingConducted: 0,
      admissionsConverted: 0,
      revenueRealized: 0,
      cpl: 0,
      cac: 0,
      roas: 0,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      trackingUrl: generatedTrackingUrl,
      startDate,
      endDate,
    };

    // 1. Dispatch to Backend API
    try {
      await crmApi.createCampaign({
        name: name.trim(),
        platform,
        targetCourse,
        budget: Number(budget),
        startDate,
        endDate,
        utmSource,
        utmMedium,
        utmCampaign,
        utmContent,
      });
    } catch (err) {
      console.warn("API creation failed, executing local offline fallback");
    }

    // 2. Persist to localStorage for offline safety
    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("skillyards_custom_campaigns") || "[]");
        localStorage.setItem("skillyards_custom_campaigns", JSON.stringify([newCampaign, ...stored]));
      } catch (_) {}
    }

    setIsSubmitting(false);
    onClose();
    if (onCreated) onCreated(newCampaign);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#FAF6EE] rounded-2xl shadow-2xl border border-[rgba(71,86,87,0.22)] overflow-hidden my-8">
        
        {/* Cockpit Top Bar */}
        <div className="bg-[#0c1316] text-white px-6 py-4 flex items-center justify-between border-b border-[rgba(98,146,158,0.2)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D97706]/25 border border-[#D97706]/50 flex items-center justify-center text-[#D97706]">
              <Target className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wide">Launch Ad Campaign & UTM Link</h2>
              <p className="text-[11px] text-[#7E939A]">Lead Attribution & Marketing ROI Tracking</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#7E939A] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-[#1C2527]">
          
          {/* Campaign Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1C2527]">Campaign Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Diwali Tech Fast-Track Ad Campaign"
              className="w-full px-3 py-2 rounded-xl bg-white border border-[rgba(71,86,87,0.24)] text-xs text-[#1C2527] focus:outline-none focus:ring-1 focus:ring-[#2E7559]"
            />
          </div>

          {/* Platform Selector Grid */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1C2527]">Channel Platform *</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlatform(p.id)}
                  className={`p-2 rounded-xl text-left border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    platform === p.id
                      ? "bg-[#0c1316] text-white border-[#0c1316] shadow-xs"
                      : "bg-white text-[#5A6E71] border-[rgba(71,86,87,0.18)] hover:bg-[#FAF6EE]"
                  }`}
                >
                  <span className="text-sm">{p.icon}</span>
                  <span className="truncate">{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Target Course & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1C2527]">Target Course Program</label>
              <select
                value={targetCourse}
                onChange={(e) => setTargetCourse(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[rgba(71,86,87,0.24)] text-xs text-[#1C2527] focus:outline-none focus:ring-1 focus:ring-[#2E7559]"
              >
                {COURSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1C2527]">Allocated Budget (INR) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#5A6E71]">
                  ₹
                </span>
                <input
                  type="number"
                  required
                  min="1000"
                  step="500"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="50000"
                  className="w-full pl-7 pr-3 py-2 rounded-xl bg-white border border-[rgba(71,86,87,0.24)] text-xs font-bold text-[#1C2527] focus:outline-none focus:ring-1 focus:ring-[#2E7559]"
                />
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1C2527]">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-[rgba(71,86,87,0.2)] text-xs text-[#1C2527] focus:outline-none focus:ring-1 focus:ring-[#2E7559]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1C2527]">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-[rgba(71,86,87,0.2)] text-xs text-[#1C2527] focus:outline-none focus:ring-1 focus:ring-[#2E7559]"
              />
            </div>
          </div>

          {/* UTM Tracking Builder Callout */}
          <div className="p-3.5 bg-white rounded-xl border border-[rgba(71,86,87,0.18)] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#7E939A] flex items-center gap-1">
                <LinkIcon className="w-3.5 h-3.5 text-[#D97706]" />
                <span>Generated UTM Tracking Link</span>
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-1 text-[11px] font-bold text-[#D97706] hover:text-[#B45309] transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-[#2E7559]" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? "Copied" : "Copy Link"}</span>
              </button>
            </div>

            {/* Generated URL Box */}
            <p className="p-2 rounded-lg bg-[#FAF6EE] border border-[rgba(71,86,87,0.12)] font-mono text-[10.5px] text-[#1C2527] break-all leading-relaxed select-all">
              {generatedTrackingUrl}
            </p>

            {/* UTM Parameter Inputs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
              <div>
                <label className="text-[9.5px] text-[#7E939A] block">utm_source</label>
                <input
                  type="text"
                  value={utmSource}
                  onChange={(e) => setUtmSource(e.target.value)}
                  className="w-full px-2 py-1 rounded bg-[#FAF6EE] border border-[rgba(71,86,87,0.15)] font-mono text-[10.5px]"
                />
              </div>

              <div>
                <label className="text-[9.5px] text-[#7E939A] block">utm_medium</label>
                <input
                  type="text"
                  value={utmMedium}
                  onChange={(e) => setUtmMedium(e.target.value)}
                  className="w-full px-2 py-1 rounded bg-[#FAF6EE] border border-[rgba(71,86,87,0.15)] font-mono text-[10.5px]"
                />
              </div>

              <div>
                <label className="text-[9.5px] text-[#7E939A] block">utm_campaign</label>
                <input
                  type="text"
                  value={utmCampaign}
                  onChange={(e) => setUtmCampaign(e.target.value)}
                  className="w-full px-2 py-1 rounded bg-[#FAF6EE] border border-[rgba(71,86,87,0.15)] font-mono text-[10.5px]"
                />
              </div>

              <div>
                <label className="text-[9.5px] text-[#7E939A] block">utm_content</label>
                <input
                  type="text"
                  value={utmContent}
                  onChange={(e) => setUtmContent(e.target.value)}
                  className="w-full px-2 py-1 rounded bg-[#FAF6EE] border border-[rgba(71,86,87,0.15)] font-mono text-[10.5px]"
                />
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-[rgba(71,86,87,0.16)] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-white hover:bg-[#FAF6EE] text-[#1C2527] border border-[rgba(71,86,87,0.2)] text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#2E7559] hover:bg-[#256149] text-white text-xs font-bold transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Launching..." : "Launch Campaign & Save UTM"}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
