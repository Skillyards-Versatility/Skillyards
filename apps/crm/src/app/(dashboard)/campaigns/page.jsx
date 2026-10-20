"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Target,
  TrendingUp,
  Search,
  Download,
  RefreshCw,
  Plus,
  Link as LinkIcon,
  Copy,
  Check,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ExternalLink,
  DollarSign,
  PieChart,
  BarChart3,
  Layers,
  Award,
  ChevronRight,
  Filter,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import { crmApi } from "@/lib/api";
import { CreateCampaignModal } from "@/components/campaigns/CreateCampaignModal";
import { CampaignDetailsDrawer } from "@/components/campaigns/CampaignDetailsDrawer";

const INITIAL_CAMPAIGNS = [
  {
    id: "camp-101",
    name: "Diwali Tech Fast-Track Ad Campaign",
    code: "CAMP-META-MERN-Q4",
    platform: "meta_ads",
    targetCourse: "Full Stack Web Development (MERN)",
    status: "active",
    budget: 85000,
    spend: 62400,
    impressions: 142500,
    clicks: 4820,
    leadsGenerated: 420,
    counsellingConducted: 88,
    admissionsConverted: 24,
    revenueRealized: 1083240,
    cpl: 148.57,
    cac: 2600.0,
    roas: 17.36,
    utmSource: "meta",
    utmMedium: "paid_social",
    utmCampaign: "diwali_fast_track",
    utmContent: "mern_video",
    trackingUrl:
      "https://skillyards.com/courses/mern?utm_source=meta&utm_medium=paid_social&utm_campaign=diwali_fast_track&utm_content=mern_video",
    startDate: "2026-10-01",
    endDate: "2026-10-31",
  },
  {
    id: "camp-102",
    name: "Google Search High-Intent AI Career Bootcamp",
    code: "CAMP-GOOG-AI-Q4",
    platform: "google_search",
    targetCourse: "Data Science & Applied AI Accelerator",
    status: "active",
    budget: 120000,
    spend: 94500,
    impressions: 48900,
    clicks: 3120,
    leadsGenerated: 310,
    counsellingConducted: 76,
    admissionsConverted: 21,
    revenueRealized: 1090320,
    cpl: 304.84,
    cac: 4500.0,
    roas: 11.54,
    utmSource: "google",
    utmMedium: "cpc",
    utmCampaign: "ai_career_bootcamp",
    utmContent: "search_kw_data_science",
    trackingUrl:
      "https://skillyards.com/courses/data-science?utm_source=google&utm_medium=cpc&utm_campaign=ai_career_bootcamp&utm_content=search_kw_data_science",
    startDate: "2026-10-05",
    endDate: "2026-11-15",
  },
  {
    id: "camp-103",
    name: "YouTube Tech Mentorship Case Studies",
    code: "CAMP-YT-UX-2026",
    platform: "youtube",
    targetCourse: "Product Design (UI/UX) Mastery",
    status: "active",
    budget: 50000,
    spend: 34200,
    impressions: 98000,
    clicks: 1420,
    leadsGenerated: 160,
    counsellingConducted: 32,
    admissionsConverted: 8,
    revenueRealized: 304000,
    cpl: 213.75,
    cac: 4275.0,
    roas: 8.89,
    utmSource: "youtube",
    utmMedium: "video_cpc",
    utmCampaign: "portfolio_case_study",
    utmContent: "mentor_interview",
    trackingUrl:
      "https://skillyards.com/courses/ui-ux?utm_source=youtube&utm_medium=video_cpc&utm_campaign=portfolio_case_study&utm_content=mentor_interview",
    startDate: "2026-10-12",
    endDate: "2026-11-10",
  },
  {
    id: "camp-104",
    name: "LinkedIn B2B Career Switchers (Working Devs)",
    code: "CAMP-LI-DEVOPS-2026",
    platform: "linkedin",
    targetCourse: "Cloud Computing & DevOps Engineering",
    status: "active",
    budget: 65000,
    spend: 48000,
    impressions: 32000,
    clicks: 890,
    leadsGenerated: 95,
    counsellingConducted: 24,
    admissionsConverted: 6,
    revenueRealized: 288000,
    cpl: 505.26,
    cac: 8000.0,
    roas: 6.0,
    utmSource: "linkedin",
    utmMedium: "sponsored_content",
    utmCampaign: "working_dev_switch",
    utmContent: "aws_kubernetes",
    trackingUrl:
      "https://skillyards.com/courses/devops?utm_source=linkedin&utm_medium=sponsored_content&utm_campaign=working_dev_switch&utm_content=aws_kubernetes",
    startDate: "2026-10-15",
    endDate: "2026-11-30",
  },
  {
    id: "camp-105",
    name: "Engineering College Campus Hackathon & Seminars",
    code: "CAMP-OFFLINE-COLLEGE-26",
    platform: "college_workshop",
    targetCourse: "Full Stack Web Development (MERN)",
    status: "completed",
    budget: 40000,
    spend: 39500,
    impressions: 12000,
    clicks: 2400,
    leadsGenerated: 280,
    counsellingConducted: 62,
    admissionsConverted: 18,
    revenueRealized: 812430,
    cpl: 141.07,
    cac: 2194.44,
    roas: 20.57,
    utmSource: "college_event",
    utmMedium: "offline_qr",
    utmCampaign: "hackathon_delhi_ncr",
    utmContent: "standee_qr",
    trackingUrl:
      "https://skillyards.com/courses/mern?utm_source=college_event&utm_medium=offline_qr&utm_campaign=hackathon_delhi_ncr&utm_content=standee_qr",
    startDate: "2026-09-01",
    endDate: "2026-09-30",
  },
  {
    id: "camp-106",
    name: "Alumni & Learner Referral Circle (20% Reward)",
    code: "CAMP-REF-AMBASSADOR",
    platform: "organic_referral",
    targetCourse: "All Technical Cohorts",
    status: "active",
    budget: 30000,
    spend: 18000,
    impressions: 8500,
    clicks: 1950,
    leadsGenerated: 155,
    counsellingConducted: 48,
    admissionsConverted: 19,
    revenueRealized: 885000,
    cpl: 116.13,
    cac: 947.37,
    roas: 49.17,
    utmSource: "referral",
    utmMedium: "ambassador",
    utmCampaign: "alumni_circle",
    utmContent: "student_portal",
    trackingUrl:
      "https://skillyards.com/refer?utm_source=referral&utm_medium=ambassador&utm_campaign=alumni_circle&utm_content=student_portal",
    startDate: "2026-10-01",
    endDate: "2026-12-31",
  },
];

