# SPEC-1 — Background and Requirements

**Status:** Architecture baseline confirmed; implementation details must be verified against the current repository before coding.  
**Product:** Skillyards Sales CRM  
**Proposed URL:** `https://crm.skillyards.in`  
**Repository:** `/home/chakresh/Skillyards`

## 1. Background

Skillyards needs a Sales CRM to manage the journey from website enquiry through lead assignment, sales follow-ups, counselling, admission initiation, and full enrolment.

The existing repository already contains useful infrastructure: authentication, a PostgreSQL database, enquiry intake, counselling sessions, call/follow-up records, EOD reports, student management, payment workflows, and notification integrations. The CRM should extend these capabilities rather than duplicate them.

The CRM is a new sales-facing application, not a replacement for the existing admin portal or student/payment workflows. It will have its own frontend and CRM session while reusing the existing identity system, API, database package, and authoritative business workflows.

### 1.1 Existing components and intended treatment

| Component | Existing implementation identified during repository discovery | CRM approach |
|---|---|---|
| Admin | `apps/admin`, Next.js | Retain for system-wide administration |
| CRM frontend | Not currently established | Add `apps/crm`, deployed at `crm.skillyards.in` |
| API | `apps/api`, Next.js Route Handlers | Add CRM modules; do not create a separate backend |
| Database | `packages/db`, Drizzle, Neon PostgreSQL | Extend existing schema with compatibility-safe migrations |
| Enquiries | `enquiries` | Preserve as original intake/submission records |
| Canonical leads | No dedicated CRM lead model identified | Introduce `leads`; allow multiple enquiries per lead |
| Calls/follow-ups | `follow_ups` | Inspect current semantics and consumers; extend or normalize only after verification |
| Call analysis | `call_analyses` | Retain compatible integration; AI output must not automatically change authoritative lead status |
| Counselling | `counselling_sessions` | Add lead linkage and auditable rescheduling history |
| EOD | `eod_reports` | Extend existing reporting and preserve compatibility |
| Students/payments | Existing tables and workflows | Reuse authoritative workflows; student creation must not implicitly create a payment |
| Authentication | `users` and JWT-based authentication | Reuse identity, introduce CRM-specific sessions and centralized revocation |
| Background processing | Existing scheduled and worker processes | Add a dedicated durable CRM worker for critical asynchronous jobs |

These are repository-discovery findings, not a substitute for inspecting the current branch, migrations, actual constraints, and API consumers before implementation.

### 1.2 Architectural principles

1. Maintain one canonical CRM lead per represented sales prospect, while preserving every enquiry submission as its own record.
2. Reuse existing student, payment, identity, counselling, and EOD workflows wherever they are authoritative.
3. Route all CRM data access through `apps/api`; the CRM frontend must never connect directly to PostgreSQL.
4. Enforce least-privilege authorization in API services and database queries, not only in the frontend.
5. Use `users.id` for new CRM ownership and actor references. Keep legacy `employees` until its dependencies are inventoried and safely migrated.
6. Audit sensitive changes, including ownership transfers, duplicate decisions, lead merges, access grants, conversion, EOD corrections, and configuration changes.
7. Make critical asynchronous work durable, idempotent, observable, and recoverable after worker restarts.
8. Preserve backward compatibility for existing applications and public website enquiry intake.
9. Deliver in phases; defer telephony and AI enhancements until the core CRM workflows are reliable.
10. Store event timestamps in UTC using timezone-aware database types; render times in the configured business or employee timezone.
11. Preserve original enquiry input and attribution; normalized values are matching aids, not replacements for submitted data.
12. Treat lead lifecycle, admission initiation, and full enrolment as distinct concepts.

## 2. Scope

### 2.1 In scope

