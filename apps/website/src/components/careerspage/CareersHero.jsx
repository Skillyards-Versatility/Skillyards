import Breadcrumbs from "@/components/Breadcrumbs";

export default function CareersHero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-indigo-50 via-white to-white dark:from-indigo-950 dark:via-neutral-950 dark:to-black" />

      {/* Decorative Blur */}
      <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-600/20" />

      <div className="mx-auto max-w-6xl px-6 py-24 text-center">
        {/* Breadcrumbs */}
        <div className="mb-6 flex justify-center">
          <Breadcrumbs className="text-sm opacity-80" />
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-5xl">
          Build Skills.{" "}
          <span className="text-indigo-600 dark:text-indigo-400">
            Shape Careers.
          </span>
          <br className="hidden sm:block" />
          Create Real Impact.
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
          At SkillYards, we’re building more than an institute — we’re creating
          opportunities for people to learn, grow, and transform their future
          through real skills.
        </p>

        <p className="mx-auto mt-4 max-w-2xl text-sm text-neutral-500 dark:text-neutral-500">
          Developers, educators, creators, marketers — if you believe in
          learning by doing, you’ll feel right at home.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="#open-roles"
            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-700"
          >
            View Open Roles
          </a>

          <a
            href="#open-application"
            className="rounded-xl border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-900"
          >
            Send Open Application
          </a>
        </div>
      </div>
    </section>
  );
}
