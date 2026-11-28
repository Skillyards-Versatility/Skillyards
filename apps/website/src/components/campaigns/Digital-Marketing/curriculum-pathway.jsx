"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  BookOpen,
  Laptop,
  Globe,
  Sparkles,
  Award,
  Users,
  Calendar,
  Briefcase,
  MessageCircle,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  TrendingUp,
  Target,
  Zap,
  BarChart3,
  Search,
  Share2,
} from "lucide-react";

/* =========================================================================
   1. "WHAT WILL YOU GET AT SKILLYARDS" - 9 CARDS GRID (FROM IMAGE SPEC)
   ========================================================================= */

const whatYouGetCards = [
  {
    icon: BookOpen,
    iconBg: "bg-[#ffeef0]",
    iconColor: "text-[#ff385c]",
    borderHover: "hover:border-[#ff385c]/30",
    title: "60+ Course Modules",
    desc: "SEO, Google Ads, Meta Ads, Email Marketing, Content Strategy, Analytics and more — all in one 6-month intensive program.",
  },
  {
    icon: Laptop,
    iconBg: "bg-[#ebf5ff]",
    iconColor: "text-[#2563eb]",
    borderHover: "hover:border-[#2563eb]/30",
    title: "40+ Tools — Worth ₹40,000, Free",
    desc: "Ahrefs, SEMrush, Google Ads, Canva Pro, Mailchimp and 35+ more industry tools included with student access at no extra cost.",
  },
  {
    icon: Globe,
    iconBg: "bg-[#e0f2fe]",
    iconColor: "text-[#0284c7]",
    borderHover: "hover:border-[#0284c7]/30",
    title: "10+ Google Tools",
    desc: "Google Analytics 4, Search Console, Tag Manager, Merchant Centre, Google My Business and more — hands-on training on the full Google ecosystem.",
  },
  {
    icon: Sparkles,
    iconBg: "bg-[#ecfdf5]",
    iconColor: "text-[#059669]",
    borderHover: "hover:border-[#059669]/30",
    title: "40+ AI Tools Included",
    desc: "ChatGPT, Jasper, Midjourney, Claude, AI-based ad optimization and prompt automation — future-proof skills built directly into every module.",
  },
  {
    icon: Award,
    iconBg: "bg-[#f0fdf4]",
    iconColor: "text-[#16a34a]",
    borderHover: "hover:border-[#16a34a]/30",
    title: "9 Industry Certifications",
    desc: "Google, Meta Blueprint, HubSpot, ISO, MSME, AI Marketing, and SkillYards-issued credentials that top agency recruiters actually value.",
  },
  {
    icon: Users,
    iconBg: "bg-[#fff1f2]",
    iconColor: "text-[#e11d48]",
    borderHover: "hover:border-[#e11d48]/30",
    title: "100% Job Placement — Guaranteed",
    desc: "Resume engineering, mock interview rounds, and direct recruiter connects. 3000+ students placed across leading brands and top marketing agencies.",
  },
  {
    icon: Calendar,
    iconBg: "bg-[#f5f3ff]",
    iconColor: "text-[#7c3aed]",
    borderHover: "hover:border-[#7c3aed]/30",
    title: "Flexible Batch Timings",
    desc: "Morning, Evening and Weekend batches available. All practical sessions are recorded in HD so you never miss a lecture or assignment walkthrough.",
  },
  {
    icon: Briefcase,
    iconBg: "bg-[#1E7CBC]/10",
    iconColor: "text-[#1E7CBC]",
    borderHover: "hover:border-[#1E7CBC]/30",
    title: "Real Internship on Live Projects",
    desc: "Work on live client ad spends and campaigns during the course — not dummy simulations. Build a battle-tested portfolio that gets you hired.",
  },
  {
    icon: MessageCircle,
    iconBg: "bg-[#eff6ff]",
    iconColor: "text-[#3b82f6]",
    borderHover: "hover:border-[#3b82f6]/30",
    title: "24×7 Doubt Support",
    desc: "Dedicated Telegram & WhatsApp cohorts, daily mentor doubt-clearing sessions, and lifetime alumni community access — guidance is always one message away.",
  },
];

