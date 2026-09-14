"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  MapPin,
  Users,
  Calendar,
  IndianRupee,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const programs = [
  {
    id: "bca",
    badge: "Computer Applications · Science stream",
    badgeBg: "bg-primary/10 text-primary",
    h3: "BCA with Full-Stack Development",
    whoFor:
      "12th pass students from a Science background who want a computer science degree and real coding skills, not just theory.",
    skills: [
      "MERN Stack (MongoDB, Express.js, React, Node.js)",
      "HTML, CSS, JavaScript",
      "Database Management",
      "Data Structures & Algorithms",
      "Software Engineering fundamentals",
    ],
    facts: [
      { icon: Clock, label: "Duration", value: "3 years (6 semesters)" },
      {
        icon: Clock,
        label: "Training",
        value: "Daily hands-on practical training alongside theory",
      },
      { icon: Users, label: "Eligibility", value: "12th Science, 50% minimum" },
      { icon: MapPin, label: "Mode", value: "Offline, Agra campus" },
      {
        icon: IndianRupee,
        label: "Fee",
        value: "Starting ₹5,000/month (T&C apply)",
      },
      { icon: Calendar, label: "Batch", value: "August 2026 · 35 seats" },
    ],
    cta: "Explore BCA Program",
    href: "/bca-training-program-in-agra",
    accentBorder: "border-primary/30 hover:border-primary/60",
  },
  {
    id: "bba",
    badge: "Business Administration · Any stream",
    badgeBg: "bg-secondary/20 text-secondary-foreground",
    h3: "BBA with Digital Marketing",
    whoFor:
      "12th pass students from any stream who want a business degree with practical digital marketing skills, useful for careers in marketing, management, or their own business.",
    skills: [
      "SEO (Search Engine Optimisation)",
      "Google Ads & PPC",
      "Meta Ads",
      "Social Media Strategy & Management",
      "Content Marketing",
      "Analytics & Reporting",
    ],
    facts: [
      { icon: Clock, label: "Duration", value: "3 years (6 semesters)" },
      {
        icon: Clock,
        label: "Training",
        value: "Daily hands-on practical training alongside theory",
      },
      {
        icon: Users,
        label: "Eligibility",
        value: "12th pass (any stream), 50% minimum",
      },
      { icon: MapPin, label: "Mode", value: "Offline, Agra campus" },
      {
        icon: IndianRupee,
        label: "Fee",
        value: "Starting ₹5,000/month (T&C apply)",
      },
      { icon: Calendar, label: "Batch", value: "August 2026 · 35 seats" },
    ],
    cta: "Explore BBA Program",
    href: "/bba-training-program-in-agra",
    accentBorder: "border-secondary/50 hover:border-secondary/80",
  },
];

export default function OnJobProgramCards() {
  return (
    <section id="programs" className="bg-card/20 py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
          >
            Choose Your Program
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground"
          >
            Two programs. Both are 3-year university-affiliated degrees. Both
            include daily practical training. Pick the one that fits where you
            want to go.
          </motion.p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {programs.map((prog, i) => {
            return (
              <motion.div
                key={prog.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`flex flex-col rounded-3xl border-2 bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg ${prog.accentBorder}`}
              >
                <span
                  className={`mb-4 inline-block self-start rounded-full px-3 py-1 text-xs font-bold ${prog.badgeBg}`}
                >
                  {prog.badge}
                </span>

                <h3 className="font-serif text-2xl font-extrabold text-foreground">
                  {prog.h3}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  <strong className="text-foreground">
                    Who it&apos;s for:{" "}
                  </strong>
                  {prog.whoFor}
                </p>

                <div className="mt-5">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    What you&apos;ll learn
                  </p>
                  <ul className="space-y-1.5">
                    {prog.skills.map((skill) => (
                      <li
                        key={skill}
                        className="flex items-start gap-2 text-sm text-foreground"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 space-y-2 rounded-xl border border-border bg-background/60 px-4 py-3">
                  {prog.facts.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-2 text-sm">
                      <Icon
                        size={14}
                        className="mt-0.5 shrink-0 text-primary"
                      />
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">{label}:</strong>{" "}
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <Button
                    asChild
                    className="w-full rounded-full bg-primary text-primary-foreground font-extrabold transition-all hover:scale-[1.02] shadow-md"
                  >
                    <Link
                      href={prog.href}
                      className="flex items-center justify-center gap-2"
                    >
                      {prog.cta} <ArrowRight size={17} />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