export default function MarketingCampaignsPage() {
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [channelFilter, setChannelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toastMessage, setToastMessage] = useState(null);

  // Modals & Drawers
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchCampaigns = async () => {
    setLoading(true);
    let loaded = [];

    try {
      const res = await crmApi.getCampaigns();
      if (res && res.data && res.data.campaigns) {
        loaded = res.data.campaigns;
      }
    } catch (_) {}

    if (loaded.length === 0) {
      loaded = [...INITIAL_CAMPAIGNS];
    }

    // Merge custom campaigns from localStorage
    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("skillyards_custom_campaigns") || "[]");
        if (stored.length > 0) {
          const storedIds = new Set(stored.map((s) => s.id));
          const filtered = loaded.filter((l) => !storedIds.has(l.id));
          loaded = [...stored, ...filtered];
        }
      } catch (_) {}
    }

    setCampaigns(loaded);
    setLoading(false);
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Aggregated KPIs
  const kpis = useMemo(() => {
    const totalBudget = campaigns.reduce((sum, c) => sum + (Number(c.budget) || 0), 0);
    const totalSpend = campaigns.reduce((sum, c) => sum + (Number(c.spend) || 0), 0);
    const totalLeads = campaigns.reduce((sum, c) => sum + (Number(c.leadsGenerated) || 0), 0);
    const totalAdmissions = campaigns.reduce((sum, c) => sum + (Number(c.admissionsConverted) || 0), 0);
    const totalRevenue = campaigns.reduce((sum, c) => sum + (Number(c.revenueRealized) || 0), 0);

    const blendedCPL = totalLeads > 0 ? Math.round(totalSpend / totalLeads) : 0;
    const blendedCAC = totalAdmissions > 0 ? Math.round(totalSpend / totalAdmissions) : 0;
    const blendedRoAS = totalSpend > 0 ? Number((totalRevenue / totalSpend).toFixed(2)) : 0;
    const blendedConvRate = totalLeads > 0 ? Number(((totalAdmissions / totalLeads) * 100).toFixed(1)) : 0;

    return {
      totalBudget,
      totalSpend,
      totalLeads,
      totalAdmissions,
      totalRevenue,
      blendedCPL,
      blendedCAC,
      blendedRoAS,
      blendedConvRate,
      activeCount: campaigns.filter((c) => c.status === "active").length,
    };
  }, [campaigns]);

  // Channel Distribution
  const channelMetrics = useMemo(() => {
    const channels = [
      { id: "meta_ads", name: "Meta Ads", icon: "📱", color: "bg-[#1877F2]/10 text-[#1877F2] border-[#1877F2]/30" },
      { id: "google_search", name: "Google Ads", icon: "🔍", color: "bg-[#4285F4]/10 text-[#4285F4] border-[#4285F4]/30" },
      { id: "youtube", name: "YouTube", icon: "▶️", color: "bg-[#FF0000]/10 text-[#FF0000] border-[#FF0000]/30" },
      { id: "linkedin", name: "LinkedIn", icon: "💼", color: "bg-[#0A66C2]/10 text-[#0A66C2] border-[#0A66C2]/30" },
      { id: "college_workshop", name: "College Event", icon: "🎓", color: "bg-[#B07238]/10 text-[#B07238] border-[#B07238]/30" },
      { id: "organic_referral", name: "Alumni Referral", icon: "🤝", color: "bg-[#2E7559]/10 text-[#2E7559] border-[#2E7559]/30" },
    ];

    return channels.map((ch) => {
      const channelCamps = campaigns.filter((c) => c.platform === ch.id);
      const spend = channelCamps.reduce((s, c) => s + (Number(c.spend) || 0), 0);
      const leads = channelCamps.reduce((s, c) => s + (Number(c.leadsGenerated) || 0), 0);
      const admissions = channelCamps.reduce((s, c) => s + (Number(c.admissionsConverted) || 0), 0);
      const rev = channelCamps.reduce((s, c) => s + (Number(c.revenueRealized) || 0), 0);
      const roas = spend > 0 ? (rev / spend).toFixed(1) : 0;
      return {
        ...ch,
        count: channelCamps.length,
        spend,
        leads,
        admissions,
        rev,
        roas,
      };
    });
  }, [campaigns]);

  // Filtered List
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      if (channelFilter !== "all" && c.platform !== channelFilter) return false;
      if (statusFilter !== "all" && c.status !== statusFilter) return false;

      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesCode = c.code.toLowerCase().includes(q);
        const matchesCourse = c.targetCourse.toLowerCase().includes(q);
        const matchesUtm = c.utmCampaign?.toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesCourse && !matchesUtm) return false;
      }

      return true;
    });
  }, [campaigns, channelFilter, statusFilter, searchTerm]);

  // Toggle status (Active / Paused)
  const handleToggleStatus = async (campaignId, newStatus) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaignId ? { ...c, status: newStatus } : c))
    );
    try {
      await crmApi.updateCampaign(campaignId, { status: newStatus });
    } catch (_) {}
    showToast(`Campaign status updated to ${newStatus}`);
  };

  // Copy tracking link
  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    showToast("Copied UTM tracking URL to clipboard");
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      "Campaign Name",
      "Code",
      "Platform",
      "Target Program",
      "Status",
      "Budget (INR)",
      "Spend (INR)",
      "Leads Generated",
      "CPL (INR)",
      "Admissions Converted",
      "Revenue Realized (INR)",
      "CAC (INR)",
      "RoAS Multiplier",
      "Tracking URL",
    ];

    const rows = filteredCampaigns.map((c) => [
      `"${c.name}"`,
      `"${c.code}"`,
      `"${c.platform}"`,
      `"${c.targetCourse}"`,
      `"${c.status}"`,
      c.budget,
      c.spend,
      c.leadsGenerated,
      Math.round(c.cpl),
      c.admissionsConverted,
      c.revenueRealized,
      Math.round(c.cac),
      `${c.roas}x`,
      `"${c.trackingUrl || ""}"`,
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `skillyards-campaign-attribution-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    showToast("Downloaded campaign attribution ledger CSV");
  };

  const getPlatformLabel = (id) => {
    switch (id) {
      case "meta_ads":
        return { label: "Meta Ads (IG/FB)", icon: "📱", badge: "bg-[#1877F2]/10 text-[#1877F2] border-[#1877F2]/30" };
      case "google_search":
        return { label: "Google Search Ads", icon: "🔍", badge: "bg-[#4285F4]/10 text-[#4285F4] border-[#4285F4]/30" };
      case "youtube":
        return { label: "YouTube Ads", icon: "▶️", badge: "bg-[#FF0000]/10 text-[#FF0000] border-[#FF0000]/30" };
      case "linkedin":
        return { label: "LinkedIn B2B", icon: "💼", badge: "bg-[#0A66C2]/10 text-[#0A66C2] border-[#0A66C2]/30" };
      case "college_workshop":
        return { label: "College Workshop", icon: "🎓", badge: "bg-[#B07238]/10 text-[#B07238] border-[#B07238]/30" };
      case "organic_referral":
        return { label: "Alumni Referral", icon: "🤝", badge: "bg-[#2E7559]/10 text-[#2E7559] border-[#2E7559]/30" };
      default:
        return { label: id, icon: "📢", badge: "bg-slate-100 text-slate-700" };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#0c1316] text-white px-4 py-2.5 rounded-xl shadow-xl border border-[rgba(98,146,158,0.3)] flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-[#25D366]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-[#1C2527] tracking-tight">
              Marketing Campaign ROI & Attribution
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#2E7559]/15 border border-[#2E7559]/30 text-[#2E7559] text-[11px] font-bold uppercase tracking-wider">
              {kpis.activeCount} Active Campaigns
            </span>
          </div>
          <p className="text-xs text-[#5A6E71] mt-1 font-medium">
            Track multi-channel ad spend, blended customer acquisition cost (CAC), lead-to-enrollment conversion rates, and generate UTM tracking links.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchCampaigns}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-[#FAF6EE] text-[#1C2527] border border-[rgba(71,86,87,0.2)] text-xs font-semibold transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#5A6E71] ${loading ? "animate-spin" : ""}`} />
            <span>Sync</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#FAF6EE] text-[#1C2527] border border-[rgba(71,86,87,0.2)] text-xs font-semibold transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#4A6D7C]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2E7559] hover:bg-[#256149] text-white text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>+ Launch Campaign & UTM</span>
          </button>
        </div>
      </div>

      {/* 4 Executive KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Total Ad Spend */}
        <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] shadow-xs">
          <div className="flex items-center justify-between text-[#5A6E71] text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Total Ad Spend</span>
            <div className="w-7 h-7 rounded-lg bg-[#4A6D7C]/15 flex items-center justify-center text-[#4A6D7C]">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-black text-[#1C2527] font-mono tracking-tight">
            ₹{(kpis.totalSpend / 100000).toFixed(2)}L
          </div>
          <p className="text-[11px] text-[#5A6E71] mt-1">
            Budget: ₹{(kpis.totalBudget / 100000).toFixed(2)}L ({Math.round((kpis.totalSpend / (kpis.totalBudget || 1)) * 100)}% utilized)
          </p>
        </div>

        {/* Leads Acquired & CPL */}
        <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] shadow-xs">
          <div className="flex items-center justify-between text-[#5A6E71] text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Leads Acquired</span>
            <div className="w-7 h-7 rounded-lg bg-[#B07238]/15 flex items-center justify-center text-[#B07238]">
              <Target className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-black text-[#1C2527] font-mono tracking-tight">
            {kpis.totalLeads.toLocaleString("en-IN")}
          </div>
          <p className="text-[11px] text-[#B07238] font-bold mt-1">
            Blended CPL: ₹{kpis.blendedCPL} / inquiry
          </p>
        </div>

        {/* Blended CAC */}
        <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] shadow-xs">
          <div className="flex items-center justify-between text-[#5A6E71] text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Blended CAC</span>
            <div className="w-7 h-7 rounded-lg bg-[#2E7559]/15 flex items-center justify-center text-[#2E7559]">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-black text-[#2E7559] font-mono tracking-tight">
            ₹{kpis.blendedCAC.toLocaleString("en-IN")}
          </div>
          <p className="text-[11px] text-[#5A6E71] mt-1">
            {kpis.totalAdmissions} admissions ({kpis.blendedConvRate}% conversion)
          </p>
        </div>

        {/* Return on Ad Spend (RoAS) */}
        <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-[rgba(46,117,89,0.28)] shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-[#5A6E71] text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-[#2E7559]">Overall RoAS</span>
            <div className="w-7 h-7 rounded-lg bg-[#2E7559]/20 flex items-center justify-center text-[#2E7559]">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-black text-[#2E7559] font-mono tracking-tight flex items-baseline gap-1.5">
            <span>{kpis.blendedRoAS}x</span>
            <span className="text-xs text-[#2E7559] font-sans font-bold">🔥 High Margin</span>
          </div>
          <p className="text-[11px] text-[#5A6E71] mt-1">
            Tuition Generated: ₹{(kpis.totalRevenue / 100000).toFixed(1)} Lakhs
          </p>
        </div>

      </div>

      {/* Visual Channel Distribution Strip */}
      <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] space-y-3 shadow-xs">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold uppercase tracking-wider text-[10.5px] text-[#7E939A] flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-[#4A6D7C]" />
            <span>Channel Spend & RoAS Performance Comparison</span>
          </span>
          <span className="text-[11px] text-[#5A6E71]">Across 6 Advertising & Inbound Channels</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {channelMetrics.map((ch) => (
            <div
              key={ch.id}
              onClick={() => setChannelFilter(channelFilter === ch.id ? "all" : ch.id)}
              className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                channelFilter === ch.id
                  ? "bg-white border-[#0c1316] ring-2 ring-[#0c1316] shadow-xs"
                  : "bg-white hover:bg-[#FAF6EE] border-[rgba(71,86,87,0.16)]"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-base">{ch.icon}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#2E7559]/15 text-[#2E7559]">
                  {ch.roas}x
                </span>
              </div>
              <p className="font-bold text-xs text-[#1C2527] truncate">{ch.name}</p>
              <div className="flex items-baseline justify-between text-[11px] text-[#5A6E71] mt-1 font-mono">
                <span>{ch.leads} leads</span>
                <strong className="text-[#2E7559]">{ch.admissions} closed</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Channel Filters Deck */}
      <div className="bg-[#FAF6EE] p-4 rounded-2xl border border-[rgba(71,86,87,0.18)] space-y-4 shadow-xs">
        
        {/* Filter Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(71,86,87,0.14)] pb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {[
              { id: "all", label: "All Channels" },
              { id: "meta_ads", label: "Meta (IG/FB)" },
              { id: "google_search", label: "Google Search" },
              { id: "youtube", label: "YouTube Ads" },
              { id: "linkedin", label: "LinkedIn" },
              { id: "college_workshop", label: "College Workshop" },
              { id: "organic_referral", label: "Alumni Referral" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setChannelFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  channelFilter === tab.id
                    ? "bg-[#0c1316] text-white shadow-xs"
                    : "bg-white/80 hover:bg-white text-[#5A6E71] border border-[rgba(71,86,87,0.14)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-[#5A6E71]">
            Showing <strong className="text-[#1C2527]">{filteredCampaigns.length}</strong> campaigns
          </div>
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7E939A]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by campaign name, code, target program, UTM tag..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-[rgba(71,86,87,0.2)] text-xs text-[#1C2527] focus:outline-none focus:ring-1 focus:ring-[#2E7559] placeholder-[#7E939A]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2 rounded-xl bg-white border border-[rgba(71,86,87,0.2)] text-xs text-[#1C2527] focus:outline-none focus:ring-1 focus:ring-[#2E7559]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>
        </div>

      </div>

      {/* Main Campaign Attribution Ledger Table */}
      <div className="bg-[#FAF6EE] rounded-2xl border border-[rgba(71,86,87,0.18)] overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-[#5A6E71] text-xs space-y-2">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#4A6D7C]" />
            <p>Loading marketing campaigns and attribution metrics...</p>
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[rgba(71,86,87,0.16)] flex items-center justify-center text-[#4A6D7C] mx-auto shadow-xs">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#1C2527]">No Campaigns Match Selection</h3>
            <p className="text-xs text-[#5A6E71] max-w-sm mx-auto">
              There are no active or historical campaigns matching your filter.
            </p>
            <button
              onClick={() => {
                setChannelFilter("all");
                setStatusFilter("all");
                setSearchTerm("");
              }}
              className="px-4 py-2 rounded-xl bg-white text-[#1C2527] border border-[rgba(71,86,87,0.2)] text-xs font-semibold hover:bg-[#FAF6EE] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF6EE] border-b border-[rgba(71,86,87,0.16)] text-[#5A6E71] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Campaign Particulars</th>
                  <th className="py-3 px-4 font-semibold">Platform & Channel</th>
                  <th className="py-3 px-4 font-semibold text-right">Spend / Budget</th>
                  <th className="py-3 px-4 font-semibold text-right">Leads (CPL)</th>
                  <th className="py-3 px-4 font-semibold text-right">Admissions (Conv %)</th>
                  <th className="py-3 px-4 font-semibold text-right">Tuition Revenue</th>
                  <th className="py-3 px-4 font-semibold text-center">RoAS</th>
                  <th className="py-3 px-4 font-semibold text-center">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(71,86,87,0.1)] text-[#1C2527]">
                {filteredCampaigns.map((camp) => {
                  const plat = getPlatformLabel(camp.platform);
                  const spendPct = camp.budget > 0 ? Math.min(100, Math.round((camp.spend / camp.budget) * 100)) : 0;
                  const convPct = camp.leadsGenerated > 0 ? ((camp.admissionsConverted / camp.leadsGenerated) * 100).toFixed(1) : 0;

                  return (
                    <tr key={camp.id} className="hover:bg-white/60 transition-colors">
                      {/* Campaign Name */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <p
                            onClick={() => {
                              setSelectedCampaign(camp);
                              setDetailsDrawerOpen(true);
                            }}
                            className="font-bold text-sm text-[#1C2527] hover:underline cursor-pointer flex items-center gap-1.5"
                          >
                            <span>{camp.name}</span>
                          </p>
                          <div className="flex items-center gap-2 text-[10.5px] text-[#5A6E71]">
                            <span className="font-mono text-[#4A6D7C] font-semibold">{camp.code}</span>
                            <span>•</span>
                            <span className="truncate max-w-[200px]">{camp.targetCourse}</span>
                          </div>
                        </div>
                      </td>

                      {/* Platform */}
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${plat.badge}`}>
                          <span>{plat.icon}</span>
                          <span>{plat.label}</span>
                        </span>
                      </td>

                      {/* Spend / Budget */}
                      <td className="py-3 px-4 text-right">
                        <div className="space-y-1">
                          <span className="font-mono font-bold text-xs text-[#1C2527]">
                            ₹{camp.spend.toLocaleString("en-IN")}
                          </span>
                          <p className="text-[10px] text-[#7E939A]">
                            Budget: ₹{camp.budget.toLocaleString("en-IN")} ({spendPct}%)
                          </p>
                        </div>
                      </td>

                      {/* Leads & CPL */}
                      <td className="py-3 px-4 text-right">
                        <span className="font-mono font-bold text-xs text-[#1C2527] block">
                          {camp.leadsGenerated}
                        </span>
                        <span className="text-[10.5px] text-[#B07238] font-bold font-mono">
                          ₹{Math.round(camp.cpl)} CPL
                        </span>
                      </td>

                      {/* Admissions & Conv % */}
                      <td className="py-3 px-4 text-right">
                        <span className="font-mono font-bold text-xs text-[#2E7559] block">
                          {camp.admissionsConverted} Enrolled
                        </span>
                        <span className="text-[10px] text-[#7E939A] font-semibold">
                          {convPct}% LP Conv
                        </span>
                      </td>

                      {/* Tuition Revenue */}
                      <td className="py-3 px-4 text-right">
                        <span className="font-mono font-bold text-xs text-[#1C2527] block">
                          ₹{(camp.revenueRealized / 100000).toFixed(2)}L
                        </span>
                        <span className="text-[10px] text-[#7E939A]">CAC: ₹{Math.round(camp.cac)}</span>
                      </td>

                      {/* RoAS Multiplier */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full font-mono font-black text-xs ${
                            camp.roas >= 10
                              ? "bg-[#2E7559]/15 text-[#2E7559] border border-[#2E7559]/30"
                              : camp.roas >= 5
                              ? "bg-[#4A6D7C]/15 text-[#4A6D7C] border border-[#4A6D7C]/30"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {camp.roas}x
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            camp.status === "active"
                              ? "bg-[#25D366]/20 text-[#128C7E] border border-[#25D366]/40"
                              : camp.status === "completed"
                              ? "bg-slate-200 text-slate-700"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {camp.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Copy Tracking URL */}
                          <button
                            onClick={() => handleCopyUrl(camp.trackingUrl)}
                            title="Copy UTM Tracking Link"
                            className="p-1.5 rounded-lg bg-white hover:bg-[#FAF6EE] text-[#5A6E71] hover:text-[#1C2527] border border-[rgba(71,86,87,0.2)] transition-colors shadow-xs"
                          >
                            <LinkIcon className="w-3.5 h-3.5" />
                          </button>

                          {/* Inspect Funnel Drawer */}
                          <button
                            onClick={() => {
                              setSelectedCampaign(camp);
                              setDetailsDrawerOpen(true);
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#FAF6EE] text-[#1C2527] border border-[rgba(71,86,87,0.2)] font-semibold text-xs flex items-center gap-1 transition-colors shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#4A6D7C]" />
                            <span>Funnel</span>
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

      {/* Modals & Drawers */}
      <CreateCampaignModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={(newCamp) => {
          showToast(`Campaign '${newCamp.name}' launched with UTM tracking`);
          fetchCampaigns();
        }}
      />

      <CampaignDetailsDrawer
        isOpen={detailsDrawerOpen}
        onClose={() => {
          setDetailsDrawerOpen(false);
          setSelectedCampaign(null);
        }}
        campaign={selectedCampaign}
        onToggleStatus={handleToggleStatus}
      />

    </div>
  );
}
