# SPEC-5 — Intake, Duplicate Resolution, and Lead Assignment

**Status:** Proposed implementation specification  
**Repository:** `/home/chakresh/Skillyards`  
**Primary components:** `apps/api`, `apps/crm`, `packages/db`, `apps/crm-worker`  
**Related specifications:** `01-background-requirements-detailed.md`, `02-architecture-detailed.md`, `03-data-model-detailed.md`, `04-auth-and-authorization-detailed.md`

> **Implementation rule:** `leads` is the canonical CRM prospect record. `enquiries` remains the website-submission record. Intake, duplicate handling, and assignment must be implemented through API/domain services and database transactions—not browser-side logic. This document describes the proposed target state; it does not assert that the proposed tables or endpoints already exist.

## 1. Goals and non-goals

### 1.1 Goals

1. Accept website enquiries and staff-created leads without creating accidental duplicate leads.
2. Preserve every enquiry and its original source, campaign, programme, and submission data.
3. Distinguish request retries from real-world duplicate people.
4. Route eligible leads predictably and atomically.
5. Make uncertain matches visible for human review rather than silently merging people.
6. Preserve assignment and merge history for audit and reporting.
7. Ensure assignment capacity and eligibility remain valid under concurrent intake.
8. Support manual assignment, rule-based routing, and configurable routing strategies.

### 1.2 Non-goals for the MVP

- Fuzzy identity resolution that automatically merges records.
- Cross-tenant routing; the initial design assumes one Skillyards CRM tenant.
- Automated outreach before a lead is assigned and policy checks pass.
- Using AI output as authority to merge leads, change ownership, or change conversion state.
- Deleting source enquiries or merge history to simplify the active lead view.

## 2. Domain model and invariants

### 2.1 Canonical entities

- **Lead:** canonical person/prospect record used by sales operations.
- **Enquiry:** an inbound submission or contact event. A lead may have many enquiries; an enquiry may be associated with at most one canonical lead at a time.
- **Duplicate review:** a review case for a potential identity collision or conflicting identifiers.
- **Assignment rule:** a versioned rule used to select a destination team and/or assignee.
- **Assignment:** current owner/team plus append-only assignment history.
- **Team membership:** a time-bounded relationship between a user and a CRM team.
- **Idempotency record:** protects a single API operation from being applied twice; it is not proof that two submissions represent the same person.

### 2.2 Required invariants

1. Each enquiry has one stable ID and retains its original submitted values.
2. Each enquiry is associated with zero or one canonical lead at any point in time.
3. A lead can have many enquiries.
4. Intake retries with the same idempotency key and equivalent request return the original result.
5. Two different requests from the same person can create separate enquiry records while associating to the same lead.
6. Phone-only or email-only matches must not automatically merge or associate records without review.
7. Exact normalized phone **and** exact normalized email may auto-associate only when there is no conflicting identity evidence.
8. A conflicting phone/email pair is review-required even if one identifier matches an existing lead.
9. A high-risk unresolved duplicate review blocks conversion.
10. Assignment must never choose an inactive user, a user outside the eligible team, or a user over a configured capacity limit.
11. Assignment decisions and manual overrides are auditable.
12. Assignment is performed once per intake workflow, with retries safe against duplicate assignment side effects.
13. No physical deletion is used to resolve duplicate records.
14. Merge operations preserve both records' historical references and retain a reversible audit trail where technically possible.

## 3. Intake channels and request lifecycle

### 3.1 Supported MVP channels

- Website form submission, arriving through the existing website/API integration.
- Staff-created lead from the CRM interface.
- Staff-imported leads, if import is included in the delivery scope.
- Future channels (for example, telephony or messaging) must use the same domain service rather than creating leads directly.

All channels must call a single `LeadIntakeService` (or equivalent domain boundary). Channel-specific adapters validate their own input, but cannot implement their own duplicate or assignment policy.

### 3.2 Intake lifecycle

```text
Receive request
    |
    v
Authenticate/validate channel and payload
    |
    v
Check idempotency key (if supplied/required for channel)
    |
    v
Normalize contact fields; preserve raw values
    |
    v
Create enquiry/intake event
    |
    v
Find possible existing leads
    |
    +--> Safe exact phone+email match, no conflict
    |       -> associate enquiry to existing lead
    |
    +--> No candidate
    |       -> create canonical lead
    |
    +--> One-sided match or conflicting evidence
            -> create/attach duplicate-review case
            -> apply policy for provisional lead and assignment
    |
    v
Evaluate assignment rules if eligible
    |
    v
Commit enquiry/lead/review/assignment/outbox changes atomically
    |
    v
Return stable result to caller
```

