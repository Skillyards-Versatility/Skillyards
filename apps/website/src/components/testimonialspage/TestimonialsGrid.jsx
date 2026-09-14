"use client";

import { useState } from "react";
import Image from "next/image";
import testimonials from "@/data/student-testimonials.json";

const filters = [
  { label: "All", match: () => true },
  {
    label: "Development",
    match: (r) =>
      /developer|engineer|devops|mern|frontend|backend|mobile|stack/i.test(r),
  },
  { label: "Marketing", match: (r) => /marketing|seo|digital/i.test(r) },
  { label: "Business", match: (r) => /business|analyst|manager|mba/i.test(r) },
  { label: "Design", match: (r) => /design|ui|ux/i.test(r) },
];

function TestimonialCard({ info }) {
  const fallback = "/images/default-avatar.jpg";
  const [src, setSrc] = useState(info.avatar || fallback);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-200 h-full">
      {/* Stars */}
      <div className="flex gap-0.5">
        {Array.from({ length: info.rating ?? 5 }).map((_, i) => (
          <span key={i} className="text-yellow-400 text-sm">
            ★
          </span>
        ))}
      </div>

      {/* Feedback */}
      <p className="text-sm text-foreground leading-relaxed flex-1">
        &ldquo;{info.feedback}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-2 border-t border-border">
        <Image
          src={src}
          alt={info.name}
          width={40}
          height={40}
          className="rounded-full object-cover w-10 h-10 shrink-0"
          onError={() => setSrc(fallback)}
        />
        <div className="min-w-0">
          <p className="font-bold text-sm text-foreground truncate">
            {info.name}
          </p>
          <p className="text-xs text-muted-foreground truncate">{info.role}</p>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsGrid() {
  const [activeFilter, setActiveFilter] = useState(0);

  const filtered = testimonials.filter((t) =>
    filters[activeFilter].match(t.role),
  );

  return (
    <section className="bg-background py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {filters.map((f, i) => (
            <button
              key={f.label}
              onClick={() => setActiveFilter(i)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                activeFilter === i
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {f.label}
              <span className="ml-1.5 text-[11px] opacity-60">
                ({testimonials.filter((t) => f.match(t.role)).length})
              </span>
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((t, i) => (
              <TestimonialCard key={`${t.name}-${i}`} info={t} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-16 text-sm">
            No reviews in this category yet.
          </p>
        )}
      </div>
    </section>
  );
}
