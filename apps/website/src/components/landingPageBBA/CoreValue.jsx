"use client";

import React, { useState } from "react";
import {
  UserCheck,
  Briefcase,
  Target,
  ShieldCheck,
  Video,
  Sliders,
  Building2,
  GraduationCap,
  Activity,
} from "lucide-react";

const coreValues = [
  {
    title: "1:1 Mentorship",
    description:
      "Tailored advice from experienced instructors who have walked your desired path.",
    icon: UserCheck,
  },
  {
    title: "Real-World Projects",
    description:
      "Tackle real challenges and industry scenarios to build a standout portfolio.",
    icon: Briefcase,
  },
  {
    title: "Career Support",
    description:
      "From resume crafting to strategic career planning we've got you covered.",
    icon: Target,
  },
  {
    title: "Placement Guarantee",
    description:
      "Secure your dream career with confidence through our robust hiring network.",
    icon: ShieldCheck,
  },
  {
    title: "In-Person Interactive Classes",
    description:
      "Participate in classroom sessions with experts, ask questions, and gain insights.",
    icon: Video,
  },
  {
    title: "Customized Content",
    description:
      "Courses aligned with your goals and customized to your preferences.",
    icon: Sliders,
  },
  {
    title: "Elite Hiring Partners",
    description:
      "Connect with leading MNCs eager to hire skilled professionals from SkillYards.",
    icon: Building2,
  },
  {
    title: "Top-Tier Instructors",
    description:
      "Industry experts who bring real value and practical knowledge to every class.",
    icon: GraduationCap,
  },
  {
    title: "Industry Immersion",
    description:
      "Hands-on workshops and guest lectures that prepare you for the real world.",
    icon: Activity,
  },
];

export const CoreValues = () => {
  const [showAllPillars, setShowAllPillars] = useState(false);

  return (
    <section className="py-16 md:py-24 bg-background dark:bg-neutral-950 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 max-w-2xl mx-auto">
          <span className="text-primary font-bold tracking-widest uppercase text-xs sm:text-sm mb-3 block">
            The SkillYards Pillars
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-extrabold tracking-tight text-foreground dark:text-neutral-50">
            Learning Today,{" "}
            <span className="text-primary italic">Earning Tomorrow.</span>
          </h2>
        </div>

        {/* Bento-style grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border dark:bg-neutral-800 rounded-2xl md:rounded-3xl overflow-hidden border border-border dark:border-neutral-800">
          {coreValues.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className={`group bg-background dark:bg-neutral-950 p-5 sm:p-6 md:p-8 hover:bg-primary/3 dark:hover:bg-primary/6 transition-colors duration-300 relative ${index < 4 || showAllPillars ? "block" : "hidden lg:block"}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-primary/10 dark:bg-primary/15 flex items-center justify-center shrink-0 group-hover:bg-primary/20 dark:group-hover:bg-primary/25 transition-colors duration-300">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm md:text-base font-bold text-foreground dark:text-neutral-100 mb-1.5">
                      {value.title}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground dark:text-neutral-400 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!showAllPillars && (
          <div className="mt-4 flex justify-center lg:hidden">
            <button
              type="button"
              onClick={() => setShowAllPillars(true)}
              className="inline-flex items-center justify-center rounded-2xl border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition hover:bg-accent"
            >
              Load More Pillars
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
