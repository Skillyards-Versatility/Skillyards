"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Users,
  FileText,
  Award,
  Laptop,
  MessageSquare,
  Briefcase,
  Code,
  Trophy,
  Check,
  X,
} from "lucide-react";
import { motion } from "framer-motion";

const comparisonData = [
  {
    icon: BookOpen,
    aspect: "Approach",
    traditional: "Focused on theory, bound by the syllabus and BBA Course",
    skillyards:
      "Practical, skill-based, and industry-aligned BBA Course with a focus on real-world application.",
  },
  {
    icon: Users,
    aspect: "Learning Style",
    traditional:
      "Traditional passive learning through lectures, textbook reading, and minimal interaction.",
    skillyards:
      "Active learning via hands-on workshops, live projects, and interactive sessions.",
  },
  {
    icon: FileText,
    aspect: "Content Relevance",
    traditional:
      "Often outdated, emphasizing broad theoretical concepts with limited real-world application and relevance.",
    skillyards:
      "Continuously updated to reflect the latest market trends and industry requirements.",
  },
  {
    icon: Award,
    aspect: "Focus Area",
    traditional:
      "Academic performance is measured through assessments, exams, and theoretical learning.",
    skillyards:
      "Career readiness, application of knowledge, real-world problem-solving, and industry exposure.",
  },
  {
    icon: Laptop,
    aspect: "Technology Exposure",
    traditional:
      "Restricted to conventional or outdated tools and software, lacking exposure to modern industry technologies.",
    skillyards:
      "Exposure to modern, cutting-edge technologies like SEO, SMM, CMS, PPC, and more.",
  },
  {
    icon: MessageSquare,
    aspect: "Soft Skills",
    traditional:
      "Traditional lectures with minimal focus on personal growth or professional etiquette.",
    skillyards:
      "Strong emphasis on developing communication, teamwork, leadership, and professional confidence.",
  },
  {
    icon: Briefcase,
    aspect: "Career Preparation",
    traditional:
      "Provides limited career support, focusing mainly on academic performance and exam scores.",
    skillyards:
      "Comprehensive support including resume building, LinkedIn optimization, and guaranteed placements.",
  },
  {
    icon: Code,
    aspect: "Project Work",
    traditional:
      "Primarily theory-based assignments and documentation with minimal practical engagement.",
    skillyards:
      "Real-world, portfolio-worthy projects that offer practical experience and problem-solving.",
  },
  {
    icon: Trophy,
    aspect: "Outcome",
    traditional:
      "Graduates often lack practical skills and industry exposure for immediate job readiness.",
    skillyards:
      "Graduates equipped with relevant skills and industry experience, with placement guarantees up to 20 LPA.",
  },
];

