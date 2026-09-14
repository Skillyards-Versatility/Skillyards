"use client";

import { AlertTriangle, GraduationCap, Briefcase, Zap } from "lucide-react";

export default function ProblemSection() {
  return (
    <section className="relative py-16 md:py-20 overflow-hidden bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row gap-10 md:gap-16 items-center">
        {/* Left Side: The Headline */}
        <div className="flex-1 space-y-6 w-full">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive border border-destructive/20 text-sm font-semibold tracking-wide shadow-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>The Reality Check</span>
          </div>

          <h2 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.1]">
            Degree Alone <br className="hidden md:block" />
            Won&apos;t Get You Hired. <br className="hidden xl:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent relative inline-block mt-2 xl:mt-0">
              Skills Will.
              {/* Decorative underline */}
              <span className="absolute -bottom-1 left-0 w-full h-1 sm:h-1.5 bg-gradient-to-r from-primary to-accent/50 rounded-full -rotate-1 opacity-70" />
            </span>
          </h2>
        </div>

        {/* Right Side: The Content Grid */}
        <div className="flex-1 w-full flex flex-col gap-5 md:gap-6">
          {/* Block 1 */}
          <div className="bg-card/80 backdrop-blur-xl border border-border rounded-3xl p-6 md:p-8 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between text-muted-foreground font-medium text-lg md:text-xl">
              <div className="flex flex-col gap-2">
                <span className="flex items-center gap-2 text-xs md:text-sm uppercase tracking-wider font-semibold">
                  <GraduationCap className="w-4 h-4 text-muted-foreground/80" />{" "}
                  Colleges teach
                </span>
                <span className="text-2xl md:text-3xl font-bold text-foreground line-through decoration-destructive/60 decoration-4 -rotate-1 inline-block">
                  Subjects.
                </span>
              </div>
              <div className="w-px h-16 bg-border mx-3 md:mx-4" />
              <div className="flex flex-col gap-2 text-right items-end">
                <span className="flex items-center gap-2 text-xs md:text-sm uppercase tracking-wider font-semibold">
                  <Briefcase className="w-4 h-4 text-primary/70" /> Companies
                  hire
                </span>
                <span className="text-2xl md:text-3xl font-bold text-primary pb-1 border-b-2 border-primary/30 inline-block">
                  Skills.
                </span>
              </div>
            </div>
            <p className="mt-6 pt-5 border-t border-border text-base md:text-lg text-foreground/80 leading-relaxed font-medium">
              For most students, that gap is the{" "}
              <strong className="font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-md">
                real problem.
              </strong>
            </p>
          </div>

          {/* Block 2 */}
          <div className="bg-foreground text-primary-foreground rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors duration-500" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/20 rounded-full blur-2xl pointer-events-none" />

            <Zap className="w-8 h-8 text-secondary mb-5 relative z-10 drop-shadow-md" />

            <ul className="space-y-4 text-base md:text-lg font-medium leading-relaxed relative z-10">
              <li className="flex items-start gap-3 opacity-90 group-hover:opacity-100 transition-opacity">
                <span className="text-secondary/80 mt-1 font-bold text-xl leading-none">
                  ×
                </span>
                <span>
                  You don&apos;t need a{" "}
                  <span className="line-through decoration-white/50">
                    perfect academic record.
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-3 opacity-90 group-hover:opacity-100 transition-opacity">
                <span className="text-secondary/80 mt-1 font-bold text-xl leading-none">
                  ×
                </span>
                <span>
                  You don&apos;t need{" "}
                  <span className="line-through decoration-white/50">
                    prior IT experience.
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-3 font-bold pt-3 mt-2">
                <span className="text-secondary mt-1 text-xl leading-none">
                  ✓
                </span>
                <span className="text-lg md:text-xl drop-shadow-sm">
                  What you need is the{" "}
                  <span className="text-green-600 italic font-serif pr-1">
                    willingness
                  </span>{" "}
                  to learn and get placed.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
