# SPEC-9 — Implementation Plan, Milestones, and Acceptance

**Status:** Proposed delivery plan  
**Repository:** `/home/chakresh/Skillyards`  
**Delivery model:** Incremental rollout with backward-compatible database/API changes  
**Related specifications:** `01-background-requirements-detailed.md` through `08-api-contracts-detailed.md`

> This plan is intended to be actionable by an implementation team. It identifies sequencing, dependencies, acceptance gates, and operational safeguards. Estimates are planning placeholders; the team should refine them after repository inventory and capacity assessment.

## 1. Delivery objectives

The CRM MVP is considered delivered when the team can:
- receive website enquiries and staff-created leads into a canonical lead model;
- preserve enquiry attribution and safely handle duplicate candidates;
- assign leads using authorized manual and rule-based routing;
- record calls, follow-ups, and counselling sessions;
- calculate and submit EOD reports using API-owned formulas;
- initiate conversion through the authoritative student/admissions workflow;
- track admission initiation and authoritative full enrolment separately;
- deliver in-app/email notifications through durable background processing;
- enforce CRM roles, record-level scope, audit history, and session revocation;
- deploy and operate the system with tests, monitoring, and documented recovery procedures.

## 2. Delivery principles

1. **Inventory before migration.** Find every reader/writer of affected tables, routes, callbacks, jobs, and reports.
2. **Additive changes first.** Prefer nullable columns, new tables, compatibility adapters, and backfills before destructive cleanup.
3. **Domain logic on the server.** The browser is a client, not an authority for permissions, targets, duplicate decisions, or conversion state.
4. **One source of truth per concept.** Leads are canonical CRM prospects; enquiries are submissions; admissions owns enrolment truth.
5. **Transactional integrity.** State changes, audit history, and outbox events commit together when they share a database.
6. **Durable asynchronous work.** In-memory queues are not sufficient for critical jobs.
7. **Test concurrency explicitly.** Assignment capacity, duplicate resolution, idempotency, and conversion must be tested across concurrent requests.
8. **Feature-flag risky cutovers.** New reads/writes and routing can be enabled gradually and rolled back without destructive data reversal.
9. **Preserve historical evidence.** Merges, reschedules, EOD amendments, transfers, and corrections are recorded, not erased.
10. **No silent scope expansion.** Telephony automation, AI-driven decisions, WhatsApp/SMS, and advanced analytics require explicit scope approval.

## 3. Workstream and dependency map

| Workstream | Depends on | Primary output |
|---|---|---|
| Repository discovery | None | Current-state inventory and migration map |
| Identity/RBAC | Discovery, auth design | CRM session, roles, permissions, revocation |
| Canonical data model | Discovery, identity IDs | Leads/enquiries, audit, team and assignment tables |
| Intake/duplicates | Canonical data model | Idempotent intake and review workflow |
| Assignment | Teams/membership, lead model | Rules, strategies, capacity-safe routing |
| Sales operations | Lead model, authorization | Calls, follow-ups, counselling, EOD |
| Durable worker/outbox | Schema and service setup | Reliable jobs, notifications, retries |
| Conversion | Lead model, admissions boundary | Idempotent conversion and milestones |
| CRM frontend | API contracts and auth | Role-scoped operational UI |
| Observability/release | All workstreams | Metrics, alerts, runbooks, rollout gates |

Parallelize only where interfaces are agreed. For example, frontend scaffolding may proceed while schema discovery continues, but forms should not encode unsettled business rules.

## 4. Phase 0 — Repository discovery and decisions

### Tasks

1. Inventory current repository structure, workspace scripts, TypeScript settings, lint/build commands, and deployment manifests.
2. Locate every use of `enquiries`, `follow_ups`, `call_analyses`, `counselling_sessions`, `eod_reports`, `eod_warnings`, `students`, `payments`, `plans`, `installments`, `batches`, `users`, and legacy `employees`.
3. Trace telephony GSM callback mapping and document its hardcoded employee-ID dependency.
4. Identify current authentication middleware, JWT claims, cookie settings, CORS rules, and every route that reads identity.
5. Map student/admission creation and identify the authoritative full-enrolment signal.
6. Inventory email, push, R2 recording, QStash, GitHub Actions, Railway, and existing scheduled jobs.
7. Record existing migration filenames, applied migration state, and sequence collisions.
8. Identify current UI/API contracts and add regression tests for critical existing workflows.
9. Decide unresolved business questions listed in the individual specifications.

