# SPEC-7 — Conversion, Notifications, and Background Workers

**Status:** Proposed implementation specification  
**Repository:** `/home/chakresh/Skillyards`  
**Primary components:** `apps/api`, `apps/crm`, `apps/crm-worker`, `packages/db`, existing student/payment workflows  
**Related specifications:** `02-architecture-detailed.md`, `03-data-model-detailed.md`, `04-auth-and-authorization-detailed.md`, `05-intake-duplicates-assignment-detailed.md`, `06-sales-operations-detailed.md`

> **Core boundary:** CRM conversion must integrate with the existing authoritative student/admissions workflow. It must not create payments or receipts as an incidental side effect. Notifications and background jobs must be durable, retryable, idempotent, and observable.

## 1. Goals and scope

### 1.1 Goals

1. Convert an eligible canonical CRM lead into the existing student/admissions workflow without duplicate student records.
2. Track admission initiation separately from fully enrolled status.
3. Make conversion retries safe and reconcile partial failures across system boundaries.
4. Deliver in-app/email notifications through a durable outbox and worker.
5. Support delayed reminders, overdue escalation, EOD reminders, and conversion reconciliation.
6. Ensure worker retries do not duplicate business actions or notifications.
7. Preserve audit, privacy, consent, and retention requirements.

### 1.2 MVP scope

- Lead-to-student/admission conversion through the existing authoritative workflow.
- Milestones: `admission_initiated` and `fully_enrolled`.
- In-app and email notifications; future channels are adapters.
- Durable database-backed outbox and job processing.
- Retry policies, dead-letter handling, operational dashboards/metrics, and reconciliation.
- A dedicated persistent worker process in `apps/crm-worker`.

### 1.3 Out of scope unless separately approved

- Creating payments, invoices, receipts, or installment plans during CRM conversion.
- Treating a payment record as sufficient evidence of full enrolment.
- Automatically changing lead status based solely on AI analysis.
- Requiring WhatsApp/SMS or a telephony provider for the initial release.
- Using in-memory queues as the sole durable store for jobs.

## 2. Conversion domain and milestones

### 2.1 State distinction

The system must represent two separate milestones:

- **Admission initiated:** the authoritative student/admissions workflow has successfully created or linked the student/admission record for this lead.
- **Fully enrolled:** the authoritative admissions workflow explicitly confirms the student has reached the approved fully-enrolled state.

Creating a student row is not automatically equivalent to full enrolment. Payment initiation, a payment attempt, or a receipt generated elsewhere must not independently mark the CRM lead fully enrolled.

### 2.2 Proposed conversion record

Adapt the schema to the existing `packages/db` conventions. Suggested fields:

| Field | Type | Purpose |
|---|---|---|
| `id` | UUID/standard key | Conversion record ID |
| `lead_id` | FK to canonical leads | Source lead |
| `student_id` | nullable FK/reference | Linked authoritative student |
| `admission_id` | nullable FK/reference | If a distinct admission entity exists |
| `status` | constrained state | `pending`, `admission_initiated`, `fully_enrolled`, `needs_review`, `failed` |
| `idempotency_key` | unique scoped key | Prevent duplicate conversion attempts |
| `source_system` | text/enum | CRM, admissions workflow, or reconciliation |
| `initiated_by_user_id` | nullable FK to users | Staff actor; null for trusted system event |
| `initiated_at` | nullable timestamptz | Admission initiation time |
| `fully_enrolled_at` | nullable timestamptz | Authoritative milestone timestamp |
| `last_error_code` | nullable text | Safe operational diagnostic |
| `created_at`, `updated_at` | timestamptz | Server timestamps |

Do not duplicate the complete student record inside CRM. Store a stable reference to the authoritative student/admission entity and only the minimum snapshot needed for CRM display/reporting.

### 2.3 Unique constraints and cardinality

The default proposal is one active conversion record per canonical lead and no more than one successful CRM conversion per lead. Enforce this with database constraints or a transaction-safe equivalent.

The student side must also prevent the same conversion key from creating multiple student records. If existing business rules allow one person to have multiple admissions/programmes, model the distinction explicitly: a person/lead may be linked to one student identity and multiple admission records. Do not incorrectly impose one-student-per-person if the existing system permits multiple enrolments.

### 2.4 Eligibility checks

