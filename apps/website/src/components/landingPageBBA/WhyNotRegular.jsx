"use client";

import { motion } from "framer-motion";

const cards = [
  {
    number: "01",
    title: "Any stream can apply",
    body: "Most technical programs in Agra require a Science background. BBA at SkillYards is open to students from Science, Commerce or Arts. If you passed 12th with 50% marks, you're eligible, regardless of which subjects you studied.",
  },
  {
    number: "02",
    title: "Digital marketing skills built daily, not in a workshop",
    body: "Daily hands-on Digital Marketing training, built into every single day. Not a one-week bootcamp added at the end of your degree. By the time you graduate, you've spent hundreds of hours working with SEO tools, ad platforms, and analytics dashboards.",
  },
  {
    number: "03",
    title: "A degree that opens doors, skills that get you through them",
    body: "The university-affiliated BBA degree meets the formal qualification requirement for most jobs and higher studies. The Digital Marketing training is what gives you something to talk about in an interview, real tools, real campaigns, real experience.",
  },
];

export function WhyNotRegular() {
  return (
    <section className="bg-background py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary"
          >
            Why SkillYards?
          </motion.div>
          <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Why not just do a regular BBA?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            A regular BBA teaches you management theory and gives you a degree.
            That&apos;s useful. But employers hiring for digital marketing roles
            don&apos;t ask for your BBA grade, they ask if you&apos;ve run a
            Google Ads campaign, managed an SEO audit or tracked Meta Ad
            performance. SkillYards adds that practical layer to your BBA, every
            single day for three years.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col rounded-2xl border border-border/50 bg-card p-6 shadow-sm"
            >
              <span className="mb-4 text-5xl font-black text-primary/15">
                {card.number}
              </span>
              <h3 className="mb-3 font-serif text-lg font-extrabold text-foreground">
                {card.title}
              </h3>
              <p
                className="text-sm leading-relaxed text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: card.body }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
