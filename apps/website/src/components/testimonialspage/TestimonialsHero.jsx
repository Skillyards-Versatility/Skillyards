const stats = [
  { value: "30+", label: "Student Reviews" },
  { value: "5.0★", label: "Average Rating" },
  { value: "Dedicated", label: "Placement Support" },
  { value: "180+", label: "Hiring Partners" },
];

export default function TestimonialsHero() {
  return (
    <section className="relative bg-primary overflow-hidden pt-24 pb-16 px-4 sm:px-6">
      {/* Glow */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-125 w-125 rounded-full bg-primary-foreground/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-87.5 w-87.5 rounded-full bg-primary-foreground/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary-foreground/50">
          Student Reviews
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-primary-foreground leading-tight mb-4">
          Real Stories. Real Results.
        </h1>
        <p className="text-primary-foreground/60 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Every review below is from a student who chose SkillYards to build
          their future. No filters, no scripts — just their experience.
        </p>

        {/* Stats row */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-1 rounded-2xl border border-primary-foreground/20 bg-primary-foreground/15 px-4 py-5"
            >
              <span className="text-2xl sm:text-3xl font-extrabold text-primary-foreground">
                {s.value}
              </span>
              <span className="text-xs text-primary-foreground/50 font-medium">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