/* =========================================================================
   2. PATHWAY ROADMAP CURRICULUM DATA (6 PROGRESSIVE PHASES IN CARDS FORMAT)
   ========================================================================= */

const pathwayPhases = [
  {
    step: "01",
    phase: "Month 1",
    tag: "Core Foundation",
    title: "Digital Marketing Foundations & Search Engine Optimization",
    desc: "Master search engine mechanics, keyword psychology, on-page optimization, and full technical audits that rank real websites on Google.",
    icon: Search,
    accent: "from-blue-500 to-indigo-600",
    tagBg: "bg-blue-50 text-blue-700 border-blue-200",
    deliverable: "Audit & optimize a live client website to rank on Google Page 1.",
    topics: [
      "Digital Marketing Core Channels & Customer Journey Funnels",
      "Advanced Keyword Research & Competitor Gap Analysis",
      "On-Page SEO, Content Structure & Meta Optimization",
      "Technical SEO, Core Web Vitals & Crawlability Audits",
      "Google Search Console & Google My Business (Local SEO)",
    ],
    tools: ["Google Search Console", "SEMrush", "Ahrefs", "Screaming Frog", "Yoast"],
  },
  {
    step: "02",
    phase: "Month 2",
    tag: "Paid Advertising",
    title: "Performance Marketing — Google Ads & Search Engine Marketing",
    desc: "Design and execute high-converting Google Search, Display, Shopping, and YouTube Video ad campaigns with smart bidding strategies.",
    icon: Target,
    accent: "from-[#1E7CBC] to-blue-600",
    tagBg: "bg-[#1E7CBC]/10 text-[#1E7CBC] border-[#1E7CBC]/30",
    deliverable: "Deploy a live Google Ads campaign with budget & achieve target CPA.",
    topics: [
      "Campaign Structuring & Match Types (Exact, Phrase, Broad)",
      "Ad Copy Writing, Extensions & Ad Rank Formulas",
      "Smart Bidding (Target CPA, Target ROAS, Maximize Conversions)",
      "Display Network, YouTube Video Ads & Dynamic Remarketing",
      "Google Merchant Center & E-Commerce Shopping Ads Setup",
    ],
    tools: ["Google Ads", "Merchant Center", "Google Keyword Planner", "Looker Studio"],
  },
  {
    step: "03",
    phase: "Month 3",
    tag: "Social Media Growth",
    title: "Meta Ads (Facebook & Instagram) & Viral Social Strategy",
    desc: "Master audience targeting, creative testing matrices, retargeting funnels, and organic brand storytelling across Meta platforms.",
    icon: Share2,
    accent: "from-rose-500 to-pink-600",
    tagBg: "bg-rose-50 text-rose-700 border-rose-200",
    deliverable: "Build and scale an eCommerce or lead-generation campaign to 3.5x+ ROAS.",
    topics: [
      "Meta Ads Manager Architecture & Campaign Budget Optimization (CBO)",
      "Custom Audiences, Lookalike Modeling & Pixel Event Tracking",
      "High-Converting Ad Creatives, Hooks & Short-Form Video Formats",
      "Funnel Retargeting: TOFU (Top), MOFU (Middle) & BOFU (Bottom)",
      "Social Media Growth: Reels Strategy, Community & Influencer Marketing",
    ],
    tools: ["Meta Ads Manager", "Meta Pixel", "Canva Pro", "CapCut", "Instagram Insights"],
  },
  {
    step: "04",
    phase: "Month 4",
    tag: "Data & Tracking",
    title: "Full-Funnel Analytics (GA4), GTM & Conversion Rate Optimization",
    desc: "Turn clicks into actionable revenue data. Learn event tracking, cross-device attribution, and automated executive dashboards.",
    icon: BarChart3,
    accent: "from-emerald-500 to-teal-600",
    tagBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    deliverable: "Build an automated multi-channel reporting dashboard in Looker Studio.",
    topics: [
      "Google Analytics 4 (GA4) Custom Events & Conversion Funnels",
      "Google Tag Manager (GTM): Triggers, Tags & DataLayers",
      "Conversion Rate Optimization (CRO), Heatmaps & A/B Testing",
      "Attribution Modeling (Data-Driven vs Last Click)",
      "Interactive Multi-Platform Reporting in Looker Studio",
    ],
    tools: ["GA4", "Google Tag Manager", "Looker Studio", "Hotjar", "Microsoft Clarity"],
  },
  {
    step: "05",
    phase: "Month 5",
    tag: "AI & Automation",
    title: "Generative AI for Marketing, Copywriting & Funnel Automation",
    desc: "Amplify your productivity 10x. Integrate generative AI into research, creative generation, email workflows, and programmatic tasks.",
    icon: Zap,
    accent: "from-purple-500 to-violet-600",
    tagBg: "bg-purple-50 text-purple-700 border-purple-200",
    deliverable: "Deploy an automated AI-driven lead capture and email nurturing funnel.",
    topics: [
      "Advanced Prompt Engineering for Copywriting & Ad Variations",
      "AI Visual Creation & Image Generation with Midjourney & DALL-E",
      "Automated Email Marketing & Drip Sequences with Mailchimp",
      "No-Code Marketing Automations using Zapier & Webhooks",
      "AI Data Extraction, Sentiment Analysis & Trend Forecasting",
    ],
    tools: ["ChatGPT Plus", "Claude 3.5", "Midjourney", "Zapier", "Mailchimp"],
  },
  {
    step: "06",
    phase: "Month 6",
    tag: "Agency Internship",
    title: "Live Agency Internship, Client Capstone & 100% Placement Support",
    desc: "Work on live brand campaigns, compile verified case studies, and clear HR & technical agency interview rounds with mock guidance.",
    icon: TrendingUp,
    accent: "from-cyan-500 to-blue-600",
    tagBg: "bg-cyan-50 text-cyan-700 border-cyan-200",
    deliverable: "Complete a verified agency portfolio with live ROAS proof & land job offers.",
    topics: [
      "Live Client Campaign Management with Real Budgets",
      "Agency Client Pitching, Scope of Work & Budget Forecasting",
      "Portfolio Website Creation & Case Study Documentation",
      "Technical Marketing Mock Interviews with Industry Leaders",
      "Resume & LinkedIn Makeover with Direct Recruiter Connects",
    ],
    tools: ["Live Client Accounts", "LinkedIn Recruiter", "Portfolio Hub", "Figma"],
  },
];