- Dedicated CRM frontend and deployment.
- CRM session establishment and revocation using the existing identity system.
- CRM roles, team membership history, resource-level access, and temporary grants.
- Canonical leads and association of multiple enquiry submissions.
- Intake idempotency, duplicate candidate detection, review, and audited resolution.
- Manual and automated assignment with workload/capacity controls.
- Structured call logs and follow-up tasks, using existing data where appropriate.
- Counselling sessions linked to leads and auditable rescheduling.
- Server-side EOD target calculations, snapshots, submission locks, and manager amendments.
- In-app/email notifications backed by a transactional outbox and durable worker.
- Idempotent lead-to-student conversion and separate admission milestones.
- Audit, retention controls, operational monitoring, and automated tests.

### 2.2 Out of scope for the initial MVP

- Replacing the existing admin portal or identity provider.
- Replacing student, admissions, fee, or payment workflows.
- Automatically creating payments or fee plans during lead conversion.
- Automatically changing authoritative lead status from AI-generated summaries.
- Building a custom telephony platform.
- WhatsApp/SMS delivery before a provider adapter, consent rules, and operational requirements are agreed.
- Advanced analytics beyond the operational metrics needed to run and validate the MVP.

## 3. Requirements and acceptance criteria

Requirements use MoSCoW prioritization. “Must” means required for the stated phase; “Should” means valuable but may follow the core MVP; “Could” means optional or later capability. Acceptance criteria describe observable behavior and should become automated tests where practical.

### 3.1 Must have — Phase 1: Core CRM

#### REQ-001 — Dedicated CRM frontend
Create `apps/crm`, independently deployable at `https://crm.skillyards.in`.

**Acceptance criteria**
- CRM users can sign in through the approved CRM session flow.
- CRM screens use API endpoints for data access; no database credentials or direct database connections are shipped to the browser.
- Existing `apps/admin` and `apps/website` continue to work.
- Required production and local development origins are explicitly configured.

#### REQ-002 — Extend the existing API
Implement CRM API modules inside `apps/api`; do not create a separate CRM backend.

**Acceptance criteria**
- CRM endpoints use the repository's established routing, validation, error, logging, and authentication conventions where compatible.
- CRM business logic is separated into testable service/repository boundaries consistent with existing patterns.
- Existing API contracts remain compatible unless a separately reviewed migration explicitly changes them.

#### REQ-003 — Canonical lead model
Keep `enquiries` as submission records and introduce `leads` as canonical CRM records.

**Acceptance criteria**
- One lead can be associated with multiple enquiries.
- An enquiry belongs to at most one lead at a time.
- Original enquiry values and timestamps remain available.
- No lead is silently created twice because the same intake request is retried.

#### REQ-004 — Attribution preservation
Preserve enquiry-level source, campaign, programme, and other attribution fields already captured or approved for collection.

**Acceptance criteria**
- Original attribution remains attached to each enquiry after association or lead merge.
- First-touch, last-touch, and conversion attribution are calculated from retained enquiry data according to a documented rule.
- Missing attribution is represented explicitly; it is not fabricated.

#### REQ-005 — Duplicate detection and review
Detect likely duplicates without using phone-only or email-only matches as sufficient grounds for automatic association.

**Acceptance criteria**
- Exact normalized phone and email matches without identity conflict may be automatically associated under a configurable policy.
- Phone-only matches, email-only matches, and conflicting identity details create review cases.
- High-risk unresolved duplicate cases block conversion.
- Review resolution records actor, time, reason, decision, and affected lead/enquiry.
- Merge or association does not physically delete a lead or its history.

#### REQ-006 — Assignment strategies
Support manual assignment, round-robin, workload-aware, and least-recently-assigned strategies.

**Acceptance criteria**
- Rules are evaluated by ascending numeric priority; the first matching rule is used unless its configured fallback says otherwise.
- Inactive or capacity-ineligible users receive no new automatic assignment.
- Concurrent assignments cannot exceed configured capacity.
- Unassignable leads enter the configured queue or fallback route, with an observable reason.
- Assignment and transfer history is recorded.

#### REQ-007 — CRM roles and teams
Support CRM-specific roles and historical team memberships independently of the existing platform role field.

Initial CRM roles: `bda`, `counsellor`, `sales_lead`, `sales_manager`.

