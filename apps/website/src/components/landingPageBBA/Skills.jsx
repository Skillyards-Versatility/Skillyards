"use client";

import React from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import {
  BarChart3,
  Globe,
  PieChart,
  Briefcase,
  TrendingUp,
  Search,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

/* Per-card accent colours purely decorative, not theme tokens */
const ACCENTS = [
  { bg: "bg-blue-500/10", border: "border-blue-500/25", text: "text-blue-500" },
  {
    bg: "bg-violet-500/10",
    border: "border-violet-500/25",
    text: "text-violet-500",
  },
  {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/25",
    text: "text-emerald-500",
  },
  {
    bg: "bg-amber-500/10",
    border: "border-amber-500/25",
    text: "text-amber-500",
  },
  { bg: "bg-pink-500/10", border: "border-pink-500/25", text: "text-pink-500" },
  {
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/25",
    text: "text-indigo-500",
  },
  {
    bg: "bg-orange-500/10",
    border: "border-orange-500/25",
    text: "text-orange-500",
  },
  { bg: "bg-teal-500/10", border: "border-teal-500/25", text: "text-teal-500" },
];

function SkillCard({ icon, label, index }) {
  const accent = ACCENTS[index % ACCENTS.length];

  return (
    <m.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.45 }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="group"
    >
      <div
        className="relative flex flex-col items-center text-center p-5 sm:p-6 rounded-2xl bg-card/70 backdrop-blur-sm transition-all duration-300 h-full"
        style={{
          boxShadow:
            "0 2px 16px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.07)",
        }}
      >
        {/* Icon bubble */}
        <div
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 shrink-0 ${accent.bg} ${accent.text} group-hover:scale-110 transition-transform duration-300`}
          style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)" }}
        >
          {React.cloneElement(icon, { size: 26 })}
        </div>

        {/* Label */}
        <h3 className="text-sm sm:text-base font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300 leading-tight">
          {label}
        </h3>

        {/* Hover glow overlay */}
        <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </m.div>
  );
}

export const Skills = () => {
  const skills = [
    { icon: <BarChart3 />, label: "Data Analytics", level: 90 },
    { icon: <Globe />, label: "Global Business", level: 85 },
    { icon: <PieChart />, label: "Finance", level: 80 },
    { icon: <Briefcase />, label: "Management", level: 95 },
    { icon: <TrendingUp />, label: "Marketing", level: 88 },
    { icon: <Search />, label: "Strategy", level: 82 },
    { icon: <MessageSquare />, label: "Communication", level: 92 },
    { icon: <ShieldCheck />, label: "Ethics", level: 85 },
  ];

  return (
    <LazyMotion features={domAnimation} strict>
      <section className="py-16 sm:py-20 lg:py-28 bg-background w-full relative overflow-hidden">
        {/* Ambient blobs */}
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div className="absolute top-1/3 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/3 -right-40 w-80 h-80 bg-secondary/10 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16 lg:mb-20 max-w-3xl mx-auto">
            <m.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-primary font-bold tracking-widest uppercase text-xs sm:text-sm mb-4 block"
            >
              Capabilities
            </m.span>

            <m.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="text-3xl sm:text-4xl md:text-5xl font-serif font-extrabold mb-4 sm:mb-6 tracking-tight text-foreground"
            >
              Future-Ready <span className="text-primary italic">Skills.</span>
            </m.h2>

            <m.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed"
            >
              We don&apos;t just teach business theory we build leaders equipped
              with the hard and soft skills necessary for the modern digital
              economy.
            </m.p>
          </div>

          {/* Skills grid  2 cols on mobile (first 4 only), 3 on sm, 4 on lg */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {skills.map((skill, index) => (
              <div key={index} className={index >= 4 ? "hidden sm:block" : ""}>
                <SkillCard {...skill} index={index} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </LazyMotion>
  );
};
