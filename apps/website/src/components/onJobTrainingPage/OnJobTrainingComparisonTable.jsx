"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Bug,
  ClipboardList,
  FileText,
  LayoutList,
  Lightbulb,
  LineChart,
  Search,
  Sparkles,
} from "lucide-react";

const fullStackAi = [
  { label: "Debugging support", icon: Bug },
  { label: "Code explanation", icon: Bot },
  { label: "Documentation and README writing", icon: FileText },
  { label: "Project planning", icon: ClipboardList },
  { label: "Error understanding", icon: Sparkles },
  { label: "Productivity support", icon: LayoutList },
];

const digitalAi = [
  { label: "Keyword research support", icon: Search },
  { label: "Content planning", icon: ClipboardList },
  { label: "Ad copy drafts", icon: FileText },
  { label: "SEO support", icon: Search },
  { label: "Reporting summaries", icon: LineChart },
  { label: "Campaign ideation", icon: Lightbulb },
];

export default function OnJobTrainingComparisonTable() {
  return (
    <section className="bg-card/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary"
          >
            <LayoutList size={13} />
            AI-Integrated Workflows
          </motion.div>
          <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Learn Modern Skills With{" "}
            <span className="italic text-primary">AI-Integrated Workflows</span>
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">
            Modern developers and marketers use AI tools to improve
            productivity, research faster, understand problems better, organize
            workflows, and create better outputs.
          </p>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
            SkillYards OJT programs include practical AI-assisted workflows
            alongside core fundamentals, so students learn how modern
            professionals actually work.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-border bg-card p-6 shadow-sm"
          >
            <h3 className="font-serif text-2xl font-extrabold text-foreground">
              Full-Stack Web Development OJT
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              AI-assisted workflows for coding practice, debugging, project
              planning, and developer productivity.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {fullStackAi.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background p-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
                      <Icon size={18} className="text-primary" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {item.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="rounded-3xl border border-border bg-card p-6 shadow-sm"
          >
            <h3 className="font-serif text-2xl font-extrabold text-foreground">
              Digital Marketing OJT
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              AI-assisted workflows for research, planning, copy support, SEO,
              and campaign productivity.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {digitalAi.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background p-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
                      <Icon size={18} className="text-primary" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {item.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-8 max-w-3xl rounded-2xl border border-primary/10 bg-primary/5 px-5 py-4 text-center text-sm leading-relaxed text-muted-foreground"
        >
          AI is taught as a practical assistant, not as a replacement for
          fundamentals, strategy, coding ability, creativity, or human
          judgement.
        </motion.p>
      </div>
    </section>
  );
}
