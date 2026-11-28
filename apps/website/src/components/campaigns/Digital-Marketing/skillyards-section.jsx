"use client";

import { useEffect, useRef, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import {
  Palette,
  Monitor,
  ShoppingCart,
  Megaphone,
  Search,
  Users,
  BarChart3,
  Bot,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  BookOpen,
  Sparkles,
} from "lucide-react";

// MAIN NAVIGATION
const mainTabs = [
  "Benefits",
  "What You’ll Learn",
  "Experts",
  "Certifications",
  "Reviews",
  "Campus",
  "FAQs",
];

// ==========================================
// THE SKILLYARDS ADVANTAGE COMPARISON DATA
// ==========================================
const advantageRows = [
  {
    icon: Palette,
    area: "Graphic Design",
    concept: "Learn design principles and tools.",
    approach: "Create professional brand identities and advertising creatives.",
    highlights: [
      "Design high-converting Meta & Google ad creatives in Canva & Photoshop",
      "Develop brand visual identities, color palettes & typography sets",
      "Build a portfolio of social banners, thumbnails & commercial posters",
    ],
  },
  {
    icon: Monitor,
    area: "Website Development",
    concept: "Understand how websites work.",
    approach: "Build and deploy your own functional website.",
    highlights: [
      "Set up live domains, hosting, SSL & CDN from scratch",
      "Build conversion-optimized landing pages with modern no-code builders",
      "Implement tracking pixels, speed optimization & mobile responsiveness",
    ],
  },
  {
    icon: ShoppingCart,
    area: "E-Commerce",
    concept: "Study online business models.",
    approach: "Build a Shopify store and develop a product launch strategy.",
    highlights: [
      "Create and configure a live Shopify store with product catalogs",
      "Integrate Razorpay / Stripe payment gateways & shipping logistics",
      "Execute direct-to-consumer (D2C) ad funnels and abandoned cart recovery",
    ],
  },
  {
    icon: Megaphone,
    area: "Paid Advertising",
    concept: "Understand advertising platforms.",
    approach: "Create multi-platform ad campaigns and optimize performance.",
    highlights: [
      "Manage live ad budgets on Meta Ads Manager (Facebook & Instagram)",
      "Launch Google Search, Display, YouTube & Performance Max campaigns",
      "A/B test creative hooks, headlines, audiences and scale ROAS",
    ],
  },
  {
    icon: Search,
    area: "SEO & AI Search",
    concept: "Learn keywords and ranking factors.",
    approach: "Conduct SEO audits and optimize websites for traditional and AI search.",
    highlights: [
      "Perform technical, on-page, and off-page SEO audits with Semrush",
      "Optimize content for AI Search engines like ChatGPT Search & Google AI Overviews",
      "High-authority backlink outreach and local Google Business Profile rank tracking",
    ],
  },
  {
    icon: Users,
    area: "Social Media Marketing",
    concept: "Learn content and engagement strategies.",
    approach: "Build a complete 30-day brand growth campaign.",
    highlights: [
      "Formulate 30-day cross-platform content calendars & viral video hooks",
      "Execute organic brand growth, community building & audience engagement",
      "Influencer collaboration frameworks and crisis management playbooks",
    ],
  },
  {
    icon: BarChart3,
    area: "Marketing Analytics",
    concept: "Understand marketing metrics.",
    approach: "Analyse campaign data and create professional performance reports.",
    highlights: [
      "Configure Google Analytics 4 (GA4) custom events and conversion goals",
      "Build live executive performance dashboards in Looker Studio",
      "Interpret CAC, LTV, ROAS, bounce rates and calculate true marketing ROI",
    ],
  },
  {
    icon: Bot,
    area: "AI & Automation",
    concept: "Explore AI tools and automation concepts.",
    approach: "Build AI agents and automated marketing workflows.",
    highlights: [
      "Engineer custom prompts for instant ad copywriting & graphic prompts",
      "Automate lead capture, CRM updates and email drip campaigns with Zapier & Make",
      "Deploy intelligent WhatsApp & website AI chatbots for automated nurturing",
    ],
  },
  {
    icon: Briefcase,
    area: "Career Preparation",
    concept: "Acquire theoretical subject knowledge.",
    approach: "Build a professional portfolio backed by 15+ practical projects.",
    highlights: [
      "Publish a verified, recruiter-ready live digital marketing portfolio",
      "Participate in 1:1 behavioral & technical mock interview debriefs",
      "Receive 100% placement assistance, resume revamp & verified job referrals",
    ],
  },
];

const advantageStats = [
  { value: "80%", label: "Practical Learning" },
  { value: "15+", label: "Hands-on Projects" },
  { value: "100%", label: "Placement Assistance" },
];

// ==========================================
// BENEFITS CONTENT (THE SKILLYARDS ADVANTAGE)
// ==========================================
function Benefits() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeItem = advantageRows[activeIdx];
  const ActiveIcon = activeItem.icon;
  const mobileTabsRef = useRef(null);
  const tabButtonRefs = useRef([]);

  // Auto-scroll the active tab button into center on mobile
  useEffect(() => {
    const activeBtn = tabButtonRefs.current[activeIdx];
    const container = mobileTabsRef.current;
    if (activeBtn && container) {
      const scrollOffset =
        activeBtn.offsetLeft - container.offsetWidth / 2 + activeBtn.offsetWidth / 2;
      container.scrollTo({
        left: Math.max(0, scrollOffset),
        behavior: "smooth",
      });
    }
  }, [activeIdx]);

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % advantageRows.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + advantageRows.length) % advantageRows.length);
  };

  return (
    <section className="px-3 sm:px-6 py-8 sm:py-14 font-sans bg-white">
      <div className="max-w-6xl mx-auto rounded-3xl bg-white border border-gray-200/90 p-4 sm:p-6 md:p-6 lg:p-10 xl:p-12 shadow-xs">
        {/* ─── SECTION HEADER ─── */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#1E7CBC] mb-2 sm:mb-3">
            THE SKILLYARDS ADVANTAGE
          </p>

          <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-extrabold tracking-tight text-gray-900 leading-tight">
            Why Choose <span className="text-[#1E7CBC]">SkillYards</span> for Digital Marketing in Agra?
          </h2>

          <p className="mt-2.5 sm:mt-3.5 text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Knowing how digital marketing works is one thing. Being able to execute it is another. Click through any learning area below to discover the difference between learning concepts and building real-world marketing skills.
          </p>
        </div>

        {/* ─── INTERACTIVE CLICK-TO-VIEW SELECTOR ─── */}



        {/* Desktop & Tablet Grid: Equal Height (items-stretch) */}
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] lg:grid-cols-[270px_1fr] xl:grid-cols-[290px_1fr] gap-3.5 md:gap-4 lg:gap-6 items-stretch">
          {/* Left Column: Tab Buttons (defines the height on desktop & tablet) */}
          <div className="hidden md:flex flex-col justify-between gap-1 md:gap-1.5 lg:gap-2 h-full">
            <div className="text-[11px] lg:text-xs font-bold uppercase tracking-wider text-gray-400 px-2 pb-0.5">
              Select Learning Area ({advantageRows.length})
            </div>
            {advantageRows.map((row, idx) => {
              const Icon = row.icon;
              const isSelected = activeIdx === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`w-full flex-1 flex items-center justify-between px-2.5 py-2 md:px-3 md:py-2 lg:px-3.5 lg:py-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer ${isSelected
                    ? "bg-[#1E7CBC] text-white shadow-md shadow-[#1E7CBC]/25 font-bold translate-x-0.5 md:translate-x-1"
                    : "bg-slate-50/80 hover:bg-slate-100/90 text-gray-700 border border-gray-200/70 font-medium"
                    }`}
                >
                  <div className="flex items-center gap-2 lg:gap-3 min-w-0">
                    <div
                      className={`h-7 w-7 md:h-8 md:w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isSelected
                        ? "bg-white/20 text-white"
                        : "bg-white text-[#1E7CBC] border border-gray-200 shadow-2xs"
                        }`}
                    >
                      <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    </div>
                    <span className="text-xs lg:text-[13px] font-semibold truncate">{row.area}</span>
                  </div>
                  <ChevronRight
                    className={`h-3.5 w-3.5 md:h-4 md:w-4 shrink-0 transition-transform ${isSelected ? "text-white translate-x-0.5" : "text-gray-400 opacity-60"
                      }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Column: Tab Content Panel (h-full matches left column exactly) */}
          <div className="w-full h-full rounded-2xl border border-gray-200 bg-white p-3.5 sm:p-4 md:p-4.5 lg:p-6 shadow-xs flex flex-col justify-between overflow-hidden">
            {/* Header: Topic Title & Prev/Next (shrink-0) */}
            <div className="flex items-center justify-between gap-2 pb-2.5 md:pb-3 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 rounded-xl bg-blue-50 text-[#1E7CBC] flex items-center justify-center shrink-0 border border-blue-100 shadow-2xs">
                  <ActiveIcon className="h-4 w-4 md:h-4.5 md:w-4.5 lg:h-5 lg:w-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#1E7CBC] block">
                    Area 0{activeIdx + 1} of 0{advantageRows.length}
                  </span>
                  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-extrabold text-gray-900 leading-tight truncate">
                    {activeItem.area}
                  </h3>
                </div>
              </div>

              {/* Prev / Next Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="h-7 w-7 md:h-8 md:w-8 rounded-lg border border-gray-200 hover:bg-gray-100 active:scale-95 flex items-center justify-center text-gray-600 transition-all cursor-pointer"
                  title="Previous topic"
                  aria-label="Previous topic"
                >
                  <ChevronLeft className="h-3.5 w-3.5 md:h-4 md:w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="h-7 w-7 md:h-8 md:w-8 rounded-lg border border-gray-200 hover:bg-gray-100 active:scale-95 flex items-center justify-center text-gray-600 transition-all cursor-pointer"
                  title="Next topic"
                  aria-label="Next topic"
                >
                  <ChevronRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
                </button>
              </div>
            </div>

            {/* Middle: Comparative Cards fitted to fill height (1 col on tablet md, 2 cols on desktop lg) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 sm:gap-3 lg:gap-3.5 my-2.5 sm:my-3 flex-1 min-h-0">
              {/* Box 1: Concept-Based Learning Card */}
              <div className="rounded-xl md:rounded-2xl border border-gray-200/90 bg-slate-50/70 p-3 sm:p-3.5 lg:p-4 flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="flex items-center justify-between gap-2 pb-1.5 md:pb-2 mb-2 border-b border-gray-200/80">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <BookOpen className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                      <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-700 truncate">
                        Concept-Based Learning
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full shrink-0">
                      Traditional
                    </span>
                  </div>

                  <div className="py-0.5 sm:py-1">
                    <p className="text-xs sm:text-sm lg:text-[15px] font-semibold text-gray-800 leading-snug">
                      {activeItem.concept}
                    </p>
                    <p className="text-md text-gray-500 mt-1 md:mt-1.5 leading-relaxed">
                      Focuses on theoretical definitions and lectures without managing live client ad spend or real-world execution.
                    </p>
                  </div>
                </div>

                <div className="mt-2 pt-1.5 sm:pt-2 border-t border-gray-200/70 text-[10px] sm:text-[11px] text-gray-500 font-medium flex items-center justify-between gap-1">
                  <span className="flex items-center gap-1.5 truncate">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                    Classroom Lectures Only
                  </span>
                  <span className="text-gray-400 shrink-0">0 Live Budget</span>
                </div>
              </div>

              {/* Box 2: The SkillYards Approach Card */}
              <div className="rounded-xl md:rounded-2xl border-2 border-[#1E7CBC] bg-gradient-to-br from-[#f0f7fc] via-white to-[#f0f7fc] p-3 sm:p-3.5 lg:p-4 shadow-2xs flex flex-col justify-between relative overflow-hidden">
                <div>
                  {/* Blue Header Banner matching reference design */}
                  <div className="rounded-lg sm:rounded-xl bg-[#1E7CBC] text-white px-3 py-1.5 sm:py-2 mb-2 sm:mb-2.5 shadow-xs flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-xs md:text-sm font-bold tracking-wide block truncate">
                        The SkillYards Approach
                      </span>
                      <span className="text-[10px] md:text-[11px] text-blue-100 font-medium block truncate">
                        Learn. Build. Execute.
                      </span>
                    </div>
                    <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sky-200 shrink-0" />
                  </div>

                  {/* Approach Row matching reference design pill */}
                  <div className="rounded-lg sm:rounded-xl border border-sky-200/90 bg-sky-50/90 p-2 sm:p-2.5 lg:p-3 flex items-start gap-2 sm:gap-2.5 shadow-2xs">
                    <div className="h-4.5 w-4.5 sm:h-5 sm:w-5 rounded-full bg-[#1E7CBC]/10 border border-[#1E7CBC] text-[#1E7CBC] flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#1E7CBC]" />
                    </div>
                    <p className="text-xs sm:text-sm lg:text-[14px] font-bold text-gray-900 leading-snug">
                      {activeItem.approach}
                    </p>
                  </div>
                </div>

                <div className="mt-2 pt-1.5 sm:pt-2 border-t border-blue-100 text-[10px] sm:text-[11px] text-[#1E7CBC] font-bold flex items-center justify-between gap-1">
                  <span className="flex items-center gap-1 truncate">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    100% Practical & Portfolio-Ready
                  </span>
                  <span className="text-[10px] text-sky-700 bg-sky-100/70 px-2 py-0.5 rounded-full font-semibold shrink-0">
                    Real Budgets
                  </span>
                </div>
              </div>
            </div>

            {/* Box 3: What You Execute & Build in this Area (shrink-0) */}
            {activeItem.highlights && activeItem.highlights.length > 0 && (
              <div className="rounded-xl sm:rounded-2xl border border-blue-100/90 bg-blue-50/40 p-2.5 sm:p-3 lg:p-3.5 shrink-0">
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#1E7CBC] flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#1E7CBC] shrink-0" />
                    <span className="truncate">What You Execute & Build in this Area:</span>
                  </span>
                  <span className="text-[9px] sm:text-[10px] lg:text-[11px] font-semibold text-[#1E7CBC] bg-white border border-blue-200/80 px-2 py-0.5 rounded-full shadow-2xs shrink-0">
                    3 Practical Deliverables
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-1.5 sm:gap-2">
                  {activeItem.highlights.map((highlight, hIdx) => (
                    <div
                      key={hIdx}
                      className="flex items-start sm:items-center gap-2 sm:gap-2.5 rounded-lg sm:rounded-xl border border-blue-100/80 bg-white/95 px-2.5 sm:px-3 py-1.5 sm:py-2 shadow-2xs hover:border-blue-300 transition-colors"
                    >
                      <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-blue-50 text-[#1E7CBC] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                        <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      </div>
                      <span className="text-[11px] sm:text-xs lg:text-[13px] text-gray-800 font-medium leading-snug">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── STATS & HIGHLIGHTS BAR ─── */}
        <div className="mt-10 sm:mt-14 pt-8 sm:pt-10 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-2 sm:gap-6 max-w-2xl mx-auto text-center">
            {advantageStats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1E7CBC] tracking-tight">
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-gray-600 mt-1 leading-snug">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* ─── CTA BLOCK ─── */}
          <div className="mt-8 sm:mt-10 flex flex-col items-center text-center">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 tracking-tight mb-4">
              Experience the Difference Before You Enrol.
            </h3>

            <a
              href="#application-form"
              className="w-full max-w-xl mx-auto inline-flex items-center justify-center rounded-full sm:rounded-2xl bg-[#1E7CBC] hover:bg-[#166091] text-white font-bold px-8 py-3.5 sm:py-4 text-sm sm:text-base md:text-lg shadow-lg shadow-[#1E7CBC]/25 transition duration-200 active:scale-98 cursor-pointer"
            >
              Book Your Free Demo Class
            </a>

            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-3">
              No Payment. No Commitment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// MAIN SKILLYARDS SECTION
// ==========================================

export default function KraftshalaSection({
  applyUrl = "#",
  innerPanels = {},
  children,
}) {

  const [activeTab, setActiveTab] = useState("Benefits");

  const isManualScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);
  const [isStuck, setIsStuck] = useState(false);
  const tabRefs = useRef({});
  const tabListRef = useRef(null);
  const sentinelRef = useRef(null);

  // DETECT WHEN NAVBAR BECOMES STUCK TO TOP
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const checkSticky = () => {
      const rect = sentinel.getBoundingClientRect();
      setIsStuck(rect.bottom <= 0);
    };

    checkSticky();

    window.addEventListener("scroll", checkSticky, { passive: true });
    window.addEventListener("resize", checkSticky, { passive: true });

    return () => {
      window.removeEventListener("scroll", checkSticky);
      window.removeEventListener("resize", checkSticky);
    };
  }, []);

  // MAIN TAB SWITCHING & SMOOTH SCROLLING
  const handleMainTab = (tab) => {
    setActiveTab(tab);
    isManualScrollingRef.current = true;
    clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      isManualScrollingRef.current = false;
    }, 850);

    if (tab === "Benefits") {
      const el = document.getElementById("benefits");
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: "smooth" });
      }
    } else if (tab === "What You’ll Learn" || tab === "What You'll Learn" || tab === "Projects") {
      const el = document.getElementById("projects");
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: "smooth" });
      }
    } else {
      const targetId = tab.toLowerCase();
      const el = document.getElementById(targetId);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  };

  const handleApplyClick = (e) => {
    if (applyUrl && applyUrl.startsWith("#")) {
      e.preventDefault();
      const targetId = applyUrl.slice(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const top = targetEl.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  // ScrollSpy to sync active tab with page scroll across all sections
  useEffect(() => {
    const handleScrollSpy = () => {
      if (isManualScrollingRef.current) return;

      const sections = [
        { id: "faqs", tab: "FAQs" },
        { id: "campus", tab: "Campus" },
        { id: "reviews", tab: "Reviews" },
        { id: "certifications", tab: "Certifications" },
        { id: "experts", tab: "Experts" },
        { id: "projects", tab: "What You’ll Learn" },
        { id: "benefits", tab: "Benefits" },
      ];

      for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom > 160) {
            setActiveTab(sec.tab);
            return;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScrollSpy, { passive: true });
    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, []);

  // Keep selected tab visible ONLY on mobile if it overflows, without affecting window/desktop
  useEffect(() => {
    const container = tabListRef.current;
    const activeEl = tabRefs.current[activeTab];
    if (!container || !activeEl) return;

    if (container.scrollWidth > container.clientWidth) {
      const containerRect = container.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();

      if (activeRect.left < containerRect.left || activeRect.right > containerRect.right) {
        const scrollOffset =
          activeEl.offsetLeft - container.clientWidth / 2 + activeEl.clientWidth / 2;
        container.scrollTo({
          left: Math.max(0, scrollOffset),
          behavior: "smooth",
        });
      }
    }
  }, [activeTab]);

  const handleKeyDown = (e, index) => {
    let nextIndex;

    if (e.key === "ArrowRight") {
      nextIndex = (index + 1) % mainTabs.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (index - 1 + mainTabs.length) % mainTabs.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = mainTabs.length - 1;
    } else {
      return;
    }

    e.preventDefault();

    const nextTab = mainTabs[nextIndex];

    handleMainTab(nextTab);
    tabRefs.current[nextTab]?.focus();
  };

  return (
    <div className="w-full bg-white font-sans text-[#555]">

      {/* SENTINEL ELEMENT TO DETECT TOP STICKY FIX & PROVIDE TOP SPACING */}
      <div ref={sentinelRef} className="h-12 w-full pointer-events-none sm:h-16 lg:h-20" aria-hidden="true" />

      {/* MAIN STICKY NAVBAR */}
      <div
        className={`sticky top-0 z-50 w-full transition-[background-color,box-shadow,border-color] duration-200 ${isStuck
          ? "bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.06)] border-b border-gray-100"
          : "bg-transparent shadow-none"
          }`}
      >
        <div
          className={`mx-auto transition-[max-width,width,border-radius,background-color,box-shadow,padding] duration-200 ease-out ${isStuck
            ? "w-full max-w-[1600px] px-3 sm:px-6 lg:px-10 rounded-none bg-transparent shadow-none"
            : "w-[calc(100%-16px)] max-w-[1600px] sm:w-[calc(100%-64px)] lg:w-[calc(100%-120px)] rounded-[22px] sm:rounded-[25px] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] px-2.5 sm:px-6"
            }`}
        >
          <nav className="flex items-center justify-between gap-2 sm:gap-4 w-full py-2 sm:py-2.5">
            {/* Scrollable Tabs */}
            <div className="relative min-w-0 flex-1 overflow-hidden">
              {/* Mobile/Tablet Edge Fade Hints so users know it scrolls */}
              <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-white via-white/80 to-transparent z-10 sm:hidden" />
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white via-white/80 to-transparent z-10 sm:hidden" />

              <div
                ref={tabListRef}
                role="tablist"
                aria-label="Main course navigation"
                className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-1 touch-pan-x"
              >
                {mainTabs.map((tab, index) => {
                  const selected = activeTab === tab;

                  return (
                    <button
                      key={tab}
                      ref={(node) => {
                        tabRefs.current[tab] = node;
                      }}
                      id={`main-tab-${tab}`}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-controls="main-tab-panel"
                      tabIndex={selected ? 0 : -1}
                      onClick={() => handleMainTab(tab)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className={`group relative flex shrink-0 flex-col items-center justify-center px-2 pb-2.5 pt-1.5 text-xs sm:px-2.5 sm:text-sm lg:px-3 lg:text-[15px] xl:text-base outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#1E7CBC] ${selected
                        ? "font-bold text-[#1E7CBC]"
                        : "font-medium text-[#666666] hover:text-[#1E7CBC]"
                        }`}
                    >
                      <span className="relative z-10 whitespace-nowrap leading-normal">{tab}</span>

                      {selected && (
                        <span className="active-tab-line absolute -bottom-0.5 left-0 right-0 flex items-center justify-center pointer-events-none">
                          <img
                            src="/bottom-line.png"
                            alt=""
                            className="h-[4px] w-[88%] max-w-[85px] object-fill sm:h-[5px]"
                          />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Persistent Apply Now Button - Always Displayed */}
            <div className="shrink-0 flex items-center pl-1 sm:pl-2">
              <a
                href={applyUrl}
                onClick={handleApplyClick}
                className="inline-flex shrink-0 items-center justify-center gap-1 sm:gap-2 rounded-full bg-[#1E7CBC] px-3 py-1.5 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-[#1E7CBC]/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#166091] hover:shadow-lg active:scale-95 whitespace-nowrap"
              >
                <span>Apply Now</span>
                <FiArrowUpRight size={15} className="shrink-0" />
              </a>
            </div>
          </nav>
        </div>
      </div>

      {/* MAIN TAB PANEL: Comparison & Benefits */}
      <div
        id="benefits"
        role="tabpanel"
        tabIndex={0}
        className="outline-none scroll-mt-20 lg:scroll-mt-24"
      >
        <Benefits />
      </div>

      {/* ADDITIONAL SECTIONS (like ProjectsSection) SO NAVBAR REMAINS STICKY */}
      {children}

      <style>{`
        @keyframes mainTabFade {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .main-tab-animation {
          animation: mainTabFade .28s ease-out both;
        }

        @keyframes lineFadeIn {
          from {
            opacity: 0;
            transform: scaleX(0.7);
          }
          to {
            opacity: 1;
            transform: scaleX(1);
          }
        }

        .active-tab-line {
          animation: lineFadeIn 0.22s ease-out both;
          transform-origin: center;
        }

        @media (prefers-reduced-motion: reduce) {
          .main-tab-animation,
          .active-tab-line {
            animation: none;
          }
        }
      `}</style>

    </div>
  );
}
