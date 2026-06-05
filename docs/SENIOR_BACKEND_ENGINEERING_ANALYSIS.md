# Skillyards — Senior Backend Engineering Analysis

---






## 1. MONOREPO ARCHITECTURE

### What problem it solves

You have four distinct deployment surfaces — public website, admin ERP, API backend, PDF microservice — that share a non-trivial amount of business logic: database schema, Zod validation schemas, utility functions, email templates. Without a monorepo, you get the classic "shared library drift" problem: the admin app's version of a student schema diverges from the API's version, and you spend half your debugging sessions chasing type mismatches across repos.

### Why naive implementation fails

A naive approach is four separate repos with copy-pasted shared logic. The failure mode is silent divergence — the admin app is referencing `payment.status` enum values that the API no longer sends, nobody catches it until a production bug surfaces three weeks later. Alternatively, a naive mono-package approach with no build orchestration means rebuilding everything on every change, making CI punishingly slow.

### Current architecture

Turborepo with workspace packages (`packages/db`, `packages/ui`, `packages/utils`). The `packages/db` package is the most important: it is the **single source of truth** for the Drizzle schema. Every app that touches the database imports from this package. This means schema migrations are atomic from a developer perspective — you change the schema in one place, TypeScript propagates the breakage across all apps at compile time, not at runtime in production.

The `apps/pdf-service` is deliberately a **separate Express app**, not another Next.js app. This is a meaningful architecture decision: PDF generation with Puppeteer/Playwright requires persistent browser processes, high memory, and long-running operations. Embedding that inside a Next.js serverless runtime would be catastrophic — Vercel functions have 50–60 second timeouts and ephemeral execution environments. By isolating it as a long-running Express service on Railway, you sidestep the entire serverless execution model mismatch.

### Tradeoffs accepted

- **Deployment coupling**: All apps share the same monorepo, so a bad commit to `packages/db` can break all apps. Mitigated by TypeScript catching schema mismatches at build time.
- **Build complexity**: Turborepo's caching helps but adds toolchain overhead vs. a single app.
- **No independent versioning**: You can't release v2.0 of `packages/db` while keeping apps on v1.x. This is acceptable at this scale — you'd want changesets if this grew to 10+ apps.

### Scaling implications

The monorepo supports future scaling well because the `packages/db` layer already creates the right abstraction boundary. If you later need to split the API into multiple services, each service already has a clean dependency on the db package. The PDF service demonstrates this: it's already a separate deployable, connected only through an HTTP contract and the R2 storage layer.

### Backend engineering signal demonstrated

Understanding that **the monorepo is fundamentally a dependency management strategy**, not just "putting code in one place." The fact that the database schema lives in a shared package — not duplicated per-app — shows you've thought about who owns the data contract.

---

## 2. API ARCHITECTURE

### What problem it solves

The core problem is: how do you build a backend that serves both a public-facing website (unauthenticated leads, reCAPTCHA), an internal admin ERP (JWT auth, RBAC), and a machine-to-machine PDF callback (shared secret), with consistent error handling, rate limiting, and authorization — without writing security logic three times.

### Why naive implementation fails

The naive version is route-level ad-hoc checks: `if (!req.session) return 401` scattered across 20 route files. The failure mode is a missed check on a new route — which in a financial ERP means unauthorized access to student payment records. You also get inconsistent error shapes, CORS headers missing on some routes but not others, and no rate limiting because it's painful to add manually.

### Current architecture

The `createProtectedRoute` middleware is the most important piece of engineering in the API layer. It creates a **declarative security model**:

```js
createProtectedRoute(handler, {
  policy: permissions.canAccessReceipt,
  resourceLoader: loadPaymentById,
  isPublic: false,
  internalServiceOnly: false
})
```

This single call handles: CORS preflight → internal key validation → authentication → rate limiting → resource pre-loading → authorization policy evaluation → request correlation. The handler never runs security logic directly.

**What makes this mature:**

1. **Resource pre-loading before authorization**: The `resourceLoader` fetches the DB record, then the policy evaluates ownership. This prevents TOCTOU (time-of-check-time-of-use) issues — you can't request `/receipts/123` and have the record change between the auth check and the handler fetch.

2. **Policy functions receive both session and resource**: `canAccessReceipt(session, payment)` can check both role AND ownership (`payment.studentId === session.userId`). This is attribute-based access control (ABAC) layered on top of RBAC.

3. **Rate limiting is atomic and per-identity**: Sliding window, 15s window, 10 burst limit, keyed by userId-or-IP. It's at the middleware layer, not the application layer, so it applies consistently.