### 3.3 Transaction boundary

Where all affected tables reside in the same Neon PostgreSQL database, the following must commit in one transaction:

- idempotency record/result,
- enquiry creation or association,
- new lead creation if needed,
- duplicate-review case creation/update,
- assignment and assignment-history record if assignment succeeds,
- assignment cursor/capacity reservation update,
- audit event,
- notification/outbox event.

Do not send email, push notifications, or external HTTP calls inside the database transaction. Persist outbox events in the transaction and dispatch after commit.

If a channel has to create an enquiry in a separate system, use a durable integration event/outbox and reconciliation. Do not pretend that a cross-system transaction is atomic.

## 4. Input validation and contact normalization

### 4.1 Preserve raw input

Store the submitted phone number and email exactly as received in the enquiry payload (subject to privacy and security limits). Store canonicalized values separately for matching. Do not overwrite source data with normalized values.

Suggested fields, adapting to the existing schema:

- `phone_original`
- `phone_normalized`
- `email_original`
- `email_normalized`
- `normalization_version`
- `normalization_warnings` (optional structured data)

If the existing `enquiries` schema already contains these concepts under different names, reuse or migrate them rather than creating duplicate columns.

### 4.2 Phone normalization

Use a maintained phone-number parsing library configured with the known default country/region for the form or channel. Do not implement international numbering rules using regular expressions alone.

Rules:

1. Trim whitespace and remove presentation-only separators through the library.
2. Parse with an explicit region when the input is national-format.
3. Persist E.164 form only when the number is valid and unambiguous.
4. Keep invalid or ambiguous values in raw form and mark them unverified; do not guess a country silently.
5. Do not treat a phone extension as part of the person's E.164 identity. If extensions are relevant, store them separately.
6. Record the normalization-library/policy version so records can be reprocessed consistently.
7. Never use the normalized phone as proof of identity by itself.

### 4.3 Email normalization

1. Trim surrounding whitespace.
2. Validate basic syntax at the application boundary; validation is not proof that the mailbox exists.
3. Normalize the domain using a consistent IDNA policy and lowercase the domain.
4. Apply a documented case policy to the local part. For matching, the MVP may lowercase the entire address as an operational convention, but must preserve the original address and must not apply provider-specific transformations such as removing dots or `+tags`.
5. Do not infer that two provider-specific aliases are the same person.
6. Invalid email is retained as submitted where appropriate but is excluded from exact-match candidate queries.

### 4.4 Missing and invalid values

- Missing phone/email is allowed only if the channel's business validation permits it.
- If both are absent, require an explicit alternative identifier or route to manual review; do not create a silently unmatchable lead.
- Invalid normalized fields do not participate in exact matching.
- Validation errors must identify the field without echoing sensitive input unnecessarily into logs.

## 5. Idempotency: retry protection, not duplicate detection

### 5.1 Purpose

Idempotency prevents a retry of one logical operation from creating multiple records. Duplicate detection asks whether two distinct operations may represent the same person. These are separate mechanisms and must remain separate in code and storage.

### 5.2 Request contract

For create/intake operations, accept an `Idempotency-Key` header where the caller can generate a stable key. The key should be scoped by operation and caller/channel, for example:

`(channel, operation_name, idempotency_key)`

Store:
- key scope,
- request hash over a canonical payload,
- processing status,
- resulting enquiry ID,
- resulting lead ID, if known,
- response status/body reference,
- created/expiry timestamps.

### 5.3 Algorithm

1. Validate the key's syntax and maximum length.
2. Canonicalize the request for hashing, excluding transport-only fields.
3. Insert the idempotency record under a unique constraint.
4. If insertion wins, process the intake in the same transaction or under a durable state machine.
5. If the key already exists and the request hash matches, return the previously recorded result.
6. If the key exists but the request hash differs, return `409 IDEMPOTENCY_KEY_REUSED`.
7. If an existing record is in progress, return a documented retry response or wait briefly; do not run the operation again.
8. Persist the final result before acknowledging success.

For anonymous website clients, the server may issue or derive a scoped idempotency key if the form platform supports it. Rate limiting and abuse controls are still required.

### 5.4 Retention

Keep idempotency records long enough to cover the expected retry window and delayed client retries. Define the period in configuration; expiry cleanup must not remove a record while the operation is still in progress. Retention for idempotency records is separate from retention for lead/enquiry data.

## 6. Candidate generation and duplicate classification

### 6.1 Candidate search

Query only active canonical leads for ordinary intake matching, while preserving merged records for audit/history lookup. Use indexed normalized fields.

