"use client";

import { motion } from "framer-motion";
import { Brain, Code2, LineChart, Lightbulb } from "lucide-react";

const aiCards = [
  {
    title: "For Developers",
    icon: Code2,
    points: [
      "Debugging support",
      "Code explanation",
      "Documentation and README writing",
      "Project planning",
      "Error understanding",
      "Productivity support",
    ],
  },
  {
    title: "For Marketers",
    icon: LineChart,
    points: [
      "Keyword research support",
      "Content planning",
      "Ad copy drafts",
      "SEO support",
      "Reporting summaries",
      "Campaign ideation",
    ],
  },
];

export default function StudentWorkAbout() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-extrabold mb-4"
          >
            Modern Learning Includes AI
          </motion.h2>
          <motion.p
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-muted-foreground max-w-2xl mx-auto text-lg"
          >
            Modern developers and marketers use AI to work faster and more
            efficiently. SkillYards integrates practical AI-assisted workflows
            while keeping the focus on fundamentals, practical understanding,
            and real-world execution.
          </motion.p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {aiCards.map(({ title, icon: Icon, points }) => (
            <div
              key={title}
              className="rounded-[2rem] border border-border/50 bg-card/60 p-8 shadow-lg backdrop-blur-sm"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-2xl font-bold text-foreground">
                {title}
              </h3>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {points.map((item) => (
                  <li
                    key={item}
                    className="rounded-2xl border border-border/40 bg-background/70 px-4 py-3 text-sm font-medium text-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[2rem] border border-primary/15 bg-primary/5 p-6 text-sm leading-relaxed text-foreground sm:p-8">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-background text-primary">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">
                AI is taught as a practical assistant.
              </p>
              <p className="mt-2 text-muted-foreground">
                It is not positioned as a replacement for fundamentals,
                creativity, coding ability, strategy, or human judgement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
