"use client";

import { motion } from "framer-motion";
import { Users, Building2, Code, IndianRupee } from "lucide-react";

const metrics = [
  { icon: Users, value: "15", label: "students placed, first batch" },
  {
    icon: Building2,
    value: "SN Digitech & 7th Triangle",
    label: "companies hiring our graduates",
    small: true,
  },
  { icon: Code, value: "Frontend & Full-Stack", label: "developer roles" },
  { icon: IndianRupee, value: "5.5 LPA", label: "average starting package" },
];

export function Placement() {
  return (
    <section className="bg-card/20 py-12 md:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary"
          >
            Placements
          </motion.div>
          <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Where our graduates are working
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            SkillYards started in 2023. Our first batch is still in progress. 15
            students from our program are already placed. Here is exactly where
            they work and what they do.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {metrics.map((m, i) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-border/50 bg-card p-5 sm:p-6 text-center shadow-sm"
              >
                <div className="flex items-center justify-center mb-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <Icon size={20} className="text-primary" />
                  </div>
                </div>
                <div
                  className={`font-serif font-extrabold text-foreground ${m.small ? "text-sm" : "text-2xl sm:text-3xl"}`}
                >
                  {m.value}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {m.label}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 sm:mt-8 rounded-2xl border border-border/50 bg-card p-4 sm:p-5 text-center">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Resume building, GitHub portfolio review, mock technical interviews
            and direct referrals. We work with you until you&apos;re placed, not
            just until you graduate. Support begins from your second year.
          </p>
        </div>

        <div className="mt-4 sm:mt-6 rounded-2xl border border-dashed border-muted-foreground/30 bg-card/20 p-4 sm:p-5 text-center">
          <p className="text-xs italic text-muted-foreground/60">
            [Testimonial to be added, awaiting student approval]
          </p>
        </div>
      </div>
    </section>
  );
}
