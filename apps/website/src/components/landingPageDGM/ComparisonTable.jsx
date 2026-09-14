"use client";

import { motion } from "framer-motion";
import { CreditCard, IndianRupee, Wallet } from "lucide-react";
import { DGMPrimaryDemoCTA } from "./PrimaryDemoCTA";

export function DGMComparisonTable() {
  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary sm:px-4 sm:text-xs sm:tracking-widest"
          >
            <Wallet size={13} />
            Course Fee
          </motion.div>
          <h2 className="font-serif text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Digital Marketing{" "}
            <span className="italic text-primary">Course Fee</span>
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm text-muted-foreground sm:text-base">
            The Digital Marketing OJT program fee is ₹35,000. EMI/installment
            options are available, with plans starting from ₹5.5k/month.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-primary/5 p-5 sm:p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 sm:h-11 sm:w-11">
                <IndianRupee size={18} className="text-primary sm:h-5 sm:w-5" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Full Program Fee
              </p>
              <p className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">
                ₹35,000
              </p>
            </div>
            <div className="rounded-2xl bg-secondary/10 p-5 sm:p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 sm:h-11 sm:w-11">
                <CreditCard size={18} className="text-primary sm:h-5 sm:w-5" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Installment Option
              </p>
              <p className="mt-2 text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">
                Starting from ₹5.5k/month
              </p>
            </div>
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
            Want to understand the course, fee plan, and batch schedule? Book a
            free demo class at SkillYards.
          </p>

          <div className="mt-6 flex justify-center">
            <DGMPrimaryDemoCTA
              desktopClassName="w-full rounded-full bg-primary px-8 py-6 text-sm font-extrabold text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:scale-105 hover:bg-primary/90 sm:w-auto"
              mobileClassName="w-full max-w-sm rounded-full bg-primary px-5 py-5 text-xs font-extrabold text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:bg-primary/90"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
