"use client";

import React from "react";
import Image from "next/image";
import { CometCard } from "@/components/ui/comet-card";

export const Benefits = () => {
  const benefits = [
    {
      image: "/images/benefits/career-growth-flat.webp",
      title: "Career Growth",
      description:
        "Our graduates see an average salary increase of 40% within the first year of completion.",
    },
    {
      image: "/images/benefits/industry-certified-flat.webp",
      title: "Industry Certified",
      description:
        "Curriculum designed and certified by top industry leaders and global business schools.",
    },
    {
      image: "/images/benefits/fast-track-flat.webp",
      title: "Fast-Track Learning",
      description:
        "Intensive modules designed to get you job-ready in record time without compromising quality.",
    },
  ];

  return (
    <section
      id="benefits"
      className="py-[10vh] md:py-[15vh] px-4 sm:px-6 bg-linear-to-b from-background/50 to-background dark:from-neutral-900 dark:to-neutral-950 w-full"
    >
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-extrabold text-foreground dark:text-neutral-50">
            Why Choose SkillYards?
          </h2>
          <p className="text-muted-foreground dark:text-neutral-400 text-sm sm:text-base md:text-lg max-w-4xl mx-auto mt-4">
            We provide more than just education. We provide a launchpad for your
            professional success.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {benefits.map((benefit, index) => (
            <React.Fragment key={index}>
              <CometCard
                className={`hidden lg:block w-full h-full${index === benefits.length - 1 && benefits.length % 2 !== 0 ? " lg:col-span-1 lg:max-w-none lg:mx-0" : ""}`}
                rotateDepth={3}
                translateDepth={8}
              >
                <div className="group bg-card dark:bg-neutral-800 text-card-foreground dark:text-neutral-100 rounded-2xl md:rounded-3xl p-5 sm:p-6 lg:p-8 border border-border/50 dark:border-neutral-700 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 dark:hover:shadow-primary/10 transition-all duration-500 w-full h-full flex flex-col overflow-hidden">
                  <div className="w-full h-32 sm:h-36 lg:h-44 relative mb-5 sm:mb-6 rounded-xl overflow-hidden shrink-0 bg-neutral-900 group-hover:shadow-lg group-hover:scale-105 transition-all duration-500">
                    <Image
                      src={benefit.image}
                      alt={benefit.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-2xl font-bold mb-2 sm:mb-3 text-foreground dark:text-neutral-50">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground dark:text-neutral-400 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </CometCard>

              <div
                className={`${index === 2 ? "sm:hidden lg:hidden" : "flex"} lg:hidden group bg-card dark:bg-neutral-800 text-card-foreground dark:text-neutral-100 rounded-2xl md:rounded-3xl p-5 sm:p-6 border border-border/50 dark:border-neutral-700 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 dark:hover:shadow-primary/10 transition-all duration-500 w-full sm:w-[88%] sm:mx-auto h-full flex-col overflow-hidden`}
              >
                <div className="w-full h-32 sm:h-36 lg:h-44 relative mb-5 sm:mb-6 rounded-xl overflow-hidden shrink-0 bg-neutral-900 group-hover:shadow-lg group-hover:scale-105 transition-all duration-500">
                  <Image
                    src={benefit.image}
                    alt={benefit.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <h3 className="text-base sm:text-lg lg:text-2xl font-bold mb-2 sm:mb-3 text-foreground dark:text-neutral-50">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground dark:text-neutral-400 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};