4. **Request correlation**: Every request gets a `requestId` UUID at entry. This means when an error surfaces in logs, you can correlate it across the API layer, PDF service callbacks, and email delivery.

### reCAPTCHA integration signal

The enquiry endpoint does synchronous reCAPTCHA verification before touching the database. This is correct — you don't want to waste a DB write on a bot submission. The dev mode bypass (`NODE_ENV !== 'production'`) is also correctly placed.

### Defensive signal: non-blocking email

```js
sendAdminEnquiryNotification(enquiry)  // fire and forget
sendUserConfirmation(enquiry)          // fire and forget
```

Email delivery is not awaited. If Resend is down, the lead is still captured. This is the correct operational decision — your lead pipeline's success rate should not be coupled to your email provider's uptime.

### What still looks junior here

The `PDF_SERVICE_API_KEY` in `.env` is `skillyards-secret-123`. This is clearly a placeholder, but in production this should be a cryptographically random 256-bit key, rotated periodically, and ideally verified with HMAC rather than plain string comparison. The current implementation does validate it via `x-internal-key` header matching, which is correct pattern — just weak key material.

---

## 3. ASYNC PDF SYSTEM

This is the strongest backend engineering story in the project.

### What problem it solves

A student pays money. They need a receipt. The receipt is a styled PDF with logo, stamp image, installment breakdown table, base64-encoded fonts. Generating this requires a headless browser.

### Why naive (synchronous) implementation fails

Headless Chromium startup time: **300–800ms cold, 50–150ms warm**. PDF render time for a full-styled HTML page: **500ms–2s**. Total synchronous latency: **800ms–3s per request**.

More critically: in a serverless environment (Vercel), you have a **60-second hard timeout** and **no persistent process state**. Puppeteer requires a persistent browser instance — you can't start and teardown Chromium per-request at scale. Memory per Chromium instance: **~150–300MB**. Vercel function memory limit: **1GB shared**. Under concurrent load, synchronous PDF generation would exhaust memory and cause cascading timeouts.

There's also a reliability problem: if PDF generation fails mid-request, the user sees a 500 error and retries, potentially triggering duplicate payments or duplicate PDFs.

### Current architecture — the async state machine

The payment record has a `receiptStatus` field that acts as a state machine:

```
pending → generating → ready
                  ↘ failed
```

The `GET /receipt?format=pdf` endpoint implements a poll-based async pattern:

```
GET /receipt/123?format=pdf
├─ status="ready"                    → stream from R2 (terminal state, zero latency)
├─ status="generating", age < 60s   → 202 Accepted, Retry-After: 3
├─ status="generating", age > 60s   → STALE LOCK: reset to pending, trigger new job
├─ status="pending"                 → atomic claim with random jobId, fire-and-forget to PDF service
└─ Return 202 Accepted with Retry-After header
```

**The stale lock recovery is the most operationally mature piece**: if the PDF service crashes mid-generation, the payment record stays in `generating` state forever. Without the 60-second timeout reset, that payment would never get a PDF. This is correct failure recovery thinking.

**The atomic claim with `jobId`** prevents double-generation under concurrent requests. If two admin users simultaneously request the same payment's PDF, only one claim wins. The other sees `generating` and gets a 202.

### PDF service design — the idempotency layer

The PDF service has two idempotency mechanisms:

1. **In-memory deduplication**: `activeJobs` Map. If a jobId is already processing, reject the new request immediately. This prevents the PDF service itself from being hammered.

2. **R2 existence check**: Before generating, `checkReceiptExists(key)`. If the PDF already exists in R2, skip generation and callback immediately. This handles the case where the PDF service processed a job, successfully uploaded to R2, but the callback to the API timed out — so the API thinks the job failed, but the PDF is actually there.

### Callback with exponential backoff

```
Upload to R2 → callback API (retry 3x with backoff)
```

The 3-retry callback with exponential backoff handles transient API unavailability. If the API is deploying at the moment the PDF finishes, the callback will succeed on the second or third attempt.

### Storage abstraction decision

Using Cloudflare R2 instead of S3 directly. **Why this matters operationally**: R2 has zero egress fees. When a student downloads their receipt, you're not paying per-GB transfer costs. For a document storage use case with potentially thousands of downloads per day, this is a meaningful operational cost decision.

The `upload.js` uses the AWS SDK's S3-compatible client pointed at R2's endpoint. This means migration to actual S3 or any S3-compatible storage (MinIO, Wasabi) is a one-line endpoint change. The PDF service has no awareness of which object store it's using — just a key, a buffer, and a URL.