Candidate search should return a bounded set of candidates using:
- exact normalized phone match,
- exact normalized email match,
- both identifiers matching,
- explicit staff-provided candidate ID where permitted.

Avoid broad unbounded substring matching on phone/email. Fuzzy search can be a later, human-review-only enhancement.

### 6.2 Classification table

| Incoming vs existing lead | Default decision | Reason |
|---|---|---|
| Exact normalized phone and exact normalized email; no conflicting identity evidence | Auto-associate enquiry to existing lead | Strongest available deterministic match |
| Phone matches, email missing or differs | Duplicate review | Phone alone is not sufficient |
| Email matches, phone missing or differs | Duplicate review | Email alone is not sufficient |
| Phone matches one lead and email matches another | High-risk duplicate review; block conversion until resolved | Identifiers point to different identities |
| Exact phone+email matches but name/programme/source differs | Associate only if the difference is non-identity metadata; otherwise review | Programme and source can legitimately change; identity conflict needs review |
| No exact candidate | Create new lead, subject to required-field rules | No deterministic match found |
| Normalized contact invalid or absent | Manual review or alternate matching policy | Do not infer identity |

The classification is deliberately conservative. The system must not automatically merge leads based on name, programme, source, or a single contact field.

### 6.3 Conflicting evidence

Treat these as conflict signals:
- phone matches one active lead and email matches another;
- exact phone+email candidate has an explicit conflicting identity marker;
- candidate is already merged and points to a different surviving lead;
- an existing duplicate-review case remains unresolved for the candidate;
- a staff member has marked the contact details as shared or unreliable.

A different name alone is not always a conflict (for example, spelling variations), but it should be visible to the reviewer. Programme/source differences alone are not identity conflicts.

### 6.4 Review case creation

When a case is required:
1. Create or update one open review case for the intake and candidate set.
2. Record the match signals and policy version used.
3. Store candidate IDs and relevant comparison metadata, not unnecessary copies of sensitive information.
4. Assign the case to an authorized review queue.
5. Mark the lead/intake as review-required.
6. Apply the configured policy for whether the provisional lead may be assigned and contacted. High-risk conflicts should not be treated as a confirmed unique lead.
7. Emit an audit event and an outbox notification.

Deduplicate open review cases by a suitable unique key or transaction-level lookup so concurrent submissions do not create a storm of identical cases.

## 7. Duplicate-review workflow

### 7.1 States

Use the states agreed for the target model:

- `pending`
- `in_review`
- `resolved_existing_lead`
- `resolved_new_lead`
- `dismissed`

Terminal states are the three resolved/dismissed states. Reopening a terminal case should create an explicit reopen event and preserve prior decisions.

### 7.2 Review actions

**Claim review**
- Only users with duplicate-review permission may claim.
- Claiming must be conditional on the case being `pending`, or on a documented stale-claim takeover rule.
- Record claimant and claim timestamp.
- A claim timeout may allow another reviewer to take over; takeover is audited.

**Resolve to existing lead**
- Select the canonical lead that should survive.
- Verify the reviewer can access all candidate records.
- Check that no candidate has already been merged into another survivor; follow the current survivor pointer if applicable.
- Associate the incoming enquiry to the chosen lead.
- Preserve candidate and source records, assignment history, follow-ups, calls, counselling sessions, and audit events.
- Mark the case `resolved_existing_lead`, record rationale, reviewer, timestamp, and candidate set.

**Resolve as new lead**
- Confirm that the incoming contact represents a distinct prospect or that the apparent match is not reliable.
- Keep or create a separate canonical lead.
- Mark `resolved_new_lead` and record rationale.
- A dismissal should not silently erase a valid enquiry.

**Dismiss**
- Use only when the case is invalid, abusive, or not a real identity collision.
- Preserve the enquiry and evidence; record a reason code and free-text rationale with length limits.

### 7.3 Concurrency

Review resolution must lock the review case and relevant candidate leads in a deterministic order inside a database transaction. Use conditional state transitions (`WHERE status = expected_status`) so two reviewers cannot both resolve the same case differently. A losing request returns `409 REVIEW_ALREADY_RESOLVED` with the current state.

All side effects—enquiry association, merge pointers, assignment adjustments, audit entries, and notifications—must be in the same transaction/outbox flow.

### 7.4 Conversion block

A lead associated with a high-risk unresolved review must not convert to a student/admission record. The conversion service must query the current review state at execution time; UI-only blocking is insufficient. The block should return a stable business error such as `409 DUPLICATE_REVIEW_REQUIRED`.

## 8. Merge and survivor policy

### 8.1 Explicit survivor selection

