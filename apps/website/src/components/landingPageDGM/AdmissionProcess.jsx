"use client";

import { motion } from "framer-motion";
import { Calendar, MonitorPlay, PhoneCall, Rocket } from "lucide-react";
import { DGMPrimaryDemoCTA } from "./PrimaryDemoCTA";

const steps = [
  {
    number: "01",
    icon: MonitorPlay,
    title: "Book a free demo class",
    desc: "Start with a practical classroom demo so you can understand how SkillYards teaches digital marketing in Agra.",
  },
  {
    number: "02",
    icon: PhoneCall,
    title: "Talk through course, fee, and batch fit",
    desc: "Ask about modules, AI-integrated workflow learning, fee plans, schedule, and whether the course fits your goals.",
  },
  {
    number: "03",
    icon: Calendar,
    title: "Confirm your seat",
    desc: "Choose your batch, understand installment options, and complete the admission process when you are ready.",
  },
  {
    number: "04",
    icon: Rocket,
    title: "Start offline classroom training",
    desc: "Begin the 6-month Digital Marketing OJT with practical projects, reporting work, and portfolio-ready case exercises.",
  },
];

export function DGMAdmissionProcess() {
  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mb-10 text-center sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary sm:px-4 sm:text-xs sm:tracking-widest"
          >
            Admission Process
          </motion.div>
          <h2 className="font-serif text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Start with a{" "}
            <span className="italic text-primary">Free Demo Class</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            The first step is simple: see the course, understand the structure,
            and decide with clarity.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6"
              >
                <p className="mb-3 text-4xl font-black text-primary/15 sm:text-5xl">
                  {step.number}
                </p>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 sm:h-11 sm:w-11">
                  <Icon size={18} className="text-primary sm:h-5 sm:w-5" />
                </div>
                <h3 className="mb-2 font-serif text-base font-extrabold leading-snug text-foreground sm:text-lg">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <DGMPrimaryDemoCTA
            desktopClassName="w-full rounded-full bg-primary px-8 py-6 text-sm font-extrabold text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:scale-105 hover:bg-primary/90 sm:w-auto"
            mobileClassName="w-full max-w-sm rounded-full bg-primary px-5 py-5 text-xs font-extrabold text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:bg-primary/90"
          />
        </div>
      </div>
    </section>
  );
}