### What's missing (honest assessment)

There is **no persistent job queue**. The `activeJobs` Map is in-memory in the PDF service process. If the PDF service restarts (Railway redeploy, OOM kill), all in-progress jobs are lost. The API has stale lock recovery after 60 seconds, so jobs will eventually be re-triggered, but there's a 60-second dead zone. For V1 this is acceptable. For V2, a Redis-backed queue (BullMQ) or a database-backed jobs table would make this production-grade.

### Interview story

> "We built an async PDF generation pipeline using a state machine on the payment record. The naive approach — synchronous Puppeteer in a serverless request — would have failed due to memory constraints and cold-start latency. We separated the concern into a dedicated Express microservice on Railway, connected through an internal key-authenticated callback system. The critical engineering challenge was stale lock recovery: if the PDF service crashes mid-generation, we reset stale locks after 60 seconds and allow re-triggering. We also implemented two layers of idempotency — in-memory job deduplication in the service and R2 existence checks before generation — to prevent duplicate PDFs under retry conditions."

---

## 4. DATABASE + DATA FLOW

### Schema design signals

The `payments` table has these receipt-tracking fields:

```
receiptStatus:      pending | generating | ready | failed
receiptVersion:     integer
receiptNumber:      SY-{YEAR}-{SEQ}
receiptJobId:       uuid  (atomic lock token)
receiptRequestedAt: timestamp
```

This is **not a naive add-column-when-needed schema**. It's designed with the async state machine in mind from the start. The `receiptJobId` column serves a specific purpose: it's the atomic lock token. `claimPaymentForGeneration()` does a CAS update — "set jobId to X only if jobId is currently null." This prevents race conditions without database-level locks.

The `pdfFailures` table is also a signal — it's a dedicated failure audit log, not just a status flag on the payment record. This means you can query "all PDF failures in the last 24 hours" independently of payment data, which is the right operational separation.

### Payment allocation design

```
payments → payment_allocations → installments
```

This three-table design for payment-to-installment mapping is correct. A single payment can be partially allocated across multiple installments (e.g., a ₹5000 payment covers ₹3000 of installment 2 and ₹2000 of installment 3). The `payment_allocations` junction table captures the split. The FIFO allocation logic processes installments in order, which is the natural business expectation.

### Self-referencing plans table

```
plans → previousPlan (self-reference)
```

This tracks plan history — when a student's payment plan is restructured (e.g., converted from full to EMI), the old plan is preserved and linked. This is important for audit trails and financial reconciliation.

### Neon serverless implications

Neon provides serverless PostgreSQL with connection pooling built in. The connection URL uses the pooler endpoint. This is correct — in a serverless/edge environment, you'd otherwise exhaust PostgreSQL's connection limit (default 100) under concurrent load because each function invocation opens a new connection.

The tradeoff: Neon is a managed service with potential cold-start latency on the database side (branch resume). For a non-high-traffic system, this is fine. At scale, you'd want Supabase's pgBouncer or self-managed PgBouncer.

---

## 5. SEO SYSTEM — as Engineering Infrastructure

### What problem it solves

At scale, a content-heavy website has dozens of page types: blog posts, course pages, landing pages, city-specific pages, assessment pages. Each has different metadata requirements. Without a structured system, you get:

- Missing OG images on some pages but not others
- Inconsistent `canonical` URL generation (trailing slashes, www vs non-www)
- Schema.org JSON-LD that's slightly wrong on some pages (which tanks rich result eligibility)
- Developers copy-pasting metadata blocks and drifting from the canonical template

### Current architecture

A shared SEO package with:

- Type-safe metadata schemas (Zod-validated)
- Factory functions for page-type-specific metadata objects
- Centralized canonical URL generation
- Schema.org structured data generators (Organization, Article, BreadcrumbList)
- Fallback chain for missing fields

### Why this is systems thinking, not marketing work

The SEO package is **the same pattern as an i18n library or a feature flag system** — it's configuration management for structured metadata. It enforces a contract: every page that uses the SEO engine produces valid, consistent metadata. New pages "inherit" the base configuration and override only what's unique. This is maintainability engineering, not SEO optimization.

---

## 6. CMS + CONTENT ARCHITECTURE

### Decoupled architecture signal

Sanity is running as a headless CMS in `apps/cms`. The public website fetches content via Sanity's CDN APIs (GROQ queries). This means:

- Content editors can publish without touching the codebase
- The website can be built statically (ISR/SSG) and revalidated on content change via Sanity webhooks
- The CMS is operationally independent — a Sanity outage doesn't take down the website if content is cached

