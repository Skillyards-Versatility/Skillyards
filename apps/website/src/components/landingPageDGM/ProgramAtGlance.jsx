"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Calendar,
  Clock,
  CreditCard,
  GraduationCap,
  IndianRupee,
  Monitor,
  Sparkles,
  Users,
} from "lucide-react";

const facts = [
  { icon: Clock, label: "Duration", value: "6 Months" },
  { icon: Monitor, label: "Mode", value: "Offline classroom training in Agra" },
  { icon: IndianRupee, label: "Fee", value: "Starting from ₹5.5k/month" },
  { icon: CreditCard, label: "Full Program Fee", value: "₹35,000" },
  { icon: Users, label: "Batch Size", value: "Max 20 students per batch" },
  {
    icon: GraduationCap,
    label: "Best For",
    value: "College students, graduates, and early-career learners",
  },
  {
    icon: Sparkles,
    label: "Also Suitable For",
    value:
      "12th-pass students, business owners, homemakers, and working professionals",
  },
  { icon: Briefcase, label: "Placement", value: "100% placement assistance" },
  {
    icon: Users,
    label: "Experience Needed",
    value: "No coding or prior marketing experience required",
  },
  {
    icon: Calendar,
    label: "Next Batch",
    value: "Next batch starting soon, contact us for the upcoming schedule",
  },
];

export function DGMProgramAtGlance() {
  const [showAll, setShowAll] = useState(false);

  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary sm:px-4 sm:text-xs sm:tracking-widest"
          >
            <Sparkles size={13} />
            Program at a Glance
          </motion.div>
          <h2 className="font-serif text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Digital Marketing OJT{" "}
            <span className="italic text-primary">
              for Agra learners who want practical skills.
            </span>
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
        >
          {facts.map((fact, i) => {
            const Icon = fact.icon;
            return (
              <motion.div
                key={fact.label}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className={`${!showAll && i >= 4 ? "hidden sm:flex" : "flex"} flex-col gap-2 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md sm:p-5`}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 sm:h-10 sm:w-10">
                  <Icon
                    size={16}
                    className="text-primary sm:h-[18px] sm:w-[18px]"
                  />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {fact.label}
                </p>
                <p className="text-sm font-semibold leading-snug text-foreground">
                  {fact.value}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {facts.length > 4 && (
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
      </div>
    </section>
  );
}