Do not automatically choose the oldest/newest lead as survivor without an approved business rule. An authorized reviewer must choose the survivor when the case is ambiguous.

A future safe deterministic policy could prefer the canonical record already linked to authoritative admissions data, but it must be formally approved and tested before use.

### 8.2 Merge procedure

Within a transaction:
1. Lock both leads in ascending ID order.
2. Verify both are active, distinct, and accessible.
3. Verify the selected survivor is not itself merged; resolve to its current canonical survivor if needed.
4. Check for unresolved high-risk reviews and conversion/admission conflicts.
5. Move eligible child references to the survivor where foreign-key semantics allow it.
6. Preserve the losing lead as a tombstone/merged record with `merged_into_lead_id`, actor, timestamp, and reason.
7. Record a merge-history row containing source lead, survivor lead, reason, actor, time, and a minimal snapshot/diff needed for audit or reversal.
8. Reconcile assignment: survivor retains its current owner by default unless an authorized reassignment is explicitly chosen. Do not silently create two current owners.
9. Emit audit/outbox events.
10. Commit and return the survivor ID.

### 8.3 What must not be lost

Never delete or silently discard:
- original enquiry records and source attribution,
- call logs and recording references subject to retention policy,
- follow-up completion history,
- counselling sessions and reschedule history,
- conversion/admission/payment references,
- assignment history,
- duplicate-review decisions,
- audit records.

Where a child record cannot be safely re-parented (for example, because it references an external or authoritative student record), keep the reference and create an explicit reconciliation task instead.

### 8.4 Reversal

A merge may be difficult or impossible to reverse after new activity is created on the survivor. MVP policy:
- no self-service unmerge;
- require elevated permission and a documented reason;
- capture a pre-merge reference snapshot and every child-reference move;
- reject reversal if it would violate unique constraints or split authoritative admissions/payment history without a reviewed repair plan;
- record reversal as a new compensating event, never erase the original merge event.

## 9. Assignment rule model

### 9.1 Rule fields

Each rule should support at least:

- `id`, `name`, `enabled`
- `priority` (lower numeric value is evaluated first)
- `version`
- `conditions` (validated structured JSON, not executable code)
- `destination_team_id` or routing scope
- `strategy`
- `fallback_action`
- optional effective start/end
- creator/updater and timestamps.

Conditions may include:
- source/channel,
- campaign,
- programme,
- location/region,
- lead language if reliably captured,
- local business hours,
- lead priority,
- duplicate-review status,
- team availability/capacity.

Do not accept arbitrary JavaScript, SQL, or user-supplied expressions. Validate conditions against a versioned schema and evaluate them with a deterministic matcher.

### 9.2 Rule evaluation

1. Load enabled rules for the relevant scope, ordered by `priority ASC, id ASC`.
2. Evaluate each rule using the validated condition interpreter.
3. Select the first matching rule whose destination is valid.
4. Evaluate eligible assignees under the selected rule.
5. If no eligible assignee exists, apply the rule's configured fallback action.
6. If no rule matches, use the configured default queue/team policy.
7. Persist the rule ID and version, strategy, eligible-set snapshot or a privacy-minimized decision trace, chosen assignee/team, and fallback reason.

Use a consistent tie-break order. Do not rely on database row order without an explicit `ORDER BY`.

### 9.3 Fallback actions

Supported MVP actions:
- `try_next_rule`
- `send_to_unassigned_queue`
- `fallback_team`
- `leave_unassigned`

Prevent cyclic rule fallback. The evaluator must visit each rule at most once per assignment attempt and must have a bounded maximum number of rule evaluations.

### 9.4 Rule editing

- Only users with CRM configuration permission may change rules.
- Every change creates a new version or immutable audit snapshot.
- Validate destination team, strategy, and conditions before activation.
- Dry-run preview should show sample leads and proposed destinations without changing ownership.
- Rule changes affect new assignment attempts by default; do not silently reassign all existing leads. Bulk rebalancing is a separate authorized operation.

## 10. Eligibility and capacity

### 10.1 Eligibility checks

A candidate user must satisfy all required checks:

- active platform identity;
- active CRM role/permission required for the assignment;
- active membership in the destination sales team;
- membership effective at the assignment timestamp;
- available under their configured working-hours/availability policy;
- not explicitly paused or on leave;
- below the configured active-lead capacity, if capacity limits are enabled;
- eligible for the lead's source/programme/location according to the rule;
- not excluded by a conflict-of-interest or policy restriction.

Do not use client-supplied `userId` as proof of eligibility. Manual assignment must run the same server-side checks.

### 10.2 Capacity definition

