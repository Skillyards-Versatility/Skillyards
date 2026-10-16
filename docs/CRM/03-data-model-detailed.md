# SPEC-1 — Data Model and Migrations

**Status:** Proposed schema specification. Verify all existing tables, column types, constraints, migration history, and consumers against the current repository before implementation.  
**Database:** Neon PostgreSQL  
**ORM/schema package:** `packages/db` using the repository's established Drizzle conventions  
**Primary key convention:** UUID for new CRM entities unless compatibility requires otherwise  
**Timestamp convention:** `timestamptz`, stored/handled as UTC  
**Identity convention:** New CRM actor/ownership references use `users.id`

> This document defines the intended data model and integrity invariants. It is not a claim that these tables or columns already exist. Names and types must be reconciled with the live schema before migrations are written.

## 1. Data-model principles

1. Preserve existing tables and public/API contracts wherever possible.
2. Add canonical `leads` separately from `enquiries`.
3. Keep original enquiry submissions and attribution available after association or merge.
4. Do not globally unique-constrain lead phone or email.
5. Use database constraints to enforce invariants that must hold under concurrency.
6. Use transactions for multi-record business operations.
7. Keep append-only histories for assignment, counselling rescheduling, EOD revisions, duplicate decisions, conversion, and audit.
8. Use `users.id` for new CRM ownership and actor references; do not introduce new references to legacy `employees`.
9. Avoid cascade deletes that can erase business history.
10. Add indexes based on known query patterns and validate them with query plans and representative data.
11. Store only the personal data needed for the approved business purpose.
12. Prefer additive migrations and staged backfills over destructive schema rewrites.

## 2. Naming and type conventions

- New tables should follow the repository's existing naming convention after inspection. This document uses snake_case table/column names.
- New IDs are UUIDs unless a referenced existing table requires another type.
- Event times and due times use `timestamptz`.
- Dates used for reporting periods may use `date`, but their timezone interpretation must be explicit.
- Enumerated business states may use PostgreSQL enums or constrained text. Choose based on existing repository migration practices and the need to add states safely.
- JSONB is suitable for versioned configuration or flexible snapshots, but not as a substitute for relational constraints on frequently queried relationships.
- Store normalized contact fields separately from original submitted values.
- Monetary values, if later added to CRM reporting, must use the existing authoritative financial schema and precision conventions; do not duplicate payment amounts as a new source of truth.

## 3. Existing tables to inspect first

Before writing migrations, inspect the actual schema, foreign keys, indexes, Drizzle definitions, route handlers, and all readers/writers for:

| Existing table | CRM use | Required investigation |
|---|---|---|
| `users` | Ownership, roles, memberships, actors | Confirm ID type, active/status fields, deletion behavior |
| `employees` | Legacy compatibility only | Inventory all foreign keys, queries, and external/telephony mappings before any migration or removal |
| `enquiries` | Original submission records | Confirm PK type, contact/source fields, timestamps, and website API contract |
| `follow_ups` | Existing calls/tasks or mixed concept | Determine whether each row represents a call, scheduled task, or both; identify all consumers |
| `call_analyses` | Existing AI analysis | Confirm relation to follow-ups and recording fields |
| `counselling_sessions` | Sessions linked to leads | Confirm current statuses, date fields, user references, and reporting consumers |
| `eod_reports` | Existing EOD reports | Confirm uniqueness, JSONB shape, submission state, and legacy UI behavior |
| `students` | Conversion destination | Confirm identity/contact fields, admission state, and valid FK relationships |
| Payment-related tables | Existing payment workflow | Verify conversion does not create payment side effects |
| Migration metadata/files | Schema evolution | Resolve sequence collisions and document execution order |

Do not assume a column name or referenced key type until it is confirmed from the live schema.

## 4. Core leads and enquiries

### 4.1 `leads`

One canonical lead represents a sales prospect. Multiple enquiry submissions may link to it.

| Column | Proposed type | Nullability | Rules |
|---|---|---|---|
| `id` | UUID | NOT NULL | Primary key |
| `full_name` | TEXT | NOT NULL | Trim/validate; preserve approved correction history where required |
| `normalized_phone` | TEXT | NULL | Indexed; not globally unique |
| `normalized_email` | TEXT | NULL | Indexed; not globally unique |
| `status` | TEXT or enum | NOT NULL | Default `new`; validate lifecycle transitions in service and database where appropriate |
| `assigned_to_user_id` | UUID | NULL | FK to `users.id`; delete behavior must preserve history |
| `assigned_team_id` | UUID | NULL | FK to `sales_teams.id` |
| `converted_student_id` | Existing student ID type | NULL | FK to `students` only after key-type compatibility is confirmed |
| `converted_at` | TIMESTAMPTZ | NULL | Timestamp of successful admission initiation/linking, not full enrolment |
| `merged_into_lead_id` | UUID | NULL | Optional self-FK for a merged source lead; source row remains retained |
| `version` | INTEGER | NOT NULL | Optimistic concurrency version; default `1` |
| `created_at` | TIMESTAMPTZ | NOT NULL | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL | Update timestamp |

