import Link from "next/link";
import { Clock, Award, ArrowRight, Zap } from "lucide-react";

const pills = [
  { icon: <Clock size={13} />, label: "10 Minutes" },
  { icon: <Zap size={13} />, label: "Instant Result" },
  { icon: <Award size={13} />, label: "Free Certificate" },
];

export default function TestHero() {
  return (
    <section className="relative bg-foreground overflow-hidden pt-24 pb-20 px-4 sm:px-6">
      <div className="pointer-events-none absolute -top-40 -right-40 h-125 w-125 rounded-full bg-primary-foreground/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-87.5 w-87.5 rounded-full bg-primary-foreground/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        {/* Eyebrow */}
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-primary-foreground/50">
          Free Skill Assessment
        </p>

        {/* Heading */}
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight mb-5">
          Know Your Skills in{" "}
          <span className="italic underline decoration-secondary underline-offset-4">
            10 Minutes
          </span>
        </h1>

        <p className="text-primary-foreground/65 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-8">
          Take a quick skill test in HTML, CSS, JavaScript, and SEO. Get an
          instant score, a personalised program recommendation, and a{" "}
          <strong className="text-primary-foreground/90">
            free SkillYards certificate
          </strong>{" "}
          — all in under 10 minutes.
        </p>

        {/* Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {pills.map((p) => (
            <span
              key={p.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3.5 py-1.5 text-xs font-semibold text-primary-foreground/80"
            >
              {p.icon}
              {p.label}
            </span>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="#register"
          className="inline-flex items-center gap-2 bg-accent text-foreground font-bold text-sm px-8 py-4 rounded-full  hover:gap-3 transition-all duration-200 group shadow-lg shadow-black/20"
        >
          Start Free Test
          <ArrowRight
            size={15}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>

        <p className="mt-4 text-xs text-primary-foreground/40">
          No account needed · Takes &lt;10 minutes · Certificate emailed
          instantly
        </p>
      </div>
    </section>
  );
}