Before conversion:
1. Authenticate the caller and check the conversion permission and lead scope.
2. Lock the lead/conversion row or use a conditional state transition.
3. Reject merged leads; resolve the current canonical survivor if the caller followed a stale link.
4. Block high-risk unresolved duplicate review cases.
5. Verify required contact and admission fields.
6. Check whether a student/admission is already linked.
7. Require an explicit selection/review if a possible existing student match is uncertain.
8. Validate that the lead is in a business state eligible for conversion.
9. Persist the conversion attempt and audit event.

Do not rely only on the CRM UI to enforce eligibility.

## 3. Conversion workflow

### 3.1 Same-database transaction

If the authoritative student/admission tables and CRM tables are in the same PostgreSQL database and can be changed in one transaction:

1. Begin transaction and lock the lead/conversion record.
2. Validate authorization, duplicate review, required fields, and existing student links.
3. Insert the conversion record or claim the existing pending record using a unique idempotency key.
4. Create or link the student/admission record using the existing authoritative service/domain rules.
5. Update the conversion milestone to `admission_initiated`.
6. Update CRM lead status to the agreed conversion state.
7. Insert audit and outbox events.
8. Commit.

Do not call external payment services or send notifications inside this transaction.

### 3.2 Separate-service or separate-transaction workflow

If conversion crosses an API/service boundary that cannot share a transaction, use a durable state machine:

1. In the CRM transaction, validate and persist `pending` conversion plus an outbox command.
2. Worker dispatches the command to the authoritative admissions service using a stable idempotency key.
3. Admissions service must make the operation idempotent and return a stable student/admission reference.
4. Worker records success and moves to `admission_initiated`, or records a retryable/permanent failure.
5. If the response is lost after the admissions service commits, retry with the same key or query by correlation key before attempting creation again.
6. A reconciliation job detects stale `pending` records and compares them against the authoritative system.
7. Emit the milestone event and notification only after the corresponding durable state transition commits.

This workflow is an eventual-consistency process, not a distributed transaction. The UI should show `pending`/`processing` status rather than claiming conversion succeeded prematurely.

### 3.3 Existing-student match

Possible outcomes:
- **Exact authoritative match:** link to the existing student if the authoritative matching policy says it is safe.
- **No match:** create through the authoritative student/admission service.
- **Ambiguous match:** set `needs_review`; do not create a second student record automatically.
- **Existing linked student/admission:** return the existing conversion result or continue a valid subsequent admission flow according to the approved cardinality rules.

Do not use phone-only or email-only CRM matching as authority to merge student identities. CRM duplicate policy and authoritative admissions identity policy must be compatible, but they are not automatically the same system.

### 3.4 Full-enrolment event

The admissions workflow must publish or expose an authoritative status change. The CRM consumes that event or polls the authoritative state through a durable reconciliation process.

When full enrolment is confirmed:
1. Validate event authenticity and schema/version.
2. Deduplicate by source event ID or equivalent.
3. Confirm the student/admission reference matches the conversion.
4. Apply a conditional state transition to `fully_enrolled`.
5. Store source event ID, timestamp, and provenance.
6. Update the CRM milestone.
7. Emit audit and outbox notification events.
8. Commit.

Out-of-order events must not move a conversion backwards. A stale `admission_initiated` event received after `fully_enrolled` must be ignored or recorded as a duplicate, not downgrade the state.

## 4. Conversion state machine

```text
pending
  | authoritative creation/link succeeds
  v
admission_initiated
  | authoritative admissions state confirms completion
  v
fully_enrolled

pending -> needs_review   (ambiguous student match or unresolved identity conflict)
pending -> failed         (permanent failure; retry requires explicit policy)
failed  -> pending        (authorized retry/reconciliation action)
needs_review -> pending   (review resolves match and authorizes continuation)
```

Rules:
- `fully_enrolled` is a terminal milestone for the same admission record, except for a separately audited correction from the authoritative admissions system.
- Retryable transport failures remain `pending` with attempt metadata; do not immediately mark them permanently failed.
- Permanent business validation errors may move to `failed` with a safe error code.
- A conversion attempt must have a correlation ID across API, worker, and admissions service.
- All transitions are conditional and audited.

## 5. Payment and receipt boundary

Conversion must not:
- create a payment transaction;
- generate a receipt;
- create installment rows;
- mark an invoice paid;
- change a financial ledger;
- infer full enrolment from a payment event alone.

