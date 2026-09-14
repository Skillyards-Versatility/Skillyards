"use client";

import React from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { Code2, Database, Globe, Layers } from "lucide-react";

const ACCENTS = [
  { bg: "bg-blue-500/10", text: "text-blue-500" },
  { bg: "bg-violet-500/10", text: "text-violet-500" },
  { bg: "bg-emerald-500/10", text: "text-emerald-500" },
  { bg: "bg-amber-500/10", text: "text-amber-500" },
  { bg: "bg-pink-500/10", text: "text-pink-500" },
  { bg: "bg-indigo-500/10", text: "text-indigo-500" },
  { bg: "bg-orange-500/10", text: "text-orange-500" },
  { bg: "bg-teal-500/10", text: "text-teal-500" },
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
        <div
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 shrink-0 ${accent.bg} ${accent.text} group-hover:scale-110 transition-transform duration-300`}
          style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)" }}
        >
          {React.cloneElement(icon, { size: 26 })}
        </div>

        <h3 className="text-sm sm:text-base font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300 leading-tight">
          {label}
        </h3>

        <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </m.div>
  );
}

export const BCASkills = () => {
  const skills = [
    { icon: <Code2 />, label: "Full Stack Dev" },
    { icon: <Database />, label: "Database Systems" },
    { icon: <Globe />, label: "Web Technologies" },
    { icon: <Layers />, label: "Cloud & Deployment" },
  ];

  return (
    <LazyMotion features={domAnimation} strict>
      <section className="py-12 sm:py-20 lg:py-28 bg-background w-full relative overflow-hidden">
        {/* Ambient blobs */}
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div className="absolute top-1/3 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/3 -right-40 w-80 h-80 bg-secondary/10 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-16 lg:mb-20 max-w-3xl mx-auto">
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
              <span className="text-primary italic">Skills</span> You Will
              Build.
            </m.h2>

            <m.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed"
            >
              This BCA in Agra focuses on the tools and technologies you will
              use every day as a developer.
            </m.p>
          </div>

          {/* Skills grid — 4 cols on desktop, 2 on mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {skills.map((skill, index) => (
              <SkillCard key={index} {...skill} index={index} />
            ))}
          </div>
        </div>
      </section>
    </LazyMotion>
  );
};