/* =========================================================================
   MAIN COMPONENT: CURRICULUM PATHWAY & WHAT YOU GET
   ========================================================================= */

export default function CurriculumPathway({ id = "curriculum" }) {
  const [expandedPhase, setExpandedPhase] = useState(null);
  const containerRef = useRef(null);
  const nodeRefs = useRef([]);
  const [trackMetrics, setTrackMetrics] = useState({
    top: 52,
    height: 0,
    nodeOffsets: [],
  });
  const [activeHeight, setActiveHeight] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const togglePhase = (index) => {
    setExpandedPhase(expandedPhase === index ? null : index);
  };

  const measureTimeline = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const validNodes = nodeRefs.current.filter(Boolean);

    if (validNodes.length < 2) return;

    const firstRect = validNodes[0].getBoundingClientRect();
    const lastRect = validNodes[validNodes.length - 1].getBoundingClientRect();

    const top = firstRect.top - containerRect.top + firstRect.height / 2;
    const bottom = lastRect.top - containerRect.top + lastRect.height / 2;
    const height = Math.max(0, bottom - top);

    const offsets = validNodes.map((node) => {
      const rect = node.getBoundingClientRect();
      const nodeCenter = rect.top - containerRect.top + rect.height / 2;
      return Math.max(0, nodeCenter - top);
    });

    setTrackMetrics({
      top,
      height,
      nodeOffsets: offsets,
    });
  }, []);

  useEffect(() => {
    measureTimeline();

    const handleResize = () => {
      measureTimeline();
    };

    window.addEventListener("resize", handleResize);

    let resizeObserver;
    if (typeof ResizeObserver !== "undefined" && containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        measureTimeline();
      });
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [measureTimeline, expandedPhase]);

  useEffect(() => {
    const handleScroll = () => {
      const validNodes = nodeRefs.current.filter(Boolean);
      if (validNodes.length < 2 || !containerRef.current || trackMetrics.height <= 0) return;

      const triggerY = window.innerHeight * 0.52;
      const nodePositions = validNodes.map((node) => {
        const rect = node.getBoundingClientRect();
        return rect.top + rect.height / 2;
      });

      const firstY = nodePositions[0];
      const lastY = nodePositions[nodePositions.length - 1];
      const offsets = trackMetrics.nodeOffsets;

      if (triggerY <= firstY) {
        // Above Milestone 1
        setActiveHeight(0);
        setCurrentStep(0);
        return;
      }

      if (triggerY >= lastY) {
        // At or past Milestone 6
        setActiveHeight(trackMetrics.height);
        setCurrentStep(validNodes.length);
        return;
      }

      // Between milestones: find active segment
      let segmentIndex = 0;
      for (let i = 0; i < nodePositions.length - 1; i++) {
        if (triggerY >= nodePositions[i] && triggerY <= nodePositions[i + 1]) {
          segmentIndex = i;
          break;
        }
      }

      const segmentStart = nodePositions[segmentIndex];
      const segmentEnd = nodePositions[segmentIndex + 1];
      const segmentSpan = segmentEnd - segmentStart;

      let fraction = 0;
      if (segmentSpan > 0) {
        fraction = (triggerY - segmentStart) / segmentSpan;
      }

      const offsetStart = offsets[segmentIndex] || 0;
      const offsetEnd = offsets[segmentIndex + 1] || trackMetrics.height;
      const computedHeight = offsetStart + fraction * (offsetEnd - offsetStart);

      setActiveHeight(Math.max(0, Math.min(trackMetrics.height, computedHeight)));
      // Node lights up as progress reaches it
      setCurrentStep(segmentIndex + (fraction >= 0.92 ? 2 : 1));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [trackMetrics]);

  return (
    <section id={id} className="w-full bg-[#faf9f6] py-16 sm:py-24 font-sans text-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ============================================================ */}
        {/* PART 1: "WHAT WILL YOU GET AT SKILLYARDS" (9 CARDS GRID)     */}
        {/* ============================================================ */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-5xl lg:text-[52px] font-extrabold tracking-tight text-gray-900 leading-tight">
            What will you get at{" "}
            <span className="inline-block">
              <span className="text-[#183D71]">Skill</span>
              <span className="text-[#1E7CBC]">Yards</span>.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Everything you need to transform into a high-earning digital marketer — comprehensive modules, paid tools, and guaranteed career support.
          </p>
        </div>

        {/* 3x3 CARDS GRID (Exactly matching user's image spec) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-24 sm:mb-32">
          {whatYouGetCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className={`group flex items-start gap-4 p-6 sm:p-7 rounded-[22px] bg-white border border-gray-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.07)] ${card.borderHover}`}
              >
                {/* Left Colored Icon Container */}
                <div
                  className={`flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl ${card.iconBg} ${card.iconColor} transition-transform duration-300 group-hover:scale-105`}
                >
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.2} />
                </div>

                {/* Right Content */}
                <div className="min-w-0 flex-1">
                  <h3 className="text-[15px] sm:text-[16px] font-bold text-gray-900 leading-snug">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-[13px] sm:text-[13.5px] leading-relaxed text-gray-600 font-normal">
                    {card.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ============================================================ */}
        {/* PART 2: PATHWAY-STYLE CURRICULUM ROADMAP                     */}
        {/* ============================================================ */}
        <div className="text-center mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1E7CBC]/30 bg-[#1E7CBC]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#1E7CBC] mb-4">
            <Sparkles className="h-3.5 w-3.5 text-[#1E7CBC]" />
            Learning Pathway Roadmap
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-gray-900 leading-tight">
            The 6-Month Digital Marketing{" "}
            <span className="bg-gradient-to-r from-[#1E7CBC] to-blue-600 bg-clip-text text-transparent">
              Career Pathway
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Follow our battle-tested step-by-step roadmap. Each month unlocks advanced skills, hands-on tool proficiencies, and portfolio-ready client campaign deliverables.
          </p>
        </div>

        {/* ROADMAP PATHWAY CONTAINER (Vertical timeline with animated milestone progress) */}
        <div ref={containerRef} className="relative mx-auto max-w-5xl">
          {/* Base Unfilled Spine Line (Muted Track) */}
          <div
            className="pointer-events-none absolute left-5 sm:left-8 lg:left-1/2 -translate-x-1/2 w-1 sm:w-1.5 bg-slate-200/90 rounded-full"
            style={{
              top: `${trackMetrics.top}px`,
              height: `${trackMetrics.height || 0}px`,
            }}
            aria-hidden="true"
          />

          {/* Active Progress Fill Line (#1E7CBC Brand Blue) */}
          <div
            className="pointer-events-none absolute left-5 sm:left-8 lg:left-1/2 -translate-x-1/2 w-1 sm:w-1.5 rounded-full z-10 bg-gradient-to-b from-[#1E7CBC] via-[#1E7CBC] to-blue-400 shadow-[0_0_12px_rgba(30,124,188,0.5)] transition-[height] duration-75 ease-out"
            style={{
              top: `${trackMetrics.top}px`,
              height: `${activeHeight}px`,
              maxHeight: `${trackMetrics.height || 0}px`,
            }}
            aria-hidden="true"
          >
            {/* Traveling Pulse Glow Dot at the head of the progress bar */}
            {activeHeight > 6 && trackMetrics.height > 0 && activeHeight < trackMetrics.height - 6 && (
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full bg-[#1E7CBC] ring-4 ring-blue-100 shadow-[0_0_14px_rgba(30,124,188,0.9)] animate-pulse" />
            )}
          </div>

          <div className="space-y-8 sm:space-y-12">
            {pathwayPhases.map((phase, index) => {
              const PhaseIcon = phase.icon;
              const isEven = index % 2 === 0;
              const isExpanded = expandedPhase === index;
              const stepNumber = parseInt(phase.step, 10);
              const isReached = currentStep >= stepNumber;
              const isActive = currentStep === stepNumber;

              return (
                <div
                  key={phase.step}
                  className={`relative flex flex-col sm:flex-row items-start gap-4 sm:gap-8 ${
                    isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Central Timeline Milestone Node */}
                  <div
                    ref={(el) => {
                      nodeRefs.current[index] = el;
                    }}
                    className={`flex absolute left-5 sm:left-8 lg:left-1/2 -translate-x-1/2 top-7 sm:top-8 z-20 h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full transition-all duration-300 ${
                      isReached
                        ? "bg-[#1E7CBC] text-white border-4 border-blue-100 shadow-[0_0_16px_rgba(30,124,188,0.45)] scale-105 sm:scale-110"
                        : "bg-white text-gray-400 border-2 border-gray-300 shadow-sm scale-95 sm:scale-100"
                    } ${isActive ? "ring-4 ring-[#1E7CBC]/30" : ""}`}
                  >
                    <span className="text-xs sm:text-sm font-extrabold tracking-tight">{phase.step}</span>
                  </div>

                  {/* Spacer for desktop 2-column alternating layout */}
                  <div className="hidden lg:block lg:w-1/2" />

                  {/* Pathway Card */}
                  <div className="w-full pl-10 sm:pl-16 lg:pl-0 lg:w-1/2">
                    <div
                      className={`group rounded-[24px] bg-white border p-6 sm:p-8 transition-all duration-300 hover:shadow-[0_12px_36px_rgba(0,0,0,0.09)] hover:border-[#1E7CBC]/50 ${
                        isReached
                          ? "border-[#1E7CBC]/40 shadow-[0_8px_30px_rgba(30,124,188,0.07)]"
                          : "border-gray-200/80 shadow-[0_6px_25px_rgba(0,0,0,0.04)]"
                      }`}
                    >

                      {/* Header Row: Phase Badge + Step Tag */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-2.5">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${phase.tagBg}`}>
                            {phase.phase} • {phase.tag}
                          </span>
                        </div>
                        <span className="text-xs font-extrabold uppercase tracking-widest text-gray-400 sm:hidden">
                          Step {phase.step}
                        </span>
                      </div>

                      {/* Title & Icon */}
                      <div className="flex items-start gap-3.5 mb-3">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${phase.accent} text-white shadow-sm mt-0.5`}>
                          <PhaseIcon className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                          {phase.title}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-sm leading-relaxed text-gray-600 mb-5">
                        {phase.desc}
                      </p>

                      {/* Live Deliverable Box */}
                      <div className="rounded-xl bg-[#1E7CBC]/5 border border-[#1E7CBC]/20 p-3.5 mb-5 flex items-start gap-2.5">
                        <Target className="h-4 w-4 shrink-0 text-[#1E7CBC] mt-0.5" />
                        <p className="text-xs sm:text-[13px] font-medium text-slate-800 leading-snug">
                          <strong className="font-bold text-slate-900">Live Deliverable: </strong>
                          {phase.deliverable}
                        </p>
                      </div>

                      {/* Tools Used Pills */}
                      <div className="mb-4">
                        <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                          Tools Mastered:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {phase.tools.map((tool, tIdx) => (
                            <span
                              key={tIdx}
                              className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Expandable Module Topics */}
                      <button
                        type="button"
                        onClick={() => togglePhase(index)}
                        className="mt-2 flex w-full items-center justify-between border-t border-gray-100 pt-3.5 text-xs font-bold text-gray-700 hover:text-[#1E7CBC] transition-colors"
                      >
                        <span>{isExpanded ? "Hide Detailed Topics" : "View Modules & Topics Covered"}</span>
                        <ChevronDown
                          className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                            isExpanded ? "rotate-180 text-[#1E7CBC]" : ""
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="mt-3.5 space-y-2 pt-2 border-t border-dashed border-gray-200 animate-[fadeIn_0.25s_ease-out]">
                          {phase.topics.map((topic, topIdx) => (
                            <div key={topIdx} className="flex items-start gap-2 text-xs sm:text-[13px] text-gray-600">
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                              <span>{topic}</span>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA CARD AT BOTTOM OF CURRICULUM */}
        <div className="mt-16 sm:mt-20 rounded-[28px] bg-gradient-to-r from-gray-900 via-[#1a1c29] to-[#0f172a] p-8 sm:p-12 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="inline-block rounded-full bg-[#1E7CBC]/20 px-4 py-1 text-xs font-bold uppercase tracking-widest text-cyan-200 mb-4">
              Ready to begin your journey?
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Start Learning with <span className="text-white">Skill</span><span className="text-[#1E7CBC]">Yards</span> Today
            </h3>
            <p className="mt-3 text-sm sm:text-base text-gray-300 leading-relaxed">
              Join 3300+ students who transformed their careers. Get hands-on live training with 100% placement support.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#application-form"
                className="inline-flex items-center gap-2 rounded-full bg-[#1E7CBC] px-7 py-3 text-sm font-bold text-white transition duration-200 hover:bg-[#166091] hover:shadow-lg"
              >
                Apply for Next Batch
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
