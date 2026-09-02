import { cache } from "react";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { LayoutList, Share2 } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import BlogCard from "@/components/blog/BlogCard";
import Discussion from "@/components/blog/Discussion";
import JsonLd from "@/components/JsonLd";
import NewsArticleTemplate from "@/components/blog/NewsArticleTemplate";
import { getBlogPostingSchema } from "@/lib/seo/schema/blogPostingSchema";
import ScrollProgress from "@/components/blog/ScrollProgress";
import { isValidLinkedInUrl } from "@/lib/seo/core/isValidLinkedInUrl";
import ParentPillarCallout from "@/components/blog/ParentPillarCallout";
import RelatedMoneyPages from "@/components/blog/RelatedMoneyPages";
import SiblingArticles from "@/components/blog/SiblingArticles";
import TableOfContents from "@/components/TableOfContents";
import { buildSEO } from "@/lib/seo/buildSEO";
import { urlFor } from "@/lib/sanity/image";
import { extractHeadings } from "@/lib/sanity/slugifyHeading";
import { portableTextComponents } from "@/lib/sanity/portableTextComponents";
import { calculateReadingTime } from "@/lib/sanity/readingTime";
import { sanityClient } from "@/lib/sanity/client";
import { POST_BY_SLUG_QUERY } from "@/lib/sanity/queries";

export const revalidate = 3600;

const CATEGORY_LABELS = {
  "ojd-program": "OJD Program",
  "ojd-bca": "OJD BCA",
  "ojd-bba": "OJD BBA",
  "full-stack": "Full-Stack Development",
  "digital-marketing": "Digital Marketing",
  "career-guidance": "Career Guidance",
  "industry-news": "Industry News",
};

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

export async function generateStaticParams() {
  const slugs = await sanityClient.fetch(
    `*[_type == "post"]{ "slug": slug.current }`,
    {},
    { next: { revalidate: 3600 } }
  );

  return slugs.map((post) => ({ slug: post.slug }));
}

const getPost = cache(async (slug) =>
  sanityClient.fetch(POST_BY_SLUG_QUERY, { slug }, { next: { revalidate: 3600 } })
);

function buildMetadataForPost(post, slug) {
  if (!post) {
    return buildSEO({
      title: "Blog Not Found",
      description: "The blog you are looking for does not exist.",
      path: `/blog/${slug}`,
    });
  }

  const cleanDescription =
    post.excerpt?.replace(/<[^>]+>/g, "").slice(0, 125) ||
    "Read this article on SkillYards.";

  const imageUrl = post.coverImage
    ? urlFor(post.coverImage)
        .width(1200)
        .height(630)
        .fit("crop")
        .format("jpg")
        .quality(72)
        .url()
    : undefined;

  const metadata = buildSEO({
    title: post.seoTitle || post.title,
    description: cleanDescription,
    path: `/blog/${post.slug?.current || slug}`,
    keywords: [
      ...(post.seoKeywords || []),
      post.title,
      post.author?.name,
      CATEGORY_LABELS[post.category],
      "SkillYards blog",
    ].filter(Boolean),
    ogImage: imageUrl,
    ogType: "article",
  });

  if (post.noIndex) {
    metadata.robots = {
      index: false,
      follow: false,
    };
  }

  return metadata;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  return buildMetadataForPost(post, slug);
}

