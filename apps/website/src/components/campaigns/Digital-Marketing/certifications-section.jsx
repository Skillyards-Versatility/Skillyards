"use client";

import { useState } from "react";
import {
  Award,
  BadgeCheck,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  ArrowRight,
  BookOpen,
  Layers,
  Star,
  X,
  MessageCircle,
  FileCheck,
  Globe,
  TrendingUp,
  GraduationCap,
} from "lucide-react";
import {
  SiMeta,
  SiHubspot,
  SiSemrush,
  SiGoogle,
  SiGoogleads,
  SiGoogleanalytics,
  SiMailchimp,
  SiWordpress,
} from "react-icons/si";
import { FaLinkedin, FaMicrosoft } from "react-icons/fa6";

// Certification Authorities Data
const certificationsData = [
  {
    id: "meta-blueprint",
    brand: "Meta",
    brandType: "meta",
    Icon: SiMeta,
    brandColor: "#0081FB",
    bgGradient: "from-blue-500/10 via-blue-500/5 to-transparent",
    borderHover: "hover:border-blue-500/60",
    badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
    name: "Meta Certified Digital Marketing Associate",
    additionalCerts: ["Meta Certified Media Buying Professional"],
    issuer: "Meta Blueprint / Credly Digital Badge",
    category: "paid",
    syllabusModule: "Module 3: Meta Ads & Performance Funnels",
    recruiterValue: "Top Priority for Dentsu, GroupM, Publicis & Social Panga",
    badgeText: "Global Digital Badge",
    skills: [
      "Meta Ads Manager",
      "Campaign Budget Optimization (CBO)",
      "Server-Side Conversions API (CAPI)",
      "Lookalike & Custom Audiences",
      "Instagram Reels Ad Strategy",
    ],
    overview:
      "Meta Blueprint certification validates your foundational understanding of advertising across Facebook, Instagram, and Messenger. Agencies look for this badge to confirm you understand ad delivery algorithms and attribution models.",
    examDetails: {
      duration: "90 Minutes",
      format: "60 Multiple Choice Questions",
      passingScore: "700 / 1000 (70%)",
      support: "Mock question banks + live campaign ad accounts during training",
    },
  },
  {
    id: "hubspot-academy",
    brand: "HubSpot",
    brandType: "hubspot",
    Icon: SiHubspot,
    brandColor: "#FF7A59",
    bgGradient: "from-orange-500/10 via-orange-500/5 to-transparent",
    borderHover: "hover:border-orange-500/60",
    badgeBg: "bg-orange-50 text-orange-700 border-orange-200",
    name: "HubSpot Inbound Marketing Certification",
    additionalCerts: ["HubSpot Content Marketing Certified"],
    issuer: "HubSpot Academy Global",
    category: "organic",
    syllabusModule: "Module 4: Inbound & CRM Lead Workflows",
    recruiterValue: "Gold Standard for B2B Tech, SaaS Firms & Inbound Agencies",
    badgeText: "Globally Accredited",
    skills: [
      "Inbound Flywheel Methodology",
      "Lead Nurturing & Email Drip Workflows",
      "Content Strategy & Topic Clusters",
      "HubSpot CRM Automation",
      "Customer Journey Mapping",
    ],
    overview:
      "HubSpot is the industry benchmark for modern inbound customer acquisition. This credential proves your capability to attract high-intent leads using content, nurture them through automated CRM workflows, and delight them into repeat customers.",
    examDetails: {
      duration: "75 Minutes",
      format: "60 Questions",
      passingScore: "75% to Pass",
      support: "Interactive case studies + simulated CRM workflow assignments",
    },
  },
  {
    id: "semrush-academy",
    brand: "Semrush",
    brandType: "semrush",
    Icon: SiSemrush,
    brandColor: "#FF642D",
    bgGradient: "from-[#1E7CBC]/10 via-[#1E7CBC]/5 to-transparent",
    borderHover: "hover:border-[#1E7CBC]/60",
    badgeBg: "bg-[#1E7CBC]/10 text-[#1E7CBC] border-[#1E7CBC]/30",
    name: "Semrush SEO Toolkit & Technical SEO Certification",
    additionalCerts: ["Semrush Keyword Research & Competitor Analysis"],
    issuer: "Semrush Academy International",
    category: "organic",
    syllabusModule: "Module 2: Technical & Organic SEO",
    recruiterValue: "Essential Requirement for SEO Analysts & Growth Specialists",
    badgeText: "Industry Benchmark",
    skills: [
      "Keyword Magic Tool Pro",
      "Site Audit Crawl Diagnostics",
      "Backlink Gap & Link Intersect",
      "Competitor Organic Traffic Analysis",
      "SERP Volatility & Position Tracking",
    ],
    overview:
      "Semrush is the most widely adopted enterprise search intelligence software. Clearing Semrush Academy examinations demonstrates hands-on competence in auditing live websites, reverse-engineering competitor backlink profiles, and discovering untapped keyword gaps.",
    examDetails: {
      duration: "60 Minutes",
      format: "40 Questions",
      passingScore: "70% to Pass",
      support: "Live Semrush tool access provided throughout the training period",
    },
  },
  {
    id: "google-skillshop",
    brand: "Google",
    brandType: "google",
    Icon: SiGoogle,
    brandColor: "#4285F4",
    bgGradient: "from-blue-600/10 via-blue-600/5 to-transparent",
    borderHover: "hover:border-blue-600/60",
    badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
    name: "Google Ads Search & Display Certification",
    additionalCerts: ["Google Analytics 4 (GA4) Certification"],
    issuer: "Google Skillshop Verified Credential",
    category: "paid",
    syllabusModule: "Module 1 & 5: Google Ads & Web Analytics",
    recruiterValue: "Compulsory for All Google Premier Partner Agency Roles",
    badgeText: "Google Official",
    skills: [
      "Smart Bidding Strategies (tCPA, tROAS)",
      "Performance Max (PMax) Campaigns",
      "Quality Score & Ad Rank Optimization",
      "GA4 Event Tracking & Conversion Paths",
      "Google Tag Manager (GTM) Triggers",
    ],
    overview:
      "Issued directly by Google through Skillshop, these certifications prove your capability to build high-converting Search, Display, and Video campaigns with positive ROI, and to measure complete user conversion journeys in GA4.",
    examDetails: {
      duration: "75 Minutes",
      format: "50 Questions",
      passingScore: "80% to Pass",
      support: "Hands-on ad spend practice with ₹50,000+ live budget capstones",
    },
  },
  {
    id: "skillyards-industrycreds",
    brand: "SkillYards",
    brandType: "skillyards",
    Icon: ShieldCheck,
    brandColor: "#1E7CBC",
    bgGradient: "from-[#1E7CBC]/10 via-[#1E7CBC]/5 to-transparent",
    borderHover: "hover:border-[#1E7CBC]/60",
    badgeBg: "bg-[#1E7CBC]/10 text-[#1E7CBC] border-[#1E7CBC]/30",
    name: "SkillYards INDUSTRYCreds® Performance Capstone",
    additionalCerts: ["Executive Digital Marketing Diploma"],
    issuer: "SkillYards Versatility (Regd. Educational Partner)",
    category: "capstone",
    syllabusModule: "Final Capstone Viva & Live Client Defense",
    recruiterValue: "Direct Hiring Gateway for 40+ Partner Tech & Media Firms",
    badgeText: "Live Project Proof",
    skills: [
      "Proof of ₹50k+ Live Ad Spend Management",
      "Live E-commerce Audit Report Defense",
      "Technical Viva with Agency Hiring Directors",
      "Looker Studio Automated Client Reporting",
      "End-to-End Campaign Architecture",
    ],
    overview:
      "Unlike multiple-choice exams, SkillYards INDUSTRYCreds® certifies real execution. Recruiters value this above all else because it proves you didn't just pass a quiz — you managed real money on live client ad accounts and defended your results in a technical viva.",
    examDetails: {
      duration: "Capstone Submission + Viva",
      format: "Live Client Campaign Audit & Defense",
      passingScore: "Graded by Agency Mentors",
      support: "Mentored 1:1 project coaching until your portfolio is recruiter-ready",
    },
  },
  {
    id: "microsoft-advertising",
    brand: "Microsoft",
    brandType: "microsoft",
    Icon: FaMicrosoft,
    brandColor: "#00A4EF",
    bgGradient: "from-cyan-500/10 via-cyan-500/5 to-transparent",
    borderHover: "hover:border-cyan-500/60",
    badgeBg: "bg-cyan-50 text-cyan-700 border-cyan-200",
    name: "Microsoft Advertising Certified Professional",
    additionalCerts: ["Microsoft Audience Network Certified"],
    issuer: "Microsoft Advertising Learning Lab",
    category: "paid",
    syllabusModule: "Module 6: International PPC & Bing Ads",
    recruiterValue: "Highly Prized for US, UK & International Agency Accounts",
    badgeText: "International Scope",
    skills: [
      "Bing Search Ads Optimization",
      "LinkedIn Profile Targeting in Bing Ads",
      "Microsoft Audience Network",
      "Cross-Platform Ad Import from Google Ads",
      "International Geo-Bidding Strategies",
    ],
    overview:
      "Microsoft Advertising is dominant across high-value desktop searches in North America and Western Europe. Having this credential makes candidates stand out for premium international remote roles and export-oriented digital agencies.",
    examDetails: {
      duration: "90 Minutes",
      format: "50 Questions",
      passingScore: "80% to Pass",
      support: "Practice import workflows and international targeting setups",
    },
  },
];

