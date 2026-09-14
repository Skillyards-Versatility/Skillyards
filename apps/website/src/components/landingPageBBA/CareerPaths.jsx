"use client";

import { motion } from "framer-motion";
import { Briefcase, Search, MousePointerClick, Users } from "lucide-react";

const paths = [
  {
    icon: Briefcase,
    title: "Digital Marketing Executive",
    body: "The most common entry-level role. You'll manage SEO, content, and social media for a brand or agency.",
  },
  {
    icon: Search,
    title: "SEO Specialist",
    body: "Focused on search rankings. You'll use tools like Google Search Console, Ahrefs and Semrush, all covered in the curriculum.",
  },
  {
    icon: MousePointerClick,
    title: "PPC / Google Ads Expert",
    body: "Managing paid search campaigns for businesses. You'll run live Google Ads during training.",
  },
  {
    icon: Users,
    title: "Social Media & Ads Manager",
    body: "Running Meta Ads, organic social strategy, and content calendars for brands.",
  },
];

export function CareerPaths() {
  return (
    <section className="bg-card/20 py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary"
          >
            Career Paths
          </motion.div>
          <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Where BBA graduates go
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            Our first BBA batch is still ongoing. No placements to report yet.
            What we can tell you is the roles this program prepares you for, and
            the tools you&apos;ll know how to use when you get there.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {paths.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-4 rounded-2xl border border-border/50 bg-card p-5 shadow-sm"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Icon size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-foreground">{p.title}</h3>
                  <p
                    className="text-sm leading-relaxed text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: p.body }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          These are the roles the curriculum prepares you for. Placement support
          begins from your second year, resume building, mock interviews and
          direct referrals when you&apos;re ready.
        </p>
      </div>
    </section>
  );
}