**Constraints and indexes**
- Primary key on `id`.
- FK for `assigned_to_user_id`, `assigned_team_id`, and compatible student reference.
- Self-FK for `merged_into_lead_id`; disallow self-merge and detect cycles in service logic.
- Check `version >= 1`.
- Index `(assigned_to_user_id, status, updated_at)`.
- Index `(assigned_team_id, status, updated_at)`.
- Index `created_at`.
- Non-unique indexes on `normalized_phone` and `normalized_email`.
- Consider partial indexes for active/non-merged leads after query patterns are verified.
- Do not globally unique-constrain phone or email.

**Lifecycle values proposed for MVP**
`new`, `contacted`, `follow_up`, `counselling_scheduled`, `counselled`, `qualified`, `converted`, `cold`, `lost`.

Allowed transitions must be defined in application policy and tested. Reopening `cold` or `lost` requires a reason and audit event. Lifecycle is independent of `admission_initiated` and `fully_enrolled` milestones.

### 4.2 Existing `enquiries`

Keep the existing primary key and submission contract. Add only missing fields after schema inspection.

Potential additions, if equivalent columns do not already exist:

| Column | Proposed type | Purpose |
|---|---|---|
| `lead_id` | UUID nullable | FK to canonical `leads` |
| `normalized_phone` | TEXT nullable | Matching without rewriting submitted phone |
| `normalized_email` | TEXT nullable | Matching without rewriting submitted email |
| `processing_status` | TEXT/enum nullable | Intake processing state, if not already represented |
| `processed_at` | TIMESTAMPTZ nullable | Successful processing timestamp |
| `idempotency_key` | TEXT nullable | Only if appropriate for the public intake contract and unique scope |

Preserve existing submitted name, phone, email, source/campaign/programme fields, payload, and timestamps. Do not duplicate fields if an equivalent existing representation already exists.

Relationship: one lead has many enquiries; each enquiry belongs to at most one lead at a time.

**Suggested indexes**
- Index `lead_id`.
- Index processing status and creation time for pending intake work, if queue queries require it.
- A unique idempotency constraint only if key scope and retention semantics are defined.
- Avoid a unique constraint on normalized phone/email.

### 4.3 Intake idempotency records

If the existing enquiry table cannot safely represent idempotency, use a dedicated table such as `crm_idempotency_keys`.

| Column | Proposed type | Rules |
|---|---|---|
| `id` | UUID | PK |
| `scope` | TEXT | Operation namespace, e.g. `public_enquiry_intake` |
| `idempotency_key` | TEXT | Client/generated key |
| `request_hash` | TEXT | Detect key reuse with a different payload |
| `resource_type` | TEXT nullable | Result entity type |
| `resource_id` | UUID nullable | Result entity ID where compatible |
| `response_status` | INTEGER nullable | Stable response status if replay contract requires it |
| `response_snapshot` | JSONB nullable | Minimal replay data; exclude secrets/needless PII |
| `created_at` | TIMESTAMPTZ | Creation time |
| `expires_at` | TIMESTAMPTZ nullable | Cleanup eligibility after agreed retention |

Constraint: unique `(scope, idempotency_key)`. If the same key is reused with a different request hash, return a conflict rather than treating it as a valid retry. Keep key retention long enough to cover realistic retries and provider replay windows.

### 4.4 Attribution

Retain attribution on each enquiry as the source of truth. Derive lead-level summaries using documented rules:
- **First touch:** earliest valid attributed enquiry.
- **Last touch:** most recent valid attributed enquiry before the metric's defined cutoff.
- **Conversion touch:** enquiry associated with the successful conversion under the agreed attribution model.

If attribution snapshots are stored on `leads`, label them as derived values and update them transactionally or through a reconciler. Never discard enquiry-level attribution during association or merge.

## 5. CRM roles and team membership

### 5.1 `crm_user_roles`

