# Skillyards Codebase Discovery Report

**Generated:** 2026-05-16  
**Repo root:** `/home/mrigesh/Desktop/Khazana/Skillyards`  
**Primary app:** `apps/website` (Next.js 14+ App Router, JavaScript/JSX with one TypeScript file)

---

## Section 1: Repository Structure Overview

### Monorepo Layout (3-level tree, excluding node_modules, .next, .git, dist, build, .turbo)

```
.
├── apps/
│   ├── admin/          Next.js admin panel (components.json present — shadcn/ui)
│   ├── api/            Next.js API backend (enquiries, PDF, etc.)
│   ├── cms/            Sanity Studio v3 (schemaTypes/)
│   ├── erp/            ERP app (Next.js, likely internal)
│   └── website/        Public-facing website (primary subject of this report)
│       ├── src/
│       │   ├── app/            App Router pages
│       │   ├── components/     UI components organized by page/feature
│       │   ├── data/           Static data files (JS/JSON)
│       │   └── lib/            Sanity client, SEO system, utilities
│       ├── next.config.mjs
│       ├── package.json
│       ├── tailwind.config.mjs
│       ├── jsconfig.json
│       └── tsconfig.json
├── packages/
│   ├── db/             Drizzle ORM schema + migrations
│   └── ui/             Shared UI package (placeholder)
│   └── utils/          Shared utilities
├── docs/               Architecture docs, OpenAPI spec
├── script/             Seed scripts
├── src/                Root-level src (minimal — students portal stub)
├── drizzle.config.js
├── package.json        Root workspace package.json
└── .env
```

### Root-Level Config Files

| File                | Purpose                                                   |
| ------------------- | --------------------------------------------------------- |
| `drizzle.config.js` | Drizzle ORM config pointing to packages/db                |
| `.env`              | Root env (DB credentials shared across workspace)         |
| `package.json`      | npm workspace definition, lists `apps/*` and `packages/*` |
| `.gitignore`        | Standard, includes `.env.local`, `.next`, `node_modules`  |

### `apps/website` Config Files

| File                  | Purpose                                                                    |
| --------------------- | -------------------------------------------------------------------------- |
| `next.config.mjs`     | Next.js config — redirects, rewrites, headers (CSP), image remote patterns |
| `tailwind.config.mjs` | Tailwind v4 config                                                         |
| `postcss.config.mjs`  | PostCSS for Tailwind v4                                                    |
| `jsconfig.json`       | JS path aliases (`@/` → `src/`)                                            |
| `tsconfig.json`       | TypeScript config (strict, also covers JS via `allowJs`)                   |
| `eslint.config.mjs`   | ESLint with Next.js preset                                                 |
| `components.json`     | shadcn/ui component registry config                                        |

### Package.json — Key Dependencies

**Dependencies:**

```json
{
  "@next/third-parties": "^16.0.4",
  "@portabletext/react": "^6.0.3",
  "@radix-ui/react-accordion": "^1.2.12",
  "@radix-ui/react-dialog": "^1.1.15",
  "@radix-ui/react-dropdown-menu": "^2.1.16",
  "@radix-ui/react-label": "^2.1.8",
  "@radix-ui/react-separator": "^1.1.8",
  "@radix-ui/react-slot": "^1.2.4",
  "@sanity/client": "^7.17.0",
  "@sanity/image-url": "^2.0.3",
  "@tailwindcss/typography": "^0.5.19",
  "@use-gesture/react": "^10.3.1",
  "@vercel/analytics": "^2.0.1",
  "@vercel/speed-insights": "^2.0.0",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "embla-carousel-autoplay": "^8.6.0",
  "embla-carousel-react": "^8.6.0",
  "framer-motion": "^12.35.2",
  "lucide-react": "^0.552.0",
  "motion": "^12.38.0",
  "next": "^16.1.6",
  "ogl": "^1.0.11",
  "react": "19.2.0",
  "react-dom": "19.2.0",
  "react-google-recaptcha": "^3.1.0",
  "react-google-recaptcha-v3": "^1.11.0",
  "react-icons": "^5.5.0",
  "react-share": "^5.2.2",
  "tailwind-merge": "^3.4.0",
  "tailwindcss-animate": "^1.0.7"
}
```

**DevDependencies:**

```json
{
  "@tailwindcss/postcss": "^4",
  "@types/node": "^25.8.0",
  "babel-plugin-react-compiler": "1.0.0",
  "eslint": "^9",
  "eslint-config-next": "16.0.1",
  "tailwindcss": "^4",
  "tw-animate-css": "^1.4.0"
}
```

### TypeScript vs JavaScript

The website app is **primarily JavaScript (JSX)**. The sole `.ts`/`.tsx` file in the app router is `src/app/sitemap.ts`. A `tsconfig.json` exists and `next-env.d.ts` is present — TypeScript compilation covers all files via `allowJs: true`. No strict TypeScript type annotations appear in component files.

---

## Section 2: Sanity Schema — Complete Current State

### CMS Location

`apps/cms/schemaTypes/` — 5 files.

### Schema: `post` (Blog Post)

**File:** `apps/cms/schemaTypes/post.js`  
**Document type:** `post` | Title: `Blog Post`

| Field         | Type                         | Validation        | Notes                                                    |
| ------------- | ---------------------------- | ----------------- | -------------------------------------------------------- |
| `title`       | `string`                     | required          | Source for slug                                          |
| `slug`        | `slug`                       | required          | `maxLength: 96`, source: `title`                         |
| `excerpt`     | `text`                       | none              | 3 rows                                                   |
| `coverImage`  | `image`                      | none              | `hotspot: true`                                          |
| `publishedAt` | `datetime`                   | none              | —                                                        |
| `tags`        | `array` of `reference → tag` | `min(1)` required | At least one tag                                         |
| `content`     | `array`                      | none              | `block`, `image` (hotspot), `code` (default: javascript) |
| `author`      | `reference → author`         | required          | —                                                        |

No groups defined. No `seo` or `keywords` field on the `post` document.

---

### Schema: `author`

**File:** `apps/cms/schemaTypes/author.js`  
**Document type:** `author` | Title: `Author`

| Field   | Type     | Validation | Notes                          |
| ------- | -------- | ---------- | ------------------------------ |
| `name`  | `string` | required   | —                              |
| `image` | `image`  | none       | `hotspot: true`                |
| `role`  | `string` | none       | e.g. CEO, Full Stack Developer |

No `slug`, `bio`, `social` fields on Sanity author schema. Author profile pages are driven by static `TEAM_PROFILES` data instead.

---

### Schema: `tag`

**File:** `apps/cms/schemaTypes/tag.js`  
**Document type:** `tag` | Title: `Tag`

| Field   | Type     | Validation | Notes             |
| ------- | -------- | ---------- | ----------------- |
| `title` | `string` | required   | —                 |
| `slug`  | `slug`   | required   | `source: 'title'` |

No description or color fields.

---

### Schema: `batch`

**File:** `apps/cms/schemaTypes/batch.js`  
**Document type:** `batch` | Title: `Batch Information`

| Field          | Type      | Validation       | Notes                         |
| -------------- | --------- | ---------------- | ----------------------------- |
| `program`      | `string`  | required         | e.g. BCA, BBA, Full-Stack Dev |
| `nextBatch`    | `string`  | required         | e.g. July 2026                |
| `duration`     | `string`  | none             | e.g. 3 Years, 6 Months        |
| `fee`          | `string`  | none             | e.g. Starting ₹25,000         |
| `image`        | `image`   | none             | hotspot: true                 |
| `emiAvailable` | `boolean` | none             | initialValue: true            |
| `seatsLeft`    | `number`  | required, min: 0 | —                             |
| `ctaLink`      | `string`  | none             | initialValue: `/contact`      |
| `order`        | `number`  | none             | initialValue: 0               |

Preview: `program` as title, `nextBatch` as subtitle, `image` as media.

---

### Schema Registry

**File:** `apps/cms/schemaTypes/index.js`

```js
import post from "./post";
import author from "./author";
import tag from "./tag";
import batch from "./batch";

export const schemaTypes = [post, author, tag, batch];
```

---

### Sanity Client Config

**File:** `apps/website/src/lib/sanity/client.js`

```js
import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "2it7abok",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});
```

CDN enabled (`useCdn: true`). No token — read-only public queries only.

---

### GROQ Query Files

**File:** `apps/website/src/lib/sanity/queries.js`

Defines four named queries:

1. **`POSTS_QUERY`** — All posts, ordered by `publishedAt desc`, includes `author->`, `tags[]->`. Used by blog index.
2. **`HOMEPAGE_POSTS_QUERY`** — Same as above but `[0...3]`. Used by homepage BlogSection.
3. **`POSTS_BY_TAG_QUERY`** — Posts where `$slug in tags[]->slug.current`. Used by `/blog/tag/[slug]`.
4. **`BATCHES_QUERY`** — All `batch` documents ordered by `order asc`. Used by homepage and programs pages.

