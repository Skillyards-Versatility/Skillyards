"use client";

import { useState } from "react";
import { Menu, X, ArrowRight, Phone, Star, CheckCircle2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { SiMeta, SiSemrush, SiHubspot } from "react-icons/si";
import FloatingIcons from "./floating-icons";

/* =================================
   STATIC DATA (FROM CAMPAIGN HERO)
================================= */

const features = [
  "Prepare for 15+ Industry Certifications — Google, Meta, Semrush, HubSpot & more.",
  "6-Month Program with 100% Placement Assistance.",
  "10+ Hands-on Industry-Relevant Projects.",
  "80:20 Learning Model — 80% Practical, 20% Theory.",
  "AI-Powered Marketing — From Strategy to Execution.",
];

const certificationLogos = [
  {
    name: "Google",
    Icon: FcGoogle,
    label: "Google",
    color: "#4285F4",
  },
  {
    name: "Meta",
    Icon: SiMeta,
    label: "Meta",
    color: "#0081FB",
  },
  {
    name: "Semrush",
    Icon: SiSemrush,
    label: "SEMRUSH",
    color: "#FF642D",
  },
  {
    name: "HubSpot",
    Icon: SiHubspot,
    label: "HubSpot",
    color: "#FF7A59",
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
                <span>What You’ll Learn</span>
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
                href="#reviews"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 border-b border-gray-100 hover:text-[#1E7CBC]"
              >
                <span>Student Reviews</span>
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

        <div className="flex min-w-0 flex-col justify-center gap-[clamp(8px,1.2vh,16px)]">

          {/* HEADING */}

          <div className="relative">

            <p className="text-[clamp(18px,2.2vw,34px)] font-light leading-tight text-[#666]">
              The Digital Marketing
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold leading-[1.05] tracking-tight text-[#222]">
              CAREER LAUNCHPAD
            </h1>

            <h2 className="mt-2 text-[clamp(16px,1.9vw,26px)] font-bold text-[#1E7CBC] leading-snug">
              AI-Integrated Digital Marketing Course in Agra
            </h2>

            <p className="mt-1 text-[clamp(13px,1.3vw,18px)] font-normal text-gray-600">
              Learn. Execute. Build an Industry-Ready Career.
            </p>

          </div>

          {/* FEATURES LIST */}

          <div className="flex flex-col gap-2 sm:gap-2.5 my-1">

            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-2.5">

                <CheckCircle2 className="h-4 sm:h-5 w-4 sm:w-5 text-emerald-500 shrink-0 mt-0.5" />

                <p className="text-xs sm:text-sm lg:text-[15px] leading-snug text-gray-700">
                  {feature}
                </p>

              </div>
            ))}

          </div>

          {/* RATING & GOOGLE REVIEWS */}

          <div className="flex items-center gap-2.5 pt-1">

            <span className="text-lg sm:text-2xl font-black text-gray-900">
              4.8/5
            </span>

            <div className="flex items-center gap-0.5 text-amber-400">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            </div>

            <span className="text-xs sm:text-sm text-gray-500 font-medium">
              116+ Google Reviews
            </span>

          </div>

          {/* GLOBALLY RECOGNIZED CERTIFICATIONS PILLS */}

          <div className="pt-2">

            <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
              Prepare for Globally Recognized Certifications
            </p>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">

              {certificationLogos.map((item) => (
                <div
                  key={item.name}
                  className="inline-flex items-center gap-2 rounded-xl bg-white border border-gray-200/90 px-3 py-1.5 shadow-xs transition hover:shadow-md hover:border-gray-300"
                >
                  <item.Icon className="h-4 sm:h-5 w-4 sm:w-5 shrink-0" style={{ color: item.color }} />
                  <span className="text-xs font-bold text-gray-800">
                    {item.label}
                  </span>
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
            className="w-full max-w-[480px] overflow-hidden rounded-[24px] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.09)] border border-gray-100"
          >

            {/* FORM HEADER */}

            <div className="bg-[#1E7CBC] px-5 py-4 text-center">

              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Book Your Free Demo Class
              </h3>

            </div>

            {/* SUBTITLE */}

            <div className="px-6 pt-4 text-center">

              <p className="text-xs sm:text-sm text-gray-600 font-medium">
                Experience the learning before you decide.
              </p>

            </div>

            {/* FORM BODY */}

            <form
              id="hero-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-3.5 p-6 pt-3"
            >

              <input
                type="text"
                name="name"
                placeholder="Full Name*"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-4 py-3 text-xs sm:text-sm text-gray-800 outline-none transition focus:border-[#1E7CBC] focus:bg-white"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address*"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-4 py-3 text-xs sm:text-sm text-gray-800 outline-none transition focus:border-[#1E7CBC] focus:bg-white"
              />

              {/* PHONE WITH COUNTRY CODE */}

              <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50/60 px-3 py-2 text-xs sm:text-sm text-gray-800 focus-within:border-[#1E7CBC] focus-within:bg-white transition">

                <span className="text-base mr-1">🇮🇳</span>

                <span className="font-semibold text-gray-700 mr-2">+91</span>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Mobile Number*"
                  required
                  pattern="[0-9]{10}"
                  className="min-w-0 flex-1 bg-transparent text-xs sm:text-sm text-gray-800 outline-none"
                />

              </div>

              {/* WHATSAPP OPT-IN CHECKBOX */}

              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-gray-700 select-none pt-1">

                <input
                  type="checkbox"
                  name="whatsapp_updates"
                  defaultChecked
                  className="h-4 w-4 rounded border-gray-300 text-[#1E7CBC] focus:ring-[#1E7CBC] accent-[#1E7CBC]"
                />

                <span>Receive demo details on WhatsApp</span>

              </label>

              {/* SUBMIT BUTTON */}

              <button
                type="submit"
                className="cursor-pointer w-full rounded-full bg-[#1E7CBC] py-3.5 text-sm sm:text-base font-bold text-white shadow-md shadow-[#1E7CBC]/25 transition duration-200 hover:bg-[#166091] hover:shadow-lg active:scale-[0.99] mt-2"
              >
                Book My Free Demo
              </button>

              {/* FOOTER NOTE */}

              <p className="text-center text-xs text-gray-500 font-medium">
                No Payment. No Commitment.
              </p>

            </form>

          </div>

        </div>

      </main>

    </section>
  );
};

export default MarketingHero;
