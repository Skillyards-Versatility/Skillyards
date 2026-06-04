"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, Clock, Users, Calendar, Laptop, ArrowRight,
  CheckCircle2, XCircle, Check, X, Quote,
  GraduationCap, Briefcase, Trophy, BadgeCheck,
  ChevronDown,
} from "lucide-react";
const StickyCTABar = dynamic(() => import("./StickyCTABar").then(m => m.StickyCTABar));
const PartnersSlider = dynamic(() => import("@/components/common/PartnersSlider"));
const HERO_TIMER_DURATION = 10 * 60;

// ─── Data ────────────────────────────────────────────────────────────────────

const WHATSAPP_HREF =
  `https://wa.me/${process.env.NEXT_PUBLIC_PHONE?.replace(/\D/g, "") || "917060100561"}?text=${encodeURIComponent("Hi, I'm interested in the BCA/BBA On-Job Degree at SkillYards. I'd like a free career counseling session.")}`;

const programs = {
  bca: {
    label: "BCA",
    full: "Bachelor of Computer Applications",
    tagline: "Tech Careers — Development, Cloud & Cybersecurity",
    outcomes: [
      { icon: "💻", title: "Programming Foundations", desc: "C, C++, Python, Java. Build the mental model that makes every language easy." },
      { icon: "🌐", title: "Web Development", desc: "HTML, CSS, JavaScript, React, Node.js. Build and deploy real web apps." },
      { icon: "🗄️", title: "Databases", desc: "MySQL, MongoDB, and query optimization. Design systems that scale." },
      { icon: "☁️", title: "Cloud & DevOps", desc: "AWS basics, Docker, CI/CD. Skills every modern dev team wants." },
      { icon: "🔐", title: "Cybersecurity Basics", desc: "OWASP fundamentals, secure coding practices, network security." },
      { icon: "📜", title: "Career Preparation", desc: "Project work, portfolio building, interview preparation, and mentor guidance." },
    ],
    quickWins: [
      "Build and deploy a full-stack web application",
      "Create a GitHub portfolio employers notice",
      "Clear technical interviews with confidence",
      "Graduate with strong project experience",
    ],
  },
  bba: {
    label: "BBA",
    full: "Bachelor of Business Administration",
    tagline: "Business Careers — Marketing, Sales & Management",
    outcomes: [
      { icon: "📊", title: "Digital Marketing", desc: "SEO, Meta Ads, Google Ads, email marketing. Learn execution through mentor-guided practical work." },
      { icon: "💰", title: "Finance & Accounting", desc: "Financial statements, budgeting, Tally, GST. The numbers side every business needs." },
      { icon: "🤝", title: "Sales & Business Development", desc: "B2B and B2C sales, CRM tools, and closing deals." },
      { icon: "📈", title: "Business Strategy", desc: "Market analysis, competitive positioning, growth frameworks." },
      { icon: "🌐", title: "E-Commerce & Startups", desc: "How modern businesses are built — product, ops, customer acquisition, scaling." },
      { icon: "📜", title: "Career Preparation", desc: "Project work, presentations, communication, and mentor guidance." },
    ],
    quickWins: [
      "Build portfolio-ready campaign plans and reports",
      "Practice campaign setup, tracking, and reporting workflows",
      "Build and present a business plan to industry mentors",
      "Graduate with a strong portfolio of practical work",
    ],
  },
};

const comparisonRows = [
  {
    icon: GraduationCap,
    aspect: "What You Get",
    traditional: "Only a degree certificate. No real skills, no work experience.",
    skillyards: "Degree + industry skills + 3 years of on-job training in the same program.",
  },
  {
    icon: Laptop,
    aspect: "Laptop",
    traditional: "You arrange and pay for your own device.",
    skillyards: "Free laptop provided at enrollment. Zero extra cost.",
  },
  {
    icon: Briefcase,
    aspect: "Work Experience",
    traditional: "Graduate with 0 months of experience. Struggle to get the first job.",
    skillyards: "Graduate with 3 years of verifiable work experience on your CV.",
  },
  {
    icon: Trophy,
    aspect: "Placement",
    traditional: "Campus placement drives with no guaranteed outcomes.",
    skillyards: "Dedicated placement support with resume building, mock interviews, and career guidance.",
  },
  {
    icon: Check,
    aspect: "Skills Taught",
    traditional: "Outdated syllabus. Theory heavy. Rarely updated.",
    skillyards: "Industry-current tools and practical projects. Updated regularly.",
  },
  {
    icon: Check,
    aspect: "After Graduation",
    traditional: "Start from zero. Compete with thousands of other fresh graduates.",
    skillyards: "Start as an experienced professional. Stand out from day one.",
  },
];

