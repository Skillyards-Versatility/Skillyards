"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { FSDPrimaryDemoCTA } from "./PrimaryDemoCTA";

export function FSDHero() {
  return (
    <section className="relative w-full overflow-hidden bg-background pb-16 pt-24 md:py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-secondary/10 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6">
        <div className="mb-5 flex justify-center">
          <Breadcrumbs currentLabel="Full-Stack Web Development" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary sm:px-4 sm:text-xs sm:tracking-widest"
        >
          <Star size={12} className="fill-current text-secondary" />
          6-Month AI-Integrated Full-Stack Web Development Course
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-serif text-3xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Learn Full-Stack Web Development in Agra and Build{" "}
          <span className="italic text-primary">Job-Ready Projects</span> in 6
          Months
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-lg"
        >
          Learn HTML, CSS, JavaScript, React, Node.js, Express, MongoDB,
          Git/GitHub, deployment, and AI-assisted coding workflows through
          mentor-guided practical projects at SkillYards.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <FSDPrimaryDemoCTA
            desktopClassName="w-full rounded-full bg-primary px-8 py-6 text-sm font-extrabold text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:scale-105 hover:bg-primary/90 sm:w-auto"
            mobileClassName="w-full max-w-sm rounded-full bg-primary px-5 py-5 text-xs font-extrabold text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:bg-primary/90"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mx-auto mt-6 max-w-3xl text-sm font-semibold leading-relaxed text-foreground/80"
        >
          Offline training in Agra • AI-integrated curriculum • Max 20 students
          per batch • Starting from ₹5k/month
        </motion.p>
      </div>
    </section>
  );
}
