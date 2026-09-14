"use client";

import { motion } from "framer-motion";
import OJTPrimaryCTA from "./OJTPrimaryCTA";

export default function OJTFinalCTA() {
  return (
    <section className="relative overflow-hidden bg-primary py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-3xl font-extrabold leading-tight text-primary-foreground sm:text-4xl md:text-5xl"
        >
          Still Confused Between{" "}
          <span className="opacity-80">Full-Stack and Digital Marketing?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-5 max-w-2xl text-base text-primary-foreground/75"
        >
          Book a free demo class or counselling session and we&apos;ll help you
          choose the right OJT program based on your interests, career goals,
          and learning style.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <OJTPrimaryCTA
            desktopClassName="w-full rounded-full bg-primary-foreground px-8 py-6 text-sm font-extrabold text-primary shadow-xl transition-all hover:scale-105 hover:bg-primary-foreground/90 sm:w-auto"
            mobileClassName="w-full max-w-sm rounded-full bg-primary-foreground px-8 py-6 text-sm font-extrabold text-primary shadow-xl transition-all hover:bg-primary-foreground/90 sm:w-auto"
          />
        </motion.div>

        <p className="mt-6 text-sm font-semibold text-primary-foreground/75">
          Next batch starting soon — contact us for the upcoming schedule.
        </p>
      </div>
    </section>
  );
}
