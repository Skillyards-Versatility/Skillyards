"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, ChevronDown } from "lucide-react";

const modules = [
  {
    module: "Module 1",
    title: "Digital Marketing Fundamentals",
    focus:
      "Understand channels, funnels, customer journeys, and how modern digital marketing works.",
    topics: [
      "Marketing basics and terminology",
      "Digital channels overview",
      "Customer journey and funnel thinking",
      "How businesses use digital marketing in Agra and beyond",
    ],
  },
  {
    module: "Module 2",
    title: "SEO Training",
    focus:
      "Learn how to improve search visibility with practical research, on-page work, and audit thinking.",
    topics: [
      "Keyword research",
      "On-page SEO",
      "SEO audits",
      "Search Console basics",
    ],
  },
  {
    module: "Module 3",
    title: "Google Ads Training",
    focus:
      "Plan and structure Google Ads campaigns with better messaging and reporting discipline.",
    topics: [
      "Campaign structure",
      "Keyword grouping",
      "Ad copy planning",
      "Landing page coordination",
    ],
  },
  {
    module: "Module 4",
    title: "Meta Ads Training",
    focus:
      "Build Meta Ads understanding around audiences, creative angles, and campaign messaging.",
    topics: [
      "Audience research",
      "Creative angles",
      "Campaign objectives",
      "Ad reporting basics",
    ],
  },
  {
    module: "Module 5",
    title: "Social Media Marketing",
    focus:
      "Plan social content with consistency, structure, and platform-specific thinking.",
    topics: [
      "Post planning",
      "Reel hooks",
      "Calendar creation",
      "Brand messaging",
    ],
  },
  {
    module: "Module 6",
    title: "Content & Copywriting",
    focus:
      "Write and organize content that supports SEO, ads, and social media campaigns.",
    topics: [
      "Blog and page outlines",
      "Caption and hook writing",
      "Ad copy drafts",
      "Content calendars",
    ],
  },
  {
    module: "Module 7",
    title: "Analytics & Reporting",
    focus:
      "Turn metrics into useful summaries, explanations, and reporting documents.",
    topics: [
      "Marketing metrics",
      "Report summaries",
      "Insight generation",
      "Performance explanation",
    ],
  },
  {
    module: "Module 8",
    title: "AI for Digital Marketing",
    focus:
      "Learn how to use AI tools responsibly for marketing research, content planning, campaign ideas, ad copy, SEO support, reporting, analytics interpretation, and productivity.",
    topics: [
      "AI-assisted research",
      "Content planning support",
      "Campaign ideation",
      "Reporting and productivity workflows",
    ],
  },
  {
    module: "Module 9",
    title: "Portfolio & Career Preparation",
    focus:
      "Prepare project documentation, case work, interview answers, and portfolio presentation.",
    topics: [
      "Case study formatting",
      "Resume and portfolio prep",
      "Interview preparation",
      "Career guidance",
    ],
  },
];

export function DGMCurriculum() {
  const [open, setOpen] = useState(0);

  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary sm:px-4 sm:text-xs sm:tracking-widest"
          >
            <BookOpen size={13} />
            What You Will Learn
          </motion.div>
          <h2 className="font-serif text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Nine core modules.{" "}
            <span className="italic text-primary">
              One practical digital marketing foundation.
            </span>
          </h2>
        </div>

        <div className="space-y-3">
          {modules.map((module, i) => {
            const isOpen = open === i;

            return (
              <motion.div
                key={module.title}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-2xl border transition-all duration-300 ${isOpen ? "border-primary/30 bg-card shadow-lg" : "border-border bg-card/50 hover:border-border/80"}`}
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-start justify-between gap-3 p-4 text-left sm:items-center sm:p-5"
                >
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {module.module}
                    </span>
                    <h3
                      className={`font-bold text-sm leading-snug transition-colors sm:text-base ${isOpen ? "text-primary" : "text-foreground"}`}
                    >
                      {module.title}
                    </h3>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="border-t border-border px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
                        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                          {module.focus}
                        </p>
                        <ul className="grid gap-2 sm:grid-cols-2">
                          {module.topics.map((topic) => (
                            <li
                              key={topic}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
