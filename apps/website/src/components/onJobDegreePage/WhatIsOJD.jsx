"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function WhatIsOJD() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            What is the On Job Degree program?
          </h2>

          <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            The On Job Degree (OJD) at SkillYards is a university-affiliated
            3-year bachelor&apos;s degree - BCA or BBA, that integrates daily
            hands-on skill training with academic coursework. Students learn
            MERN stack development (BCA) or Digital Marketing (BBA) for the
            majority of each day alongside their degree subjects, at
            SkillYards&apos; Agra campus.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-10 overflow-x-auto rounded-2xl border border-border"
        >
          <table className="w-full min-w-[500px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-5 py-3 text-left font-bold text-foreground"></th>
                <th className="px-5 py-3 text-left font-bold text-foreground">
                  Regular College BCA/BBA
                </th>
                <th className="px-5 py-3 text-left font-bold text-primary">
                  SkillYards OJD
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  label: "Daily practical training",
                  regular: "Minimal or none",
                  ojd: "Daily hands-on practical training",
                },
                {
                  label: "Skill focus",
                  regular: "Theory-heavy syllabus",
                  ojd: "MERN stack / Digital Marketing",
                },
                {
                  label: "Degree",
                  regular: "University-affiliated",
                  ojd: "University-affiliated",
                },
                {
                  label: "Career preparation",
                  regular: "Final year only",
                  ojd: "From day one",
                },
              ].map((row, i) => (
                <tr
                  key={row.label}
                  className={`border-t border-border ${i % 2 === 0 ? "bg-background" : "bg-muted/20"}`}
                >
                  <td className="px-5 py-3 font-semibold text-foreground">
                    {row.label}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {row.regular}
                  </td>
                  <td className="px-5 py-3 font-medium text-foreground">
                    {row.ojd}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mt-8 rounded-xl border border-border bg-muted/30 px-5 py-4 text-sm leading-relaxed text-muted-foreground"
        >
          Not looking for a degree? If you already have a graduation or want a
          faster route, see our{" "}
          <Link
            href="/programs/on-job-training"
            className="font-semibold text-primary underline underline-offset-4 hover:opacity-80"
          >
            On Job Training (OJT) skill courses
          </Link>
          .
        </motion.div>
      </div>
    </section>
  );
}
