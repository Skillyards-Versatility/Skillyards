"use client";

import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroData from "@/data/aboutpage/hero.json";

export default function AboutHero() {
  const data = heroData[0];

  if (!data) return null;

  return (
    <LazyMotion features={domAnimation}>
      <section className="relative overflow-hidden bg-background text-foreground py-12 pt-6 sm:py-24 desk:py-28">
        {/* Dynamic Background Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 blur-[100px] rounded-full translate-y-1/4 -translate-x-1/4 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid desk:grid-cols-2 gap-8 desk:gap-20 items-center">
            {/* Left Side: Content — no opacity:0 so h1 is LCP-visible immediately */}
            <m.div
              initial={{ x: -30 }}
              whileInView={{ x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="flex flex-col space-y-6 desk:space-y-8 text-center desk:text-left z-10 pt-4"
            >
              <div className="inline-block mx-auto desk:mx-0">
                <Breadcrumbs />
              </div>

              <div className="space-y-3 desk:space-y-4">
                <div className="flex justify-center desk:justify-start">
                  <p className="inline-flex rounded-full border border-primary/15 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-primary">
                    {data.badge}
                  </p>
                </div>
                <h1 className="mx-auto max-w-4xl text-3xl sm:text-5xl desk:mx-0 desk:max-w-5xl desk:text-7xl font-black tracking-tight leading-[1.1] sm:leading-[1.05] text-foreground">
                  <span className="block">{data.title}</span>
                  <span className="relative mt-2 inline-block text-primary italic sm:mt-3">
                    {data.highlight}
                    <svg
                      className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-2 sm:h-3 text-secondary/30 -z-10"
                      viewBox="0 0 100 20"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0 10 Q 25 20 50 10 T 100 10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                      />
                    </svg>
                  </span>
                </h1>
                <p className="text-lg sm:text-2xl font-semibold text-primary/80 tracking-tight">
                  {data.tagline}
                </p>
              </div>

              {(data.description1 || data.description2) && (
                <div className="space-y-4 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto desk:mx-0 font-medium">
                  {data.description1 ? <p>{data.description1}</p> : null}
                  {data.description2 ? <p>{data.description2}</p> : null}
                </div>
              )}

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center desk:justify-start pt-4 sm:pt-6">
                <a
                  href={data.primaryCTA.link}
                  className="group relative inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl
                bg-primary text-primary-foreground font-bold text-base sm:text-lg
                hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:-translate-y-1 overflow-hidden w-full sm:w-auto"
                >
                  <span className="relative z-10">{data.primaryCTA.text}</span>
                  <ArrowRight className="relative z-10 w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
                  <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </a>

                <a
                  href={data.secondaryCTA.link}
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-2xl
                border-2 border-primary/10 bg-background/50 backdrop-blur-md
                font-bold text-base sm:text-lg text-foreground hover:bg-muted hover:border-primary/20 transition-all hover:-translate-y-1 w-full sm:w-auto"
                >
                  {data.secondaryCTA.text}
                </a>
              </div>
            </m.div>

            {/* Right Side: Image */}
            <m.div
              initial={{ scale: 0.9, rotate: 1.5 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="relative w-full flex items-center justify-center pt-8 sm:pt-12 desk:pt-0"
            >
              <div className="relative w-[80%] sm:w-[60%] desk:w-full aspect-square sm:rotate-2 rounded-2xl sm:rounded-[3rem] overflow-hidden shadow-xl sm:shadow-2xl border-2 sm:border-4 border-background/50 mx-auto">
                <Image
                  src={data.image}
                  alt="SkillYards Career Training"
                  fill
                  sizes="100vw"
                  priority
                  fetchPriority="high"
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-linear-to-t from-primary/20 to-transparent mix-blend-overlay" />
              </div>
            </m.div>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}