If the authoritative admissions workflow normally creates financial artifacts as part of its own business process, call that workflow through its established service boundary and preserve its semantics. CRM must not duplicate those operations.

The conversion API response should return the student/admission reference and milestone state, not fabricate financial success.

## 6. Notification architecture

### 6.1 Channels

MVP:
- in-app notifications;
- email through the existing Resend integration.

Future adapters:
- web push;
- WhatsApp/SMS if approved and consent/compliance requirements are satisfied.

All channels consume the same domain notification intent and have channel-specific delivery adapters. Business logic should not call a provider SDK directly from route handlers.

### 6.2 Notification event catalog

Proposed event types:

| Event | Typical recipient | Trigger |
|---|---|---|
| `lead.assigned` | New owner | Successful assignment transaction |
| `enquiry.associated` | Lead owner/team queue | Enquiry associated with a lead |
| `follow_up.overdue` | Task owner, then manager by escalation policy | Task remains open past due |
| `lead.transferred` | New owner and relevant manager | Approved ownership/team transfer |
| `counselling.scheduled` | Counsellor and authorized recipient | Session created |
| `counselling.rescheduled` | Counsellor and authorized recipient | Session time changed |
| `conversion.admission_initiated` | Owner/authorized team | Admission initiation committed |
| `conversion.fully_enrolled` | Owner/authorized team | Authoritative full-enrolment event |
| `eod.reminder` | Staff member | Submission deadline approaching |
| `eod.missing` | Staff member/manager | Deadline passed without report |
| `duplicate_review.created` | Review queue | Review case created |
| `duplicate_review.escalated` | Sales lead/manager | Review SLA exceeded |

Do not emit notification events for rolled-back transactions. The outbox record must be written in the same transaction as the domain change.

### 6.3 Recipient resolution

Resolve recipients from current permissions and relevant entity relationships, not from client-supplied email addresses. Before delivery:
- confirm the recipient remains eligible to receive the notification;
- apply notification preferences and consent rules;
- ensure content is appropriate for the channel;
- avoid exposing lead contact details or sensitive notes unnecessarily.

A lead owner becoming inactive must not cause notifications to be silently sent to an unrelated user. Apply the configured manager/fallback policy.

### 6.4 Notification data model

Suggested tables:

**`notification_outbox`**
- `id`
- `event_type`
- `aggregate_type`
- `aggregate_id`
- `event_version`
- `payload` (minimal, versioned JSON)
- `status` (`pending`, `processing`, `delivered`, `retry`, `dead_letter`)
- `available_at`
- `attempt_count`
- `last_error_code`
- `created_at`, `updated_at`
- optional `dedupe_key`

**`notifications`** (in-app user-facing records)
- `id`
- `recipient_user_id`
- `event_type`
- `title`
- `body` or structured display payload
- `target_path` (validated internal route only)
- `read_at`
- `created_at`
- optional expiry/retention fields

**`notification_deliveries`**
- `id`
- `outbox_id`
- `recipient_user_id`
- `channel`
- `provider_message_id`
- `status`
- `attempt_count`
- `last_error_code`
- `delivered_at`
- `created_at`, `updated_at`

Add unique constraints appropriate to delivery semantics, such as one delivery per `(outbox_id, recipient_user_id, channel)`, while allowing intentional redelivery through a new event/version.

## 7. Transactional outbox and delivery guarantees

### 7.1 Why outbox

The API must not commit a lead assignment and then rely on an in-process callback to send a notification. A process crash between database commit and provider call would lose the notification. Persist event intent with the business transaction, then dispatch asynchronously.

### 7.2 Dispatcher lifecycle

1. Worker polls pending outbox rows using a bounded batch.
2. Claim rows safely using `FOR UPDATE SKIP LOCKED` or a lease-based equivalent.
3. Mark claimed rows with a lease/worker ID and lease expiry.
4. Commit the claim, then perform provider calls outside the transaction.
5. On success, store provider result and mark delivery complete.
6. On retryable error, set `available_at` using bounded exponential backoff with jitter.
7. On permanent error or retry exhaustion, move to `dead_letter` and alert.
8. Expired leases return to the eligible queue.
9. Periodic reconciliation detects stuck processing rows and missing delivery records.

Never hold a database transaction open while waiting for an email or push provider.

### 7.3 At-least-once delivery

The worker provides at-least-once processing. A provider request may succeed even if the worker loses the response, so exactly-once delivery cannot be guaranteed solely by the database.

