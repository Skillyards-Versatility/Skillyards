"use client";

import { motion } from "framer-motion";
import {
  BarChart2,
  CheckCircle,
  FileBarChart,
  Lightbulb,
  PenSquare,
  Search,
  Target,
} from "lucide-react";

const practicePoints = [
  { icon: Search, text: "SEO audit and keyword research reports" },
  { icon: Target, text: "Google Ads campaign planning" },
  { icon: Target, text: "Meta Ads campaign structure" },
  { icon: PenSquare, text: "Social media content planning" },
  { icon: PenSquare, text: "Landing page and ad copywriting" },
  { icon: FileBarChart, text: "Marketing report creation" },
  { icon: Lightbulb, text: "AI-assisted content and campaign ideation" },
  { icon: FileBarChart, text: "Portfolio-ready case study presentation" },
  { icon: BarChart2, text: "Campaign performance analysis exercises" },
];

export function DGMOJTExplained() {
  return (
    <section className="bg-card/20 py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary"
          >
            Practical Training
          </motion.div>
          <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Practical Digital Marketing Training,{" "}
            <span className="text-primary">Not Just Theory</span>
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-muted-foreground">
            At SkillYards, students work on mentor-guided practical projects,
            SEO audits, ad campaign planning, reporting exercises, and
            portfolio-ready case work. Selected students may also get exposure
            to live business campaigns where available.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {practicePoints.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Icon size={18} className="text-primary" />
                </div>
                <p className="text-sm font-medium leading-relaxed text-foreground">
                  {item.text}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-sm"
        >
          <h3 className="mb-5 font-serif text-xl font-extrabold text-foreground">
            What students actually practice:
          </h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              "Mentor-guided project execution",
              "SEO and ads planning workflows",
              "Reporting and analysis exercises",
              "Portfolio presentation with feedback",
              "AI-supported research and drafting",
              "Practical work that is safer and more credible than hype claims",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle size={16} className="shrink-0 text-green-500" />
                <span className="text-sm font-medium text-foreground">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
