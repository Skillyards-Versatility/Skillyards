"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { getFaqAnchorId } from "@/lib/seo/faqUtils";

const defaultFaqs = [
  {
    question: "Can I join BBA if I'm from an Arts or Science background?",
    answer:
      "Yes. The BBA program is open to students from any stream, Science, Commerce or Arts. As long as you passed 12th with at least 50% marks, you are eligible. No prior business knowledge is needed.",
  },
  {
    question: "Is the BBA degree from a recognised university?",
    answer:
      "Yes. The BBA is a university-affiliated degree. You will receive a standard bachelor's degree upon completion, which qualifies you for jobs and higher studies that require a graduate degree.",
  },
  {
    question: "What is the fee for the BBA program?",
    answer:
      "Fees start at ₹5,000 per month. Exact fee structure depends on the payment plan you choose. EMI and instalment options are available. Contact us for a detailed breakdown.",
  },
  {
    question: "What Digital Marketing tools will I learn?",
    answer:
      "You will work with Google Search Console, Google Analytics, Google Ads (Search & Display), Meta Ads Manager, Ahrefs (or Semrush), WordPress, Canva, and more. The full list is in the curriculum above.",
  },
  {
    question: "How is this different from a regular BBA college in Agra?",
    answer:
      "A regular BBA teaches theory and awards a degree. This program adds 3 hours of practical Digital Marketing training every day alongside your degree. You graduate with both a BBA degree and hands-on skills in SEO, Google Ads, Meta Ads, and social media marketing.",
  },
  {
    question: "Are there placements for BBA students?",
    answer:
      "Our first BBA batch is still ongoing, so we do not have placement numbers to share yet. Placement support starts from your second year, resume building, mock interviews and direct referrals when you are ready.",
  },
  {
    question: "Do I need any prior knowledge of marketing or business?",
    answer:
      "None at all. The program starts from the basics. If you are curious about how businesses work and want to learn Digital Marketing from scratch, you have everything you need to start.",
  },
  {
    question: "What if I fail a university exam?",
    answer:
      "University exams can be retaken in the next semester. Our academic mentors help you prepare with regular tests and doubt sessions. The goal is to make sure you pass, not just to cover the syllabus.",
  },
  {
    question: "When does the next batch start?",
    answer:
      "The next batch starts in August 2026. There are 35 seats available. Once the batch is full, the next intake is a year away.",
  },
  {
    question:
      "I'm interested in coding, not marketing, should I do BCA instead?",
    answer:
      "If you enjoy coding and want to build software, BCA with Full-Stack Development is a better fit. <a href='/programs/on-job-degree' class='font-bold text-primary underline underline-offset-4 hover:opacity-80'>Compare both programs</a>.",
  },
];

export function BBAFAQ({ faqs: faqsProp }) {
  const [openIndex, setOpenIndex] = useState(0);
  const faqs = faqsProp?.length ? faqsProp : defaultFaqs;

  return (
    <section className="relative overflow-hidden bg-background py-16 md:py-20">
      <div className="pointer-events-none absolute right-0 top-0 h-[400px] w-[400px] -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6">
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
            Questions we get every day
          </h2>
          <p className="mx-auto mt-2 text-sm text-muted-foreground">
            Answered honestly, because that&apos;s how decisions should be made.
          </p>
        </div>

        <div className="space-y-2.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const anchorId = getFaqAnchorId(faq);
            return (
              <motion.div
                key={idx}
                id={anchorId}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.03 }}
                className={`rounded-2xl border transition-all duration-300 ${isOpen ? "border-primary/30 bg-card shadow-lg shadow-primary/5" : "border-border/50 bg-card/20 hover:border-border"}`}
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
                    <span
                      className={`text-sm font-bold transition-colors sm:text-base ${isOpen ? "text-primary" : "text-foreground"}`}
                    >
                      {faq.question}
                    </span>
                    <span
                      className={`ml-4 shrink-0 rounded-full p-1.5 transition-all ${isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                    >
                      {isOpen ? <Minus size={14} /> : <Plus size={14} />}
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
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                    <span dangerouslySetInnerHTML={{ __html: faq.answer }} />
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Still have questions?{" "}
          <Link
            href="/contact"
            className="font-bold text-primary underline underline-offset-4 hover:opacity-80"
          >
            Talk to our team
          </Link>
        </p>
      </div>
    </section>
  );
}
