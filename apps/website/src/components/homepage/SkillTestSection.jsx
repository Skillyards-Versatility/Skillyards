"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Award, Brain, Sparkles } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Clock,
    title: "10 Minutes",
    desc: "Quick assessment",
  },
  {
    icon: Brain,
    title: "30 Questions",
    desc: "Multi-topic quiz",
  },
  {
    icon: Award,
    title: "Free Certificate",
    desc: "Score 70%+ to earn",
  },
];

export default function SkillTestSection() {
  return (
    <section className="relative py-16 sm:py-20 px-6 overflow-hidden bg-background">
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/8 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <LazyMotion features={domAnimation}>
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Left: Content */}
            <m.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <m.div
                initial={{ y: -10, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase"
              >
                <Sparkles size={14} />
                <span>Free Assessment</span>
              </m.div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-[1.1]">
                Free <span className="text-primary italic">10-Minute</span> IT
                Skill Test
              </h2>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg">
                Test your IT skills across web development (HTML, CSS,
                JavaScript, React, Node.js) and digital marketing (SEO, PPC,
                analytics). Score 70%+ and get a free SkillYards Certificate
                sent to your email instantly.
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-3 pt-2">
                {features.map((f, i) => (
                  <m.div
                    key={f.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-card border border-border/60 shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <f.icon size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground leading-tight">
                        {f.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {f.desc}
                      </p>
                    </div>
                  </m.div>
                ))}
              </div>

              {/* CTA Buttons */}
              <m.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <Button
                  asChild
                  size="lg"
                  className="group rounded-full bg-primary px-8 h-12 text-base font-bold text-primary-foreground shadow-lg transition-all hover:scale-105 active:scale-95"
                >
                  <Link
                    href="/10-minutes-test"
                    className="flex items-center gap-2"
                  >
                    Start Free Test
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </Button>
              </m.div>
            </m.div>

            {/* Right: Visual card */}
            <m.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-[2rem] border border-border/40 bg-card/60 backdrop-blur-md p-8 shadow-xl">
                {/* Decorative gradient */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />

                {/* Mock certificate preview */}
                <div className="relative space-y-6">
                  <div className="text-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                      <Award size={28} className="text-primary" />
                    </div>
                    <div className="text-xl font-black text-foreground">
                      SkillYards Certificate
                    </div>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                      of Achievement
                    </p>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                  {/* Mock stats */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      {
                        label: "Score",
                        value: "85%",
                        color: "text-green-600 dark:text-green-400",
                      },
                      {
                        label: "Questions",
                        value: "30",
                        color: "text-foreground",
                      },
                      { label: "Grade", value: "A", color: "text-primary" },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="text-center py-3 rounded-xl bg-background/60 border border-border/40"
                      >
                        <p className={`text-xl font-black ${stat.color}`}>
                          {stat.value}
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-0.5">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Topic badges */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {["React", "SEO", "Node.js", "PPC"].map((topic) => (
                      <span
                        key={topic}
                        className="px-3 py-1 rounded-full bg-primary/8 text-primary text-xs font-semibold border border-primary/15"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  <p className="text-center text-xs text-muted-foreground leading-relaxed">
                    Score 70%+ on the test and get this certificate emailed to
                    you instantly
                  </p>
                </div>
              </div>

              {/* Floating badge */}
              <m.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                className="absolute -top-4 -right-4 bg-green-500 text-white rounded-2xl px-4 py-2 shadow-lg text-sm font-black"
              >
                100% FREE
              </m.div>
            </m.div>
          </div>
        </LazyMotion>
      </div>
    </section>
  );
}
