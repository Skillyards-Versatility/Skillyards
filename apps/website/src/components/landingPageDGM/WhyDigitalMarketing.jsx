"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Lightbulb,
  LineChart,
  Megaphone,
  Search,
  Sparkles,
  Users,
} from "lucide-react";

const aiUses = [
  {
    icon: Search,
    title: "SEO",
    items: [
      "Keyword ideas",
      "Content briefs",
      "Meta titles",
      "Topic clusters",
      "SEO audit support",
    ],
  },
  {
    icon: FileText,
    title: "Content Marketing",
    items: [
      "Blog outlines",
      "Captions",
      "Hooks",
      "Ad copy drafts",
      "Content calendars",
    ],
  },
  {
    icon: Megaphone,
    title: "Google Ads",
    items: [
      "Ad copy variations",
      "Keyword grouping",
      "Landing page suggestions",
    ],
  },
  {
    icon: Users,
    title: "Meta Ads",
    items: ["Audience ideas", "Creative angles", "Campaign messaging"],
  },
  {
    icon: Lightbulb,
    title: "Social Media",
    items: [
      "Post ideas",
      "Reel hooks",
      "Calendar planning",
      "Caption improvement",
    ],
  },
  {
    icon: LineChart,
    title: "Analytics & Portfolio",
    items: [
      "Report summaries",
      "Insight generation",
      "Performance explanation",
      "Case study formatting",
      "Presentation support",
    ],
  },
];

export function DGMWhyDigitalMarketing() {
  const [showAll, setShowAll] = useState(false);

  return (
    <section className="bg-card/20 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary sm:px-4 sm:text-xs sm:tracking-widest"
          >
            Learn with AI
          </motion.div>
          <h2 className="font-serif text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Learn Digital Marketing the Modern Way{" "}
            <span className="text-primary">With AI</span>
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm text-muted-foreground sm:text-base">
            Digital marketing is changing fast. Today, marketers use AI to
            research faster, write better drafts, plan campaigns, understand
            data, and create sharper reports.
          </p>
          <p className="mx-auto mt-3 max-w-3xl text-sm text-muted-foreground sm:text-base">
            SkillYards&apos; Digital Marketing OJT includes practical AI usage
            across key marketing tasks, so students do not just learn old-school
            digital marketing, they learn how modern marketers actually work.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {aiUses.map((useCase, i) => {
            const Icon = useCase.icon;
            return (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className={`${!showAll && i >= 4 ? "hidden sm:block" : "block"} rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-5`}
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 sm:h-11 sm:w-11">
                  <Icon size={18} className="text-primary sm:h-5 sm:w-5" />
                </div>
                <h3 className="mb-3 font-serif text-lg font-extrabold text-foreground sm:text-xl">
                  {useCase.title}
                </h3>
                <ul className="space-y-2">
                  {useCase.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {aiUses.length > 4 && (
          <div className="mt-5 flex justify-center sm:hidden">
            <button
              type="button"
              onClick={() => setShowAll((value) => !value)}
              className="rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-primary"
            >
              {showAll ? "Show less" : "Show more"}
            </button>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-8 max-w-3xl rounded-3xl border border-primary/15 bg-primary/5 p-4 text-center sm:p-5"
        >
          <p className="text-sm font-semibold text-foreground">
            AI is taught as a marketing assistant, not as a replacement for
            fundamentals, strategy, creativity, or human judgement.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