Use:
- stable event/delivery idempotency keys where the provider supports them;
- unique delivery rows;
- idempotent in-app notification inserts;
- provider message IDs;
- retry policies that distinguish uncertain outcomes from definite failures;
- monitoring for duplicate-delivery signals.

Do not promise exactly-once email delivery. Promise idempotent business-event creation and best-effort deduplication at the delivery boundary.

### 7.4 Email delivery

- Use the existing Resend integration through a worker adapter.
- Keep API keys in environment/secret management, never in source or browser bundles.
- Use templates with escaped variables and approved links.
- Store minimal delivery metadata; do not log full rendered email bodies or sensitive data.
- Handle provider rate limits, temporary failures, invalid recipients, and suppression/bounce signals distinctly.
- Use a stable provider idempotency mechanism if supported by the configured API/version; verify current provider behavior during implementation.

## 8. Durable background jobs

### 8.1 Worker process

Deploy a dedicated persistent `apps/crm-worker` service (for example, on Railway). It should:
- share typed database/domain packages where appropriate;
- have its own process entry point and health checks;
- use a separate least-privilege service identity/database role where practical;
- process outbox events and scheduled jobs;
- expose liveness/readiness status and useful metrics;
- shut down gracefully, releasing leases and finishing or safely abandoning work.

The worker is not a second public API. Keep provider secrets and job execution out of the browser and ordinary request handlers.

### 8.2 Job table

Suggested `background_jobs` fields:

- `id`
- `job_type`
- `payload` (versioned JSON, validated on read)
- `dedupe_key`
- `status` (`pending`, `processing`, `retry`, `completed`, `dead_letter`, `cancelled`)
- `available_at`
- `attempt_count`
- `max_attempts`
- `lease_owner`
- `lease_expires_at`
- `last_error_code`
- `created_at`, `updated_at`
- `completed_at`

Use a unique constraint on a non-null `dedupe_key` within the intended job scope. Payloads must not be arbitrary executable code. Validate job type and payload schema before processing.

If QStash is reused for delayed triggers, it should be a wake-up/scheduling layer, not the sole source of truth for critical business state. The database job/outbox remains authoritative, and the handler must be idempotent.

### 8.3 Job types

| Job | Trigger/schedule | Required behavior |
|---|---|---|
| `notification.dispatch` | Outbox event available | Deliver through selected channels |
| `follow_up.reminder` | Before due time, if configured | Recheck task is open and due window still applies |
| `follow_up.escalation` | After configured overdue threshold | Recheck task and recipient scope |
| `assignment.retry` | Assignment fallback/recovery | Re-evaluate current rules/eligibility; bounded retries |
| `eod.reminder` | Configured time before deadline | Skip if report already submitted |
| `eod.missing_escalation` | After submission deadline | Skip if report submitted or excused |
| `conversion.reconcile` | Periodic/stale pending conversion | Query authoritative admissions state idempotently |
| `lead.retention` | Scheduled policy run | Apply approved retention rules and legal holds |
| `ai.call_analysis` | Call recording ready | Durable queue; failure must not block call log |
| `capacity.reconcile` | Periodic | Compare capacity counters with authoritative assignments |
| `outbox.recover` | Periodic | Recover expired leases and stuck rows |

### 8.4 Retry policy

- Use exponential backoff with jitter and a configured maximum delay.
- Set per-job maximum attempts and maximum age.
- Classify errors as retryable, permanent, or uncertain.
- Do not retry permanent validation/permission errors without a state change.
- Dead-letter exhausted jobs and alert owners.
- Support safe replay by an authorized operator, with original attempt history retained.
- Do not make a replay bypass current authorization, consent, retention, or business-state checks.

### 8.5 Scheduling and time

- Persist scheduled instants in UTC.
- Use the configured IANA business timezone to compute local reminder and EOD schedule boundaries.
- Use stable dedupe keys including entity ID, event type, and relevant schedule/version.
- Recompute future scheduled jobs when a follow-up/session is rescheduled, or make the handler recheck the current due timestamp and no-op if stale.
- Do not schedule one job per lead indefinitely without cleanup/retention.

## 9. Conversion and notification idempotency

Each conversion operation and event needs a stable correlation/idempotency key.

Examples:
- `conversion:<leadId>:<admissionAttemptVersion>`
- `fully-enrolled:<sourceSystem>:<sourceEventId>`
- `notification:<eventId>:<recipientId>:<channel>`

