"use client";

import { useState } from "react";
import { Menu, X, ArrowRight, Phone } from "lucide-react";
import FloatingIcons from "./floating-icons";

/* =================================
   CHECK ICON
================================= */

const CheckIcon = () => (
  <svg
    className="h-[clamp(18px,2.2vh,28px)] w-[clamp(18px,2.2vh,28px)] shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <circle cx="12" cy="12" r="10" stroke="#aaa" />

    <path
      d="m6.5 12 3.5 3.5L18 7"
      stroke="#10b981"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* =================================
   WHATSAPP ICON
================================= */

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M12 2a10 10 0 0 0-8.65 15.02L2 22l5.12-1.34A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.08-1.12l-.3-.18-3.04.8.81-2.96-.2-.31A8 8 0 1 1 12 20Zm4.39-5.99c-.24-.12-1.43-.71-1.65-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.17-.71-.63-1.19-1.4-1.33-1.64-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.31-.74-1.8-.2-.48-.4-.42-.54-.43h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2.01s.86 2.33.98 2.49c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.11.15 1.53.09.47-.07 1.43-.58 1.63-1.15.2-.57.2-1.05.14-1.15-.06-.1-.22-.16-.46-.28Z" />
  </svg>
);

/* =================================
   STATIC DATA
================================= */

const features = [
  "94% placement rate & 3300+ students placed in Digital Marketing",

  <>
    Real accountability - If the job is <b>₹4.5L</b>, we refund <b>60%</b>
  </>,

  "Projects on Meta & Google Ads, SEO, Ecom, Programmatic, Content & Social",

  "AI tools integrated across every module - from strategy to execution",
];

const recruiters = [
  {
    name: "Google",
    className: "text-[#4285F4] font-bold text-2xl",
  },
  {
    name: "NYKAA",
    className: "text-[#fc2779] font-black italic text-xl",
  },
  {
    name: "PUBLICIS",
    className: "text-[#927c57] font-bold text-base",
  },
  {
    name: "TATA CLiQ",
    className: "text-black font-extrabold text-lg",
  },
  {
    name: "mamaearth",
    className: "text-[#36a8b8] font-bold text-base",
  },
];

/* =================================
   MAIN HERO COMPONENT
================================= */