### Deliverables

- Repository dependency map.
- Table/route/callback reader-writer inventory.
- Migration and rollback plan.
- Decision log with named owner and due date per unresolved decision.
- Baseline build/test/performance results.

### Exit gate

No destructive migration begins until all known readers/writers of affected tables are documented and the admissions source of truth is agreed.

## 5. Phase 1 — Foundation, identity, and canonical data

### Tasks

1. Create or finalize `apps/crm` workspace and deployment configuration.
2. Establish API route conventions, shared validation DTOs, error codes, and test helpers.
3. Implement CRM session lifecycle and centralized revocation while retaining existing identity integration.
4. Add CRM role assignments and permission checks; keep platform roles distinct from CRM roles.
5. Implement record-level query scoping and test cross-team access boundaries.
6. Add canonical `leads` table and enquiry-to-lead association.
7. Add contact normalization fields and indexes while preserving raw values.
8. Add team membership history, assignment history, audit tables, idempotency records, and duplicate-review schema.
9. Add outbox/job schema if required by the selected migration ordering.
10. Backfill only deterministic relationships; route ambiguous legacy records to reconciliation.
11. Add CORS support for `crm.skillyards.in` and the agreed local development origin.
12. Resolve migration sequence collisions and adopt a documented migration-generation/application process.

### Deliverables

- CRM can authenticate and authorize users.
- Canonical lead model exists without breaking website enquiry creation.
- Schema changes are backward-compatible and reproducible.
- CI can build/lint/type-check affected workspaces.

### Exit gate

- Migration runs from a clean database and from a representative existing database.
- Existing website intake and login regressions pass.
- Permission tests prove that a user cannot access unauthorized lead records.
- Rollback/forward-fix procedure is tested in staging.

## 6. Phase 2 — Intake, duplicate review, and assignment

### Tasks

1. Implement shared intake service for website and staff channels.
2. Add idempotency handling and canonical request hashing.
3. Implement deterministic phone/email normalization and candidate classification.
4. Add duplicate-review queue, claims, resolution, and explicit merge operations.
5. Block high-risk unresolved cases from conversion.
6. Implement assignment-rule schema, validated condition interpreter, rule versioning, and dry-run preview.
7. Implement manual assignment and automated strategies: workload-aware, round-robin, and least-recently-assigned.
8. Add eligibility rules for active users, team membership, availability, and capacity.
9. Add transaction-safe capacity reservation and persisted round-robin cursor.
10. Implement unassigned queue and configured fallback actions.
11. Add audit/outbox events for lead creation, review, assignment, transfer, and merge.
12. Run assignment in shadow mode against sample traffic before enabling automated ownership changes.

### Deliverables

- End-to-end intake flow.
- Duplicate-review operations UI/API.
- Auditable assignment and unassigned queue.
- Assignment preview and explainable decision traces.

### Exit gate

- Same-key retries do not create duplicates.
- One-sided contact matches do not auto-associate.
- Concurrent assignment never violates capacity.
- Cross-team and duplicate-review permissions are enforced.
- Shadow-mode routing decisions are reviewed by sales operations.

## 7. Phase 3 — Sales operations and EOD

### Tasks

1. Inventory and map existing `follow_ups` semantics.
2. Implement a distinct call-log representation or a documented compatibility layer.
3. Implement call creation and callback-task creation atomically.
4. Implement follow-up task states, queue filters, priority ordering, and timezone rules.
5. Add owner transfer policy and stale/inactive-owner manager queue.
6. Add lead linkage and history to counselling sessions.
7. Implement scheduling, rescheduling, completion, cancellation, and no-show transitions.
8. Move EOD target formulas from frontend to a shared server domain function.
9. Add target configuration snapshots and EOD report revision/amendment handling.
10. Add reminders and overdue escalation via outbox/worker.
11. Preserve telephony GSM callback compatibility throughout rollout.

### Deliverables

- Call history and follow-up queue.
- Counselling scheduling and history.
- Server-authoritative EOD preview/submission.
- Reminder/escalation events and operational metrics.

### Exit gate

