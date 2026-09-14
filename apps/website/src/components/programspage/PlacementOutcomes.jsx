"use client";

import { motion } from "framer-motion";
import { TrendingUp, Quote } from "lucide-react";

const alumni = [
  {
    name: "Priya Sharma",
    background: "BCA Graduate, 2023",
    role: "Junior Frontend Developer",
    company: "TechSpark Noida",
    package: "₹4.2 LPA",
    quote:
      "SkillYards didn't just teach me code. I built practical projects during my final year and felt more confident for interviews and early career opportunities.",
  },
  {
    name: "Rahul Verma",
    background: "Full-Stack Dev Bootcamp, 2024",
    role: "Full-Stack Developer",
    company: "StartupBase Delhi",
    package: "₹5.8 LPA",
    quote:
      "Coming from a non-tech background, I was nervous. Six months later I'm building production apps. The mentors here are genuinely invested in your success.",
  },
  {
    name: "Anjali Singh",
    background: "Digital Marketing Program, 2024",
    role: "Digital Marketing Executive",
    company: "Brandify Solutions",
    package: "₹3.6 LPA",
    quote:
      "I ran a real Google Ads campaign for a local business during training. That experience is what got me the job no other institute does this.",
  },
];

export default function PlacementOutcomes() {
  return (
    <section className="bg-card/20 py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary"
          >
            <TrendingUp size={13} />
            Placement & Outcomes
          </motion.div>
          <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Real Results.{" "}
            <span className="italic text-primary">Real Careers.</span>
          </h2>
        </div>

        {/* Stats row */}
        <div className="mb-14 grid grid-cols-2 gap-6 rounded-3xl border border-border bg-card p-8 shadow-sm sm:grid-cols-4">
          {[
            { value: "Dedicated", label: "Placement Support" },
            { value: "₹4.5 LPA", label: "Average Starting Package" },
            { value: "180+", label: "Hiring Partners" },
            { value: "1200+", label: "Students Placed" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-3xl font-extrabold text-primary">{s.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Alumni stories */}
        <div className="mb-14 grid gap-6 sm:grid-cols-3">
          {alumni.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-3xl border border-border bg-card p-6 shadow-sm"
            >
              <Quote size={28} className="mb-3 text-primary/20" />
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground italic">
                &ldquo;{a.quote}&rdquo;
              </p>
              <div className="border-t border-border pt-4">
                <p className="font-bold text-foreground">{a.name}</p>
                <p className="text-xs text-muted-foreground">{a.background}</p>
                <p className="mt-1 text-xs font-semibold text-primary">
                  {a.role} @ {a.company}
                </p>
                <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                  {a.package}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
