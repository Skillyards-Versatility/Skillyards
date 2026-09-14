"use client";

import React from "react";

const stats = [
  { value: "5,000+", label: "Students Enrolled" },
  { value: "Dedicated", label: "Placement Support" },
  { value: "50+", label: "Industry Partners" },
  { value: "12 LPA", label: "Avg. Starting Package" },
];

export const Stats = () => {
  return (
    <section className="py-14 md:py-20 px-4 sm:px-6 bg-background dark:bg-neutral-950 w-full border-y border-border dark:border-neutral-800">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl sm:text-3xl md:text-3xl font-serif font-extrabold text-primary tracking-tight">
                {stat.value}
              </div>
              <div className="mt-2 text-sm md:text-base text-muted-foreground dark:text-neutral-400 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