- Callback retries create at most one task per intended callback.
- Completed follow-ups and sessions obey state-transition rules.
- Only completed counselling sessions count toward EOD under the approved attribution policy.
- Submitted EOD reports cannot be silently edited.
- Legacy telephony callbacks and existing reports pass regression tests.

## 8. Phase 4 — Conversion, notifications, and durable workers

### Tasks

1. Confirm authoritative admissions service/state and conversion cardinality.
2. Implement conversion idempotency and ambiguous-student review.
3. Ensure CRM conversion does not independently create payments, receipts, or installments.
4. Add authoritative full-enrolment event ingestion and duplicate/out-of-order handling.
5. Implement `apps/crm-worker` as a persistent deployment with health checks and graceful shutdown.
6. Implement transactional outbox dispatch, leases, retry/backoff, dead-lettering, and operator replay.
7. Add in-app notification storage/read state and Resend email adapter.
8. Migrate domain notifications to outbox delivery.
9. Replace the in-memory AI queue for required jobs with durable job records.
10. Add conversion and capacity reconciliation jobs.
11. Add retention jobs only after policy and legal-hold behavior are approved.

### Deliverables

- Durable conversion state machine.
- Worker/outbox pipeline.
- In-app/email notifications and delivery tracking.
- Job retry/dead-letter dashboards and runbooks.

### Exit gate

- Lost responses and retries do not create duplicate students/admissions.
- Only authoritative admissions state marks full enrolment.
- Provider failures do not roll back committed domain changes.
- Worker restart recovers leases/jobs without losing critical work.
- Dead-letter replay is authorized, idempotent, and auditable.

## 9. Phase 5 — Frontend workflow, UAT, and rollout

### Tasks

1. Complete role-specific views for BDA, counsellor, sales lead, and sales manager.
2. Build lead search/detail/timeline, enquiry attribution, duplicate review, assignment, and unassigned queue views.
3. Build call logging, follow-up queue, counselling calendar/session history, and EOD submission.
4. Build conversion status, notification center, and manager reports.
5. Add loading, empty, stale-data, permission-denied, validation, and asynchronous-pending states.
6. Verify keyboard/accessibility and responsive behavior for operational screens.
7. Conduct user acceptance testing with representative users from each role.
8. Run load, security, recovery, and migration rehearsals.
9. Enable features gradually by team/channel using feature flags.
10. Monitor queue depth, assignment distribution, error rates, and business outcomes before expanding rollout.

### Deliverables

- Production-ready CRM UI.
- UAT sign-off and defect list.
- Rollout/rollback checklist.
- Support and operational runbooks.

### Exit gate

All critical acceptance scenarios pass, no unresolved critical/high security defects remain, and operations staff can diagnose/recover common worker and integration failures.

## 10. Suggested milestones and tracking

Estimates below are indicative planning ranges, not commitments. They assume a team familiar with the repository and timely decisions from product/operations. Re-estimate after Phase 0.

| Milestone | Indicative duration | Exit evidence |
|---|---:|---|
| M0 — Discovery and decisions | 1–2 weeks | Inventory, decisions, baseline |
| M1 — Identity and schema foundation | 2–3 weeks | Migrations, RBAC tests, clean build |
| M2 — Intake and assignment | 2–4 weeks | Intake/duplicate/assignment integration tests |
| M3 — Sales operations and EOD | 2–3 weeks | Call/task/session/EOD acceptance suite |
| M4 — Conversion and workers | 2–4 weeks | Idempotency, recovery, event reconciliation |
| M5 — Frontend UAT and rollout | 2–3 weeks | UAT sign-off, load/security/recovery evidence |

Some workstreams can overlap after their interfaces are stable. The overall duration depends heavily on legacy schema complexity, existing test coverage, the admissions integration boundary, and the number of unresolved business decisions.

## 11. Definition of ready for each work item

Before implementation begins, each work item should have:
- a clear user/business outcome;
- an owner and acceptance criteria;
- affected tables/routes/jobs identified;
- permission and data-scope requirements;
- migration/backfill/rollback plan if data changes;
- idempotency/concurrency requirements;
- logging/metrics requirements;
- test cases and test data;
- dependencies and unresolved decisions recorded.

Do not start a schema or API task whose critical business rule is unresolved unless the implementation can safely support multiple options behind configuration.

## 12. Testing strategy

