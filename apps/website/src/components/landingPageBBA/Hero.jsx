"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import Link from "next/link";

export const BBAHero = () => {
  return (
    <section
      id="hero"
      className="w-full relative bg-background overflow-hidden py-8 sm:py-10 md:py-12 lg:py-16"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 z-10 relative mt-10 sm:mt-12 md:mt-14 lg:mt-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 w-full items-center">
          {/* Left Column: Content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Breadcrumbs */}
            <div className="w-full mb-4 flex justify-center lg:justify-start">
              <Breadcrumbs
                className="text-[10px] sm:text-sm"
                items={[
                  { label: "Home", href: "/" },
                  { label: "Programs", href: "/programs" },
                  { label: "On Job Degree", href: "/programs/on-job-degree" },
                  { label: "BBA in Agra", href: null },
                ]}
              />
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs sm:text-sm font-bold mb-4 md:mb-6">
              <span>BBA &middot; Any Stream &middot; Agra</span>
            </div>

            {/* H1 */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] tracking-tighter text-foreground dark:text-neutral-50 font-extrabold">
              BBA in Agra.
              <br />
              <span className="text-primary italic">
                Learn Business by Doing Business.
              </span>
            </h1>

            {/* Body */}
            <p className="mt-4 md:mt-6 text-sm sm:text-base md:text-lg text-muted-foreground dark:text-neutral-400 max-w-xl leading-relaxed">
              This program is for students who want a BBA degree with practical
              digital marketing skills. SEO, Google Ads, Meta Ads. You learn
              them hands-on alongside your degree subjects, every day. No prior
              business knowledge needed.
            </p>

            {/* CTAs */}
            <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link href="#syllabus" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full rounded-full bg-primary text-primary-foreground px-6 md:px-8 py-5 md:py-6 text-sm md:text-base font-extrabold hover:bg-primary/90 hover:scale-105 shadow-xl shadow-primary/20 transition-all"
                >
                  See the Curriculum{" "}
                  <ArrowRight size={18} className="ml-2 shrink-0" />
                </Button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full rounded-full border-2 border-primary text-primary px-6 md:px-8 py-5 md:py-6 text-sm md:text-base font-bold hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  Book Free Counselling
                </Button>
              </Link>
            </div>

            {/* Trust Strip */}
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-5 sm:gap-y-2 items-center lg:items-start lg:justify-start">
              {[
                "BBA in Agra",
                "Any stream, 12th pass",
                "Practical training daily",
                "University-affiliated degree",
              ].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-xs text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="relative w-full aspect-video sm:aspect-video lg:aspect-4/3 rounded-2xl md:rounded-3xl overflow-hidden border border-foreground/5 dark:border-neutral-800 shadow-2xl group">
            <Image
              src="/images/BBA-PAGE.webp"
              alt="BBA in Agra - SkillYards BBA program"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-1000"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-background/80 dark:from-neutral-950/90 via-background/10 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};
