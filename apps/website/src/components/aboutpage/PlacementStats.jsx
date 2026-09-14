"use client";

import { Compass, FolderKanban, ShieldCheck, Sparkles } from "lucide-react";

const cards = [
  {
    title: "Guided",
    description:
      "Students should feel supported by mentors, structure, and clearer next steps.",
    icon: Compass,
  },
  {
    title: "More Confident",
    description:
      "Learning is designed to improve confidence through practical work, not only theory.",
    icon: ShieldCheck,
  },
  {
    title: "More Prepared",
    description:
      "Students build projects, portfolios, documentation, and stronger interview readiness.",
    icon: FolderKanban,
  },
  {
    title: "More Career-Aware",
    description:
      "The aim is to reduce confusion and help learners understand where their skills can lead.",
    icon: Sparkles,
  },
];

export default function PlacementStats() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            More Than Courses - A Career-Building Journey
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            SkillYards is built to help students feel guided, more practical,
            less confused about the future, and better prepared for real-world
            learning and career conversations.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="rounded-[2rem] border border-border/50 bg-card/60 p-6 text-left shadow-md backdrop-blur-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-foreground">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
