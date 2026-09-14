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
    title: "Fill the Inquiry Form",
    desc: "Submit a quick form or drop a WhatsApp message. Takes under 2 minutes.",
    action: { label: "Start Here", href: "/contact" },
  },
  {
    number: "02",
    icon: PhoneCall,
    title: "Counselling Session",
    desc: "Our counsellor calls you within 24 hours to understand your goals and recommend the right program.",
    action: null,
  },
  {
    number: "03",
    icon: CreditCard,
    title: "Seat Confirmation & Fee",
    desc: "Confirm your seat with the initial fee payment. EMI / instalment options are available.",
    action: null,
  },
  {
    number: "04",
    icon: CalendarCheck,
    title: "Batch Starts",
    desc: "Join your batch, meet your mentors, and begin your journey toward a successful career.",
    action: null,
  },
];

export default function AdmissionProcess() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary"
          >
            <ClipboardList size={13} />
            Admission Process
          </motion.div>
          <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            4 Steps to Your{" "}
            <span className="italic text-primary">New Career.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            No complicated entrance exams. No long waiting periods. Just a
            simple, guided path to enrollment.
          </p>
        </div>

        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="absolute left-1/2 top-8 hidden h-[calc(100%-4rem)] w-px -translate-x-1/2 bg-border md:block" />

          <div className="space-y-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isEven = i % 2 === 0;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center gap-6 md:gap-10 ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  {/* Content */}
                  <div
                    className={`flex-1 rounded-2xl border border-border bg-card p-5 shadow-sm ${isEven ? "md:text-right" : "md:text-left"}`}
                  >
                    <p className="mb-1 text-4xl font-black text-primary/20">
                      {step.number}
                    </p>
                    <h3 className="mb-2 font-serif text-lg font-extrabold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {step.desc}
                    </p>
                    {step.action && (
                      <Button
                        asChild
                        size="sm"
                        className="mt-3 rounded-full bg-primary text-primary-foreground font-bold"
                      >
                        <Link href={step.action.href}>
                          {step.action.label}{" "}
                          <ArrowRight size={14} className="ml-1" />
                        </Link>
                      </Button>
                    )}
                  </div>

                  {/* Center dot */}
                  <div className="relative z-10 shrink-0">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-background bg-primary shadow-lg shadow-primary/20">
                      <Icon size={22} className="text-primary-foreground" />
                    </div>
                  </div>

                  {/* Spacer for the other side */}
                  <div className="hidden flex-1 md:block" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