**Acceptance criteria**
- A user may hold multiple CRM roles.
- A user has no more than one active sales-team membership at a time, while historical memberships remain queryable.
- Effective permissions are derived server-side from role, permission, resource scope, and explicit grants.
- Platform roles are not overwritten merely to grant CRM access.

#### REQ-008 — BDA lead visibility
BDAs see their own assigned leads unless explicitly granted additional access.

**Acceptance criteria**
- List, detail, search, history, export, and mutation endpoints apply server-side authorization.
- A BDA cannot access another user's lead by guessing an identifier or changing a client-side filter.
- Temporary grants provide scoped access without changing lead ownership.

#### REQ-009 — Assignment and team history
Retain team membership, lead ownership, and transfer history.

**Acceptance criteria**
- Each ownership change records previous and new owner/team, actor, reason, assignment method, timestamp, and approval where applicable.
- Ended team memberships are not deleted.
- Existing lead ownership remains unchanged by default when a user becomes inactive; reassignment follows explicit policy.

#### REQ-010 — Audit and temporary access
Audit sensitive actions and support temporary, revocable access grants.

**Acceptance criteria**
- Grants include grantor, recipient, resource, reason, start time, optional expiry, and revocation time.
- Expired/revoked grants stop authorizing subsequent API requests.
- Audit events exclude passwords, tokens, secrets, and unnecessary personal data.
- Normal application roles cannot edit or delete historical audit events.

#### REQ-011 — Backward compatibility
Preserve existing applications and business workflows.

**Acceptance criteria**
- Website enquiry intake remains operational throughout rollout.
- Existing admin, student, payment, counselling, and EOD workflows pass regression tests.
- New schema changes are additive and compatibility-safe before old paths are removed.
- `employees` is not dropped until all dependencies, including legacy integrations, are verified and migrated.

### 3.2 Must have — Phase 2: Sales operations

#### REQ-012 — Structured call logs
Support manual call logging linked to a canonical lead.

**Acceptance criteria**
- Capture lead, employee/user, timestamp, duration, outcome, notes, and linked follow-up where applicable.
- Retain call-attempt history.
- Configurable outcomes initially include `connected`, `no_answer`, `busy`, `invalid_number`, `callback_requested`, and `not_interested`.
- Existing `follow_ups` and `call_analyses` are inspected before deciding whether to extend or normalize them.
- AI analysis does not directly mutate authoritative lead lifecycle state.

#### REQ-013 — Callback creation
A `callback_requested` outcome creates a follow-up only when callback date and time are supplied.

**Acceptance criteria**
- Missing callback date or time returns a validation error and does not partially create a call/follow-up operation.
- Call log, follow-up, and idempotency record are committed atomically where they share the database.
- Retrying the same idempotency key does not create duplicate call or follow-up records.

#### REQ-014 — Prioritized follow-up queue
Provide a queue ordered by overdue, due today, high-priority callbacks, and upcoming tasks.

**Acceptance criteria**
- Overdue status is computed from `due_at` and the applicable timezone, not treated as a permanently stored truth.
- Queue queries are permission-filtered and paginated.
- Open follow-up ownership is retained by default during lead transfer; the configured transfer policy determines whether open tasks move.
- Completed follow-ups are never reassigned.

#### REQ-015 — Counselling sessions
Support multiple counselling sessions per lead and auditable rescheduling.

**Acceptance criteria**
- Existing `counselling_sessions` are extended compatibly with lead linkage.
- Rescheduling retains the same session ID.
- History records old/new date, actor, reason, and timestamp.
- Supported states include `scheduled`, `completed`, `cancelled`, and `no_show`, adapted to the existing schema where necessary.
- Only completed sessions count toward EOD target adjustments.

#### REQ-016 — Server-side EOD target calculations
Centralize EOD target calculations in the API.

Documented initial defaults:

```text
dialTarget = max(0, 120 - completedCounsellingSessions * 15)
connectTarget = max(30, 50 - completedCounsellingSessions * 5)
talkTimeTargetMinutes = 90
```

