"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { getFaqAnchorId } from "@/lib/seo/faqUtils";

const defaultFaqs = [
  {
    question: "What is the eligibility for BCA at SkillYards?",
    answer:
      "BCA requires 12th pass from a Science stream with a minimum of 50% aggregate marks. There is no entrance exam, just a counselling session to confirm the program is the right fit.",
  },
  {
    question: "Do I need prior coding experience to join?",
    answer:
      "No. The curriculum starts from fundamentals, computer basics, networking, mathematics and C/C++, before moving into full-stack development. You don't need to know how to code before joining.",
  },
  {
    question: "Is the BCA degree from a recognised university?",
    answer:
      "Yes. The BCA is university-affiliated. Details of the affiliated university are shared during your free counselling session.",
  },
  {
    question: "What is the fee for the BCA program?",
    answer:
      "The program starts from Rs 5,000 per month. EMI and instalment options are available. The exact fee depends on applicable scholarships and discounts, our counsellors walk you through the full breakdown. There are no hidden fees.",
  },
  {
    question: "What technologies will I learn?",
    answer:
      "You'll learn the MERN stack, MongoDB, Express.js, React and Node.js, along with HTML, CSS, JavaScript, Data Structures, Algorithms, Database Management and deployment. The full semester-by-semester breakdown is in the curriculum section above.",
  },
  {
    question: "How is this different from a regular BCA college?",
    answer:
      "A regular BCA college focuses on theory and exams. At SkillYards, you spend the majority of each day writing code alongside your degree subjects. You graduate with a BCA degree and a portfolio of real projects, not just a certificate.",
  },
  {
    question: "Are there placements for BCA students?",
    answer:
      "Yes. 15 students from our first batch are already placed at SN Digitech and 7th Triangle as Frontend and Full-Stack Developers at an average package of Rs 5.5 LPA. We're a young institute and we share real numbers, not inflated ones.",
  },
  {
    question: "What if I fail a university exam?",
    answer:
      "We support you through re-attempts. Your coding training continues regardless, one exam setback doesn't stop your progress with us.",
  },
  {
    question: "When does the next batch start?",
    answer:
      "August 2026. Each batch is limited to 35 seats. Once seats are filled, the next intake is a full year away.",
  },
  {
    question: "I'm not from a Science background, can I still join?",
    answer:
      "BCA requires a Science background at 12th level. If you're from Commerce or Arts, our BBA with Digital Marketing program is open to any stream. <a href='/programs/on-job-degree' class='font-bold text-primary underline underline-offset-4 hover:opacity-80'>Compare both programs</a>.",
  },
];

export function BCAFAQ({ faqs: faqsProp }) {
  const [openIndex, setOpenIndex] = useState(0);
  const faqs = faqsProp?.length ? faqsProp : defaultFaqs;

  return (
    <section className="relative overflow-hidden bg-background py-12 md:py-20">
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
