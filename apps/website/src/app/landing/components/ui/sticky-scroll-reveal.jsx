"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const StickyScroll = ({ content, contentClassName }) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0,
    );
    setActiveCard(closestBreakpointIndex);
  });

  return (
    <div
      className="relative w-full max-w-6xl mx-auto flex justify-between items-start px-6 lg:px-8 py-12"
      ref={ref}
    >
      {/* Left Text Column */}
      <div className="w-1/2 flex flex-col justify-start pr-8">
        {content.map((item, index) => (
          <div
            key={item.title + index}
            className="py-24 first:pt-0 last:pb-0 flex items-center min-h-[160px]"
          >
            <motion.h2
              animate={{
                opacity: activeCard === index ? 1 : 0.25,
                x: activeCard === index ? 12 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground font-display cursor-pointer select-none origin-left"
              onClick={() => {
                // Smooth scroll to this item if clicked
                const el = ref.current?.querySelectorAll(".py-24")[index];
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "center" });
                }
              }}
            >
              {item.title}
            </motion.h2>
          </div>
        ))}
        {/* Extra spacing to allow the last item to scroll past the center */}
        <div className="h-32" />
      </div>

      {/* Right Sticky Card Column */}
      <div className="w-1/2 sticky top-40 flex justify-center items-center h-[32rem]">
        <div
          className={cn(
            "relative h-[30rem] w-[24rem] overflow-hidden rounded-3xl bg-white shadow-2xl border border-gray-100 dark:border-white/10 dark:bg-card transition-all duration-300",
            contentClassName,
          )}
        >
          {content.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: activeCard === index ? 1 : 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 w-full h-full"
              style={{ pointerEvents: activeCard === index ? "auto" : "none" }}
            >
              {item.content}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
