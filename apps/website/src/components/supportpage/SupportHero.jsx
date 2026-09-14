"use client";

import {
  Search,
  BookOpen,
  CreditCard,
  Briefcase,
  FileText,
} from "lucide-react";
import { useState } from "react";

const quickLinks = [
  {
    label: "Admission Process",
    icon: <BookOpen size={13} />,
    href: "#admissions",
  },
  { label: "Fees & Payments", icon: <CreditCard size={13} />, href: "#fees" },
  {
    label: "Placement Support",
    icon: <Briefcase size={13} />,
    href: "#placement",
  },
  {
    label: "Certificates",
    icon: <FileText size={13} />,
    href: "#certificates",
  },
];

export default function SupportHero() {
  const [query, setQuery] = useState("");

  return (
    <section className="relative bg-primary overflow-hidden pt-24 pb-20 px-4 sm:px-6">
      {/* Glow blobs */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-125 w-125 rounded-full bg-primary-foreground/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-87.5 w-87.5 rounded-full bg-primary-foreground/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        {/* Eyebrow */}
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary-foreground/50">
          Help Center
        </p>

        {/* Heading */}
        <h1 className="font-serif text-4xl font-extrabold text-primary-foreground sm:text-5xl leading-tight mb-4">
          How can we help you?
        </h1>

        {/* Subtext */}
        <p className="text-primary-foreground/60 text-sm sm:text-base leading-relaxed mb-10 max-w-lg mx-auto">
          Find answers to common questions or reach us directly — we typically
          respond within a few hours.
        </p>

        {/* Search bar */}
        <div className="relative mx-auto max-w-lg mb-8">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-foreground/40 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search for help…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-full bg-primary-foreground/10 border border-primary-foreground/20 py-3.5 pl-11 pr-5 text-primary-foreground placeholder:text-primary-foreground/40 text-sm focus:outline-none focus:border-primary-foreground/40 focus:bg-primary-foreground/15 transition-all duration-200"
          />
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap justify-center gap-2">
          {quickLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3.5 py-1.5 text-xs font-semibold text-primary-foreground/75 hover:bg-primary-foreground/20 hover:text-primary-foreground transition-all duration-200"
            >
              {link.icon}
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
