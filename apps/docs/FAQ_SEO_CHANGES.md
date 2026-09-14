# FAQ SEO Audit & Implementation

> **Date:** May 2026  
> **Scope:** All FAQ components across landing pages, `/faqs` hub, homepage, and program pages  
> **Status:** ✅ Implemented

---

## Table of Contents

1. [Background & Motivation](#1-background--motivation)
2. [Google FAQ Rich Result Deprecation](#2-google-faq-rich-result-deprecation)
3. [Pre-Change State](#3-pre-change-state)
4. [Change 1: Anchor IDs on All FAQ Containers](#4-change-1-anchor-ids-on-all-faq-containers)
5. [Change 2: FAQ Questions Changed from `<span>` to `<h3>` Headings](#5-change-2-faq-questions-changed-from-span-to-h3-headings)
6. [Change 3: Per-FAQ `url` in FAQPage JSON-LD Schema](#6-change-3-per-faq-url-in-faqpage-json-ld-schema)
7. [Change 4: Schema Ownership Map (No Duplicate FAQ Markup)](#7-change-4-schema-ownership-map-no-duplicate-faq-markup)
8. [New Utility: `faqUtils.js`](#8-new-utility-faqutilsjs)
9. [ARIA & Accessibility Improvements](#9-aria--accessibility-improvements)
10. [Files Modified](#10-files-modified)
11. [Expected SEO Impact](#11-expected-seo-impact)
12. [Known Limitations & Next Steps](#12-known-limitations--next-steps)

---

## 1. Background & Motivation

SkillYards has FAQs across multiple pages:

- **`/faqs`** — Central hub with 60+ FAQs organized by category (BCA, BBA, Full-Stack, Digital Marketing, General, Degrees, Support, Test, Homepage)
- **`/bca-training-program-in-agra`** — 10 BCA-specific FAQs
- **`/bba-training-program-in-agra`** — 10 BBA-specific FAQs
- **`/full-stack-web-development-training-in-agra`** — Full-Stack program FAQs
- **`/digital-marketing-course-in-agra`** — Digital Marketing program FAQs
- **`/programs`**, **`/programs/on-job-degree`**, **`/programs/on-job-training`** — General/degree FAQs
- **`/`** (Homepage), **`/about`** — General FAQs
- **`/support`** — Support FAQs
- **`/10-minutes-test`** — Test FAQs

Historically, all FAQ content was hardcoded as `<span>` elements inside accordion buttons — inline text with no heading semantics. During an earlier implementation pass, the `<span>` was changed to `<h3>` directly inside `<button>`, which created invalid HTML (`<button>` only permits phrasing content). The audit corrected this to the proper WAI-ARIA pattern: `<h3><button><span>Question</span></button></h3>`.

### Goals

1. Make individual FAQs **addressable** via anchor links (e.g., `/faqs#faq-bca-eligibility`)
2. Provide **proper heading hierarchy** so Google understands page structure
3. Add per-FAQ **`url` references in JSON-LD** for richer structured data
4. Use a **schema ownership map** to ensure each FAQ category is marked up on exactly one page (following Google's guidelines)
5. Lay the groundwork for future dedicated FAQ pages (Phase 3)

---

## 2. Google FAQ Rich Result Deprecation

**On May 7, 2026**, Google ended support for FAQ rich results in Google Search. FAQ Search Console reporting and Rich Results Test support will be removed in **June 2026**, with API support removed in **August 2026**.

### What this means

| Before May 7                                                                              | After May 7                                                         |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| FAQPage structured data could produce visual accordion dropdowns in Google Search results | FAQPage structured data **no longer generates visual rich results** |
| Search Console reported FAQ schema performance                                            | Search Console reporting removed June 2026                          |
| Rich Results Test tool showed FAQ previews                                                | Rich Results Test support removed June 2026                         |

### Why we still keep FAQPage schema

1. **Entity understanding** — Google still indexes structured data and uses it to understand page content, even if it doesn't display rich results. Google's structured data documentation says structured data helps it understand the content on a page. ([Google for Developers](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data))
2. **Other search engines** — Bing, DuckDuckGo, and others still use FAQPage schema
3. **Future-proofing** — If Google reintroduces FAQ features, the schema is already in place
4. **Content signals** — Well-structured FAQ content (Q&A format with schema) signals topical depth

### Where FAQ content still helps rankings

- **People Also Ask (PAA)** — Google still shows Q&A pairs in PAA boxes
- **Featured snippets** — Well-written answers can appear in position 0
- **Long-tail organic ranking** — Each FAQ targets a specific question; proper structure increases ranking potential
- **Content depth signals** — Comprehensive FAQ sections signal thorough topic coverage

> ⚠️ Per-FAQ `url` is valid structured-data enrichment and may help parsers associate a question with a page section. However, Google's FAQPage documentation only requires `mainEntity`, `name`, `acceptedAnswer`, and `text` — the `url` property is not required by Google Search and should not be treated as a guaranteed ranking or rich-result signal. Google notes that some schema.org properties are not required by Google Search and may be more useful for other engines or tools. ([Google for Developers](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data))

---

## 3. Pre-Change State

Before the audit, each FAQ was rendered as:

```html
<div>
  <button>
    <h3>What is the eligibility for BCA at SkillYards?</h3>
  </button>
  <div><!-- answer content --></div>
</div>
```

**Problems:**

- `<h3>` inside `<button>` is invalid HTML — `<button>` only permits phrasing content, not headings
- No `id` attribute → impossible to deep-link to a specific FAQ
- No anchor-based navigation → users always land at the top of the FAQ page
- Schema had no `url` property → no connection between schema entry and page location
- No schema ownership → same FAQs appeared in schema on both `/faqs` and landing pages (violating Google's "one instance per site" guideline)

---

## 4. Change 1: Anchor IDs on All FAQ Containers

### What Changed

Every FAQ accordion container now renders with a unique `id` attribute generated from the FAQ question text (or Sanity slug if available).

```html
<div id="faq-bca-eligibility-agra">...</div>
```

### Implementation

**Utility function** (`apps/website/src/lib/seo/faqUtils.js`):

```js
export function getFaqAnchorId(faq) {
  const text = faq.slug || faq.question || faq.q || "";
  if (!text) return "";

  const slug = text
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 100);

  return slug ? `faq-${slug}` : "";
}
```

**Usage in each FAQ component** (e.g., `FAQsAccordion.jsx`):

```jsx
import { getFaqAnchorId } from "@/lib/seo/faqUtils";

// Inside the map:
const anchorId = getFaqAnchorId(faq);
return (
  <div key={idx} id={anchorId} ...>
    ...
  </div>
);
```

### Effect

Each FAQ section is now a clearly identifiable part of the page, with a direct link target, semantic heading, and optional structured-data reference.

| Before                                                                           | After                                                         |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| No `id` on FAQ containers                                                        | `id="faq-bca-eligibility-agra"` on every FAQ                  |
| `/faqs` page could only be linked as a whole                                     | Specific FAQs can be linked: `/faqs#faq-bca-eligibility-agra` |
| Blog posts, social media, and CTAs could only link to the top of the FAQ section | Direct linking to a specific answer                           |
| Google could not associate a specific FAQ with a URL fragment                    | Google can see `#faq-*` fragments as section targets          |

> ⚠️ Anchor URLs are not the same as separate indexable pages. `/faqs#faq-bca-eligibility` is still the `/faqs` page — Google does not treat URL fragments as distinct indexed pages. However, they are useful for direct linking, navigation, and structured-data references.

### Edge Cases Handled

- Empty FAQ object → returns `""`
- Missing `slug` → falls back to `question` field
- Missing `question` → falls back to `q` field
- All fields missing → returns `""`
- Very long questions → truncated to 100 characters
- Unicode/special characters → stripped to alphanumeric + hyphens

---

## 5. Change 2: FAQ Questions Changed from `<span>` to `<h3>` Headings

### What Changed

Before (invalid HTML):

```html
<button>
  <h3 class="...">Question text</h3>
  <div class="...">icon</div>
</button>
```

After (valid WAI-ARIA accordion pattern):

```html
<h3 class="m-0">
  <button
    type="button"
    aria-expanded="true/false"
    aria-controls="faq-panel-0"
    class="flex w-full ..."
  >
    <span class="...">Question text</span>
    <span class="...">icon</span>
  </button>
</h3>
```

The `<h3>` now wraps the `<button>`, not the other way around. This follows the [WAI-ARIA accordion pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/) where the heading element owns the button trigger.

### Why `<h3>`?

- Google's title-link documentation explicitly mentions heading elements as one of the sources Google may use to understand page content
- Headings (`<h1>` → `<h6>`) are one of the strongest HTML signals for content structure
- Screen readers and accessibility tools navigate by heading hierarchy
- **People Also Ask** and featured snippet algorithms heavily weigh heading structure

### Why `m-0`?

The `m-0` Tailwind class (margin: 0) prevents the `<h3>` from adding extra spacing that would shift the accordion button layout. The button should remain visually and functionally identical — only the semantic wrapper changes.

### Why not `<h2>`?

Each FAQ section already has an `<h2>` for the section title (e.g., "Questions we get every day"). Individual FAQ questions are **subsections** of that, so `<h3>` is the correct level in the heading hierarchy.

### Why `<span>` inside `<button>` instead of `<h3>`?

The HTML `<button>` element permits **phrasing content only**, per the [MDN specification](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button). Headings are not phrasing content. By placing a `<span>` (which is phrasing content) inside the `<button>`, and wrapping the entire `<button>` in an `<h3>`, we get:

- ✅ Valid HTML
- ✅ Proper heading hierarchy for SEO
- ✅ Correct button semantics
- ✅ Screen reader compatibility

### Components Updated (9 total)

| Component       | Page(s)                        | File                                                       |
| --------------- | ------------------------------ | ---------------------------------------------------------- |
| `FAQsAccordion` | `/faqs`                        | `apps/website/src/components/faqspage/FAQsAccordion.jsx`   |
| `BCAFAQ`        | BCA landing page               | `apps/website/src/components/landingPageBCA/FAQ.jsx`       |
| `BBAFAQ`        | BBA landing page               | `apps/website/src/components/landingPageBBA/FAQ.jsx`       |
| `FSDFAQ`        | Full-Stack Dev landing page    | `apps/website/src/components/landingPageFSD/FAQ.jsx`       |
| `DGMFAQ`        | Digital Marketing landing page | `apps/website/src/components/landingPageDGM/FAQ.jsx`       |
| `FAQSection`    | Homepage, About                | `apps/website/src/components/common/FAQSection.jsx`        |
| `ProgramsFAQ`   | Programs, OJD, OJT pages       | `apps/website/src/components/programspage/ProgramsFAQ.jsx` |
| `TestFAQ`       | 10-minute test page            | `apps/website/src/components/testpage/TestFAQ.jsx`         |
| `SupportFAQ`    | Support page                   | `apps/website/src/components/supportpage/SupportFAQ.jsx`   |

---

## 6. Change 3: Per-FAQ `url` in FAQPage JSON-LD Schema

### What Changed

The `getFAQSchema` function now accepts a second parameter: `baseUrl`.

Before:

```json
{
  "@type": "Question",
  "name": "What is the eligibility for BCA at SkillYards?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "BCA requires 12th pass from a Science stream..."
  }
}
```

After:

```json
{
  "@type": "Question",
  "name": "What is the eligibility for BCA at SkillYards?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "BCA requires 12th pass from a Science stream..."
  },
  "url": "https://www.skillyards.in/faqs#faq-bca-eligibility-agra"
}
```

Each FAQ in the structured data is now associated with a specific anchor URL on its page. This is valid structured-data enrichment and may help parsers associate a question with a page section. Note that Google's FAQPage documentation only requires `mainEntity`, `name`, `acceptedAnswer`, and `text` — the `url` property is not required by Google Search and may be more useful for other search engines or parsers. ([Google for Developers](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data))

### Files Updated (12 pages)

| Page                                           | URL Passed                                                    |
| ---------------------------------------------- | ------------------------------------------------------------- |
| `/faqs`                                        | `absoluteUrl("/faqs")`                                        |
| `/` (homepage)                                 | `absoluteUrl("/")`                                            |
| `/about`                                       | `absoluteUrl("/about")`                                       |
| `/programs`                                    | `absoluteUrl("/programs")`                                    |
| `/programs/on-job-degree`                      | `absoluteUrl("/programs/on-job-degree")`                      |
| `/programs/on-job-training`                    | `absoluteUrl("/programs/on-job-training")`                    |
| `/bca-training-program-in-agra`                | `absoluteUrl("/bca-training-program-in-agra")`                |
| `/bba-training-program-in-agra`                | `absoluteUrl("/bba-training-program-in-agra")`                |
| `/full-stack-web-development-training-in-agra` | `absoluteUrl("/full-stack-web-development-training-in-agra")` |
| `/digital-marketing-course-in-agra`            | `absoluteUrl("/digital-marketing-course-in-agra")`            |
| `/support`                                     | `absoluteUrl("/support")`                                     |
| `/10-minutes-test`                             | `absoluteUrl("/10-minutes-test")`                             |

---

## 7. Change 4: Schema Ownership Map (No Duplicate FAQ Markup)

### The Problem

Google's FAQ structured data guidelines state that if the **same question and answer** appears on multiple pages, only one instance should be marked up with FAQPage schema across the entire site.

Before the fix, the `/faqs` page included **all** categories in its FAQPage schema, including `bca`, `bba`, `fullstack`, and `digitalmarketing` — the same FAQs that also appeared in schema on their respective landing pages. This violated Google's guideline.

### The Fix

A **schema ownership map** in `apps/website/src/app/faqs/page.jsx` assigns each FAQ category to exactly one page:

```js
const FAQ_SCHEMA_OWNER = {
  bca: "/bca-training-program-in-agra",
  bba: "/bba-training-program-in-agra",
  fullstack: "/full-stack-web-development-training-in-agra",
  digitalmarketing: "/digital-marketing-course-in-agra",
  support: "/support",
  test: "/10-minutes-test",
  degrees: "/programs/on-job-degree",
  general: "/faqs",
  homepage: "/",
};

const CURRENT_PAGE = "/faqs";

// In the loop:
if (FAQ_SCHEMA_OWNER[cat.slug] === CURRENT_PAGE) {
  schemaFaqs.push(...cat.faqs);
}
```

The `/faqs` page:

1. **Displays** all categories visually (UI is unchanged) — all FAQs are still visible
2. **Includes in FAQPage schema only** the categories owned by `/faqs`: `general`

### Schema Coverage by Page

| Page                                           | Categories in Schema | Notes                                      |
| ---------------------------------------------- | -------------------- | ------------------------------------------ |
| `/faqs`                                        | general only         | All FAQs visible, only `general` in schema |
| `/bca-training-program-in-agra`                | bca                  | Owns `bca`                                 |
| `/bba-training-program-in-agra`                | bba                  | Owns `bba`                                 |
| `/full-stack-web-development-training-in-agra` | fullstack            | Owns `fullstack`                           |
| `/digital-marketing-course-in-agra`            | digitalmarketing     | Owns `digitalmarketing`                    |
| `/programs/on-job-degree`                      | degrees              | Owns `degrees`                             |
| `/10-minutes-test`                             | test                 | Owns `test`                                |
| `/support`                                     | support              | Owns `support`                             |
| `/` (homepage)                                 | homepage             | Owns `homepage`                            |

Each FAQ category's schema appears on **exactly one page**, following Google's guidelines.

> **Caution — cross-category duplicates:** The ownership map prevents duplicates **within a category**, but if the same question+answer pair exists in **two different categories** (e.g., a "general" FAQ on `/faqs` and a "homepage" FAQ on `/`), both pages will still output separate FAQPage schema. For full compliance, ensure FAQ content is unique per category, or apply a content-hash deduplication step to the schema generation logic.

> **Important — enforce on every page:** The ownership map must be checked on every page that outputs FAQPage schema, not only on `/faqs`. Pages such as `/about`, `/programs`, and `/programs/on-job-training` should either own a unique FAQ category or avoid outputting FAQPage schema for shared FAQs. Verify each page's rendered JSON-LD to ensure no duplicate categories appear in schema.

---

## 8. New Utility: `faqUtils.js`

**Path:** `apps/website/src/lib/seo/faqUtils.js`

A shared utility module with two exports:

### `getFaqAnchorId(faq)`

Generates a stable anchor ID for any FAQ item. Used by all 9 FAQ components + 1 schema file.

| Input                                      | Output                               |
| ------------------------------------------ | ------------------------------------ |
| `{ slug: "bca-eligibility-agra" }`         | `faq-bca-eligibility-agra`           |
| `{ question: "What is the fee for BCA?" }` | `faq-what-is-the-fee-for-bca`        |
| `{ q: "When does the next batch start?" }` | `faq-when-does-the-next-batch-start` |
| `{}`                                       | `""`                                 |
| `null`                                     | `""`                                 |

### `slugify(text)`

Simple string slugification utility.

---

## 9. ARIA & Accessibility Improvements

All accordion components now follow the [WAI-ARIA accordion pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/):

| Attribute         | Purpose                                     | Example                           |
| ----------------- | ------------------------------------------- | --------------------------------- |
| `type="button"`   | Prevents unintended form submission         | `<button type="button">`          |
| `aria-expanded`   | Indicates whether the panel is open         | `aria-expanded={isOpen}`          |
| `aria-controls`   | Associates button with its controlled panel | `aria-controls="faq-panel-0"`     |
| `role="region"`   | Identifies the panel as a landmark region   | `role="region"`                   |
| `aria-labelledby` | Associates panel with its trigger button    | `aria-labelledby="faq-trigger-0"` |

**Accordion trigger pattern (valid HTML5):**

```html
<h3 class="m-0">
  <button
    id="faq-trigger-0"
    type="button"
    aria-expanded="true"
    aria-controls="faq-panel-0"
  >
    <span>Question text</span>
    <span>icon</span>
  </button>
</h3>
```

**Accordion panel pattern:**

```html
<div id="faq-panel-0" role="region" aria-labelledby="faq-trigger-0">
  <p>Answer text</p>
</div>
```

> **Note on `role="region"` usage:** Adding `role="region"` to every panel is acceptable for small accordions (a few panels). On the `/faqs` hub with 60+ panels, however, this creates excessive landmark regions for screen-reader users. Consider using `role="region"` selectively — e.g., only on expanded panels, or omitting it from large accordion groups entirely.

---

## 10. Files Modified

### New File

| File                                   | Purpose                                             |
| -------------------------------------- | --------------------------------------------------- |
| `apps/website/src/lib/seo/faqUtils.js` | Shared `getFaqAnchorId()` and `slugify()` utilities |

### Core Schema

| File                                           | Change                                                                       |
| ---------------------------------------------- | ---------------------------------------------------------------------------- |
| `apps/website/src/lib/seo/schema/faqSchema.js` | Added `baseUrl` parameter; each FAQ now gets `url: baseUrl + "#" + anchorId` |

### FAQ Components (9 files)

| File                                                       | Header Pattern       | Panel IDs | ARIA Attrs |
| ---------------------------------------------------------- | -------------------- | --------- | ---------- |
| `apps/website/src/components/faqspage/FAQsAccordion.jsx`   | `h3 > button > span` | ✅        | ✅         |
| `apps/website/src/components/landingPageBCA/FAQ.jsx`       | `h3 > button > span` | ✅        | ✅         |
| `apps/website/src/components/landingPageBBA/FAQ.jsx`       | `h3 > button > span` | ✅        | ✅         |
| `apps/website/src/components/landingPageFSD/FAQ.jsx`       | `h3 > button > span` | ✅        | ✅         |
| `apps/website/src/components/landingPageDGM/FAQ.jsx`       | `h3 > button > span` | ✅        | ✅         |
| `apps/website/src/components/common/FAQSection.jsx`        | `h3 > button > span` | ✅        | ✅         |
| `apps/website/src/components/programspage/ProgramsFAQ.jsx` | `h3 > button > span` | ✅        | ✅         |
| `apps/website/src/components/testpage/TestFAQ.jsx`         | `h3 > button > span` | ✅        | ✅         |
| `apps/website/src/components/supportpage/SupportFAQ.jsx`   | `h3 > button > span` | ✅        | ✅         |

### Page Files (12 files)

| File                                                                        | Change                                            |
| --------------------------------------------------------------------------- | ------------------------------------------------- |
| `apps/website/src/app/faqs/page.jsx`                                        | Schema ownership map; removed `allFaqs` dead code |
| `apps/website/src/app/page.js`                                              | +`baseUrl` param to `getFAQSchema()`              |
| `apps/website/src/app/about/page.jsx`                                       | +`baseUrl` param                                  |
| `apps/website/src/app/programs/page.jsx`                                    | +`baseUrl` param                                  |
| `apps/website/src/app/programs/on-job-degree/page.jsx`                      | +`baseUrl` param                                  |
| `apps/website/src/app/programs/on-job-training/page.jsx`                    | +`baseUrl` param                                  |
| `apps/website/src/app/bca-training-program-in-agra/page.jsx`                | +`baseUrl` param                                  |
| `apps/website/src/app/bba-training-program-in-agra/page.jsx`                | +`baseUrl` param                                  |
| `apps/website/src/app/full-stack-web-development-training-in-agra/page.jsx` | +`baseUrl` param                                  |
| `apps/website/src/app/digital-marketing-course-in-agra/page.jsx`            | +`baseUrl` param                                  |
| `apps/website/src/app/support/page.jsx`                                     | +`baseUrl` param                                  |
| `apps/website/src/app/10-minutes-test/page.jsx`                             | +`baseUrl` param                                  |

### Temporary Script Files (for reference, not committed)

| File                   | Purpose                                           |
| ---------------------- | ------------------------------------------------- |
| `tmp/fix-faq-html.js`  | First pass script for heading-inside-button fixes |
| `tmp/fix-remaining.js` | Second pass script for remaining files            |

**Total: 22 permanent files modified (1 new, 21 edited)**

---

## 11. Expected SEO Impact

### What This Achieves

| Improvement                         | Impact                                                                                                              |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Proper `<h3>` heading hierarchy** | Google can better understand page structure. Headings are one of the signals Google uses for content understanding. |
| **Schema ownership map**            | No duplicate FAQPage markup across pages — cleaner structured data per Google's guidelines                          |
| **Schema `url` enrichment**         | Each FAQ in JSON-LD references its page anchor — useful for parsers and other search engines                        |
| **Anchor IDs**                      | Direct linking to specific FAQs from blog posts, social media, and internal pages                                   |
| **ARIA accessibility**              | Improved screen reader navigation and keyboard interaction                                                          |

### Where This Helps (Medium-Term)

- **People Also Ask** — Improved heading structure increases chances of appearing in PAA boxes
- **Featured snippets** — Well-structured Q&A under proper headings can earn position 0
- **Long-tail rankings** — Individual FAQs (e.g., "BCA eligibility in Agra") may rank better as Google associates each question with its heading and content
- **Content depth signals** — Comprehensive FAQ sections signal thorough topic coverage to Google's helpful content system

### What This Does NOT Do

- ❌ Does not create individual indexable pages (anchor URLs are **not** separate pages — Google does not treat URL fragments as distinct indexed pages)
- ❌ Does not generate FAQ rich results in Google Search — FAQ rich results stopped appearing in Google Search on May 7, 2026. Google says FAQ Search Console reporting and Rich Results Test support will be removed in June 2026, with API support removed in August 2026.
- ❌ Does not replace the need for dedicated FAQ pages for competitive queries
- ❌ The `url` property on FAQ schema is not a guaranteed Google ranking or rich-result signal — it's optional enrichment that may be more useful for other engines or parsers

---

## 12. Known Limitations & Next Steps

### Limitations of Current Approach

1. **Anchor URLs are not separate pages** — `/faqs#faq-bca-eligibility` is still the `/faqs` page. Google does not treat URL fragments as distinct indexed pages. ([Google URL structure docs](https://developers.google.com/search/docs/crawling-indexing/url-structure))
2. **FAQ content is inside accordions** — Only the first FAQ is open by default. While Google can index collapsed content, visible content may carry more weight.
3. **No anchor-link table of contents** — There's no `<a href="#faq-bca-eligibility">` navigation block at the top of the `/faqs` page.
4. **No per-FAQ metadata** — Individual FAQs don't have their own meta titles, descriptions, or Open Graph tags.
5. **Same FAQ content on multiple pages** — If the same question+answer pair appears on both `/faqs` and a landing page, only the designated schema owner page includes it in schema. The other page still shows the content but without FAQPage markup. For best results, rewrite FAQs to be page-specific (e.g., BCA FAQ should mention BCA in the question, not be generic).

### Recommended Phase 2: FAQ Table of Contents

Add a visible, crawlable table of contents at the top of the `/faqs` page with real `<a>` links pointing to each FAQ's anchor ID:

```html
<nav>
  <a href="#faq-bca-eligibility-agra">BCA eligibility in Agra</a>
  <a href="#faq-bca-fees-agra">BCA fees in Agra</a>
  <a href="#faq-bba-eligibility">BBA eligibility</a>
  ...
</nav>
```

Google's link best practices say crawlable links should be real `<a>` elements with `href`. ([Google link docs](https://developers.google.com/search/docs/crawling-indexing/links-crawlable))

This would:

- Create crawlable internal links to each section
- Improve user navigation
- Help Google associate each FAQ anchor with descriptive link text

### Recommended Phase 3: Dedicated FAQ Pages

For high-intent, competitive queries, create dedicated pages:

```
/faqs/bca-eligibility-in-agra
/faqs/bca-fees-in-agra
/faqs/bba-eligibility-in-agra
/faqs/bba-with-digital-marketing-in-agra
/faqs/bca-admission-2026-agra
/faqs/bba-admission-2026-agra
```

Each page should include:

- Direct answer at the top
- Supporting details (eligibility, fees, process)
- Related FAQs with internal links
- Course/program CTA
- Unique meta title and description targeting the specific query

Google recommends descriptive, human-readable URLs, so these clean FAQ URLs are stronger than relying only on hash fragments. ([Google URL structure docs](https://developers.google.com/search/docs/crawling-indexing/url-structure))

### Recommended Phase 4: FAQ Content Uniqueness Audit

Audit FAQ content to ensure questions and answers are **page-specific** rather than duplicated word-for-word:

| Current (duplicate)                                                             | Better (page-specific)                                                                |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `/faqs`: "What is the eligibility for the BCA program?"                         | Generic, suitable for FAQ hub                                                         |
| `/bca-training-program-in-agra`: "What is the eligibility for the BCA program?" | Rewrite to: "Who is eligible for SkillYards BCA with Full-Stack Development in Agra?" |

Similar intent, but not blindly duplicated — and therefore each can be schema'd independently without issue.

### SEO Strength Ranking

| Strategy                                               | SEO Strength |
| ------------------------------------------------------ | ------------ |
| Big FAQ page with spans, no IDs, duplicate schema      | Weak         |
| FAQ page with anchors + `<h3>` + schema ownership      | Good         |
| Course pages with targeted, unique FAQs                | Better       |
| Dedicated long-tail FAQ pages linked from course pages | Best         |

---

## Appendix A: HTML Output Comparison

### Before (all components — invalid HTML)

```html
<div id="faq-bca-eligibility-agra" class="rounded-2xl border ...">
  <button class="flex w-full ...">
    <h3 class="text-sm font-bold m-0 ...">
      What is the eligibility for BCA at SkillYards?
    </h3>
    <div class="..."><Plus size="{14}" /></div>
  </button>
  <div class="..."><!-- answer --></div>
</div>
```

### After (all components — valid WAI-ARIA accordion)

```html
<div id="faq-bca-eligibility-agra" class="rounded-2xl border ...">
  <h3 class="m-0">
    <button
      id="faq-trigger-0"
      type="button"
      aria-expanded="true"
      aria-controls="faq-panel-0"
      class="flex w-full ..."
    >
      <span class="text-sm font-bold ..."
        >What is the eligibility for BCA at SkillYards?</span
      >
      <span class="..."><Plus size="{14}" /></span>
    </button>
  </h3>
  <div id="faq-panel-0" role="region" aria-labelledby="faq-trigger-0">
    <!-- answer -->
  </div>
</div>
```

## Appendix B: JSON-LD Output Comparison

### Before

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the eligibility for BCA at SkillYards?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "BCA requires 12th pass from a Science stream..."
      }
    }
  ]
}
```

### After

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the eligibility for BCA at SkillYards?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "BCA requires 12th pass from a Science stream..."
      },
      "url": "https://www.skillyards.in/faqs#faq-bca-eligibility-agra"
    }
  ]
}
```

---

## Appendix C: Schema Ownership Map

Defined in `apps/website/src/app/faqs/page.jsx`:

```js
// Schema ownership map — each FAQ category gets FAQPage schema on exactly one page.
// Google's guidelines say if the same Q&A appears on multiple pages, mark up only one instance.
const FAQ_SCHEMA_OWNER = {
  bca: "/bca-training-program-in-agra",
  bba: "/bba-training-program-in-agra",
  fullstack: "/full-stack-web-development-training-in-agra",
  digitalmarketing: "/digital-marketing-course-in-agra",
  support: "/support",
  test: "/10-minutes-test",
  degrees: "/programs/on-job-degree",
  general: "/faqs",
  homepage: "/",
};

const CURRENT_PAGE = "/faqs";

// Only include in schema if this page is the designated owner for this category
if (FAQ_SCHEMA_OWNER[cat.slug] === CURRENT_PAGE) {
  schemaFaqs.push(...cat.faqs);
}
```

---

_Document maintained by the development team. Last updated: May 2026._
