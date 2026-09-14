"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import Link from "next/link";

export const BCAHero = () => {
  return (
    <section
      id="hero"
      className="w-full relative bg-background overflow-hidden py-6 sm:py-10 md:py-12 lg:py-16"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 z-10 relative mt-6 sm:mt-12 md:mt-14 lg:mt-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 w-full items-center">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="w-full mb-4 flex justify-center lg:justify-start">
              <Breadcrumbs
                className="text-[10px] sm:text-sm"
                items={[
                  { label: "Home", href: "/" },
                  { label: "Programs", href: "/programs" },
                  { label: "On Job Degree", href: "/programs/on-job-degree" },
                  { label: "BCA in Agra", href: null },
                ]}
              />
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs sm:text-sm font-bold mb-4 md:mb-6">
              <span>BCA &middot; Science Stream &middot; Agra</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] tracking-tighter text-foreground font-extrabold">
              A Degree That Makes You
              <br />
              <span className="text-primary italic">
                a Developer, Not Just a Graduate.
              </span>
            </h1>

            <p className="mt-4 md:mt-6 text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
              SkillYards' BCA is a 3-year university-affiliated degree for
              Science stream students. Every day, alongside your college
              subjects, you build real software with the MERN stack: MongoDB,
              Express.js, React, and Node.js. By graduation, you walk out with a
              degree and a portfolio of real projects built in real code.
            </p>

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

            <div className="mt-4 sm:mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-5 sm:gap-y-2 items-center lg:items-start lg:justify-start">
              {[
                "Science stream, 12th pass",
                "Daily hands-on coding",
                "University-affiliated degree",
                "Batch starts August 2026",
              ].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-xs text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative w-full aspect-video lg:aspect-4/3 rounded-2xl md:rounded-3xl overflow-hidden border border-foreground/5 shadow-2xl group">
            <Image
              src="/images/BCA-PAGE.webp"
              alt="BCA in Agra - SkillYards BCA program"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-1000"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-background/80 via-background/10 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};
