"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  { id: 1, end: 700, suffix: "+", label: "Students Trained in Agra" },
  {
    id: 2,
    end: 50,
    suffix: "+",
    label: "Live Projects Completed By Our Students",
  },
  { id: 3, end: 5, suffix: "+", label: "Programmes Offered" },
  { id: 4, end: 50, suffix: "+", label: "Tool and Technlogy Taught" },
];

const DURATION = 1800; // ms

function easeOutQuad(t) {
  return 1 - (1 - t) * (1 - t);
}

function useCountUp(end, start) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!start) return;

    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / DURATION, 1);
      const eased = easeOutQuad(progress);
      setValue(Math.round(eased * end));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [start, end]);

  return value;
}

function StatItem({ end, suffix, label, start }) {
  const value = useCountUp(end, start);

  return (
    <div className="flex flex-col items-center text-center px-4 py-4 sm:py-0 flex-1 min-w-[45%] sm:min-w-0">
      <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white tabular-nums tracking-tight">
        {value.toLocaleString()}
        {suffix}
      </span>
      <span className="mt-1 text-xs sm:text-sm font-medium text-white/85 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

export default function StatsStrip() {
  const [start, setStart] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStart(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-r from-[#030e5a] to-[#14248a] dark:from-[#18161d] dark:to-[#222027] py-10 px-4 sm:px-8 shadow-inner transition-colors duration-300"
    >
      <div className="max-w-5xl mx-auto flex flex-wrap sm:flex-nowrap divide-y sm:divide-y-0 sm:divide-x divide-white/20">
        {STATS.map((stat) => (
          <StatItem key={stat.id} {...stat} start={start} />
        ))}
      </div>
    </section>
  );
}
