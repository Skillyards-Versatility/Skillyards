"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  FileText,
  Mic,
  Code,
  Users,
  BadgeCheck,
  Briefcase,
} from "lucide-react";

const trustStats = [
  { value: "₹3.5 LPA", label: "Average starting package" },
  { value: "100+", label: "Hiring companies" },
  { value: "50+", label: "Students placed" },
];

const programs = [
  {
    degree: "BCA",
    label: "Full-Stack Development",
    tagline: "Build things. Show the code. Get hired.",
    skills: [
      "MERN Stack development",
      "Frontend with React",
      "Backend with Node.js",
      "Database design",
      "REST APIs",
    ],
    roles: [
      "Frontend Developer",
      "Full-Stack Developer",
      "Backend Developer",
      "Junior Software Engineer",
    ],
    badgeBg: "bg-primary/10 text-primary border border-primary/20",
    skillDot: "bg-primary",
    roleBg: "bg-primary/5 text-primary border-primary/15",
  },
  {
    degree: "BBA",
    label: "Digital Marketing",
    tagline: "Run campaigns. Show results. Get hired.",
    skills: [
      "SEO and search visibility",
      "Google Ads and Meta Ads",
      "Social media management",
      "Content marketing",
      "Analytics and reporting",
    ],
    roles: [
      "Digital Marketing Executive",
      "SEO Specialist",
      "Social Media Manager",
      "Marketing Analyst",
    ],
    badgeBg:
      "bg-secondary/20 text-secondary-foreground border border-secondary/20",
    skillDot: "bg-secondary",
    roleBg: "bg-secondary/10 text-secondary-foreground border-secondary/20",
  },
];

const supportItems = [
  {
    icon: FileText,
    title: "Resume that reflects real work",
    desc: "We help you build a resume around projects and skills, not just your degree.",
  },
  {
    icon: Mic,
    title: "Mock interviews before the real ones",
    desc: "Practice rounds with honest feedback so interviews don't catch you off guard.",
  },
  {
    icon: Code,
    title: "Technical test preparation",
    desc: "Targeted prep for the coding and marketing assessments companies actually use.",
  },
  {
    icon: Users,
    title: "Direct referrals to hiring partners",
    desc: "We connect you with companies we know, not just job boards.",
  },
  {
    icon: BadgeCheck,
    title: "Support until you are placed",
    desc: "Not until you graduate. Until you have an offer letter in hand.",
  },
  {
    icon: Briefcase,
    title: "Portfolio and LinkedIn review",
    desc: "We go through your work, projects, and profile before you start applying so you put your best foot forward.",
  },
];

export default function PlacementOutcomes() {
  return (
    <section className="bg-card/20 py-20">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 max-w-2xl"
        >
          <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Skills you build here open{" "}
            <span className="italic text-primary">real doors.</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Every hour of practical training maps to a skill employers hire for.
            Here is exactly what you graduate with and where it takes you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 grid grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-card shadow-sm"
        >
          {trustStats.map((stat) => (
            <div key={stat.label} className="px-6 py-5 text-center">
              <p className="text-2xl font-extrabold text-primary sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        <div className="mb-16 grid gap-8 md:grid-cols-2">
          {programs.map((prog, i) => (
            <motion.div
              key={prog.degree}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="flex flex-col rounded-3xl border border-border bg-card shadow-sm overflow-hidden"
            >
              <div className="border-b border-border px-6 py-5">
                <span
                  className={`mb-3 inline-block rounded-full px-3 py-1 text-xs font-bold ${prog.badgeBg}`}
                >
                  {prog.degree}
                </span>
                <h3 className="font-serif text-xl font-extrabold text-foreground">
                  {prog.label}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {prog.tagline}
                </p>
              </div>

              <div className="flex flex-1 flex-col gap-6 p-6 sm:flex-row">
                <div className="flex-1">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    You learn
                  </p>
                  <ul className="space-y-2">
                    {prog.skills.map((s) => (
                      <li
                        key={s}
                        className="flex items-start gap-2 text-sm text-foreground"
                      >
                        <span
                          className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${prog.skillDot}`}
                        />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="hidden sm:flex items-center">
                  <ArrowRight size={20} className="text-border" />
                </div>

                <div className="flex-1">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    You can go for
                  </p>
                  <ul className="space-y-2">
                    {prog.roles.map((r) => (
                      <li key={r}>
                        <span
                          className={`inline-block rounded-lg border px-3 py-1.5 text-xs font-semibold ${prog.roleBg}`}
                        >
                          {r}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-primary px-8 py-10 text-primary-foreground"
        >
          <div className="mb-8">
            <h3 className="font-serif text-2xl font-extrabold sm:text-3xl">
              We don&apos;t stop at graduation.
            </h3>
            <p className="mt-2 text-sm text-primary-foreground/70">
              Getting placed takes more than a degree. Here is what we do with
              every student, from the final semester until they have an offer.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {supportItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="rounded-2xl bg-primary-foreground/10 p-5"
                >
                  <Icon size={20} className="mb-3 text-primary-foreground/80" />
                  <p className="mb-1 text-sm font-bold text-primary-foreground">
                    {item.title}
                  </p>
                  <p className="text-xs leading-relaxed text-primary-foreground/65">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
