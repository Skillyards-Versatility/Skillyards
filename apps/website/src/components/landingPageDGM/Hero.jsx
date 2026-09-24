"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { DGMPrimaryDemoCTA } from "./PrimaryDemoCTA";

export function DGMHero() {
  return (
    <section className="relative w-full overflow-hidden bg-background pt-22 pb-14 md:py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-secondary/10 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6">
        <div className="mb-4 flex justify-center">
          <Breadcrumbs currentLabel="Digital Marketing" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary sm:px-4 sm:text-xs sm:tracking-widest"
        >
          <Star size={12} className="fill-current shrink-0 text-secondary" />
          <span className="text-center leading-tight">
            6-Month AI-Integrated Digital Marketing Course in Agra
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-serif text-3xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Best AI-Integrated Digital Marketing Course in Agra{" "}
          <span className="italic text-primary">with Practical Training</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-5 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-lg"
        >
          Learn SEO, Google Ads, Meta Ads, social media marketing, content,
          analytics, and reporting with practical AI tools used by modern
          marketers. At SkillYards, students work on mentor-guided projects,
          campaign planning, SEO audits, reporting exercises, and
          portfolio-ready case work.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <DGMPrimaryDemoCTA
            desktopClassName="w-full rounded-full bg-primary px-8 py-6 text-sm font-extrabold text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:scale-105 hover:bg-primary/90 sm:w-auto"
            mobileClassName="w-full max-w-sm rounded-full bg-primary px-5 py-5 text-xs font-extrabold text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:bg-primary/90"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mx-auto mt-6 max-w-3xl rounded-3xl border border-border/60 bg-card/60 p-4 shadow-sm sm:p-5"
        >
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-foreground sm:text-sm">
            <span>Offline training in Agra</span>
            <span className="text-primary">•</span>
            <span>AI-integrated curriculum</span>
            <span className="text-primary">•</span>
            <span>Max 20 students per batch</span>
            <span className="text-primary">•</span>
            <span>Starting from ₹5.5k/month</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
