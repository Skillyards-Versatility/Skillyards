"use client";

import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FinalCTA() {
  const whatsappNumber =
    process.env.NEXT_PUBLIC_PHONE?.replace(/\D/g, "") || "917060100561";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hi%2C%20I%27m%20confused%20between%20OJD%20and%20OJT%20programs.%20Can%20you%20help%20me%20choose%3F`;

  return (
    <section className="relative overflow-hidden bg-primary py-20">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-3 text-[10px] font-black uppercase tracking-widest text-primary-foreground/60"
        >
          Free Career Guidance
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-serif text-3xl font-extrabold leading-tight text-primary-foreground sm:text-4xl md:text-5xl"
        >
          Still Confused Between OJD and OJT?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mx-auto mt-4 max-w-xl text-base text-primary-foreground/75 leading-relaxed font-medium"
        >
          Get free career guidance and find the right SkillYards program based
          on your education, interest, and career goal.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          {/* Desktop/Laptop CTA: Links to contact page */}
          <Button
            asChild
            size="lg"
            className="hidden md:flex w-full rounded-full bg-primary-foreground px-8 py-6 text-xs font-black uppercase tracking-widest text-primary shadow-xl transition-all hover:scale-105 hover:bg-primary-foreground/90 sm:w-auto"
          >
            <Link href="/contact">
              Find My Right Program <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>

          {/* Mobile/Tablet CTA: Opens WhatsApp directly */}
          <Button
            asChild
            size="lg"
            className="flex md:hidden w-full rounded-full bg-primary-foreground px-8 py-6 text-xs font-black uppercase tracking-widest text-primary shadow-xl transition-all hover:scale-105 hover:bg-primary-foreground/90 sm:w-auto"
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              Find My Right Program <MessageCircle size={16} className="ml-2" />
            </a>
          </Button>
        </motion.div>

        <p className="mt-6 text-[10px] font-bold uppercase tracking-wider text-primary-foreground/50">
          No pressure • 1-on-1 counseling • Completely free
        </p>
      </div>
    </section>
  );
}