**Acceptance criteria**
- The API is the authoritative calculator; the browser cannot submit arbitrary target values as authoritative.
- Baselines, adjustment amounts, and floors are configurable and validated.
- The report stores the applied target snapshot so later configuration changes do not rewrite historical targets.
- Only completed counselling sessions within the defined reporting period affect calculations.

#### REQ-017 — EOD submission and correction
Lock submitted EOD reports and require authorized manager reopening/amendment.

**Acceptance criteria**
- Submitted reports cannot be silently overwritten by employees.
- Manager corrections require authorization and a reason.
- Original and amended values, actor, and timestamps are preserved in immutable revision history.
- Existing `eod_reports` uniqueness and behavior remain compatible.
- The exact reporting-day/timezone rule is configurable and documented before rollout.

#### REQ-018 — Durable notifications
Support in-app and email notifications with retryable delivery.

**Acceptance criteria**
- Business changes and outbox events are written in the same transaction.
- Delivery attempts and outcomes are recorded.
- Transient failures retry with bounded exponential backoff; terminal failures become observable.
- In-app notifications are idempotent. Email delivery is not described as exactly-once unless the provider contract proves it.
- Preferences, consent, recipient authorization, and sensitive-data minimization are respected.

#### REQ-019 — Dedicated worker
Add a persistent worker application in the monorepo for critical asynchronous work.

**Acceptance criteria**
- Critical jobs survive worker restarts because pending work is stored durably.
- Job claiming uses leases or equivalent concurrency-safe coordination.
- Retries are bounded; dead-letter/terminal failures are visible and can be operationally reconciled.
- Job handlers are idempotent or otherwise safe against retry.
- Worker and API job payloads are versioned where compatibility requires it.

### 3.3 Must have — Phase 3: Admissions and governance

#### REQ-020 — Separate admission milestones
Track `admission_initiated` separately from `fully_enrolled`.

**Acceptance criteria**
- `admission_initiated` means a student record was successfully created or reliably linked to the lead.
- `fully_enrolled` is set only by the authoritative admissions workflow after its approved criteria are met.
- Student creation or payment alone does not imply full enrolment.
- Admissions must confirm the authoritative full-enrolment criteria before implementation.

#### REQ-021 — Idempotent conversion
Repeated conversion requests must not create duplicate students or conversion records.

**Acceptance criteria**
- Conversion requires an idempotency key with a documented uniqueness scope.
- Concurrent requests for the same lead cannot create multiple students.
- A retry returns the existing operation/result or a stable in-progress response.
- Partial failures are reconciled without creating duplicate business entities.

#### REQ-022 — Existing-student matching
Use conservative matching before creating a student.

**Acceptance criteria**
- A reliable, non-conflicting match can be linked according to the approved policy.
- Uncertain or conflicting matches require manual review.
- Matching evidence and resolution are auditable.
- Phone-only matching is not treated as sufficient proof of identity.

#### REQ-023 — No implicit payment creation
Creating or linking a student during conversion must not automatically create a payment, fee plan, or charge.

**Acceptance criteria**
- Conversion invokes only the approved student/admissions workflow.
- Payment creation occurs only through its existing authorized workflow.
- Integration tests verify that conversion retries do not create payment side effects.

#### REQ-024 — Transfers, escalation, and retention
Support restricted transfers, overdue escalation, and configurable retention.

**Acceptance criteria**
- Cross-team transfers require the configured approval.
- Escalation thresholds are configurable and audited.
- Retention rules support record categories, archival or approved deletion/anonymization, and legal holds.
- Financial, admissions, audit, backup, and provider retention constraints are reviewed before enabling deletion.

#### REQ-025 — Protect history and destructive operations
Preserve business history and prevent unauthorized destructive operations.

**Acceptance criteria**
- Lead merges preserve source identity and history; merged records are not physically deleted as a normal merge operation.
- Sensitive delete/archive/anonymize operations require explicit permission and audit.
- Foreign-key and retention behavior is reviewed to avoid cascading deletion of business history.
- Recovery procedures exist for accidental merge or incorrect association.

### 3.4 Should have — Phase 4 and later