Capacity must be a defined, configurable count, not an implicit count of all historic leads. The default proposal is **active owned leads** in eligible lifecycle states; completed, disqualified, merged, and converted leads are excluded unless product owners choose otherwise.

Define:
- maximum active leads per rep;
- which statuses count as active;
- whether temporary holds count;
- whether capacity is team-specific or global per user;
- how leads with unresolved duplicates count.

These definitions must be fixed before capacity enforcement is enabled in production.

### 10.3 Safe reservation

A plain `COUNT(*)` followed by an assignment insert is race-prone. Two concurrent transactions may both observe spare capacity and over-assign the same rep.

Preferred approach:
- maintain a capacity counter/reservation row per user and relevant scope;
- lock that row with `SELECT ... FOR UPDATE`;
- verify `assigned_active_count < capacity_limit`;
- increment the reservation and insert/update the assignment in the same transaction;
- update/decrement the counter on every lifecycle transition that changes whether a lead counts;
- run a reconciliation job to compare counters against source-of-truth assignments.

If using a count-based implementation initially, serialize assignment for the user/team with an advisory lock or an equivalent database lock, then count and write under the same transaction. Do not rely on application-process mutexes because multiple API instances may run concurrently.

Capacity reservations must be idempotent and have a unique reference to the lead/assignment attempt. Roll back the reservation if assignment fails.

## 11. Assignment strategies

### 11.1 Manual assignment

- User selects a lead, team, and eligible assignee.
- API verifies the caller has assignment permission and appropriate scope.
- API verifies target eligibility/capacity and any approval requirements.
- Assignment update, history, audit, and outbox are committed atomically.
- Repeating the same operation with the same idempotency key returns the same result.
- Reassigning to the current owner is a no-op or an explicit recorded operation, according to the chosen audit policy.

### 11.2 Round-robin

Use a persisted cursor per rule/team and lock it transactionally.

1. Lock the cursor row.
2. Fetch eligible members in deterministic order (for example, stable membership sequence then user ID).
3. Start after the prior cursor position.
4. Try candidates in circular order, checking capacity/availability under the required locks.
5. Choose the first eligible candidate.
6. Advance the cursor to the selected member and write assignment.
7. Commit together.

If no candidate is eligible, do not advance the cursor unless a documented policy requires it. Route to fallback.

### 11.3 Workload-aware

Choose the eligible rep with the lowest normalized workload ratio:

`workload_ratio = active_assigned_count / max(1, configured_capacity)`

Tie-break by least-recently-assigned timestamp, then stable user ID. All workload counts/reservations used in the decision must be protected against concurrent assignment.

If the business wants weighted workload, use an explicit configured weight per lead type and define how weights are decremented. Do not add informal weights in code without a schema/configuration contract.

### 11.4 Least-recently-assigned

Choose the eligible user whose last successful assignment is oldest. A user with no prior assignment sorts first. Tie-break by stable membership sequence and user ID. The last-assigned timestamp must be updated in the same transaction as assignment.

### 11.5 Strategy comparison

| Strategy | Strength | Main risk | Appropriate use |
|---|---|---|---|
| Manual | Human control for special cases | Bias, delays, inconsistent choices | High-value or exceptional leads |
| Round-robin | Easy to explain and audit | Unequal workload if rep capacity differs | Similar workloads and equal capacity |
| Workload-aware | Adapts to current active workload | Requires accurate, locked workload state | Default when capacity varies |
| Least-recently-assigned | Fair by assignment recency | Does not account for workload complexity | Simple fairness baseline |

Recommended default: **workload-aware**, with capacity and availability enforcement. Allow rule-level overrides for round-robin or least-recently-assigned.

## 12. No eligible assignee and unassigned queue

When no eligible user is available:
- follow the configured fallback action;
- preserve the lead and enquiry;
- set an explicit assignment state such as `unassigned`;
- record why routing failed (`no_active_members`, `outside_working_hours`, `capacity_exhausted`, `rule_destination_invalid`, `all_rules_exhausted`);
- create a queue item or make the lead visible in the authorized unassigned queue;
- notify the responsible sales lead/manager through the outbox;
- retry only on configured events or bounded schedules, not in a hot infinite loop.

A failed assignment must not drop or roll back a valid inbound enquiry unless the product explicitly requires all-or-nothing intake and an operationally safe fallback exists. Preferred behavior is to persist the intake and queue it.

## 13. Team membership and ownership transitions

### 13.1 Membership constraints

- A user may have historical memberships in multiple teams over time.
- Enforce at most one **active sales-team membership** per user unless the product explicitly approves multi-team membership.
- Use effective-from/effective-to timestamps and status rather than deleting old memberships.
- Membership changes must be audited and must trigger an eligibility/capacity reconciliation.