| Column | Proposed type | Rules |
|---|---|---|
| `id` | UUID | PK |
| `user_id` | UUID | FK to `users.id` |
| `role` | TEXT/enum | `bda`, `counsellor`, `sales_lead`, `sales_manager` |
| `granted_by_user_id` | UUID | FK to `users.id` |
| `created_at` | TIMESTAMPTZ | Grant time |
| `revoked_at` | TIMESTAMPTZ nullable | Revocation time |

Use a partial unique index on `(user_id, role) WHERE revoked_at IS NULL` to prevent duplicate active grants, if supported by the current migration convention. Role grants and revocations should generate audit events.

### 5.2 `sales_teams`

- `id UUID PRIMARY KEY`
- `name TEXT NOT NULL`
- `is_active BOOLEAN NOT NULL DEFAULT true`
- `created_at TIMESTAMPTZ NOT NULL`
- `updated_at TIMESTAMPTZ NOT NULL`

Add a case-insensitive or normalized unique name constraint only if the business wants team names to be unique. Do not assume this policy without confirmation.

### 5.3 `sales_team_memberships`

- `id UUID PRIMARY KEY`
- `team_id UUID NOT NULL REFERENCES sales_teams(id)`
- `user_id UUID NOT NULL REFERENCES users(id)`
- `started_at TIMESTAMPTZ NOT NULL`
- `ended_at TIMESTAMPTZ NULL`
- `changed_by_user_id UUID NOT NULL REFERENCES users(id)`
- `change_reason TEXT NULL`

Require `ended_at IS NULL OR ended_at >= started_at`. Enforce at most one active team membership per user using a partial unique index on `user_id WHERE ended_at IS NULL`, after existing data is reconciled. Historical membership rows are retained.

### 5.4 Permissions

The role table does not by itself define every permission. Use explicit permission definitions in application code or a permission table if the project needs runtime-configurable grants. Avoid storing an uncontrolled list of arbitrary permission strings in client claims.

If runtime-configurable per-user permissions are required, add a dedicated grant schema only after the permission model is agreed. The baseline remains: effective permissions are the union of applicable role grants, constrained by resource/team scope and explicit access grants.

## 6. Assignment rules and concurrency

### 6.1 `lead_assignment_rules`

| Column | Proposed type | Rules |
|---|---|---|
| `id` | UUID | PK |
| `name` | TEXT | Required |
| `priority` | INTEGER | Required; lower number runs first |
| `is_active` | BOOLEAN | Required |
| `conditions` | JSONB | Validated against versioned application schema |
| `strategy` | TEXT/enum | `manual`, `round_robin`, `workload_aware`, `least_recently_assigned` |
| `capacity_limit` | INTEGER nullable | Positive when provided |
| `fallback_policy` | TEXT/enum | `queue`, `next_rule`, `fallback_team` |
| `fallback_team_id` | UUID nullable | FK to `sales_teams` |
| `config_version` | INTEGER | Required version of condition/strategy schema |
| `created_by_user_id` | UUID | FK to `users.id` |
| `created_at`, `updated_at` | TIMESTAMPTZ | Required |

Constraints:
- `priority >= 0`.
- `capacity_limit IS NULL OR capacity_limit > 0`.
- `fallback_policy != 'fallback_team' OR fallback_team_id IS NOT NULL`.
- Never accept arbitrary SQL or executable expressions in `conditions`.
- Validate condition keys, operators, value types, and referenced fields against an allow-list.

### 6.2 `assignment_cursors`

- `id UUID PRIMARY KEY`
- `rule_id UUID NOT NULL REFERENCES lead_assignment_rules(id)`
- `team_id UUID NULL REFERENCES sales_teams(id)`
- `last_assigned_user_id UUID NULL REFERENCES users(id)`
- `updated_at TIMESTAMPTZ NOT NULL`

Create a unique constraint for the cursor scope, accounting explicitly for PostgreSQL NULL uniqueness semantics. Prefer a non-null scope key or a suitable `NULLS NOT DISTINCT` constraint only if supported by the deployed PostgreSQL version. Do not assume `(rule_id, team_id)` alone guarantees uniqueness when `team_id` is NULL.

### 6.3 `lead_assignment_history`

- `id UUID PRIMARY KEY`
- `lead_id UUID NOT NULL REFERENCES leads(id)`
- `previous_user_id UUID NULL REFERENCES users(id)`
- `new_user_id UUID NULL REFERENCES users(id)`
- `previous_team_id UUID NULL REFERENCES sales_teams(id)`
- `new_team_id UUID NULL REFERENCES sales_teams(id)`
- `reason TEXT NOT NULL`
- `assignment_method TEXT NOT NULL`
- `initiated_by_user_id UUID NULL REFERENCES users(id)`
- `approved_by_user_id UUID NULL REFERENCES users(id)`
- `created_at TIMESTAMPTZ NOT NULL`

