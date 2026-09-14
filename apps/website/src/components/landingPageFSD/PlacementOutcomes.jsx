"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  FileText,
  Github,
  Linkedin,
  MessageSquare,
  SearchCheck,
  Send,
  UserRoundSearch,
} from "lucide-react";

const supportItems = [
  {
    title: "Resume building",
    icon: FileText,
  },
  {
    title: "GitHub/profile review",
    icon: Github,
  },
  {
    title: "Portfolio review",
    icon: UserRoundSearch,
  },
  {
    title: "Mock interviews",
    icon: MessageSquare,
  },
  {
    title: "LinkedIn support",
    icon: Linkedin,
  },
  {
    title: "Interview preparation",
    icon: SearchCheck,
  },
  {
    title: "Career counselling",
    icon: Briefcase,
  },
  {
    title: "Relevant opportunity referrals where available",
    icon: Send,
  },
];

export function FSDPlacementOutcomes() {
  const [showAll, setShowAll] = useState(false);

  return (
    <section className="bg-card/20 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary"
          >
            <Briefcase size={13} />
            Placement Assistance
          </motion.div>
          <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Placement Assistance After{" "}
            <span className="italic text-primary">Full-Stack Training</span>
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            SkillYards provides placement assistance to help students prepare
            for web development opportunities.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {supportItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`${!showAll && i >= 4 ? "hidden sm:flex" : "flex"} flex-col rounded-3xl border border-border bg-card p-5 shadow-sm`}
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                  <Icon size={18} className="text-primary" />
                </div>
                <h3 className="font-serif text-lg font-extrabold text-foreground">
                  {item.title}
                </h3>
              </motion.div>
            );
          })}
        </div>

        {supportItems.length > 4 && (
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
