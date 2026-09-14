"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import Link from "next/link";
import { getFaqAnchorId } from "@/lib/seo/faqUtils";

export default function TestFAQ({ faqs = [] }) {
  const [open, setOpen] = useState(null);

  return (
    <section className="bg-background py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
            FAQ
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-foreground">
            Questions About the Test
          </h2>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            const anchorId = getFaqAnchorId(faq);
            return (
              <div
                key={i}
                id={anchorId}
                className={`rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? "border-primary/30 bg-card shadow-sm"
                    : "border-border bg-card"
                }`}
              >
                <h3 className="m-0">
                  <button
                    id={`faq-trigger-${i}`}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span
                      className={`text-sm font-bold leading-snug transition-colors ${isOpen ? "text-primary" : "text-foreground"}`}
                    >
                      {faq.question}
                    </span>
                    <span
                      className={`shrink-0 rounded-full p-1.5 transition-all ${isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                    >
                      {isOpen ? <Minus size={13} /> : <Plus size={13} />}
                    </span>
                  </button>
                </h3>
                {isOpen && (
                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${i}`}
                  >
                    <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Still have questions?{" "}
          <Link
            href="/contact"
            className="font-bold text-primary underline underline-offset-4 hover:opacity-80"
          >
            Talk to us
          </Link>
        </p>
      </div>
    </section>
  );
}