Indexes:
- `(lead_id, created_at DESC)`
- `(new_user_id, created_at DESC)`
- `(new_team_id, created_at DESC)`

### 6.4 Capacity invariant

The exact capacity definition is a business decision and must be confirmed before implementation. Once defined, the database operation must enforce it under concurrency.

Possible approaches:
1. Lock the relevant team/user capacity row and calculate eligible workload within the same transaction.
2. Maintain a reservation/counter table updated atomically with assignment and released when a lead leaves the counted state.
3. Use a serialized assignment queue for the relevant team/rule.

Do not select a strategy until workload semantics, transaction contention, and expected throughput are known. A non-atomic “count then assign” query is not sufficient.

## 7. Duplicate review and merge history

### 7.1 `lead_duplicate_reviews`

- `id UUID PRIMARY KEY`
- `enquiry_id` using the existing enquiry PK type, FK to `enquiries`
- `candidate_lead_id UUID NOT NULL REFERENCES leads(id)`
- `confidence_category TEXT NOT NULL CHECK IN ('high','medium','low')`
- `matching_evidence JSONB NOT NULL` containing reason codes and minimal comparison results
- `status TEXT NOT NULL CHECK IN ('pending','in_review','resolved_existing_lead','resolved_new_lead','dismissed')`
- `assigned_reviewer_id UUID NULL REFERENCES users(id)`
- `resolved_by_user_id UUID NULL REFERENCES users(id)`
- `resolution_reason TEXT NULL`
- `resolved_at TIMESTAMPTZ NULL`
- `created_at`, `updated_at` TIMESTAMPTZ NOT NULL
- `version INTEGER NOT NULL DEFAULT 1`

Indexes:
- `(status, created_at)`
- `(assigned_reviewer_id, status, created_at)`
- `(candidate_lead_id, created_at)`

A unique/open-case constraint may be appropriate for a given enquiry and candidate lead, but define what happens when a later submission produces new evidence before adding it.

If one review can contain multiple candidates, normalize candidates into `lead_duplicate_review_candidates(review_id, lead_id, score/category, evidence)` rather than placing an unbounded list in JSONB.

### 7.2 `lead_merge_history`

Recommended table for auditable merges:

- `id UUID PRIMARY KEY`
- `source_lead_id UUID NOT NULL REFERENCES leads(id)`
- `surviving_lead_id UUID NOT NULL REFERENCES leads(id)`
- `merged_by_user_id UUID NOT NULL REFERENCES users(id)`
- `approved_by_user_id UUID NULL REFERENCES users(id)`
- `reason TEXT NOT NULL`
- `source_snapshot JSONB NULL` containing only approved fields needed for recovery/audit
- `created_at TIMESTAMPTZ NOT NULL`
- `reversed_at TIMESTAMPTZ NULL`
- `reversed_by_user_id UUID NULL REFERENCES users(id)`
- `reversal_reason TEXT NULL`

Constraints: source and survivor must differ; a source lead should not be merged into more than one active survivor. Cycle detection and reversal rules belong in a transactional service and must be tested. Do not delete the source lead; set its merge reference and prevent ordinary editing except through an approved merge/reversal workflow.

**Merge policy that must be defined before implementation**
- Which fields survive when values conflict.
- Whether high-risk merges require sales lead/manager approval.
- How enquiries, calls, follow-ups, counselling sessions, conversion references, and audit records are associated with the survivor.
- Whether and how a merge can be reversed.
- How duplicate reviews referencing either lead are updated.

## 8. Explicit access grants and audit

### 8.1 `crm_access_grants`

- `id UUID PRIMARY KEY`
- `user_id UUID NOT NULL REFERENCES users(id)` — recipient
- `lead_id UUID NOT NULL REFERENCES leads(id)`
- `granted_by_user_id UUID NOT NULL REFERENCES users(id)`
- `reason TEXT NOT NULL`
- `starts_at TIMESTAMPTZ NOT NULL`
- `expires_at TIMESTAMPTZ NULL`
- `revoked_at TIMESTAMPTZ NULL`
- `created_at TIMESTAMPTZ NOT NULL`

