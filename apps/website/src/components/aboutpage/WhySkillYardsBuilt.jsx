"use client";

import { motion } from "framer-motion";

const columns = [
  {
    title: "Traditional Learning",
    tone: "from-muted/80 to-muted/30",
    points: [
      "Theory-heavy",
      "Limited practical exposure",
      "Outdated workflows",
      "Little portfolio work",
      "Weak career direction",
    ],
  },
  {
    title: "SkillYards Approach",
    tone: "from-primary/15 to-secondary/10",
    points: [
      "Practical learning",
      "Mentor-guided projects",
      "AI-integrated workflows",
      "Portfolio-focused training",
      "Career-oriented preparation",
    ],
  },
];

export default function WhySkillYardsBuilt() {
  return (
    <section className="relative overflow-hidden bg-background py-20">
      <div className="absolute inset-y-0 left-0 h-full w-[420px] rounded-full bg-primary/5 blur-[140px]" />
      <div className="absolute inset-y-0 right-0 h-full w-[420px] rounded-full bg-secondary/5 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold uppercase tracking-[0.28em] text-primary"
          >
            Why SkillYards Exists
          </motion.p>
          <motion.h2
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl"
          >
            Why SkillYards Was Built
          </motion.h2>
          <motion.p
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="mt-5 text-lg leading-relaxed text-muted-foreground"
          >
            Traditional education often focuses only on theory. SkillYards was
            built to bridge the gap between classroom learning and practical
            career preparation through structured programs, mentor guidance,
            project-based learning, and industry-relevant skills.
          </motion.p>
          <motion.p
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 }}
            className="mt-4 text-lg leading-relaxed text-muted-foreground"
          >
            Our programs are designed to help students move from theory to
            practical skills, from confusion to career clarity, and from passive
            learning to real-world exposure.
          </motion.p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2 lg:items-stretch">
          {columns.map((column, index) => (
            <motion.div
              key={column.title}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className={`rounded-[2rem] border border-border/50 bg-linear-to-br ${column.tone} p-8 shadow-lg backdrop-blur-sm h-full`}
            >
              <div className="flex items-center justify-between gap-4 border-b border-border/40 pb-5">
                <h3 className="text-2xl font-bold text-foreground">
                  {column.title}
                </h3>
                <span className="rounded-full border border-border/40 bg-background/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {index === 0 ? "Common" : "SkillYards"}
                </span>
              </div>
              <ul className="mt-6 space-y-4">
                {column.points.map((point) => (
                  <li
                    key={point}
                    className="rounded-2xl border border-border/40 bg-background/70 px-4 py-3 text-sm font-medium text-foreground shadow-sm"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
