"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative py-12 px-6 overflow-hidden bg-background min-h-[40vh] flex items-center">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-secondary/10 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full">
        <LazyMotion features={domAnimation}>
          <m.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[2.5rem] border border-border/40 bg-card/40 backdrop-blur-md p-8 sm:p-12 text-center shadow-xl"
          >
            <div className="relative space-y-6 max-w-2xl mx-auto">
              <m.div
                initial={{ y: -10, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase mb-1"
              >
                <span>Transform Your Future</span>
              </m.div>

              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground leading-tight">
                Start Your IT Career With{" "}
                <span className="text-primary italic">SkillYards</span>
              </h2>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
                Join SkillYards for{" "}
                <span className="text-foreground font-semibold">
                  On-Job Training
                </span>{" "}
                &<span className="text-foreground font-semibold"> Degree</span>{" "}
                programs. Hands-on learning in emerging IT technologies.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
                <Button
                  asChild
                  size="lg"
                  className="group rounded-full bg-primary px-8 h-12 text-base font-bold text-primary-foreground shadow-lg transition-all hover:scale-105 active:scale-95"
                >
                  <a href="/contact" className="flex items-center gap-2">
                    Enroll Now
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </a>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-border/60 bg-background/30 backdrop-blur-sm px-8 h-12 text-base font-bold text-foreground transition-all hover:bg-muted hover:scale-105 active:scale-95 shadow-md"
                >
                  <a href="/programs">Explore Programs</a>
                </Button>
              </div>
            </div>
          </m.div>
        </LazyMotion>
      </div>
    </section>
  );
}
