
"use client";

import { useEffect, useRef, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";

// MAIN NAVIGATION
const mainTabs = [
  "Benefits",
  "Placements",
  "Projects",
  "Experts",
  "Certifications",
  "Alumni",
  "Campus",
  "FAQs",
];

// ROI TABLE DATA
const comparisonData = [
  {
    label: "Cost (excluding GST)",
    values: [
      <>₹1.64 L, if you get a job<br />of ₹4.5L or more</>,
      "N/A",
      "₹8L - 15 L",
      "₹0.7 - 3 L",
    ],
  },
  {
    label: <>Cost, if unemployed<br />post completion</>,
    values: ["₹65.6K", "N/A", "₹8L - 15 L", "₹0.7 - 3 L"],
  },
  {
    label: "Time investment",
    values: ["6 Months", "3–6 Months", "12–24 months", "4–12 months"],
  },
  {
    label: "Cost of travel",
    values: [
      <>No Cost as<br />Program is Online</>,
      "May need relocation",
      <>Full Time,<br />needs relocation</>,
      "Yes, if Offline",
    ],
  },
  {
    label: <>Practical exposure in<br />marketing</>,
    values: [
      <>High<br /><span className="text-sm italic text-gray-500">Industry-focused learning</span></>,
      "Medium",
      "Low",
      "Low-Medium",
    ],
  },
  {
    label: <>Behavioural skill<br />development</>,
    values: ["High", "Low-Medium", "Medium", "Low"],
  },
  {
    label: "AI Integration",
    values: [
      "Fully Integrated",
      "N/A",
      <>1–2 lectures on what is<br />AI and its importance</>,
      "Basic ChatGPT usage",
    ],
  },
];

// PLACEMENTS TABLE DATA
const placementsComparisonData = [
  {
    label: "Minimum CTC",
    values: ["₹4.5LPA", "N/A", "Not Defined", "Not Defined"],
  },
  {
    label: "Placement Reports",
    values: [
      <>Published 100%<br />since first batch</>,
      "N/A",
      "No",
      "No",
    ],
  },
  {
    label: "No. of Interviews",
    values: [
      "We keep going till you get placed at ₹4.5L or more",
      "N/A",
      <>Till placement process runs<br />(2–3 months)</>,
      "Nothing specified",
    ],
  },
  {
    label: "Past Placement Records Published",
    values: [
      "All placement reports published online",
      "N/A",
      "N/A",
      <>Not published/<br />available</>,
    ],
  },
  {
    label: "Kind of jobs",
    values: [
      "Full-Time jobs of ₹4.5–10.40L, else 60% fee refunded",
      "Same as internship",
      "No minimum bar for CTC and no job promised",
      "No jobs promised",
    ],
  },
];

// COMMUNITY TABLE DATA
const communityComparisonData = [
  {
    label: "Career Mentors",
    values: [
      <>Take your pick from<br />200+ experts</>,
      <>Depends, if people<br />have time</>,
      "N/A",
      "N/A",
    ],
  },
  {
    label: "Networking",
    values: [
      <>A very powerful growth<br />network</>,
      "Limited",
      "Your batchmates",
      "Limited",
    ],
  },
  {
    label: "Lifelong upgradation",
    values: [
      <>Free pass to all sessions of the<br /><span className="text-[#183D71] font-bold">Skill</span><span className="text-[#1E7CBC] font-bold">Yards</span> community</>,
      "N/A",
      "N/A",
      "N/A",
    ],
  },
  {
    label: "High potential peers",
    values: ["Yes", "Maybe", "Maybe", "No"],
  },
];

const comparisonColumns = [
  "The Marketing LAUNCHPAD",
  "Internships",
  "MBA T2/T3",
  "Other Digital Courses",
];

// ==========================================
// REUSABLE COMPARISON TABLE
// ==========================================
function ComparisonTable({ data }) {
  const [mobileView, setMobileView] = useState("table");

  return (
    <div className="w-full">
      {/* ───────────────────────────────────────────────────────── */}
      {/* 1. MOBILE & TABLET HORIZONTAL VIEW (< lg)                 */}
      {/* "table ko phone ya tablet pe jate hi vertical se horizontal kar dena" */}
      {/* ───────────────────────────────────────────────────────── */}
      <div className="block lg:hidden w-full">
        {/* View Mode Toggle: Horizontal Transposed Table vs Cards */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1E7CBC]">
            <span className="flex h-2 w-2 rounded-full bg-[#1E7CBC] animate-pulse" />
            <span>Horizontal Comparison</span>
          </div>

          <div className="inline-flex rounded-xl bg-gray-100 p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setMobileView("table")}
              className={`cursor-pointer rounded-lg px-2.5 sm:px-3 py-1 transition-all ${
                mobileView === "table"
                  ? "bg-white text-gray-900 shadow-xs font-bold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Table View
            </button>
            <button
              type="button"
              onClick={() => setMobileView("cards")}
              className={`cursor-pointer rounded-lg px-2.5 sm:px-3 py-1 transition-all ${
                mobileView === "cards"
                  ? "bg-white text-gray-900 shadow-xs font-bold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Card View
            </button>
          </div>
        </div>

        {mobileView === "table" ? (
          /* ─── 1A. HORIZONTAL TRANSPOSED TABLE VIEW ─── */
          <div className="relative w-full rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            {/* Top Swipe Instruction Ribbon */}
            <div className="flex items-center justify-between border-b border-gray-100 bg-blue-50/60 px-3.5 py-2 text-[11px] text-gray-600">
              <span className="font-medium text-[#1E7CBC] flex items-center gap-1">
                <span>👉</span> Swipe right to compare all metrics
              </span>
              <span className="text-[10px] text-gray-400 font-mono">
                4 Programs · {data.length} Metrics
              </span>
            </div>

            <div className="w-full overflow-x-auto [scrollbar-width:thin] touch-pan-x">
              <table className="w-full border-collapse text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs font-bold text-gray-700">
                    {/* Sticky 1st Header */}
                    <th className="sticky left-0 z-30 bg-gray-100/95 backdrop-blur-xs px-3.5 py-3 border-r border-b border-gray-200 min-w-[130px] sm:min-w-[160px] shadow-[3px_0_8px_rgba(0,0,0,0.04)]">
                      Program
                    </th>

                    {/* Horizontal Metric Columns */}
                    {data.map((row, i) => (
                      <th
                        key={i}
                        className="min-w-[150px] sm:min-w-[180px] px-3.5 py-3 border-r border-b border-gray-200 text-center leading-snug font-semibold text-gray-800"
                      >
                        {row.label}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {comparisonColumns.map((colName, colIdx) => {
                    const isSkillYards = colIdx === 0;

                    return (
                      <tr
                        key={colIdx}
                        className={
                          isSkillYards
                            ? "bg-[#1E7CBC]/5 font-medium"
                            : "hover:bg-gray-50/70"
                        }
                      >
                        {/* Sticky Program Name Column */}
                        <th
                          className={`sticky left-0 z-20 px-3.5 py-4 border-r border-b border-gray-200 shadow-[3px_0_8px_rgba(0,0,0,0.04)] min-w-[130px] sm:min-w-[160px] ${
                            isSkillYards
                              ? "bg-[#eef6fc] border-l-4 border-l-[#1E7CBC]"
                              : "bg-white"
                          }`}
                        >
                          {isSkillYards ? (
                            <div className="flex flex-col gap-1">
                              <span className="w-max rounded-full bg-[#1E7CBC] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white">
                                ★ OUR PROGRAM
                              </span>
                              <span className="font-bold text-xs sm:text-sm text-[#183D71] leading-tight">
                                SkillYards Launchpad
                              </span>
                            </div>
                          ) : (
                            <span className="font-semibold text-xs sm:text-sm text-gray-800 leading-tight">
                              {colName}
                            </span>
                          )}
                        </th>

                        {/* Horizontal Metric Values */}
                        {data.map((row, rowIdx) => (
                          <td
                            key={rowIdx}
                            className={`px-3.5 py-4 text-center border-r border-b border-gray-200 text-xs sm:text-sm leading-relaxed ${
                              isSkillYards
                                ? "bg-[#1E7CBC]/5 font-semibold text-gray-900"
                                : "bg-white text-gray-600"
                            }`}
                          >
                            {row.values[colIdx]}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* ─── 1B. HORIZONTAL SWIPEABLE CARDS VIEW ─── */
          <div className="w-full">
            <div className="flex items-center gap-1 text-[11px] text-gray-500 mb-2 px-1">
              <span>👉</span> Swipe left & right to compare programs:
            </div>

            <div className="flex gap-3.5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory [scrollbar-width:thin] touch-pan-x">
              {comparisonColumns.map((colName, colIdx) => {
                const isSkillYards = colIdx === 0;

                return (
                  <div
                    key={colIdx}
                    className={`snap-center w-[85vw] max-w-[320px] shrink-0 rounded-2xl border-2 p-5 bg-white transition-all ${
                      isSkillYards
                        ? "border-[#1E7CBC] shadow-lg shadow-[#1E7CBC]/10 bg-gradient-to-b from-blue-50/40 to-white"
                        : "border-gray-200 shadow-sm"
                    }`}
                  >
                    <div className="border-b border-gray-100 pb-3 mb-3">
                      {isSkillYards ? (
                        <div className="space-y-1">
                          <span className="inline-block rounded-full bg-[#1E7CBC] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                            ★ OUR PROGRAM
                          </span>
                          <h4 className="text-base font-extrabold text-[#183D71]">
                            The Marketing LAUNCHPAD
                          </h4>
                        </div>
                      ) : (
                        <h4 className="text-base font-bold text-gray-800">
                          {colName}
                        </h4>
                      )}
                    </div>

                    {/* Metrics list */}
                    <div className="space-y-2.5">
                      {data.map((row, rowIdx) => (
                        <div
                          key={rowIdx}
                          className="flex flex-col gap-0.5 rounded-lg bg-gray-50/80 p-2.5"
                        >
                          <span className="text-[11px] font-medium text-gray-500">
                            {row.label}
                          </span>
                          <div
                            className={`text-xs sm:text-sm leading-snug ${
                              isSkillYards
                                ? "font-bold text-[#183D71]"
                                : "font-normal text-gray-700"
                            }`}
                          >
                            {row.values[colIdx]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* 2. DESKTOP COMPARISON TABLE (lg:block)                    */}
      {/* ───────────────────────────────────────────────────────── */}
      <div className="hidden lg:block w-full overflow-x-auto rounded-2xl border border-[#e5e5e5] bg-white shadow-[0_2px_14px_rgba(0,0,0,0.03)] [scrollbar-width:thin]">
        <table className="w-full min-w-[1000px] table-fixed border-collapse text-center">
          <colgroup>
            <col className="w-[23%]" />
            <col className="w-[27%]" />
            <col className="w-[16%]" />
            <col className="w-[16%]" />
            <col className="w-[18%]" />
          </colgroup>

          <thead>
            <tr>
              <th className="border-b border-r border-[#e5e5e5] bg-white p-5" />

              {comparisonColumns.map((column, index) => (
                <th
                  key={index}
                  className={`h-[125px] border-b border-r border-[#e5e5e5] px-4 py-5 text-lg font-bold text-[#555] ${
                    index === 0
                      ? "border-x-2 border-t-2 border-[#1E7CBC] bg-[#1E7CBC]/5 rounded-t-2xl"
                      : "bg-white"
                  } ${index === comparisonColumns.length - 1 ? "border-r-0" : ""}`}
                >
                  {index === 0 ? (
                    <div className="relative flex items-center justify-between text-left">
                      <div>
                        <span className="block text-sm sm:text-base font-normal text-gray-400">
                          The Marketing
                        </span>
                        <span className="block text-2xl sm:text-[30px] font-normal leading-none tracking-tight text-[#444]">
                          LAUNCHPAD
                        </span>
                      </div>
                      <div className="relative flex items-center gap-1.5 shrink-0 pl-1">
                        <div className="flex gap-1 pb-2">
                          <span className="h-1 w-1 rounded-full bg-[#1E7CBC]" />
                          <span className="h-1.5 w-1.5 rounded-full bg-[#1E7CBC]" />
                          <span className="h-2 w-2 rounded-full bg-[#1E7CBC]" />
                        </div>
                        <svg
                          className="h-8 w-8 text-[#1E7CBC]"
                          viewBox="0 0 40 40"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <polygon points="32,8 14,24 22,25" fill="#1E7CBC" />
                          <polygon points="32,8 22,25 36,22" fill="#166091" />
                          <polygon points="14,24 22,25 20,34" fill="#1E7CBC" />
                          <polygon points="8,18 14,24 20,18" fill="#4fa6e8" />
                        </svg>
                      </div>
                    </div>
                  ) : index === 3 ? (
                    <>
                      Other Digital
                      <br />
                      Courses
                    </>
                  ) : (
                    column
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <th className="border-r border-t border-[#e5e5e5] bg-white px-5 py-4 text-left text-base font-normal leading-6 text-[#555] sm:text-lg">
                  {row.label}
                </th>

                {row.values.map((value, colIndex) => (
                  <td
                    key={colIndex}
                    className={`border-r border-t border-[#e5e5e5] px-3 py-4 text-base leading-6 text-[#666] sm:text-lg ${
                      colIndex === 0
                        ? "border-x-2 border-[#1E7CBC] bg-[#1E7CBC]/5 font-normal text-[#333]"
                        : "bg-white"
                    } ${
                      rowIndex === data.length - 1 && colIndex === 0
                        ? "border-b-2 border-[#1E7CBC] rounded-b-2xl"
                        : ""
                    } ${colIndex === row.values.length - 1 ? "border-r-0" : ""}`}
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==========================================
// INNER TABS: ROI / PLACEMENTS / COMMUNITY
// ==========================================

function ROISection({
  innerPanels = {},
  activeInnerTab = "ROI",
  setActiveInnerTab,
}) {
  const innerTabs = ["ROI", "Placements", "Community"];

  return (
    <section className="w-full px-4 pb-20 pt-8 sm:px-8 sm:pt-10">

      {/* INNER TAB NAVIGATION */}
      <div className="mx-auto mb-12 flex h-[90px] w-full max-w-[560px] items-center rounded-full bg-white p-2 shadow-[0_8px_30px_rgba(0,0,0,0.07)] border border-gray-100 sm:mb-14">

        {innerTabs.map((tab) => {
          const active = activeInnerTab === tab;

          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveInnerTab && setActiveInnerTab(tab)}
              className={`flex h-full min-w-0 flex-1 items-center justify-center rounded-full text-sm sm:text-lg font-bold transition-all duration-300 ${
                active
                  ? "bg-[#1E7CBC] text-white shadow-[0_6px_20px_rgba(30,124,188,0.35)] scale-102"
                  : "text-[#555] hover:bg-[#1E7CBC]/10"
              }`}
            >
              {tab}
            </button>
          );
        })}

      </div>

      {/* INNER TAB CONTENT */}
      <div
        key={activeInnerTab}
        role="tabpanel"
        className="mx-auto w-11/12 animate-[innerFade_.3s_ease-out]"
      >

        {activeInnerTab === "ROI" ? (
          <ComparisonTable data={comparisonData} />
        ) : activeInnerTab === "Placements" ? (
          innerPanels.placements || <ComparisonTable data={placementsComparisonData} />
        ) : activeInnerTab === "Community" ? (
          innerPanels.community || <ComparisonTable data={communityComparisonData} />
        ) : (
          innerPanels[activeInnerTab.toLowerCase()] || (
            <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
              Add your {activeInnerTab} component through innerPanels.
            </div>
          )
        )}

      </div>

      <style>{`
        @keyframes innerFade {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-\\[innerFade_\\.3s_ease-out\\] {
            animation: none;
          }
        }
      `}</style>

    </section>
  );
}

// ==========================================
// BENEFITS CONTENT (DEFAULT MAIN TAB)
// ==========================================
function Benefits({
  innerPanels,
  activeInnerTab = "ROI",
  setActiveInnerTab,
}) {
  return (
    <>
      <section className="px-5 pb-6 pt-16 text-center sm:px-8 sm:pt-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#1E7CBC]/30 bg-[#1E7CBC]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#1E7CBC] mb-4">
          <span className="text-[#183D71]">SKILL</span><span className="text-[#1E7CBC]">YARDS</span> VS OTHERS
        </div>

        <h1 className="mx-auto max-w-4xl text-2xl sm:text-4xl lg:text-[42px] font-extrabold leading-tight tracking-tight text-gray-900">
          Why Choose <span className="text-[#183D71]">Skill</span><span className="text-[#1E7CBC]">Yards</span> Digital Marketing Course in India?
        </h1>

        <div className="relative mx-auto mt-4 h-[6px] w-[220px] sm:w-[450px]">
          <img src="/bottom-line.png" alt="bottom-line" />
        </div>

        <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-gray-600 sm:text-lg">
          Choosing the right online digital marketing course is a crucial step to learn digital marketing online. Here&apos;s what makes <span className="text-[#183D71] font-bold">Skill</span><span className="text-[#1E7CBC] font-bold">Yards</span> the best digital marketing course in India with placement.
        </p>
      </section>

      {/* INTEGRATED INNER TABS */}
      <ROISection
        innerPanels={innerPanels}
        activeInnerTab={activeInnerTab}
        setActiveInnerTab={setActiveInnerTab}
      />
    </>
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
  const [activeInnerTab, setActiveInnerTab] = useState("ROI");
  const lastSelectedTabRef = useRef("Benefits");
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
    lastSelectedTabRef.current = tab;
    isManualScrollingRef.current = true;
    clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      isManualScrollingRef.current = false;
    }, 850);

    if (tab === "Benefits") {
      setActiveInnerTab("ROI");
      const el = document.getElementById("benefits");
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: "smooth" });
      }
    } else if (tab === "Placements") {
      setActiveInnerTab("Placements");
      const el = document.getElementById("benefits");
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
        { id: "alumni", tab: "Alumni" },
        { id: "certifications", tab: "Certifications" },
        { id: "experts", tab: "Experts" },
        { id: "projects", tab: "Projects" },
        { id: "benefits", tab: "Benefits" },
      ];

      for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom > 160) {
            if (sec.tab === "Benefits" && lastSelectedTabRef.current === "Placements") {
              setActiveTab("Placements");
            } else {
              setActiveTab(sec.tab);
            }
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
        <Benefits
          innerPanels={innerPanels}
          activeInnerTab={activeInnerTab}
          setActiveInnerTab={setActiveInnerTab}
        />
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
