"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Minus,
  BookOpen,
  Briefcase,
  Code2,
  Megaphone,
  GraduationCap,
  HelpCircle,
  Zap,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { getFaqAnchorId } from "@/lib/seo/faqUtils";

const categoryMeta = {
  homepage: {
    icon: <HelpCircle size={18} />,
    color: "bg-primary/10 text-primary border-primary/20",
  },
  general: {
    icon: <BookOpen size={18} />,
    color:
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800",
  },
  fullstack: {
    icon: <Code2 size={18} />,
    color:
      "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-800",
  },
  digitalmarketing: {
    icon: <Megaphone size={18} />,
    color:
      "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-400 dark:border-yellow-800",
  },
  degrees: {
    icon: <GraduationCap size={18} />,
    color:
      "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-800",
  },
  support: {
    icon: <Briefcase size={18} />,
    color:
      "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-800",
  },
  test: {
    icon: <Zap size={18} />,
    color:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
  },
};

const fallbackMeta = {
  icon: <HelpCircle size={18} />,
  color: "bg-muted text-muted-foreground border-border",
};

export default function FAQsAccordion({ categories }) {
  const categoryKeys = Object.keys(categories);
  const [activeTab, setActiveTab] = useState(categoryKeys[0]);
  const [openIndex, setOpenIndex] = useState(0);

  if (!categoryKeys.length) {
    return (
      <section className="bg-background py-12 px-4 sm:px-6">
        <p className="text-center text-muted-foreground text-sm">
          No FAQs available yet.
        </p>
      </section>
    );
  }

  const current = categories[activeTab];
  const meta = categoryMeta[activeTab] ?? fallbackMeta;

  return (
    <section className="bg-background py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Left sidebar ── */}
          <aside className="lg:w-72 xl:w-80 shrink-0">
            <div className="lg:sticky lg:top-28 flex flex-col gap-2">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 px-1">
                Browse by topic
              </p>
              {categoryKeys.map((key) => {
                const m = categoryMeta[key] ?? fallbackMeta;
                const cat = categories[key];
                const isActive = activeTab === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveTab(key);
                      setOpenIndex(0);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-200 ${
                      isActive
                        ? "bg-primary text-primary-foreground border-primary shadow-md"
                        : "bg-card border-border text-foreground hover:border-primary/30 hover:bg-muted/50"
                    }`}
                  >
                    <span
                      className={`shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center ${isActive ? "bg-primary-foreground/15 border-primary-foreground/20 text-primary-foreground" : m.color}`}
                    >
                      {m.icon}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-bold truncate">
                        {cat.label}
                      </span>
                      <span
                        className={`text-[11px] ${isActive ? "text-primary-foreground/60" : "text-muted-foreground"}`}
                      >
                        {cat.faqs.length} questions
                      </span>
                    </span>
                    {isActive && (
                      <ArrowRight
                        size={14}
                        className="shrink-0 text-primary-foreground/60"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* ── Right content ── */}
          <div className="flex-1 min-w-0">
            {/* Category header */}
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-border">
              <span
                className={`w-10 h-10 rounded-xl border flex items-center justify-center ${meta.color}`}
              >
                {meta.icon}
              </span>
              <div>
                <h2 className="text-lg font-extrabold text-foreground">
                  {current.label}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {current.description}
                </p>
              </div>
              <span className="ml-auto text-xs font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border">
                {current.faqs.length} FAQs
              </span>
            </div>

            {/* Accordion */}
            <div className="space-y-2.5">
              {current.faqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                const anchorId = getFaqAnchorId(faq);
                return (
                  <div
                    key={idx}
                    id={anchorId}
                    className={`rounded-xl border transition-all duration-300 ${
                      isOpen
                        ? "border-primary/30 bg-card shadow-sm shadow-primary/5"
                        : "border-border bg-card hover:border-primary/20"
                    }`}
                  >
                    <h3 className="m-0">
                      <button
                        id={`faq-trigger-${idx}`}
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${idx}`}
                        onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`mt-0.5 shrink-0 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                          >
                            {idx + 1}
                          </span>
                          <span
                            className={`text-sm font-semibold leading-snug transition-colors ${isOpen ? "text-primary" : "text-foreground"}`}
                          >
                            {faq.question}
                          </span>
                        </div>
                        <span
                          className={`shrink-0 mt-0.5 rounded-full p-1 transition-all ${isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                        >
                          {isOpen ? <Minus size={12} /> : <Plus size={12} />}
                        </span>
                      </button>
                    </h3>
                    <motion.div
                      id={`faq-panel-${idx}`}
                      role={isOpen ? "region" : undefined}
                      aria-labelledby={`faq-trigger-${idx}`}
                      hidden={!isOpen}
                      initial={false}
                      animate={{
                        height: isOpen ? "auto" : 0,
                        opacity: isOpen ? 1 : 0,
                      }}
                      transition={{ duration: 0.22, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pl-14 pr-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                        {faq.answer}
                      </p>
                    </motion.div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Still have questions?
              </p>
              <div className="flex gap-3">
                <Link
                  href="/support"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground border border-border px-4 py-2 rounded-full hover:border-primary/40 hover:text-foreground transition-all duration-200"
                >
                  Support Center
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-sm font-bold bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition-all duration-200"
                >
                  Talk to us <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
