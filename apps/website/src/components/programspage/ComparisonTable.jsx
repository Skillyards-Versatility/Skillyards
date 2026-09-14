"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import {
  Clock,
  GraduationCap,
  Briefcase,
  Users,
  LayoutList,
  HelpCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const paths = [
  {
    name: "On Job Degree (OJD)",
    sub: "3-Year Degree Pathway",
    theme: "text-primary",
    badgeBg: "bg-primary/10 text-primary border-primary/20",
  },
  {
    name: "On Job Training (OJT)",
    sub: "6–9 Month Job-Skills Path",
    theme: "text-secondary-foreground",
    badgeBg: "bg-secondary/20 text-secondary-foreground border-secondary/35",
  },
];

const rows = [
  {
    label: "Best For",
    icon: Users,
    values: [
      "12th-pass students seeking a formal degree combined with industry-relevant, practical tech/marketing skills.",
      "Graduates & college students wanting to quickly gain job-ready skills and bypass a multi-year degree program.",
    ],
  },
  {
    label: "Duration",
    icon: Clock,
    values: ["3 Years", "6–9 Months"],
  },
  {
    label: "Outcome",
    icon: GraduationCap,
    values: [
      "UGC-recognized degree pathway + real-world portfolio & coding experience.",
      "Job-skill focused training certification + live and practical projects portfolio.",
    ],
  },
  {
    label: "Programs Included",
    icon: LayoutList,
    values: [
      "BCA with Full-Stack Development\nBBA with Digital Marketing",
      "Full-Stack Development Training\nDigital Marketing Training",
    ],
  },
  {
    label: "Career Focus",
    icon: Briefcase,
    values: [
      "Long-term career building with strong academic foundation & direct industry integration.",
      "Immediate job preparation, faster skill acquisition, and portfolio-building work.",
    ],
  },
  {
    label: "Next Step",
    icon: Sparkles,
    isAction: true,
    values: [
      {
        text: "Explore On Job Degree",
        href: "/programs/on-job-degree",
        color: "bg-primary hover:bg-primary/95 text-primary-foreground",
      },
      {
        text: "Explore On Job Training",
        href: "/programs/on-job-training",
        color: "bg-secondary hover:bg-secondary/95 text-secondary-foreground",
      },
    ],
  },
];

export default function ComparisonTable() {
  return (
    <section
      id="ojd-vs-ojt"
      className="bg-background py-20 lg:py-24 relative overflow-hidden scroll-mt-20"
    >
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-50 pointer-events-none">
        <div className="absolute top-20 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-20 left-0 w-64 h-64 bg-secondary/5 blur-[100px] rounded-full" />
      </div>

      <div className="mx-auto max-w-6xl px-6 relative z-10">
        <div className="mb-12 text-center">
          <LazyMotion features={domAnimation}>
            <m.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary"
            >
              <HelpCircle size={12} />
              Path Comparison
            </m.div>
            <m.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
            >
              On Job Degree vs On Job Training:{" "}
              <span className="text-primary italic">
                Which Path Is Right for You?
              </span>
            </m.h2>
            <m.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="mx-auto mt-4 max-w-2xl text-muted-foreground text-sm font-medium"
            >
              Compare SkillYards&apos; two primary education options and select
              the track that aligns with your educational background and career
              goals.
            </m.p>
          </LazyMotion>
        </div>

        <div className="relative">
          {/* Table Container with horizontal scroll on mobile */}
          <div className="overflow-x-auto pb-4 no-scrollbar">
            <div className="min-w-[800px] rounded-[2rem] border border-border/50 bg-white dark:bg-card/30 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/5">
              <table className="w-full border-collapse text-left table-fixed">
                <thead>
                  <tr className="bg-slate-50 dark:bg-white/[0.03]">
                    <th className="w-[20%] sticky left-0 z-20 bg-slate-50 dark:bg-[#1a1a20] px-8 py-6 text-xs font-black uppercase tracking-widest text-muted-foreground border-r border-border/50">
                      Feature
                    </th>
                    {paths.map((p) => (
                      <th
                        key={p.name}
                        className="w-[40%] px-6 py-6 text-center border-r last:border-r-0 border-border/20"
                      >
                        <span className="block text-xl font-black text-foreground tracking-tight">
                          {p.name}
                        </span>
                        <span
                          className={`inline-block mt-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${p.badgeBg}`}
                        >
                          {p.sub}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {rows.map((row, ri) => (
                    <tr
                      key={row.label}
                      className="group hover:bg-primary/[0.01] transition-colors"
                    >
                      <td className="sticky left-0 z-20 bg-white dark:bg-[#0d0d12] px-8 py-6 border-r border-border/50 group-hover:bg-slate-50 dark:group-hover:bg-white/[0.05] transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/5 text-primary">
                            <row.icon size={16} />
                          </div>
                          <span className="text-sm font-bold text-foreground">
                            {row.label}
                          </span>
                        </div>
                      </td>
                      {row.values.map((val, vi) => (
                        <td
                          key={vi}
                          className="px-8 py-6 border-r last:border-r-0 border-border/10"
                        >
                          {row.isAction ? (
                            <div className="flex justify-center">
                              <Button
                                asChild
                                size="sm"
                                className={`w-full max-w-[240px] rounded-xl font-bold uppercase text-[10px] tracking-wider py-4 ${val.color} shadow-md transition-all hover:scale-103`}
                              >
                                <Link
                                  href={val.href}
                                  className="flex items-center justify-center gap-1.5"
                                >
                                  {val.text} <ArrowRight size={12} />
                                </Link>
                              </Button>
                            </div>
                          ) : (
                            <span className="text-sm font-medium leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors whitespace-pre-line block">
                              {val}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Hint */}
          <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground lg:hidden">
            <span>Scroll horizontally to compare</span>
            <div className="w-8 h-px bg-border" />
          </div>
        </div>
      </div>
    </section>
  );
}