Check `expires_at IS NULL OR expires_at > starts_at`. Index `(user_id, lead_id, starts_at, expires_at)`. Authorization must evaluate current time and revocation state on every protected operation or use a cache with a documented invalidation strategy.

### 8.2 `crm_audit_events`

- `id UUID PRIMARY KEY`
- `actor_user_id UUID NULL REFERENCES users(id)`
- `action TEXT NOT NULL`
- `entity_type TEXT NOT NULL`
- `entity_id UUID NOT NULL`
- `reason TEXT NULL`
- `before_snapshot JSONB NULL`
- `after_snapshot JSONB NULL`
- `request_id TEXT NULL`
- `created_at TIMESTAMPTZ NOT NULL`

Indexes:
- `(entity_type, entity_id, created_at DESC)`
- `(actor_user_id, created_at DESC)`
- `(action, created_at DESC)`

Audit sensitive changes including lifecycle transitions, assignment/transfer, duplicate resolution/merge, role/team changes, access grants, conversion/milestones, EOD corrections, retention actions, and sensitive configuration changes.

Do not include passwords, access tokens, session tokens, provider secrets, or unnecessary PII in snapshots. Normal application roles must not update/delete audit records. Define audit retention and access permissions.

## 9. Calls and follow-up tasks

### 9.1 Required schema decision

Do not immediately create both new CRM call/task tables. First inspect `follow_ups`, `call_analyses`, their foreign keys, current API contracts, and all readers/writers.

Choose one of these paths after inspection:
- **Extend:** keep existing tables if call and task concepts are already distinct and compatible.
- **Normalize:** create separate call and task tables with a compatibility path if one table currently mixes both concepts.
- **Adapter/read model:** preserve the old contract while new normalized storage is introduced, if migration risk warrants it.

### 9.2 Target call-log model, if a separate table is justified

`crm_call_logs`:
- `id UUID PRIMARY KEY`
- `lead_id UUID NOT NULL REFERENCES leads(id)`
- `user_id UUID NOT NULL REFERENCES users(id)`
- `follow_up_id` nullable FK to the chosen follow-up table
- `called_at TIMESTAMPTZ NOT NULL`
- `duration_seconds INTEGER NOT NULL CHECK (duration_seconds >= 0)`
- `outcome_code TEXT NOT NULL`
- `notes TEXT NULL`
- `recording_url TEXT NULL`
- `idempotency_key TEXT NULL` or reference to the common idempotency table
- `created_at TIMESTAMPTZ NOT NULL`

Index `(lead_id, called_at DESC)`, `(user_id, called_at DESC)`, and any follow-up lookup key required by the query plan. Outcomes should be validated against a configurable catalogue or an allow-listed set.

### 9.3 Target follow-up-task model, if a separate table is justified

`crm_follow_up_tasks`:
- `id UUID PRIMARY KEY`
- `lead_id UUID NOT NULL REFERENCES leads(id)`
- `owner_user_id UUID NOT NULL REFERENCES users(id)`
- `call_log_id UUID NULL REFERENCES crm_call_logs(id)`
- `due_at TIMESTAMPTZ NOT NULL`
- `priority` using the approved enum/constraint
- `status` using the approved enum/constraint
- `completed_at TIMESTAMPTZ NULL`
- `outcome TEXT NULL`
- `created_at`, `updated_at` TIMESTAMPTZ NOT NULL
- `version INTEGER NOT NULL DEFAULT 1`

Indexes should support owner/status/due-time queues, team reporting, and lead history. Define allowed status transitions and whether cancelled tasks remain in the queue/history. Overdue state should be computed from `due_at` and the configured timezone.

### 9.4 Callback atomicity

When a call outcome is `callback_requested` and callback date/time are provided, create the call, follow-up task, and idempotency result in one transaction where possible. Missing callback date/time must not leave a partial operation. Repeated requests with the same key must return the prior result.

## 10. Counselling sessions and history

### 10.1 Existing `counselling_sessions`

Add a nullable `lead_id` FK only after confirming compatible key types and historical data. Reuse existing session IDs, counselor/booked-by fields, date columns, and status values wherever possible.

Requirements:
- Multiple sessions may reference one lead.
- Rescheduling updates the same session record.
- A history row is appended for every reschedule.
- Only completed sessions count for EOD target adjustment.
- Historical sessions not yet associated with a lead may remain nullable and be reconciled separately.

### 10.2 `counselling_session_history`

