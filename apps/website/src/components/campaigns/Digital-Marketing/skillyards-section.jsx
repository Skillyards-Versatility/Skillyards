"use client";

import { useEffect, useRef, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import {
  Palette,
  Globe,
  ShoppingBag,
  Megaphone,
  Search,
  Share2,
  BarChart3,
  Bot,
  Briefcase,
  CheckCircle2,
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
  },
  {
    icon: Globe,
    area: "Website Development",
    concept: "Understand how websites work.",
    approach: "Build and deploy your own functional website.",
  },
  {
    icon: ShoppingBag,
    area: "E-Commerce",
    concept: "Study online business models.",
    approach: "Build a Shopify store and develop a product launch strategy.",
  },
  {
    icon: Megaphone,
    area: "Paid Advertising",
    concept: "Understand advertising platforms.",
    approach: "Create multi-platform ad campaigns and optimize performance.",
  },
  {
    icon: Search,
    area: "SEO & AI Search",
    concept: "Learn keywords and ranking factors.",
    approach: "Conduct SEO audits and optimize websites for traditional and AI search.",
  },
  {
    icon: Share2,
    area: "Social Media Marketing",
    concept: "Learn content and engagement strategies.",
    approach: "Build a complete 30-day brand growth campaign.",
  },
  {
    icon: BarChart3,
    area: "Marketing Analytics",
    concept: "Understand marketing metrics.",
    approach: "Analyse campaign data and create professional performance reports.",
  },
  {
    icon: Bot,
    area: "AI & Automation",
    concept: "Explore AI tools and automation concepts.",
    approach: "Build AI agents and automated marketing workflows.",
  },
  {
    icon: Briefcase,
    area: "Career Preparation",
    concept: "Acquire theoretical subject knowledge.",
    approach: "Build a professional portfolio backed by 15+ practical projects.",
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
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* ─── SECTION HEADER ─── */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1E7CBC]/30 bg-[#1E7CBC]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#1E7CBC] mb-4">
            <Sparkles className="h-3.5 w-3.5 text-[#1E7CBC]" />
            <span>THE SKILLYARDS ADVANTAGE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-gray-900 leading-tight">
            Why Choose <span className="text-[#1E7CBC]">SkillYards</span> for Digital Marketing in Agra?
          </h2>

          <p className="mt-4 text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Knowing how digital marketing works is one thing. Being able to execute it is another. Discover the difference between learning concepts and building real-world marketing skills.
          </p>
        </div>

        {/* ─── COMPARISON TABLE / MATRIX (DESKTOP & TABLET >= MD) ─── */}
        <div className="hidden md:block rounded-3xl border border-gray-200/90 bg-white shadow-xs p-6 lg:p-8">
          {/* Table Header Row */}
          <div className="grid grid-cols-[1.3fr_1.3fr_2fr] gap-6 items-center pb-5 border-b border-gray-200">
            <div className="text-sm font-bold text-gray-900 tracking-wide uppercase">
              Learning Area
            </div>
            <div className="text-sm font-bold text-gray-900 tracking-wide uppercase">
              Concept-Based Learning
            </div>
            <div>
              <div className="rounded-2xl bg-[#1E7CBC] text-white py-3 px-5 text-center shadow-md shadow-[#1E7CBC]/20">
                <p className="font-bold text-sm sm:text-base leading-snug tracking-wide">
                  The SkillYards Approach
                </p>
                <p className="text-xs text-blue-100 font-medium mt-0.5">
                  Learn. Build. Execute.
                </p>
              </div>
            </div>
          </div>

          {/* Table Body Rows */}
          <div className="divide-y divide-gray-100">
            {advantageRows.map((row, idx) => {
              const Icon = row.icon;
              return (
                <div
                  key={idx}
                  className="grid grid-cols-[1.3fr_1.3fr_2fr] gap-6 items-center py-4 hover:bg-gray-50/70 rounded-xl px-2 transition-colors"
                >
                  {/* Column 1: Learning Area */}
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-blue-50 text-[#1E7CBC] flex items-center justify-center shrink-0 border border-blue-100 shadow-2xs">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <span className="font-bold text-sm sm:text-[15px] text-gray-900">
                      {row.area}
                    </span>
                  </div>

                  {/* Column 2: Concept-Based Learning */}
                  <div className="text-xs sm:text-sm text-gray-500 font-normal leading-relaxed pr-3">
                    {row.concept}
                  </div>

                  {/* Column 3: The SkillYards Approach */}
                  <div>
                    <div className="rounded-xl bg-[#eef6fc] border border-[#d2e8f8] px-4 py-3 flex items-center gap-3 shadow-2xs transition-all hover:bg-[#e6f2fb]">
                      <CheckCircle2 className="h-4.5 w-4.5 text-[#1E7CBC] shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-gray-800 leading-snug">
                        {row.approach}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── COMPARISON CARDS (MOBILE < MD) ─── */}
        <div className="flex flex-col gap-3.5 md:hidden">
          {advantageRows.map((row, idx) => {
            const Icon = row.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-gray-200/90 bg-white p-4.5 shadow-xs flex flex-col gap-3"
              >
                {/* Learning Area Header */}
                <div className="flex items-center gap-2.5 pb-2.5 border-b border-gray-100">
                  <div className="h-8 w-8 rounded-lg bg-blue-50 text-[#1E7CBC] flex items-center justify-center shrink-0 border border-blue-100">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h4 className="font-bold text-sm text-gray-900">{row.area}</h4>
                </div>

                {/* Concept-Based Learning */}
                <div className="text-xs text-gray-600 bg-gray-50/80 rounded-xl p-3">
                  <span className="font-bold text-gray-800 block mb-1">
                    Concept-Based Learning:
                  </span>
                  {row.concept}
                </div>

                {/* The SkillYards Approach */}
                <div className="rounded-xl bg-[#eef6fc] border border-[#d2e8f8] p-3 flex items-start gap-2.5 shadow-2xs">
                  <CheckCircle2 className="h-4 w-4 text-[#1E7CBC] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#1E7CBC] block mb-0.5">
                      The SkillYards Approach (Learn. Build. Execute.)
                    </span>
                    <p className="text-xs font-semibold text-gray-800 leading-snug">
                      {row.approach}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── STATS & HIGHLIGHTS BAR ─── */}
        <div className="mt-14 sm:mt-18 pt-8 sm:pt-10 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-2 sm:gap-6 max-w-2xl mx-auto text-center">
            {advantageStats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1E7CBC] tracking-tight">
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm font-medium text-gray-500 mt-1 leading-snug">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* ─── CTA BLOCK ─── */}
          <div className="mt-10 sm:mt-12 flex flex-col items-center text-center gap-3.5">
            <h3 className="text-lg sm:text-2xl font-bold text-gray-900 tracking-tight">
              Experience the Difference Before You Enrol.
            </h3>

            <a
              href="#hero-form"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-[#1E7CBC] hover:bg-[#166091] text-white font-bold px-8 sm:px-12 py-3.5 sm:py-4 text-sm sm:text-base shadow-lg shadow-[#1E7CBC]/25 transition duration-200 hover:shadow-xl active:scale-98 cursor-pointer"
            >
              Book Your Free Demo Class
            </a>

            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              No Payment. No Commitment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// MAIN KRAFTSHALA SECTION
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
        className={`sticky top-0 z-50 w-full transition-[background-color,box-shadow,border-color] duration-200 ${
          isStuck
            ? "bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.06)] border-b border-gray-100"
            : "bg-transparent shadow-none"
        }`}
      >
        <div
          className={`mx-auto transition-[max-width,width,border-radius,background-color,box-shadow,padding] duration-200 ease-out ${
            isStuck
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
                      className={`group relative flex shrink-0 flex-col items-center justify-center px-2 pb-2.5 pt-1.5 text-xs sm:px-2.5 sm:text-sm lg:px-3 lg:text-[15px] xl:text-base outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#1E7CBC] ${
                        selected
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
