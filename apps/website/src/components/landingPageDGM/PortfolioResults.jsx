"use client";

import { motion } from "framer-motion";
import { FolderOpen, TrendingUp } from "lucide-react";

const examples = [
  {
    type: "SEO Audit Report",
    detail:
      "Website issues, keywords, content gaps, and improvement areas explained in a practical audit format.",
    metrics: [
      "Technical issues checklist",
      "Keyword opportunities",
      "Content gap notes",
    ],
    color: "border-blue-400/30 bg-blue-50/50 dark:bg-blue-950/10",
    dot: "bg-blue-500",
  },
  {
    type: "Google Ads Plan",
    detail:
      "Campaign structure, ad groups, keyword themes, budget thinking, and ad messaging prepared as project-learning work.",
    metrics: ["Budget planning", "Ad group structure", "Keyword grouping"],
    color: "border-orange-400/30 bg-orange-50/50 dark:bg-orange-950/10",
    dot: "bg-orange-500",
  },
  {
    type: "Meta Ads Plan",
    detail:
      "Audience ideas, creative angles, campaign objectives, and reporting points documented as a portfolio-ready exercise.",
    metrics: ["Audience ideas", "Creative angles", "Reporting structure"],
    color: "border-pink-400/30 bg-pink-50/50 dark:bg-pink-950/10",
    dot: "bg-pink-500",
  },
  {
    type: "Local SEO + Reporting Case Work",
    detail:
      "Local visibility ideas for Agra-based businesses, social media calendar planning, and marketing report summaries presented as sample case work.",
    metrics: ["Local SEO plan", "Content calendar", "Performance summary"],
    color: "border-green-400/30 bg-green-50/50 dark:bg-green-950/10",
    dot: "bg-green-500",
  },
];

export function DGMPortfolioResults() {
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
            <FolderOpen size={13} />
            Portfolio Case Work
          </motion.div>
          <h2 className="font-serif text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Build Portfolio-Ready{" "}
            <span className="italic text-primary">
              Digital Marketing Case Work
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm text-muted-foreground sm:text-base">
            By the end of the course, students learn how to create and present
            practical marketing work that can be shown during interviews,
            counselling sessions, freelance discussions, or career
            conversations.
          </p>
          <p className="mx-auto mt-3 max-w-3xl text-sm text-muted-foreground">
            These are sample and project-learning examples, not hard promises of
            live campaign outcomes.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {examples.map((example, i) => (
            <motion.div
              key={example.type}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-3xl border p-5 shadow-sm transition-all hover:shadow-md sm:p-6 ${example.color}`}
            >
              <div className="mb-3 flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${example.dot}`} />
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground sm:text-xs">
                  {example.type}
                </span>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                {example.detail}
              </p>
              <div className="flex flex-wrap gap-2">
                {example.metrics.map((metric) => (
                  <span
                    key={metric}
                    className="flex items-center gap-1 rounded-full bg-background/70 px-3 py-1 text-xs font-semibold text-foreground"
                  >
                    <TrendingUp size={11} className="text-primary" /> {metric}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