There is also an inline GROQ query in `apps/website/src/app/blog/[slug]/page.jsx`:

```groq
*[_type == "post" && slug.current == $slug][0]{
  _id, title, slug, excerpt, publishedAt, coverImage, content,
  author->{ name, image, role }
}
```

Note: **Tags are NOT fetched in the single-post GROQ query.** The `tags` field is omitted from the `getPost()` inline query, so tags are not available for rendering on individual blog post pages.

Also in `sitemap.ts`:

```groq
*[_type == "post" && defined(slug.current)]{ "slug": slug.current, _updatedAt }
```

And in `generateStaticParams` of blog post page:

```groq
*[_type == "post"]{ "slug": slug.current }
```

---

### imageUrlBuilder / urlFor

**File:** `apps/website/src/lib/sanity/image.js`

```js
import { createImageUrlBuilder } from "@sanity/image-url";
import { sanityClient } from "./client";

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source) {
  return builder.image(source);
}
```

Used across blog components for cover images and author images.

---

## Section 3: SEO System — Complete Inventory

### Directory Tree

```
apps/website/src/lib/seo/
├── buildSEO.js                    Main metadata builder for Next.js
├── seo.config.js                  Global SEO constants
├── validateSEO.js                 Input validation (console.warn only)
├── getFaqs.js                     Helper to get FAQs by page category
├── builders/
│   └── buildOrganizationSchema.js Builds Organization, Website, Location JSON-LD
├── constants/
│   └── ids.js                     @id constants for schema graph nodes
├── core/
│   └── url.js                     absoluteUrl(), absoluteAssetUrl(), withFragment()
├── data/
│   ├── orgData.js                 Canonical org facts (name, address, founders, socials)
│   └── press.js                   Press mention array (PRESS_MENTIONS)
├── schema/
│   ├── global.js                  Exports organizationSchema, websiteSchema, primaryLocationSchema
│   ├── blogPostingSchema.js       getBlogPostingSchema(), getBlogSchema()
│   ├── breadcrumbSchema.js        getBreadcrumbSchema()
│   ├── courseSchema.js            getCourseSchema()
│   ├── faqSchema.js               getFAQSchema()
│   ├── jobPostingSchema.js        getJobPostingSchema()
│   ├── personSchema.js            getPersonSchema()
│   ├── serviceSchema.js           getQuizSchema() (despite file name)
│   └── webPageSchema.js           getWebPageSchema(), getAboutPageSchema(), etc.
└── validators/
    ├── validateOrgData.js         Runtime validator for orgData structure
    └── validatePressMentions.js   Runtime validator for press[] array
```

---

### `buildSEO.js` — Verbatim

