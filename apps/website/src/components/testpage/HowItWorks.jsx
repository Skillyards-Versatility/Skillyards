import { ClipboardList, Timer, Award } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: <ClipboardList size={24} />,
    title: "Fill in your details",
    description:
      "Enter your name, email, and phone number. We'll send your certificate and result report directly to your inbox.",
    color: "bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
  },
  {
    step: "02",
    icon: <Timer size={24} />,
    title: "Take the test",
    description:
      "Answer 20–25 multiple choice questions across HTML, CSS, JavaScript, and SEO. No coding required — just your knowledge.",
    color:
      "bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400",
  },
  {
    step: "03",
    icon: <Award size={24} />,
    title: "Get your certificate",
    description:
      "Receive an instant score, a program recommendation tailored to your result, and a free SkillYards Skill Assessment Certificate.",
    color:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-background border-y border-border py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
            How It Works
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-foreground">
            3 Simple Steps
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connector line — desktop only */}
          <div className="hidden md:block absolute top-10 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px bg-border z-0" />

          {steps.map((s, i) => (
            <div
              key={i}
              className="relative z-10 flex flex-col items-center text-center gap-4"
            >
              {/* Icon circle */}
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center ${s.color} ring-4 ring-background`}
              >
                {s.icon}
              </div>

              {/* Step number */}
              <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                Step {s.step}
              </span>

              <div>
                <h3 className="font-bold text-foreground text-base sm:text-lg mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
