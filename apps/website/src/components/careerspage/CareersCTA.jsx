import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

export default function CareersCTA() {
  return (
    <section className="relative overflow-hidden bg-neutral-900 py-24 text-white dark:bg-black">
      {/* Soft gradient glow */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10" />

      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Let’s Build Something Meaningful
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-lg text-neutral-300">
          Whether you’re an experienced professional, a mentor at heart, or
          someone hungry to grow — if you care about learning, impact, and
          honest work, you’ll feel at home at SkillYards.
        </p>

        <p className="mx-auto mt-4 max-w-2xl text-sm text-neutral-400">
          You don’t need to know everything. You just need curiosity, integrity,
          and the willingness to improve every day.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="#open-roles"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100"
          >
            View Open Roles
            <ArrowRight className="h-4 w-4" />
          </Link>

          <a
            href="mailto:careers@skillyards.in"
            className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-7 py-3 text-sm font-semibold text-white transition hover:border-white"
          >
            <Mail className="h-4 w-4" />
            Send Your Profile
          </a>
        </div>

        {/* Gentle reassurance */}
        <p className="mt-8 text-xs text-neutral-400">
          Not sure if you’re a perfect fit? Apply anyway. We value potential as
          much as experience.
        </p>
      </div>
    </section>
  );
}
