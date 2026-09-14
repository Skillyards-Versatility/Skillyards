"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  FileText,
  PhoneCall,
  CreditCard,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const eligibility = [
  "12th pass, any stream (Science, Commerce, Arts)",
  "Minimum 50% aggregate marks",
  "No entrance exam",
  "No prior business or marketing knowledge required",
  "Basic English literacy helpful",
];

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Inquiry",
    desc: "Fill our contact form or WhatsApp us. Takes under 2 minutes.",
  },
  {
    number: "02",
    icon: PhoneCall,
    title: "Free Counselling",
    desc: "Our team calls within 24 hours. We help you decide if BBA is the right fit, no pressure.",
  },
  {
    number: "03",
    icon: CreditCard,
    title: "Seat Confirmation",
    desc: "Pay the initial fee to confirm your seat. EMI and instalment options available.",
  },
  {
    number: "04",
    icon: Calendar,
    title: "Batch Starts",
    desc: "Join your batch in August. 35 seats. Once filled, next intake is a year away.",
  },
];

export function EligibilityAndAdmission() {
  return (
    <section className="bg-background py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary"
          >
            Admission
          </motion.div>
          <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Who can apply and how to join
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Left — Eligibility */}
          <motion.div
            initial={{ opacity: 0, x: -14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border/50 bg-card p-6"
          >
            <h3 className="mb-4 font-serif text-xl font-extrabold text-foreground">
              Eligibility
            </h3>
            <ul className="space-y-3">
              {eligibility.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle
                    size={16}
                    className="mt-0.5 shrink-0 text-primary"
                  />
                  <span
                    className="text-sm text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: item }}
                  />
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right — How to Join */}
          <motion.div
            initial={{ opacity: 0, x: 14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border/50 bg-card p-6"
          >
            <h3 className="mb-4 font-serif text-xl font-extrabold text-foreground">
              How to Join
            </h3>
            <div className="space-y-4">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {step.number}
                      </div>
                      {i < steps.length - 1 && (
                        <div className="mt-1 h-full w-px bg-border" />
                      )}
                    </div>
                    <div className="pb-4">
                      <h4 className="text-sm font-bold text-foreground">
                        {step.title}
                      </h4>
                      <p
                        className="text-xs text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: step.desc }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        <div className="mt-8 text-center">
          <p className="mb-4 text-sm font-semibold text-primary">
            Next batch, August 2026. 35 seats per batch.
          </p>
          <Button
            asChild
            size="lg"
            className="rounded-full bg-primary px-8 py-6 text-sm font-extrabold text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:scale-105 hover:bg-primary/90"
          >
            <Link href="/contact">
              Reserve My Seat <ArrowRight size={17} className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
