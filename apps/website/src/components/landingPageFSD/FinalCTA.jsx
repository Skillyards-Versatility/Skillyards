"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { FSDPrimaryDemoCTA } from "./PrimaryDemoCTA";

export function FSDFinalCTA() {
  return (
    <section className="relative overflow-hidden bg-primary py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-3 flex flex-wrap items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-primary-foreground/60 sm:text-xs sm:tracking-widest"
        >
          <Calendar size={13} />
          Next batch starting soon,{" "}
          <span className="text-primary-foreground">
            contact us for the upcoming schedule
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-serif text-2xl font-extrabold leading-tight text-primary-foreground sm:text-4xl md:text-5xl"
        >
          Start Learning Full-Stack Web Development in Agra{" "}
          <span className="opacity-80">with SkillYards</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/75 sm:text-base"
        >
          Book a free demo class and see how SkillYards teaches full-stack
          development, MERN stack, GitHub, deployment, practical projects, and
          AI-assisted coding workflows through offline classroom training.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <FSDPrimaryDemoCTA
            desktopClassName="w-full rounded-full bg-primary-foreground px-8 py-6 text-sm font-extrabold text-primary shadow-xl transition-all hover:scale-105 hover:bg-primary-foreground/90 sm:w-auto"
            mobileClassName="w-full max-w-sm rounded-full bg-primary-foreground px-5 py-5 text-xs font-extrabold text-primary shadow-xl transition-all hover:bg-primary-foreground/90"
          />
        </motion.div>

        <p className="mt-5 text-sm font-semibold leading-relaxed text-primary-foreground/75">
          Next batch starting soon, contact us for the upcoming schedule.
        </p>
      </div>
    </section>
  );
}
