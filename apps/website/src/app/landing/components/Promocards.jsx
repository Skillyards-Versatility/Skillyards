"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* ---------- Icons ---------- */
function IconBase({ children, label }) {
  return (
    <div
      role="img"
      aria-label={label}
      className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-2xl overflow-hidden bg-gradient-to-br from-[#1A2B4A]/40 to-[#00AEEF]/20 border border-white/10 flex items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
    >
      <svg
        viewBox="0 0 24 24"
        className="w-7 h-7 text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {children}
      </svg>
      <span
        aria-hidden="true"
        className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#F26522]"
      />
    </div>
  );
}

function IconMapPin() {
  return (
    <IconBase label="Agra campus location">
      <path d="M12 21s-7-7.2-7-12a7 7 0 1 1 14 0c0 4.8-7 12-7 12z" />
      <circle cx="12" cy="9" r="2.4" />
    </IconBase>
  );
}

function IconDegree() {
  return (
    <IconBase label="On-Job Degree program">
      <path d="M2 8.5 12 3l10 5.5-10 5.5-10-5.5z" />
      <path d="M6 10.6V15c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.4" />
    </IconBase>
  );
}

function IconLayers() {
  return (
    <IconBase label="Range of course tracks">
      <path d="m12 3 9 5-9 5-9-5 9-5z" />
      <path d="m3 13 9 5 9-5" />
      <path d="m3 9 9 5 9-5" />
    </IconBase>
  );
}

function IconApply() {
  return (
    <IconBase label="Apply online or visit for counselling">
      <rect x="3" y="4.5" width="18" height="11" rx="1.2" />
      <path d="M1.5 19.5h21" />
      <path d="M9 19.5 12 15.5l3 4" />
    </IconBase>
  );
}

/* ---------- Shared text styles ---------- */
const BODY = "text-[13px] sm:text-sm text-gray-300 leading-relaxed";
const LIST = `${BODY} mt-3 space-y-1.5 list-none`;

/* ---------- Contact details (single source of truth) ---------- */
const PHONE_DISPLAY = "070601 00562";
const PHONE_E164 = "+917060100562";
const WHATSAPP = "917060100562";

export default function DigitalMarketingPromoCards() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      aria-label="SkillYards Digital Marketing Learning Center in Agra"
      className="relative overflow-hidden bg-slate-950 dark:bg-[#050505] py-24 px-4 sm:px-6 md:px-8 transition-colors duration-300"
    >
      {/* Mesh Gradients (Ethereal Glass Vibe) */}
      <div className="absolute top-0 left-1/4 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-[#00AEEF]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Bento Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {/* Card 1: Agra Center (col-span-2) */}
        <div className="group md:col-span-2 relative rounded-[2rem] p-[1px] bg-gradient-to-b from-white/15 via-white/5 to-transparent shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1.5 hover:shadow-indigo-500/5 hover:from-white/25">
          <div className="h-full rounded-[calc(2rem-1px)] bg-[#0d0c11]/85 backdrop-blur-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start justify-between">
            <div className="flex gap-5 items-start">
              <IconMapPin />
              <div className="min-w-0">
                <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium text-indigo-400 mb-4 border border-indigo-500/20">
                  AGRA CAMPUS
                </span>
                <h3 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-white leading-snug mb-3">
                  Your Nearest IT &amp; Digital Marketing Institute in Agra
                </h3>

                <p className={BODY}>
                  Our campus sits at Indra Puri, New Agra Colony, near Bhagwan Talkies Crossing —
                  close enough for a daily commute from most of Agra, and
                  reachable for students across the district.
                </p>

                <p className={`${BODY} mt-4 font-semibold text-white`}>
                  Getting here
                </p>

                <ul className={LIST}>
                  <li>
                    • Direct commute from Sikandra, Kamla Nagar, Shahganj,
                    Tajganj and Bichpuri
                  </li>
                  <li>• On-site parking for two-wheelers and cars</li>
                  <li>
                    • Students also travel in from Mathura, Firozabad, Etah,
                    Etawah and Bharatpur
                  </li>
                  <li>• Open weekdays from 9:00 AM — walk in any day</li>
                  <li>• Free counselling, no appointment needed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: BBA On-Job Degree (col-span-1) */}
        <div className="group md:col-span-1 relative rounded-[2rem] p-[1px] bg-gradient-to-b from-white/15 via-white/5 to-transparent shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1.5 hover:shadow-indigo-500/5 hover:from-white/25">
          <div className="h-full rounded-[calc(2rem-1px)] bg-[#0d0c11]/85 backdrop-blur-2xl p-6 sm:p-8 flex flex-col gap-6 items-start justify-between">
            <div className="flex flex-col gap-4 items-start">
              <IconDegree />
              <div className="min-w-0">
                <span className="inline-flex items-center rounded-full bg-amber-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium text-amber-400 mb-4 border border-amber-500/20">
                  3-YEAR DEGREE
                </span>
                <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-white leading-snug mb-3">
                  BBA &amp; BCA On-Job Degrees, Affiliated to DBRAU Agra
                </h3>

                <p className={BODY}>
                  A 3-year, 6-semester degree from Dr. Bhimrao Ambedkar
                  University, Agra — BBA with Digital Marketing or BCA with Full
                  Stack Development, both built around live project work from
                  year one.
                </p>

                <p className={`${BODY} mt-3`}>
                  Learn Google Ads, GA4 and SEO on the BBA track; React,
                  Next.js, Node.js and MongoDB on the BCA track.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Short-Term Tracks (col-span-1) */}
        <div className="group md:col-span-1 relative rounded-[2rem] p-[1px] bg-gradient-to-b from-white/15 via-white/5 to-transparent shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1.5 hover:shadow-[#00AEEF]/5 hover:from-white/25">
          <div className="h-full rounded-[calc(2rem-1px)] bg-[#0d0c11]/85 backdrop-blur-2xl p-6 sm:p-8 flex flex-col gap-6 items-start justify-between">
            <div className="flex flex-col gap-4 items-start">
              <IconLayers />
              <div className="min-w-0">
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium text-emerald-400 mb-4 border border-emerald-500/20">
                  FLEXIBLE TRACKS
                </span>
                <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-white leading-snug mb-3">
                  Full Degrees, Short Courses &amp; Free AI Bootcamps
                </h3>

                <ul className={`${BODY} space-y-1.5 list-none`}>
                  <li>
                    • <strong className="text-white">On-Job Degree</strong> —
                    3-year BBA or BCA
                  </li>
                  <li>
                    • <strong className="text-white">On-Job Training</strong> —
                    shorter, skill-focused program
                  </li>
                  <li>
                    •{" "}
                    <strong className="text-white">Quick Skill Program</strong>{" "}
                    — free AI bootcamp
                  </li>
                </ul>

                <p className={`${BODY} mt-4`}>
                  Ask about batch timings and fees at counselling.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Apply & Counselling (col-span-2) */}
        <div className="group md:col-span-2 relative rounded-[2rem] p-[1px] bg-gradient-to-b from-white/15 via-white/5 to-transparent shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1.5 hover:shadow-[#00AEEF]/5 hover:from-white/25">
          <div className="h-full rounded-[calc(2rem-1px)] bg-[#0d0c11]/85 backdrop-blur-2xl p-6 sm:p-8 flex flex-col gap-6 items-start justify-between">
            <div className="flex flex-col sm:flex-row gap-6 items-start w-full">
              <IconApply />
              <div className="min-w-0 flex-1">
                <span className="inline-flex items-center rounded-full bg-sky-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium text-sky-400 mb-4 border border-sky-500/20">
                  ADMISSIONS OPEN
                </span>
                <h3 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-white leading-snug mb-3">
                  Visit Our Agra Campus or Apply Online
                </h3>

                <p className={BODY}>
                  Speak to a counsellor in person at campus, or call to ask
                  about eligibility, fees and batch timings.
                </p>

                <address className={`${BODY} mt-4 not-italic space-y-1`}>
                  <div>
                    📍 A-3, behind Manoj Dhaba, Bhagwan Talkies crossing, Indra
                    Puri, New Agra Colony, Agra, Uttar Pradesh 282005
                  </div>
                  <div>
                    📞{" "}
                    <a
                      href={`tel:${PHONE_E164}`}
                      className="hover:text-white transition-colors"
                    >
                      {PHONE_DISPLAY}
                    </a>{" "}
                    · 🕘 Mon–Sat, 9:00 AM–8:00 PM
                  </div>
                  <div>Sunday — Closed</div>
                </address>

                <Link
                  href="/contact"
                  className="group/btn mt-6 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#1A2B4A] to-[#00AEEF] text-white text-xs sm:text-sm font-semibold pl-5 pr-2 py-2 shadow-lg transition-all duration-300 active:scale-[0.98] border border-white/10 hover:from-[#1A2B4A]/90 hover:to-[#00AEEF]/90"
                >
                  <span>Get Free Counselling</span>
                  <span className="w-8 h-8 rounded-full bg-white/25 flex items-center justify-center transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-[1px]">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
