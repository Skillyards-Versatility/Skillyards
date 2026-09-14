# SkillYards — Sanity CMS Guide

Everything you need to know about how Sanity is set up, what it manages, how data flows to the website, and how to make changes safely.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [CMS Structure](#2-cms-structure)
3. [Schema Reference](#3-schema-reference)
4. [Website Integration](#4-website-integration)
5. [Data Flow: Page by Page](#5-data-flow-page-by-page)
6. [FAQ System](#6-faq-system)
7. [Blog & Content System](#7-blog--content-system)
8. [Caching & Revalidation](#8-caching--revalidation)
9. [Environment Variables](#9-environment-variables)
10. [Migration Scripts](#10-migration-scripts)
11. [Adding New Content Types](#11-adding-new-content-types)
12. [Common Tasks](#12-common-tasks)

---

## 1. Project Overview

**Project ID:** `2it7abok`  
**Dataset:** `production`  
**API Version:** `2024-01-01`  
**Sanity Version:** `5.25.1`

The CMS lives at `apps/cms/` and the website consumes it from `apps/website/`. They are completely separate apps that talk via Sanity's CDN API.

```
apps/
├── cms/          ← Sanity Studio (content editing UI + schema definitions)
└── website/      ← Next.js site that fetches from Sanity at build/runtime
```

**What Sanity manages:**
| Content Type | Schema Name | Who Edits |
|---|---|---|
| Blog posts (articles, news, pillars) | `post` | Content team |
| Blog authors | `author` | Admin |
| Content tags | `tag` | Content team |
| Training batch info (seats, fees, dates) | `batch` | Admin |
| FAQ questions & answers | `faq` | Anyone |
| FAQ categories | `faqCategory` | Admin |

---

## 2. CMS Structure

```
apps/cms/
├── sanity.config.js           ← Studio config (projectId, dataset, plugins)
├── sanity.cli.js              ← CLI deployment config
├── schemaTypes/
│   ├── index.js               ← Registers all 6 schema types
│   ├── post.js                ← Blog posts (articles, pillars, news)
│   ├── author.js              ← Author profiles
│   ├── tag.js                 ← Content tags
│   ├── batch.js               ← Training batch info
│   ├── faq.js                 ← FAQ documents
│   └── faqCategory.js         ← FAQ category groupings
└── scripts/
    ├── migrate-faqs.mjs        ← One-time: imports hardcoded FAQs into Sanity
    └── patch-target-pages.mjs ← Patches FAQ targetPages field
```

```
apps/website/src/lib/sanity/
├── client.js                  ← Sanity client (CDN-enabled, read-only)
├── queries.js                 ← All GROQ queries
├── image.js                   ← urlFor() image URL builder
├── portableTextComponents.js  ← Renders blog rich text (h2, images, code)
├── readingTime.js             ← Calculates reading time from content blocks
└── slugifyHeading.js          ← Heading → anchor ID (used for blog TOC)
```

---

## 3. Schema Reference

### `faqCategory`

Groups FAQs by topic. There are 7 categories in production.

| Field         | Type   | Notes                                                    |
| ------------- | ------ | -------------------------------------------------------- |
| `title`       | string | Display name — "Full-Stack Dev", "General", etc.         |
| `slug`        | slug   | Auto from title. Used as the lookup key in GROQ queries. |
| `description` | text   | Shown as subtitle in the FAQ accordion                   |
| `order`       | number | Lower = appears first in sidebar                         |

**Current slugs:** `homepage`, `general`, `fullstack`, `digitalmarketing`, `degrees`, `support`, `test`

---

### `faq`

Individual FAQ question/answer pair.

| Field            | Type                    | Notes                                                               |
| ---------------- | ----------------------- | ------------------------------------------------------------------- |
| `question`       | string                  | 10–200 chars. Required.                                             |
| `answer`         | text                    | Min 20 chars. Can include basic HTML (links, `<strong>`). Required. |
| `category`       | reference → faqCategory | Required. Determines which page group this belongs to.              |
| `slug`           | slug                    | Auto from question. Used for future individual FAQ pages.           |
| `order`          | number                  | Lower = appears first within the category.                          |
| `focusKeyphrase` | string                  | SEO: the primary keyword this FAQ should rank for.                  |
| `targetPages`    | array of strings        | Which pages display this FAQ. e.g. `["/", "/programs"]`             |
| `isActive`       | boolean                 | Default true. Uncheck to hide without deleting.                     |

**To hide an FAQ without deleting it:** set `isActive` to false in Sanity Studio.

---

### `batch`

Training program batch info shown on the homepage and programs page.

| Field          | Type    | Notes                                |
| -------------- | ------- | ------------------------------------ |
| `program`      | string  | e.g. "Full-Stack Development", "BCA" |
| `nextBatch`    | string  | e.g. "July 2026"                     |
| `duration`     | string  | e.g. "6 Months"                      |
| `fee`          | string  | e.g. "Starting ₹25,000"              |
| `image`        | image   | Batch card thumbnail                 |
| `emiAvailable` | boolean | Shows EMI badge if true              |
| `seatsLeft`    | number  | Shown as urgency indicator           |
| `ctaLink`      | string  | Default `/contact`                   |
| `order`        | number  | Display order                        |

---

### `post`

Blog content. Supports 5 content types via the `contentType` field.

| `contentType` value | Purpose                           | Length          |
| ------------------- | --------------------------------- | --------------- |
| `pillar-brand`      | Main topic authority page         | 2500–4000 words |
| `pillar-sub`        | Sub-topic under a pillar          | —               |
| `cluster`           | Supporting article                | 800–1800 words  |
| `comparison`        | Comparison piece                  | —               |
| `news`              | Media coverage / SkillYards Times | —               |

**Key fields:**

| Field               | Notes                                                                             |
| ------------------- | --------------------------------------------------------------------------------- |
| `title`             | 20–120 chars. Appears as H1.                                                      |
| `slug`              | Auto from title. Forms the URL `/blog/[slug]`.                                    |
| `excerpt`           | 80–160 chars. Becomes meta description.                                           |
| `coverImage`        | Required. Shown in blog card and post header.                                     |
| `publishedAt`       | Datetime. Controls order and sitemap `lastmod`.                                   |
| `content`           | Portable Text (rich text, images, code blocks).                                   |
| `author`            | Reference to author document.                                                     |
| `contentType`       | Determines layout and pillar relationships.                                       |
| `parentPillar`      | Reference to parent post (for clusters/sub-pillars).                              |
| `tags`              | 2–8 tag references. Used for filtering and related articles.                      |
| `category`          | Enum: `full-stack`, `digital-marketing`, `career-guidance`, `industry-news`, etc. |
| `relatedMoneyPages` | Internal CTA links to conversion pages (max 5).                                   |
| `siblingArticles`   | Related posts shown at bottom (max 4).                                            |
| `seoTitle`          | Optional override for `<title>` tag (max 60 chars).                               |
| `noIndex`           | Boolean. Set true to exclude from search engines.                                 |

**News-only fields:** `sourceName`, `sourceLanguage`, `sourceDate`, `sourceUrl`, `clippingImage`, `englishSummary`

---

### `author`

| Field         | Notes                                            |
| ------------- | ------------------------------------------------ |
| `name`        | Display name                                     |
| `slug`        | Auto from name                                   |
| `image`       | Author photo (shown on blog cards + post header) |
| `role`        | e.g. "CEO", "Full Stack Developer"               |
| `shortBio`    | Shown on post byline                             |
| `linkedinUrl` | Must be a real LinkedIn URL                      |
| `expertise`   | Array of topic strings (React, SEO, etc.)        |

---

### `tag`

Simple label used on blog posts for taxonomy.

| Field   | Notes                           |
| ------- | ------------------------------- |
| `title` | 2–40 chars. Use kebab-case.     |
| `slug`  | Auto from title (max 50 chars). |

---

## 4. Website Integration

### Sanity Client

`apps/website/src/lib/sanity/client.js`

```js
export const sanityClient = createClient({
  projectId: "2it7abok",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true, // reads from CDN cache — fast, slightly stale
});
```

`useCdn: true` means reads come from Sanity's global CDN. Content updates propagate within ~2 seconds. For the revalidation webhook to work, this is intentional — the webhook clears the Next.js cache after Sanity's CDN updates.

### GROQ Queries

All queries are in `apps/website/src/lib/sanity/queries.js`.

| Export Name                | What It Fetches                    | Used By                    |
| -------------------------- | ---------------------------------- | -------------------------- |
| `POSTS_QUERY`              | All blog posts (desc by date)      | Blog list page             |
| `HOMEPAGE_POSTS_QUERY`     | Latest 3 blog posts                | Homepage blog section      |
| `POST_BY_SLUG_QUERY`       | Single post by slug (full content) | Blog `[slug]` page         |
| `PILLAR_CHILDREN_QUERY`    | Posts under a parent pillar        | Blog pillar pages          |
| `FEATURED_PILLARS_QUERY`   | Top 4 pillar posts                 | Blog list featured section |
| `NEWS_POSTS_QUERY`         | Top 4 news posts                   | Blog list news section     |
| `BATCHES_QUERY`            | All batch documents (asc by order) | Homepage, Programs page    |
| `FAQS_BY_CATEGORY_QUERY`   | FAQs for one category slug         | Individual pages           |
| `ALL_FAQ_CATEGORIES_QUERY` | All categories + nested FAQs       | `/faqs` page               |

### Image URLs

To generate image URLs from Sanity image references:

```js
import { urlFor } from "@/lib/sanity/image";

<Image src={urlFor(post.coverImage).width(800).url()} />;
```

---

## 5. Data Flow: Page by Page

| Page                                           | Sanity Data Used             | Query / Function                              | Revalidate |
| ---------------------------------------------- | ---------------------------- | --------------------------------------------- | ---------- |
| `/` (Homepage)                                 | Batch info, 4 homepage FAQs  | `BATCHES_QUERY`, `getPageFaqs("homepage", 4)` | 24h        |
| `/programs`                                    | Batch info, 5 general FAQs   | `BATCHES_QUERY`, `getPageFaqs("general", 5)`  | 24h        |
| `/programs/on-job-degree`                      | 6 degree FAQs                | `getPageFaqs("degrees", 6)`                   | 24h        |
| `/programs/on-job-training`                    | 6 general FAQs               | `getPageFaqs("general", 6)`                   | 24h        |
| `/faqs`                                        | All categories + all FAQs    | `getAllFaqCategories()`                       | 24h        |
| `/about`                                       | 4 homepage FAQs              | `getPageFaqs("homepage", 4)`                  | 24h        |
| `/support`                                     | All support FAQs (multi-tab) | `getAllFaqCategories()` → filtered            | 24h        |
| `/10-minutes-test`                             | Test FAQs                    | `getPageFaqs("test")`                         | 24h        |
| `/full-stack-web-development-training-in-agra` | Fullstack FAQs               | `getPageFaqs("fullstack")`                    | 24h        |
| `/digital-marketing-course-in-agra`            | DGM FAQs                     | `getPageFaqs("digitalmarketing")`             | 24h        |
| `/blog`                                        | All posts, featured pillars  | `POSTS_QUERY`, `FEATURED_PILLARS_QUERY`       | 1h         |
| `/blog/[slug]`                                 | Single post (full content)   | `POST_BY_SLUG_QUERY`                          | 1h         |
| `/sitemap.xml`                                 | All post slugs + dates       | Custom query                                  | 1h         |

---

## 6. FAQ System

### How FAQs Work End-to-End

```
Sanity Studio
  └── faqCategory (e.g. "fullstack", order: 2)
        └── faq (question, answer, isActive: true, targetPages: ["/full-stack-..."])
              │
              ▼
  GROQ Query (FAQS_BY_CATEGORY_QUERY)
              │
              ▼
  getPageFaqs("fullstack", 10)  ← called in page.jsx
              │
              ▼
  <ProgramsFAQ faqs={faqs} />   ← React component renders accordion
              │
              ▼
  getFAQSchema(faqs)             ← JSON-LD FAQPage for Google rich results
```

### FAQ Helper Functions

`apps/website/src/lib/seo/getFaqs.js`

```js
// Fetch FAQs for one category, with optional limit
getPageFaqs(categorySlug: string, limit?: number): Promise<FAQ[]>

// Fetch all categories with nested FAQs (used on /faqs page)
getAllFaqCategories(): Promise<FaqCategory[]>

// Merge FAQs from multiple categories into one flat array (for schema)
getMergedFaqsForSchema(categorySlugs: string[]): Promise<FAQ[]>
```

### Adding an FAQ

1. Open Sanity Studio → FAQ
2. Click **New FAQ**
3. Fill in question, answer, select category
4. Set `targetPages` to the page paths where it should appear (e.g. `["/programs"]`)
5. Set `order` (lower = appears higher)
6. Publish — the website revalidates via webhook within seconds

### Adding a New FAQ Category

1. Open Sanity Studio → FAQ Category → New
2. Set title, slug, description, order
3. Add FAQs referencing this new category
4. Add a new entry in `categoryMeta` in `apps/website/src/components/faqspage/FAQsAccordion.jsx`:

```js
const categoryMeta = {
  // ... existing entries
  "your-new-slug": {
    icon: <SomeIcon size={18} />,
    color: "bg-purple-100 text-purple-700 ...",
  },
};
```

Without this, the category will still display but will use a grey fallback icon/colour.

### FAQ Components

| Component       | Location                     | Props                                        | Used On            |
| --------------- | ---------------------------- | -------------------------------------------- | ------------------ |
| `FAQsAccordion` | `components/faqspage/`       | `categories` (full object)                   | `/faqs`            |
| `FAQSection`    | `components/common/`         | `faqs` (array)                               | Homepage, About    |
| `ProgramsFAQ`   | `components/programspage/`   | `faqs` (array)                               | Programs pages     |
| `SupportFAQ`    | `components/supportpage/`    | `faqsByCategory` (array of category objects) | `/support`         |
| `TestFAQ`       | `components/testpage/`       | `faqs` (array)                               | `/10-minutes-test` |
| `FSDFAQ`        | `components/landingPageFSD/` | `faqs` (array)                               | FSD landing page   |
| `DGMFAQ`        | `components/landingPageDGM/` | `faqs` (array)                               | DGM landing page   |

---

## 7. Blog & Content System

### Content Hierarchy

```
pillar-brand (e.g. "Complete Guide to Full-Stack Development")
  └── pillar-sub (e.g. "React Fundamentals")
        ├── cluster (e.g. "useState vs useReducer")
        ├── cluster (e.g. "React Performance Tips")
        └── comparison (e.g. "React vs Vue")
  └── news (e.g. "SkillYards Featured in Live Hindustan")
```

### Internal Linking Strategy

Each `post` has two link fields:

**`relatedMoneyPages`** — Internal CTAs to conversion pages. Each entry has:

- `title` — link text
- `path` — e.g. `/full-stack-web-development-training-in-agra`
- `linkContext` — how it renders:
  - `related-block` → shown as a card at end of post
  - `cta-prominent` → inline CTA box
  - `inline-mention` → auto-linked text mention

**`siblingArticles`** — 2–4 related posts shown at the bottom of the article.

### Publishing a New Post

1. Sanity Studio → Post → New Post
2. Select `contentType` — this determines layout and required fields
3. If it's a `cluster`, set `parentPillar` to the relevant pillar post
4. Add 2–8 tags
5. Set `category` (used for filtering on blog page)
6. Write content in the Portable Text editor
7. Add `relatedMoneyPages` to link to a course/program page
8. Publish — website updates within 1 hour (ISR revalidate: 3600s)

For news posts, additionally fill: `sourceName`, `sourceDate`, `clippingImage`, `englishSummary`.

### Sitemap

`/sitemap.xml` is auto-generated and includes all published blog posts using `_updatedAt` as `lastmod`. No manual action needed when publishing.

---

## 8. Caching & Revalidation

### Revalidation Intervals

| Content Type             | Interval     | Reason                                |
| ------------------------ | ------------ | ------------------------------------- |
| Blog posts, sitemap      | 3600s (1h)   | Fresh content should appear quickly   |
| Homepage, programs, FAQs | 86400s (24h) | Stable content, less frequent changes |

### Tag-Based Revalidation (FAQs Only)

FAQ edits in Sanity can trigger **instant** cache clearing via webhook:

```
Sanity Studio → Publish FAQ
    └── Sanity sends POST to https://yourdomain.com/api/revalidate
          └── route.js verifies Bearer token
                └── revalidateTag("faqs")
                      └── All pages tagged "faqs" re-render on next request
```

**Webhook configuration in Sanity Dashboard:**

- URL: `https://yourdomain.com/api/revalidate`
- Filter: `_type in ["faq", "faqCategory"]`
- Header: `Authorization: Bearer <SANITY_WEBHOOK_SECRET>`

**Required env var on website:** `SANITY_WEBHOOK_SECRET`

### Cache Tags Used

| Tag    | Applied To      | Invalidated When                            |
| ------ | --------------- | ------------------------------------------- |
| `faqs` | All FAQ fetches | Any `faq` or `faqCategory` document changes |

Blog posts do not currently use tag-based invalidation — they rely on the 1h interval.

---

## 9. Environment Variables

### `apps/cms/.env`

```
SANITY_TOKEN=<editor-role token from sanity.io/manage>
```

Used only for migration scripts. Not needed for normal Studio use.

### `apps/website/.env.local`

Sanity-related variables the website needs:

```
SANITY_WEBHOOK_SECRET=<random hex string — must match Sanity webhook header>
```

The Sanity project ID and dataset are hardcoded in `apps/website/src/lib/sanity/client.js` (public, read-only — safe to hardcode).

---

## 10. Migration Scripts

Located at `apps/cms/scripts/`.

### `migrate-faqs.mjs`

Imports all 59 FAQs + 7 categories from the static `faqs.js` file into Sanity. **Idempotent** — safe to run multiple times. Uses slug-based upsert (patches existing, creates new).

```bash
# Run from repo root
SANITY_TOKEN=your-editor-token node apps/cms/scripts/migrate-faqs.mjs
```

### `patch-target-pages.mjs`

Adds new page paths to existing FAQ documents' `targetPages` field. Used when adding a new page that should show existing FAQs.

```bash
SANITY_TOKEN=your-editor-token node apps/cms/scripts/patch-target-pages.mjs
```

To extend it for new pages, edit the `patches` array at the top of the file:

```js
const patches = [
  { categorySlug: "degrees", addPage: "/programs/on-job-degree" },
  { categorySlug: "general", addPage: "/programs/on-job-training" },
  // add your new page here
];
```

---

## 11. Adding New Content Types

### Adding a New Sanity Schema

1. Create `apps/cms/schemaTypes/yourType.js`
2. Import and add it to `apps/cms/schemaTypes/index.js`
3. Deploy Studio: `cd apps/cms && npx sanity deploy`

### Adding a New GROQ Query

Add to `apps/website/src/lib/sanity/queries.js`:

```js
export const YOUR_QUERY = `
  *[_type == "yourType"] | order(order asc) {
    field1,
    field2,
    "slug": slug.current
  }
`;
```

### Fetching in a Page

```js
// In a Next.js page (server component)
import { sanityClient } from "@/lib/sanity/client";
import { YOUR_QUERY } from "@/lib/sanity/queries";

export const revalidate = 86400;

export default async function YourPage() {
  const data = await sanityClient.fetch(
    YOUR_QUERY,
    {},
    { next: { tags: ["your-tag"] } },
  );
  return <YourComponent data={data} />;
}
```

### Adding Cache Tag Revalidation

1. Add tag to fetch: `{ next: { tags: ["your-tag"] } }`
2. In `apps/website/src/app/api/revalidate/route.js`, add:

```js
if (docType === "yourType") {
  revalidateTag("your-tag");
}
```

3. Update the Sanity webhook filter to include: `_type in ["faq", "faqCategory", "yourType"]`

---

## 12. Common Tasks

### Update a FAQ answer

Sanity Studio → FAQ → find by question → edit answer → Publish. Live within seconds if webhook is configured, otherwise within 24h.

### Add a new batch / update seats left

Sanity Studio → Batch → find program → update `seatsLeft` or `nextBatch` → Publish. Live within 24h (or on next build).

### Publish a blog post

Sanity Studio → Post → New → fill all required fields → Publish. Appears on site within 1h.

### Deploy Studio after schema changes

```bash
cd apps/cms && npx sanity deploy
```

### Verify FAQPage JSON-LD on a page

Right-click → View Page Source → Ctrl+F → search `"FAQPage"`. Should return a JSON-LD block with `mainEntity` array.

### Check what data a page gets from Sanity

See the [Data Flow table](#5-data-flow-page-by-page) above, or look at the `export default async function` in the page file — every `sanityClient.fetch()` or `getPageFaqs()` call is a Sanity data dependency.

### Run the FAQ migration (first-time setup)

```bash
# 1. Get an editor token from sanity.io/manage → API → Tokens
# 2. Run:
SANITY_TOKEN=your-token node apps/cms/scripts/migrate-faqs.mjs
# 3. Deploy studio:
cd apps/cms && npx sanity deploy
```
