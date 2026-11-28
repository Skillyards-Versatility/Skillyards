"use client";

import { useState } from "react";
import {
  Award,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import {
  SiMeta,
  SiHubspot,
  SiSemrush,
  SiGoogle,
  SiGoogleads,
  SiGoogleanalytics,
} from "react-icons/si";
import { FaLinkedin, FaMicrosoft } from "react-icons/fa6";

// Marquee Brand Logos Strip (Exact Order Requested)
const brandLogos = [
  { name: "Google Skillshop", Icon: SiGoogle, color: "#4285F4" },
  { name: "Meta Blueprint", Icon: SiMeta, color: "#0081FB" },
  { name: "HubSpot Academy", Icon: SiHubspot, color: "#FF7A59" },
  { name: "Semrush Academy", Icon: SiSemrush, color: "#FF642D" },
  { name: "Microsoft Advertising", Icon: FaMicrosoft, color: "#00A4EF" },
  { name: "Google Analytics", Icon: SiGoogleanalytics, color: "#E37400" },
  { name: "Google Ads", Icon: SiGoogleads, color: "#4285F4" },
];

// 15+ Industry Certification Opportunities
const certificationsOpportunities = [
  { name: "Google Ads Search Certification", issuer: "Google Skillshop", Icon: SiGoogle, brandColor: "#4285F4" },
  { name: "Google Ads Display Certification", issuer: "Google Skillshop", Icon: SiGoogle, brandColor: "#4285F4" },
  { name: "Google Ads Video & YouTube Certification", issuer: "Google Skillshop", Icon: SiGoogle, brandColor: "#4285F4" },
  { name: "Google Ads Measurement Certification", issuer: "Google Skillshop", Icon: SiGoogle, brandColor: "#4285F4" },
  { name: "Google Analytics 4 (GA4) Certification", issuer: "Google Analytics", Icon: SiGoogleanalytics, brandColor: "#E37400" },
  { name: "Meta Certified Digital Marketing Associate", issuer: "Meta Blueprint", Icon: SiMeta, brandColor: "#0081FB" },
  { name: "Meta Certified Media Buying Professional", issuer: "Meta Blueprint", Icon: SiMeta, brandColor: "#0081FB" },
  { name: "HubSpot Inbound Marketing Certification", issuer: "HubSpot Academy", Icon: SiHubspot, brandColor: "#FF7A59" },
  { name: "HubSpot Content Marketing Certification", issuer: "HubSpot Academy", Icon: SiHubspot, brandColor: "#FF7A59" },
  { name: "HubSpot Email Marketing Certification", issuer: "HubSpot Academy", Icon: SiHubspot, brandColor: "#FF7A59" },
  { name: "Semrush SEO Toolkit Certification", issuer: "Semrush Academy", Icon: SiSemrush, brandColor: "#FF642D" },
  { name: "Semrush Technical SEO Certification", issuer: "Semrush Academy", Icon: SiSemrush, brandColor: "#FF642D" },
  { name: "Semrush Keyword Research Certification", issuer: "Semrush Academy", Icon: SiSemrush, brandColor: "#FF642D" },
  { name: "Microsoft Advertising Certified Professional", issuer: "Microsoft Advertising", Icon: FaMicrosoft, brandColor: "#00A4EF" },
  { name: "SkillYards Certified Digital Marketer", issuer: "SkillYards Capstone", Icon: Award, brandColor: "#1E7CBC" },
];

export default function CertificationsSection({ id = "certifications" }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section
      id={id}
      className="w-full bg-[#fbfbfa] py-16 sm:py-24 font-sans text-gray-800 scroll-mt-20 lg:scroll-mt-24 border-t border-gray-200/80"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-300 bg-blue-50/90 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-900 shadow-xs mb-4">
            <Award className="h-4 w-4 text-blue-600" />
            GLOBALLY RECOGNIZED INDUSTRY CREDENTIALS
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-gray-900 leading-tight">
            One Course.{" "}
            <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-[#1E7CBC] bg-clip-text text-transparent">
              15+ Industry Certifications.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Go beyond a course completion certificate. Prepare to earn globally
            recognized credentials from leading digital marketing platforms and
            build a resume that stands out.
          </p>

          {/* 4 Highlight Cards */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto text-left">
            {/* Highlight Card 01 */}
            <div className="rounded-2xl border border-gray-200/90 bg-white p-4 shadow-xs">
              <div className="h-8 w-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-2">
                <Award className="h-4 w-4" />
              </div>
              <p className="text-sm font-bold text-gray-900">15+ Certifications</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Industry-recognized credentials.
              </p>
            </div>

            {/* Highlight Card 02 */}
            <div className="rounded-2xl border border-gray-200/90 bg-white p-4 shadow-xs">
              <div className="h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-2">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <p className="text-sm font-bold text-gray-900">Exam Preparation</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Mentor-guided learning.
              </p>
            </div>

            {/* Highlight Card 03 */}
            <div className="rounded-2xl border border-gray-200/90 bg-white p-4 shadow-xs">
              <div className="h-8 w-8 rounded-xl bg-[#1E7CBC]/10 flex items-center justify-center text-[#1E7CBC] mb-2">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <p className="text-sm font-bold text-gray-900">
                Professional Credentials
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Strengthen your resume.
              </p>
            </div>

            {/* Highlight Card 04 */}
            <div className="rounded-2xl border border-gray-200/90 bg-white p-4 shadow-xs">
              <div className="h-8 w-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-2">
                <FaLinkedin className="h-4 w-4 text-[#0077b5]" />
              </div>
              <p className="text-sm font-bold text-gray-900">LinkedIn Shareable</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Showcase your expertise.
              </p>
            </div>
          </div>
        </div>

        {/* ─── BRAND LOGOS INFINITE SCROLL STRIP ─── */}
        <div className="relative mb-10 overflow-hidden rounded-2xl border border-gray-200 bg-white py-4 shadow-xs">
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
                  className="group flex items-center gap-2.5 px-3 py-1.5 grayscale-0 opacity-100 hover:grayscale hover:opacity-60 transition-all duration-300"
                >
                  <BrandIcon
                    className="h-6 w-6 shrink-0 transition-transform duration-300 group-hover:scale-95"
                    style={{ color: brand.color }}
                  />
                  <span className="text-sm font-bold text-gray-800 group-hover:text-gray-400 whitespace-nowrap transition-colors duration-300">
                    {brand.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── EXPANDABLE SECTION (OPTIONAL) ─── */}
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-gray-200/90 bg-white shadow-xs overflow-hidden transition-all duration-300">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="cursor-pointer w-full flex items-center justify-between p-5 text-left font-bold text-gray-900 hover:bg-gray-50/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    Explore Certification Opportunities
                  </h3>
                  <p className="text-xs text-gray-500 font-normal mt-0.5">
                    Click to view all 15+ industry credentials covered across Google, Meta, HubSpot, Semrush & Microsoft
                  </p>
                </div>
              </div>
              <div
                className={`transform transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              >
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </button>

            {isExpanded && (
              <div className="border-t border-gray-100 p-5 sm:p-6 bg-[#fbfbfa]/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {certificationsOpportunities.map((item, idx) => {
                    const BrandIcon = item.Icon;
                    return (
                      <div
                        key={idx}
                        className="rounded-xl border border-gray-200/80 bg-white p-3.5 flex items-start gap-3 shadow-2xs hover:border-blue-300 hover:shadow-xs transition-all"
                      >
                        <div
                          className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border border-gray-100"
                          style={{ backgroundColor: `${item.brandColor}15` }}
                        >
                          <BrandIcon
                            className="h-4 w-4"
                            style={{ color: item.brandColor }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-gray-900 leading-snug truncate">
                            {item.name}
                          </p>
                          <span className="text-[11px] text-gray-500 block mt-0.5">
                            {item.issuer}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ─── DISCLAIMER ─── */}
          <p className="text-xs text-gray-500 text-center mt-6 max-w-2xl mx-auto leading-relaxed">
            <span className="font-semibold text-gray-600">Disclaimer:</span>{" "}
            Certifications are subject to the respective platform&apos;s
            assessment and eligibility requirements. Additional examination fees
            may apply.
          </p>
        </div>
      </div>
    </section>
  );
}