const testimonials = [
  {
    name: "Ankit Sharma",
    role: "BCA Student",
    program: "BCA",
    quote: "The practical projects helped me understand how to explain my work clearly in interviews — especially databases and backend basics.",
    outcome: "Career preparation support",
  },
  {
    name: "Priya Singh",
    role: "BBA Student",
    program: "BBA",
    quote: "The mentor feedback on my assignments and reports helped me build confidence and a portfolio I could present during interviews.",
    outcome: "Hired same day",
  },
  {
    name: "Neha Gupta",
    role: "Frontend Developer @ Startup",
    program: "BCA",
    quote: "The free laptop wasn't a gimmick — we used it for real projects with real deadlines. By end of year 1 I already had a portfolio.",
    outcome: "Hired in Year 2",
  },
  {
    name: "Mohit Agarwal",
    role: "Business Development Manager @ Startup",
    program: "BBA",
    quote: "My classmates from regular BBA colleges spent months after graduation in unpaid internships. I already had 2 years of business experience on my CV.",
    outcome: "3 LPA at 21",
  },
  {
    name: "Rohan Verma",
    role: "BCA Student",
    program: "BCA",
    quote: "The practical projects and mentor feedback helped me build confidence and a portfolio I could explain clearly.",
    outcome: "Project-based learning",
  },
  {
    name: "Sakshi Sharma",
    role: "BBA Student",
    program: "BBA",
    quote: "The mentor-guided assignments and presentations helped me understand how to communicate my work professionally.",
    outcome: "Career preparation",
  },
];

const faqs = [
  { q: "Is the degree recognized by UGC / universities?", a: "Yes. Both BCA and BBA degrees are from a recognized university, valid for higher education and government jobs exactly like any other UG degree." },
  { q: "What is on-job training exactly?", a: "It means practical, mentor-guided project work alongside your degree curriculum — focused on skills, portfolio building, and career preparation." },
  { q: "Is the laptop really free?", a: "Please confirm current laptop availability and terms with the admissions team during counseling. We avoid making time-sensitive promises on the website." },
  { q: "Which program should I choose — BCA or BBA?", a: "BCA is for you if you're drawn to technology, coding, and building software. BBA is for you if you're drawn to business, marketing, sales, or management." },
  { q: "What if I'm not sure which stream to pick?", a: "Book a free career counseling session on WhatsApp. We'll talk through your interests and help you decide — no pressure." },
];

// ─── Sections ─────────────────────────────────────────────────────────────────

