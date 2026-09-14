import { Coffee, Laptop, Users, Smile } from "lucide-react";

export default function LifeAtSkillYards() {
  const culture = [
    {
      icon: Laptop,
      title: "Work That Actually Matters",
      description:
        "You’ll work on real products, real students, and real problems — not dummy tasks or endless meetings.",
    },
    {
      icon: Coffee,
      title: "Calm, Focused & Flexible",
      description:
        "We respect deep work, flexible schedules, and mental clarity. Output matters more than hours.",
    },
    {
      icon: Users,
      title: "Small Teams, Big Ownership",
      description:
        "You won’t be lost in layers of hierarchy. Everyone owns their work and sees its real impact.",
    },
    {
      icon: Smile,
      title: "Kind People, Zero Ego",
      description:
        "We hire for skill, curiosity, and kindness. No shouting, no politics, no toxic hustle culture.",
    },
  ];

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-16 max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-4xl">
            Life at SkillYards
          </h2>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
            We believe great work happens when people feel safe, valued, and
            genuinely excited about what they’re building.
          </p>
        </div>

        {/* Culture Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {culture.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900 transition-all group-hover:bg-black group-hover:text-white dark:bg-neutral-800 dark:text-neutral-100">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {item.title}
                </h3>

                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom Note */}
        <div className="mt-16 max-w-3xl">
          <p className="text-base text-neutral-600 dark:text-neutral-400">
            💡{" "}
            <span className="font-medium text-neutral-900 dark:text-neutral-100">
              No micromanagement.
            </span>{" "}
            No unrealistic deadlines. No weekend heroism. Just consistent,
            meaningful work with people who respect you.
          </p>
        </div>
      </div>
    </section>
  );
}
