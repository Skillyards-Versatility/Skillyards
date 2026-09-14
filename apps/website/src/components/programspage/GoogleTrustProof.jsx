"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import { Star, MessageSquareQuote } from "lucide-react";

export default function GoogleTrustProof() {
  return (
    <section className="bg-background py-10 relative overflow-hidden border-t border-b border-border/30 bg-slate-50/20 dark:bg-white/[0.01]">
      <div className="mx-auto max-w-4xl px-6 relative z-10">
        <LazyMotion features={domAnimation}>
          <m.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 text-center md:text-left bg-white dark:bg-card/25 backdrop-blur-sm border border-border/50 rounded-[2rem] px-8 py-8 md:py-6 shadow-xl shadow-black/5"
          >
            {/* Google Logo / Graphic */}
            <div className="flex flex-col items-center shrink-0">
              <span className="text-3xl font-black tracking-tight font-sans mb-1 select-none">
                <span className="text-blue-500">G</span>
                <span className="text-red-500">o</span>
                <span className="text-yellow-500">o</span>
                <span className="text-blue-500">g</span>
                <span className="text-green-500">l</span>
                <span className="text-red-500">e</span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">
                Reviews
              </span>
            </div>

            {/* Divider on desktop */}
            <div className="hidden md:block w-px h-12 bg-border/50 shrink-0" />

            {/* Stars & Text */}
            <div className="flex-1 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1.5 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-1">
                  {[...Array(4)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className="fill-amber-400 text-amber-400"
                    />
                  ))}
                  {/* 4.8 Star (mostly filled) */}
                  <div className="relative inline-block w-[18px] h-[18px]">
                    <Star
                      size={18}
                      className="text-amber-400/25 absolute top-0 left-0"
                    />
                    <div className="absolute top-0 left-0 overflow-hidden w-[80%]">
                      <Star
                        size={18}
                        className="fill-amber-400 text-amber-400"
                      />
                    </div>
                  </div>
                  <span className="ml-2 text-sm font-black text-foreground">
                    4.8 / 5
                  </span>
                </div>

                <h3 className="font-serif text-lg md:text-xl font-bold text-foreground leading-snug">
                  Rated{" "}
                  <span className="text-primary italic">4.8/5 on Google</span>{" "}
                  with 116 genuine reviews
                </h3>
                <p className="text-xs font-semibold text-muted-foreground">
                  Verified feedback shared directly by our students and parents
                  in Agra.
                </p>
              </div>

              {/* Icon badge */}
              <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary/5 text-primary border border-primary/10 shadow-inner">
                <MessageSquareQuote size={20} className="text-primary" />
              </div>
            </div>
          </m.div>
        </LazyMotion>
      </div>
    </section>
  );
}
