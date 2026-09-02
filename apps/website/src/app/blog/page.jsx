import Link from "next/link";
import BlogSearch from "@/components/blog/BlogSearch";
import JsonLd from "@/components/JsonLd";
import { buildSEO } from "@/lib/seo/buildSEO";
import { getAllOgImages } from "@/lib/sanity/getSiteSettings";
import { resolveOgImage } from "@/lib/seo/og";
import { getBlogSchema } from "@/lib/seo/schema/blogPostingSchema";
import { sanityClient } from "@/lib/sanity/client";
import {
  FEATURED_PILLARS_QUERY,
  POSTS_QUERY,
} from "@/lib/sanity/queries";

export const revalidate = 3600;

export async function generateMetadata() {
  const ogImages = await getAllOgImages();
  return buildSEO({
  title: "SkillYards Blog",
  description:
    "Explore the SkillYards Blog for expert insights, practical tutorials, learning resources, and career guidance in IT and emerging technologies.",
  path: "/blog",
  keywords: [
    "SkillYards blog",
    "IT learning blog",
    "Programming tutorials",
    "Career guidance blog",
    "Skill development articles",
    "Technology education insights",
  ],
  ogImage: resolveOgImage(ogImages, "blog", "/images/opengraph/blog-og.jpg"),
});
}

const CONTENT_TYPE_LABELS = {
  "pillar-brand": "Guide",
  "pillar-sub": "Guide",
  cluster: "Guide",
  comparison: "Comparison",
  news: "News",
};

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

function FeaturedPillars({ posts }) {
  if (!posts?.length) return null;

  return (
    <section className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary">
            Start Here
          </p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-black text-foreground">
            Featured Career Guides
          </h2>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <Link
          href={`/blog/${posts[0].slug}`}
          className="group rounded-[2rem] border border-border/60 bg-white/80 p-7 shadow-[0_20px_60px_rgba(0,0,0,0.06)] transition-transform duration-500 hover:-translate-y-1 dark:bg-white/[0.03]"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary/70">
            {CONTENT_TYPE_LABELS[posts[0].contentType] || "Featured"}
          </p>
          <h3 className="mt-4 font-serif text-3xl font-black leading-tight text-foreground">
            {posts[0].title}
          </h3>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            {posts[0].excerpt}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <span>{formatDate(posts[0].publishedAt)}</span>
            {posts[0].parentPillar?.title && <span>{posts[0].parentPillar.title}</span>}
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm font-bold text-primary">
            <span>Read Complete Guide</span>
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">&rarr;</span>
          </div>
        </Link>

        <div className="grid gap-4">
          {posts.slice(1).map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              className="group rounded-[1.75rem] border border-border/60 bg-background/70 p-5 transition-colors hover:border-primary/30 hover:bg-primary/[0.03]"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/70">
                {CONTENT_TYPE_LABELS[post.contentType] || "Article"}
              </p>
              <h3 className="mt-3 text-xl font-semibold leading-snug text-foreground group-hover:text-primary">
                {post.title}
              </h3>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function BlogPage() {
  const [posts, featuredPillars] = await Promise.all([
    sanityClient.fetch(POSTS_QUERY, {}, { next: { revalidate: 3600 } }),
    sanityClient.fetch(FEATURED_PILLARS_QUERY, {}, { next: { revalidate: 3600 } }),
  ]);

  const blogSchema = getBlogSchema(posts);

  return (
    <div className="min-h-screen overflow-hidden bg-background pt-20">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_0%,#000_20%,transparent_100%)] pointer-events-none" />

      <JsonLd data={blogSchema} id="blog-collection-schema" />

      <section className="relative z-10 py-16">
        <div className="mx-auto max-w-[1240px] space-y-16 px-6 sm:px-12">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-primary">
              SkillYards Blog
            </p>
            <h1 className="mt-5 font-serif text-5xl font-black tracking-tight text-foreground sm:text-6xl">
              Career guides, course comparisons, and skill-building insights.
            </h1>
          </div>

          <FeaturedPillars posts={featuredPillars} />

          <section className="space-y-8">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary">
                Explore
              </p>
              <h2 className="mt-3 font-serif text-3xl font-black text-foreground">
                Search all articles
              </h2>
            </div>
            <BlogSearch posts={posts} />
          </section>
        </div>
      </section>
    </div>
    
  );
}