- `id UUID PRIMARY KEY`
- `session_id` using existing session PK type, FK to `counselling_sessions`
- `old_session_date TIMESTAMPTZ NULL`
- `new_session_date TIMESTAMPTZ NULL`
- `changed_by_user_id UUID NOT NULL REFERENCES users(id)`
- `reason TEXT NULL`
- `created_at TIMESTAMPTZ NOT NULL`

Index `(session_id, created_at DESC)`. If other session fields may be changed and need historical reconstruction, use an approved before/after snapshot or explicit change columns rather than assuming dates alone are sufficient.

## 11. EOD reports and revisions

Retain `eod_reports` and its existing user/date uniqueness after confirming the actual constraint and compatibility requirements.

The stored report must preserve:
- Reporting user and reporting date.
- Reporting timezone/context.
- Actual activity totals and their source.
- Applied target values and formula/config version.
- Achievement values or sufficient immutable inputs to reproduce them.
- Submission state and timestamps.
- Submitted-by identity and manager correction metadata.

If the existing JSONB payload can safely hold versioned snapshots, it may be extended. Promote fields to typed columns when needed for frequent querying, indexing, or constraints.

### 11.1 `eod_report_revisions`, if required

- `id UUID PRIMARY KEY`
- `report_id` using existing report PK type, FK to `eod_reports`
- `revision_number INTEGER NOT NULL`
- `snapshot JSONB NOT NULL`
- `changed_by_user_id UUID NOT NULL REFERENCES users(id)`
- `change_reason TEXT NOT NULL`
- `created_at TIMESTAMPTZ NOT NULL`

Unique `(report_id, revision_number)`. Revisions are append-only. Manager reopen/amend operations must verify current report version and authorization, then atomically append a revision and update the active report state. Do not assume the proposed revision table is necessary until the existing report schema is inspected.

## 12. Conversion and admission milestones

### 12.1 `lead_conversions`

Use a conversion record if attempts, review, reconciliation, or partial failure must be tracked independently of the lead row.

- `id UUID PRIMARY KEY`
- `lead_id UUID NOT NULL REFERENCES leads(id)`
- `student_id` nullable FK to `students` using the actual student key type
- `status TEXT NOT NULL` — define allowed values before migration
- `idempotency_key TEXT NOT NULL`
- `initiated_by_user_id UUID NOT NULL REFERENCES users(id)`
- `initiated_at TIMESTAMPTZ NOT NULL`
- `completed_at TIMESTAMPTZ NULL`
- `failure_reason TEXT NULL`
- `version INTEGER NOT NULL DEFAULT 1`
- `created_at`, `updated_at` TIMESTAMPTZ NOT NULL

The uniqueness scope for idempotency must be explicit. A candidate constraint is unique `(lead_id, idempotency_key)` or a globally unique key, depending on the API contract. Do not add a uniqueness constraint on `lead_id` until the business confirms whether legitimate re-conversion/reconciliation attempts exist.

### 12.2 Milestone events

If the authoritative admissions workflow emits events, persist event identity/source and processing state so duplicate/out-of-order deliveries are safe. A separate milestone table may be justified if milestones need a complete history; otherwise use the existing authoritative admissions record plus an append-only event/audit record.

Invariants:
- `admission_initiated` requires a successfully created or reliably linked student.
- `fully_enrolled` is only confirmed by the authoritative admissions workflow.
- Student creation and payment are not equivalent to full enrolment.
- Conversion must not create payments or fee plans as a side effect.
- Concurrent/repeated requests cannot create duplicate students.

## 13. Notifications and durable jobs

### 13.1 `notification_outbox`

Recommended fields:
- `id UUID PRIMARY KEY`
- `event_type TEXT NOT NULL`
- `aggregate_type TEXT NOT NULL`
- `aggregate_id UUID NOT NULL`
- `payload JSONB NOT NULL` containing minimal versioned event data
- `idempotency_key TEXT NOT NULL`
- `status TEXT NOT NULL`
- `attempt_count INTEGER NOT NULL DEFAULT 0`
- `next_attempt_at TIMESTAMPTZ NOT NULL`
- `lease_owner TEXT NULL`
- `lease_expires_at TIMESTAMPTZ NULL`
- `last_error_category TEXT NULL`
- `created_at TIMESTAMPTZ NOT NULL`
- `processed_at TIMESTAMPTZ NULL`

Add a unique constraint on `idempotency_key` in the documented event scope. Index pending work by status/next-attempt time and lease expiry. Consider partial indexes for active states.

### 13.2 `notifications`