#### REQ-026 — Telephony adapter
Provide an integration boundary for future click-to-call and telephony webhooks.

**Acceptance criteria**
- Provider-specific behavior is isolated behind an adapter.
- Webhook authentication, replay protection, idempotency, and failure handling are documented before activation.
- Manual call logging remains usable if the provider is unavailable.

#### REQ-027 — Recording ingestion and AI summaries
Support future recording ingestion and AI-generated call summaries.

**Acceptance criteria**
- Recording access is permission-controlled and retention-aware.
- AI outputs are labeled as generated content and can be corrected by authorized users.
- AI output cannot automatically change authoritative lead status or admission milestones.
- Provider failures do not block core CRM operations.

#### REQ-028 — Advanced analytics
Add advanced reporting after reliable event and ownership data is available.

**Acceptance criteria**
- Metrics have documented definitions and time-window semantics.
- Reports enforce the same data visibility rules as operational endpoints.
- Aggregates can be reconciled against underlying source records.

#### REQ-029 — Future WhatsApp/SMS
Add additional notification channels through provider adapters.

**Acceptance criteria**
- Channel activation requires provider configuration, consent/policy review, delivery logging, and retry behavior.
- The in-app/email MVP does not depend on future channels.
- Secrets are stored outside source code and never returned by CRM settings APIs.

## 4. Must-have non-functional requirements

#### REQ-030 — API performance
Target normal CRM API latency of **p95 ≤ 500 ms** under an agreed representative load.

Acceptance: benchmark environment, dataset size, concurrency, and endpoint mix are documented. Measure latency separately for list/search, detail, and mutation operations.

#### REQ-031 — Assignment performance
Target assignment latency of **p95 ≤ 1 second** under agreed load.

Acceptance: include concurrent intake, capacity checks, rule evaluation, and database contention in load tests.

#### REQ-032 — Capacity correctness
Concurrent assignments must respect configured representative/team capacity.

Acceptance: concurrency tests demonstrate zero capacity violations; assignment failures/fallbacks are observable.

#### REQ-033 — Conversion correctness
Conversion retries and concurrent requests must not create duplicate students.

Acceptance: repeated and concurrent requests resolve to one conversion outcome or one reviewable conflict.

#### REQ-034 — Server-side authorization
Enforce permissions in API handlers/services and database queries.

Acceptance: automated tests cover list, detail, search, export, update, assignment, history, and worker-triggered actions; frontend-only filtering is never relied on.

#### REQ-035 — Durable jobs
Critical background work survives worker restarts.

Acceptance: stop a worker with pending and in-progress jobs, restart it, and verify jobs are resumed or safely retried without lost business events.

#### REQ-036 — Automated quality and security tests
Provide unit, integration, authorization, concurrency, idempotency, end-to-end, regression, security, and performance tests.

Acceptance: critical workflows run in CI; test setup and commands are documented; no production rollout proceeds with known critical authorization or data-integrity failures.

#### REQ-037 — Retention compliance
Retention must account for legal obligations, financial records, audit history, backups, and external providers.

Acceptance: record categories, retention owners, approved durations, legal holds, deletion/anonymization behavior, and backup expiry constraints are documented before automated deletion is enabled.

#### REQ-038 — Valid lifecycle transitions
Define allowed lead lifecycle transitions and require a reason for reopening `cold` or `lost` leads.

Acceptance:
- The API rejects invalid transitions with a stable conflict/validation error.
- Transition policy is enforced server-side.
- Actor, previous state, new state, reason where required, and timestamp are audited.
- Lifecycle state is separate from admission milestones.

#### REQ-039 — Intake idempotency distinct from duplicate detection
Protect intake against request retries without confusing retry detection with person matching.

Acceptance:
- Replaying the same intake idempotency key returns the original result and does not create another enquiry/lead association.
- A different submission from the same person proceeds through duplicate matching.
- Idempotency key scope, retention, and conflict behavior are documented.

#### REQ-040 — Concurrent record updates
Prevent silent lost updates for records that can be edited concurrently.

