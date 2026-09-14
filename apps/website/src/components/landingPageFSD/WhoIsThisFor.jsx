"use client";

import { motion } from "framer-motion";
import { CheckCircle, XCircle, Target } from "lucide-react";

const forList = [
  {
    label: "College students and graduates",
    sub: "Learners who want structured coding practice and portfolio-building support",
  },
  {
    label: "Early-career learners",
    sub: "Students who want to move from basics into full-stack project work",
  },
  {
    label: "Serious 12th-pass students",
    sub: "Learners ready to start from basics and commit to practical coding",
  },
  {
    label: "Working professionals and career switchers",
    sub: "People who want mentor support while transitioning toward web development",
  },
];

const notForList = [
  {
    label:
      "Someone looking for a quick certificate without practical coding work",
  },
  { label: "Someone who wants a fully online or fully self-paced course" },
  { label: "Someone unwilling to practice outside class" },
  {
    label:
      "Someone who wants shortcuts instead of fundamentals, projects, and debugging practice",
  },
];

export function FSDWhoIsThisFor() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary"
          >
            <Target size={13} />
            Is This For You?
          </motion.div>
          <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Honest About{" "}
            <span className="italic text-primary">Who We Can Help.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            A practical fit for learners who want structured classroom training
            and projects.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* For */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-green-300/40 bg-green-50/50 p-6 dark:border-green-800/30 dark:bg-green-950/10"
          >
            <h3 className="mb-4 flex items-center gap-2 font-serif text-xl font-extrabold text-green-700 dark:text-green-400">
              <CheckCircle size={20} /> This is for you if...
            </h3>
            <ul className="space-y-4">
              {forList.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <CheckCircle
                    size={16}
                    className="mt-0.5 shrink-0 text-green-500"
                  />
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.sub}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Not for */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-red-300/40 bg-red-50/50 p-6 dark:border-red-800/30 dark:bg-red-950/10"
          >
            <h3 className="mb-4 flex items-center gap-2 font-serif text-xl font-extrabold text-red-600 dark:text-red-400">
              <XCircle size={20} /> This is NOT for you if...
            </h3>
            <ul className="space-y-3">
              {notForList.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <XCircle size={16} className="mt-0.5 shrink-0 text-red-400" />
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </li>
              ))}
            </ul>
            <p className="mt-5 rounded-xl bg-background/60 p-3 text-xs text-muted-foreground">
              If you want a degree alongside practical skills,{" "}
              <a
                href="/bca-training-program-in-agra"
                className="font-bold text-primary underline underline-offset-4"
              >
                the BCA program
              </a>{" "}
              may be a better fit.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
