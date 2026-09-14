"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="relative py-16 sm:py-24 overflow-hidden bg-background">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full -mr-48 -mt-24 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Image */}
          <div className="relative w-full aspect-square max-h-[420px] max-w-[420px] md:max-h-560px md:max-w-none mx-auto md:ml-0 rounded-[2rem] overflow-hidden group shadow-2xl">
            <Image
              src="/images/Home-about.webp"
              alt="SkillYards Training Environment"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 90vw, 420px"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background/40 to-transparent pointer-events-none" />
          </div>

          {/* Right Column: Text Content */}
          <div className="flex flex-col justify-center space-y-6">
            <LazyMotion features={domAnimation}>
              <m.div
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-xs font-bold text-primary tracking-wider uppercase">
                  About SkillYards
                </span>
              </m.div>
            </LazyMotion>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
              Why Students Choose{" "}
              <span className="text-primary italic">SkillYards</span>
            </h2>

            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-xl">
              SkillYards is Agra&apos;s leading IT training institute offering
              hands-on learning in BCA, BBA, full-stack development, and digital
              marketing. We bridge the gap between college degrees and real
              industry jobs through practical training, live projects, and
              guaranteed placement support.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
              {[
                "Learn From IT Industry Experts",
                "Work on Real Company Projects",
                "100% Placement Assistance Guarantee",
                "Train on Latest Tools & Technologies",
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-primary shrink-0" />
                  <span className="text-foreground font-semibold text-sm">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 font-bold shadow-lg transition-transform hover:-translate-y-1"
              >
                <Link href="/programs">Programs</Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-border/60 bg-background/50 backdrop-blur rounded-full px-6 font-bold transition-transform hover:-translate-y-1 text-accent-foreground"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
