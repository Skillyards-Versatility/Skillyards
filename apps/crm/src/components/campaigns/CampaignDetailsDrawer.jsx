"use client";

import React, { useState } from "react";
import {
  X,
  Target,
  TrendingUp,
  Link as LinkIcon,
  Copy,
  Check,
  Download,
  CheckCircle2,
  Users,
  DollarSign,
  PieChart,
  ArrowRight,
  ExternalLink,
  Award,
  Sparkles,
} from "lucide-react";

export function CampaignDetailsDrawer({ isOpen, onClose, campaign, onToggleStatus }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !campaign) return null;

  const handleCopyLink = () => {
    if (campaign.trackingUrl) {
      navigator.clipboard.writeText(campaign.trackingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportCampaignCSV = () => {
    const headers = [
      "Campaign Name",
      "Campaign Code",
      "Platform",
      "Target Course",
      "Status",
      "Budget (INR)",
      "Spend (INR)",
      "Impressions",
      "Clicks",
      "Leads Generated",
      "Counselling Conducted",
      "Admissions Converted",
      "Revenue Realized (INR)",
      "CPL (INR)",
      "CAC (INR)",
      "RoAS (x)",
      "Tracking URL",
    ];

    const row = [
      `"${campaign.name}"`,
      `"${campaign.code}"`,
      `"${campaign.platform}"`,
      `"${campaign.targetCourse}"`,
      `"${campaign.status}"`,
      campaign.budget,
      campaign.spend,
      campaign.impressions,
      campaign.clicks,
      campaign.leadsGenerated,
      campaign.counsellingConducted,
      campaign.admissionsConverted,
      campaign.revenueRealized,
      campaign.cpl,
      campaign.cac,
      campaign.roas,
      `"${campaign.trackingUrl || ""}"`,
    ];

    const csv = [headers.join(","), row.join(",")].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `skillyards-campaign-${campaign.code}.csv`;
    link.click();
  };

  const spendPct = campaign.budget > 0 ? Math.min(100, Math.round((campaign.spend / campaign.budget) * 100)) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="relative w-full max-w-xl bg-[#FAF6EE] h-full shadow-2xl flex flex-col border-l border-[rgba(71,86,87,0.2)] animate-in slide-in-from-right duration-200">
        
        {/* Cockpit Top Bar */}
        <div className="bg-[#0c1316] text-white px-6 py-4 flex items-center justify-between border-b border-[rgba(98,146,158,0.2)] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#4A6D7C]/25 border border-[#4A6D7C]/50 flex items-center justify-center text-[#4A6D7C]">
              <Target className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wide truncate max-w-sm">{campaign.name}</h2>
              <p className="text-[11px] text-[#7E939A] font-mono">{campaign.code}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCampaignCSV}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Export Campaign Metrics CSV"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#7E939A] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Drawer Body Scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-[#1C2527]">
          
          {/* Hero Performance Card */}
          <div className="p-4 bg-white rounded-2xl border border-[rgba(71,86,87,0.18)] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] uppercase font-bold text-[#7E939A] tracking-wider">
                {campaign.targetCourse}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  campaign.status === "active"
                    ? "bg-[#25D366]/20 text-[#128C7E] border border-[#25D366]/40"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {campaign.status}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-1">
              <div className="p-2.5 rounded-xl bg-[#FAF6EE] border border-[rgba(71,86,87,0.1)]">
                <span className="text-[10px] text-[#7E939A] uppercase block font-semibold">RoAS Multiplier</span>
                <span className="text-lg font-black text-[#2E7559] font-mono">{campaign.roas}x</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF6EE] border border-[rgba(71,86,87,0.1)]">
                <span className="text-[10px] text-[#7E939A] uppercase block font-semibold">Revenue</span>
                <span className="text-lg font-black text-[#1C2527] font-mono">₹{(campaign.revenueRealized / 100000).toFixed(1)}L</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF6EE] border border-[rgba(71,86,87,0.1)]">
                <span className="text-[10px] text-[#7E939A] uppercase block font-semibold">Cost Per Lead</span>
                <span className="text-lg font-black text-[#B07238] font-mono">₹{Math.round(campaign.cpl)}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF6EE] border border-[rgba(71,86,87,0.1)]">
                <span className="text-[10px] text-[#7E939A] uppercase block font-semibold">Blended CAC</span>
                <span className="text-lg font-black text-[#4A6D7C] font-mono">₹{Math.round(campaign.cac)}</span>
              </div>
            </div>

            {/* Budget Utilization Track */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#5A6E71]">Budget Spent: <strong>₹{campaign.spend.toLocaleString("en-IN")}</strong></span>
                <span className="font-bold text-[#1C2527]">Total: ₹{campaign.budget.toLocaleString("en-IN")} ({spendPct}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#FAF6EE] border border-[rgba(71,86,87,0.12)] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#4A6D7C] to-[#2E7559] transition-all"
                  style={{ width: `${spendPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Conversion Funnel Waterfall */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7E939A] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#4A6D7C]" />
              <span>Attribution Conversion Waterfall</span>
            </h3>

            <div className="space-y-2">
              {[
                { stage: "Ad Impressions", val: campaign.impressions?.toLocaleString("en-IN") || "—", note: "Total reach" },
                { stage: "Ad Clicks / Landing Visits", val: campaign.clicks?.toLocaleString("en-IN") || "—", note: `${(((campaign.clicks || 1) / (campaign.impressions || 1)) * 100).toFixed(1)}% CTR` },
                { stage: "Lead Inquiries Captured", val: campaign.leadsGenerated?.toLocaleString("en-IN") || "—", note: `${(((campaign.leadsGenerated || 1) / (campaign.clicks || 1)) * 100).toFixed(1)}% LP Conversion` },
                { stage: "Counselling Sessions Conducted", val: campaign.counsellingConducted?.toLocaleString("en-IN") || "—", note: `${(((campaign.counsellingConducted || 1) / (campaign.leadsGenerated || 1)) * 100).toFixed(1)}% Show-up` },
                { stage: "Official Admissions Enrolled", val: campaign.admissionsConverted?.toLocaleString("en-IN") || "—", note: `${(((campaign.admissionsConverted || 1) / (campaign.leadsGenerated || 1)) * 100).toFixed(1)}% Closed`, highlight: true },
              ].map((step, idx) => (
                <div
                  key={step.stage}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                    step.highlight
                      ? "bg-[#2E7559]/10 border-[#2E7559]/30 text-[#1C2527]"
                      : "bg-white border-[rgba(71,86,87,0.14)] text-[#1C2527]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#FAF6EE] text-[#5A6E71] font-mono text-[10px] font-bold flex items-center justify-center border border-[rgba(71,86,87,0.15)]">
                      {idx + 1}
                    </span>
                    <span className="font-semibold">{step.stage}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold font-mono text-sm block">{step.val}</span>
                    <span className="text-[10px] text-[#7E939A] font-medium">{step.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Rep Closers for this Campaign */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7E939A] flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#B07238]" />
              <span>Top Closers Attributed to this Campaign</span>
            </h3>

            <div className="bg-white rounded-2xl border border-[rgba(71,86,87,0.16)] divide-y divide-[rgba(71,86,87,0.1)] text-xs">
              {[
                { name: "Priya Patel", role: "Senior Counsellor", admissions: Math.ceil(campaign.admissionsConverted * 0.5), rev: Math.ceil(campaign.revenueRealized * 0.5) },
                { name: "Amit Kumar", role: "Admissions Lead", admissions: Math.ceil(campaign.admissionsConverted * 0.3), rev: Math.ceil(campaign.revenueRealized * 0.3) },
                { name: "Vikram Malhotra", role: "Counsellor", admissions: Math.max(1, Math.floor(campaign.admissionsConverted * 0.2)), rev: Math.max(38000, Math.floor(campaign.revenueRealized * 0.2)) },
              ].map((rep, i) => (
                <div key={rep.name} className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}</span>
                    <div>
                      <p className="font-bold text-[#1C2527]">{rep.name}</p>
                      <p className="text-[10.5px] text-[#7E939A]">{rep.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#2E7559] font-mono block">
                      {rep.admissions} Enrolled
                    </span>
                    <span className="text-[10.5px] text-[#7E939A] font-mono">
                      ₹{rep.rev.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* UTM Tracking Link Box */}
          <div className="p-4 bg-white rounded-2xl border border-[rgba(71,86,87,0.16)] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] uppercase font-bold text-[#7E939A] flex items-center gap-1">
                <LinkIcon className="w-3.5 h-3.5 text-[#4A6D7C]" />
                <span>Live UTM Tracking URL</span>
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-1 text-[11px] font-bold text-[#4A6D7C] hover:text-[#1C2527] transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-[#2E7559]" /> : <Copy className="w-3 h-3 text-[#4A6D7C]" />}
                <span>{copied ? "Copied" : "Copy URL"}</span>
              </button>
            </div>
            <p className="p-2.5 rounded-xl bg-[#FAF6EE] font-mono text-[10.5px] text-[#1C2527] break-all border border-[rgba(71,86,87,0.12)]">
              {campaign.trackingUrl}
            </p>
          </div>

        </div>

        {/* Drawer Bottom Controls */}
        <div className="p-4 bg-[#F4ECDF] border-t border-[rgba(71,86,87,0.18)] flex items-center justify-between shrink-0">
          <button
            onClick={() => onToggleStatus && onToggleStatus(campaign.id, campaign.status === "active" ? "paused" : "active")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
              campaign.status === "active"
                ? "bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200"
                : "bg-[#2E7559] text-white hover:bg-[#256149]"
            }`}
          >
            {campaign.status === "active" ? "Pause Campaign" : "Resume Campaign"}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white hover:bg-[#FAF6EE] text-[#1C2527] border border-[rgba(71,86,87,0.2)] text-xs font-semibold transition-colors"
          >
            Close Drawer
          </button>
        </div>

      </div>
    </div>
  );
}
