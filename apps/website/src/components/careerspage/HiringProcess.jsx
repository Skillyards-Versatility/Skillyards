import { FileText, PhoneCall, Code, CheckCircle } from "lucide-react";

export default function HiringProcess() {
  const steps = [
    {
      icon: FileText,
      title: "Apply",
      description:
        "Share your profile, portfolio, or anything that shows what you’ve built or taught. Degrees matter less than skills here.",
    },
    {
      icon: PhoneCall,
      title: "Conversation",
      description:
        "A short, friendly discussion to understand your interests, expectations, and how you think — not a stress interview.",
    },
    {
      icon: Code,
      title: "Skill Discussion / Task",
      description:
        "Depending on the role, we may review your past work or give a small practical task. No unpaid heavy assignments.",
    },
    {
      icon: CheckCircle,
      title: "Offer & Onboarding",
      description:
        "If it’s a match, we move fast. Clear offer, simple onboarding, and real ownership from day one.",
    },
  ];

  return (
    <section className="relative py-24 bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-16 max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-4xl">
            Our Hiring Process
          </h2>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
            We respect your time. No endless rounds, no surprises — just honest
            conversations and real skill evaluation.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative rounded-2xl border border-neutral-200 bg-neutral-50 p-7 shadow-sm transition hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {index + 1}. {step.title}
                </h3>

                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Trust Note */}
        <div className="mt-16 max-w-4xl rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-sm text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
          <strong className="text-neutral-900 dark:text-neutral-100">
            A small promise from us:
          </strong>{" "}
          Every application is reviewed by a real human. If you take the time to
          apply thoughtfully, we’ll do the same.
        </div>
      </div>
    </section>
  );
}
