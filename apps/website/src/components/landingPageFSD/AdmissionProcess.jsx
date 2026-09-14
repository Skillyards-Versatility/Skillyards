"use client";

import { motion } from "framer-motion";
import { CreditCard, MonitorPlay, PhoneCall, Rocket } from "lucide-react";
import { FSDPrimaryDemoCTA } from "./PrimaryDemoCTA";

const steps = [
  {
    number: "01",
    icon: MonitorPlay,
    title: "Book a Free Demo Class",
    desc: "Attend a real demo session, understand the course structure, and ask your questions before you decide.",
    action: true,
  },
  {
    number: "02",
    icon: PhoneCall,
    title: "Attend Demo and Ask Questions",
    desc: "See how we teach full-stack development, practical coding, projects, and AI-assisted workflows in class.",
    action: null,
  },
  {
    number: "03",
    icon: CreditCard,
    title: "Confirm Your Seat",
    desc: "Enroll once you are satisfied. EMI and installment options are available.",
    action: null,
  },
  {
    number: "04",
    icon: Rocket,
    title: "Start Your Batch",
    desc: "Get your batch schedule, onboarding details, and begin learning from the basics into projects.",
    action: null,
  },
];

export function FSDAdmissionProcess() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary"
          >
            Admission Process
          </motion.div>
          <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Start with a{" "}
            <span className="italic text-primary">Free Demo Class.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            A simple classroom-first admission flow for learners who want to
            check the fit before enrolling.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative flex flex-col rounded-3xl border border-border bg-card p-6 shadow-sm"
              >
                <p className="mb-3 text-5xl font-black text-primary/15">
                  {step.number}
                </p>
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                  <Icon size={20} className="text-primary" />
                </div>
                <h3 className="mb-2 font-serif text-lg font-extrabold text-foreground">
                  {step.title}
                </h3>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {step.desc}
                </p>
                {step.action && (
                  <FSDPrimaryDemoCTA
                    size="sm"
                    desktopClassName="w-fit rounded-full bg-primary text-primary-foreground font-bold"
                    mobileClassName="w-fit rounded-full bg-primary text-primary-foreground font-bold"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