Acceptance:
- High-contention operations use transactions, row locks, or optimistic version checks as appropriate.
- Stale updates return a conflict response rather than silently overwriting newer values.
- Duplicate resolution, assignment, conversion, EOD amendment, and transfer are covered by concurrency tests.

#### REQ-041 — Preserve attribution history
Maintain attribution at the enquiry level through association and lead merge.

Acceptance:
- Original submission fields are immutable except through an explicitly audited correction workflow.
- Merge does not discard source/campaign/programme history.
- Attribution metric rules are documented and tested.

#### REQ-042 — Conversion gate for high-risk duplicates
Block conversion while a high-risk duplicate review remains unresolved.

Acceptance:
- The conversion service checks review state within its consistency boundary.
- A concurrent review creation/resolution cannot bypass the gate.
- The response identifies a review-required condition without exposing unauthorized candidate data.

#### REQ-043 — Authoritative full-enrolment event
Do not infer full enrolment from student creation, payment, or lead lifecycle state.

Acceptance:
- Only the approved admissions source can set or confirm `fully_enrolled`.
- Source event ID or equivalent idempotency evidence is stored.
- Duplicate or out-of-order events do not regress milestone state.

#### REQ-044 — Timezone-safe scheduling and reporting
Store new timestamps as timezone-aware UTC values and apply an explicit timezone for reporting-day boundaries and UI display.

Acceptance:
- API payloads use documented ISO-8601 timestamp semantics.
- Follow-up overdue calculations and EOD date boundaries use the configured timezone.
- Tests cover midnight boundaries and daylight-saving transitions where relevant to configured timezones.

#### REQ-045 — Controlled deletion and archival
Avoid destructive cascades that remove business history unexpectedly.

Acceptance:
- Foreign-key delete behavior is explicitly reviewed.
- Archive, anonymization, legal hold, and deletion are separate operations with separate permissions where needed.
- A dry-run/reconciliation report is available before bulk retention actions.

#### REQ-046 — CRM session security
Support session audience validation, centralized revocation, CSRF protection where cookie-based authentication requires it, and least-privilege cookie scope.

Acceptance:
- A token for another application is rejected by CRM endpoints unless an explicit validated exchange is used.
- Revoked or expired sessions are rejected on subsequent protected requests.
- Cookie attributes, CORS origins, CSRF behavior, and local-development origins are documented and tested.
- Behavior when revocation storage is unavailable is fail-closed for protected CRM requests.

#### REQ-047 — Authorization test matrix
Maintain automated tests for effective permissions and resource scope.

Acceptance:
- Tests cover every CRM role, multiple-role combinations, team scope, ownership, temporary grants, expiry, revocation, and unauthorized direct-ID access.
- List and detail endpoints produce consistent authorization outcomes.
- Background jobs use explicit service identities/permissions and do not bypass business authorization accidentally.

#### REQ-048 — Audit coverage
Define the minimum event set for sensitive CRM operations.

Acceptance:
- Audit lead lifecycle changes, assignment/transfer, duplicate decisions/merges, access grants, role/team changes, conversion/milestones, EOD corrections, retention actions, and sensitive configuration changes.
- Failed authorization attempts are logged according to the security logging policy without leaking secrets.
- Audit events include a correlation/request identifier where available.

#### REQ-049 — Audit integrity and data minimization
Protect audit records and avoid unnecessary personal data in snapshots.

Acceptance:
- Normal application code cannot update/delete audit history.
- Snapshots exclude credentials, session tokens, provider secrets, and unnecessary sensitive fields.
- Access to audit views is permission-controlled and itself auditable where required.
- Retention and backup policies explicitly cover audit records.

#### REQ-050 — Data minimization
Collect and expose only data required for sales operations and approved reporting.

Acceptance:
- Lead/enquiry fields are reviewed for purpose and access.
- Free-text notes and notification bodies do not unnecessarily expose sensitive information.
- Exports and logs follow the same privacy and access controls as the CRM UI.

#### REQ-051 — Search and pagination
Provide bounded, permission-filtered search and pagination.

