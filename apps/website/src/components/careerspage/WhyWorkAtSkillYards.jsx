import { Sparkles, GraduationCap, Rocket, HeartHandshake } from "lucide-react";

export default function WhyWorkAtSkillYards() {
  const reasons = [
    {
      icon: GraduationCap,
      title: "Real Impact on Real Careers",
      description:
        "Every line of code, every lecture, every design you create helps someone build a real career — not just a certificate.",
    },
    {
      icon: Rocket,
      title: "Fast Growth, Zero Politics",
      description:
        "We value skill, ownership, and learning speed — not titles or office politics. If you grow, SkillYards grows with you.",
    },
    {
      icon: Sparkles,
      title: "Learn While You Build",
      description:
        "We believe the best professionals never stop learning. You’ll constantly upskill through real projects, mentoring, and experimentation.",
    },
    {
      icon: HeartHandshake,
      title: "Human-First Culture",
      description:
        "No toxic hustle. No ego battles. Just passionate people building meaningful education products together.",
    },
  ];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-14 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-4xl">
            Why Work at SkillYards?
          </h2>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
            We’re not just building courses or software — we’re building
            **confidence, careers, and futures**.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group relative rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900 transition-colors group-hover:bg-black group-hover:text-white dark:bg-neutral-800 dark:text-neutral-100">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {item.title}
                </h3>

                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
