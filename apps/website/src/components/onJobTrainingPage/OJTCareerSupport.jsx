"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  FileText,
  Github,
  Linkedin,
  MessageSquare,
  SearchCheck,
  Send,
  UserRoundSearch,
} from "lucide-react";

const supportItems = [
  { title: "Resume building", icon: FileText },
  { title: "Portfolio review", icon: UserRoundSearch },
  { title: "GitHub/profile support", icon: Github },
  { title: "LinkedIn support", icon: Linkedin },
  { title: "Mock interviews", icon: MessageSquare },
  { title: "Interview preparation", icon: SearchCheck },
  { title: "Career counselling", icon: Briefcase },
  { title: "Relevant opportunity referrals where available", icon: Send },
];

export default function OJTCareerSupport() {
  return (
    <section className="bg-card/20 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary"
          >
            Placement Assistance
          </motion.div>
          <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Placement Assistance and{" "}
            <span className="italic text-primary">Career Support</span>
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            SkillYards provides placement assistance and career support to help
            students prepare for opportunities after completing their OJT
            program.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {supportItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-3xl border border-border bg-card p-5 shadow-sm"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                  <Icon size={18} className="text-primary" />
                </div>
                <h3 className="font-serif text-lg font-extrabold text-foreground">
                  {item.title}
                </h3>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
