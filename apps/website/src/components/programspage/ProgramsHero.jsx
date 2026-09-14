"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, HelpCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProgramsHero() {
  const handleScrollToComparison = (e) => {
    e.preventDefault();
    const element = document.getElementById("ojd-vs-ojt");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="relative flex w-full items-center overflow-hidden bg-background min-h-[85vh] md:min-h-[70vh] desk:min-h-[80vh] py-24 md:py-28 border-b border-border/50">
      {/* Background Patterns & Glows */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Checkered Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />

        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-secondary/10 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary backdrop-blur-xs dark:backdrop-blur-none"
        >
          <Sparkles size={12} className="text-secondary animate-pulse" />
          Practical IT Training in Agra
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="font-serif text-4xl font-extrabold leading-[1.15] tracking-tight text-foreground sm:text-5xl md:text-6xl desk:text-7xl"
        >
          Confused After 12th or Graduation?{" "}
          <span className="block mt-2 italic text-primary font-serif">
            Find the Right Career Path.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg font-medium"
        >
          Discover SkillYards&apos; On Job Degree and On Job Training programs
          in Agra. We blend university degrees with practical skills and 100%
          placement assistance to set you up for career success.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button
            size="lg"
            onClick={handleScrollToComparison}
            className="w-full rounded-full bg-primary px-8 py-6 text-xs font-black uppercase tracking-widest text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:scale-105 hover:bg-primary/90 sm:w-auto cursor-pointer"
          >
            Find the Right Program{" "}
            <ArrowRight size={16} className="ml-2 animate-bounce-horizontal" />
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full rounded-full border-2 border-border bg-foreground/5 px-8 py-6 text-xs font-bold uppercase tracking-widest text-foreground transition-all hover:scale-105 hover:bg-foreground/10 sm:w-auto"
          >
            <Link href="/contact">
              <HelpCircle size={16} className="mr-2" /> Book Free Career
              Counselling
            </Link>
          </Button>
        </motion.div>

        {/* Short Trust Line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-xs font-bold tracking-wide text-muted-foreground/80 flex items-center justify-center flex-wrap gap-2 md:gap-3"
        >
          <span>UGC-recognized degree pathway</span>
          <span className="text-primary/40">•</span>
          <span>Practical training</span>
          <span className="text-primary/40">•</span>
          <span>100% placement assistance</span>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes bounce-horizontal {
          0%,
          100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(4px);
          }
        }
        .animate-bounce-horizontal {
          animation: bounce-horizontal 1s infinite;
        }
      `}</style>
    </section>
  );
}
