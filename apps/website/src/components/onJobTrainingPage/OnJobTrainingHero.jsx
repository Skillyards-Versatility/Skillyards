"use client";

import { motion } from "framer-motion";
import { ArrowRight, BriefcaseBusiness } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import OJTPrimaryCTA from "./OJTPrimaryCTA";

export default function OnJobTrainingHero() {
  return (
    <section className="relative w-full overflow-hidden bg-background py-20 md:py-24 lg:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[320px] w-[320px] rounded-full bg-secondary/10 blur-[90px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary"
        >
          <BriefcaseBusiness size={13} className="text-secondary" />
          AI-Integrated On-Job Training Programs
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="font-serif text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl"
        >
          Learn Job-Ready Skills Through{" "}
          <span className="italic text-primary">
            AI-Integrated On-Job Training
          </span>{" "}
          in Agra
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-lg"
        >
          SkillYards OJT programs combine practical classroom learning,
          mentor-guided projects, portfolio building, and AI-assisted workflows
          to help students build real-world skills in Full-Stack Web Development
          and Digital Marketing.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button
            asChild
            size="lg"
            className="w-full rounded-full bg-primary px-8 py-6 text-sm font-extrabold text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:scale-105 hover:bg-primary/90 sm:w-auto"
          >
            <Link href="#training-programs">
              Find the Right OJT Course{" "}
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </Button>

          <OJTPrimaryCTA
            desktopClassName="w-full rounded-full border-2 border-border bg-background px-8 py-6 text-sm font-bold text-foreground transition-all hover:scale-105 hover:bg-card sm:w-auto"
            mobileClassName="w-full rounded-full border-2 border-border bg-background px-8 py-6 text-sm font-bold text-foreground transition-all hover:bg-card sm:w-auto"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mx-auto mt-6 max-w-3xl text-sm font-semibold leading-relaxed text-foreground/80"
        >
          Offline training • AI-integrated learning • Practical projects •
          Placement assistance
        </motion.p>
      </div>
    </section>
  );
}
