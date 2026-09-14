"use client";

import { motion } from "framer-motion";
import {
  ClipboardList,
  PhoneCall,
  CreditCard,
  CalendarCheck,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Inquiry",
    desc: "Fill our contact form or WhatsApp us. Takes under 2 minutes.",
  },
  {
    number: "02",
    icon: PhoneCall,
    title: "Free Counselling",
    desc: "Our team calls you within 24 hours. We understand your background and goals and help you decide if BCA or BBA is the right fit, with no pressure.",
  },
  {
    number: "03",
    icon: CreditCard,
    title: "Seat Confirmation",
    desc: "Pay the initial fee to confirm your seat. EMI and instalment options available.",
  },
  {
    number: "04",
    icon: CalendarCheck,
    title: "Batch Starts",
    desc: "Join your batch in August. 35 seats. Once they're filled, the next intake is a year away.",
  },
];

export default function OJDEligibility() {
  return (
    <section className="bg-card/20 py-20">
      <div className="mx-auto max-w-5xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
        >
          Who can apply and how to join
        </motion.h2>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Left - Eligibility */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="mb-6 font-serif text-xl font-extrabold text-foreground">
              Eligibility
            </h3>

            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <p className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">
                  For BCA
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    12th pass, Science stream required
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    Minimum 50% aggregate marks
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    No entrance exam
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    Basic computer familiarity helpful
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <p className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">
                  For BBA
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    12th pass, any stream (Science, Commerce, Arts)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    Minimum 50% aggregate marks
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    No entrance exam
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    No prior business or marketing knowledge required
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Right - How to Join */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="mb-6 font-serif text-xl font-extrabold text-foreground">
              How to join
            </h3>

            <div className="relative space-y-4">
              <div className="absolute left-6 top-8 h-[calc(100%-3rem)] w-px bg-border" />

              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="relative flex gap-4"
                  >
                    <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-background bg-primary shadow-md shadow-primary/20">
                      <Icon size={18} className="text-primary-foreground" />
                    </div>
                    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm flex-1">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Step {step.number}
                      </p>
                      <p className="mt-0.5 font-bold text-foreground">
                        {step.title}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <p className="mt-5 text-sm text-muted-foreground">
              Next batch: August 2026. Limited to 35 seats per program.
            </p>

            <Button
              asChild
              className="mt-4 rounded-full bg-primary px-8 font-extrabold text-primary-foreground shadow-lg transition-all hover:scale-105"
            >
              <Link href="/contact">
                Reserve My Seat <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
