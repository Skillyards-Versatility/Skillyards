"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { getFaqAnchorId } from "@/lib/seo/faqUtils";

export default function ProgramsFAQ({
  faqs = [],
  title = "Questions About",
  highlightTitle = "SkillYards Programs",
}) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="relative bg-background py-20 overflow-hidden">
      <div className="pointer-events-none absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[120px] -mr-48 -mt-48" />

      <div className="relative z-10 mx-auto max-w-3xl px-6">
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary"
          >
            <HelpCircle size={13} />
            FAQ
          </motion.div>
          <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {title}{" "}
            <span className="italic text-primary">{highlightTitle}</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Answered clearly so students and parents can understand how these programs work.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const anchorId = getFaqAnchorId(faq);
            return (
              <motion.div
                key={idx}
                id={anchorId}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className={`rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? "border-primary/30 bg-card/60 shadow-lg shadow-primary/5"
                    : "border-border/50 bg-card/20 hover:border-border"
                }`}
              >
                <h3 className="m-0">
                  <button
                    id={`faq-trigger-${idx}`}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${idx}`}
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-5 text-left"
                  >
                    <span className={`text-base font-bold transition-colors ${isOpen ? "text-primary" : "text-foreground"}`}>
                      {faq.question}
                    </span>
                    <span
                      className={`ml-4 shrink-0 rounded-full p-1.5 transition-all ${
                        isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isOpen ? <Minus size={15} /> : <Plus size={15} />}
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
                    opacity: isOpen ? 1 : 0
                  }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Still have questions?{" "}
          <Link href="/contact" className="font-bold text-primary underline underline-offset-4 hover:opacity-80">
            Talk to our team
          </Link>
        </p>
      </div>
    </section>
  );
}
