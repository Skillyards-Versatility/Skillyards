"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  GraduationCap,
  BriefcaseBusiness,
  Sparkles,
} from "lucide-react";

const highlights = [
  "Practical learning institute in Agra",
  "Full-stack development training in Agra",
  "Digital marketing training in Agra",
  "AI-integrated learning programs",
  "Career-focused training after 12th",
  "Job-oriented skill programs",
];

const cards = [
  {
    title: "Offline Learning",
    description:
      "Students learn in classroom settings with mentor support, routine, accountability, and practical discussions.",
    icon: GraduationCap,
  },
  {
    title: "Career-Focused Guidance",
    description:
      "Programs are structured to build practical confidence, portfolio depth, and stronger career decision-making.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Modern Learning Workflows",
    description:
      "SkillYards combines project work, mentor review, and practical AI usage in a grounded, student-friendly way.",
    icon: Sparkles,
  },
];

export default function AboutLocalSEO() {
  return (
    <section className="relative overflow-hidden bg-background py-20">
      <div className="absolute top-0 left-1/2 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h2
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl"
          >
            Offline Career-Focused Training in Agra
          </motion.h2>
          <motion.p
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="mt-5 text-lg leading-relaxed text-muted-foreground"
          >
            SkillYards offers offline classroom-based learning in Agra for
            students who want structured practical training, mentor support,
            portfolio development, and career-focused learning pathways.
          </motion.p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-border/50 bg-card/70 p-8 shadow-lg backdrop-blur-sm">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-2xl font-bold text-foreground">
                  Our Campus
                </h3>
                <div className="mt-4 space-y-1 text-base leading-relaxed text-muted-foreground">
                  <p>
                    SkillYards, A-3, behind Manoj Dhaba, Bhagwan Talkies
                    Crossing,
                  </p>
                  <p>
                    Indra Puri, New Agra Colony, Agra, Uttar Pradesh 282005.
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-8 text-base leading-relaxed text-muted-foreground">
              Whether you are searching for a practical learning institute in
              Agra, full-stack development training in Agra, digital marketing
              training in Agra, AI-integrated learning programs, career-focused
              training after 12th, or job-oriented skill programs, SkillYards is
              designed to help learners build practical, real-world skills with
              structured guidance.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {highlights.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-sm font-medium text-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            {cards.map(({ title, description, icon: Icon }) => (
              <div
                key={title}
                className="rounded-[2rem] border border-border/50 bg-card/60 p-6 shadow-md backdrop-blur-sm"
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
      </div>
    </section>
  );
}
