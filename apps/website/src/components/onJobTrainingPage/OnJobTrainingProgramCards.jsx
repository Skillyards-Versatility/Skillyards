"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Code2,
  Megaphone,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const programs = [
  {
    id: "fullstack",
    name: "Full-Stack Web Development OJT",
    icon: Code2,
    shortCopy:
      "Learn HTML, CSS, JavaScript, React, Node.js, MongoDB, Git/GitHub, deployment, APIs, and AI-assisted coding workflows through practical full-stack projects.",
    bestFor: [
      "Students interested in coding",
      "Websites and web apps",
      "React and Node.js",
      "Software/developer roles",
    ],
    duration: "6 Months",
    feeHook: "Starting from ₹5k/month",
    href: "/full-stack-web-development-training-in-agra",
    cta: "Explore Full-Stack OJT",
    accent:
      "bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-400",
  },
  {
    id: "digitalmarketing",
    name: "Digital Marketing OJT",
    icon: Megaphone,
    shortCopy:
      "Learn SEO, Google Ads, Meta Ads, content, analytics, reporting, social media marketing, and AI-assisted marketing workflows through mentor-guided projects.",
    bestFor: [
      "Marketing and business growth",
      "SEO and advertising",
      "Content and social media",
      "Freelancing and marketing careers",
    ],
    duration: "6 Months",
    feeHook: "Starting from ₹5.5k/month",
    href: "/digital-marketing-course-in-agra",
    cta: "Explore Digital Marketing OJT",
    accent:
      "bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-400",
  },
];

export default function OnJobTrainingProgramCards() {
  return (
    <section
      id="training-programs"
      className="w-full max-w-[100vw] overflow-hidden bg-background py-20"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8">
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary"
          >
            <BookOpen size={13} />
            Program Selection
          </motion.div>
          <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Choose the Right OJT Program for{" "}
            <span className="italic text-primary">Your Career Goals</span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {programs.map((prog, i) => {
            const Icon = prog.icon;

            return (
              <motion.div
                key={prog.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex h-full w-full min-w-0 flex-col rounded-3xl border border-border/60 bg-card p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <span
                      className={`mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${prog.accent}`}
                    >
                      <Icon size={14} />
                      OJT Program
                    </span>
                    <h3 className="font-serif text-2xl font-extrabold text-foreground leading-tight">
                      {prog.name}
                    </h3>
                  </div>
                </div>

                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  {prog.shortCopy}
                </p>

                <div className="mb-6">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Best for
                  </p>
                  <ul className="space-y-2">
                    {prog.bestFor.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-sm text-foreground"
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6 grid gap-3 rounded-2xl border border-border/50 bg-background p-4 text-sm">
                  <div className="flex items-center gap-2 text-foreground">
                    <Clock size={15} className="text-primary" />
                    <span>
                      <strong>Duration:</strong> {prog.duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <Wallet size={15} className="text-primary" />
                    <span>
                      <strong>Fee:</strong> {prog.feeHook}
                    </span>
                  </div>
                </div>

                <div className="mt-auto">
                  <Button
                    asChild
                    className="w-full h-12 rounded-full bg-primary text-primary-foreground font-extrabold text-sm transition-all hover:scale-[1.02] hover:bg-primary/90 shadow-lg"
                  >
                    <Link
                      href={prog.href}
                      className="flex items-center justify-center"
                    >
                      {prog.cta} <ArrowRight size={18} className="ml-2" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
