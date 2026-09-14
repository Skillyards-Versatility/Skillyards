"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, FolderGit2 } from "lucide-react";

const projects = [
  {
    name: "Personal portfolio website",
    type: "Frontend foundation project",
    month: "Early portfolio",
    desc: "A responsive site that introduces you, your projects, and your coding foundation.",
    stack: ["HTML", "CSS", "Responsive Design"],
  },
  {
    name: "React frontend project",
    type: "Component-based UI build",
    month: "Frontend milestone",
    desc: "A practical React project focused on routing, components, state, and layout structure.",
    stack: ["React", "Components", "Routing"],
  },
  {
    name: "API-based application",
    type: "Backend and API practice",
    month: "Backend milestone",
    desc: "A project that focuses on routes, requests, responses, and practical API handling.",
    stack: ["Node.js", "Express", "APIs"],
  },
  {
    name: "Full-stack MERN application",
    type: "Integrated project build",
    month: "Full-stack milestone",
    desc: "A project that connects frontend, backend, database logic, and deployment workflow.",
    stack: ["React", "Node.js", "Express", "MongoDB"],
  },
  {
    name: "Authentication-based project",
    type: "Protected routes and login flows",
    month: "Security milestone",
    desc: "A project that includes login, protected access, and user-based features.",
    stack: ["JWT/Auth", "Forms", "Protected Routes"],
  },
  {
    name: "Dashboard or admin panel style project",
    type: "Data-view project",
    month: "Applied workflow",
    desc: "A project that handles structured data, basic management flows, and interactive UI patterns.",
    stack: ["CRUD", "Dashboards", "State"],
  },
  {
    name: "Deployed project with GitHub README",
    type: "Presentation-ready project",
    month: "Deployment milestone",
    desc: "A deployed application with clear repository structure, README writing, and walkthrough notes.",
    stack: ["Deployment", "GitHub", "README"],
  },
  {
    name: "AI-assisted documentation and testing notes",
    type: "Developer workflow support",
    month: "Final presentation",
    desc: "Project notes that show how you use AI-assisted debugging, documentation, and test-case thinking responsibly.",
    stack: ["Documentation", "AI Workflow", "Testing Notes"],
  },
];

export function FSDPortfolioProjects() {
  const [showAll, setShowAll] = useState(false);

  return (
    <section className="bg-card/20 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary"
          >
            <FolderGit2 size={13} />
            Portfolio Projects
          </motion.div>
          <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Build Portfolio-Ready{" "}
            <span className="italic text-primary">Full-Stack Projects.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            By the end of the course, students learn how to build, document,
            deploy, and present full-stack projects that can support interviews,
            GitHub reviews, portfolio discussions, and career conversations.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((project, i) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`${!showAll && i >= 4 ? "hidden sm:flex" : "flex"} flex-col rounded-3xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md`}
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <span className="mb-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                    {project.month}
                  </span>
                  <h3 className="font-serif text-lg font-extrabold text-foreground">
                    {project.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {project.type}
                  </p>
                </div>
              </div>

              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                {project.desc}
              </p>

              <div className="mb-4 flex flex-wrap gap-1.5">
                {project.stack.map((stack) => (
                  <span
                    key={stack}
                    className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                  >
                    {stack}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex items-center gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
                <FileText size={13} className="text-primary" />
                Interview and portfolio discussion ready
              </div>
            </motion.div>
          ))}
        </div>

        {projects.length > 4 && (
          <div className="mt-5 flex justify-center sm:hidden">
            <button
              type="button"
              onClick={() => setShowAll((value) => !value)}
              className="rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-primary"
            >
              {showAll ? "Show less" : "Show more"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