- `id UUID PRIMARY KEY`
- `recipient_user_id UUID NOT NULL REFERENCES users(id)`
- `event_type TEXT NOT NULL`
- `title TEXT NOT NULL`
- `body TEXT NOT NULL`
- `resource_type TEXT NULL`
- `resource_id UUID NULL`
- `read_at TIMESTAMPTZ NULL`
- `created_at TIMESTAMPTZ NOT NULL`
- `deduplication_key TEXT NULL`

If in-app delivery must be idempotent, enforce a unique key in its intended recipient/event scope. Avoid placing excessive lead PII in title/body.

### 13.3 `notification_deliveries`

- `id UUID PRIMARY KEY`
- `outbox_id UUID NOT NULL REFERENCES notification_outbox(id)`
- `channel TEXT NOT NULL`
- `recipient TEXT NOT NULL` — minimize or protect contact information as policy requires
- `status TEXT NOT NULL`
- `attempt_count INTEGER NOT NULL DEFAULT 0`
- `provider_reference TEXT NULL`
- `error_category TEXT NULL`
- `created_at TIMESTAMPTZ NOT NULL`
- `delivered_at TIMESTAMPTZ NULL`

Add indexes for outbox/status and provider reference where operationally useful. Store provider diagnostics safely without secrets.

### 13.4 `notification_preferences`

Potential fields:
- `id UUID PRIMARY KEY`
- `user_id UUID NOT NULL REFERENCES users(id)`
- `event_type TEXT NOT NULL`
- `channel TEXT NOT NULL`
- `enabled BOOLEAN NOT NULL`
- `updated_at TIMESTAMPTZ NOT NULL`

Unique `(user_id, event_type, channel)`. Define mandatory operational/security notices separately from optional notifications and honor consent/policy for external channels.

### 13.5 `crm_job_runs`

- `id UUID PRIMARY KEY`
- `job_type TEXT NOT NULL`
- `job_key TEXT NOT NULL`
- `payload_version INTEGER NOT NULL`
- `status TEXT NOT NULL`
- `attempt_count INTEGER NOT NULL DEFAULT 0`
- `run_after TIMESTAMPTZ NOT NULL`
- `lease_owner TEXT NULL`
- `lease_expires_at TIMESTAMPTZ NULL`
- `last_error_category TEXT NULL`
- `created_at TIMESTAMPTZ NOT NULL`
- `started_at TIMESTAMPTZ NULL`
- `completed_at TIMESTAMPTZ NULL`

Unique `(job_type, job_key)` when that represents the intended deduplication scope. Index claimable jobs by status/run-after and expired leases. Define which jobs use `notification_outbox` versus `crm_job_runs`; do not create duplicate job systems without a clear responsibility split.

## 14. Configuration and retention tables

Configuration should be typed and validated. If settings are stored in a generic key/value table, include:
- Stable key and schema/version.
- Validated value.
- Actor who changed it.
- Change timestamp.
- Optional effective-from timestamp.
- Audit/version history for critical settings.

Do not store provider secrets in a CRM-readable settings response. Keep secrets in server-side secret management.

Retention policy storage is optional until categories and durations are approved. Before automated retention is enabled, define:
- Record category and purpose.
- Approved retention period.
- Legal-hold behavior.
- Archive/anonymize/delete action.
- Backup/provider constraints.
- Dry-run and reconciliation output.
- Actor/approval and audit requirements.

## 15. Foreign-key and deletion policy

Review every new FK's `ON DELETE` behavior explicitly. Default to restrictive/no-action behavior for business history unless there is a justified alternative. Avoid broad cascades from users, leads, or students into audit, assignment, call, counselling, conversion, or notification history.

Prefer:
- Soft deactivation of users/teams.
- Retained history when ownership changes.
- Explicit lead merge references instead of deleting merged leads.
- Controlled anonymization for approved retention workflows.
- Nullable references only when the domain genuinely permits an entity to outlive its parent, and with a documented audit/reconciliation strategy.

## 16. Migration plan

### Phase A — Inventory and baseline
1. Record current branch and database migration state.
2. Inspect actual Drizzle schemas, live database constraints, indexes, foreign keys, and migration files.
3. Search all API routes, frontend code, workers, scripts, and integrations that read/write affected tables.
4. Resolve migration sequence collisions and establish one documented migration procedure.
5. Capture baseline row counts and integrity checks for affected tables.
6. Add tests and a staging database/rehearsal process before production changes.

### Phase B — Expand schema
1. Add new CRM tables and indexes.
2. Add nullable `lead_id`/other compatibility columns only where missing.
3. Add constraints after existing data is validated and cleaned.
4. Keep old columns and contracts in place.
5. Deploy API code capable of operating during the compatibility window.

