"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  Bug,
  ClipboardList,
  FileText,
  Sparkles,
  TestTube2,
} from "lucide-react";

const points = [
  {
    icon: Bot,
    title: "Code Explanation",
    desc: "Understand unfamiliar code, syntax, and concepts faster while still learning how the logic works.",
  },
  {
    icon: Bug,
    title: "Debugging Support",
    desc: "Use AI to identify errors, read stack traces, test fixes, and understand why issues happen.",
  },
  {
    icon: ClipboardList,
    title: "Project Planning",
    desc: "Break features into smaller development tasks before you start building full-stack applications.",
  },
  {
    icon: FileText,
    title: "Documentation",
    desc: "Write README files, comments, and project notes that make your code easier to present and maintain.",
  },
  {
    icon: TestTube2,
    title: "Test-Case Thinking",
    desc: "Generate edge cases and testing ideas to improve how you think about bugs and stability.",
  },
  {
    icon: Sparkles,
    title: "Productivity",
    desc: "Improve your workflow while still writing, reviewing, and understanding your own code.",
  },
];

export function FSDOJTExplained() {
  const [showAll, setShowAll] = useState(false);

  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary"
          >
            AI-Integrated Learning
          </motion.div>
          <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Learn Full-Stack Development the Modern Way,{" "}
            <span className="italic text-primary">With AI</span>
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Modern developers use AI to understand errors faster, debug smarter,
            write documentation, plan features, and improve productivity. At
            SkillYards, AI is taught as a coding assistant, not as a replacement
            for fundamentals, logic, or hands-on coding.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {points.map((point, i) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`${!showAll && i >= 4 ? "hidden sm:flex lg:flex" : "flex"} flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                  <Icon size={18} className="text-primary" />
                </div>
                <div>
                  <h3 className="mb-2 font-serif text-lg font-extrabold text-foreground">
                    {point.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {point.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {points.length > 4 && (
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

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-8 max-w-3xl rounded-2xl border border-primary/10 bg-primary/5 px-5 py-4 text-center text-sm leading-relaxed text-muted-foreground"
        >
          AI is taught as a coding assistant, not as a replacement for
          fundamentals, logic, or hands-on coding.
        </motion.p>
      </div>
    </section>
  );
}
