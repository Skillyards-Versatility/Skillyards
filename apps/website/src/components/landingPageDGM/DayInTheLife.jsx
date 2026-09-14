"use client";

import { motion } from "framer-motion";
import { Sun, BarChart2, MessageSquare, PenTool, Moon } from "lucide-react";

const duringCourse = [
  {
    time: "10:00 AM",
    icon: Sun,
    title: "In-Person Class",
    desc: "Mentor demonstrates the tool in-person and you follow along in your own account. No slides, no theory dumps.",
    color: "bg-yellow-500",
  },
  {
    time: "12:00 PM",
    icon: BarChart2,
    title: "Hands-On Lab",
    desc: "Apply what was just taught on a real account real keywords, real campaigns, real data.",
    color: "bg-orange-500",
  },
  {
    time: "2:00 PM",
    icon: MessageSquare,
    title: "Campaign Review Session",
    desc: "Your work gets reviewed by the mentor. Numbers are discussed, decisions are challenged, strategy is sharpened.",
    color: "bg-pink-500",
  },
  {
    time: "Evening",
    icon: Moon,
    title: "Self-Practice + Assignment",
    desc: "Recorded session for revision. Short assignment to reinforce the day. About 1 to 2 hours outside class.",
    color: "bg-primary",
  },
];

const afterGraduating = [
  {
    time: "9:00 AM",
    icon: BarChart2,
    title: "Check Campaign Dashboards",
    desc: "Review overnight ad performance. Adjust bids, pause underperforming ads, flag anomalies.",
    color: "bg-blue-500",
  },
  {
    time: "10:30 AM",
    icon: PenTool,
    title: "Content Planning or Client Call",
    desc: "Prepare next week's social content, or join a client standup to discuss campaign direction.",
    color: "bg-green-500",
  },
  {
    time: "1:00 PM",
    icon: Sun,
    title: "Reporting & Keyword Research",
    desc: "Build weekly performance reports from sample datasets, do keyword gap analysis, find new opportunities.",
    color: "bg-orange-500",
  },
  {
    time: "4:00 PM",
    icon: MessageSquare,
    title: "Analytics Review & Daily Wrap",
    desc: "Check GA4 traffic, review UTM performance, prepare daily summary. Done for the day.",
    color: "bg-purple-500",
  },
];

function Timeline({ items }) {
  return (
    <div className="relative pl-6">
      <div className="absolute left-[1.1rem] top-4 h-[calc(100%-2rem)] w-px bg-border" />
      <div className="space-y-5">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative flex gap-4"
            >
              <div
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${item.color} shadow-md`}
              >
                <Icon size={14} className="text-white" />
              </div>
              <div className="flex-1 rounded-2xl border border-border bg-card p-4 shadow-sm">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xs font-bold text-primary">
                    {item.time}
                  </span>
                  <h4 className="font-bold text-sm text-foreground">
                    {item.title}
                  </h4>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export function DGMDayInTheLife() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary"
          >
            A Day in the Life
          </motion.div>
          <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            What Your Days Look Like{" "}
            <span className="italic text-primary">During & After.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Two timelines so you know exactly what you&apos;re signing up for
            and exactly where it leads.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="mb-5 font-serif text-xl font-extrabold text-foreground">
              During the Course{" "}
              <span className="text-sm font-normal text-muted-foreground">
                (Month 3 typical day)
              </span>
            </h3>
            <Timeline items={duringCourse} />
          </div>
          <div>
            <h3 className="mb-5 font-serif text-xl font-extrabold text-foreground">
              After Graduating{" "}
              <span className="text-sm font-normal text-muted-foreground">
                (Junior DM executive)
              </span>
            </h3>
            <Timeline items={afterGraduating} />
          </div>
        </div>
      </div>
    </section>
  );
}
