"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Quote, TrendingUp } from "lucide-react";

const supportItems = [
  "Resume building",
  "Portfolio review",
  "Mock interviews",
  "LinkedIn/profile support",
  "Interview preparation",
  "Career counselling",
  "Relevant opportunity referrals where available",
];

const outcomes = [
  {
    name: "Practical preparation",
    quote:
      "Students get help in turning project work into something they can explain confidently during interviews and career discussions.",
  },
  {
    name: "Interview readiness",
    quote:
      "Mentor feedback, mock interviews, and portfolio review help students become more presentable and more confident.",
  },
  {
    name: "Opportunity support",
    quote:
      "Placement assistance means guidance and relevant opportunity referrals where available.",
  },
];

export function DGMPlacementOutcomes() {
  const [showAllSupport, setShowAllSupport] = useState(false);

  return (
    <section className="bg-card/20 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-10 text-center sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary sm:px-4 sm:text-xs sm:tracking-widest"
          >
            <TrendingUp size={13} />
            Placement Assistance
          </motion.div>
          <h2 className="font-serif text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Placement Assistance After{" "}
            <span className="italic text-primary">
              Digital Marketing Training
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm text-muted-foreground sm:text-base">
            SkillYards provides placement assistance to help students prepare
            for digital marketing opportunities. It means we help students
            become more prepared, presentable, and confident for interviews and
            opportunities.
          </p>
        </div>

        <div className="mb-10 grid gap-4 rounded-3xl border border-border bg-card p-4 shadow-sm sm:grid-cols-2 sm:p-6 lg:grid-cols-4 lg:gap-5">
          {supportItems.map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className={`${!showAllSupport && i >= 4 ? "hidden sm:flex" : "flex"} items-center gap-3 rounded-2xl bg-secondary/10 p-4`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Briefcase size={16} className="text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground">{item}</p>
            </motion.div>
          ))}
        </div>

        {supportItems.length > 4 && (
          <div className="mb-10 flex justify-center sm:hidden">
            <button
              type="button"
              onClick={() => setShowAllSupport((value) => !value)}
              className="rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-primary"
            >
              {showAllSupport ? "Show less" : "Show more"}
            </button>
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-3">
          {outcomes.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col rounded-3xl border border-border bg-card p-5 shadow-sm"
            >
              <Quote size={24} className="mb-3 text-primary/20" />
              <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                {item.quote}
              </p>
              <p className="text-sm font-bold text-foreground">{item.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
