"use client";

import React from "react";
import { Sparkles, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const highlights = [
  "Placement Guaranteed",
  "Direct Mentorship",
  "Global Exposure",
];

export const BBA_CTA = () => {
  return (
    <section className="py-12 md:py-20 w-full bg-background dark:bg-neutral-950 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-primary text-primary-foreground dark:bg-primary/95">
          {/* Subtle decorative circles */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-foreground/5 rounded-full pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-secondary/10 rounded-full pointer-events-none" />

          <div className="relative z-10 p-6 sm:p-10 md:p-14 lg:p-16 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-foreground/10 text-primary-foreground text-xs sm:text-sm font-bold mb-6 md:mb-8 border border-primary-foreground/15">
              <Sparkles size={14} className="text-primary-foreground" />
              <span>Limited Seats Available for 2026 Batch</span>
            </div>

            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-extrabold leading-[1.1] tracking-tight mb-4 md:mb-6">
              Ready to Transform <br className="hidden sm:block" />
              Your{" "}
              <span className="italic text-shadow-primary-foreground">
                Future?
              </span>
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed mb-8 md:mb-10">
              Join the only BBA program designed to build{" "}
              <span className="font-bold text-primary-foreground">
                industry-ready leadership
              </span>{" "}
              and digital mastery.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mb-8 md:mb-10">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full rounded-full bg-primary-foreground text-primary px-8 md:px-12 py-5 md:py-6 text-sm md:text-base font-extrabold hover:bg-secondary hover:text-secondary-foreground transition-all shadow-lg shadow-black/10 dark:shadow-black/30"
                >
                  Enroll Now <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>

              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_PHONE?.replace(/\D/g, "") || "917060100561"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full rounded-full border-2 border-primary-background bg-primary text-background px-8 md:px-12 py-5 md:py-6 text-sm md:text-base font-bold  transition-all"
                >
                  Chat on WhatsApp
                </Button>
              </a>
            </div>

            {/* Highlights */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-6 border-t border-primary-foreground/10">
              {highlights.map((text) => (
                <div key={text} className="flex items-center gap-1.5">
                  <Check
                    size={14}
                    strokeWidth={3}
                    className="text-secondary shrink-0"
                  />
                  <span className="text-primary-foreground/60 text-xs md:text-sm font-bold uppercase tracking-wider">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
