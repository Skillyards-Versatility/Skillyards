
"use client";

import { useEffect, useRef, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";

// MAIN NAVIGATION
const mainTabs = [
  "Benefits",
  "Placements",
  "Curriculum",
  "Projects",
  "Experts",
  "Alumni",
  "Admissions",
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
      <>Free pass to all sessions of the<br />Kraftshala community</>,
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
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-[#e5e5e5] bg-white shadow-[0_2px_14px_rgba(0,0,0,0.03)] [scrollbar-width:thin]">
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
                    ? "border-x-2 border-t-2 border-[#f1b500] bg-[#fffaf0] rounded-t-2xl"
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
                        <span className="h-1 w-1 rounded-full bg-[#f1b500]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-[#f1b500]" />
                        <span className="h-2 w-2 rounded-full bg-[#f1b500]" />
                      </div>
                      <svg
                        className="h-8 w-8 text-[#f1b500]"
                        viewBox="0 0 40 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <polygon points="32,8 14,24 22,25" fill="#f5b900" />
                        <polygon points="32,8 22,25 36,22" fill="#e0a100" />
                        <polygon points="14,24 22,25 20,34" fill="#f5b900" />
                        <polygon points="8,18 14,24 20,18" fill="#ffcb2e" />
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
                      ? "border-x-2 border-[#f1b500] bg-[#fffaf0] font-normal text-[#333]"
                      : "bg-white"
                  } ${
                    rowIndex === data.length - 1 && colIndex === 0
                      ? "border-b-2 border-[#f1b500] rounded-b-2xl"
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
  );
}

// ==========================================
// INNER TABS: ROI / PLACEMENTS / COMMUNITY
// ==========================================

function ROISection({ innerPanels = {} }) {
  const [activeInnerTab, setActiveInnerTab] = useState("ROI");

  const innerTabs = ["ROI", "Placements", "Community"];

  return (
    <section className="w-full px-4 pb-20 pt-10 sm:px-8 sm:pt-12">

      {/* INNER TAB NAVIGATION */}
      <div className="mx-auto mb-14 flex h-[102px] w-full max-w-[610px] items-center rounded-full bg-white p-2 shadow-[0_8px_30px_rgba(0,0,0,0.09)] sm:mb-16">

        {innerTabs.map((tab) => {
          const active = activeInnerTab === tab;

          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveInnerTab(tab)}
              className={`flex h-full min-w-0 flex-1 items-center justify-center rounded-full text-base font-semibold transition-all duration-300 sm:text-xl ${
                active
                  ? "bg-[#f5b900] text-white shadow-[0_8px_20px_rgba(245,185,0,0.35)]"
                  : "text-[#555] hover:bg-[#fff8e5]"
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
function Benefits({ innerPanels }) {
  return (
    <>
      <section className="px-5 pb-8 pt-20 text-center sm:px-8 sm:pt-28">
        <p className="mb-5 text-sm font-bold uppercase tracking-wide text-[#e9ad00] sm:text-base">
          KRAFTSHALA VS OTHERS
        </p>

        <h1 className="mx-auto w-11/12 text-2xl font-bold leading-tight tracking-[-0.035em] text-[#555] sm:text-4xl lg:text-4xl">
          Why Choose Kraftshala’s Digital Marketing Course in India?
        </h1>

        <div className="relative mx-auto mt-6 h-[6px] w-[220px] sm:w-[450px]">
          <img src="/bottom-line.png" alt="bottom-line" />
        </div>

        <p className="mx-auto mt-7 w-8/12 text-base leading-7 text-[#777] sm:text-lg sm:leading-8">
          Choosing the right online digital marketing course is a crucial step to learn digital marketing online. Here's what makes Kraftshala the best digital marketing course in India with placement.
        </p>
      </section>

      {/* INTEGRATED INNER TABS */}
      <ROISection innerPanels={innerPanels} />
    </>
  );
}

// ==========================================
// MAIN KRAFTSHALA SECTION
// ==========================================

export default function KraftshalaSection({
  applyUrl = "#",
  panels = {},
  innerPanels = {},
}) {

  const [activeTab, setActiveTab] = useState("Benefits");
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

  // MAIN TAB SWITCHING
  const handleMainTab = (tab) => {
    setActiveTab(tab);
    if (tab === "Projects") {
      const el = document.getElementById("projects");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else if (tab === "Benefits") {
      const el = document.getElementById("benefits");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // ScrollSpy to sync active tab with page scroll (as in t.gif)
  useEffect(() => {
    const handleScrollSpy = () => {
      const projectsEl = document.getElementById("projects");
      const benefitsEl = document.getElementById("benefits");
      if (!projectsEl) return;

      const pRect = projectsEl.getBoundingClientRect();
      if (pRect.top <= 250) {
        setActiveTab("Projects");
      } else if (benefitsEl) {
        const bRect = benefitsEl.getBoundingClientRect();
        if (bRect.top <= 300) {
          setActiveTab("Benefits");
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

  // MAIN PANEL CONTENT
  const activeContent =
    activeTab === "Benefits" || activeTab === "Projects"
      ? <Benefits innerPanels={innerPanels} />
      : activeTab === "Placements"
      ? panels.placements || (
          <section className="px-5 pb-20 pt-16 text-center sm:px-8 sm:pt-24">
            <p className="mb-4 text-sm font-bold uppercase tracking-wide text-[#e9ad00] sm:text-base">
              KRAFTSHALA VS OTHERS
            </p>
            <h2 className="mx-auto w-11/12 text-2xl font-bold leading-tight tracking-[-0.035em] text-[#555] sm:text-4xl">
              Why Choose Kraftshala’s Digital Marketing Course in India?
            </h2>
            <div className="relative mx-auto mb-12 mt-6 h-[6px] w-[220px] sm:w-[450px]">
              <img src="/bottom-line.png" alt="bottom-line" />
            </div>
            <div className="mx-auto w-11/12">
              <ComparisonTable data={placementsComparisonData} />
            </div>
          </section>
        )
      : panels[activeTab.toLowerCase()] || (
          <div className="flex min-h-[350px] items-center justify-center px-5 text-center text-gray-500">
            Add the {activeTab} React component through the panels prop.
          </div>
        );

  return (
    <main className="w-full overflow-x-clip bg-white font-sans text-[#555]">

      {/* SENTINEL ELEMENT TO DETECT TOP STICKY FIX & PROVIDE TOP SPACING */}
      <div ref={sentinelRef} className="h-12 w-full pointer-events-none sm:h-16 lg:h-20" aria-hidden="true" />

      {/* MAIN STICKY NAVBAR */}
      <div
        className={`sticky top-0 z-50 w-full transition-[background-color,box-shadow] duration-200 ${
          isStuck
            ? "bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
            : "bg-transparent shadow-none"
        }`}
      >
        <div
          className={`mx-auto transition-[max-width,width,border-radius,background-color,box-shadow,padding] duration-200 ease-out ${
            isStuck
              ? "w-full max-w-[1600px] px-4 sm:px-8 lg:px-12 rounded-none bg-transparent shadow-none"
              : "w-[calc(100%-24px)] max-w-[1600px] sm:w-[calc(100%-64px)] lg:w-[calc(100%-120px)] rounded-[22px] sm:rounded-[25px] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] px-3 sm:px-6"
          }`}
        >
          <nav className="w-full py-2.5 sm:py-3">
            <div
              ref={tabListRef}
              role="tablist"
              aria-label="Main course navigation"
              className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:justify-between sm:gap-2 lg:gap-3"
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
                    className={`group relative flex shrink-0 flex-col items-center justify-center px-2 pb-2.5 pt-1.5 text-xs sm:px-2.5 sm:text-sm lg:px-3 lg:text-[15px] xl:text-base outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#f5bd16] ${
                      selected
                        ? "font-bold text-[#d99c00]"
                        : "font-medium text-[#555] hover:text-[#d99c00]"
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

              <a
                href={applyUrl}
                className="ml-auto inline-flex shrink-0 items-center gap-2 rounded-full bg-[#ffbd00] px-4 py-2 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#edaf00] sm:px-5 sm:py-2.5 sm:text-sm lg:text-base"
              >
                Apply Now
                <FiArrowUpRight size={17} />
              </a>
            </div>
          </nav>
        </div>
      </div>

      {/* MAIN TAB PANEL */}
      <div
        id="benefits"
        role="tabpanel"
        aria-labelledby={`main-tab-${activeTab}`}
        tabIndex={0}
        className="min-h-[360px] outline-none"
      >
        <div key={activeTab} className="main-tab-animation">
          {activeContent}
        </div>
      </div>

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

    </main>
  );
}
