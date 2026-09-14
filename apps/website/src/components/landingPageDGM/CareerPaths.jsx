"use client";

import { motion } from "framer-motion";
import { MapPin, Users } from "lucide-react";

const localFocus = [
  {
    icon: MapPin,
    title: "Offline classroom guidance",
    text: "Learn with in-person mentor support, practical class discussion, and structured assignments at the SkillYards Agra campus.",
  },
  {
    icon: Users,
    title: "Built for local learners who want structure",
    text: "Ideal for students who prefer classroom discipline, mentor feedback, and practical project-based learning over fully self-paced study.",
  },
];

export function DGMCareerPaths() {
  return (
    <section className="bg-card/20 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary sm:px-4 sm:text-xs sm:tracking-widest"
          >
            Offline Training in Agra
          </motion.div>
          <h2 className="font-serif text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Offline Digital Marketing Training in Agra{" "}
            <span className="italic text-primary">at SkillYards</span>
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm text-muted-foreground sm:text-base">
            SkillYards offers offline digital marketing training in Agra for
            students and learners who want classroom guidance, mentor support,
            and practical project-based learning.
          </p>
          <p className="mx-auto mt-3 max-w-3xl text-sm text-muted-foreground sm:text-base">
            If you are searching for a digital marketing institute in Agra, SEO
            course in Agra, Google Ads training in Agra, Meta Ads training in
            Agra, or offline digital marketing course near Bhagwan Talkies,
            SkillYards is designed to help you learn with structure, practice,
            AI-integrated workflows, and career guidance.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {localFocus.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 sm:h-11 sm:w-11">
                  <Icon size={18} className="text-primary sm:h-5 sm:w-5" />
                </div>
                <h3 className="mb-2 font-serif text-lg font-extrabold text-foreground sm:text-xl">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
