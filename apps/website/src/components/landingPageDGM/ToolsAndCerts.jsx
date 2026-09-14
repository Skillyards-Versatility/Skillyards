"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Wrench } from "lucide-react";

const toolCategories = [
  {
    category: "SEO & Research",
    color: "border-blue-400/30 bg-blue-50/50 dark:bg-blue-950/10",
    dot: "bg-blue-500",
    tools: [
      "Google Search Console",
      "Google Analytics",
      "Keyword research workflows",
      "SEO audit support",
      "Topic mapping",
    ],
  },
  {
    category: "Ads & Campaign Planning",
    color: "border-orange-400/30 bg-orange-50/50 dark:bg-orange-950/10",
    dot: "bg-orange-500",
    tools: [
      "Google Ads planning",
      "Meta Ads structure",
      "Keyword grouping",
      "Ad messaging drafts",
      "Landing page coordination",
    ],
  },
  {
    category: "Content & Social",
    color: "border-pink-400/30 bg-pink-50/50 dark:bg-pink-950/10",
    dot: "bg-pink-500",
    tools: [
      "Blog outlines",
      "Caption planning",
      "Content calendars",
      "Reel hooks",
      "Creative angle ideas",
    ],
  },
  {
    category: "Reporting & Analysis",
    color: "border-green-400/30 bg-green-50/50 dark:bg-green-950/10",
    dot: "bg-green-500",
    tools: [
      "Report summaries",
      "Performance explanation",
      "Insight generation",
      "Campaign documentation",
      "Presentation support",
    ],
  },
];

const notePoints = [
  "SEO, Google Ads, Meta Ads, social media, content, analytics, and reporting are taught together as a practical skill set.",
  "AI is integrated into workflow support, not sold as a shortcut around marketing basics.",
  "Students learn how to plan, explain, and present marketing work clearly for interviews and opportunities.",
];

export function DGMToolsAndCerts() {
  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary sm:px-4 sm:text-xs sm:tracking-widest"
          >
            <Wrench size={13} />
            Tools & Workflow Exposure
          </motion.div>
          <h2 className="font-serif text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Learn tools, structure, and reporting{" "}
            <span className="italic text-primary">
              used by modern marketers.
            </span>
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {toolCategories.map((cat, i) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-2xl border p-4 sm:p-5 ${cat.color}`}
            >
              <div className="mb-3 flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${cat.dot}`} />
                <h3 className="text-sm font-bold text-foreground sm:text-base">
                  {cat.category}
                </h3>
              </div>
              <ul className="space-y-1.5">
                {cat.tools.map((tool) => (
                  <li
                    key={tool}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <span className="h-1 w-1 shrink-0 rounded-full bg-foreground/30" />
                    {tool}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6"
        >
          <div className="mb-4 flex items-center gap-2 text-primary">
            <BadgeCheck size={16} />
            <p className="text-sm font-bold uppercase tracking-widest">
              How SkillYards teaches this
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {notePoints.map((point) => (
              <p
                key={point}
                className="rounded-2xl bg-secondary/10 p-4 text-sm leading-relaxed text-muted-foreground"
              >
                {point}
              </p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