### 13.2 Inactive user

Default behavior is to **retain existing ownership** when a rep becomes inactive, while excluding them from new assignment. This avoids silent mass reassignment and preserves historical responsibility.

The system must expose inactive-owned leads in a manager queue and support a configurable reassignment policy:
- retain ownership and alert manager;
- reassign automatically to a designated fallback owner/team;
- require manager approval.

The selected policy must be explicit per team or organization and audited when applied.

### 13.3 Transfer between teams

- Cross-team transfer requires sales-manager permission or explicit approval.
- Validate destination membership and eligibility.
- Preserve the previous team, owner, rule, and reason in assignment history.
- Apply a configurable follow-up policy: retain existing follow-up owner, transfer open follow-ups with the lead, or require review.
- Completed follow-ups are immutable and never reassigned.
- Do not transfer or rewrite historical counselling/call records simply to make the current owner appear to have performed them.

### 13.4 Assignment state machine

```text
unassigned
    | eligible automatic/manual assignment
    v
assigned
    | approved reassignment/transfer
    v
assigned (new owner/team; previous assignment closed)
    |
    +--> owner inactive: remains assigned, flagged for manager review
    |
    +--> lead converted/disqualified/merged: active-capacity accounting updated
```

A merged lead should not retain an independently assignable current ownership. Its history remains visible through the surviving lead and merge record.

## 14. API and service boundaries

The following are proposed contracts; align naming with existing API conventions before implementation.

| Operation | Proposed endpoint | Key behavior |
|---|---|---|
| Website intake | `POST /api/intake/enquiries` | Validate channel, idempotency, preserve attribution, run matching and assignment |
| Staff create lead | `POST /api/crm/leads` | Same domain intake path; authenticated staff context |
| Search duplicate candidates | `GET /api/crm/leads/:id/duplicate-candidates` | Permission-scoped, bounded results |
| List review cases | `GET /api/crm/duplicate-reviews` | Queue filters and pagination |
| Claim review | `POST /api/crm/duplicate-reviews/:id/claim` | Conditional state transition |
| Resolve review | `POST /api/crm/duplicate-reviews/:id/resolve` | Existing/new/dismissed resolution, atomic |
| Merge leads | `POST /api/crm/leads/:id/merge` | Explicit survivor, permission and conflict checks |
| Preview assignment | `POST /api/crm/assignment/preview` | Dry run; no writes or notifications |
| Manual assignment | `POST /api/crm/leads/:id/assign` | Validate scope, eligibility, capacity, approval |
| Rule management | `/api/crm/assignment-rules` | Versioned configuration and validation |
| Membership management | `/api/crm/teams/:id/members` | Effective-dated memberships and audit |

### 14.1 Domain service boundaries

Suggested service responsibilities:

- `LeadIntakeService`: validation orchestration, idempotency, enquiry creation, candidate lookup.
- `ContactNormalizationService`: normalization and policy version.
- `DuplicateDetectionService`: candidate retrieval and deterministic classification.
- `DuplicateReviewService`: claims, resolution, merge orchestration.
- `AssignmentRuleEvaluator`: deterministic, bounded rule matching.
- `AssignmentService`: eligibility, strategy selection, locking, assignment history.
- `CapacityService`: reservations, status transitions, reconciliation.
- `AuditService`: append-only domain audit records.
- `OutboxService`: event persistence and dispatch integration.

Keep transaction ownership explicit. Either the top-level use case owns the transaction and passes a transaction context to services, or a documented unit-of-work abstraction coordinates it. Avoid nested transactions with unclear commit behavior.

## 15. Example intake pseudocode

```text
function intake(request, channelContext):
    validateChannel(channelContext)
    normalized = normalizeContact(request.contact)
    requestHash = hashCanonicalRequest(request)

    begin transaction

    prior = getIdempotencyRecordForUpdate(channelContext, request.key)
    if prior exists:
        if prior.requestHash != requestHash:
            rollback
            return 409 IDEMPOTENCY_KEY_REUSED
        if prior.completed:
            commit
            return prior.savedResponse
        otherwise:
            rollback
            return retryable in-progress response

    createIdempotencyRecord()

    enquiry = insertEnquiry(
        rawPayload = request.raw,
        normalizedContact = normalized,
        attribution = request.attribution
    )

    candidates = findCandidates(normalized)
    classification = classify(candidates, normalized)

    if classification == SAFE_EXACT_PAIR:
        lead = classification.lead
        associate(enquiry, lead)
    else if classification == NO_CANDIDATE:
        lead = createLeadFromEnquiry(enquiry)
        associate(enquiry, lead)
    else:
        review = createOrUpdateReview(enquiry, candidates, classification)
        lead = createOrProvisionLeadAccordingToPolicy(enquiry, review)

    if lead is eligible for assignment:
        assignmentResult = assignWithLockedCapacityAndCursor(lead)
    else:
        assignmentResult = queueForReviewOrManualAssignment(lead)

    writeAuditEvents()
    writeOutboxEvents()
    saveIdempotencyResult()
    commit

    return stableIntakeResponse(enquiry, lead, review, assignmentResult)
```