```js
import { SEO_CONFIG } from "./seo.config";
import { validateSEO } from "./validateSEO";

function normalizePath(path) {
  if (!path) return "/";
  let normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
}

export function buildSEO({
  title,
  description,
  path,
  keywords = [],
  ogType = "website",
  ogImage,
}) {
  validateSEO({ title, description, path });
  const safePath = normalizePath(path);
  const absoluteUrl = `${SEO_CONFIG.baseUrl}${safePath}`;
  const finalImage = ogImage || SEO_CONFIG.defaultOGImage;

  return {
    metadataBase: new URL(SEO_CONFIG.baseUrl),
    title: {
      default: title,
      template: SEO_CONFIG.titleTemplate,
    },
    description,
    keywords,
    alternates: {
      canonical: absoluteUrl,
    },
    openGraph: {
      type: ogType,
      title,
      description,
      url: absoluteUrl,
      siteName: SEO_CONFIG.siteName,
      images: [
        {
          url: finalImage,
          width: 1200,
          height: 630,
          alt: `${title} | ${SEO_CONFIG.siteName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [finalImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
```

---

### `seo.config.js` — Verbatim

```js
export const SEO_CONFIG = {
  siteName: "SkillYards",
  baseUrl: "https://www.skillyards.in",
  titleTemplate: "%s | SkillYards",
  defaultDescription:
    "SkillYards helps students build real-world skills with industry-focused programs.",
  defaultOGImage: "/images/opengraph/default.jpg",
};
```

---

### `validateSEO.js` — Verbatim

```js
export function validateSEO({ title, description, path }) {
  if (!title) {
    console.warn("SEO ERROR: Missing title");
  }
  if (!description) {
    console.warn("SEO ERROR: Missing description");
  }
  if (!path) {
    console.warn("SEO ERROR: Missing path (required for canonical)");
  }
}
```

Validation is non-throwing — only `console.warn`. No validation exists for keyword count, description length, or title length.

---

### SEO Schema Subdirectory — File Inventory

| File                   | `@type` Generated                                                                       | Key Inputs                                                         |
| ---------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `global.js`            | Exports pre-built `organizationSchema`, `websiteSchema`, `primaryLocationSchema`        | `orgData` from `data/orgData.js`                                   |
| `blogPostingSchema.js` | `BlogPosting`, `Blog`                                                                   | `post` object (title, slug, author, coverImage, publishedAt, etc.) |
| `breadcrumbSchema.js`  | `BreadcrumbList`                                                                        | `items[]` with `name` and `url`                                    |
| `courseSchema.js`      | `Course` with `CourseInstance`, `Offer`, `EducationalOccupationalProgram`               | `course` from `data/courses.js`                                    |
| `faqSchema.js`         | `FAQPage`                                                                               | `faqs[]` with `question`/`q` and `answer`/`a`                      |
| `jobPostingSchema.js`  | `JobPosting`                                                                            | `job` object                                                       |
| `personSchema.js`      | `Person`                                                                                | `person` object with `name`, `role`, `image`, `url`, `description` |
| `serviceSchema.js`     | `Quiz` (not `Service`)                                                                  | `quiz` object                                                      |
| `webPageSchema.js`     | `WebPage`, `AboutPage`, `ContactPage`, `CollectionPage`, `ImageGallery`, `VideoGallery` | `page` object with `url`, `name`, `description`, `keywords`        |

---

### `schema/global.js` — Verbatim

```js
import { orgData } from "../data/orgData.js";
import {
  buildOrganizationSchema,
  buildPrimaryLocationSchema,
  buildWebsiteSchema,
} from "../builders/buildOrganizationSchema.js";
import {
  ORGANIZATION_ID,
  PRIMARY_LOCATION_ID,
  WEBSITE_ID,
} from "../constants/ids.js";

export { ORGANIZATION_ID, PRIMARY_LOCATION_ID, WEBSITE_ID };

export const organizationSchema = buildOrganizationSchema(orgData);
export const websiteSchema = buildWebsiteSchema(orgData);
export const primaryLocationSchema = buildPrimaryLocationSchema(orgData);
```

---

### `schema/courseSchema.js` — Verbatim

```js
import { ORGANIZATION_ID, PRIMARY_LOCATION_ID } from "./global.js";
import { absoluteAssetUrl, absoluteUrl, withFragment } from "../core/url.js";

export const getCourseSchema = (course) => ({
  "@context": "https://schema.org",
  "@type": "Course",
  "@id": withFragment(absoluteUrl(course.seo.path), "#course"),
  name: course.title,
  description: course.description,
  keywords: course.seo?.keywords || [...],
  provider: { "@id": ORGANIZATION_ID },
  isPartOf: {
    "@type": "EducationalOccupationalProgram",
    name: course.title,
    description: course.description,
    occupationalCategory: course.category || "Information Technology",
    educationalCredentialAwarded: "Certificate of Completion",
    provider: { "@id": ORGANIZATION_ID }
  },
  image: course.seo?.ogImage ? absoluteAssetUrl(course.seo.ogImage) : absoluteAssetUrl("/images/opengraph/fullstack-og.jpg"),
  educationalLevel: "Beginner to Advanced",
  inLanguage: "en",
  ...(course.certification && {
    educationalCredentialAwarded: [{ "@type": "EducationalOccupationalCredential", name: course.certification, credentialCategory: "Certificate" }]
  }),
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "offline",
    location: { "@id": PRIMARY_LOCATION_ID },
    ...(course.startDate && { startDate: ... })
  },
  offers: {
    "@type": "Offer",
    category: "Professional Training",
    availability: "https://schema.org/InStock",
    price: "0",
    url: absoluteUrl(course.seo.path),
    priceCurrency: "INR",
  },
});
```

Note: `educationalCredentialAwarded` is defined twice if `course.certification` is present (at root level as "Certificate of Completion" and inside the spread). The spread will override the first.

---

### `schema/blogPostingSchema.js` — Key Points

- `getBlogPostingSchema(post)` builds a `BlogPosting` schema.
- References `post.seo?.keywords` and `post.category?.title` — neither field exists on the Sanity `post` document schema. Both will fall back to hardcoded defaults.
- References `post._updatedAt` — this is NOT fetched in the `getPost()` GROQ query; will be `undefined`.

---

### `schema/breadcrumbSchema.js` — Verbatim

```js
import { absoluteUrl } from "../core/url.js";

export const getBreadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url.startsWith("http") ? item.url : absoluteUrl(item.url),
  })),
});
```

---

### `data/orgData.js` — Summary

Exports `orgData` object with:

- `name: "SkillYards"`, `url: "https://www.skillyards.in"`
- `foundingDate: "2023"`
- `founders: [{ name: "Rahul Singh", jobTitle: "COO" }, { name: "Suryansh Upadhyay", jobTitle: "CEO" }]`
- `knowsAbout`: 9 items (Full Stack, Data Science, OJT, OJD, etc.)
- `areaServed`: City: Agra, Country: India
- Logo: `/images/logo-square.png` (512x512)
- Default OG: `/images/opengraph/home-og.jpg` (1200x630)
- Address: A-3, behind Manoj Dhaba, Bhagwan Talkies crossing, Indra Puri, New Agra Colony, Agra, UP 282005
- Phone: `+91 7060166562`
- Socials: Facebook, LinkedIn, Instagram, Twitter, YouTube
- `press`: 1 entry (Live Hindustan, 2026-05-12)

---

### `constants/ids.js` — Verbatim

```js
export const BASE_URL = "https://www.skillyards.in";
export const ORGANIZATION_ID = `${BASE_URL}/#organization`;
export const WEBSITE_ID = `${BASE_URL}/#website`;
export const PRIMARY_LOCATION_ID = `${BASE_URL}/#location-agra`;
```

---

## Section 4: App Router Structure

### Full `src/app/` Tree (2 levels)

```
src/app/
├── 10-minutes-test/page.jsx
├── 503.jsx
├── about/page.jsx
├── api/
│   └── contact-submit/route.js
├── bba-training-program-in-agra/page.jsx
├── bca-training-program-in-agra/page.jsx
├── blog/
│   ├── page.jsx
│   ├── [slug]/page.jsx
│   └── tag/[slug]/page.jsx
├── campaigns/
│   ├── layout.js
│   └── ojd/page.jsx
├── careers/
│   ├── page.jsx
│   └── [slug]/page.jsx
├── contact/page.js
├── digital-marketing-course-in-agra/page.jsx
├── faqs/page.jsx
├── feedback/[uuid]/page.jsx
├── full-stack-web-development-training-in-agra/page.jsx
├── gallery/
│   ├── page.jsx
│   ├── images/page.jsx
│   └── videos/page.jsx
├── legal/
│   ├── page.jsx
│   ├── privacy-policy/page.jsx
│   ├── refund-policy/page.jsx
│   └── terms-of-service/page.jsx
├── page.js
├── programs/
│   ├── page.jsx
│   ├── on-job-degree/page.jsx
│   └── on-job-training/page.jsx
├── sitemap-html/page.jsx
├── sitemap.ts
├── robots.js (inside app dir — actually `robots.ts` based on grep)
├── success-stories/page.jsx
├── support/page.jsx
├── team/
│   ├── page.jsx
│   └── [slug]/page.jsx
├── testimonials/page.jsx
└── unsubscribe/page.jsx
```

### Route File Summary

| Route                                          | File                                                           |
| ---------------------------------------------- | -------------------------------------------------------------- |
| `/`                                            | `src/app/page.js`                                              |
| `/about`                                       | `src/app/about/page.jsx`                                       |
| `/bba-training-program-in-agra`                | `src/app/bba-training-program-in-agra/page.jsx`                |
| `/bca-training-program-in-agra`                | `src/app/bca-training-program-in-agra/page.jsx`                |
| `/blog`                                        | `src/app/blog/page.jsx`                                        |
| `/blog/[slug]`                                 | `src/app/blog/[slug]/page.jsx`                                 |
| `/blog/tag/[slug]`                             | `src/app/blog/tag/[slug]/page.jsx`                             |
| `/campaigns/ojd`                               | `src/app/campaigns/ojd/page.jsx`                               |
| `/careers`                                     | `src/app/careers/page.jsx`                                     |
| `/careers/[slug]`                              | `src/app/careers/[slug]/page.jsx`                              |
| `/contact`                                     | `src/app/contact/page.js`                                      |
| `/digital-marketing-course-in-agra`            | `src/app/digital-marketing-course-in-agra/page.jsx`            |
| `/faqs`                                        | `src/app/faqs/page.jsx`                                        |
| `/feedback/[uuid]`                             | `src/app/feedback/[uuid]/page.jsx`                             |
| `/full-stack-web-development-training-in-agra` | `src/app/full-stack-web-development-training-in-agra/page.jsx` |
| `/gallery`                                     | `src/app/gallery/page.jsx`                                     |
| `/gallery/images`                              | `src/app/gallery/images/page.jsx`                              |
| `/gallery/videos`                              | `src/app/gallery/videos/page.jsx`                              |
| `/legal`                                       | `src/app/legal/page.jsx`                                       |
| `/legal/privacy-policy`                        | `src/app/legal/privacy-policy/page.jsx`                        |
| `/legal/refund-policy`                         | `src/app/legal/refund-policy/page.jsx`                         |
| `/legal/terms-of-service`                      | `src/app/legal/terms-of-service/page.jsx`                      |
| `/programs`                                    | `src/app/programs/page.jsx`                                    |
| `/programs/on-job-degree`                      | `src/app/programs/on-job-degree/page.jsx`                      |
| `/programs/on-job-training`                    | `src/app/programs/on-job-training/page.jsx`                    |
| `/sitemap-html`                                | `src/app/sitemap-html/page.jsx`                                |
| `/success-stories`                             | `src/app/success-stories/page.jsx`                             |
| `/support`                                     | `src/app/support/page.jsx`                                     |
| `/team`                                        | `src/app/team/page.jsx`                                        |
| `/team/[slug]`                                 | `src/app/team/[slug]/page.jsx`                                 |
| `/testimonials`                                | `src/app/testimonials/page.jsx`                                |
| `/unsubscribe`                                 | `src/app/unsubscribe/page.jsx`                                 |
| `/10-minutes-test`                             | `src/app/10-minutes-test/page.jsx`                             |
| `/api/contact-submit`                          | `src/app/api/contact-submit/route.js`                          |

---

### Root `layout.js` — Verbatim

```jsx
import { Inter, Playfair_Display, Source_Sans_3 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "@/app/styles/globals.css";
import { ThemeProvider } from "@/app/context/ThemeContext";
import BackToTop from "@/components/BackToTop";
import JsonLd from "@/components/JsonLd";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";
import {
  organizationSchema,
  primaryLocationSchema,
  websiteSchema,
} from "@/lib/seo/schema/global";

// ... font definitions ...

const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||...){document.documentElement.classList.add('dark')}else{document.documentElement.classList.add('light')}}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${sourceSans.variable} ${playfair.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <JsonLd data={organizationSchema} id="organization-schema" />
        <JsonLd data={primaryLocationSchema} id="primary-location-schema" />
        <JsonLd data={websiteSchema} id="website-schema" />
      </head>
      <body className="antialiased bg-foreground text-primary-foreground">
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=..." />
        </noscript>
        <Script
          id="gtm"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{ __html: "GTM loader..." }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen bg-background">
            <Header />
            <main className="relative z-10">{children}</main>
            <Footer />
            <BackToTop />
          </div>
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

Global JSON-LD injected on every page: `EducationalOrganization`, `Place`, `WebSite`.

---

### Root `page.js` (Homepage) — Structure Summary

**Metadata:** `buildSEO({ title: "IT Training Institute in Agra", ... path: "/" })`  
**revalidate:** `86400`  
**JSON-LD:** `[getFAQSchema(homepageFaqs), getWebPageSchema({url: "/", ...})]` via `<JsonLd>`  
**Data fetch:** `sanityClient.fetch(BATCHES_QUERY)`  
**Components (in order):**

1. `HeroCarousel` (static)
2. `AboutSection` (static)
3. `ProblemSection` (dynamic, lazy)
4. `ProgramsShowcase` (dynamic)
5. `FeaturesSection` (dynamic)
6. `WhatStudentsBuild` (dynamic)
7. `BatchFeeInfo` — receives `batches` from Sanity + `variant="home"`
8. `FeaturedRoles` (dynamic)
9. `SkillTestSection` (dynamic)
10. `LeadersSection` (dynamic)
11. `BlogSection` (dynamic — fetches 3 latest posts from Sanity)
12. `PartnersSlider` (dynamic)
13. `CTASection` (dynamic)
14. `FAQSection` — `category="homepage"`, `limit={4}`

---

### Blog Index `page.jsx` — Structure Summary

**Metadata:** `buildSEO({ title: "SkillYards Blog", ... path: "/blog" })`  
**revalidate:** `3600`  
**JSON-LD:** `getBlogSchema(posts)` — Blog type with `blogPost` references  
**Data:** `sanityClient.fetch(POSTS_QUERY, {}, { next: { revalidate: 3600 } })`  
**Components:** `BlogSearch` — receives all posts for client-side filtering and pagination (6 per page)

---

### Blog Post `[slug]/page.jsx` — Structure Summary

**Metadata:** `generateMetadata()` — builds from post data via `buildSEO()`  
**revalidate:** `3600`  
**generateStaticParams:** Fetches all post slugs  
**JSON-LD:** `getBlogPostingSchema({...post, readingTime, resolvedImageUrl})`  
**Components (in layout order):**

- `ScrollProgress` — reading progress bar
- `Breadcrumbs` — hardcoded items: Home → Blog → post.title truncated
- Hero header with title, author avatar, date, reading time
- Cover image (`next/image`)
- `PortableText` with custom `portableTextComponents`
- Newsletter inline form (non-functional input)
- `Comments` component (utteranc.es)
- Sidebar: Author card, `TableOfContents`, promo card linking to `/programs`

Note: Tags are NOT displayed on the individual blog post page (the `getPost` query doesn't fetch tags).

---

### `sitemap.ts` — Summary

- Walks `src/app/` directory recursively at build time, skipping excluded paths and dynamic segments
- Fetches all blog post slugs from Sanity (revalidate: 3600)
- Adds all `TEAM_PROFILES` keys as `/team/[slug]` URLs
- Excludes: `/api`, `/admin`, `/unsubscribe`, `/feedback`, `/campaigns`, `/test`, `/thank-you-contact`, `/sitemap`, `/sitemap-html`
- Priority: homepage `1.0`, blog index/posts `0.7`, others `0.8`

---

### `robots.ts` — Verbatim

```js
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/_next/",
          "/api/",
          "/admin/",
          "/_error/",
          "/unsubscribe",
          "/feedback",
          "/campaigns/",
        ],
      },
    ],
    sitemap: "https://www.skillyards.in/sitemap.xml",
  };
}
```

---

### Money Pages — Detailed Report

#### `/full-stack-web-development-training-in-agra`

**File:** `src/app/full-stack-web-development-training-in-agra/page.jsx`  
**Metadata:** `buildSEO({ ...courses.fullstack.seo, path: "/full-stack-web-development-training-in-agra" })`  
**revalidate:** `86400`  
**JSON-LD:** `[getCourseSchema(course), getBreadcrumbSchema(...), getFAQSchema(faqs), getWebPageSchema(...)]`  
**Breadcrumb:** Home → Programs → On-Job Training → course.title  
**Components:** `FSDLandingPage` (dynamic import from `landingPageFSD/LandingPage`, receives `faqs` prop)  
**FAQs:** `getPageFaqs("fullstack")` — 4 FAQs from `faqCategories.fullstack`

#### `/bca-training-program-in-agra`

**File:** `src/app/bca-training-program-in-agra/page.jsx`  
**Metadata:** `buildSEO({ ...courses.bca.seo, path: "/bca-training-program-in-agra" })`  
**revalidate:** `86400`  
**JSON-LD:** `[getCourseSchema(course), getBreadcrumbSchema(...), getWebPageSchema(...)]`  
**Breadcrumb:** Home → Programs → course.title  
**Components:** `BCALandingPage` (dynamic, no FAQs injected)  
**Note:** No FAQ schema — unlike FSD and DGM pages.

#### `/bba-training-program-in-agra`

**File:** `src/app/bba-training-program-in-agra/page.jsx`  
**Metadata:** `buildSEO({ ...courses.bba.seo, path: "/bba-training-program-in-agra" })`  
**revalidate:** `86400`  
**JSON-LD:** `[getCourseSchema(course), getBreadcrumbSchema(...), getWebPageSchema(...)]`  
**Breadcrumb:** Home → Programs → course.title  
**Components:** `BBALandingPage` (`LandingPage` named export, not `BBALandingPage`)  
**Note:** No FAQ schema.

#### `/digital-marketing-course-in-agra`

**File:** `src/app/digital-marketing-course-in-agra/page.jsx`  
**Metadata:** `buildSEO({ ...courses.digitalmarketing.seo, path: "/digital-marketing-course-in-agra" })`  
**revalidate:** `86400`  
**JSON-LD:** `[getCourseSchema(course), getBreadcrumbSchema(...), getFAQSchema(faqs), getWebPageSchema(...)]`  
**Breadcrumb:** Home → Programs → On-Job Training → course.title  
**Components:** `DGMLandingPage` (dynamic, receives `faqs` prop)  
**FAQs:** `getPageFaqs("digitalmarketing")` — 4 FAQs

#### `/programs/on-job-degree` (maps to `/on-job-degree` based on route)

**File:** `src/app/programs/on-job-degree/page.jsx`  
**Metadata:** `buildSEO({ title: "BCA & BBA with On-Job Training in Agra | ...", path: "/programs/on-job-degree" })`  
**revalidate:** `86400`  
**JSON-LD:** `[getCollectionPageSchema(...), getBreadcrumbSchema(...)]`  
**Note:** No Course schema. Uses `CollectionPage` type rather than `Course`.  
**Components:** `OnJobHero`, `OnJobProgramCards`, `WhyOnJobDegree`, `OnJobComparisonTable`, `PlacementOutcomes`, `FinalCTA`

---

## Section 5: Blog Rendering Pipeline

### GROQ Query — Single Post by Slug

Located inline in `src/app/blog/[slug]/page.jsx`, inside the `getPost` function:

```groq
*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  coverImage,
  content,
  author->{
    name,
    image,
    role
  }
}
```

**Missing fields:** `tags`, `_updatedAt`, `_createdAt`. Tags are not fetched for individual posts.

### GROQ Query — All Posts (generateStaticParams)

```groq
*[_type == "post"]{ "slug": slug.current }
```

### Blog Post Page Component

Approximately 180 lines. Key pipeline:

1. `generateStaticParams()` pre-generates all slugs at build time.
2. `getPost(slug)` — cached React `cache()` function, fetches single post with `revalidate: 3600`.
3. `generateMetadata({ params })` — calls `getPost()` (same cache), builds metadata via `buildSEO()`.
4. `BlogPostPage({ params })` — calls `getPost()` again (cache hit).
5. Computes `readingTime` via `calculateReadingTime(post.content)`.
6. Extracts `headings` via `extractHeadings(post.content)` for TOC.
7. Resolves cover image URL via `urlFor(post.coverImage).width(1200).height(630).url()`.
8. Builds `getBlogPostingSchema({...post, readingTime, resolvedImageUrl})`.
9. Renders `<PortableText value={post.content} components={portableTextComponents} />`.

### PortableText Config and Custom Block Components

**File:** `src/lib/sanity/portableTextComponents.js`

Custom renderers:

- **`h2`** — adds `id={slugifyHeading(value)}` for TOC anchor links with `scroll-mt-28`
- **`h3`** — same as h2
- **`image`** — renders `<figure>` with `next/image` (16/9 aspect ratio, rounded-xl), optional caption
- **`code`** — renders language label bar + `<pre><code>` block in dark/light themed box

Standard blocks (`p`, `h4`, `blockquote`, lists) use Tailwind typography prose classes via the wrapper `<article className="prose ...">`.

### Tags on Post Page

Tags are **NOT rendered** on individual blog post pages. The `getPost` GROQ query does not fetch `tags`, so there is no tag display, no tag-to-tag-page links, and no tag-based related content on single post pages.

### Related Posts

**No Related Posts component exists.** The sidebar contains only: Author Card, Table of Contents, and a static promotional card linking to `/programs`. There is no algorithm or component for suggesting related content.

---

## Section 6: Current Tag System Status

### Tag Document Type in Sanity

**Yes.** `apps/cms/schemaTypes/tag.js` defines the `tag` document with `title` (string, required) and `slug` (slug, required).

### `/blog/tag/[slug]` Route

**Yes, it exists.** `src/app/blog/tag/[slug]/page.jsx`

**File — verbatim:**

```jsx
import { sanityClient } from "@/lib/sanity/client";
import { POSTS_BY_TAG_QUERY } from "@/lib/sanity/queries";
import BlogCard from "@/components/blog/BlogCard";

export const revalidate = 3600;

export default async function TagPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const posts = await sanityClient.fetch(
    POSTS_BY_TAG_QUERY,
    { slug },
    { next: { revalidate: 3600 } },
  );

  return (
    <div className="max-w-6xl mx-auto px-4 pt-34 pb-10">
      <h1 className="text-2xl font-semibold mb-8 capitalize text-primary">
        {slug.replace("-", " ")}
      </h1>
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <p>No posts found for this tag.</p>
      )}
    </div>
  );
}
```

**Issues noted:**

- No `generateMetadata()` — no `<title>`, `<description>`, or canonical URL on tag pages.
- No `generateStaticParams()` — tag pages are dynamically rendered (not pre-generated).
- `slug.replace("-", " ")` only replaces the **first** hyphen, not all (should be `/g` flag).
- No breadcrumb navigation.
- No JSON-LD schema.
- `revalidate` is set at the top of the file but the explicit `next: { revalidate: 3600 }` on the fetch is redundant.

### Tags Referenced from Blog Post

In the `post` Sanity schema: `tags` is an `array` of `reference → tag`, minimum 1 required.

In `POSTS_QUERY` (blog index), tags are fetched: `"tags": tags[]->{title, "slug": slug.current}`.

In `getPost()` (single post query): **tags are NOT fetched**.

### Tags Rendered on Individual Blog Post Pages

**No.** The single-post GROQ query does not include `tags`. BlogCard (used on index/tag pages) does render tags as clickable buttons that route to `/blog/tag/[tagSlug]`.

### GROQ Queries Filtering by Tag

`POSTS_BY_TAG_QUERY`:

```groq
*[_type == "post" && $slug in tags[]->slug.current] | order(publishedAt desc){...}
```

This is the only tag-filtering query. No other GROQ query filters by tag.

---

## Section 7: Author System Status

### Author Document Type

**Yes.** `apps/cms/schemaTypes/author.js` — fields: `name` (string, required), `image` (image, hotspot), `role` (string, optional).

**No `slug` field** on the CMS author. Authors are not navigable as standalone CMS content.

### Author-Specific Route

**No `/author/[slug]` route.** The team profile system exists at `/team/[slug]` but it is driven by static data (`TEAM_PROFILES` in `src/data/teamProfiles.js`), not by Sanity author documents.

### How Author is Referenced on Blog Posts

In Sanity schema: `author` is a `reference → author` (required).  
In `POSTS_QUERY`: `author->{ name, image, role }` — dereferences.  
In `getPost()` (single post): `author->{ name, image, role }` — dereferences.

### Author Schema Fields

| Field   | Type              | Validation |
| ------- | ----------------- | ---------- |
| `name`  | `string`          | required   |
| `image` | `image` (hotspot) | none       |
| `role`  | `string`          | none       |

There is no `bio`, `slug`, `social`, or `seo` field on the CMS author document.

### Author Pages Using Person JSON-LD

`/team/[slug]` pages use `getPersonSchema()`. However, these pages are built from `TEAM_PROFILES` static data, not from Sanity author documents. The CMS Author schema and the website's team profile system are **completely disconnected** — there is no shared identifier or lookup between them.

---

## Section 8: Static Data Files

### `data/courses.js` — Full Contents (92 lines, under 300)

Exports `courses` object with four keys: `fullstack`, `digitalmarketing`, `bca`, `bba`.

Each course has:

- `title` — display title
- `description` — short description for schema
- `certification` — credential name
- `seo` object with `title`, `description`, `path`, `keywords[]`, `ogImage`

No `startDate`, `category`, or `duration` fields (these are referenced in `getCourseSchema()` but not in the static data, causing schema gaps). The `offer.price` is hardcoded to `"0"` in the schema builder regardless of actual fees.

Full structure summary:

```
courses.fullstack.seo.path = "/full-stack-web-development-training-in-agra"
courses.digitalmarketing.seo.path = "/digital-marketing-course-in-agra"
courses.bca.seo.path = "/bca-training-program-in-agra"
courses.bba.seo.path = "/bba-training-program-in-agra"
```

### `data/faqs.js` — Structure (289 lines)

Exports `faqCategories` object. Keys (page categories):

- `homepage` — 9 FAQs about OJT, OJD, placement, technologies, certification, duration, modes, eligibility, location
- `general` — General questions about eligibility, degree vs skill courses
- `fullstack` — Full-Stack Development specific FAQs
- `digitalmarketing` — Digital Marketing specific FAQs
- `bca` — BCA program FAQs
- `bba` — BBA program FAQs

Each entry has `question` and `answer` fields (compatible with `getFAQSchema()` which also accepts `q`/`a`).

### `data/teamProfiles.js` — Structure (167 lines)

Exports `TEAM_PROFILES` keyed object. Keys: `suryanshupadhyay`, `rahulsingh`.

Each profile has extensive static fields:

- `slug`, `name`, `role`, `shortRole`, `image`, `bio`, `headline`, `intro`, `badge`, `location`
- `experienceLabel`, `company`, `linkedin`, `instagram`, `twitter`
- `mission`, `focusAreas[]`, `highlights[]`, `principles[]`
- `experience[]` — array of `{ title, organization, period, location, points[] }`
- `seo: { title, description, keywords[], ogImage }`

Only 2 profiles exist (Suryansh Upadhyay and Rahul Singh). Other team members listed in `teamData.js` do not have individual profile pages.

### `data/teamData.js` — Structure (217 lines)

Exports `TEAM_MEMBERS` object (individual entries) and several named arrays for grouping:

- `leadershipTeam` — Suryansh Upadhyay, Rahul Singh
- `engineeringTeam` — Mrigesh Deshpande, Chakresh Chakshu, Neeraj Dang, Ashi Chhabra, Narendra Singh
- `operationsTeam` — 6 members
- `carouselTeam` — 9 members (used by OtherTeam component)
- `bcaEducators`, `bbaEducators`, `dgmEducators`, `fsdEducators` — course-specific subsets

### Other Notable Data Files

- `data/home-slides.json` — Hero carousel slides (static JSON)
- `data/programmes.json` — Programme cards for homepage showcase
- `data/features.json` — Features section content
- `data/partners.json` — Partner logos
- `data/student-testimonials.json` — Testimonial data
- `data/upcoming-batches.json` — Static batch schedule (separate from Sanity `batch` documents)
- `data/videos.json` — Video gallery content
- `data/posts.json` — Legacy static blog posts (likely superseded by Sanity)
- `data/corporate-services.json` — Corporate training services
- `data/getDisplayFaqs.js` — Utility to get display FAQs (wraps `faqCategories`)
- `data/aboutpage/hero.json`, `missionvision.json`, `whychoose.json` — About page content

---

## Section 9: Component Inventory (SEO-Relevant Only)

### `JsonLd` Component

**File:** `src/components/JsonLd.jsx`  
**Props:** `data` (object or array), `id` (string, used as script `id`)  
**Renders:** `<script type="application/ld+json">` with `JSON.stringify(data)`  
**Verbatim (under 50 lines):**

```jsx
export default function JsonLd({ data, id }) {
  if (!data) return null;
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}
```

Note: When `data` is an array, the entire array is serialized as `[{...}, {...}]` — this is NOT valid JSON-LD (JSON-LD expects either a single `{}` or a graph with `@graph`). Multiple schemas should be injected as separate `<script>` tags or use `@graph`.

---

### `Breadcrumbs` Component

**File:** `src/components/Breadcrumbs.jsx`  
**Props:** `className` (string), `currentLabel` (string, optional override for last segment)  
**Renders:** `<nav aria-label="Breadcrumb">` with `<ol>` of Home + auto-generated segments from `usePathname()`  
**Key behavior:** Auto-derives breadcrumb names by capitalizing URL segments and replacing hyphens with spaces. Does NOT inject JSON-LD — BreadcrumbList schema is injected separately by each page.

Note: On the blog post page, breadcrumbs are rendered with hardcoded `items` prop: `[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.title.slice(0,20)+"..." }]`. The `Breadcrumbs` component signature shown above accepts `currentLabel` only — there is a mismatch: the blog post page passes `items` and `className` props, but the component's signature only uses `className` and `currentLabel`, auto-deriving from URL. This means the `items` prop is silently ignored and breadcrumbs are auto-generated from the URL path, not from the explicit `items` array.

---

### Blog Post Header Component

No separate "BlogPostHeader" component — the header section is inlined in `src/app/blog/[slug]/page.jsx` as a `<header>` element (approximately lines 80-130).

---

### Blog Post Body / PortableText Renderer

**File:** `src/lib/sanity/portableTextComponents.js`  
**Custom handlers:** `h2`, `h3` (add `id` for TOC), `image` (figure), `code` (pre/code block)  
**No custom handlers for:** `h4`, `h5`, `h6`, `blockquote`, `ul`, `ol`, marks (bold, italic, link)

---

### Related Posts Component

**Not present.** No component named `RelatedPosts`, `SimilarPosts`, or similar exists in the codebase.

---

### Table of Contents Component

**File:** `src/components/TableOfContents.jsx`  
**Props:** `headings` — array of `{ id, text, level }` from `extractHeadings()`  
**Renders:** Vertical list with `IntersectionObserver` for active heading tracking; supports `h2`/`h3` indentation  
**Sticky sidebar placement** — only visible on `lg:` breakpoint (hidden on mobile)

---

### Site Header / Navigation

**File:** `src/components/Header.jsx`  
**Renders:** Fixed, pill-shaped nav with Logo, `DesktopNav`, `MobileNav`, theme toggle  
**Hidden on:** Campaign routes (`pathname.startsWith("/campaigns")`)  
**Children:** `DesktopNav`, `MobileNav` (animated with framer-motion via `AnimatePresence`)

---

### Site Footer

**File:** `src/components/Footer.jsx` (166 lines)  
**Props:** None  
**Hidden on:** Campaign routes  
**Sections:** All Programs, Legal Stuff, Resources, Quick Links  
**Links to money pages:** Full-Stack Development, Digital Marketing, BCA Programs, BBA Programs — all link to canonical flat URLs  
**Also includes:** `GoogleMapEmbed`, `SocialLinks`, `Separator`, accordion on mobile

---

### MobileNav Component

**File:** `src/components/MobileNav.jsx`  
**Props:** `onClose`, `theme`, `toggleTheme`  
**Renders:** Framer-motion slide-down card with all nav links, programs accordion (On-Job Degree: BCA/BBA; On-Job Training: Full-Stack/Digital Marketing), theme switcher  
**Programs structure is hardcoded** in `programGroups` const.

---

### Hero / CTA / Banner Components

| Component             | File                                       | Notes                                    |
| --------------------- | ------------------------------------------ | ---------------------------------------- |
| `HeroCarousel`        | `components/homepage/HeroCarousel.jsx`     | Homepage hero carousel                   |
| `CTASection`          | `components/homepage/CTASection.jsx`       | Homepage CTA                             |
| `PageHero`            | `components/PageHero.jsx`                  | Generic hero used by FAQs, Careers pages |
| `OnJobHero`           | `components/onJobDegreePage/OnJobHero.jsx` | OJD page hero                            |
| `landingPageFSD/Hero` | `components/landingPageFSD/Hero.jsx`       | FSD landing page hero                    |
| `landingPageBCA/Hero` | `components/landingPageBCA/Hero.jsx`       | BCA landing page hero                    |
| `landingPageBBA/Hero` | `components/landingPageBBA/Hero.jsx`       | BBA landing page hero                    |
| `landingPageDGM/Hero` | `components/landingPageDGM/Hero.jsx`       | DGM landing page hero                    |

All landing page heroes are **separate, duplicated components** — there is no shared Hero template.

---

## Section 10: Internal Linking — Current State

### Hardcoded Internal Links from Blog Posts to Money Pages

The individual blog post page (`/blog/[slug]`) contains one hardcoded internal link in the sidebar promo card:

```html
<a href="/programs">Explore Courses</a>
```

This links to `/programs` (the programs index), not to individual money pages. No contextual links to specific courses are generated from blog content.

### Components Rendering "Related Programs" on Blog Posts

**Not present.** The sidebar has a static promotional card only — it is the same for every blog post regardless of topic. No dynamic "related programs" logic exists.

### Components Rendering "Related Posts" on Blog Post Pages

**Not present.** No related posts functionality exists anywhere in the codebase.

### How Blog Index Links to Individual Posts

`BlogCard` component renders each post. It uses:

```jsx
<Link
  href={`/blog/${slug}`}
  className="absolute inset-0 z-0"
  aria-label={`Read more about ${title}`}
/>
```

Plus tag buttons via `router.push(`/blog/tag/${tagSlug}`)`. The `BlogSearch` component adds client-side search and pagination (6 per page) over all fetched posts.

### How Money Pages Link Back to Blog

Money pages do **not** contain explicit links back to the blog. The Footer has a "Blog" link to `/blog`, available on all pages including money pages.

### Does Homepage Feature Blog Posts?

**Yes.** `BlogSection` component (dynamically imported in `page.js`) fetches the 3 most recent posts via `HOMEPAGE_POSTS_QUERY` and renders them using `BlogCard`. The section has a "View All Blogs" button linking to `/blog`. No editorial curation — purely ordered by `publishedAt desc`.

---

## Section 11: Existing Schema (JSON-LD) Output Audit

### Homepage (`/`)

**Emitted schemas (via root layout + page):**

1. `EducationalOrganization` (via `organizationSchema`) — includes `@id`, name, url, founders, logo, address, contactPoint, sameAs, `subjectOf` press mentions
2. `Place` (via `primaryLocationSchema`) — `@id: #location-agra`, address
3. `WebSite` (via `websiteSchema`) — `@id: #website`, url, name, publisher ref
4. `FAQPage` — from `homepageFaqs` (4 FAQs)
5. `WebPage` — url: `/`, name, description, keywords

**Array injection note:** Items 4 and 5 are injected as `JSON.stringify([faqSchema, webPageSchema])` — an array, not a `@graph`. May cause validation warnings.

**Gaps:** No `SearchAction` on WebSite, no `LocalBusiness` markup.

---

### Blog Index (`/blog`)

**Emitted schemas:**

1. `EducationalOrganization`, `Place`, `WebSite` (root layout)
2. `Blog` — `@id: #blog`, name, description, publisher ref, `blogPost[]` references to all post `@id`s

**Gaps:** No `BreadcrumbList`, no `WebPage` schema for the blog index.

---

### Individual Blog Post (`/blog/[slug]`)

**Emitted schemas:**

1. `EducationalOrganization`, `Place`, `WebSite` (root layout)
2. `BlogPosting` — `@id`, url, mainEntityOfPage, headline, image (if available), datePublished, dateModified (will be `undefined` — not fetched), author (Person type, name only), publisher (Organization ref), keywords (falls back to hardcoded defaults), articleSection (falls back to "Technology"), description, timeRequired, wordCount

**Gaps:**

- `dateModified` is `undefined` since `_updatedAt` is not fetched in the GROQ query
- `keywords` falls back to `["SkillYards", "tech tutorials", "career advice"]` — not post-specific
- `articleSection` defaults to "Technology" — not tag-derived
- No `BreadcrumbList` JSON-LD (visual breadcrumbs rendered but no structured data)
- No `Person` schema for author with profile URL

---

### Money Page — Full-Stack (`/full-stack-web-development-training-in-agra`)

**Emitted schemas:**

1. `EducationalOrganization`, `Place`, `WebSite` (root layout)
2. `Course` with `CourseInstance`, `Offer`, `EducationalOccupationalProgram` — array-injected with BreadcrumbList, FAQPage, WebPage

**Note:** `getCourseSchema` uses `course.category` (not in `courses.js`) → falls back to "Information Technology". `course.startDate` is not in `courses.js` → `startDate` omitted from `CourseInstance`. Offer `price: "0"` regardless of actual fee.

---

### Money Pages — BCA and BBA

Same as Full-Stack but **without FAQPage schema** (BCA and BBA pages do not call `getPageFaqs` or `getFAQSchema`).

---

### Team Profile Page (`/team/[slug]`)

**Emitted schemas:**

1. `EducationalOrganization`, `Place`, `WebSite` (root layout)
2. `Person` — name, jobTitle, worksFor (Organization ref), url, image

**Note:** `image` field passed to `getPersonSchema` is a local path like `/images/team/suryanshSir.webp`. `absoluteAssetUrl()` will prefix it with `https://www.skillyards.in`.

---

### FAQ Page (`/faqs`)

**Emitted schemas:**

1. `EducationalOrganization`, `Place`, `WebSite` (root layout)
2. `FAQPage` — all FAQs from all categories flattened
3. `WebPage`

---

### About Page (`/about`)

**Emitted schemas:**

1. `EducationalOrganization`, `Place`, `WebSite` (root layout)
2. `AboutPage` (which is `["WebPage", "AboutPage"]`)

**No JSON-LD** for the FAQ section embedded on the about page.

---

## Section 12: Routing & Redirects

### `redirects()` Function — Verbatim from `next.config.mjs`

```js
async redirects() {
    return [
        // Host canonicalization
        {
            source: "/:path*",
            has: [{ type: "host", value: "skillyards.in" }],
            destination: "https://www.skillyards.in/:path*",
            permanent: true,
        },

        // Old deep URLs → New flat URLs
        { source: "/programs/on-job-degree/best-bca-course-in-agra-with-job-training", destination: "/bca-training-program-in-agra", permanent: true },
        { source: "/programs/on-job-degree/best-bba-course-in-agra-with-job-training", destination: "/bba-training-program-in-agra", permanent: true },
        { source: "/programs/on-job-training/best-full-stack-development-course-in-agra", destination: "/full-stack-web-development-training-in-agra", permanent: true },
        { source: "/programs/on-job-training/best-digital-marketing-course-in-agra", destination: "/digital-marketing-course-in-agra", permanent: true },

        // Short aliases → flat URLs
        { source: "/programs/bca", destination: "/bca-training-program-in-agra", permanent: true },
        { source: "/programs/bba", destination: "/bba-training-program-in-agra", permanent: true },
        { source: "/programs/fullstack", destination: "/full-stack-web-development-training-in-agra", permanent: true },
        { source: "/programs/full-stack", destination: "/full-stack-web-development-training-in-agra", permanent: true },
        { source: "/programs/digitalmarketing", destination: "/digital-marketing-course-in-agra", permanent: true },
        { source: "/programs/digital-marketing", destination: "/digital-marketing-course-in-agra", permanent: true },
        { source: "/programs/data-science", destination: "/programs", permanent: true },
        { source: "/programs/mern-stack-developer", destination: "/full-stack-web-development-training-in-agra", permanent: true },
        { source: "/programs/bachelor-of-computer-applications-bca", destination: "/bca-training-program-in-agra", permanent: true },

        // Site-wide aliases
        { source: "/about-us", destination: "/about", permanent: true },
        { source: "/contact-us", destination: "/contact", permanent: true },
        { source: "/courses", destination: "/programs", permanent: true },
        { source: "/blogs", destination: "/blog", permanent: true },
        { source: "/reviews", destination: "/testimonials", permanent: true },
        { source: "/gallery/photos", destination: "/gallery/images", permanent: true },
        { source: "/suryanshupadhyay", destination: "/team/suryanshupadhyay", permanent: true },
        { source: "/rahulsingh", destination: "/team/rahulsingh", permanent: true },
        { source: "/team/suryansh-upadhyay", destination: "/team/suryanshupadhyay", permanent: true },
        { source: "/team/rahul-singh", destination: "/team/rahulsingh", permanent: true },

        // Legal page fixes
        { source: "/terms-and-conditions", destination: "/legal/terms-of-service", permanent: true },
        { source: "/terms-of-service", destination: "/legal/terms-of-service", permanent: true },
        { source: "/privacy-policy", destination: "/legal/privacy-policy", permanent: true },
        { source: "/refund-policy", destination: "/legal/refund-policy", permanent: true },

        // Category redirect
        { source: "/on-job-training", destination: "/programs/on-job-training", permanent: true },

        // Gallery video fix
        { source: "/gallery/videos/:id", destination: "/gallery/videos", permanent: true },

        // Additional legacy URLs
        { source: "/programs/on-job-degree/best-bba-college-in-agra-with-digital-skills", destination: "/bba-training-program-in-agra", permanent: true },
        { source: "/programs/on-job-training/digital-marketing-course-in-agra-with-live-projects", destination: "/digital-marketing-course-in-agra", permanent: true },
        { source: "/programs/on-job-training/mern-stack-developer-course-in-agra", destination: "/full-stack-web-development-training-in-agra", permanent: true },
        { source: "/blog/web-development-ke-latest-trends", destination: "/blog", permanent: true },
        { source: "/programs/on-job-training/tall-stack-developer-course-in-agra", destination: "/full-stack-web-development-training-in-agra", permanent: true },
    ];
},
```

### `headers()` Function — Key Points

No general caching headers for HTML pages. Three header groups defined:

1. `/_next/static/(.*)` — `Cache-Control: public, max-age=31536000, immutable` (production only)
2. `/sw.js` — Content-Type + `Service-Worker-Allowed: /`
3. `/(.*)` — Full Content-Security-Policy (production only)

CSP allows: `unsafe-inline`, `unsafe-eval`, utteranc.es, Google services, GTM, doubleclick, YouTube iframes.

### `rewrites()` Function

```js
async rewrites() {
    return [
        {
            source: "/sitemap",
            destination: "/sitemap-html",
        },
    ];
},
```

### Middleware

No `middleware.ts` or `middleware.js` file exists in `apps/website/src/`.

### Canonical Domain

`https://www.skillyards.in` — enforced via:

1. `buildSEO()` sets `metadataBase` and `alternates.canonical` to the www subdomain
2. `next.config.mjs` redirect from `skillyards.in` (apex) to `www.skillyards.in` (301, permanent)
3. `SEO_CONFIG.baseUrl = "https://www.skillyards.in"` in `seo.config.js`

---

## Section 13: Build & Revalidation Configuration

### ISR Revalidation by Page

| Route                                          | revalidate    | generateStaticParams | Notes                                 |
| ---------------------------------------------- | ------------- | -------------------- | ------------------------------------- |
| `/`                                            | `86400` (24h) | No                   | Fetches batches from Sanity           |
| `/blog`                                        | `3600` (1h)   | No                   | Fetches all posts                     |
| `/blog/[slug]`                                 | `3600` (1h)   | Yes                  | Fetches all post slugs                |
| `/blog/tag/[slug]`                             | `3600` (1h)   | No                   | No static params — dynamic            |
| `/full-stack-web-development-training-in-agra` | `86400`       | No                   | Static data only                      |
| `/bca-training-program-in-agra`                | `86400`       | No                   | Static data only                      |
| `/bba-training-program-in-agra`                | `86400`       | No                   | Static data only                      |
| `/digital-marketing-course-in-agra`            | `86400`       | No                   | Static data only                      |
| `/programs`                                    | `86400`       | No                   | Fetches batches from Sanity           |
| `/programs/on-job-degree`                      | `86400`       | No                   | Static                                |
| `/programs/on-job-training`                    | `86400`       | No                   | Static                                |
| `/about`                                       | `86400`       | No                   | Static                                |
| `/team`                                        | `86400`       | No                   | Static data                           |
| `/team/[slug]`                                 | `86400`       | Yes                  | Static params from TEAM_PROFILES keys |
| `/faqs`                                        | `86400`       | No                   | Static data                           |
| `/careers`                                     | `86400`       | No                   | Static (roles: [])                    |
| `/careers/[slug]`                              | `86400`       | No                   | —                                     |
| `/testimonials`                                | `86400`       | No                   | Static                                |
| `/contact`                                     | `86400`       | No                   | Static                                |
| `/gallery/images`                              | `86400`       | No                   | Static                                |
| `/gallery/videos`                              | `86400`       | No                   | Static                                |
| `/legal/*`                                     | `86400`       | No                   | Static                                |
| `/support`                                     | `86400`       | No                   | Static                                |
| `/sitemap-html`                                | `86400`       | No                   | Walks filesystem                      |

### `revalidateTag` / `revalidatePath` Usage

**Not found anywhere** in the codebase. There are no on-demand revalidation calls.

### Webhook Routes

**No revalidation webhook exists.** The only API route is `/api/contact-submit` which handles enquiry form submissions. There is no `/api/revalidate` or similar endpoint for Sanity webhooks.

### ISR Strategy Summary

All content uses time-based ISR only. Sanity CMS changes do not trigger immediate revalidation — blog posts refresh at most every hour, and static pages at most every 24 hours. No on-demand revalidation pathway is implemented.

---

## Section 14: Known Inconsistencies & Anomalies

### 1. `GlobalSchema.jsx` and `NavigationSchema.jsx` Are Dead Code

`src/components/GlobalSchema.jsx` exports `globalSchema` — a hardcoded JSON-LD object with a combined `["WebSite", "EducationalOrganization", "LocalBusiness"]` type.  
`src/components/NavigationSchema.jsx` exports `navigationSchema` with `SiteNavigationElement` items.

**Neither component is imported or used anywhere.** The actual global schema is served via `src/lib/seo/schema/global.js` + `buildOrganizationSchema.js`. The navigation schema references `/courses` and `/certifications` — URLs that no longer exist (redirected elsewhere).

### 2. Two Separate Team Data Systems

`data/teamData.js` (`TEAM_MEMBERS`) and `data/teamProfiles.js` (`TEAM_PROFILES`) both describe team members but serve different purposes without clear delineation. `TEAM_MEMBERS` has minimal fields; `TEAM_PROFILES` has rich SEO/bio data for only 2 members. The same people appear in both with different field shapes. `rahulsingh` and `suryanshupadhyay` have entries in both files with some overlapping but non-identical fields (e.g., `role` in `teamData.js` vs. `role` in `teamProfiles.js` — "COO" vs "Founder & Chief Operating Officer").

### 3. `data/upcoming-batches.json` vs Sanity `batch` Documents

There is a static `data/upcoming-batches.json` file and also a live Sanity `batch` schema that the website actually uses (`BATCHES_QUERY` fetched on homepage and programs page). The static JSON file is a likely legacy artifact that may be stale.

### 4. `data/posts.json` — Legacy Static Blog Data

`src/data/posts.json` exists — appears to be legacy static blog post data predating the Sanity integration. No active code imports this file; blog content is now served from Sanity.

### 5. Tags Not Fetched in Single-Post GROQ Query

`getPost()` query does not include `tags`. This means:

- Tags are not rendered on individual post pages (inconsistent with blog index cards where tags ARE visible).
- `getBlogPostingSchema()` references `post.seo?.keywords` and `post.category?.title` — neither field exists on the Sanity post document; both fall back to static defaults, making keywords in the BlogPosting schema generic and not post-specific.

### 6. `blogPostingSchema.js` References Non-Existent Sanity Fields

The `getBlogPostingSchema()` function references:

- `post.seo?.keywords` — no `seo` field on Sanity `post` schema
- `post.category?.title` — no `category` field on Sanity `post` schema
- `post._updatedAt` — not fetched in `getPost()` query
- `post.wordCount` — not computed or fetched anywhere

These will all be `undefined` at runtime, causing the schema to use hardcoded fallback values.

### 7. Duplicate `educationalCredentialAwarded` in `courseSchema.js`

`getCourseSchema()` defines `educationalCredentialAwarded: "Certificate of Completion"` at the root level of the Course object, then later spreads `educationalCredentialAwarded: [{ "@type": "EducationalOccupationalCredential", ... }]` conditionally. Since `courses.fullstack.certification` exists, the spread overwrites the root-level string with an array. For `isPartOf.educationalCredentialAwarded`, this is a separate definition. Inconsistency between string and array types for the same property.

### 8. Blog Tag Page Missing Metadata, Static Params, and Schema

`/blog/tag/[slug]` has no `generateMetadata`, no `generateStaticParams`, no JSON-LD, and no breadcrumb. It also uses `slug.replace("-", " ")` without the global `/g` flag — multi-hyphen tag slugs will have only the first hyphen replaced.

### 9. BCA and BBA Pages Missing FAQ Schema

`/full-stack-web-development-training-in-agra` and `/digital-marketing-course-in-agra` emit `FAQPage` schema; `/bca-training-program-in-agra` and `/bba-training-program-in-agra` do not — despite `faqCategories` having `bca` and `bba` keys.

### 10. `JsonLd` Component Serializes Arrays as Invalid JSON-LD

When `data` is an array (e.g., `combinedSchema = [courseSchema, breadcrumbSchema, faqSchema, webPageSchema]`), `JSON.stringify(data)` produces a JSON array `[...]`. Per JSON-LD specification, a script tag with type `application/ld+json` should contain either a single object or an object with `@graph`. Arrays may not be processed correctly by all validators and parsers.

### 11. Breadcrumbs Component — `items` Prop Silently Ignored

The blog post page calls `<Breadcrumbs className="..." items={[...]} />` but the `Breadcrumbs` component signature is `({ className, currentLabel })` — it does not accept or use an `items` prop. The component auto-generates breadcrumbs from `usePathname()`. The hardcoded `items` array on the blog post page is dead code.

### 12. Inline Newsletter Form on Blog Posts

The blog post page has an inline email subscription form (input + button) that is not connected to any backend or state management. No `onSubmit`, no API call, no email validation. It is purely decorative UI.

### 13. BBA Page Uses `LandingPage` Export, Not `BBALandingPage`

```js
const BBALandingPage = dynamic(() =>
  import("@/components/landingPageBBA/LandingPage").then((m) => m.LandingPage),
);
```

FSD uses `m.FSDLandingPage`, BCA uses `m.BCALandingPage`, DGM uses `m.DGMLandingPage`, but BBA uses `m.LandingPage`. Inconsistent named export convention.

### 14. `Offer.price` Hardcoded to `"0"` in Course Schema

All courses emit `offers.price: "0"` in their JSON-LD regardless of actual fee. FSD starts at ₹25,000 per the SEO description. This is factually incorrect schema data.

### 15. Course Schema Missing `course.startDate` and `course.category`

`getCourseSchema()` references `course.startDate` and `course.category` — neither key exists in `data/courses.js`. `startDate` is silently omitted (guarded by `&&`), and `category` falls back to "Information Technology".

### 16. Sanity Author and Website Team Profile Completely Disconnected

Sanity authors have `name`, `image`, `role` only — no `slug`. Team profile pages at `/team/[slug]` are built from `TEAM_PROFILES` static data with no lookup to Sanity. If a new team member is added to Sanity as a blog author, they won't automatically get a profile page, and there is no shared identifier to link the two systems.

### 17. `Header` and `Footer` Both Check `isCampaignRoute` Independently

Both `Header.jsx` and `Footer.jsx` independently check `pathname?.startsWith("/campaigns")` to hide themselves. The campaigns `layout.js` does not use a different root layout or wrap with a custom context — each component re-checks the route.

### 18. `framer-motion` and `motion` Both Listed as Dependencies

`package.json` includes both `framer-motion: "^12.35.2"` and `motion: "^12.38.0"`. In framer-motion v11+, the main package was rebranded to `motion` — having both is redundant and likely increases bundle size.

### 19. `NavigationSchema.jsx` References Non-Existent URLs

The unused `NavigationSchema.jsx` references `/courses` (redirects to `/programs`) and `/certifications` (no route exists).

### 20. Scripts SEO Check Not Integrated Into CI

`package.json` defines `"seo:check": "node scripts/check-seo-graph.mjs"`. This script exists at `apps/website/scripts/` but is not part of any automated CI or pre-commit hook (no `.github/workflows` or husky config found).

---

## Section 15: Open Questions for Human Review

1. **Sanity Author ↔ Team Profile Linkage:** Is there an intended workflow to connect Sanity `author` documents to `/team/[slug]` profile pages? Should a `slug` field be added to the Sanity `author` schema, or should authors be managed entirely in static `TEAM_PROFILES`?

2. **Real Course Pricing in Schema:** The Course schema emits `offers.price: "0"`. Should this reflect actual pricing (starting from ₹15,000–₹25,000 per the SEO descriptions), or is `"0"` intentional (e.g., to represent free consultation/admission inquiry)?

3. **On-Demand Revalidation Strategy:** There is no Sanity webhook or revalidation endpoint. When a blog post is published or updated in Sanity CMS, the change will appear at most after 1 hour. Is this acceptable, or should a Sanity GROQ webhook → `/api/revalidate` be implemented?

4. **Tag Page SEO and Discovery:** The `/blog/tag/[slug]` page has no metadata, no static params, and no JSON-LD. Are tag pages intended to be indexed? If yes, what metadata strategy should be applied (title: "Posts tagged [tag]")?

5. **`data/posts.json` Disposition:** Does `data/posts.json` (legacy static blog data) serve any active purpose, or is it safe to delete now that all blog content is managed through Sanity CMS?

6. **`data/upcoming-batches.json` vs Sanity `batch` Documents:** Two sources describe batch/program schedules. Which is the source of truth? Are both in active use, or should one be deprecated?

7. **BCA/BBA Landing Page FAQ Schema Gap:** FAQ schema is present on FSD and DGM pages but missing from BCA and BBA pages, despite `faqCategories.bca` and `faqCategories.bba` existing in `data/faqs.js`. Is the omission intentional?

8. **`GlobalSchema.jsx` and `NavigationSchema.jsx` Purpose:** These files exist with hardcoded JSON-LD but are never imported. Were they superseded by the `lib/seo/` system? Should they be deleted, or are they retained for future reference?

9. **Newsletter Form on Blog Posts:** The inline email subscription form on every blog post is unconnected to any backend. Is there a planned email service integration (Mailchimp, ConvertKit, etc.), or should this be removed?

10. **Related Posts Feature:** There is no related posts functionality. Is this planned? If so, should it be GROQ-based (fetch posts sharing the same tag) or static (manual curation field on the `post` document)?

11. **Author Profile Pages for Non-Founder Team Members:** Only `suryanshupadhyay` and `rahulsingh` have profile pages under `/team/[slug]`. If other team members (e.g., Mrigesh Deshpande, Chakresh Chakshu) write blog posts, should they also have profile pages? What is the intended policy?

12. **`JsonLd` Array Serialization:** The `JsonLd` component serializes arrays as `[{...}, {...}]`. Is this a known trade-off, or should it be changed to inject multiple separate `<script>` tags, or use a JSON-LD `@graph` object?

13. **`data/posts.json` and Sanity `post` Post Shape Mismatch:** The legacy static post data and the Sanity `post` documents likely have different field names. Is any code still reading from `data/posts.json`, or has migration to Sanity been fully completed?

14. **Careers Dynamic Pages:** `/careers/[slug]` page exists with `revalidate: 86400` but there is no Sanity schema for career postings and `roles = []` is hardcoded in the careers index page. What is the intended data source for individual job listing pages?

15. **SEO Script (`check-seo-graph.mjs`):** The `scripts/check-seo-graph.mjs` file exists and is in `package.json` scripts. What does this script validate? Is it used in any CI pipeline, and are there known failures it currently reports?

---

_End of Codebase Discovery Report_
