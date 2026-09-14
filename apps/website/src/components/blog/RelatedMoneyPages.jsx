import Link from "next/link";

export default function RelatedMoneyPages({ pages }) {
  const list = Array.isArray(pages) ? pages : [];
  const related = list.filter(
    (p) =>
      p &&
      p.linkContext === "related-block" &&
      typeof p.title === "string" &&
      p.title.trim() &&
      typeof p.path === "string" &&
      p.path.trim(),
  );

  if (related.length === 0) return null;

  return (
    <section className="mt-12 border-t-2 border-foreground/30 pt-6">
      <h3 className="font-serif text-lg font-black tracking-tight text-foreground mb-5 border-b border-foreground/20 pb-2">
        Related Programs
      </h3>
      <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {related.map((p) => (
          <li key={`${p.path}-${p.title}`}>
            <Link
              href={p.path}
              className="group flex items-center gap-3 border border-foreground/20 bg-[#f0ebe0] dark:bg-stone-900/30 px-4 py-3 hover:border-foreground/50 transition-colors"
            >
              <span className="font-serif font-bold text-foreground group-hover:text-foreground/70 transition-colors flex items-center gap-2">
                <span>{p.title}</span>
                <span
                  aria-hidden="true"
                  className="text-foreground/50 group-hover:text-foreground/70 transition-colors"
                >
                  &rarr;
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
