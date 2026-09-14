"use client";

import { motion } from "framer-motion";
import { CheckCircle, Target, XCircle } from "lucide-react";

const forList = [
  {
    label: "College students, graduates, and early-career learners",
    sub: "Best fit for students who want a structured start in digital marketing.",
  },
  {
    label: "12th-pass students",
    sub: "Can join if they want practical digital skills without coding.",
  },
  {
    label: "Business owners and family-business learners",
    sub: "Useful for improving local visibility, content planning, and campaign thinking.",
  },
  {
    label: "Homemakers and career returners",
    sub: "Good for learners who want guidance, confidence, and portfolio-ready case work.",
  },
  {
    label: "Working professionals",
    sub: "Helpful for people adding SEO, ads, reporting, or social media skills to current work.",
  },
];

const notForList = [
  {
    label:
      "Someone who wants only shortcuts without learning marketing fundamentals",
  },
  {
    label:
      "Someone unwilling to practice project work, reporting, and portfolio presentation",
  },
  {
    label:
      "Someone looking for a fully online or completely self-paced course without classroom participation",
  },
];

export function DGMWhoIsThisFor() {
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
            <Target size={13} />
            Who Can Join
          </motion.div>
          <h2 className="font-serif text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Built for many backgrounds,{" "}
            <span className="italic text-primary">
              best for serious learners.
            </span>
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-green-300/40 bg-green-50/50 p-5 dark:border-green-800/30 dark:bg-green-950/10 sm:p-6"
          >
            <h3 className="mb-4 flex items-center gap-2 font-serif text-lg font-extrabold text-green-700 dark:text-green-400 sm:text-xl">
              <CheckCircle size={20} /> This is for you if...
            </h3>
            <ul className="space-y-4">
              {forList.map((item) => (
                <li key={item.label} className="flex gap-3">
                  <CheckCircle
                    size={16}
                    className="mt-0.5 shrink-0 text-green-500"
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.sub}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-red-300/40 bg-red-50/50 p-5 dark:border-red-800/30 dark:bg-red-950/10 sm:p-6"
          >
            <h3 className="mb-4 flex items-center gap-2 font-serif text-lg font-extrabold text-red-600 dark:text-red-400 sm:text-xl">
              <XCircle size={20} /> This is NOT for you if...
            </h3>
            <ul className="space-y-3">
              {notForList.map((item) => (
                <li key={item.label} className="flex gap-3">
                  <XCircle size={16} className="mt-0.5 shrink-0 text-red-400" />
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