Implementation must define whether duplicate-review creation results in a provisional lead or keeps the enquiry unassociated until review. This choice affects unique constraints, user experience, and assignment. The safe default is to preserve the enquiry and avoid representing an uncertain identity as confirmed; use a clearly flagged provisional lead only if operational workflows require it.

## 16. Error model

Use stable machine-readable error codes, with HTTP status selected consistently.

| Code | Suggested status | Meaning |
|---|---:|---|
| `INVALID_CONTACT` | 422 | No acceptable contact or alternate identifier |
| `IDEMPOTENCY_KEY_REUSED` | 409 | Same key used with different request payload |
| `DUPLICATE_REVIEW_REQUIRED` | 409 | Operation is blocked pending identity review |
| `REVIEW_ALREADY_RESOLVED` | 409 | Concurrent or stale review resolution |
| `ASSIGNEE_NOT_ELIGIBLE` | 422 | Target user fails eligibility checks |
| `CAPACITY_EXHAUSTED` | 409 | No remaining capacity for selected assignee |
| `ASSIGNMENT_APPROVAL_REQUIRED` | 403 or 409 | Transfer/reassignment requires approval |
| `RULE_CONFIGURATION_INVALID` | 422 | Invalid conditions, strategy, destination, or fallback |
| `LEAD_ALREADY_MERGED` | 409 | Operation targets a merged record |
| `FORBIDDEN` | 403 | Caller lacks permission or scope |
| `NOT_FOUND` | 404 | Record absent or intentionally hidden by access policy |

Do not leak cross-team candidate details to users who lack permission. A `404` may be preferable to `403` when existence itself is sensitive.

## 17. Observability and operations

Record structured metrics and logs without logging full phone/email values:

- intake requests and failures by channel;
- idempotency replay/conflict counts;
- number of leads created vs enquiries associated;
- duplicate-review volume, age, and resolution time;
- assignment success/fallback rate;
- unassigned queue size and oldest age;
- capacity rejections and reconciliation drift;
- routing latency by strategy/rule;
- merge/reversal attempts and outcomes;
- outbox lag and notification failures.

Every assignment decision should have a traceable correlation/request ID and a decision record. Redact contact data from application logs and traces.

Alert on:
- sustained growth in unassigned queue;
- duplicate-review cases exceeding the configured SLA;
- capacity counter drift;
- repeated assignment transaction conflicts;
- outbox backlog;
- invalid or disabled rule destinations.

## 18. Security and privacy requirements

- Normalize and match only after validating the request source and permissions.
- Public website intake requires rate limiting, bot/abuse controls, and server-side field validation.
- Staff endpoints require authentication, CRM permission, and record-level scope checks.
- Candidate searches and review queues must be access-scoped.
- Only authorized reviewers can resolve conflicts or merge leads.
- Merge, reassignment, transfer, and rule edits require audit entries.
- Do not expose raw contact fields in metrics, error messages, or notification payloads unless necessary.
- Protect recording URLs and any sensitive evidence referenced by candidate records.
- Ensure audit records are append-only at the application level; privileged database access remains a separate operational risk.

## 19. Test and acceptance plan

### 19.1 Unit tests

- Phone normalization: national and international formats, invalid numbers, ambiguous region, extension handling.
- Email normalization: whitespace, domain case/IDNA, invalid syntax, preservation of original input, no provider-specific alias collapsing.
- Candidate classification: exact pair, phone-only, email-only, cross-lead conflict, no candidate, invalid identifiers.
- Rule evaluation: priority ordering, first match, no match, disabled rule, invalid condition, fallback cycles.
- Strategy selection: round-robin cursor, workload ratios, least-recently-assigned tie-breaks.
- Eligibility: inactive users, expired memberships, paused users, working hours, capacity exhausted.

### 19.2 Integration tests

