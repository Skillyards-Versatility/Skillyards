"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  Bug,
  FileText,
  FolderGit2,
  LayoutTemplate,
  LineChart,
  MessageSquareMore,
  Sparkles,
} from "lucide-react";

const items = [
  { label: "Portfolio-ready projects", icon: Briefcase },
  { label: "GitHub/workflow practice", icon: FolderGit2 },
  { label: "SEO and marketing exercises", icon: LineChart },
  { label: "Code reviews and debugging support", icon: Bug },
  { label: "Reporting and documentation", icon: FileText },
  { label: "AI-assisted productivity workflows", icon: Sparkles },
  { label: "Resume and portfolio preparation", icon: LayoutTemplate },
  {
    label: "Mock interviews and interview preparation",
    icon: MessageSquareMore,
  },
];

export default function OJTPracticalLearning() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary"
          >
            Practical Learning
          </motion.div>
          <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Practical Learning,{" "}
            <span className="italic text-primary">Not Just Theory</span>
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            SkillYards OJT programs focus on practical skill-building through
            projects, portfolio work, GitHub/workflow practice, reporting
            exercises, code reviews, campaign planning, and mentor-guided
            learning.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-3xl border border-border bg-card p-5 shadow-sm"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                  <Icon size={18} className="text-primary" />
                </div>
                <p className="text-sm font-semibold leading-relaxed text-foreground">
                  {item.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
