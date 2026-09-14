"use client";

import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-primary py-16 md:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-serif text-3xl font-extrabold leading-tight text-primary-foreground sm:text-4xl md:text-5xl"
        >
          Not sure if BBA is right for you?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mx-auto mt-4 max-w-lg text-sm text-primary-foreground/70 sm:text-base"
        >
          Talk to our counselling team. They&apos;ll ask a few questions about
          your background and interests and give you an honest recommendation.
          The call is free and takes about 15 minutes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button
            asChild
            size="lg"
            className="w-full rounded-full bg-primary-foreground px-8 py-6 text-sm font-extrabold text-primary shadow-xl transition-all hover:scale-105 hover:bg-primary-foreground/90 sm:w-auto"
          >
            <Link href="/contact">
              Book Free Counselling <ArrowRight size={17} className="ml-2" />
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-5"
        >
          <Link
            href="https://wa.me/917060100562"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary-foreground/70 underline underline-offset-4 hover:text-primary-foreground"
          >
            <MessageCircle size={15} /> Chat on WhatsApp
          </Link>
        </motion.div>

        <p className="mt-4 text-xs text-primary-foreground/40">
          No spam. No pressure. Just honest guidance.
        </p>
      </div>
    </section>
  );
}