Acceptance:
- List endpoints have a documented default and maximum page size.
- Search/filter fields are allow-listed and validated.
- Queries use appropriate indexes based on measured query plans.
- Pagination is deterministic; cursor pagination is preferred for large/changing datasets where appropriate.

#### REQ-052 — Accessibility and responsive UI
Make core CRM workflows usable on supported desktop and mobile viewport sizes and accessible to keyboard and assistive-technology users.

Acceptance:
- Core flows support keyboard navigation, visible focus, labeled controls, and accessible validation/error messages.
- Status is not communicated by color alone.
- A documented accessibility checklist is run before release.

#### REQ-053 — Observability
Provide structured logs, metrics, and correlation IDs across API requests and worker jobs.

Acceptance:
- Track API latency/error rate, assignment outcomes/capacity rejections, duplicate-review backlog, conversion failures, outbox/job backlog, retries, and notification delivery.
- Logs do not include secrets or unnecessary PII.
- Alerts are defined for sustained job backlog, repeated conversion failures, and critical error-rate increases.

#### REQ-054 — Operational recovery
Document recovery procedures for failed jobs, stuck leases, erroneous merges, failed conversions, and notification outages.

Acceptance:
- Authorized operators can inspect failure reason and retry/reconcile safely.
- Retry operations preserve idempotency.
- Recovery actions are audited.
- A production runbook identifies ownership and escalation.

#### REQ-055 — Migration reconciliation
Provide verifiable reconciliation for schema migrations and lead backfill.

Acceptance:
- Migration execution is recorded and repeat-safe where tooling permits.
- Backfill reports counts for source enquiries, created leads, associated enquiries, and review-required cases.
- Referential integrity and unexpected row-count differences are checked before enabling CRM intake.
- Ambiguous historical records are routed to review rather than automatically merged.

#### REQ-056 — Rollback and forward recovery
Document a safe recovery plan for each production migration/release.

Acceptance:
- The plan identifies whether rollback is safe or forward-fix is required.
- Destructive schema changes are deferred until all consumers are migrated.
- Release sequencing supports old and new application versions during the compatibility window.
- Backup/restore and recovery procedures are tested before high-risk changes.

#### REQ-057 — Configuration validation and versioning
Validate CRM configuration before it can affect live workflows.

Acceptance:
- Assignment conditions, capacity limits, target formulas, escalation thresholds, and retention settings use validated schemas and bounded values.
- Invalid configuration is rejected with actionable validation errors.
- Critical changes are audited and versioned.
- Changes apply prospectively by default unless an explicit policy states otherwise.

#### REQ-058 — Notification preferences and consent
Respect notification preferences and applicable consent requirements.

Acceptance:
- In-app and email preferences are stored and evaluated before dispatch, subject to required operational/security notices.
- Delivery attempts and opt-out/consent state are auditable.
- Sensitive lead data is minimized in email subject/body.
- Future SMS/WhatsApp channels remain disabled until their consent and provider requirements are implemented.

## 5. Clarifications required before the affected feature is implemented

These are deliberate open decisions. They should be resolved with the relevant business owner before the dependent feature is enabled.

| ID | Decision | Recommended starting assumption | Needed from |
|---|---|---|---|
| DEC-001 | What exactly qualifies as `fully_enrolled`? | Use an authoritative admissions status/event; do not infer from student creation or payment | Admissions owner |
| DEC-002 | Can the BDA owner and counsellor differ? | Yes; lead ownership and counselling assignment are separate relationships | Sales owner |
| DEC-003 | What counts toward representative capacity? | Count active assigned leads using a documented status set; exclude terminal `converted`/`lost` leads unless policy says otherwise | Sales manager |
| DEC-004 | What survives a lead merge? | Preserve the designated surviving lead ID; re-link associated history; retain source lead as a non-deletable merged record with redirect/reference | Sales owner and data owner |
| DEC-005 | Which timezone governs EOD and overdue work? | Store UTC; use a configured business timezone for reporting boundaries and user timezone for display where appropriate | Operations owner |
| DEC-006 | What are retention durations and legal-hold rules? | Do not enable automated deletion until policy and legal obligations are approved | Business/data owner |
| DEC-007 | What load defines the performance targets? | Establish baseline traffic and a representative test dataset before sign-off | Engineering owner |
| DEC-008 | What event marks a lead as `converted`? | Treat `converted` as a CRM lifecycle state tied to successful admission initiation; track `fully_enrolled` independently. Confirm this business definition before finalizing reports. | Sales and admissions owners |
| DEC-009 | Which existing `follow_ups` fields and consumers must remain compatible? | Inventory all readers/writers; choose extension versus normalization based on current semantics and compatibility | Engineering owner |
| DEC-010 | What is the session revocation availability policy? | Fail closed for protected CRM requests if revocation state cannot be checked | Security/engineering owner |

