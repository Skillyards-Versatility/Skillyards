"use client";

import { useState } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { BookOpen, CheckCircle2, Sparkles } from "lucide-react";

const programs = [
  {
    id: "bca",
    name: "BCA",
    theme: "primary",
    badgeBg: "bg-primary",
    badgeText: "text-primary-foreground",
    glowColor: "bg-primary/10",
    topics: [
      {
        phase: "Year 1",
        title: "Foundations",
        subjects: [
          "Programming Fundamentals (C/C++)",
          "Mathematics for Computing",
          "Web Design Basics",
          "Database Concepts",
          "IT Essentials",
        ],
      },
      {
        phase: "Year 2",
        title: "Core CS",
        subjects: [
          "Data Structures & Algorithms",
          "Java Programming",
          "Operating Systems",
          "Computer Networks",
          "Python for Development",
        ],
      },
      {
        phase: "Year 3",
        title: "Specialization",
        subjects: [
          "Full-Stack Web Development",
          "Cloud Computing & DevOps",
          "Software Engineering",
          "AI/ML Introduction",
          "Capstone Project + OJT",
        ],
      },
    ],
  },
  {
    id: "bba",
    name: "BBA",
    theme: "rose",
    badgeBg: "bg-rose-600",
    badgeText: "text-white",
    glowColor: "bg-rose-500/10",
    topics: [
      {
        phase: "Year 1",
        title: "Essentials",
        subjects: [
          "Business Communication",
          "Principles of Management",
          "Financial Accounting",
          "Marketing Fundamentals",
          "Digital Tools",
        ],
      },
      {
        phase: "Year 2",
        title: "Strategy",
        subjects: [
          "Digital Marketing Strategy",
          "Business Analytics",
          "Human Resource Management",
          "Consumer Behaviour",
          "E-Commerce",
        ],
      },
      {
        phase: "Year 3",
        title: "Leadership",
        subjects: [
          "Advanced SEO & SEM",
          "Social Media Advertising",
          "Startup & Entrepreneurship",
          "Brand Management",
          "Internship",
        ],
      },
    ],
  },
  {
    id: "fullstack",
    name: "Full-Stack",
    theme: "cyan",
    badgeBg: "bg-cyan-500",
    badgeText: "text-slate-900",
    glowColor: "bg-cyan-400/10",
    topics: [
      {
        phase: "Month 1–2",
        title: "Frontend",
        subjects: [
          "HTML5, CSS3 & Responsive Design",
          "JavaScript ES6+ Fundamentals",
          "Git & Version Control",
          "Figma to Code Workflow",
        ],
      },
      {
        phase: "Month 3–4",
        subjects: [
          "React.js (Hooks, Context, Router)",
          "Next.js & SSR/SSG",
          "Node.js & Express REST APIs",
          "MongoDB & Mongoose",
        ],
        title: "Backend",
      },
      {
        phase: "Month 5–6",
        subjects: [
          "Authentication & Security (JWT)",
          "SQL & Relational DBs",
          "Deployment (Vercel, AWS)",
          "Portfolio + Mock Interviews",
        ],
        title: "Production",
      },
    ],
  },
  {
    id: "digitalmarketing",
    name: "Digital Marketing",
    theme: "amber",
    badgeBg: "bg-amber-400",
    badgeText: "text-slate-900",
    glowColor: "bg-amber-400/10",
    topics: [
      {
        phase: "Month 1-2",
        title: "Foundations",
        subjects: [
          "Digital Marketing Fundamentals",
          "SEO & Keyword Research",
          "Content Strategy",
          "Analytics Basics",
        ],
      },
      {
        phase: "Month 3-4",
        title: "Campaigns",
        subjects: [
          "Google Ads Planning",
          "Meta Ads Strategy",
          "Social Media Marketing",
          "Reporting Workflows",
        ],
      },
      {
        phase: "Month 5-6",
        title: "AI + Portfolio",
        subjects: [
          "AI for Marketing Tasks",
          "Portfolio Case Work",
          "Local SEO Planning",
          "Career Preparation",
        ],
      },
    ],
  },
];

export default function CurriculumHighlights() {
  const [active, setActive] = useState("bca");
  const current = programs.find((p) => p.id === active);

  return (
    <section className="bg-background py-20 lg:py-24 overflow-hidden relative">
      <LazyMotion features={domAnimation} strict>
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <m.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary"
            >
              <BookOpen size={12} />
              Curriculum Roadmap
            </m.div>
            <h2 className="font-serif text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
              Industry-Aligned.{" "}
              <span className="text-primary italic">No Outdated Syllabus.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm lg:text-base text-muted-foreground font-medium leading-relaxed">
              Every topic is meticulously mapped to real-world job requirements,
              ensuring you learn what the industry actually demands.
            </p>
          </div>

          {/* Premium Tab Switcher */}
          <div className="mb-12 flex flex-wrap justify-center gap-3">
            {programs.map((p) => (
              <button
                key={p.id}
                onClick={() => setActive(p.id)}
                className="relative group"
              >
                <div
                  className={`relative z-10 rounded-xl px-6 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all duration-300 border ${
                    active === p.id
                      ? `${p.badgeBg} ${p.badgeText} border-transparent shadow-lg shadow-primary/20 scale-105`
                      : "bg-white dark:bg-[#0d0d12] border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                  }`}
                >
                  {p.name}
                </div>
                {active === p.id && (
                  <m.div
                    layoutId="tab-highlight"
                    className="absolute inset-0 z-0 bg-primary/5 blur-xl rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Animated Content Grid */}
          <AnimatePresence mode="wait">
            <m.div
              key={active}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="grid gap-6 lg:grid-cols-3"
            >
              {current.topics.map((block, i) => (
                <div
                  key={i}
                  className="group relative flex flex-col rounded-[2rem] border border-border/50 bg-white dark:bg-[#0d0d12] dark:border-white/5 p-8 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 h-full"
                >
                  {/* Subtle Glow */}
                  <div
                    className={`absolute -top-10 -right-10 w-32 h-32 blur-[60px] opacity-0 dark:group-hover:opacity-40 rounded-full transition-opacity duration-500 ${current.glowColor}`}
                  />

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                      <div
                        className={`inline-block px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${current.badgeBg} ${current.badgeText}`}
                      >
                        {block.phase}
                      </div>
                      <Sparkles
                        size={14}
                        className="text-muted-foreground/30"
                      />
                    </div>

                    <h4 className="font-serif text-xl font-bold text-foreground mb-4">
                      {block.title}
                    </h4>

                    <ul className="space-y-4 mb-8">
                      {block.subjects.map((s) => (
                        <li key={s} className="flex items-start gap-3">
                          <CheckCircle2
                            size={14}
                            className={`mt-0.5 shrink-0 text-primary opacity-60`}
                          />
                          <span className="text-[13px] font-medium text-muted-foreground leading-snug group-hover:text-foreground transition-colors">
                            {s}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-4 border-t border-border/40">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                        Industry Certified
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </m.div>
          </AnimatePresence>
        </div>
      </LazyMotion>

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