1. A repeated intake request with the same key and same payload creates one enquiry and returns the same result.
2. Same key with changed payload returns `409` and creates no second enquiry.
3. Two distinct submissions with exact phone+email associate to one lead while preserving two enquiries and their attribution.
4. Phone-only and email-only matches create review cases, not silent merges.
5. A phone matching lead A and email matching lead B creates a high-risk review and blocks conversion.
6. Concurrent intake requests do not create duplicate idempotency records or duplicate review cases.
7. Concurrent round-robin assignment advances the cursor consistently and does not exceed capacity.
8. Concurrent workload-aware assignment cannot exceed the configured per-user capacity.
9. A disabled/inactive user cannot receive a new assignment.
10. If no rep is eligible, the lead remains durable in the unassigned queue.
11. Two reviewers resolving the same case cannot commit contradictory outcomes.
12. Merge preserves enquiry, call, follow-up, counselling, conversion, and audit references.
13. A failed notification dispatch does not roll back a committed intake or assignment.
14. A rule edit does not retroactively reassign existing leads.
15. Cross-team transfer without approval is rejected and audited.
16. Inactive-owner policy preserves ownership by default and flags the lead for review.

### 19.3 Performance and concurrency tests

Use realistic generated lead/team sizes and concurrent intake traffic. Baseline targets from the architecture spec:
- API p95 latency ≤ 500 ms for ordinary requests under the agreed baseline load.
- Assignment p95 latency ≤ 1 second.
- Error rate < 1% under baseline load.
- Zero capacity invariant violations.
- Zero duplicate assignment side effects for replayed idempotent requests.

Set the test load profile with product/operations before declaring these targets met. Measure database lock waits, transaction retries, candidate-query plans, index use, and outbox lag.

### 19.4 Release acceptance checklist

- [ ] Canonical lead/enquiry relationship is migrated and backfilled safely.
- [ ] Raw contact values and normalized values are stored separately.
- [ ] Idempotency and duplicate detection are distinct mechanisms.
- [ ] One-sided matches and conflicting matches route to review.
- [ ] High-risk unresolved reviews block conversion in the API.
- [ ] Rule evaluation is versioned, deterministic, bounded, and auditable.
- [ ] Assignment/capacity updates are transaction-safe across API instances.
- [ ] No-eligible-rep behavior preserves the enquiry and surfaces a queue item.
- [ ] Transfers, merge, and manual override paths enforce authorization.
- [ ] Outbox dispatch is retryable and idempotent.
- [ ] Metrics, alerts, and reconciliation jobs are enabled.
- [ ] Rollback and backfill plans are tested in staging.

## 20. Open decisions before implementation

1. **Provisional lead behavior:** When a duplicate review is opened, should the system create a flagged provisional lead immediately, or leave the enquiry unassociated until review?
2. **Default capacity:** What active lead statuses count toward a rep's capacity, and what are the default limits per team/role?
3. **Working-hours timezone:** Is routing based on a single organization timezone or team/region timezone?
4. **Default fallback:** Should no-eligible-rep route to a shared unassigned queue, a designated fallback team, or remain unassigned with an alert?
5. **Review SLA and escalation:** How quickly must pending duplicate cases be reviewed, and who receives escalation?
6. **Automatic exact-pair association:** Is exact normalized phone+email sufficient when the name differs, or should a name mismatch always require review?
7. **Rule scope:** Are assignment rules global, team-specific, or both with a defined precedence?
8. **Multi-team membership:** Confirm the proposed constraint of one active sales-team membership per user.
9. **Merge reversal:** Which role can approve a reversal, and what records make a reversal categorically disallowed?
10. **Bulk import:** Is CSV/import part of MVP, and if yes, what batch size and partial-failure behavior are required?

## 21. Implementation sequence

1. Inventory existing `enquiries`, `follow_ups`, users, and any contact-normalization logic; document current constraints and foreign keys.
2. Add normalized contact columns and indexes through backward-compatible migrations.
3. Add idempotency storage and intake service; preserve current website behavior during rollout.
4. Introduce canonical `leads` and enquiry association, with backfill/reconciliation before switching reads.
5. Add duplicate candidate classification and review queue; keep automatic matching conservative.
6. Add assignment rules, team membership history, assignment history, and unassigned queue.
7. Implement capacity reservation/locking and concurrency tests before enabling automated assignment.
8. Add outbox events and notifications for assignment/review workflows.
9. Run shadow-mode assignment decisions against representative traffic; compare expected vs actual routes.
10. Enable routing gradually by channel/team, monitor queue depth and capacity drift, and retain a rollback switch.

## 22. Definition of done

This specification is complete for implementation planning when the open decisions above have owners and answers. The MVP is accepted when the release checklist and integration/concurrency tests pass, the intake path is idempotent, duplicate uncertainty is visible rather than silently merged, and assignment is explainable, auditable, and capacity-safe.
