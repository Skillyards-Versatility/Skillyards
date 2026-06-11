"use client";

import Image from "next/image";
import { useMemo } from "react";
import { urlFor } from "@/lib/sanity/image";
import Link from "next/link";

const AVATAR_PALETTES = [
  { bg: "bg-[#FAEEDA]", text: "text-[#633806]" },
  { bg: "bg-[#E1F5EE]", text: "text-[#085041]" },
  { bg: "bg-[#FBEAF0]", text: "text-[#72243E]" },
  { bg: "bg-[#E6F1FB]", text: "text-[#0C447C]" },
  { bg: "bg-[#EEEDFE]", text: "text-[#3C3489]" },
];

const PIN_COLORS = [
  "bg-[#E24B4A]",
  "bg-[#378ADD]",
  "bg-[#1D9E75]",
  "bg-[#D4537E]",
  "bg-[#BA7517]",
];

const getHash = (str = "") =>
  [...str].reduce((acc, char) => acc + char.charCodeAt(0), 0);

const getTilt = (slug) => {
  const tilts = [-2.2, -1.4, -0.6, 0.8, 1.6, 2.4];
  return tilts[getHash(slug) % tilts.length];
};

const getPalette = (name) =>
  AVATAR_PALETTES[getHash(name) % AVATAR_PALETTES.length];

const getPinColor = (slug) =>
  PIN_COLORS[getHash(slug) % PIN_COLORS.length];

const CONTENT_TYPE_LABELS = {
  "pillar-brand": "Guide",
  "pillar-sub": "Guide",
  cluster: "Guide",
  comparison: "Comparison",
  news: "News",
};

const Highlight = ({ text, query }) => {
  const result = useMemo(() => {
    if (!query?.trim() || !text) return null;

    const tokens = query.split(/\s+/).filter(Boolean);
    const pattern = new RegExp(`(${tokens.join("|")})`, "i");

    return {
      parts: text.split(pattern),
      tokens: tokens.map((t) => t.toLowerCase()),
    };
  }, [text, query]);

  if (!result) return <span>{text}</span>;

  return (
    <span>
      {result.parts.map((part, i) => {
        const isMatch = result.tokens.includes(part.toLowerCase());
        return isMatch ? (
          <mark
            key={i}
            className="bg-yellow-200 dark:bg-yellow-500/30 text-inherit rounded-sm px-0.5"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </span>
  );
};

const BlogCard = ({ post, searchQuery, onTagClick }) => {
  const { title, slug, publishedAt, author, coverImage, contentType, category } = post;
  const tags = Array.isArray(post.tags) ? post.tags : [];

  const hrefSlug = typeof slug === "string" ? slug : slug?.current;

  const coverUrl = coverImage
    ? urlFor(coverImage).width(600).height(450).url()
    : "/images/placeholder.jpg";

  const authorUrl = author?.image
    ? urlFor(author.image).width(200).height(200).url()
    : null;

  const dateLabel = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    : "Recent";

  const tiltAngle = getTilt(slug);
  const colorTheme = getPalette(author?.name || "");
  const pinClass = getPinColor(slug);
  const contentTypeLabel = CONTENT_TYPE_LABELS[contentType] || "Article";

  const initials = (author?.name || "SK")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article
      style={{ "--tilt": `${tiltAngle}deg` }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = `rotate(${tiltAngle * -0.4
          }deg) translateY(-8px) scale(1.02)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = `rotate(${tiltAngle}deg)`;
      }}
      className="group relative select-none flex flex-col gap-[14px] bg-white dark:bg-[#1c1c1a] border border-black/[0.08] dark:border-white/[0.08] rounded-sm p-[10px] pb-5 shadow-[2px_3px_10px_rgba(0,0,0,0.10)] dark:shadow-[2px_3px_16px_rgba(0,0,0,0.45)] transition-all duration-500 hover:z-10 hover:shadow-[6px_16px_32px_rgba(0,0,0,0.16)] cursor-pointer h-full"
    >
      <Link
        href={`/blog/${hrefSlug}`}
        className="absolute inset-0 z-[2]"
        aria-label={`Read more about ${title}`}
      />

      <div
        aria-hidden="true"
        className={`absolute -top-[9px] left-1/2 -translate-x-1/2 z-10 w-4 h-4 rounded-full border-2 border-white dark:border-[#1c1c1a] shadow-md ${pinClass}`}
      />

      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-[1px] bg-[#e5e3dc] dark:bg-[#2c2c2a] shrink-0">
        <Image
          src={coverUrl}
          alt={title || "Blog cover"}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
        />

        <div className="absolute top-[10px] -left-2 z-[5] w-12 h-[18px] -rotate-12 bg-[rgba(255,240,180,0.55)] dark:bg-[rgba(255,240,180,0.2)] border border-[rgba(200,180,100,0.25)]" />
      </div>

      <div className="flex flex-col flex-1 gap-1.5 px-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center rounded-full border border-black/10 bg-black/[0.03] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#4f4d47] dark:border-white/10 dark:bg-white/[0.04] dark:text-[#bdb7aa]">
            {contentTypeLabel}
          </span>
          {category && (
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#888780] dark:text-[#5f5e5a]">
              {category.replace(/-/g, " ")}
            </span>
          )}
        </div>

        <time className="font-mono text-[10px] text-[#888780] dark:text-[#5f5e5a]">
          {dateLabel}
        </time>

        <h3 className="text-sm font-medium leading-snug text-[#2c2c2a] dark:text-[#d3d1c7] line-clamp-2">
          <Highlight text={title} query={searchQuery} />
        </h3>

        <div className="flex items-center gap-1.5 mt-auto pt-2 flex-wrap">
          <div
            className={`relative w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold overflow-hidden ${colorTheme.bg} ${colorTheme.text}`}
          >
            {authorUrl ? (
              <Image
                src={authorUrl}
                alt={author?.name}
                fill
                className="object-cover"
              />
            ) : (
              initials
            )}
          </div>

          <span className="text-[11px] text-[#5f5e5a] dark:text-[#888780]">
            <Highlight
              text={author?.name || "SkillYards Team"}
              query={searchQuery}
            />
          </span>

          {tags.length > 0 && (
            <div className="flex gap-1 ml-auto relative z-10">
              {tags.slice(0, 2).map((tag) => (
                <button
                  key={tag.slug}
                  onClick={(e) => { e.preventDefault(); onTagClick?.(tag.title); }}
                  className="text-[9px] px-1.5 py-0.5 rounded-full border border-black/10 dark:border-white/10 text-[#5f5e5a] hover:text-[#2c2c2a] dark:hover:text-white transition-colors bg-white/50 dark:bg-black/20 backdrop-blur-sm"
                >
                  {tag.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