function Hero({ active, setActive }) {
  const heroPills = [
    { icon: <Laptop size={12} />, label: "Free Laptop Included", cls: "bg-[#dc2626] text-white shadow-lg shadow-[#dc2626]/25" },
    { icon: <Clock size={12} />, label: "3 Years Program", cls: "bg-[#f97316] text-white shadow-lg shadow-[#f97316]/25" },
    { icon: <Calendar size={12} />, label: "Admissions via counseling", cls: "border border-white/10 bg-white/8 text-slate-100 backdrop-blur" },
  ];
  const [heroTimer, setHeroTimer] = useState(HERO_TIMER_DURATION);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroTimer((prev) => (prev <= 1 ? HERO_TIMER_DURATION : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const heroMins = String(Math.floor(heroTimer / 60)).padStart(2, "0");
  const heroSecs = String(heroTimer % 60).padStart(2, "0");

  return (
    <section className="relative w-full overflow-hidden bg-[#111827] pt-20 pb-8 text-white md:pt-24 md:pb-14 lg:pt-16 xl:pt-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top,_rgba(220,38,38,0.28),_transparent_55%)]" />
        <div className="absolute -top-40 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-[#dc2626]/18 blur-[120px]" />
        <div className="absolute left-[-8%] top-24 h-56 w-56 rounded-full border border-[#dc2626]/20" />
        <div className="absolute right-[-6%] top-36 h-72 w-72 rounded-full border border-[#f97316]/20" />
        <div className="absolute bottom-[-80px] right-0 h-[280px] w-[280px] rounded-full bg-[#f97316]/15 blur-[90px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5">
        <div className="mb-8 flex justify-center lg:mb-8">
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/images/logo-dark.svg"
              alt="SkillYards Logo"
              width={170}
              height={42}
              className="h-auto w-[170px] object-contain lg:w-[240px]"
            />
          </Link>
        </div>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_440px] xl:gap-16">
          <div className="text-center lg:pt-8 lg:text-left xl:pt-10">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#fca5a5] shadow-sm backdrop-blur sm:px-4 sm:text-xs sm:tracking-widest"
            >
              <Star size={11} className="fill-current text-[#f97316]" />
              3-Year · On-Job Degree · BCA &amp; BBA
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="max-w-4xl font-serif text-[2.4rem] font-extrabold leading-[0.98] tracking-tight text-white sm:text-5xl md:text-6xl lg:max-w-[11ch] lg:text-[4.4rem] xl:max-w-[12ch] xl:text-[5rem]"
            >
              Degree Alone{" "}
              <span className="italic text-[#f97316]">Isn&apos;t Enough Anymore.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
              className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:mt-5 sm:max-w-2xl sm:text-lg lg:mx-0 lg:max-w-xl"
            >
              Get UGC certified <strong className="text-[#f97316] font-black">Degree</strong>, <strong className="text-[#f97316] font-black">Skills</strong> and <strong className="text-[#f97316] font-black">placement</strong> at the same place.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-2 lg:max-w-xl lg:justify-start"
            >
              {heroPills.map((p, i) => (
                <span key={i} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold sm:px-3.5 sm:py-2 sm:text-xs ${p.cls}`}>
                  {p.icon} {p.label}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.27 }}
              className="mt-8 flex flex-col items-center gap-3 lg:flex-row lg:items-center lg:justify-start"
            >
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#dc2626] px-6 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-[#dc2626]/30 transition-all hover:scale-105 hover:bg-[#b91c1c] sm:w-auto sm:px-8 sm:py-4"
              >
                Get Free Counselling <ArrowRight size={16} />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.34 }}
              className="mt-4 flex flex-col items-center gap-1.5 text-[11px] font-bold sm:mt-5 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-5 sm:gap-y-2 sm:text-xs lg:justify-start"
            >
              <span className="text-[#fca5a5]">Apply before May ends. Priority seats closing fast.</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38 }}
              className="hidden lg:mt-8 lg:grid lg:max-w-2xl lg:grid-cols-3 lg:gap-3"
            >
              <div className="rounded-2xl border border-white/10 bg-white/6 p-4 shadow-sm backdrop-blur">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-300">
                  Career Edge
                </p>
                <p className="mt-2 text-lg font-extrabold text-white">
                  Degree + Experience
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/6 p-4 shadow-sm backdrop-blur">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-300">
                  Job Readiness
                </p>
                <p className="mt-2 text-lg font-extrabold text-white">
                  From Semester 1
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/6 p-4 shadow-sm backdrop-blur">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-300">
                  Admission
                </p>
                <p className="mt-2 text-lg font-extrabold text-white">
                  Apply Before May Ends
                </p>
              </div>
            </motion.div>
          </div>

          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0f172a]/92 p-4 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.55)] backdrop-blur sm:p-6 lg:sticky lg:top-28 lg:p-7"
          >
            <div className="absolute inset-x-0 top-0 h-1.5 bg-[#dc2626]" />
            <div className="mb-4 flex w-full rounded-full border border-white/10 bg-white/5 p-1.5 shadow-sm sm:mb-5">
              {Object.entries(programs).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => setActive(key)}
                  className={`flex-1 rounded-full px-4 py-2.5 text-sm font-extrabold transition-all lg:px-5 ${
                    active === key
                      ? "bg-[#dc2626] text-white shadow-lg shadow-[#dc2626]/30"
                      : "text-slate-300"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#fca5a5] sm:text-[11px] sm:tracking-[0.24em]">
              Enrollment Window
            </p>
            <AnimatePresence mode="wait">
              <motion.p
                key={active}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="mt-2 text-xs font-semibold text-[#fdba74] sm:text-sm"
              >
                {active === "bca" ? "Tech careers with real job training." : "Business careers with real job training."}
              </motion.p>
            </AnimatePresence>
            <h3 className="mt-2 font-serif text-xl font-extrabold leading-tight text-white sm:mt-3 sm:text-2xl lg:text-[2rem]">
              Same Degree.
              <br />
              Better Start.
            </h3>

            <div className="mt-4 space-y-3 sm:mt-6">
              <div className="rounded-2xl border border-white/10 bg-white/6 p-3.5 sm:p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Current Selection</p>
                <p className="mt-1 text-base font-extrabold text-white sm:text-lg">{programs[active].full}</p>
                <p className="mt-1 text-xs text-[#fdba74] sm:text-sm">{programs[active].tagline}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-[#dc2626]/20 bg-[#dc2626]/10 p-3.5 sm:p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Degree</p>
                  <p className="mt-1 text-lg font-extrabold text-white sm:text-xl">3 Years</p>
                </div>
                <div className="rounded-2xl border border-[#f97316]/20 bg-[#f97316]/10 p-3.5 sm:p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Laptop</p>
                  <p className="mt-1 text-lg font-extrabold text-white sm:text-xl">Free</p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#dc2626]/30 bg-[#dc2626]/12 p-3.5 sm:p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#fca5a5]">Urgent</p>
                <p className="mt-1 text-xs font-semibold leading-relaxed text-white sm:text-sm">
                  Apply before May ends. Priority seats are getting filled first.
                </p>
                <div className="mt-3 flex items-center justify-between rounded-2xl bg-[#111827] px-3 py-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Priority Window
                  </span>
                  <span className="font-mono text-lg font-extrabold text-[#fdba74]">
                    {heroMins}:{heroSecs}
                  </span>
                </div>
              </div>
            </div>


          </motion.aside>
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  const aiPoints = [
    "Use AI tools inside actual course workflows instead of learning only theory.",
    "Build prompt thinking, automation habits, and faster execution from semester one.",
    "Prepare for roles where AI-assisted work is already expected by employers.",
  ];

  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-[#111827] py-10 md:py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 rounded-full bg-[#dc2626]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-5">
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold uppercase tracking-[0.24em] text-[#fca5a5]"
          >
            AI Integration
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06 }}
            className="mt-2 font-serif text-[2rem] font-extrabold leading-tight tracking-tight text-white sm:mt-3 sm:text-4xl"
          >
            Learn With <span className="italic text-[#dc2626]">AI Built In</span>
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12 }}
          className="mt-7 rounded-[1.75rem] border-2 border-[#fdba74] bg-gradient-to-br from-[#fde68a] via-[#fdba74] to-[#fb923c] p-4 text-black shadow-[0_24px_60px_-20px_rgba(127,29,29,0.45)] sm:mt-10 sm:rounded-[2rem] sm:p-7"
        >
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl text-center lg:text-left">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/70 sm:text-xs sm:tracking-[0.22em]">
                  AI Integration
                </p>
                <h3 className="mx-auto mt-2 max-w-[12ch] font-serif text-[1.75rem] font-extrabold leading-[1.02] tracking-tight lg:mx-0 lg:max-w-[16ch] sm:text-4xl">
                  Learn AI the way real companies work.
                </h3>
              </div>
              <div className="w-full rounded-2xl border border-black/10 bg-white/40 px-4 py-3 text-left sm:w-fit">
                <p className="text-2xl font-extrabold leading-none sm:text-3xl">100%</p>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-black/65 sm:text-sm sm:tracking-[0.18em]">
                  AI Integrated Programs
                </p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {aiPoints.map((point, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-black/10 bg-white/35 p-4 backdrop-blur"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-black/55 sm:text-[11px] sm:tracking-[0.18em]">
                    AI Focus {i + 1}
                  </p>
                  <p className="mt-2 text-[13px] font-semibold leading-relaxed text-black/80 sm:text-sm">
                    {point}
                  </p>
                </div>
              ))}
            </div>

            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 w-auto self-center items-center justify-center gap-2 rounded-full bg-[#111827] px-4 py-2.5 text-center text-xs font-extrabold leading-tight text-white transition-all hover:scale-[1.02] hover:bg-black sm:min-h-10 sm:px-4 sm:py-2.5 sm:text-sm"
            >
              Get Free Counselling <ArrowRight size={15} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ProgramCards({ active, setActive }) {
  const prog = programs[active];

  return (
    <section className="bg-[#111827] py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-8 text-center md:mb-10">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold uppercase tracking-widest text-[#fca5a5]"
          >
            Choose Your Path
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.07 }}
            className="mt-2 font-serif text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
          >
            One Framework. <span className="italic text-[#dc2626]">Two Degrees.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-300 sm:max-w-xl"
          >
            Pick stream. See path. Take action.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
            className="mx-auto flex w-full max-w-md rounded-full border border-[#fed7aa] bg-white p-1.5 shadow-sm lg:max-w-lg"
        >
          {Object.entries(programs).map(([key, item]) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`flex-1 rounded-full px-4 py-3 text-sm font-extrabold transition-all ${
                active === key
                  ? "bg-[#dc2626] text-white shadow-lg shadow-[#dc2626]/25"
                  : "text-slate-600"
              }`}
            >
              {item.label}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22 }}
            className="mt-5 min-h-[78svh] rounded-[2rem] border border-[#fed7aa] bg-white p-5 shadow-[0_30px_80px_-40px_rgba(127,29,29,0.18)] sm:min-h-[72svh] sm:p-7 lg:min-h-0"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b91c1c]">
                    {active === "bca" ? "Tech Career Track" : "Business Career Track"}
                  </p>
                  <h3 className="mt-2 font-serif text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                    {prog.label}
                  </h3>
                </div>
                <span className="rounded-full bg-[#dc2626] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white">
                  In Demand
                </span>
              </div>

              <p className="mt-4 text-lg font-semibold leading-snug text-slate-900 sm:text-xl">
                {active === "bca" ? "Build products, systems, and developer credibility." : "Build revenue, campaigns, and business credibility."}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {prog.full} with free laptop, on-job training, and placement support built in.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3 lg:max-w-md">
                <div className="rounded-2xl border border-[#dc2626]/12 bg-[#dc2626]/6 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Outcome</p>
                  <p className="mt-1 text-base font-extrabold text-slate-900">
                    {active === "bca" ? "Developer Path" : "Growth Path"}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#f97316]/12 bg-[#f97316]/10 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Advantage</p>
                  <p className="mt-1 text-base font-extrabold text-slate-900">3 Years Experience</p>
                </div>
              </div>

              <div className="mt-5 rounded-[1.5rem] border border-[#fed7aa] bg-[#fff7ed] p-4 lg:p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#b91c1c]">
                  Curriculum Snapshot
                </p>
                <ul className="mt-3 space-y-2.5 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
                  {prog.outcomes.slice(0, 4).map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-900">
                      <span className="mt-0.5 shrink-0 text-base">{item.icon}</span>
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-xs leading-relaxed text-slate-600">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 rounded-[1.5rem] border border-[#dc2626]/15 bg-[#dc2626]/6 p-4 lg:p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#b91c1c]">
                  What You Leave With
                </p>
                <ul className="mt-3 space-y-2 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
                  {prog.quickWins.slice(0, 2).map((win, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-900">
                      <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#dc2626]" />
                      {win}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-5">
                <div className="flex flex-col gap-3">
                  <a
                    href={WHATSAPP_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#dc2626] px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#dc2626]/20 transition-all hover:scale-105 hover:bg-[#b91c1c]"
                  >
                    Get Free Counselling <ArrowRight size={15} />
                  </a>

                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function WhatYouLearn({ active }) {
  const prog = programs[active];
  return (
    <section className="bg-[#111827] py-16 text-white md:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-center mb-10">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold uppercase tracking-widest text-[#fca5a5]"
          >
            {prog.label} Curriculum
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.07 }}
            className="mt-2 font-serif text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
          >
            What You&apos;ll{" "}
            <span className="italic text-[#fdba74]">Learn & Build</span>
          </motion.h2>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {prog.outcomes.map((item, i) => (
              <div
                key={i}
                className="flex gap-3.5 rounded-2xl border border-white/10 bg-white/6 p-5 transition-all hover:border-[#dc2626]/30 hover:shadow-sm"
              >
                <span className="mt-0.5 shrink-0 text-xl">{item.icon}</span>
                <div>
                  <p className="font-bold text-sm text-white">{item.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-300">{item.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.ul
            key={active + "-wins"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-2"
          >
            {prog.quickWins.map((win, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#f97316]" />
                {win}
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </section>
  );
}

function WhySkillyards() {
  const COMPARISON_PREVIEW_COUNT = 3;
  const [showAllComparisons, setShowAllComparisons] = useState(false);
  const mobileComparisonRows = showAllComparisons
    ? comparisonRows
    : comparisonRows.slice(0, COMPARISON_PREVIEW_COUNT);

  return (
    <section className="relative overflow-hidden bg-[#111827] py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/3 h-96 w-96 rounded-full bg-[#dc2626]/8 blur-[100px]" />
      </div>
      <div className="mx-auto max-w-5xl px-5">
        <div className="mb-8 flex justify-center md:mb-10">
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/images/logo-light.svg"
              alt="SkillYards Logo"
              width={170}
              height={42}
              className="object-contain"
            />
          </Link>
        </div>
        <div className="mb-10 text-center md:mb-12">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold uppercase tracking-widest text-[#fca5a5]"
          >
            Why SkillYards
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.07 }}
            className="mt-2 font-serif text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl"
          >
            SkillYards <span className="italic text-[#dc2626]">vs</span> Traditional College
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 }}
            className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base"
          >
            A degree from a traditional college gets you a certificate. SkillYards gives you the certificate, the skills, the experience, and the job.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 rounded-[1.75rem] border border-[#dc2626]/20 bg-[#dc2626]/6 p-4 sm:mb-8 sm:p-5"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#b91c1c]">
                Reality Check
              </p>
              <p className="mt-1 text-sm font-semibold leading-relaxed text-white sm:text-base">
                Same 3 years. Very different result after graduation.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-slate-900">Degree</span>
              <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-slate-900">Experience</span>
              <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-slate-900">Placement Edge</span>
            </div>
          </div>
        </motion.div>

        {/* Desktop table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="hidden overflow-hidden rounded-[2rem] border border-[#fed7aa] shadow-sm md:block"
        >
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#111827] text-white">
                <th className="px-5 py-4 text-left font-bold w-[22%]">Aspect</th>
                <th className="px-5 py-4 text-left font-bold w-[39%] opacity-70">Traditional College</th>
                <th className="px-5 py-4 text-left font-bold w-[39%]">SkillYards OJD</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => {
                const Icon = row.icon;
                return (
                  <tr key={i} className={`border-t border-[#fed7aa] hover:bg-[#fff7ed] ${i % 2 === 0 ? "bg-white" : "bg-[#fffbf5]"}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5 font-bold text-slate-900">
                        <Icon size={15} className="shrink-0 text-[#dc2626]" />
                        {row.aspect}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-2 text-slate-600">
                        <X size={14} className="mt-0.5 shrink-0 text-[#dc2626]/55" />
                        {row.traditional}
                      </div>
                    </td>
                    <td className="bg-[#fff7ed] px-5 py-4">
                      <div className="flex items-start gap-2 font-medium text-slate-900">
                        <Check size={14} className="mt-0.5 shrink-0 text-[#dc2626]" />
                        {row.skillyards}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>

        {/* Mobile cards */}
        <div className="space-y-3 md:hidden">
          {mobileComparisonRows.map((row, i) => {
            const Icon = row.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="overflow-hidden rounded-[1.6rem] border border-[#fed7aa] bg-white shadow-sm"
              >
                <div className="flex items-center gap-2.5 border-b border-[#fed7aa] bg-[#fff7ed] px-4 py-3">
                  <Icon size={14} className="shrink-0 text-[#dc2626]" />
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-900">{row.aspect}</span>
                </div>
                <div className="grid grid-cols-2">
                  <div className="border-r border-[#fed7aa] px-4 py-3">
                    <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Traditional</p>
                    <div className="flex items-start gap-1.5">
                      <X size={12} className="mt-0.5 shrink-0 text-[#dc2626]/55" />
                      <p className="text-xs leading-snug text-slate-600">{row.traditional}</p>
                    </div>
                  </div>
                  <div className="bg-[#fff7ed] px-4 py-3">
                    <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#b91c1c]">SkillYards</p>
                    <div className="flex items-start gap-1.5">
                      <Check size={12} className="mt-0.5 shrink-0 text-[#dc2626]" />
                      <p className="text-xs font-medium leading-snug text-slate-900">{row.skillyards}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {comparisonRows.length > COMPARISON_PREVIEW_COUNT && (
          <div className="mt-5 flex justify-center md:hidden">
            <button
              type="button"
              onClick={() => setShowAllComparisons((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full border border-[#fed7aa] bg-white px-5 py-3 text-sm font-extrabold text-[#b91c1c] shadow-sm transition-colors hover:border-[#fdba74] hover:bg-[#fff7ed]"
            >
              {showAllComparisons ? "Show fewer differences" : "Load more differences"}
              <ChevronDown
                size={16}
                className={`transition-transform ${showAllComparisons ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12 }}
          className="mt-6 rounded-[1.75rem] border border-[#fed7aa] bg-white/90 p-4 shadow-sm sm:mt-8 sm:p-5"
        >
          <div className="text-center">
            <p className="text-base font-extrabold text-slate-900 sm:text-lg">
              Don&apos;t spend 3 years graduating into zero experience.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
              Choose degree with real work, real tools, and job-ready output from semester 1.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function WhoIsThisFor() {
  const goodFit = [
    "You've just finished 12th (any stream) and want a job-ready degree",
    "You want real work experience alongside your studies, not after",
    "You want a free laptop without spending extra",
    "You're interested in tech (BCA) or business & marketing (BBA)",
    "You want placement support that doesn't end at a notice board",
  ];
  const notFit = [
    "You want a theory-only degree with no accountability",
    "You're looking for distance/correspondence with zero industry contact",
    "You're not willing to show up and do the actual work",
  ];
  return (
    <section className="bg-[#111827] py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-5">
        <div className="mb-8 text-center md:mb-10">
          <motion.span initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-xs font-bold uppercase tracking-widest text-[#fca5a5]">
            Is This For You?
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.07 }} className="mt-2 font-serif text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Who Gets the Most Out of This
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.11 }}
            className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-300"
          >
            Quick self-check before you apply.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-[1.75rem] border border-[#dc2626]/20 bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-bold uppercase tracking-wider text-[#b91c1c]">This is for you if…</p>
              <span className="rounded-full bg-[#dc2626] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white">
                Good Fit
              </span>
            </div>
            <ul className="space-y-3">
              {goodFit.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-900">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#dc2626]" />{item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-[1.75rem] border border-[#fed7aa] bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-bold text-slate-500 text-sm uppercase tracking-wider">Maybe not if…</p>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-600">
                Wrong Fit
              </span>
            </div>
            <ul className="space-y-3">
              {notFit.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-600">
                  <XCircle size={15} className="mt-0.5 shrink-0 text-[#dc2626]/60" />{item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12 }}
          className="mt-6 rounded-[1.75rem] border border-[#fed7aa] bg-white p-4 shadow-sm sm:mt-8 sm:p-5"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-extrabold text-slate-900">
                If this sounds like you, don&apos;t wait for final admission rush.
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
                Talk to team, check your fit, and reserve your place early.
              </p>
            </div>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#dc2626] px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#dc2626]/20 transition-all hover:scale-105 hover:bg-[#b91c1c] md:w-auto"
            >
              Get Free Counselling <ArrowRight size={15} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Instructor({ mentorMembers = [] }) {
  const mentorSupport = [
    {
      title: "Weekly Work Review",
      desc: "Your projects, assignments, and client tasks get reviewed before weak work becomes a habit.",
    },
    {
      title: "Career Direction",
      desc: "Mentors help you choose BCA or BBA path, then push you toward role-ready skills from semester 1.",
    },
    {
      title: "Interview Readiness",
      desc: "You learn how to explain your real work clearly, so interviews feel like proof not panic.",
    },
  ];

  const findMember = (slug) => mentorMembers.find((m) => m.slug === slug);

  const mentors = [
    {
      ...(findMember("neeraj-dang") || {}),
      image: findMember("neeraj-dang")?.image || "",
      initial: "N",
      chips: ["SEO & PPC", "Marketing Strategy", "Student Mentorship"],
      avatarClassName: "object-[center_18%] scale-100",
    },
    {
      ...(findMember("mrigesh-deshpande") || {}),
      image: findMember("mrigesh-deshpande")?.image || "",
      initial: "M",
      chips: ["AI Integration", "Tech Mentorship", "Workflow Guidance"],
      avatarClassName: "object-center scale-100",
    },
    {
      ...(findMember("narendra-singh") || {}),
      image: findMember("narendra-singh")?.image || "",
      initial: "N",
      chips: ["Program Direction", "Industry Exposure", "Progress Reviews"],
      avatarClassName: "object-[center_16%] scale-100",
    },
  ];

  return (
    <section className="bg-[#111827] py-16 text-white md:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-center mb-10">
          <motion.span initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-xs font-bold uppercase tracking-widest text-[#fca5a5]">
            Guided Training
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.07 }} className="mt-2 font-serif text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            You Won&apos;t Figure It Out{" "}
            <span className="italic text-[#fdba74]">Alone</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300"
          >
            Real projects create pressure. Mentors make sure that pressure turns into job-ready skill, not confusion.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid gap-6 rounded-3xl border border-white/10 bg-white/6 p-6 md:gap-8 md:p-8"
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mentors.map((mentor) => (
              <div key={mentor.name} className="rounded-[1.75rem] border border-[#dc2626]/18 bg-[#0f172a] p-6 text-center md:text-left">
                <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[#dc2626]/16 text-3xl font-extrabold text-[#fca5a5] md:mx-0 md:h-28 md:w-28">
                  {mentor.image ? (
                    <Image
                      src={mentor.image}
                      alt={mentor.name}
                      width={112}
                      height={112}
                      className={`h-full w-full object-cover ${mentor.avatarClassName || "object-center"}`}
                    />
                  ) : (
                    mentor.initial
                  )}
                </div>
                <h3 className="mt-5 font-serif text-2xl font-extrabold text-white">{mentor.name}</h3>
                <p className="mt-1 text-sm font-semibold text-[#fdba74]">{mentor.role}</p>
                <p className="mt-4 text-sm leading-relaxed text-slate-300">
                  {mentor.bio}
                </p>
                <ul className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start">
                  {mentor.chips.map((chip, i) => (
                    <li key={i} className="flex items-center gap-1.5 rounded-full border border-[#dc2626]/18 bg-[#dc2626]/10 px-3 py-1 text-[11px] font-semibold text-[#fca5a5]">
                      <BadgeCheck size={11} /> {chip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <div className="grid gap-3 sm:grid-cols-3">
                {mentorSupport.map((item) => (
                  <div key={item.title} className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#fca5a5]">
                      Mentor Role
                    </p>
                    <h4 className="mt-2 text-base font-extrabold text-white">{item.title}</h4>
                    <p className="mt-2 text-xs leading-relaxed text-slate-300">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-[1.5rem] border border-[#f97316]/20 bg-[#f97316]/10 p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#fdba74]">
                  Why This Matters
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white">
                  Most students fail because nobody corrects them early. Here, mentors close that gap before it becomes a weak portfolio, weak interview, or wasted semester.
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-extrabold text-white">
                  Guidance matters more when seats are limited and time is moving.
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">
                  Meet team, understand training model, then decide fast with clarity.
                </p>
              </div>
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#dc2626] px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#dc2626]/20 transition-all hover:scale-105 hover:bg-[#b91c1c]"
              >
                Get Free Counselling <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Testimonials() {
  const MOBILE_TESTIMONIAL_PREVIEW_COUNT = 2;
  const [showAllTestimonials, setShowAllTestimonials] = useState(false);

  return (
    <section className="bg-[#111827] py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-8 text-center md:mb-12">
          <motion.span initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-xs font-bold uppercase tracking-widest text-[#fca5a5]">
            Student Stories
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.07 }} className="mt-2 font-serif text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Real Results, <span className="italic text-[#dc2626]">Real People</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-300"
          >
            Outcomes that feel closer, not theoretical.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 rounded-[1.75rem] border border-[#fed7aa] bg-white p-4 shadow-sm sm:mb-8 sm:p-5"
        >
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-2xl bg-[#fff7ed] p-3.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Proof</p>
              <p className="mt-1 text-lg font-extrabold text-slate-900">Real Jobs</p>
            </div>
            <div className="rounded-2xl bg-[#fff7ed] p-3.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Timing</p>
              <p className="mt-1 text-lg font-extrabold text-slate-900">Before Finals</p>
            </div>
            <div className="rounded-2xl bg-[#fff7ed] p-3.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Advantage</p>
              <p className="mt-1 text-lg font-extrabold text-slate-900">3 Years Edge</p>
            </div>
            <div className="rounded-2xl bg-[#fff7ed] p-3.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Result</p>
              <p className="mt-1 text-lg font-extrabold text-slate-900">Hireable Fast</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className={`relative overflow-hidden rounded-[1.75rem] border border-[#fed7aa] bg-white p-5 transition-all hover:-translate-y-1 hover:border-[#dc2626]/20 hover:shadow-md sm:p-6 ${
                i >= MOBILE_TESTIMONIAL_PREVIEW_COUNT && !showAllTestimonials ? "hidden sm:block" : ""
              }`}
            >
              <Quote size={20} className="absolute right-5 top-5 text-[#dc2626]/10" />
              <span className="mb-3 inline-block rounded-full bg-[#dc2626]/10 px-2.5 py-1 text-[10px] font-bold text-[#b91c1c]">
                {t.program}
              </span>
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={12} className="fill-[#f97316] text-[#f97316]" />
                  ))}
                </div>
                <span className="rounded-full bg-[#dc2626]/10 px-2.5 py-1 text-[10px] font-bold text-[#b91c1c]">
                  {t.outcome}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="mt-4 rounded-2xl bg-[#fff7ed] p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Career Outcome
                </p>
                <p className="mt-1 text-sm font-extrabold text-slate-900">
                  {t.outcome}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dc2626]/10 text-sm font-bold text-[#b91c1c]">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{t.name}</p>
                  <p className="text-[11px] text-slate-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {testimonials.length > MOBILE_TESTIMONIAL_PREVIEW_COUNT && (
          <div className="mt-5 flex justify-center sm:hidden">
            <button
              type="button"
              onClick={() => setShowAllTestimonials((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full border border-[#fed7aa] bg-white px-5 py-3 text-sm font-extrabold text-[#b91c1c] shadow-sm transition-colors hover:border-[#fdba74] hover:bg-[#fff7ed]"
            >
              {showAllTestimonials ? "Show fewer stories" : "Load more stories"}
              <ChevronDown
                size={16}
                className={`transition-transform ${showAllTestimonials ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12 }}
          className="mt-6 rounded-[1.75rem] border border-[#fed7aa] bg-white p-4 shadow-sm sm:mt-8 sm:p-5"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-extrabold text-slate-900">
                Next story can be yours before graduation ends.
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
                Start with demo class, see training model, then lock your path early.
              </p>
            </div>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#dc2626] px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#dc2626]/20 transition-all hover:scale-105 hover:bg-[#b91c1c] md:w-auto"
            >
              Get Free Counselling <ArrowRight size={15} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section className="bg-[#111827] py-16 md:py-24">
      <div className="mx-auto max-w-2xl px-5">
        <div className="text-center mb-10">
          <motion.span initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-xs font-bold uppercase tracking-widest text-[#fca5a5]">
            FAQ
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.07 }} className="mt-2 font-serif text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Got Questions?
          </motion.h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="overflow-hidden rounded-2xl border border-[#fed7aa] bg-white"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-slate-900"
              >
                {faq.q}
                <ChevronDown size={16} className={`shrink-0 text-slate-500 transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 text-sm leading-relaxed text-slate-600">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[#111827] py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-[#dc2626]/15 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-[#f97316]/12 blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto max-w-2xl px-5 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl"
        >
          Your Career Starts in Semester 1.{" "}
          <span className="opacity-75">Not After Graduation.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-4 max-w-lg text-sm text-slate-300 sm:text-base"
        >
          Book a free demo class. See exactly how the program works, meet the mentors, and decide with full information.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.18 }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#dc2626] px-8 py-4 text-sm font-extrabold text-white shadow-xl shadow-[#dc2626]/25 transition-all hover:scale-105 hover:bg-[#b91c1c]"
          >
            Get Free Counselling <ArrowRight size={16} />
          </a>
        </motion.div>
        <p className="mt-4 text-[11px] text-slate-400">
          No spam. No pressure. Your questions first, enrollment when you&apos;re ready.
        </p>
      </div>
    </section>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function OJDCampaignPage({ mentorMembers = [] }) {
  const [active, setActive] = useState("bca");

  return (
    <div className="w-full overflow-x-hidden bg-[#111827] text-slate-900 pb-20">
      <Hero active={active} setActive={setActive} />
      <SocialProof />
      <ProgramCards active={active} setActive={setActive} />
      <WhySkillyards />
      <WhoIsThisFor />
      <Instructor mentorMembers={mentorMembers} />
      <Testimonials />
      <PartnersSlider />
      <FAQ />
      <FinalCTA />
      <StickyCTABar whatsappHref={WHATSAPP_HREF} />
    </div>
  );
}
