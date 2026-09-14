"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronDown } from "lucide-react";

const months = [
  {
    month: "Month 1",
    title: "HTML, CSS, Responsive Design",
    hours: "Foundation month",
    color: "bg-blue-500",
    topics: [
      "HTML5 structure",
      "CSS fundamentals",
      "Responsive design",
      "Flexbox and Grid",
      "VS Code workflow",
      "First static website deployment",
    ],
    builds: "Personal portfolio website",
  },
  {
    month: "Month 2",
    title: "JavaScript Fundamentals and DOM",
    hours: "Core coding month",
    color: "bg-yellow-500",
    topics: [
      "Variables, functions, loops, arrays",
      "Objects and events",
      "DOM manipulation",
      "Browser storage",
      "Async JavaScript basics",
      "Interactive UI exercises",
    ],
    builds: "JavaScript project with DOM interactions",
  },
  {
    month: "Month 3",
    title: "Git, GitHub, and React JS",
    hours: "Frontend build month",
    color: "bg-cyan-500",
    topics: [
      "Git and GitHub workflow from early stage",
      "React fundamentals",
      "Components, props, state",
      "React Router basics",
      "Frontend architecture",
      "Responsive React project structure",
    ],
    builds: "React frontend project",
  },
  {
    month: "Month 4",
    title: "Node.js, Express, and APIs",
    hours: "Backend month",
    color: "bg-purple-500",
    topics: [
      "Node.js runtime",
      "Express routing and middleware",
      "REST API basics",
      "Authentication flow",
      "Postman testing",
      "Error handling and debugging",
    ],
    builds: "API-based application",
  },
  {
    month: "Month 5",
    title: "MongoDB and Full-Stack Integration",
    hours: "Integration month",
    color: "bg-green-500",
    topics: [
      "MongoDB and data modelling",
      "CRUD and schema basics",
      "React with backend APIs",
      "Full-stack integration",
      "Deployment workflow",
      "Database-backed features",
    ],
    builds: "Full-stack MERN application",
  },
  {
    month: "Month 6",
    title: "Deployment, AI Workflows, and Career Prep",
    hours: "Portfolio month",
    color: "bg-red-500",
    topics: [
      "Deployment practice",
      "AI-assisted coding workflows",
      "README and documentation",
      "Code review and debugging",
      "Portfolio preparation",
      "Placement preparation",
    ],
    builds: "Deployed project with GitHub README and portfolio notes",
  },
];

export function FSDCurriculum() {
  const [open, setOpen] = useState(0);

  return (
    <section className="bg-card/20 py-20">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary"
          >
            <BookOpen size={13} />
            Curriculum Month by Month
          </motion.div>
          <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            What You Learn Across 6 Months,{" "}
            <span className="italic text-primary">Step by Step.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            The curriculum moves from basics into React, backend, databases,
            deployment, AI-assisted coding workflows, and portfolio preparation.
          </p>
        </div>

        <div className="space-y-3">
          {months.map((m, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className={`rounded-2xl border transition-all duration-300 ${isOpen ? "border-primary/30 bg-card shadow-lg" : "border-border bg-card/50 hover:border-border/80"}`}
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between p-5 text-left"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`h-3 w-3 shrink-0 rounded-full ${m.color}`}
                    />
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {m.month}
                      </span>
                      <h3
                        className={`font-bold text-base transition-colors ${isOpen ? "text-primary" : "text-foreground"}`}
                      >
                        {m.title}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="hidden text-xs text-muted-foreground sm:block">
                      {m.hours}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="border-t border-border px-5 pb-5 pt-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                              Topics Covered
                            </p>
                            <ul className="space-y-1.5">
                              {m.topics.map((t) => (
                                <li
                                  key={t}
                                  className="flex items-start gap-2 text-sm text-muted-foreground"
                                >
                                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                  {t}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex flex-col justify-start gap-3">
                            <div className="rounded-xl border border-primary/10 bg-primary/5 p-4">
                              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-primary">
                                What you build
                              </p>
                              <p className="text-sm font-semibold text-foreground">
                                {m.builds}
                              </p>
                            </div>
                            <div className="rounded-xl bg-muted/30 p-3">
                              <p className="text-xs text-muted-foreground">
                                <strong className="text-foreground">
                                  Focus:
                                </strong>{" "}
                                {m.hours}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
