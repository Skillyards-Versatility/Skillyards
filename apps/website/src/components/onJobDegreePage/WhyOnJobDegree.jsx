"use client";

import { motion } from "framer-motion";

const pillars = [
  {
    number: "01",
    title: "Daily hands-on practical training, every single day",
    desc: "Not a workshop. Not a once-a-week lab. Every day, for three years, you work on real skills alongside your degree subjects. By the time you graduate, you've spent hundreds of hours actually building, not just reading about it.",
  },
  {
    number: "02",
    title: "Skills that show up in your portfolio",
    desc: "BCA students learn the MERN stack and build projects they can show employers. BBA students run actual campaigns, work with real tools, and build a body of work. A portfolio is what gets you through the door, and a degree is what keeps you there.",
  },
  {
    number: "03",
    title: "A degree and a skill set together",
    desc: "Both programs are university-affiliated. You get a recognised bachelor's degree. The difference is you also leave with something most graduates don't. Proof that you can actually do the work.",
  },
];

export default function WhyOnJobDegree() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Why not just join a regular BCA or BBA college?
          </h2>

          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Most BCA and BBA colleges in Agra teach you the syllabus.
            That&apos;s it. You graduate, sit in interviews, and realise
            you&apos;ve never actually built anything. Employers ask for React,
            Node.js, or a live campaign you ran, and most fresh graduates have
            none of that.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            SkillYards doesn&apos;t replace the degree. It fixes what the degree
            alone can&apos;t give you.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
            >
              <p className="mb-4 text-4xl font-black text-primary/20">
                {pillar.number}
              </p>
              <h3 className="font-serif text-lg font-extrabold leading-snug text-foreground">
                {pillar.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {pillar.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