### Engineering implication

TOC generation server-side (extracting headings from Portable Text blocks to generate anchor IDs) is a signal of production thinking — you're computing this at build/request time rather than doing fragile client-side DOM scraping.

---

## 7. RELIABILITY + PRODUCTION THINKING

What makes this look more mature than a typical CRUD portfolio app:

### 1. Failure isolation by design

The enquiry system's non-blocking email delivery means the email provider is outside the success path. The PDF service's callback retry logic means a transient API downtime doesn't lose a PDF job. These aren't accidents — they're explicit failure isolation decisions.

### 2. State machine over boolean flags

`receiptStatus: pending | generating | ready | failed` instead of `isPdfGenerated: boolean`. State machines force you to think about all states and transitions, including failure states and recovery paths. A boolean can't represent "generating but stale."

### 3. Atomic operations on critical paths

`claimPaymentForGeneration()` is a CAS operation. `getNextReceiptNumber()` is a sequence-based atomic increment. These prevent duplicate receipt numbers and duplicate PDF generation under concurrent load.

### 4. Audit trail thinking

- Separate `pdfFailures` table
- Receipt number format `SY-{YEAR}-{SEQ}` that's human-readable and year-scoped
- Questions stored as JSONB snapshots in test sessions (prevents retroactive answer tampering)

### 5. Internal service authentication

The PDF service callback uses `x-internal-key` header validation. This is a service mesh primitive — service-to-service calls are authenticated separately from user-facing calls. It prevents the callback endpoint from being called by anyone with the API URL.

### 6. CORS whitelist with explicit origins

Not `Access-Control-Allow-Origin: *`. An explicit allowlist with Vercel preview deployment patterns included (for staging environments). This is operational maturity — you've thought about the dev/staging/prod origin split.

---

## 8. INTERVIEW STORIES

### Story 1: The PDF Generation Problem

**Symptom**: Initial design would have had PDF generation synchronously in the request lifecycle.

**Root Cause Analysis**: Puppeteer requires a persistent browser process (150–300MB RAM), warm-up time of 300–800ms, and render time of 500ms–2s. In a serverless environment, this causes timeout failures under load and memory exhaustion under concurrency.

**Solution**: Async state machine on the payment record, dedicated Express microservice on Railway with persistent browser pool, fire-and-forget trigger from API, callback-based completion.

**Tradeoff**: Client must poll for PDF readiness (202 Accepted pattern) rather than receiving the PDF synchronously. This is the correct tradeoff — it means the API response time is O(1) regardless of PDF generation time, and PDF generation failures don't surface as user-facing errors.

**Follow-up to raise in interviews**: "How would you add a persistent queue here?" Answer: BullMQ with Redis, a jobs table in PostgreSQL, or SQS — depends on operational complexity budget.

---

### Story 2: Preventing Duplicate PDF Generation

**Symptom**: Under concurrent admin access, two users requesting the same receipt simultaneously could trigger two Puppeteer instances generating the same PDF, wasting resources and potentially creating race conditions on the R2 upload.

**Root Cause**: No atomic ownership mechanism on the generation job.

**Solution**: `receiptJobId` column + CAS update in `claimPaymentForGeneration()`. Only the first requester wins the claim. The PDF service also has in-memory `activeJobs` Map deduplication as a second layer.

**Tradeoff accepted**: In-memory deduplication is lost on process restart. Acceptable for V1 — stale lock recovery handles it within 60 seconds.

---

### Story 3: The Stale Lock Problem

**Symptom**: If PDF service crashes mid-generation, payment record stays in `generating` state permanently. The receipt can never be generated again without manual database intervention.

**Root Cause**: Distributed system partial failure — the service died after claiming the job but before completing it.

**Solution**: Stale lock detection: if `receiptStatus=generating` and `receiptRequestedAt > 60 seconds ago`, reset to `pending` and re-trigger.

**Signal**: This demonstrates understanding of distributed system failure modes — the difference between "the operation is running" and "the operation completed."

---

### Story 4: Payment Allocation Under Business Logic Constraints

**Symptom**: A student making a ₹5000 payment when they owe ₹3000 on installment 2 and ₹4000 on installment 3 — how do you handle the split correctly?

**Root Cause**: Naive implementations either under-allocate (only pay installment 2 partially) or over-allocate (mark installment 3 fully paid incorrectly).

**Solution**: `payment_allocations` junction table with FIFO processing. Each allocation record tracks exactly how much of each payment was applied to each installment. Installment status recalculated from total allocated vs total due. Ledger tracks unallocated credit.

