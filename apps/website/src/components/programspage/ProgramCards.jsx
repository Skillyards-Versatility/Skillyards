"use client";

import {
  ArrowRight,
  GraduationCap,
  Clock,
  Sparkles,
  BookOpen,
  Wallet,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ojdPrograms = [
  {
    id: "bca",
    name: "BCA with Full-Stack Development",
    badge: "UGC-recognized degree pathway",
    skills: ["Full-Stack Development", "React", "Node.js", "Databases"],
    duration: "3 Years Duration",
    eligibility: "For 12th-pass students",
    fee: "Starting from ₹5k/month",
    tc: "T&C Apply",
    emiNote: "EMI/installment options available",
    cta: "Explore BCA Program",
    href: "/bca-training-program-in-agra",
    themeColor: "text-primary",
    badgeBg: "bg-primary/10 text-primary border-primary/20",
    glowColor: "bg-primary/10",
  },
  {
    id: "bba",
    name: "BBA with Digital Marketing",
    badge: "UGC-recognized degree pathway",
    skills: ["Digital Marketing", "SEO", "Google Ads", "Meta Ads"],
    duration: "3 Years Duration",
    eligibility: "For 12th-pass students",
    fee: "Starting from ₹5k/month",
    tc: "T&C Apply",
    emiNote: "EMI/installment options available",
    cta: "Explore BBA Program",
    href: "/bba-training-program-in-agra",
    themeColor: "text-rose-600",
    badgeBg: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    glowColor: "bg-rose-500/10",
  },
];

const ojtPrograms = [
  {
    id: "fullstack",
    name: "AI-Integrated Full-Stack Web Development Training",
    badge: "Job-skill focused training",
    skills: [
      "React",
      "Node.js",
      "MongoDB",
      "GitHub",
      "Deployment",
      "AI Coding Workflows",
    ],
    duration: "6 Months Duration",
    eligibility: "For graduates & college students",
    fee: "Starting from ₹5k/month",
    tc: "T&C Apply",
    emiNote: "EMI/installment options available",
    cta: "Explore Full-Stack Course",
    href: "/full-stack-web-development-training-in-agra",
    themeColor: "text-cyan-600",
    badgeBg: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
    glowColor: "bg-cyan-400/10",
  },
  {
    id: "digitalmarketing",
    name: "AI-Integrated Digital Marketing Training",
    badge: "Job-skill focused training",
    skills: ["SEO", "Google Ads", "Meta Ads", "AI Workflows"],
    duration: "6 Months Duration",
    eligibility: "For graduates & college students",
    fee: "Starting from ₹5.5k/month",
    tc: "T&C Apply",
    emiNote: "EMI/installment options available",
    cta: "Explore Digital Marketing Course",
    href: "/digital-marketing-course-in-agra",
    themeColor: "text-amber-600",
    badgeBg: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    glowColor: "bg-amber-400/10",
  },
];

function ProgramSection({
  title,
  desc,
  ctaText,
  ctaHref,
  programs,
  badgeText,
}) {
  return (
    <div className="mb-24 last:mb-0">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-border/20 pb-8">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
            {badgeText}
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="text-sm font-medium text-muted-foreground leading-relaxed">
            {desc}
          </p>
        </div>
        <div className="shrink-0">
          <Button
            asChild
            variant="outline"
            className="rounded-full border-primary/20 hover:border-primary/50 text-xs font-black uppercase tracking-widest text-primary gap-1 px-6 py-5"
          >
            <Link href={ctaHref}>
              {ctaText} <ChevronRight size={14} />
            </Link>
          </Button>
        </div>
      </div>

      {/* Program Cards Grid / Scroll */}
      <div className="relative group/container">
        <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory lg:grid lg:grid-cols-2 lg:gap-8 lg:overflow-visible lg:pb-0 no-scrollbar">
          {programs.map((prog, i) => (
            <div
              key={prog.id}
              className="flex-none w-[85vw] md:w-[45vw] lg:w-auto snap-center flex flex-col h-full group"
            >
              <div className="flex flex-col rounded-[2.5rem] border border-border/50 bg-white dark:bg-[#0d0d12] dark:border-white/5 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 w-full h-full flex-1 overflow-hidden relative">
                {/* Subtle Dark Mode Glow */}
                <div
                  className={`absolute -top-20 -right-20 w-48 h-48 blur-[100px] opacity-0 dark:opacity-45 rounded-full transition-opacity duration-500 group-hover:opacity-65 ${prog.glowColor}`}
                />

                {/* Top Header Section */}
                <div className="w-full p-6 lg:p-8 border-b border-border/30 bg-slate-50/50 dark:bg-white/[0.03] text-center relative z-10">
                  <div
                    className={`inline-block px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest mb-3 border ${prog.badgeBg}`}
                  >
                    {prog.badge}
                  </div>
                  <h3 className="font-serif text-xl lg:text-2xl font-black text-foreground leading-tight tracking-tight mb-2">
                    {prog.name}
                  </h3>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">
                    Hands-On Training
                  </p>
                </div>

                {/* Details Section */}
                <div className="p-6 lg:p-8 flex flex-col flex-1 relative z-10">
                  {/* Skills/Tags */}
                  <div className="mb-6 flex flex-wrap gap-2">
                    {prog.skills.map((skill) => (
                      <span
                        key={skill}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.05] text-[10px] font-bold text-foreground/80 border border-border/50"
                      >
                        <Sparkles
                          size={10}
                          className={`${prog.themeColor} shrink-0`}
                        />
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Program Meta List */}
                  <div className="mb-8 flex flex-col gap-3 border-t border-border/30 pt-6 text-xs md:text-sm font-bold text-foreground/95">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className={prog.themeColor} />
                      {prog.duration}
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap size={16} className={prog.themeColor} />
                      {prog.eligibility}
                    </div>
                    <div className="flex items-center gap-2">
                      <Wallet size={16} className={prog.themeColor} />
                      <span>
                        {prog.fee}
                        {prog.tc && (
                          <span className="text-[6.5px] md:text-[7.5px] font-extrabold text-muted-foreground/45 uppercase tracking-widest select-none ml-1 align-baseline inline-block">
                            ({prog.tc})
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard size={16} className={prog.themeColor} />
                      {prog.emiNote}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-auto">
                    <Button
                      asChild
                      className="w-full h-11 lg:h-12 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 group/btn cursor-pointer"
                    >
                      <Link
                        href={prog.href}
                        className="flex items-center justify-center"
                      >
                        {prog.cta}
                        <ArrowRight
                          size={14}
                          className="ml-2 group-hover/btn:translate-x-1.5 transition-transform"
                        />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Dot Indicators */}
        <div className="flex justify-center gap-1.5 mt-4 lg:hidden">
          {programs.map((_, idx) => (
            <div key={idx} className="w-1.5 h-1.5 rounded-full bg-border" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProgramCards() {
  return (
    <section className="bg-background py-16 lg:py-24 overflow-hidden relative border-b border-border/30">
      <div className="mx-auto max-w-5xl px-6">
        {/* Section Global Info Block */}
        <div className="mb-16 text-center space-y-4">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">
            <BookOpen size={12} />
            Our Program Hub
          </div>
          <h2 className="font-serif text-3xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            Explore Your <span className="text-primary italic">Career</span> Hub
          </h2>
          <p className="mx-auto max-w-2xl text-sm md:text-base font-semibold text-muted-foreground">
            Classroom-based practical training at{" "}
            <span className="text-foreground">SkillYards, Agra</span>. Students
            work on live and practical projects to build real-world portfolios
            and gain hands-on expertise.
          </p>
        </div>

        {/* 1. On Job Degree (OJD) Section */}
        <ProgramSection
          badgeText="3-Year Pathway"
          title="On Job Degree (OJD)"
          desc="Designed for 12th-pass students who want a UGC-recognized degree pathway combined with intense, practical career-focused IT and business specializations."
          ctaText="Explore On Job Degree"
          ctaHref="/programs/on-job-degree"
          programs={ojdPrograms}
        />

        {/* 2. On Job Training (OJT) Section */}
        <ProgramSection
          badgeText="6-9 Months Track"
          title="On Job Training (OJT)"
          desc="Designed for graduates and college students who want fast-tracked, job-skill focused classroom training to launch or transition their career in technology or marketing."
          ctaText="Explore On Job Training"
          ctaHref="/programs/on-job-training"
          programs={ojtPrograms}
        />
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
