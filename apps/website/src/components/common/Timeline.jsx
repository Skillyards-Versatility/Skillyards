"use client";

import React from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";

export default function Timeline({ items, title, subtitle }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <section className="relative py-16 md:py-28 bg-background overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-150 h-150 bg-primary/10 blur-[140px] rounded-full" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Heading */}
          {(title || subtitle) && (
            <div className="text-center mb-14 md:mb-20">
              {title && (
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {/* Timeline Wrapper */}
          <div className="relative">
            {/* Desktop — straight vertical line through all dots */}
            <div className="absolute hidden md:block top-3 bottom-3 left-1/2 -translate-x-1/2 w-px bg-linear-to-b from-primary/80 via-primary/50 to-primary/10" />

            {/* Mobile — straight vertical line */}
            <div
              className="md:hidden absolute top-0 bottom-0 w-px bg-linear-to-b from-primary/80 via-primary/40 to-primary/10"
              style={{ left: "15px" }}
            />

            {/* Items */}
            <div className="space-y-3 md:space-y-16">
              {items.map((item, index) => {
                const isLeft = index % 2 === 0;

                return (
                  <div key={index}>
                    {/* ── Mobile layout (< md) ── */}
                    <div className="md:hidden flex items-start">
                      <div className="w-8 shrink-0 flex justify-center pt-4 z-10">
                        <div className="relative flex items-center justify-center">
                          <m.div
                            animate={{
                              scale: [1, 2, 1],
                              opacity: [0.15, 0.45, 0.15],
                            }}
                            transition={{
                              duration: 2.8,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: index * 0.25,
                            }}
                            className="absolute w-4 h-4 bg-primary/50 rounded-full"
                          />
                          <div className="relative z-10 w-2.5 h-2.5 rounded-full bg-primary" />
                        </div>
                      </div>

                      <m.div
                        initial={{ opacity: 0, x: 18 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.06 }}
                        viewport={{ once: true }}
                        className="flex-1 py-1 pr-0.5"
                      >
                        <div
                          className="group relative p-3.5 rounded-2xl border border-white/10 bg-linear-to-br from-card/95 to-card/70 backdrop-blur-xl hover:border-primary/30 transition-all duration-300"
                          style={{
                            boxShadow:
                              "0 2px 12px rgba(0,0,0,0.25), 0 1px 3px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.07)",
                          }}
                        >
                          <TimelineCard item={item} compact />
                        </div>
                      </m.div>
                    </div>

                    {/* ── Desktop layout (≥ md) ── */}
                    <div className="hidden md:flex items-center justify-between gap-6">
                      {/* LEFT CARD */}
                      {isLeft ? (
                        <div className="w-[calc(50%-1.75rem)]">
                          <m.div
                            initial={{ opacity: 0, x: -32 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="group relative p-4 rounded-2xl border border-white/10 bg-linear-to-br from-card/95 to-card/70 backdrop-blur-xl hover:-translate-y-1 transition-all duration-300"
                            style={{
                              boxShadow:
                                "0 4px 20px rgba(0,0,0,0.22), 0 1px 4px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.15)",
                            }}
                          >
                            <TimelineCard item={item} />
                          </m.div>
                        </div>
                      ) : (
                        <div className="w-[calc(50%-1.75rem)]" />
                      )}

                      {/* CENTER DOT */}
                      <div className="flex items-center justify-center shrink-0 z-20">
                        <m.div
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.4, 0.9, 0.4],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.2,
                          }}
                          className="absolute w-10 h-10 bg-primary/25 rounded-full blur-lg"
                        />
                        <div className="relative z-10 w-5 h-5 rounded-full bg-primary border-3 border-background shadow-[0_0_0_3px_hsl(var(--primary)/0.2)]" />
                      </div>

                      {/* RIGHT CARD */}
                      {!isLeft ? (
                        <div className="w-[calc(50%-1.75rem)]">
                          <m.div
                            initial={{ opacity: 0, x: 32 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="group relative p-4 rounded-2xl border border-white/10 bg-linear-to-br from-card/95 to-card/70 backdrop-blur-xl hover:-translate-y-1 transition-all duration-300"
                            style={{
                              boxShadow:
                                "0 4px 20px rgba(0,0,0,0.22), 0 1px 4px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.15)",
                            }}
                          >
                            <TimelineCard item={item} />
                          </m.div>
                        </div>
                      ) : (
                        <div className="w-[calc(50%-1.75rem)]" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}

/* Timeline Card Content */
function TimelineCard({ item, compact = false }) {
  const Icon = item.icon;

  return (
    <>
      <div
        className={`${compact ? "mb-2.5" : "mb-3"} flex items-center gap-2.5`}
      >
        <div
          className={`${compact ? "w-8 h-8" : "w-9 h-9"} flex items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0`}
          style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)" }}
        >
          <Icon size={compact ? 15 : 17} />
        </div>
        <span className="text-xs font-semibold text-primary uppercase tracking-wider">
          {item.duration}
        </span>
      </div>

      <h3
        className={`${compact ? "text-sm" : "text-base"} font-bold text-foreground mb-1.5`}
      >
        {item.title}
      </h3>

      <p className="text-muted-foreground text-xs leading-relaxed">
        {item.description}
      </p>

      {/* Hover Glow */}
      <div className="absolute inset-0 rounded-2xl bg-primary/8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </>
  );
}
