# Agentic SEO for Skillyards — Plan & Discussion Record

> **Date:** June 18, 2026
> **Context:** Discussion between developer and project owner about implementing AI-driven autonomous SEO agents for the Skillyards e-learning platform.

---

## Table of Contents

1. [What is Agentic SEO?](#1-what-is-agentic-seo)
2. [Why Agentic SEO for Skillyards?](#2-why-agentic-seo-for-skillyards)
3. [Current SEO State of Skillyards](#3-current-seo-state-of-skillyards)
4. [Proposed Agentic SEO System Overview](#4-proposed-agentic-seo-system-overview)
5. [Technical Architecture](#5-technical-architecture)
6. [Agent Catalog](#6-agent-catalog)
7. [Phased Implementation Plan](#7-phased-implementation-plan)
8. [Cost Analysis (Free-Tier Only)](#8-cost-analysis-free-tier-only)
9. [What We Need from Your End](#9-what-we-need-from-your-end)
10. [Next Steps](#10-next-steps)

---

## 1. What is Agentic SEO?

**Agentic SEO** is a search optimization model where autonomous AI agents plan, execute, and continuously improve SEO without human intervention at every step. Unlike traditional SEO tools that generate reports and leave execution to humans, agentic systems:

- **Research** keywords, competitors, and content gaps autonomously
- **Generate & optimize** meta tags, content, and structured data
- **Fix** technical SEO issues in real time
- **Monitor** rankings, AI search citations, and performance
- **Adapt** strategies based on real-time data

It runs as a continuous loop: **Data → Decide → Act → Monitor → Adapt**

This is different from:
| Approach | Description |
|----------|-------------|
| **AI-assisted SEO** | Human prompts AI per-task, then executes manually |
| **Traditional SEO** | Human researches, decides, and implements everything |
| **Agentic SEO** | AI agents autonomously plan, execute, and iterate |

---

## 2. Why Agentic SEO for Skillyards?

Skillyards is an IT training institute competing in a crowded local + national market. Key motivators:

1. **Content scale** — Blog posts, FAQs, program pages, team profiles — all need ongoing optimization
2. **Competitive edge** — Most local institutes don't optimize SEO; agentic automation creates a moat
3. **AI search is growing** — ChatGPT, Perplexity, Google AI Overviews are reshaping discovery. Skillyards needs to be cited in AI responses (not just ranked in blue links)
4. **Zero ongoing cost** — With free-tier infrastructure, the system runs for $0/month once built
5. **Existing infrastructure is ready** — The codebase already has strong SEO fundamentals (schemas, sitemaps, metadata). Agents build on top of this foundation

---

## 3. Current SEO State of Skillyards

### What's Already Good

| Feature | Status |
|---------|--------|
| JSON-LD Structured Data | 9 schema types (Organization, WebSite, BlogPosting, Course, FAQPage, BreadcrumbList, Person, JobPosting, Quiz) |
| Dynamic XML Sitemap | Auto-discovers routes + fetches Sanity slugs |
| Dynamic robots.txt | Allows crawlers, excludes private paths |
| Per-page Meta Tags | Title, description, OG/Twitter, canonical, keywords |
| Redirects | 301 redirects for legacy URLs, host canonicalization |
| Performance | ISR (revalidate), CSP headers, font-display swap |
| SEO Validation | Runtime warnings for missing title/description/path |
| Schema Ownership Map | Prevents duplicate FAQPage markup across pages |
| Accessibility | WAI-ARIA accordions, anchor IDs for FAQ jumps |

### What's Missing (Opportunity for Agents)

| Gap | Agent Solution |
|-----|---------------|
| Meta tags are static — never optimized post-creation | Meta Optimization Agent |
| No validation that schema *content* matches page content | Schema Validation Agent |
| Internal links are hand-placed, no systematic coverage | Internal Linking Agent |
| No tracking of stale/outdated content | Content Freshness Agent |
| No keyword gap analysis vs competitors | Keyword Gap Agent |
| No monitoring of AI search engine citations | AI Visibility (GEO) Agent |
| No automated technical SEO audit pipeline | Technical Crawler Agent |
| No centralized SEO performance dashboard | Admin dashboard (Phase 4) |

---

## 4. Proposed Agentic SEO System Overview

```
┌──────────────────────────────────────────────────────────────┐
│                  GitHub Actions (Scheduler)                    │
│  Cron-based workflow triggers — no server infrastructure      │
│  Each agent runs as a standalone Node.js script               │
└──────────┬──────────┬──────────┬──────────┬──────────┬───────┘
           │          │          │          │          │
     ┌─────▼──┐ ┌─────▼──┐ ┌─────▼──┐ ┌─────▼──┐ ┌─────▼──┐
     │  Meta  │ │ Schema │ │  Link  │ │ Fresh  │ │  Gap   │
     │  Opt   │ │  Valid │ │  Build │ │  Check │ │  Agent │
     └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘
         │          │          │          │          │
         └──────────┴──────┬───┴──────────┴──────────┘
                           │
                   ┌───────▼────────┐
                   │   AI Model      │
                   │  (Gemini 2.5   │
                   │   Flash — Free)│
                   └───────┬────────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
         ┌────▼────┐ ┌────▼────┐ ┌────▼────┐
         │ Sanity  │ │  Neon   │ │ GitHub  │
         │   CMS   │ │   DB    │ │   (PR)  │
         └─────────┘ └─────────┘ └─────────┘
```

---

## 5. Technical Architecture

### Free-Tier Stack

| Component | Choice | Free Tier Limit | Why |
|-----------|--------|----------------|-----|
| **Scheduler** | GitHub Actions (cron) | 2,000 min/month | Already on GitHub; no server needed |
| **AI Model** | Google Gemini 2.5 Flash | 1M tokens/day, 1,500 RPM | Generous free tier covers entire workload |
| **Content Store** | Sanity CMS | Existing free plan | Agents read/write content + metadata |
| **Agent Logs** | Neon PostgreSQL | Existing free plan | Store run history, actions, metrics |
| **Code** | Node.js scripts in `apps/website/src/agents/` | — | Runs in GitHub Actions runtime |
| **Web App** | Vercel Free (unchanged) | Existing free plan | Agents don't run here; only serve the built site |

### Agent Script Structure (per agent)

```
apps/website/src/agents/
├── core/
│   ├── agent-runner.js       # Base class: run() → fetch → decide → act → log
│   ├── llm-client.js         # Gemini API wrapper (rate-limited, retry-logic)
│   ├── sanity-client.js      # Sanity read/write helpers
│   ├── logger.js             # Logs to Neon agent_logs table
│   └── config.js             # Schedule, model params, page lists
├── meta-optimizer/
│   ├── index.js              # Entry point for GitHub Actions
│   ├── analyzer.js           # Scan pages for weak/empty meta tags
│   ├── generator.js          # Call Gemini to generate improved meta
│   └── updater.js            # Write changes to Sanity
├── schema-validator/
│   ├── index.js
│   ├── crawler.js            # Fetch all page URLs + their current schemas
│   ├── validator.js          # Validate schema completeness + correctness
│   └── fixer.js              # Generate + submit fixes to Sanity
├── linking-agent/
│   ├── index.js
│   ├── graph.js              # Build content relationship graph
│   ├── analyzer.js           # Find orphan pages, weak clusters
│   └── linker.js             # Insert contextual links via Sanity
├── freshness-agent/
│   ├── index.js
│   ├── scanner.js            # Check _updatedAt timestamps
│   └── updater.js            # Generate + submit update suggestions
├── keyword-gap-agent/        # (Phase 3)
├── geo-agent/                # (Phase 3)
├── tech-crawler/             # (Phase 3)
└── .github/
    └── workflows/
        ├── agent-meta.yml          # Runs weekly (Mon 6am)
        ├── agent-schema.yml        # Runs daily (6am)
        ├── agent-linking.yml       # Runs weekly (Tue 6am)
        ├── agent-freshness.yml     # Runs weekly (Wed 6am)
        └── agent-orchestrator.yml  # Runs all agents (manual trigger)
```

---

## 6. Agent Catalog

### Phase 1 — Core Agents (P0)

#### 6.1 Meta Content Optimization Agent

| Aspect | Detail |
|--------|--------|
| **Purpose** | Scan all pages for weak/empty meta titles and descriptions, generate improved versions |
| **Input** | List of all page URLs + their current title/description from Sanity or routes |
| **AI Task** | Analyze page content, suggest SEO-optimized title (<60 chars) and description (<160 chars) with keywords |
| **Action** | Write optimized meta to Sanity SEO fields; if none exist, create draft suggestions |
| **Human Oversight** | Changes create a Sanity draft (not published) — human reviews and publishes |
| **Schedule** | Weekly + on new blog post publish (via Sanity webhook) |
| **Token Cost** | ~11K tokens/run → ~$0.00 (within Gemini free tier) |

#### 6.2 Schema Validation & Enhancement Agent

| Aspect | Detail |
|--------|--------|
| **Purpose** | Validate all JSON-LD schemas across the site for correctness and completeness |
| **Input** | App Router page list + current schema output |
| **AI Task** | For each page, check: Is the right schema present? Are required fields populated? Does content match schema? |
| **Action** | Fix missing schemas (e.g., a blog missing `BlogPosting`) by updating the page's schema component; flag inconsistencies |
| **Human Oversight** | Fixes are PR'd to GitHub for review before deploy |
| **Schedule** | Daily |
| **Token Cost** | ~32K tokens/run → ~$0.00 (within Gemini free tier) |

#### 6.3 Internal Linking Agent

| Aspect | Detail |
|--------|--------|
| **Purpose** | Build content graph, identify orphan pages, suggest and insert contextual internal links |
| **Input** | All page content (Sanity + static routes) |
| **AI Task** | For each page, identify 2-3 other pages with topical relevance; suggest link anchor text |
| **Action** | Insert links into Sanity blog post body content as suggested edits |
| **Human Oversight** | Edits are created as Sanity drafts (not auto-published) |
| **Schedule** | Weekly |
| **Token Cost** | ~128K tokens/run → ~$0.00 (within Gemini free tier) |

#### 6.4 Content Freshness Agent

| Aspect | Detail |
|--------|--------|
| **Purpose** | Detect stale content (>90 days without update) and suggest refreshes |
| **Input** | Sanity `_updatedAt` timestamps for all documents |
| **AI Task** | For stale items, generate a brief summary of what should be updated (statistics, new programs, recent info) |
| **Action** | Create a Sanity draft with "stale review" note; post to a dedicated `#seo-alerts` GitHub issue |
| **Human Oversight** | Content team reviews suggestions weekly |
| **Schedule** | Weekly |
| **Token Cost** | ~16K tokens/run → ~$0.00 (within Gemini free tier) |

### Phase 2 — Advanced Agents (P1)

#### 6.5 Keyword Gap & Content Opportunity Agent

| Aspect | Detail |
|--------|--------|
| **Purpose** | Identify keywords competitors rank for that Skillyards doesn't, generate content briefs |
| **Input** | Google Search Console data (free API) + competitor URLs |
| **Action** | Generate blog post briefs in Sanity as drafts with title, outline, target keywords |
| **Schedule** | Weekly |
| **Prerequisite** | Google Search Console access + API enabled |

#### 6.6 AI Visibility / GEO Agent

| Aspect | Detail |
|--------|--------|
| **Purpose** | Monitor how Skillyards appears in AI search engines (Gemini, ChatGPT, Perplexity, AI Overviews) |
| **Method** | Run prompt-based queries ("best BCA course in Agra with job training") and check if Skillyards is cited |
| **Action** | If missing from citations, flag content/schema changes needed; log citation status over time |
| **Schedule** | Daily |
| **Note** | Uses Gemini's own API to check visibility in AI search — no external API cost |

#### 6.7 Technical SEO Crawler Agent

| Aspect | Detail |
|--------|--------|
| **Purpose** | Crawl the live site and detect broken links, missing alt text, slow pages, large images |
| **Method** | Simple HTTP crawler (no headless browser needed for basic checks) |
| **Action** | Create GitHub issues for each problem found, prioritized by severity |
| **Schedule** | Daily |

---

## 7. Phased Implementation Plan

### Phase 1 — Foundation (Week 1)

| Task | Est. Hours | Deliverable |
|------|-----------|-------------|
| Create `apps/website/src/agents/` directory structure | 1 | Folder scaffold |
| Build `core/llm-client.js` (Gemini API wrapper) | 3 | Reusable LLM client with retry, rate-limit, token tracking |
| Build `core/sanity-client.js` (Sanity read/write helpers) | 2 | Agent-friendly CRUD for Sanity documents |
| Build `core/logger.js` (Neon logging) + create `agent_logs` DB table | 3 | Every agent action is logged |
| Build `core/agent-runner.js` (base class) | 3 | Standard run/validate/rollback pattern |
| Set up GitHub Actions workflow skeleton | 2 | Workflow templates, secret references, cron setup |
| **Total** | **14** | **Foundation complete** |

### Phase 2 — Core Agents (Week 2–3)

| Task | Est. Hours | Deliverable |
|------|-----------|-------------|
| Build Meta Optimization Agent | 10 | Scans + generates + writes drafts to Sanity |
| Build Schema Validation Agent | 12 | Crawls schemas + validates + creates PRs |
| Build Internal Linking Agent | 10 | Content graph + link suggestions in Sanity |
| Build Content Freshness Agent | 6 | Stale detection + GitHub issues |
| Integration test all 4 agents | 4 | Run against production data in dry-run mode |
| **Total** | **42** | **4 agents operational** |

### Phase 3 — Advanced Agents (Week 4–5)

| Task | Est. Hours | Deliverable |
|------|-----------|-------------|
| Build Keyword Gap Agent | 10 | GSC API integration + content brief generation |
| Build AI Visibility (GEO) Agent | 12 | Prompt-based citation checker + logging |
| Build Technical SEO Crawler | 10 | Crawl + issue generation |
| Integration test all 3 | 4 | Dry-run against production |
| **Total** | **36** | **7 agents operational** |

### Phase 4 — Dashboard & Polish (Week 6)

| Task | Est. Hours | Deliverable |
|------|-----------|-------------|
| Add admin dashboard page for agent logs + metrics | 8 | Viewable in `/admin` |
| Build alert system (agent failure notifications) | 4 | GitHub issue on failure |
| Add kill-switch / pause per agent | 3 | Disable any agent via DB flag |
| Documentation + runbooks | 4 | How to monitor, rollback, extend |
| **Total** | **19** | **Production-ready** |

### Total Investment: ~111 engineering hours (~3-4 weeks)

---

## 8. Cost Analysis (Free-Tier Only)

### Monthly Operating Cost: **$0.00**

| Item | Free Tier Limits | Skillyards Monthly Usage | Cost |
|------|-----------------|------------------------|------|
| **Gemini 2.5 Flash API** | 1M tokens/day, 1,500 RPM | ~300K tokens/month (all 7 agents) | **$0** |
| **GitHub Actions** | 2,000 min/month | ~30-60 min/month | **$0** |
| **Neon PostgreSQL** | Already on free plan | Negligible additional storage | **$0** |
| **Sanity CMS** | Already on free plan | Negligible additional API calls | **$0** |
| **Vercel** | Already on free plan | Unchanged — agents don't run here | **$0** |
| **Google Search Console API** | Unlimited (free) | ~1,000 queries/month | **$0** |
| **Total** | | | **$0.00/mo** |

### Why Gemini 2.5 Flash Is the Right Choice

- **Free tier**: 1M tokens/day — our entire monthly workload (~300K tokens) fits in a single day's budget
- **Context window**: 1M tokens — can process the entire site's content in one request
- **Quality**: Matches GPT-4o on most SEO tasks at zero cost
- **No credit card needed**: True free tier, unlike OpenAI which requires billing setup

---

## 9. What We Need from Your End

### 9.1 API Keys (Set as GitHub Secrets)

| Secret Name | What It Is | Where to Get It |
|-------------|-----------|-----------------|
| `GEMINI_API_KEY` | Google AI API key | https://aistudio.google.com → Get API key (free, no credit card) |
| `SANITY_API_TOKEN` | Sanity API token with write access | Sanity dashboard → API → Tokens → "Editor" token |
| `DATABASE_URL` | Neon PostgreSQL connection string | Already in your `.env` — `postgresql://...` |
| `SANITY_PROJECT_ID` | Your Sanity project ID | Already in your `.env` or Sanity dashboard |
| `SANITY_DATASET` | Usually `production` or `development` | Already in your `.env` |

### 9.2 Google Search Console (Only for Keyword Gap Agent — Phase 3)

- Add your domain (`skillyards.in`) to Google Search Console if not already done
- Verify ownership (DNS TXT record or HTML file upload)
- Enable Google Search Console API in Google Cloud Console
- Download the service account JSON

### 9.3 Decisions to Make

| Decision | Options | Our Recommendation |
|----------|---------|-------------------|
| **First agent to build** | Meta / Schema / Both | **Meta Optimization** — highest ROI, simplest to build |
| **Human oversight model** | Draft-only vs auto-publish | **Draft-only** — agents create Sanity drafts, you review weekly |
| **Error handling** | Slack/Discord alert vs GitHub Issue | **GitHub Issue** — simplest, no additional API needed |
| **GitHub repo** | Current repo | ✅ We're here |

### 9.4 Permission

- Default `GITHUB_TOKEN` (auto-created by GitHub Actions) is sufficient for creating issues and PRs
- No additional GitHub setup needed

---

## 10. Next Steps

```
┌──────────────────────────────────────────────────────────┐
│  1. You provide GEMINI_API_KEY + SANITY_API_TOKEN        │
│     (2 minutes — copy from respective dashboards)        │
├──────────────────────────────────────────────────────────┤
│  2. I set up secrets + build Core LLM/Sanity/Logger lib  │
│     (1 session — ~14 hours of work)                      │
├──────────────────────────────────────────────────────────┤
│  3. I build Meta Optimization Agent + GitHub Action      │
│     (1 session — ~10 hours of work)                      │
├──────────────────────────────────────────────────────────┤
│  4. Dry-run against production in draft-only mode        │
│     (you review suggested meta tags in Sanity)           │
├──────────────────────────────────────────────────────────┤
│  5. Iterate + proceed to Schema Agent, then next agents  │
└──────────────────────────────────────────────────────────┘
```

---

## Appendix: GitHub Actions Workflow Example (Meta Agent)

```yaml
# .github/workflows/agent-meta.yml
name: "Agent: Meta Optimization"

on:
  schedule:
    - cron: "0 6 * * 1"   # Every Monday at 6 AM UTC
  workflow_dispatch:        # Manual trigger

jobs:
  meta-optimizer:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install dependencies
        run: npm ci
        working-directory: apps/website

      - name: Run Meta Optimization Agent
        run: node src/agents/meta-optimizer/index.js
        working-directory: apps/website
        env:
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
          SANITY_API_TOKEN: ${{ secrets.SANITY_API_TOKEN }}
          SANITY_PROJECT_ID: ${{ secrets.SANITY_PROJECT_ID }}
          SANITY_DATASET: ${{ secrets.SANITY_DATASET }}
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          RUN_MODE: "draft"   # draft = creates Sanity drafts, not publish
```

---

*This document captures the discussion from June 18, 2026. It is a living document — update it as priorities shift or decisions are made.*
