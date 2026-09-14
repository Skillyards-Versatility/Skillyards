"use client";

import { motion } from "framer-motion";
import { ArrowRight, GraduationCap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";

const trustItems = [
  "12th pass eligible",
  "Daily hands-on practical training",
  "Batch starts August 2026",
  "35 seats only",
];

export default function OnJobHero() {
  return (
    <section className="relative flex w-full flex-col items-center overflow-hidden bg-background py-16 md:py-24 border-b border-border">
      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 text-center">
        <div className="mb-6 flex justify-center">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Programs", href: "/programs" },
              { label: "On Job Degree", href: "/programs/on-job-degree" },
            ]}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary"
        >
          <GraduationCap size={13} />
          3-Year Degree Programs · Agra
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="font-serif text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl"
        >
          A Real Degree.
          <br />
          <span className="italic text-primary">
            Real Skills to Go With It.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          SkillYards&apos; On Job Degree programs are 3-year
          university-affiliated degrees (BCA or BBA) where students spend the
          majority of each day on hands-on practical training alongside academic
          theory. Unlike a regular college, you graduate with a degree and the
          actual skills employers ask for in interviews.
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
            className="w-full rounded-full bg-primary px-8 py-6 text-sm font-extrabold text-primary-foreground shadow-xl shadow-black/20 dark:shadow-primary/20 transition-all hover:scale-105 hover:bg-primary/90 sm:w-auto"
          >
            <Link href="#programs">
              View Programs <ArrowRight size={18} className="ml-2" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full rounded-full border-2 border-border bg-background px-8 py-6 text-sm font-bold text-foreground transition-all hover:scale-105 hover:bg-card sm:w-auto"
          >
            <Link href="/contact">Book Free Counselling</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground"
        >
          {trustItems.map((item, i) => (
            <span key={item} className="flex items-center gap-2">
              {i > 0 && (
                <span className="hidden h-1 w-1 rounded-full bg-border sm:block" />
              )}
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