## 6. Acceptance scenarios for the end-to-end MVP

The following scenarios should be included in acceptance tests, with fixtures and exact expected state changes defined during implementation.

1. **New enquiry:** a new submission creates or links to a canonical lead, preserves attribution, and is processed once.
2. **Repeated intake request:** retrying the same idempotency key does not duplicate the enquiry, lead, or association.
3. **Ambiguous duplicate:** phone-only or conflicting identity evidence creates a review case; a high-risk unresolved case blocks conversion.
4. **Restricted access:** a BDA cannot view or mutate another BDA's lead without an active explicit grant.
5. **Concurrent assignment:** simultaneous assignment requests never exceed configured capacity and produce correct history.
6. **Callback:** `callback_requested` without date/time fails validation; with date/time it creates one call record and one follow-up even when retried.
7. **Counselling and EOD:** only completed sessions affect target adjustments; submitted reports require an authorized, reasoned amendment.
8. **Conversion retry:** concurrent/repeated conversion does not create duplicate students or payment records.
9. **Full enrolment:** student creation does not mark full enrolment; only the authoritative admissions event does.
10. **Worker restart:** pending jobs are resumed/retried without losing events or duplicating non-idempotent side effects.
11. **Retention safety:** dry-run output identifies candidate records; legal-held records are not deleted/anonymized.
12. **Regression:** existing website intake, admin, student, payment, counselling, and EOD workflows remain operational.

## 7. Dependencies and implementation gates

Do not enable production CRM workflows until these gates are satisfied:

- Actual schema, migrations, indexes, foreign keys, and API consumers have been inventoried on the target branch.
- Migration sequence collisions and the migration execution procedure are resolved.
- Authentication/session revocation and CORS/CSRF behavior are implemented and tested.
- Capacity semantics and assignment concurrency strategy are agreed.
- Admissions confirms the authoritative full-enrolment source and criteria.
- Existing call/follow-up semantics are verified before selecting the final table strategy.
- Automated test infrastructure exists and critical regression tests run in CI.
- Backfill reconciliation, rollback/forward-recovery, monitoring, and operational runbooks are prepared.

## 8. Success measures

Use baseline measurements before rollout and evaluate after each phase.

| Area | Initial target or measure |
|---|---|
| Normal API latency | p95 ≤ 500 ms under agreed representative load |
| Assignment latency | p95 ≤ 1 second under agreed representative load |
| API reliability | Error rate < 1% under expected load, excluding documented client validation errors where agreed |
| Assignment correctness | Zero confirmed capacity violations |
| Conversion correctness | Zero duplicate students from retries/concurrent requests |
| Authorization | Zero confirmed unauthorized lead data exposures |
| Durable processing | Zero lost critical jobs after worker restart |
| Intake quality | All duplicate/association decisions traceable to a policy or reviewer |
| Regression | All agreed critical existing workflows pass |
| Operations | Failed jobs and conversion reconciliation are visible and recoverable |

Targets are initial acceptance goals, not measured production results. Confirm the test load and baseline before treating performance numbers as release guarantees.

## 9. Need Professional Help in Developing Your Architecture?

Please contact me at [sammuti.com](https://sammuti.com) :)