**Tradeoff**: Three-table join required for full payment view. Acceptable — this is a financial system where correctness > query simplicity.

---

## 9. RESUME POSITIONING

Rewritten bullets positioned for backend/platform engineering roles:

- **Architected async PDF receipt generation pipeline** using a distributed state machine pattern across API, dedicated Puppeteer microservice (Railway), and Cloudflare R2 storage — decoupling generation latency from request lifecycle, implementing two-layer idempotency (in-memory dedup + object store existence checks), and atomic CAS-based job claiming to prevent duplicate generation under concurrent load.

- **Designed and implemented multi-layer API security architecture** with declarative RBAC middleware (role + resource ownership policies), sliding-window rate limiting, reCAPTCHA v3 integration, and internal service authentication (`x-internal-key`), applied consistently across 20+ API routes via a single `createProtectedRoute` abstraction.

- **Built FIFO payment allocation engine** with three-table relational model (payments → allocations → installments), automatic installment status transitions, atomic receipt number generation (year-scoped sequences), and ledger recalculation — handling partial payments, multi-installment splits, and overpayment credit tracking.

- **Designed monorepo architecture** with Turborepo + shared `packages/db` layer as the single source of truth for Drizzle ORM schema — ensuring type-safe schema contracts across web, admin ERP, API, and PDF microservice deployments; isolating PDF generation as a separate long-running Express service to avoid serverless execution model constraints.

- **Implemented decoupled content architecture** using Sanity headless CMS with server-side GROQ queries, ISR revalidation, and server-computed TOC anchor generation — separating editorial workflow from deployment pipeline.

- **Built assessment system with JSONB snapshot isolation** — storing question snapshots (including correct answers) at session creation to prevent retroactive answer tampering, with time-limit enforcement, automatic session resumption, and threshold-based certificate generation via async PDF delivery.

---

## 10. ENGINEERING SIGNAL ANALYSIS

### What signals strong engineering maturity

| Signal | Why it matters |
|---|---|
| State machine on `receiptStatus` | Forces reasoning about all transitions including failure and recovery |
| CAS operations for job claiming | You understand race conditions in concurrent systems |
| Stale lock recovery after 60s | You understand distributed partial failure modes |
| Non-blocking email delivery | You understand failure isolation across service boundaries |
| JSONB snapshots for test sessions | You understand audit trail and immutability requirements |
| Shared `packages/db` as contract layer | You understand dependency ownership at the organizational level |
| PDF service isolated from serverless | You understand infrastructure execution model constraints |
| `payment_allocations` junction table | You don't shortcut financial data models |
| R2 over S3 for egress cost | You think about operational costs, not just implementation costs |

### What still looks junior (honest)

1. **No persistent job queue**: The in-memory `activeJobs` Map is the weakest point architecturally. BullMQ + Redis or a DB-backed jobs table would make this bulletproof.
2. **Weak internal API key**: `skillyards-secret-123` — correct pattern, wrong key material.
3. **No circuit breaker** on external service calls (Resend, PDFShift, reCAPTCHA). If reCAPTCHA degrades, every public form submission blocks.
4. **No distributed tracing**: `requestId` is generated but not propagated to the PDF service or email service. Full correlation across service boundaries requires passing it as a header.
5. **Offset pagination**: Doesn't scale past ~100k rows. Cursor-based pagination would be the upgrade.

### What impresses startups/product companies

The async PDF pipeline. The payment allocation logic. The RBAC middleware abstraction. These show you've solved non-trivial problems that every product eventually hits.

### What impresses backend/infrastructure interviewers

The stale lock recovery. The CAS-based job claiming. The storage abstraction (AWS SDK pointed at R2). The stateful browser instance management in the PDF service. These show distributed systems thinking.

### What should be emphasized more publicly

The async pipeline end-to-end — most developers would have just done synchronous Puppeteer and called it done. The fact that you separated the concern, designed the state machine, implemented idempotency layers, and built failure recovery is a **senior backend engineering decision**, not a fullstack one. Lead with that in any backend or systems design conversation.

---

## Summary

This is not a portfolio project. This is a system with real operational constraints — financial data integrity, async reliability, service boundary security, and production failure recovery — that most junior and mid-level engineers would have implemented incorrectly the first time.

**Strongest story**: Async PDF pipeline (state machine + idempotency + stale lock recovery)

**Second strongest**: Payment allocation engine (FIFO, junction table, ledger recalculation)

Lead with those two in any backend or systems design conversation.
