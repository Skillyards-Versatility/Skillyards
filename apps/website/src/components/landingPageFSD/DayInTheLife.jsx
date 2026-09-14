"use client";

import { motion } from "framer-motion";
import { BadgeIndianRupee, Calendar, CreditCard, Wallet } from "lucide-react";
import { FSDPrimaryDemoCTA } from "./PrimaryDemoCTA";

const schedule = [
  {
    time: "₹50,000",
    icon: Wallet,
    title: "Full program fee",
    desc: "The Full-Stack Web Development OJT program fee is ₹50,000.",
    color: "bg-primary",
  },
  {
    time: "Starting from ₹5k/month",
    icon: CreditCard,
    title: "Installment options",
    desc: "EMI and installment options are available with plans starting from ₹5k/month.",
    color: "bg-cyan-500",
  },
  {
    time: "Book a demo",
    icon: Calendar,
    title: "Understand the course and fee plan",
    desc: "Want to understand the course, fee plan, and batch schedule? Book a free demo class at SkillYards.",
    color: "bg-purple-500",
  },
];

export function FSDDayInTheLife() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary"
          >
            <BadgeIndianRupee size={13} />
            Course Fee
          </motion.div>
          <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Full-Stack Web Development{" "}
            <span className="italic text-primary">Course Fee</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            The Full-Stack Web Development OJT program fee is ₹50,000.
            EMI/installment options are available, with plans starting from
            ₹5k/month.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {schedule.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-3xl border border-border bg-card p-5 shadow-sm"
              >
                <div
                  className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl ${item.color}`}
                >
                  <Icon size={18} className="text-white" />
                </div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
                  {item.time}
                </p>
                <h3 className="mb-2 font-serif text-lg font-extrabold text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <FSDPrimaryDemoCTA
            desktopClassName="w-full rounded-full bg-primary px-8 py-6 text-sm font-extrabold text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:scale-105 hover:bg-primary/90 sm:w-auto"
            mobileClassName="w-full max-w-sm rounded-full bg-primary px-5 py-5 text-xs font-extrabold text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:bg-primary/90"
          />
        </div>
      </div>
    </section>
  );
}
