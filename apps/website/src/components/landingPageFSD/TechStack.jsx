"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Bug,
  FileText,
  FolderGit2,
  Globe,
  Layers,
  LayoutTemplate,
  ServerCog,
  Sparkles,
} from "lucide-react";

const layers = [
  {
    layer: "GitHub-based code practice",
    color: "border-cyan-500/30 bg-cyan-500/5",
    icon: FolderGit2,
    note: "Build consistency from early commits and structured repository practice.",
  },
  {
    layer: "Code review and debugging support",
    color: "border-purple-500/30 bg-purple-500/5",
    icon: Bug,
    note: "Understand mistakes, fix errors, and improve code quality with mentor guidance.",
  },
  {
    layer: "Frontend projects with React",
    color: "border-green-500/30 bg-green-500/5",
    icon: LayoutTemplate,
    note: "Build interactive interfaces and component-based frontend applications.",
  },
  {
    layer: "Backend APIs with Node.js and Express",
    color: "border-orange-500/30 bg-orange-500/5",
    icon: ServerCog,
    note: "Create routes, APIs, and backend logic that connect to real application flows.",
  },
  {
    layer: "MongoDB database integration",
    color: "border-emerald-500/30 bg-emerald-500/5",
    icon: Layers,
    note: "Work with collections, models, CRUD operations, and connected app data.",
  },
  {
    layer: "Full-stack app deployment",
    color: "border-primary/20 bg-primary/5",
    icon: Globe,
    note: "Deploy frontend and backend projects so they can be shared in portfolios and interviews.",
  },
  {
    layer: "README and documentation writing",
    color: "border-sky-500/30 bg-sky-500/5",
    icon: FileText,
    note: "Document projects clearly for GitHub reviews, interviews, and portfolio discussions.",
  },
  {
    layer: "AI-assisted debugging and documentation",
    color: "border-fuchsia-500/30 bg-fuchsia-500/5",
    icon: Sparkles,
    note: "Use AI carefully to understand issues, drafts, and developer workflow improvements.",
  },
  {
    layer: "Portfolio-ready project presentation",
    color: "border-amber-500/30 bg-amber-500/5",
    icon: Briefcase,
    note: "Present your work in a way that supports interviews, GitHub reviews, and career conversations.",
  },
];

export function FSDTechStack() {
  const [showAll, setShowAll] = useState(false);

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
            <Layers size={13} />
            Practical Training
          </motion.div>
          <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Practical Full-Stack Training,{" "}
            <span className="italic text-primary">Not Just Theory.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Students work on mentor-guided practical projects, full-stack
            application builds, GitHub-based code practice, code reviews,
            deployment exercises, and portfolio-ready project work. Selected
            students may also get exposure to live/internal projects where
            available.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {layers.map((layer, i) => {
            const Icon = layer.icon;
            return (
              <motion.div
                key={layer.layer}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`${!showAll && i >= 4 ? "hidden sm:block" : "block"} rounded-3xl border p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${layer.color}`}
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-background/80 shadow-sm">
                    <Icon size={18} className="text-foreground" />
                  </div>
                  <span className="rounded-full border border-white/40 bg-background/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    Practical
                  </span>
                </div>
                <h3 className="mb-2 font-serif text-lg font-extrabold leading-snug text-foreground">
                  {layer.layer}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {layer.note}
                </p>
              </motion.div>
            );
          })}
        </div>

        {layers.length > 4 && (
          <div className="mt-5 flex justify-center sm:hidden">
            <button
              type="button"
              onClick={() => setShowAll((value) => !value)}
              className="rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-primary"
            >
              {showAll ? "Show less" : "Show more"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
