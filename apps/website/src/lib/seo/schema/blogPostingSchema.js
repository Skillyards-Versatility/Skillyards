import { ORGANIZATION_ID } from "./global.js";
import { absoluteAssetUrl, absoluteUrl, withFragment } from "../core/url.js";
import { isValidLinkedInUrl } from "../core/isValidLinkedInUrl.js";

export const getBlogPostingSchema = (post) => {
  const isPillar =
    post.contentType === "pillar-brand" || post.contentType === "pillar-sub";
  const isNews = post.contentType === "news";
  const slug = post.slug?.current || post.slug;
  const postUrl = absoluteUrl(`/blog/${slug}`);

  // Keywords: prefer explicit seoKeywords from editor, fall back to tag titles
  const keywords = post.seoKeywords?.length
    ? post.seoKeywords
    : post.tags?.map((tag) => tag.title) || [];

  // Article section: from category enum, mapped to human-readable label
  const categoryLabels = {
    "ojd-program": "On-Job Degree Program",
    "ojd-bca": "OJD BCA",
    "ojd-bba": "OJD BBA",
    "full-stack": "Full-Stack Development",
    "digital-marketing": "Digital Marketing",
    "career-guidance": "Career Guidance",
    "industry-news": "Industry News",
  };
  const articleSection = categoryLabels[post.category] || "Education";

  const schemaType = isNews
    ? "NewsArticle"
    : isPillar
      ? "Article"
      : "BlogPosting";

  return {
    "@context": "https://schema.org",
    "@type": schemaType,
    "@id": withFragment(postUrl, "#article"),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    headline: post.seoTitle || post.title,
    description: post.excerpt,
    image: post.resolvedImageUrl || undefined,
    datePublished: post.publishedAt,
    dateModified: post._updatedAt || post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author?.name || "SkillYards Team",
      ...(isValidLinkedInUrl(post.author?.linkedinUrl) && {
        sameAs: [post.author.linkedinUrl],
      }),
    },
    publisher: { "@id": ORGANIZATION_ID },
    keywords: keywords,
    articleSection: articleSection,
    timeRequired: post.readingTime ? `PT${post.readingTime}M` : undefined,
    wordCount: post.wordCount || undefined,
    ...(post.parentPillar &&
      !isNews && {
        isPartOf: {
          "@type": "Article",
          "@id": withFragment(
            absoluteUrl(`/blog/${post.parentPillar.slug}`),
            "#article",
          ),
          name: post.parentPillar.title,
        },
      }),
    ...(isNews && {
      about: "SkillYards media coverage",
      ...(post.sourceUrl && {
        citation: post.sourceUrl,
      }),
    }),
  };
};

export const getBlogSchema = (posts) => {
  const safePosts = Array.isArray(posts) ? posts : [];
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": withFragment(absoluteUrl("/blog"), "#blog"),
    name: "SkillYards Blog",
    description:
      "Read the latest news, tutorials, and insights regarding technology and careers from SkillYards.",
    publisher: {
      "@id": ORGANIZATION_ID,
    },
    ...(safePosts.length > 0 && {
      blogPost: safePosts.map((p) => ({
        "@id": withFragment(
          absoluteUrl(`/blog/${p.slug?.current || p.slug}`),
          "#blogposting",
        ),
      })),
    }),
  };
};
