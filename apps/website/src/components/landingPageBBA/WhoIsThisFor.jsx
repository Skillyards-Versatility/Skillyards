"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function WhoIsThisFor() {
  const facts = [
    { label: "Stream", value: "Any, Science, Commerce, Arts" },
    { label: "Eligibility", value: "12th pass, 50% minimum" },
    { label: "Duration", value: "3 years (6 semesters)" },
    { label: "Mode", value: "Offline, Agra campus only" },
    {
      label: "Daily schedule",
      value: "Daily hands-on Digital Marketing training alongside theory",
    },
    { label: "Fee", value: "Starting ₹5,000/month (T&C apply)" },
    { label: "Batch", value: "August 2026, 35 seats" },
  ];

  return (
    <section className="bg-background py-16 md:py-20">
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
            Who should join this BBA program?
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-10 text-center">
            The BBA with Digital Marketing is built for 12th pass students from
            any stream, Science, Commerce or Arts, who want a
            university-affiliated bachelor&apos;s degree combined with practical
            digital marketing skills. No prior business or marketing knowledge
            is required. Minimum eligibility: 12th pass with 50% marks.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
            {facts.map((fact, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-border/50 bg-card/30 p-4"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground shrink-0 w-28">
                  {fact.label}
                </span>
                <span
                  className="text-sm font-semibold text-foreground"
                  dangerouslySetInnerHTML={{ __html: fact.value }}
                />
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 text-center">
            <p className="text-sm text-muted-foreground">
              Looking for a tech degree instead? If you have a Science
              background and want to learn coding in Agra, see our{" "}
              <Link
                href="/bca-training-program-in-agra"
                className="font-bold text-primary underline underline-offset-4 hover:opacity-80"
              >
                BCA with Full-Stack Development
              </Link>{" "}
              program.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
