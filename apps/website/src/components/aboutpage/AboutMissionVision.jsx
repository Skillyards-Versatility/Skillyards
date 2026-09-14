"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import { Lightbulb, Eye } from "lucide-react";
import missionVisionData from "@/data/aboutpage/missionvision.json";

const iconMap = {
  Lightbulb,
  Eye,
};

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const card = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function AboutMissionVision() {
  return (
    <LazyMotion features={domAnimation}>
      <section className="relative py-16 bg-background overflow-hidden">
        {/* background glow */}
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-primary/10 blur-[160px] rounded-full -translate-y-1/2 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Heading */}
          <m.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              Our <span className="text-primary italic">Purpose</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              SkillYards exists to help students grow with practical skills,
              stronger career direction, and more confidence for real-world
              learning and opportunities.
            </p>
          </m.div>

          {/* Cards */}
          <m.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-10"
          >
            {missionVisionData.map((item, index) => {
              const Icon = iconMap[item.icon];

              return (
                <m.div
                  key={index}
                  variants={card}
                  whileHover={{ y: -8 }}
                  className="relative group rounded-4xl border border-border bg-card/60 backdrop-blur-xl p-6 shadow-lg overflow-hidden transition-all"
                >
                  {/* gradient hover overlay */}
                  <div className="absolute inset-0 bg-linear-to-br from-primary/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* floating icon halo */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 w-16 h-16 bg-primary/20 blur-2xl rounded-full" />
                    <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                      {Icon && <Icon className="w-7 h-7" />}
                    </div>
                  </div>

                  {/* title */}
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    {item.title}
                  </h3>

                  {/* text */}
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {item.description}
                  </p>

                  {/* subtle decoration */}
                  <div className="absolute bottom-0 right-0 w-40 h-40 bg-primary/10 blur-[100px] rounded-full opacity-30" />
                </m.div>
              );
            })}
          </m.div>
        </div>
      </section>
    </LazyMotion>
  );
}
