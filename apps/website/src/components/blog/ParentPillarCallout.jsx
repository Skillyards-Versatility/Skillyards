import Link from "next/link";

export default function ParentPillarCallout({ pillar }) {
  const slug = pillar?.slug;
  const title = pillar?.title;

  if (!slug || !title) return null;

  return (
    <section className="mt-16">
      <Link
        href={`/blog/${slug}`}
        className="group block rounded-[2.5rem] border border-border/50 bg-slate-50 dark:bg-white/[0.02] p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              Complete Guide
            </div>
            <p className="mt-4 font-serif text-2xl md:text-3xl font-black tracking-tight text-foreground">
              {title}
            </p>
            <p className="mt-2 text-muted-foreground">
              Jump to the parent pillar for the full roadmap.
            </p>
          </div>

          <div className="shrink-0 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <span className="underline underline-offset-4 decoration-primary/30 group-hover:decoration-primary">
              Explore the Guide
            </span>
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
}

