"use client";

import { motion } from "framer-motion";

const cards = [
  {
    number: "01",
    title: "Daily hands-on coding, every single day",
    body: "Not a lab session once a week. Not a project in your final semester. Every day, for three years, you work with the MERN stack alongside your degree subjects. By the time you graduate, you've spent hundreds of hours writing real code, not reading about it.",
  },
  {
    number: "02",
    title: "A portfolio, not just a degree certificate",
    body: "BCA students build projects across all 6 semesters. Real applications. Real code. The kind of thing you push to GitHub and show in interviews. A degree gets you the interview. A portfolio gets you the job.",
  },
  {
    number: "03",
    title: "The degree is real too",
    body: "The BCA at SkillYards is university-affiliated. You sit university-pattern exams, meet attendance requirements, and graduate with a recognised bachelor's degree. The skill training is what makes it different, the degree is what makes it credible.",
  },
];

export function WhyNotRegular() {
  return (
    <section className="bg-background py-12 md:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-8 md:mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary"
          >
            Why SkillYards?
          </motion.div>
          <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Why not just do a regular BCA?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            Every BCA college in Agra teaches you the university syllabus. You
            study theory, sit exams and graduate with a degree. Then you sit in
            an interview and the employer says: &quot;Can you show me something
            you built?&quot; Most BCA graduates from regular colleges
            can&apos;t. SkillYards fixes that. Not by replacing the degree, but
            by making sure you write code every single day of it.
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
              className="flex flex-col rounded-2xl border border-border/50 bg-card p-5 sm:p-6 shadow-sm"
            >
              <span className="mb-4 text-5xl font-black text-primary/15">
                {card.number}
              </span>
              <h3 className="mb-3 font-serif text-lg font-extrabold text-foreground">
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {card.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
