"use client";

import { motion } from "framer-motion";
import { Building2, LayoutList, MapPin, Search } from "lucide-react";

const rows = [
  {
    title: "Classroom guidance in Agra",
    desc: "SkillYards offers offline full-stack web development training in Agra for students and learners who want classroom guidance, mentor support, coding practice, code reviews, and project-based learning.",
    icon: Building2,
  },
  {
    title: "Campus location",
    desc: "Our campus is located at SkillYards, A-3, behind Manoj Dhaba, Bhagwan Talkies Crossing, Indra Puri, New Agra Colony, Agra, Uttar Pradesh 282005.",
    icon: MapPin,
  },
  {
    title: "Useful for local Agra searches",
    desc: "If you are searching for a full-stack web development course in Agra, MERN stack course in Agra, React JS course in Agra, Node.js course in Agra, or offline coding course near Bhagwan Talkies, SkillYards is designed to help you learn with structure, projects, AI-integrated workflows, and career guidance.",
    icon: Search,
  },
];

export function FSDComparisonTable() {
  return (
    <section className="bg-card/20 py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary"
          >
            <LayoutList size={13} />
            Offline Training in Agra
          </motion.div>
          <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Offline Full-Stack Web Development Training in Agra{" "}
            <span className="italic text-primary">at SkillYards</span>
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {rows.map((row, i) => {
            const Icon = row.icon;
            return (
              <motion.div
                key={row.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-3xl border border-border bg-card p-5 shadow-sm"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                  <Icon size={18} className="text-primary" />
                </div>
                <h3 className="mb-2 font-serif text-lg font-extrabold text-foreground">
                  {row.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {row.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
