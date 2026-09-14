"use client";

import { motion } from "framer-motion";
import { CheckCircle, LayoutList } from "lucide-react";

const programs = ["BCA", "BBA"];

const rows = [
  { label: "Duration", values: ["3 Years", "3 Years"] },
  { label: "Type", values: ["University Degree", "University Degree"] },
  { label: "On-Job Training", values: ["Guaranteed", "Guaranteed"] },
  { label: "Eligibility", values: ["12th pass (50%+)", "12th pass (50%+)"] },
  {
    label: "Certification",
    values: ["UG Degree + Industrial Certs", "UG Degree + Marketing Certs"],
  },
  {
    label: "Core Skills",
    values: ["Coding, Dev, Cloud", "Management, Digital Marketing"],
  },
  {
    label: "Placement Support",
    values: ["100% Assistance", "100% Assistance"],
  },
  { label: "Mode", values: ["Offline (Campus)", "Offline (Campus)"] },
  { label: "Ideal For", values: ["Tech Careers", "Business & Marketing"] },
  { label: "EMI Available", values: ["Yes", "Yes"] },
];

export default function OnJobComparisonTable() {
  return (
    <section className="bg-card/30 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary"
          >
            <LayoutList size={13} />
            Side-by-Side Comparison
          </motion.div>
          <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Choose the Best Path for{" "}
            <span className="italic text-primary">Your Future.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">
            Both programs offer university degrees with guaranteed on-job
            training. Compare the specifics to decide.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-x-auto rounded-3xl border border-border shadow-sm max-w-4xl mx-auto"
        >
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="rounded-tl-3xl px-6 py-4 text-left font-bold">
                  Feature
                </th>
                {programs.map((p, i) => (
                  <th
                    key={p}
                    className={`px-5 py-4 text-center font-bold ${i === programs.length - 1 ? "rounded-tr-3xl" : ""}`}
                  >
                    {p}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr
                  key={ri}
                  className={`border-t border-border transition-colors hover:bg-primary/5 ${ri % 2 === 0 ? "bg-background" : "bg-card/50"}`}
                >
                  <td className="px-6 py-4 font-semibold text-foreground">
                    {row.label}
                  </td>
                  {row.values.map((val, vi) => (
                    <td
                      key={vi}
                      className="px-5 py-4 text-center text-muted-foreground"
                    >
                      {val === "Yes" ? (
                        <CheckCircle
                          size={16}
                          className="mx-auto text-green-500"
                        />
                      ) : (
                        val
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
