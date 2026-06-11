import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity/image";

export default function SiblingArticles({ articles }) {
  const list = Array.isArray(articles) ? articles : [];

  const normalized = list
    .map((a) => ({
      _id: a?._id,
      title: a?.title,
      slug: a?.slug,
      excerpt: a?.excerpt,
      coverImage: a?.coverImage,
    }))
    .filter((a) => typeof a.slug === "string" && a.slug && typeof a.title === "string" && a.title);

  if (normalized.length === 0) return null;

  const toShow = normalized.slice(0, 4);

  return (
    <section className="mt-12 border-t-2 border-foreground/30 pt-6">
      <h3 className="font-serif text-lg font-black tracking-tight text-foreground mb-5 border-b border-foreground/20 pb-2">
        More on this Topic
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {toShow.map((a) => {
          const imgUrl = a.coverImage ? urlFor(a.coverImage).width(800).height(520).url() : null;
          return (
            <article
              key={a._id || a.slug}
              className="group border border-foreground/20 bg-[#f0ebe0] dark:bg-stone-900/30 overflow-hidden hover:border-foreground/50 transition-colors"
            >
              <Link href={`/blog/${a.slug}`} className="block">
                {imgUrl ? (
                  <div className="relative w-full aspect-[16/10] bg-foreground/5">
                    <Image
                      src={imgUrl}
                      alt={a.title}
                      fill
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                ) : null}

                <div className="p-4">
                  <h4 className="font-serif text-base font-black leading-snug text-foreground group-hover:text-foreground/70 transition-colors">
                    {a.title}
                  </h4>
                  {a.excerpt ? (
                    <p className="mt-2 font-serif text-sm leading-relaxed text-foreground/60 line-clamp-3">
                      {a.excerpt}
                    </p>
                  ) : null}
                  <div className="mt-3 font-serif text-xs font-bold uppercase tracking-wider text-foreground/50 group-hover:text-foreground/70 transition-colors">
                    Read article &rarr;
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}