"use client";
import React, { useRef, useEffect } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const StickyScroll = ({ content, contentClassName }) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const cardRefs = useRef([]);

  useEffect(() => {
    const observers = cardRefs.current.map((el, index) => {
      if (!el) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveCard(index);
        },
        { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
      );
      observer.observe(el);
      return observer;
    });
    return () => observers.forEach((obs) => obs?.disconnect());
  }, []);

  return (
    <div className="relative flex justify-center gap-16 px-6 md:px-10">
      {/* Left: scrolling text */}
      <div className="relative flex flex-col py-20">
        {content.map((item, index) => (
          <div
            key={item.title + index}
            ref={(el) => (cardRefs.current[index] = el)}
            className="my-16 max-w-lg"
          >
            <motion.h3
              animate={{ opacity: activeCard === index ? 1 : 0.25 }}
              transition={{ duration: 0.3 }}
              className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight"
            >
              {item.title}
            </motion.h3>
          </div>
        ))}
        <div className="h-40" />
      </div>

      {/* Right: sticky visual panel */}
      <div
        className={cn(
          "relative sticky top-40 hidden h-[36rem] w-[30rem] self-start overflow-hidden rounded-3xl lg:block",
          contentClassName,
        )}
      >
        {content[activeCard].content ?? null}
      </div>
    </div>
  );
};