// Marquee Brand Logos Strip
const brandLogos = [
  { name: "Meta Blueprint", Icon: SiMeta, color: "#0081FB" },
  { name: "HubSpot Academy", Icon: SiHubspot, color: "#FF7A59" },
  { name: "Semrush Academy", Icon: SiSemrush, color: "#FF642D" },
  { name: "Google Skillshop", Icon: SiGoogle, color: "#4285F4" },
  { name: "Microsoft Advertising", Icon: FaMicrosoft, color: "#00A4EF" },
  { name: "Google Analytics 4", Icon: SiGoogleanalytics, color: "#E37400" },
  { name: "Google Ads", Icon: SiGoogleads, color: "#4285F4" },
  { name: "LinkedIn Learning", Icon: FaLinkedin, color: "#0A66C2" },
  { name: "Mailchimp", Icon: SiMailchimp, color: "#FFE01B" },
  { name: "WordPress", Icon: SiWordpress, color: "#21759B" },
];

export default function CertificationsSection({ id = "certifications" }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedCert, setSelectedCert] = useState(null);

  const filteredCerts =
    activeFilter === "all"
      ? certificationsData
      : certificationsData.filter((c) => c.category === activeFilter);

  const whatsappNumber =
    process.env.NEXT_PUBLIC_PHONE?.replace(/\D/g, "") || "917060100561";
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hi SkillYards Team! I want to know more about the globally recognized certifications (Meta, HubSpot, Semrush, Google) included in the Digital Marketing Course and how they help in agency placements."
  )}`;

  return (
    <section
      id={id}
      className="w-full bg-[#fbfbfa] py-16 sm:py-24 font-sans text-gray-800 scroll-mt-20 lg:scroll-mt-24 border-t border-gray-200/80"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-300 bg-blue-50/90 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-900 shadow-xs mb-4">
            <Award className="h-4 w-4 text-blue-600" />
            Globally Recognized Industry Credentials
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-gray-900 leading-tight">
            Graduate with Certifications from{" "}
            <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-[#1E7CBC] bg-clip-text text-transparent">
              Meta, HubSpot, Semrush & Google
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Recruiters don&apos;t just look at course completion certificates. We prepare and coach you to earn high-value credentials issued directly by the world&apos;s leading marketing platforms that can be shared on your LinkedIn profile.
          </p>

          {/* Key Advantages Ribbon */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto text-left">
            <div className="rounded-2xl border border-gray-200/90 bg-white p-4 shadow-xs">
              <div className="h-8 w-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-2">
                <Globe className="h-4 w-4" />
              </div>
              <p className="text-sm font-bold text-gray-900">10+ Global Certs</p>
              <p className="text-xs text-gray-500 mt-0.5">Meta, HubSpot, Semrush, Google</p>
            </div>

            <div className="rounded-2xl border border-gray-200/90 bg-white p-4 shadow-xs">
              <div className="h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-2">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <p className="text-sm font-bold text-gray-900">100% Exam Coaching</p>
              <p className="text-xs text-gray-500 mt-0.5">Mock question banks & revision</p>
            </div>

            <div className="rounded-2xl border border-gray-200/90 bg-white p-4 shadow-xs">
              <div className="h-8 w-8 rounded-xl bg-[#1E7CBC]/10 flex items-center justify-center text-[#1E7CBC] mb-2">
                <BadgeCheck className="h-4 w-4" />
              </div>
              <p className="text-sm font-bold text-gray-900">LinkedIn Shareable</p>
              <p className="text-xs text-gray-500 mt-0.5">Verified digital badges & IDs</p>
            </div>

            <div className="rounded-2xl border border-gray-200/90 bg-white p-4 shadow-xs">
              <div className="h-8 w-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 mb-2">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <p className="text-sm font-bold text-gray-900">SkillYards Capstone</p>
              <p className="text-xs text-gray-500 mt-0.5">Proof of live ad spend execution</p>
            </div>
          </div>
        </div>

        {/* ─── BRAND LOGOS INFINITE SCROLL STRIP ─── */}
        <div className="relative mb-12 overflow-hidden rounded-2xl border border-gray-200 bg-white py-4 shadow-xs">
          <style>{`
            @keyframes certMarquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
          <div className="flex gap-8 w-max items-center animate-[certMarquee_25s_linear_infinite] hover:[animation-play-state:paused]">
            {[...brandLogos, ...brandLogos].map((brand, bIdx) => {
              const BrandIcon = brand.Icon;
              return (
                <div
                  key={`brand-${brand.name}-${bIdx}`}
                  className="group flex items-center gap-2.5 px-3 py-1.5 grayscale-0 opacity-100 hover:grayscale hover:opacity-60 transition-all duration-300 cursor-pointer"
                >
                  <BrandIcon className="h-6 w-6 shrink-0 transition-transform duration-300 group-hover:scale-95" style={{ color: brand.color }} />
                  <span className="text-sm font-bold text-gray-800 group-hover:text-gray-400 whitespace-nowrap transition-colors duration-300">
                    {brand.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── CATEGORY FILTER BUTTONS ─── */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`cursor-pointer rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all ${
              activeFilter === "all"
                ? "bg-gray-900 text-white shadow-md shadow-gray-900/10"
                : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            All Certifications ({certificationsData.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter("paid")}
            className={`cursor-pointer rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all ${
              activeFilter === "paid"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "bg-white text-gray-600 border border-gray-200 hover:border-blue-200 hover:bg-blue-50/50"
            }`}
          >
            Performance & Paid Ads (Meta, Google, Microsoft)
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter("organic")}
            className={`cursor-pointer rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all ${
              activeFilter === "organic"
                ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                : "bg-white text-gray-600 border border-gray-200 hover:border-orange-200 hover:bg-orange-50/50"
            }`}
          >
            SEO & Inbound (Semrush, HubSpot)
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter("capstone")}
            className={`cursor-pointer rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all ${
              activeFilter === "capstone"
                ? "bg-[#1E7CBC] text-white shadow-md shadow-[#1E7CBC]/20"
                : "bg-white text-gray-600 border border-gray-200 hover:border-[#1E7CBC]/30 hover:bg-[#1E7CBC]/10"
            }`}
          >
            SkillYards INDUSTRYCreds®
          </button>
        </div>

        {/* ─── CERTIFICATION CARDS GRID ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCerts.map((cert) => {
            const BrandIcon = cert.Icon;
            return (
              <div
                key={cert.id}
                className={`group relative flex flex-col justify-between rounded-[26px] bg-white border border-gray-200/90 p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] ${cert.borderHover}`}
              >
                <div>
                  {/* Card Header: Brand Icon + Issuer Badge */}
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-12 w-12 rounded-2xl flex items-center justify-center shadow-xs border border-gray-100"
                        style={{ backgroundColor: `${cert.brandColor}15` }}
                      >
                        <BrandIcon className="h-6 w-6" style={{ color: cert.brandColor }} />
                      </div>

                      <div>
                        <span className="text-xs font-black uppercase tracking-wider text-gray-900 block">
                          {cert.brand}
                        </span>
                        <span className="text-[11px] text-gray-500 font-medium">
                          {cert.issuer}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${cert.badgeBg}`}
                    >
                      {cert.badgeText}
                    </span>
                  </div>

                  {/* Certificate Title */}
                  <h3 className="text-lg font-black text-gray-900 leading-snug mb-2 group-hover:text-[#1E7CBC] transition-colors">
                    {cert.name}
                  </h3>

                  {/* Recruiter Priority Tag */}
                  <div className="rounded-xl bg-gray-50 border border-gray-200/70 p-3 mb-4 text-xs">
                    <p className="font-bold text-[11px] text-gray-700 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-[#1E7CBC]" />
                      Recruiter Value
                    </p>
                    <p className="text-gray-600 leading-tight font-medium">
                      {cert.recruiterValue}
                    </p>
                  </div>

                  {/* Skills Tested */}
                  <div className="mb-4">
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Competencies Covered
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {cert.skills.slice(0, 3).map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-700"
                        >
                          {skill}
                        </span>
                      ))}
                      {cert.skills.length > 3 && (
                        <span className="rounded-md bg-gray-50 px-1.5 py-0.5 text-[10px] font-bold text-gray-400">
                          +{cert.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Action Button */}
                <div className="pt-4 border-t border-gray-100 mt-auto">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1 font-medium">
                      <BookOpen className="h-3.5 w-3.5 text-gray-400" />
                      {cert.syllabusModule}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedCert(cert)}
                    className="cursor-pointer w-full rounded-xl bg-gray-900 hover:bg-[#1E7CBC] text-white font-bold py-2.5 text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    View Certification Roadmap
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── BOTTOM TRUST & COUNSELLING CARD ─── */}
        <div className="mt-14 rounded-3xl bg-linear-to-r from-gray-900 via-gray-800 to-blue-950 p-6 sm:p-10 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 border border-blue-400/30 px-3.5 py-1 text-xs font-bold text-blue-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              Zero Extra Coaching Fees
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              All Third-Party Certifications are Built into Your Syllabus
            </h3>
            <p className="text-sm text-gray-300 max-w-2xl leading-relaxed">
              You won&apos;t have to buy external guides or coaching. SkillYards mentors provide curated question banks, mock simulation tests, and step-by-step guidance to ensure you clear Meta, HubSpot, Semrush, and Google exams on your first attempt.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer w-full sm:w-auto rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3.5 text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
            >
              <MessageCircle className="h-4 w-4" />
              Ask a Counselor on WhatsApp
            </a>

            <a
              href="#application-form"
              className="cursor-pointer w-full sm:w-auto rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-5 py-3.5 text-sm transition-all duration-200 flex items-center justify-center gap-2"
            >
              Apply for Scholarship
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* ─── MODAL: DETAILED CERTIFICATION ROADMAP ─── */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedCert(null)}
              className="cursor-pointer absolute top-5 right-5 rounded-full p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className="h-14 w-14 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100"
                style={{ backgroundColor: `${selectedCert.brandColor}15` }}
              >
                <selectedCert.Icon className="h-7 w-7" style={{ color: selectedCert.brandColor }} />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-gray-500">
                  {selectedCert.brand} · {selectedCert.issuer}
                </span>
                <h3 className="text-xl font-bold text-gray-900 leading-snug">
                  {selectedCert.name}
                </h3>
              </div>
            </div>

            {/* Overview */}
            <div className="mb-6">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileCheck className="h-4 w-4 text-blue-600" />
                Why This Credential Matters
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 border border-gray-200/80 rounded-2xl p-4">
                {selectedCert.overview}
              </p>
            </div>

            {/* Exam Format & Support Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="rounded-xl bg-blue-50/60 border border-blue-200/60 p-3">
                <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">
                  Exam Duration
                </span>
                <span className="text-base font-black text-gray-900">
                  {selectedCert.examDetails.duration}
                </span>
              </div>

              <div className="rounded-xl bg-emerald-50/60 border border-emerald-200/60 p-3">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                  Passing Benchmark
                </span>
                <span className="text-base font-black text-gray-900">
                  {selectedCert.examDetails.passingScore}
                </span>
              </div>
            </div>

            {/* SkillYards Support Commitment */}
            <div className="mb-6 rounded-2xl bg-[#1E7CBC]/5 border border-[#1E7CBC]/20 p-4 text-xs text-slate-900">
              <div className="flex items-center gap-1.5 font-bold text-[#1E7CBC] mb-1 text-sm">
                <Sparkles className="h-4 w-4 text-[#1E7CBC]" />
                SkillYards Coaching & Voucher Assistance
              </div>
              <p className="leading-relaxed">
                {selectedCert.examDetails.support}
              </p>
            </div>

            {/* Full Competencies List */}
            <div className="mb-6">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                Exam Topics Covered in Class
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedCert.skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg bg-gray-100 border border-gray-200 px-2.5 py-1 text-xs font-bold text-gray-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal CTAs */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer flex-1 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 text-xs sm:text-sm text-center transition-colors flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20"
              >
                <MessageCircle className="h-4 w-4" />
                Ask a Doubt About This Exam
              </a>

              <button
                type="button"
                onClick={() => setSelectedCert(null)}
                className="cursor-pointer rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2.5 text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
