"use client";

import { motion } from "framer-motion";
import { Globe, Megaphone, UserCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

const projectCategories = [
  {
    title: "Website & Web App Projects",
    description:
      "Build responsive websites, e-commerce pages, admin dashboards, and full-stack applications using React, Node.js, databases, and deployment tools.",
    icon: <Globe className="w-8 h-8 text-primary" />,
    features: ["Responsive Design", "React Components", "API Integration"],
  },
  {
    title: "Marketing & Business Campaigns",
    description:
      "Create SEO strategies, Google Ads campaigns, social media content calendars, email marketing funnels, and performance analytics reports for real brands.",
    icon: <Megaphone className="w-8 h-8 text-primary" />,
    features: ["Campaign Strategy", "SEO Audits", "Content Planning"],
  },
  {
    title: "Career Preparation & Interview Readiness",
    description:
      "Build ATS-friendly resumes, optimize LinkedIn profiles, practice mock interviews, improve communication skills, and learn how to explain your projects confidently.",
    icon: <UserCheck className="w-8 h-8 text-primary" />,
    features: ["Mock Interviews", "Resume Building", "Soft Skills"],
  },
];

export default function WhatStudentsBuild() {
  return (
    <section className="relative py-24 overflow-hidden bg-background">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
              Real Projects Built by Our{" "}
              <span className="text-primary italic">Students</span>
            </h2>
            <p className="mt-6 text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Our training is hands-on from day one. Students don&apos;t just
              watch tutorials - they build real websites, run live marketing
              campaigns, and prepare job-ready portfolios that recruiters
              actually want to see.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projectCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 rounded-[2rem] border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {category.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {category.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {category.features.map((feature, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold px-3 py-1 rounded-full bg-secondary/50 text-secondary-foreground"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold text-lg shadow-lg shadow-primary/20 hover:bg-primary/90 hover:gap-3 transition-all duration-300 hover:-translate-y-1"
          >
            View All Programs & Projects
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}