function MetaRow({ post, readingTime }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
      <span>
        By{" "}
        <span className="text-foreground/80">
          {post.author?.name || "SkillYards Team"}
        </span>
      </span>
      <span aria-hidden="true" className="text-foreground/30">·</span>
      <span>{formatDate(post.publishedAt)}</span>
      <span aria-hidden="true" className="text-foreground/30">·</span>
      <span>{readingTime} min read</span>
    </div>
  );
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-lg text-muted-foreground">Post not found</p>
      </div>
    );
  }

  const readingTime = calculateReadingTime(post.content);
  const headings = extractHeadings(post.content);
  const resolvedImageUrl = post.coverImage
    ? urlFor(post.coverImage)
        .width(1200)
        .height(630)
        .fit("crop")
        .format("jpg")
        .quality(72)
        .url()
    : undefined;

  if (post.contentType === "news") {
    const blogPostingSchema = getBlogPostingSchema({
      ...post,
      readingTime,
      resolvedImageUrl,
    });

    // Fetch all news articles ordered by publication date to resolve pagination index and full sibling articles
    const allNews = await sanityClient.fetch(
      `*[_type == "post" && contentType == "news"] | order(publishedAt desc){
        _id,
        title,
        "slug": slug.current,
        excerpt,
        publishedAt,
        coverImage,
        content,
        contentType,
        newsType,
        sourceName,
        sourceLanguage,
        sourceDate,
        sourceUrl,
        clippingImage,
        englishSummary,
        author->{
          name,
          image,
          role,
          shortBio,
          linkedinUrl
        },
        "tags": tags[]->{
          title,
          "slug": slug.current
        },
        "relatedMoneyPages": relatedMoneyPages[]{
          title,
          path,
          linkContext
        }
      }`
    ).catch(() => []);

    const currentIndex = allNews.findIndex((n) => n.slug === slug);
    const resolvedCurrentIndex = currentIndex !== -1 ? currentIndex : 0;

    // Align strictly to 3-column page groups (stories A, B, C render together side-by-side)
    const groupStart = Math.floor(resolvedCurrentIndex / 3) * 3;

    const story1 = allNews[groupStart] || post;
    const story2 = allNews[groupStart + 1] || null;
    const story3 = allNews[groupStart + 2] || null;

    const nextPageSlug = allNews[groupStart + 3] ? allNews[groupStart + 3].slug : null;
    const prevPageSlug = groupStart >= 3 && allNews[groupStart - 3] ? allNews[groupStart - 3].slug : null;
    const pageNum = Math.floor(groupStart / 3) + 1;

    // Dynamically calculate headings and reading time from the resolved Column 1 story content
    const resolvedHeadings = extractHeadings(story1.content);
    const resolvedReadingTime = calculateReadingTime(story1.content);

    // Calculate Mobile 1-by-1 pagination properties
    const nextStorySlug = allNews[resolvedCurrentIndex + 1] ? allNews[resolvedCurrentIndex + 1].slug : null;
    const prevStorySlug = resolvedCurrentIndex > 0 && allNews[resolvedCurrentIndex - 1] ? allNews[resolvedCurrentIndex - 1].slug : null;

    return (
      <>
        <JsonLd data={blogPostingSchema} id="blog-posting-schema" />
        <NewsArticleTemplate
          post={post}
          story1={story1}
          headings={resolvedHeadings}
          readingTime={resolvedReadingTime}
          slug={slug}
          story2={story2}
          story3={story3}
          nextPageSlug={nextPageSlug}
          prevPageSlug={prevPageSlug}
          pageNum={pageNum}
          nextStorySlug={nextStorySlug}
          prevStorySlug={prevStorySlug}
          currentIndex={resolvedCurrentIndex}
          totalArticles={allNews.length}
        />
      </>
    );
  }

  const blogPostingSchema = getBlogPostingSchema({
    ...post,
    readingTime,
    resolvedImageUrl,
  });

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <ScrollProgress />
      <JsonLd data={blogPostingSchema} id="blog-posting-schema" />

      {/* Centered Hero Header */}
      <header className="relative w-full pt-32 pb-16 px-6 overflow-hidden border-b border-border/50 bg-slate-50/50 dark:bg-white/[0.02]">
        {/* Checkered BG Pattern */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Breadcrumbs
            className="justify-center mb-8"
            items={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              { label: post.title },
            ]}
          />

          <span className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-6 border border-primary/20">
            <Share2 size={10} /> Blog Article
          </span>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-foreground mb-10 bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/60 dark:from-white dark:to-white/60">
            {post.title}
          </h1>

          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/20 shadow-xl bg-background p-1">
              <div className="w-full h-full rounded-full overflow-hidden border border-border/50">
                {post.author?.image ? (
                  <Image
                    src={urlFor(post.author.image).width(120).height(120).url()}
                    alt=""
                    aria-hidden="true"
                    width={56}
                    height={56}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-black text-lg">
                    {post.author?.name?.charAt(0) || "S"}
                  </div>
                )}
              </div>
            </div>
            <MetaRow post={post} readingTime={readingTime} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-16 items-start">
          {/* Main Content */}
          <div className="w-full max-w-3xl mx-auto lg:mx-0">
            {/* Cover Image */}
            {post.coverImage && (
              <div className="mb-16 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/5 dark:shadow-black/40 border border-border/50 relative group">
                <Image
                  src={urlFor(post.coverImage).width(1200).url()}
                  alt={post.coverImage?.alt || post.title}
                  width={1200}
                  height={600}
                  className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            )}

            {/* Article Content */}
            <article className="
              prose dark:prose-invert max-w-none
              prose-headings:font-serif prose-headings:font-black prose-headings:tracking-tight prose-headings:text-foreground
              prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b prose-h2:border-border/50
              prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-4
              prose-p:text-muted-foreground/90 prose-p:leading-[1.8] prose-p:text-lg prose-p:my-8
              prose-li:text-muted-foreground/90 prose-li:text-lg prose-li:leading-relaxed
              prose-strong:text-foreground prose-strong:font-bold
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:px-8 prose-blockquote:py-2 prose-blockquote:rounded-r-3xl prose-blockquote:not-italic prose-blockquote:text-foreground
              prose-img:rounded-[2rem] prose-img:shadow-xl
              prose-code:text-primary prose-code:bg-primary/5 prose-code:px-2 prose-code:py-0.5 prose-code:rounded
            ">
              <PortableText value={post.content || []} components={portableTextComponents} />
            </article>

            <ParentPillarCallout pillar={post.parentPillar} />
            <RelatedMoneyPages pages={post.relatedMoneyPages} />
            <SiblingArticles articles={post.siblingArticles} />



            {/* Discussion */}
            <div className="mt-20 border-t border-border/50 pt-10">
              <Discussion slug={slug} title={post.title} />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:flex lg:flex-col gap-8 sticky top-32 self-start">
            {/* Author Card */}
            <div className="rounded-[2.5rem] border border-border/50 bg-white dark:bg-white/[0.02] p-8 backdrop-blur-md shadow-xl shadow-black/[0.02]">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-6">Article Author</p>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-border shadow-sm">
                  {post.author?.image ? (
                    <Image
                      src={urlFor(post.author.image).width(100).height(100).url()}
                      alt=""
                      aria-hidden="true"
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-black text-xl">
                      {post.author?.name?.charAt(0) || "S"}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-serif text-lg font-black text-foreground leading-tight">
                    {post.author?.name || "SkillYards Team"}
                  </h4>
                  <p className="text-xs font-bold text-muted-foreground mt-1">
                    {post.author?.role || "Education Lead"}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground/90 leading-relaxed font-medium">
                {post.author?.shortBio || "Expert insights on career growth and modern technology trends."}
              </p>
              {isValidLinkedInUrl(post.author?.linkedinUrl) && (
                <a
                  href={post.author.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex text-xs font-black uppercase tracking-[0.2em] text-primary/70 hover:text-primary"
                >
                  LinkedIn →
                </a>
              )}
            </div>

            {/* Table of Contents */}
            {headings.length > 0 && (
              <div className="rounded-[2.5rem] border border-border/50 bg-white dark:bg-white/[0.02] p-8 backdrop-blur-md shadow-xl shadow-black/[0.02]">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-6 flex items-center gap-2">
                  <LayoutList size={12} /> Table of Contents
                </p>
                <TableOfContents headings={headings} />
              </div>
            )}

            {/* Promo Card */}
            <div className="rounded-[2.5rem] bg-foreground p-8 text-primary-foreground relative overflow-hidden group shadow-2xl shadow-primary/20">
              <div className="relative z-10">
                <h4 className="font-serif text-2xl font-black leading-tight mb-3">Launch Your Career.</h4>
                <p className="text-primary-foreground/80 text-sm font-medium mb-6 leading-relaxed">
                  Join our high-impact training programs in Agra.
                </p>
                <Link
                  href="/programs"
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-background text-foreground text-xs font-black tracking-widest uppercase transition-colors hover:bg-muted"
                >
                  Explore Courses
                </Link>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