The exact format is implementation-defined; keys must be unique within a documented scope and not contain unnecessary PII.

Required behavior:
1. A repeated conversion command returns the existing conversion state.
2. A repeated admissions event cannot downgrade state or send duplicate business-event notifications.
3. A retry after an uncertain network response checks the authoritative system by correlation key before creating a record.
4. A notification retry reuses the delivery identity and records every attempt.
5. Reconciliation repairs state from the authoritative system rather than guessing success from a timeout.

## 10. Observability and operations

### 10.1 Metrics

Track:
- outbox pending count and oldest age;
- delivery attempts, success/failure rates, and provider latency;
- dead-letter count by job type/error class;
- expired leases and worker restart/recovery counts;
- job queue age and retry distribution;
- stale pending conversions and reconciliation outcomes;
- time from admission initiation to full-enrolment confirmation;
- duplicate event/idempotency-hit rate;
- notification delivery latency by channel;
- AI job queue age and failure rate;
- capacity reconciliation drift.

### 10.2 Alerts

Alert on:
- outbox oldest age exceeding its SLA;
- sustained notification failures or provider outage;
- dead-letter growth;
- jobs repeatedly expiring their leases;
- conversion records stuck pending beyond a configured threshold;
- mismatch between CRM conversion state and authoritative admissions state;
- worker heartbeat missing;
- capacity counters diverging from assignments.

### 10.3 Logging and tracing

Every API command, job, outbox event, and external request should carry a correlation ID. Logs should include job ID, event ID, attempt, duration, status, and safe error code. Do not log access tokens, API secrets, full contact values, raw provider payloads, or full email bodies.

Provide an operator runbook for:
- retrying a dead-letter job;
- resolving a conversion stuck pending;
- reconciling a notification delivery with provider state;
- recovering expired leases;
- replaying an authoritative admissions event;
- rotating provider credentials;
- handling an accidental duplicate notification.

## 11. Security and privacy

- Worker credentials must be least-privilege and distinct from end-user sessions.
- Worker jobs must re-check the current state before acting; old queued payloads are not authorization.
- Validate webhook/event authenticity and protect against replay.
- Do not trust event-supplied user IDs for permission checks.
- Notification recipients are resolved server-side from current assignments and permissions.
- Do not include sensitive student, payment, or lead details in email subject lines or push previews by default.
- Validate internal notification target paths to prevent open redirects.
- Apply notification preferences, consent, suppression lists, and retention rules.
- Keep audit records for privileged retries and manual reconciliation.
- Ensure legal holds override routine deletion/anonymization jobs.

## 12. Proposed API/service contracts

Exact routes should align with existing conventions.

| Operation | Proposed contract | Notes |
|---|---|---|
| Start conversion | `POST /api/crm/leads/:leadId/conversion` | Idempotency key; permission and duplicate checks |
| Get conversion state | `GET /api/crm/leads/:leadId/conversion` | Scoped current state |
| Resolve conversion review | `POST /api/crm/conversions/:id/resolve` | Authorized existing-student match or retry |
| Internal admissions callback | `POST /api/internal/admissions/events` | Authenticated service-to-service event |
| List notifications | `GET /api/crm/notifications` | Current user only; paginated |
| Mark notification read | `POST /api/crm/notifications/:id/read` | Must belong to current user |
| Notification preferences | `GET/PUT /api/crm/notification-preferences` | Validate supported channels and consent |
| Worker health | Internal health endpoint or platform health check | No sensitive operational details publicly |

Domain services should expose operations such as `ConversionService.start`, `ConversionService.applyAuthoritativeEvent`, `OutboxDispatcher.dispatchBatch`, and `JobRunner.runBatch`. The public API must not expose arbitrary job execution or generic outbox mutation.

## 13. Implementation sequence

### Phase 1 — Contracts and inventory
1. Identify the authoritative student/admissions service and exact full-enrolment signal.
2. Map current student creation, admission, payment, receipt, and installment flows.
3. Document existing notification and email integrations.
4. Identify all in-memory AI queue producers/consumers and callback retry semantics.
5. Agree on conversion cardinality and source-of-truth ownership.

### Phase 2 — Durable foundation
1. Add conversion state/idempotency schema.
2. Add outbox, delivery, and job tables with indexes and constraints.
3. Implement transaction-safe outbox insertion.
4. Implement worker leases, retry policy, dead-letter handling, and graceful shutdown.
5. Add metrics and operational runbooks before enabling high-volume jobs.