const MarketingHero = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    console.log(Object.fromEntries(formData.entries()));

    alert("Application submitted successfully!");
  };

  return (
    <section className="relative isolate flex min-h-screen flex-col overflow-hidden bg-white lg:h-[100dvh] lg:min-h-0">

      {/* BACKGROUND DECORATIONS */}

      <div className="pointer-events-none absolute -right-24 top-[25%] z-0 h-[45vw] w-[45vw] max-w-[650px] rounded-full bg-[#e2f5f8] opacity-70" />

      <div className="pointer-events-none absolute -left-20 bottom-0 z-0 h-52 w-52 rounded-full bg-[#e8f8fa] opacity-60 blur-3xl" />

      {/* ANIMATED FLOATING ICONS */}

      <FloatingIcons />

      {/* NAVBAR */}

      <header className="relative z-30 mx-auto flex w-full max-w-[1600px] shrink-0 items-center justify-between px-[5%] py-4 sm:py-5 lg:h-[11%] lg:py-0">

        {/* LOGO */}

        <div className="relative">

          <img src="/images/logo-light.svg" alt="SkillYards logo" width={150} height={42} className="h-auto w-[130px] sm:w-[150px]" />

        </div>

        {/* DESKTOP NAVIGATION */}

        <nav className="hidden items-center gap-[clamp(20px,3vw,48px)] text-[clamp(14px,1.3vw,21px)] font-normal text-[#666666] lg:flex">

          <a
            href="/programs"
            style={{ color: "#666666" }}
            className="text-[#666666] transition hover:text-[#1E7CBC] hover:!text-[#1E7CBC]"
          >
            Programs <span className="text-xs">▼</span>
          </a>

          <a
            href="/blog"
            style={{ color: "#666666" }}
            className="text-[#666666] transition hover:text-[#1E7CBC] hover:!text-[#1E7CBC]"
          >
            Free Resources <span className="text-xs">▼</span>
          </a>

          <a
            href="#benefits"
            style={{ color: "#666666" }}
            className="text-[#666666] transition hover:text-[#1E7CBC] hover:!text-[#1E7CBC]"
          >
            Placements
          </a>

          <a
            href="/contact"
            style={{ color: "#666666" }}
            className="text-[#666666] transition hover:text-[#1E7CBC] hover:!text-[#1E7CBC]"
          >
            Hire From Us
          </a>

        </nav>

        {/* MOBILE & TABLET ACTIONS */}
        <div className="flex items-center gap-2 lg:hidden">
          <a
            href="#hero-form"
            className="rounded-full bg-[#1E7CBC] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#183D71] transition-colors"
          >
            Apply Now
          </a>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="cursor-pointer p-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xl px-[5%] py-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-1 font-semibold text-gray-800 text-sm">
              <a
                href="#benefits"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 border-b border-gray-100 hover:text-[#1E7CBC]"
              >
                <span>Benefits & Comparison</span>
                <ArrowRight size={14} className="text-gray-400" />
              </a>
              <a
                href="#projects"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 border-b border-gray-100 hover:text-[#1E7CBC]"
              >
                <span>Live Agency Projects</span>
                <ArrowRight size={14} className="text-gray-400" />
              </a>
              <a
                href="#experts"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 border-b border-gray-100 hover:text-[#1E7CBC]"
              >
                <span>Expert Mentors</span>
                <ArrowRight size={14} className="text-gray-400" />
              </a>
              <a
                href="#certifications"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 border-b border-gray-100 hover:text-[#1E7CBC]"
              >
                <span>Industry Certifications</span>
                <ArrowRight size={14} className="text-gray-400" />
              </a>
              <a
                href="#alumni"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 border-b border-gray-100 hover:text-[#1E7CBC]"
              >
                <span>Alumni Reviews</span>
                <ArrowRight size={14} className="text-gray-400" />
              </a>
              <a
                href="#campus"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 border-b border-gray-100 hover:text-[#1E7CBC]"
              >
                <span>Sanjay Place Campus Photos</span>
                <ArrowRight size={14} className="text-gray-400" />
              </a>
              <a
                href="#faqs"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 border-b border-gray-100 hover:text-[#1E7CBC]"
              >
                <span>Frequently Asked Questions</span>
                <ArrowRight size={14} className="text-gray-400" />
              </a>
              <div className="pt-3 flex gap-2">
                <a
                  href="tel:+917060100561"
                  className="flex-1 rounded-xl bg-gray-100 text-gray-800 font-bold py-2.5 text-center text-xs flex items-center justify-center gap-1.5"
                >
                  <Phone size={14} /> Call Campus
                </a>
                <a
                  href="#hero-form"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 rounded-xl bg-[#1E7CBC] text-white font-bold py-2.5 text-center text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#1E7CBC]/25"
                >
                  Apply Now
                </a>
              </div>
            </div>
          </div>
        )}

      </header>

      {/* MAIN HERO CONTENT */}

      <main className="relative z-10 mx-auto grid w-full max-w-[1600px] flex-1 grid-cols-1 items-center gap-10 px-[5%] pb-10 pt-5 lg:min-h-0 lg:grid-cols-[1.3fr_0.9fr] lg:gap-[4%] lg:py-[1.5vh]">

        {/* LEFT CONTENT */}

        <div className="flex min-w-0 flex-col justify-center gap-[clamp(10px,1.5vh,20px)]">

          {/* HEADING */}

          <div className="relative">

            <p className="text-[clamp(25px,3vw,44px)] font-light leading-tight text-[#666]">
              The Marketing
            </p>

            <h1 className="text-[clamp(42px,5.3vw,78px)] font-light leading-[1.02] tracking-tight text-[#626262]">
              LAUNCHPAD
            </h1>

            <p className="mt-[clamp(5px,0.8vh,12px)] text-[clamp(16px,1.9vw,29px)] text-[#626262]">
              with INDUSTRYCreds<sup>®</sup> certification
            </p>

          </div>

          {/* COURSE RANKING */}

          <div className="flex items-center gap-[clamp(12px,1.5vw,24px)]">

            <span className="text-[clamp(55px,6.5vw,90px)] font-extrabold leading-none text-[#1E7CBC]">
              #1
            </span>

            <h2 className="text-[clamp(18px,2vw,30px)] font-semibold leading-tight text-[#3c4c5d]">
              AI-Integrated Digital Marketing
              <br />
              Course with Placement
            </h2>

          </div>

          {/* FEATURES */}

          <div className="flex flex-col gap-[clamp(7px,1.15vh,14px)]">

            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">

                <CheckIcon />

                <p className="text-[clamp(13px,1.35vw,20px)] leading-snug text-[#35485c]">
                  {feature}
                </p>

              </div>
            ))}

          </div>

          {/* RECRUITERS */}

          <div className="mt-[clamp(5px,1.5vh,20px)]">

            <h3 className="mb-[clamp(10px,1.5vh,18px)] text-[clamp(14px,1.4vw,21px)] font-semibold text-[#35485c]">
              Recruiters include world’s largest agencies and top brands
            </h3>

            <div className="grid grid-cols-3 items-center gap-3 rounded-2xl bg-white/95 px-[clamp(12px,2vw,30px)] py-[clamp(12px,2vh,24px)] shadow-[0_8px_35px_rgba(0,0,0,0.09)] sm:grid-cols-5 sm:gap-5">

              {recruiters.map((brand) => (
                <div
                  key={brand.name}
                  className={`text-center ${brand.className}`}
                >
                  {brand.name}
                </div>
              ))}

            </div>

          </div>

        </div>

        {/* RIGHT APPLICATION FORM */}

        <div className="relative flex min-w-0 items-center justify-center">

          <div className="absolute -inset-[5%] -z-10 rounded-[40%] bg-[#e1f4f7] opacity-80" />

          <div
            id="application-form"
            className="w-full max-w-[500px] overflow-hidden rounded-[clamp(15px,2vw,25px)] bg-white/95 shadow-[0_12px_40px_rgba(0,0,0,0.10)]"
          >

            {/* FORM HEADER */}

            <div className="bg-[#1E7CBC] px-4 py-[clamp(10px,1.8vh,22px)] text-center">

              <h2 className="text-[clamp(16px,1.7vw,25px)] font-bold text-white">
                Apply for the Marketing Launchpad
              </h2>

            </div>

            {/* FORM BODY */}

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-[clamp(12px,2vh,23px)] p-[clamp(18px,2.5vw,40px)]"
            >

              <input
                type="text"
                name="name"
                placeholder="Name*"
                required
                className="w-full border-b border-[#999] bg-transparent pb-[clamp(6px,1vh,12px)] text-[clamp(14px,1.2vw,18px)] outline-none focus:border-[#1E7CBC]"
              />

              <input
                type="email"
                name="email"
                placeholder="Email*"
                required
                className="w-full border-b border-[#999] bg-transparent pb-[clamp(6px,1vh,12px)] text-[clamp(14px,1.2vw,18px)] outline-none focus:border-[#1E7CBC]"
              />

              {/* PHONE */}

              <div className="flex items-center gap-2 border-b border-[#999] pb-[clamp(6px,1vh,12px)]">

                <span className="text-xl">🇮🇳</span>

                <span className="text-gray-400">⌄</span>

                <span className="text-[clamp(14px,1.2vw,18px)] text-gray-600">
                  +91
                </span>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Mobile Number*"
                  required
                  pattern="[0-9]{10}"
                  className="min-w-0 flex-1 bg-transparent text-[clamp(14px,1.2vw,18px)] outline-none"
                />

              </div>

              {/* WHATSAPP */}

              <div>

                <div className="flex items-center justify-between gap-2">

                  <p className="text-[clamp(14px,1.3vw,19px)] leading-snug text-[#555]">
                    Get screening test
                    <br />
                    details on
                  </p>

                  <span className="flex shrink-0 items-center gap-2 text-[clamp(14px,1.3vw,18px)] text-[#27b88a]">

                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#27b88a] text-white">
                      <WhatsAppIcon />
                    </span>

                    Whatsapp

                  </span>

                </div>

                <div className="mt-[clamp(8px,1.5vh,16px)] flex gap-8">

                  <label className="flex cursor-pointer items-center gap-2 text-[clamp(14px,1.3vw,18px)] text-[#555]">

                    <input
                      type="radio"
                      name="whatsapp"
                      value="yes"
                      defaultChecked
                      className="h-5 w-5 accent-[#1E7CBC]"
                    />

                    Yes

                  </label>

                  <label className="flex cursor-pointer items-center gap-2 text-[clamp(14px,1.3vw,18px)] text-[#555]">

                    <input
                      type="radio"
                      name="whatsapp"
                      value="no"
                      className="h-5 w-5 accent-[#1E7CBC]"
                    />

                    No

                  </label>

                </div>

              </div>

              {/* RECOMMENDATION CODE */}

              <div className="flex min-w-0 border border-gray-300">

                <input
                  type="text"
                  name="recommendation"
                  placeholder="Have a recommendation code?"
                  className="min-w-0 flex-1 px-3 py-[clamp(9px,1.5vh,15px)] text-[clamp(12px,1.1vw,16px)] outline-none"
                />

                <button
                  type="button"
                  className="border-l border-gray-300 px-3 font-semibold text-blue-600 hover:bg-gray-50"
                >
                  Apply
                </button>

              </div>

              {/* DEADLINE */}

              <p className="text-center text-[clamp(14px,1.4vw,20px)] text-[#ed5b30]">
                Scholarship Deadline: 23 Nov 2026
              </p>

              {/* SUBMIT */}

              <button
                type="submit"
                className="w-full rounded-full bg-[#1E7CBC] px-4 py-[clamp(9px,1.5vh,15px)] text-[clamp(14px,1.4vw,20px)] font-bold text-white transition duration-300 hover:bg-[#166091] hover:shadow-lg"
              >
                Start your marketing journey
              </button>

            </form>

          </div>

        </div>

      </main>

    </section>
  );
};

export default MarketingHero;
