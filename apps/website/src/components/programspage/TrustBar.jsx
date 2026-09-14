"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

function Counter({ value, suffix = "+", prefix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        let start = 0;
        const duration = 1200;
        const step = Math.ceil(value / (duration / 16));
        const timer = setInterval(() => {
          start += step;
          if (start >= value) {
            setCount(value);
            clearInterval(timer);
          } else {
            setCount(start);
          }
        }, 16);
        observer.disconnect();
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span
      ref={ref}
      className="text-3xl font-extrabold text-primary sm:text-4xl"
    >
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

const stats = [
  { value: 1200, suffix: "+", label: "Students Placed" },
  { value: 95, suffix: "%", label: "Placement Rate" },
  { value: 180, suffix: "+", label: "Hiring Partners" },
  { value: 8, suffix: "+", label: "Years in Agra" },
];

export default function TrustBar() {
  return (
    <section className="border-y border-border bg-card/40 py-10">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center gap-1"
            >
              <Counter value={stat.value} suffix={stat.suffix} />
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