### 12.1 Test layers

1. **Unit tests:** normalization, target formulas, rule matching, state transitions, permission calculations.
2. **Repository/database integration tests:** constraints, transactions, row locks, unique keys, migration behavior.
3. **API contract tests:** request validation, response DTOs, error codes, authentication, scope checks.
4. **End-to-end tests:** representative BDA, counsellor, sales lead, and manager workflows.
5. **Concurrency tests:** idempotency races, assignment capacity, review resolution, conversion retries, duplicate event delivery.
6. **Regression tests:** website intake, existing authentication, GSM callback, student creation, payments/receipts, existing admin workflows.
7. **Security tests:** CSRF, session revocation, cross-team access, privilege escalation, webhook replay, data leakage.
8. **Performance/load tests:** lead list/search, assignment, follow-up queue, EOD preview, outbox dispatch.
9. **Recovery tests:** database interruption, worker crash, provider outage, expired lease, dead-letter replay.
10. **Migration tests:** clean install, upgrade from representative production schema, backfill verification, rollback/forward fix.

### 12.2 Required automated checks

At minimum, CI should run:
- formatting/lint;
- TypeScript type checks;
- unit tests;
- database migration validation;
- integration tests against a disposable test database;
- API contract tests;
- production build for changed workspaces.

If the repository has no test framework, select and configure one in Phase 0. Do not introduce an unmaintained or redundant stack without reviewing existing dependencies.

### 12.3 Critical end-to-end scenarios

1. Website enquiry arrives, creates an enquiry and canonical lead, and receives a safe assignment.
2. Same request retries and returns the same result.
3. A phone-only match creates a review case rather than silently merging.
4. Conflicting identifiers block conversion until review.
5. Concurrent intake cannot overfill rep capacity.
6. Staff logs a callback-requested call with a valid time and exactly one task is created.
7. A follow-up becomes overdue and the correct authorized recipient is notified.
8. A counselling session is rescheduled; history and notification are retained.
9. Completed counselling changes the server-calculated EOD target.
10. Submitted EOD is locked; manager amendment creates a new revision.
11. Conversion links/creates an authoritative student/admission once.
12. Only the authoritative admissions signal marks full enrolment.
13. Worker restart does not lose an outbox event or critical job.
14. A notification provider outage does not roll back assignment or conversion.
15. A user from another team cannot view or mutate the lead, call, follow-up, or EOD report.
16. Existing website, GSM callback, student, and payment workflows remain functional.

## 13. Non-functional acceptance criteria

Initial goals, subject to baseline load agreement:

| Area | Initial target | Evidence |
|---|---|---|
| Ordinary API | p95 ≤ 500 ms | Load test at agreed traffic/data volume |
| Assignment | p95 ≤ 1 second | Concurrent assignment test |
| Error rate | < 1% at baseline load | Load-test report and production metrics |
| Capacity invariant | Zero violations | Concurrency test and reconciliation |
| Conversion idempotency | Zero duplicate student/admission side effects | Retry/fault-injection tests |
| Data access | Zero unauthorized cross-scope reads/writes | Automated authorization suite |
| Outbox recovery | All expired leases eventually recover | Worker crash/restart test |
| Migration | No unplanned data loss | Backfill counts and reconciliation report |
| Operational visibility | Queue lag, dead letters, errors observable | Dashboard/alert verification |

Define the load profile, data volume, time window, and error classification before using these targets as release gates.

## 14. Deployment and migration safety

### 14.1 Deployment order

Recommended order:
1. Add backward-compatible database schema.
2. Deploy API code that can read old/new representations.
3. Backfill and validate.
4. Deploy worker and validate health/queue processing.
5. Deploy CRM frontend behind access/feature controls.
6. Enable new write paths for a limited group.
7. Compare new behavior with legacy behavior.
8. Expand rollout after metrics and business validation.
9. Remove compatibility code only in a later release.

### 14.2 Rollback strategy

- Prefer feature flags and route/config switches over destructive rollback.
- If a new write path is unsafe, disable it while preserving already-created records for investigation.
- Do not automatically reverse a lead merge, admission creation, or sent email as a deployment rollback.
- For schema changes, use forward fixes where rollback would lose data.
- Keep database backups and rehearse restore procedures according to the existing recovery objectives.
- Document which migrations are reversible and which require compensating actions.