### Phase C — Backfill and reconcile
1. Create canonical leads conservatively from existing enquiries according to an approved mapping rule.
2. Preserve every original enquiry and attribution value.
3. Auto-associate only records meeting the approved high-confidence rule.
4. Create review cases for ambiguous matches.
5. Reconcile source counts, lead counts, associated enquiry counts, orphan records, and candidate duplicates.
6. Validate all FKs and uniqueness invariants before enabling new intake paths.

### Phase D — Enable and observe
1. Enable CRM functionality for a limited authorized cohort or via a feature flag.
2. Monitor intake errors, duplicate-review backlog, assignment capacity, API latency, and worker failures.
3. Run regression tests for existing website/admin/student/payment/counselling/EOD workflows.
4. Expand rollout only after acceptance criteria pass.

### Phase E — Contract later
1. Remove compatibility paths only after all consumers are migrated.
2. Recheck external integrations, including legacy telephony/user mappings.
3. Remove obsolete schema only in a separately reviewed migration.
4. Keep a forward-recovery plan for any data that cannot be safely rolled back.

## 17. Migration safety and recovery checklist

- [ ] Exact live column types and primary-key types verified.
- [ ] Existing foreign keys and delete actions inventoried.
- [ ] All table readers/writers and external consumers inventoried.
- [ ] Migration order and naming collisions resolved.
- [ ] Migration rehearsed on a representative staging copy.
- [ ] Backfill is restart-safe or has a documented checkpoint/resume strategy.
- [ ] Counts and referential integrity are reconciled before enablement.
- [ ] Constraints are introduced only after conflicting historical data is handled.
- [ ] Backup and recovery procedures are tested.
- [ ] Rollback versus forward-fix decision is documented.
- [ ] No payment workflow is changed as a side effect of CRM conversion.
- [ ] Legacy `employees` remains until all dependencies are migrated.

## 18. Decisions required before finalizing migrations

| ID | Decision | Recommended starting assumption |
|---|---|---|
| DATA-001 | Actual ID types for `enquiries`, `students`, `counselling_sessions`, and `eod_reports` | Match existing key types exactly; do not force UUID if incompatible |
| DATA-002 | Capacity workload definition | Agree counted lead/task states before implementing reservation strategy |
| DATA-003 | Lead merge conflict policy | Preserve source lead and all history; require review for conflicting identity data |
| DATA-004 | Conversion uniqueness | Guarantee one active successful student association per lead unless admissions confirms legitimate multiple-admission cases |
| DATA-005 | Call/follow-up storage strategy | Inspect existing `follow_ups` and consumers before choosing extension or normalization |
| DATA-006 | EOD revision model | Reuse existing JSONB only if it can preserve immutable revisions and support required queries |
| DATA-007 | Notification/job table split | Use outbox for business events and a separate job table only where scheduled work needs distinct semantics |
| DATA-008 | Retention durations | Do not enable automated deletion until policy and legal obligations are approved |
| DATA-009 | PostgreSQL version/features | Verify deployed version before using version-specific unique-index semantics |
| DATA-010 | Audit retention/access | Approve who can read audit data and how long it must be retained |

## 19. Data-model acceptance tests

At minimum, automated database/integration tests must verify:

1. Multiple enquiries can reference one lead; one enquiry cannot reference multiple leads simultaneously.
2. Duplicate phone/email values are allowed across leads.
3. A repeated idempotency key with the same request returns the original result; a different payload returns a conflict.
4. Only one active sales-team membership exists per user.
5. Concurrent round-robin assignment does not corrupt cursor state.
6. Capacity cannot be exceeded under concurrent assignment attempts.
7. Two reviewers cannot resolve the same duplicate case inconsistently.
8. A lead merge preserves the source lead, enquiry attribution, and history; cycles are rejected.
9. Expired/revoked access grants do not authorize requests.
10. Rescheduling appends history and preserves the session ID.
11. EOD amendments append immutable revisions.
12. Concurrent conversion attempts do not create duplicate students or payment side effects.
13. Duplicate/out-of-order admissions events do not regress milestone state.
14. Worker lease expiry allows safe recovery after a process crash.
15. Retention dry-run respects legal holds and reports candidate counts.
16. Existing applications continue to operate through the compatibility window.

## 20. Need Professional Help in Developing Your Architecture?

Please contact me at [sammuti.com](https://sammuti.com) :)