export const ComparisonSection = () => {
  const [showAllComparison, setShowAllComparison] = useState(false);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const visibleComparisonData = showAllComparison
    ? comparisonData
    : comparisonData.slice(0, 3);

  return (
    <section className="py-[10vh] md:py-[15vh] bg-background dark:bg-neutral-950 relative overflow-hidden w-full">
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10 opacity-40 dark:opacity-20">
        <div className="absolute top-1/3 left-1/4 w-75 md:w-125 h-75 md:h-125 bg-primary/10 rounded-full blur-[80px] md:blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-bold tracking-widest uppercase text-xs sm:text-sm mb-2 block"
          >
            Comparison
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-extrabold mb-2 sm:mb-4 tracking-tight text-foreground dark:text-neutral-50"
          >
            SkillYards <span className="text-primary italic">vs</span>{" "}
            Traditional
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-muted-foreground dark:text-neutral-400 text-xs sm:text-sm md:text-base max-w-3xl mx-auto leading-relaxed"
          >
            Why our skill-first approach is the future of business education
          </motion.p>
        </div>

        {/* Comparison Table - Desktop */}
        <div className="hidden lg:block">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-xl md:rounded-2xl border border-border/30 dark:border-neutral-800 bg-card/50 dark:bg-neutral-900/50 backdrop-blur-sm overflow-hidden"
          >
            <div className="w-full">
              {/* Header Row */}
              <div className="grid grid-cols-3 bg-primary/5 dark:bg-primary/10 border-b border-border/30 dark:border-neutral-800">
                <div className="px-4 py-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground dark:text-neutral-400">
                    Aspect
                  </span>
                </div>
                <div className="px-4 py-4 border-l border-border/30 dark:border-neutral-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground dark:text-neutral-400">
                    Traditional
                  </span>
                </div>
                <div className="px-4 py-4 border-l border-border/30 dark:border-neutral-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    SkillYards
                  </span>
                </div>
              </div>

              {/* Data Rows */}
              {comparisonData.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="grid grid-cols-3 border-b border-border/20 dark:border-neutral-800 hover:bg-muted/30 dark:hover:bg-neutral-800/30 transition-colors"
                  >
                    {/* Aspect Column */}
                    <div className="px-4 py-4 flex items-start gap-3">
                      <div className="w-5 h-5 text-primary shrink-0 mt-0.5">
                        <IconComponent size={18} />
                      </div>
                      <span className="text-sm font-bold text-foreground dark:text-neutral-200 uppercase tracking-tight">
                        {item.aspect}
                      </span>
                    </div>

                    {/* Traditional Column */}
                    <div className="px-4 py-4 border-l border-border/20 dark:border-neutral-800">
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-red-500/60 shrink-0 mt-0.5" />
                        <p className="text-sm text-foreground/70 dark:text-neutral-400 leading-snug">
                          {item.traditional}
                        </p>
                      </div>
                    </div>

                    {/* SkillYards Column */}
                    <div className="px-4 py-4 border-l border-border/20 dark:border-neutral-800 bg-primary/5 dark:bg-primary/5">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-sm font-medium text-foreground dark:text-neutral-100 leading-snug">
                          {item.skillyards}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Comparison Cards - Mobile & Tablet */}
        <div className="hidden md:block lg:hidden">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-xl md:rounded-2xl border border-border/30 dark:border-neutral-800 bg-card/50 dark:bg-neutral-900/50 backdrop-blur-sm overflow-hidden"
          >
            <div className="w-full">
              <div className="grid grid-cols-3 bg-primary/5 dark:bg-primary/10 border-b border-border/30 dark:border-neutral-800">
                <div className="px-4 py-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground dark:text-neutral-400">
                    Aspect
                  </span>
                </div>
                <div className="px-4 py-4 border-l border-border/30 dark:border-neutral-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground dark:text-neutral-400">
                    Traditional
                  </span>
                </div>
                <div className="px-4 py-4 border-l border-border/30 dark:border-neutral-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    SkillYards
                  </span>
                </div>
              </div>

              {visibleComparisonData.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="grid grid-cols-3 border-b border-border/20 dark:border-neutral-800 hover:bg-muted/30 dark:hover:bg-neutral-800/30 transition-colors"
                  >
                    <div className="px-4 py-4 flex items-start gap-3">
                      <div className="w-5 h-5 text-primary shrink-0 mt-0.5">
                        <IconComponent size={18} />
                      </div>
                      <span className="text-sm font-bold text-foreground dark:text-neutral-200 uppercase tracking-tight">
                        {item.aspect}
                      </span>
                    </div>

                    <div className="px-4 py-4 border-l border-border/20 dark:border-neutral-800">
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-red-500/60 shrink-0 mt-0.5" />
                        <p className="text-sm text-foreground/70 dark:text-neutral-400 leading-snug">
                          {item.traditional}
                        </p>
                      </div>
                    </div>

                    <div className="px-4 py-4 border-l border-border/20 dark:border-neutral-800 bg-primary/5 dark:bg-primary/5">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-sm font-medium text-foreground dark:text-neutral-100 leading-snug">
                          {item.skillyards}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {!showAllComparison && (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAllComparison(true)}
                className="inline-flex items-center justify-center rounded-2xl border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition hover:bg-accent"
              >
                Load More Comparison
              </button>
            </div>
          )}
        </div>

        <div className="md:hidden space-y-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {visibleComparisonData.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="rounded-lg border border-border/30 dark:border-neutral-800 bg-card/50 dark:bg-neutral-900/50 backdrop-blur-sm overflow-hidden"
                >
                  {/* Aspect Header */}
                  <div className="bg-primary/5 dark:bg-primary/10 px-4 py-3 flex items-center gap-3 border-b border-border/20 dark:border-neutral-800">
                    <div className="w-5 h-5 text-primary shrink-0">
                      <IconComponent size={18} />
                    </div>
                    <span className="font-bold text-sm text-foreground dark:text-neutral-200 uppercase tracking-tight">
                      {item.aspect}
                    </span>
                  </div>

                  {/* Comparison Grid */}
                  <div className="grid grid-cols-2">
                    {/* Traditional */}
                    <div className="px-4 py-3 border-r border-border/20 dark:border-neutral-800">
                      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground dark:text-neutral-400 mb-2">
                        Traditional
                      </div>
                      <div className="flex items-start gap-2">
                        <X className="w-3.5 h-3.5 text-red-500/60 shrink-0 mt-0.5" />
                        <p className="text-xs text-foreground/70 dark:text-neutral-400 leading-snug">
                          {item.traditional}
                        </p>
                      </div>
                    </div>

                    {/* SkillYards */}
                    <div className="px-4 py-3 bg-primary/5 dark:bg-primary/5">
                      <div className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
                        SkillYards
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        <p className="text-xs font-medium text-foreground dark:text-neutral-100 leading-snug">
                          {item.skillyards}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {!showAllComparison && (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAllComparison(true)}
                className="inline-flex items-center justify-center rounded-2xl border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition hover:bg-accent"
              >
                Load More Comparison
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