### Phase 3 — Conversion
1. Implement same-database transactional conversion or durable cross-service command flow.
2. Add authoritative full-enrolment event handling.
3. Add reconciliation for stale pending records.
4. Test repeated requests, lost responses, duplicate/out-of-order events, and ambiguous student matches.
5. Confirm no CRM path creates payment/receipt records.

### Phase 4 — Notifications
1. Implement in-app notification storage and read state.
2. Add email adapter using existing Resend configuration.
3. Add recipient resolution, preferences/consent, templates, and delivery logs.
4. Migrate assignment, counselling, follow-up, and conversion events to outbox-based delivery.
5. Remove direct provider calls from request handlers after parity is verified.

### Phase 5 — Scheduled jobs
1. Implement follow-up reminders/escalation and EOD reminders.
2. Add assignment and capacity reconciliation.
3. Move AI analysis from volatile in-memory queue to durable jobs.
4. Add retention jobs only after retention/legal-hold policy is approved.
5. Exercise retries, provider outage, worker restart, and dead-letter replay in staging.

## 14. Acceptance tests

### Conversion
- [ ] A valid lead converts through the authoritative student/admissions workflow.
- [ ] An unresolved high-risk duplicate blocks conversion.
- [ ] An ambiguous existing-student match enters `needs_review`.
- [ ] Retried conversion with the same key returns the existing result.
- [ ] A lost response after authoritative creation does not create a second student on retry.
- [ ] CRM conversion does not independently create payments, receipts, or installments.
- [ ] `fully_enrolled` is set only by authoritative admissions state.
- [ ] Duplicate and out-of-order events do not downgrade milestones or duplicate notifications.
- [ ] A stale pending conversion is detected and reconciled.

### Outbox and worker
- [ ] A domain transaction and its outbox event commit or roll back together.
- [ ] A worker crash after claiming work allows lease recovery.
- [ ] A provider timeout is retried according to policy without duplicate business-event creation.
- [ ] Permanent errors dead-letter with an alert.
- [ ] Replaying a job is authorized, auditable, and idempotent.
- [ ] A notification failure does not roll back lead assignment or conversion.
- [ ] Stale follow-up reminders are suppressed after task completion/rescheduling.
- [ ] A repeated EOD reminder job does not send duplicate reminders for the same event window.

### Security and performance
- [ ] Worker credentials cannot perform unrelated user/admin actions.
- [ ] Event/webhook authentication and replay protection are tested.
- [ ] Notification reads/mark-as-read are scoped to the recipient.
- [ ] Sensitive values are absent from logs and notification previews.
- [ ] Outbox/job queue latency and dead-letter metrics are observable.
- [ ] Under the agreed baseline load, ordinary API p95 is ≤ 500 ms and assignment p95 is ≤ 1 second.
- [ ] Worker recovery meets an agreed recovery-time objective.

## 15. Open decisions

1. **Authoritative admissions state:** Which table/service/event definitively indicates `fully_enrolled`?
2. **Conversion cardinality:** Can one lead/person have multiple admissions or programme enrolments?
3. **Existing student matching:** Which identifiers and authoritative rules are sufficient for safe linking?
4. **Event transport:** Can the admissions workflow publish authenticated events, or must CRM poll/reconcile?
5. **Notification preferences:** Are preferences per user, per event, and per channel?
6. **Email SLA:** What delivery-latency objective and retry horizon are required?
7. **Overdue escalation:** How long after a follow-up becomes overdue should a manager be notified?
8. **EOD schedule:** What are the business timezone, submission deadline, reminder schedule, and exception policy?
9. **Job retention:** How long should completed jobs, delivery attempts, and dead-letter payloads be retained?
10. **AI queue migration:** Which AI analysis jobs are business-critical, and what maximum retry/age policy applies?
11. **Provider idempotency:** Confirm current Resend API idempotency behavior and constraints during implementation.
12. **Retention rules:** Which lead, call, recording, notification, and audit data categories have distinct retention periods and legal holds?

## 16. Definition of done

This specification is accepted when conversion milestones are sourced from the authoritative admissions workflow, retries cannot create duplicate student/admission operations, no financial artifacts are created by CRM conversion, notification intent is persisted transactionally, workers recover safely from crashes, and monitoring/runbooks make failures actionable.
