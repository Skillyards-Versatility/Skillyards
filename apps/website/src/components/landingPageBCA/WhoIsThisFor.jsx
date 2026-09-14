"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function WhoIsThisFor() {
  const facts = [
    { label: "Stream", value: "Science (required)" },
    { label: "Eligibility", value: "12th pass, 50% minimum" },
    { label: "Duration", value: "3 years (6 semesters)" },
    {
      label: "Tech stack",
      value: "MERN (MongoDB, Express.js, React, Node.js)",
    },
    { label: "Daily schedule", value: "Practical coding + theory classes" },
    { label: "Fee", value: "Starting Rs 5,000/month (T&C apply)" },
    { label: "Mode", value: "Offline, Agra campus only" },
    { label: "Batch", value: "August 2026, 35 seats" },
  ];

  return (
    <section className="bg-background py-12 md:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary"
          >
            Who Is This For?
          </motion.div>
          <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Who Is This BCA For?
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-10 text-center">
            The BCA with Full-Stack Development at SkillYards is for 12th pass
            students from a Science stream who want a university-affiliated
            computer science degree and practical MERN stack skills. You write
            code every day alongside your degree subjects. Minimum eligibility:
            12th Science with 50% marks. No prior coding experience required.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
            {facts.map((fact, i) => (
              <div
                key={i}
                className="flex items-start gap-2 sm:gap-3 rounded-xl border border-border/50 bg-card/30 p-3 sm:p-4"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground shrink-0 w-24 sm:w-28">
                  {fact.label}
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {fact.value}
                </span>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 text-center">
            <p className="text-sm text-muted-foreground">
              Not from a Science background? Our{" "}
              <Link
                href="/bba-training-program-in-agra"
                className="font-bold text-primary underline underline-offset-4 hover:opacity-80"
              >
                BBA with Digital Marketing
              </Link>{" "}
              program is open to students from any stream.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