### 14.3 Release checklist

- [ ] Build, type checks, lint, and automated tests pass.
- [ ] Migrations applied and validated in staging.
- [ ] Backfill counts/reconciliation approved.
- [ ] CORS and session cookie configuration verified for production and local development.
- [ ] Secrets and provider credentials configured in the deployment environment.
- [ ] Worker health, queue lag, and dead-letter alerts verified.
- [ ] Database connection pool and concurrency behavior tested.
- [ ] Existing website, telephony, student, payment, and admin regression suite passes.
- [ ] UAT signed off by representatives of each role.
- [ ] Support/rollback runbook is available to on-call staff.
- [ ] Feature flags and rollback triggers are tested.
- [ ] No unresolved critical/high security findings remain.

## 15. Risk register

| Risk | Impact | Mitigation | Owner to assign |
|---|---|---|---|
| Existing `follow_ups` mixes calls and tasks | Lost history or broken integrations | Inventory callers, additive migration, dual-read validation | Backend lead |
| Legacy `employees` IDs in GSM callback | Callback regressions | Preserve mapping until migration verified; add compatibility tests | Integration owner |
| Stateless JWT cannot revoke immediately | Stale access after role change | CRM session registry/revocation and short validation path | Security/backend |
| Duplicate or conflicting migrations | Deployment failure/data inconsistency | Migration inventory, CI checks, single generation convention | Database owner |
| Assignment race exceeds capacity | Unequal workloads/business failure | Row locks/reservations, concurrency tests, reconciliation | Backend lead |
| Ambiguous existing student match | Duplicate student/admission | Review workflow and authoritative idempotency | Admissions owner |
| Worker in-memory queue loss | Lost AI/notification jobs | Durable job/outbox storage | Worker owner |
| EOD formula mismatch | Incorrect performance reporting | API-owned formula, approved policy, snapshot/version | Sales operations |
| Missing CRM CORS origin | Browser requests fail | Production/local CORS tests | Platform owner |
| Unclear full-enrolment state | False milestone/reporting | Confirm authoritative admissions source before conversion rollout | Admissions owner |
| No established test framework | Regressions reach production | Select framework and add critical paths early | Engineering lead |
| Data retention policy absent | Privacy/legal exposure | Approve retention and legal-hold policy before deletion jobs | Product/legal owner |

## 16. Rollout metrics and business validation

Review at least:
- enquiry-to-lead association rate;
- duplicate-review rate and median/p95 resolution age;
- unassigned queue count and oldest item age;
- assignment distribution and active workload per rep;
- follow-up completion rate and overdue age;
- counselling scheduling/completion/no-show rates;
- EOD submission rate and amendment frequency;
- conversion initiation and full-enrolment latency;
- conversion reconciliation mismatches;
- notification delivery latency and failure rate;
- API errors, p95 latency, database lock waits, worker queue lag, dead letters.

Use metrics to identify workflow problems, not to silently change routing or performance targets. Any automatic policy adjustment must be explicitly approved and versioned.

## 17. Open decisions and sign-offs

Before production rollout, assign owners and dates for:
1. Authoritative fully-enrolled state and event source.
2. Conversion cardinality for leads, students, and admissions.
3. EOD formula approval and counselling attribution.
4. Follow-up ownership policy during lead transfer.
5. Default assignment capacity and business-hours timezone.
6. Duplicate review SLA and escalation recipients.
7. Retention, legal holds, recording retention, and audit retention.
8. CRM session revocation and existing-user role migration.
9. Initial load profile and performance gates.
10. UAT participants and sign-off criteria.
11. Whether CSV import, telephony automation, WhatsApp/SMS, and advanced AI workflows are excluded from MVP.
12. On-call ownership for worker failures and conversion reconciliation.

## 18. Definition of done

The implementation is complete when:
- the MVP workflows are available to the intended roles;
- all critical acceptance and regression tests pass;
- database migrations and backfills are verified;
- authorization, idempotency, and concurrency guarantees are demonstrated;
- admissions milestones come from the authoritative system;
- durable workers and notifications recover from failures;
- performance and security gates pass at the agreed baseline;
- production monitoring, support procedures, and rollback controls are operational;
- product, sales operations, admissions, and engineering owners sign off.
