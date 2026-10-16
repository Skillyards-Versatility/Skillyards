# SPEC-6 — Sales Operations: Calls, Follow-ups, Counselling, and EOD

**Status:** Proposed implementation specification  
**Repository:** `/home/chakresh/Skillyards`  
**Primary components:** `apps/crm`, `apps/api`, `packages/db`, `apps/crm-worker`  
**Related specifications:** `02-architecture-detailed.md`, `03-data-model-detailed.md`, `04-auth-and-authorization-detailed.md`, `05-intake-duplicates-assignment-detailed.md`

> **Implementation boundary:** Sales operations must use the canonical CRM lead model and API authorization rules. Existing `follow_ups` and `counselling_sessions` must be inspected before schema changes. This document specifies the target behavior and compatibility requirements; it does not assume the existing tables already satisfy them.

## 1. Goals

1. Give sales staff a consistent workflow for recording calls and outcomes.
2. Separate historical call records from actionable follow-up tasks, even if an initial migration retains one physical table.
3. Provide a reliable follow-up queue ordered by urgency and due time.
4. Manage counselling appointments, rescheduling, attendance, and outcomes with history.
5. Make EOD target calculation and report submission server-authoritative.
6. Preserve audit history and ensure retries do not create duplicate call/follow-up side effects.
7. Keep the MVP independent of telephony automation while allowing a future telephony adapter.

## 2. Existing-system considerations

The repository review identified:
- `follow_ups` includes fields such as `leadPhone`, `telecallerId`, `duration`, `outcome`, `type`, `contactedAt`, `recordingUrl`, and AI-analysis status. It may mix call-log and follow-up-task concepts.
- `counselling_sessions` is linked to users but not currently linked to canonical leads.
- EOD target formulas currently exist in frontend logic and must move to the API.
- `eod_reports` has a unique user/date key and a JSONB payload.
- AI audio processing currently uses an in-memory queue; that queue is not durable across process restarts.

Before changing tables, inventory all read/write paths, callback handlers, reports, scheduled jobs, and foreign keys. Preserve existing telephony callback behavior until a replacement has been tested. Do not drop or rename legacy fields in the first migration.

## 3. Core concepts

### 3.1 Call record

An immutable historical record of an attempt to contact a lead. It includes the timestamp, actor, duration, outcome, notes, and optional recording/AI-analysis references.

A call record is not itself a promise to contact the lead again.

### 3.2 Follow-up task

An actionable obligation to contact or otherwise progress a lead by a due date/time. It has an owner, due time, status, priority, and completion history.

A follow-up task may be created manually or from a call outcome that explicitly requests a callback. It should not be inferred from every call record.

### 3.3 Counselling session

A scheduled appointment linked to a canonical lead and the responsible counsellor. It has a lifecycle and append-only reschedule/status history.

### 3.4 EOD report

A per-user, per-business-date report that records activity and target attainment. Target rules are calculated by the API and snapshotted at submission so later configuration changes do not rewrite historical results.

## 4. Call logging

### 4.1 MVP call workflow

1. Staff opens a lead they are authorized to access.
2. Staff starts or completes a manual call and records the outcome.
3. API validates actor, lead access, duration, timestamp, and outcome.
4. API inserts a call record with the actor and lead ID.
5. If the outcome is `callback_requested` and both callback date and callback time are present, the API creates a follow-up task in the same transaction.
6. API writes audit and outbox events, then returns the persisted call and optional follow-up.
7. The UI refreshes the lead timeline and follow-up queue.

The MVP does not require in-app dialing or telephony-provider integration. The user records a call after it occurs.

### 4.2 Allowed outcomes

Use these initial outcomes:

- `connected`
- `no_answer`
- `busy`
- `invalid_number`
- `callback_requested`
- `not_interested`

If business users require a separate `wrong_person`, `voicemail`, or `do_not_contact` outcome, add it as an explicit schema/API change rather than storing arbitrary free-text outcome values.

### 4.3 Call schema

Proposed target fields (adapt names to the repository's Drizzle conventions):

| Field | Type | Rules |
|---|---|---|
| `id` | UUID or repository-standard primary key | Stable ID |
| `lead_id` | FK to `leads.id` | Required for CRM calls |
| `enquiry_id` | nullable FK | Optional attribution to the specific enquiry |
| `actor_user_id` | FK to `users.id` | Required; never trust client actor ID |
| `occurred_at` | timestamptz | Required |
| `duration_seconds` | integer | Non-negative, bounded by validation |
| `outcome` | enum/check-constrained text | Required, from allowed values |
| `notes` | text | Length-limited; sanitize rendered output |
| `recording_ref` | nullable reference | Access-controlled; avoid public URLs |
| `source` | enum/text | `manual` initially; future provider values |
| `provider_event_id` | nullable text | Unique with provider when telephony arrives |
| `created_at` | timestamptz | Server timestamp |

The actor is derived from the authenticated session. If staff may log calls performed by another authorized employee, that must be a separate permissioned action with both actor and attributed performer recorded.

### 4.4 Validation

- Reject negative duration and implausibly large durations according to a documented cap.
- Reject timestamps too far in the future; allow a configured clock-skew tolerance.
- Do not allow a caller to assign the call to an arbitrary lead outside their access scope.
- Store timestamps in UTC.
- Sanitize notes at output and never execute/render them as HTML.
- Keep recording references private and short-lived when generating playback URLs.
- Do not allow an AI analysis to overwrite the manually recorded call outcome without an explicit reviewed correction workflow.

### 4.5 Idempotency

Call creation must support idempotency for retries. For future provider callbacks, use a unique provider/event identifier. A repeated call submission with the same idempotency key and request hash returns the existing result; reusing a key with different content returns a conflict.

Call creation and callback-task creation are atomic. A retry must not create a second callback task.

## 5. Callback and follow-up creation

### 5.1 Callback rule

Create a callback follow-up only when:
- call outcome is `callback_requested`; and
- both callback date and callback time are supplied; and
- the resulting due timestamp is valid and in the future, unless the product explicitly permits immediate overdue tasks.

If the outcome is `callback_requested` but either date or time is missing, persist the call and return a validation warning or a structured `callback_details_required` result. Do not silently create a task with a guessed due time.

The user may save the call first and add the follow-up later, but the UI must clearly show that the callback task was not created.

### 5.2 Atomic behavior

Within one database transaction:
1. Validate lead access and callback data.
2. Insert call record.
3. Insert follow-up task with `source_call_id` and owner.
4. Write audit/outbox events.
5. Commit.

Use a unique constraint or idempotent task-creation key on the source call when only one callback task is permitted per call. If multiple callback tasks are a supported business case, use an explicit task key and do not depend on accidental duplicate inserts.

## 6. Follow-up task model and lifecycle

### 6.1 Proposed fields

| Field | Type | Notes |
|---|---|---|
| `id` | UUID or standard key | Stable task ID |
| `lead_id` | FK to canonical lead | Required |
| `enquiry_id` | nullable FK | Optional source context |
| `source_call_id` | nullable FK to call record | Callback origin |
| `owner_user_id` | FK to users | Current task owner |
| `created_by_user_id` | FK to users | Creator |
| `due_at` | timestamptz | Required, UTC |
| `priority` | enum or constrained smallint | Lower value means higher priority if numeric |
| `status` | enum/check | `open`, `completed`, `cancelled` |
| `task_type` | enum/check | `callback`, `contact_attempt`, `document_request`, `other` |
| `title` | bounded text | Required |
| `notes` | bounded text | Optional |
| `completed_at` | nullable timestamptz | Set by server |
| `completed_by_user_id` | nullable FK | Set by server |
| `cancelled_at` | nullable timestamptz | Set by server |
| `cancelled_by_user_id` | nullable FK | Set by server |
| `created_at`, `updated_at` | timestamptz | Server timestamps |

Do not blindly rename existing `follow_ups`. First map current columns and callers to these concepts. A staged migration may retain the old table as a compatibility layer, create a dedicated call table, and split actionable tasks later.

### 6.2 Lifecycle

Allowed transitions:

- `open -> completed`
- `open -> cancelled`
- `completed` and `cancelled` are terminal for ordinary users.

Corrections to completed tasks require a privileged, audited correction action rather than silently reopening history. If reopening is a product requirement, implement a separate explicit transition and record every state change.

### 6.3 Queue filters and ordering

The default queue should include tasks the current user is authorized to view and act on, with filters for:
- overdue;
- due today;
- upcoming;
- high priority;
- owner/team;
- status;
- lead/programme/source, where authorized.

Default ordering:
1. overdue tasks first, ordered by oldest `due_at`;
2. tasks due today, ordered by `due_at`;
3. future tasks, ordered by `due_at`;
4. within equal urgency, higher priority first;
5. stable tie-breaker by task ID.

Do not use browser-local time to decide whether a task is overdue. The API should compute filters using the configured business timezone and a single server-provided `as_of` timestamp.

### 6.4 Timezone policy

Store `due_at` and event timestamps in UTC. Configure an IANA timezone for the organization or team. Use that timezone for:
- due-today boundaries;
- EOD business date;
- target-period calculations;
- manager reports and date filters.

The UI displays local times based on the configured policy and may also show the timezone abbreviation. Daylight-saving transitions must be tested for any region that observes them. Do not store ambiguous local timestamps without their timezone/offset.

### 6.5 Ownership and transfers

- Follow-up tasks have an explicit owner independent of the lead's current owner.
- On lead reassignment, apply the configured policy: keep task ownership, transfer open tasks with the lead, or require review.
- Completed tasks never change owner and remain historical records.
- Task reassignment requires permission and audit history.
- Do not silently reassign a task simply because its owner becomes inactive; use the configured inactive-owner policy and a manager queue.

## 7. Counselling sessions

### 7.1 Relationship to leads and users

The target model links each counselling session to:
- canonical `lead_id`;
- assigned counsellor `counsellor_user_id`;
- creator/scheduler `created_by_user_id`;
- optional enquiry/source context.

The current repository table is linked to users but not canonical leads. Inspect existing semantics before migrating. Do not infer a lead relationship from an arbitrary user ID without a reviewed mapping.

### 7.2 Session states

Use:
- `scheduled`
- `completed`
- `cancelled`
- `no_show`

A reschedule normally updates the scheduled time on the same session ID and appends a reschedule-history row. Do not create a new session for every reschedule unless product reporting explicitly wants each reschedule represented as a separate appointment. Preserve the original time and every subsequent change in history.

### 7.3 Proposed session fields

| Field | Type | Notes |
|---|---|---|
| `id` | UUID or existing primary key | Stable session identity |
| `lead_id` | FK to leads | Required for CRM-created sessions |
| `counsellor_user_id` | FK to users | Required |
| `created_by_user_id` | FK to users | Required |
| `scheduled_at` | timestamptz | UTC |
| `duration_minutes` | positive integer | Configurable default |
| `status` | constrained enum/text | One of the states above |
| `completed_at` | nullable timestamptz | Set by API |
| `outcome` | nullable structured value/text | Controlled values preferred |
| `notes` | nullable text | Length-limited and access-controlled |
| `created_at`, `updated_at` | timestamptz | Server timestamps |

Use the existing table's actual field names if equivalent. The table must support lead linkage and audit history without breaking current consumers.

### 7.4 Scheduling and rescheduling

- Verify the lead and counsellor are visible to the caller.
- Verify the counsellor has the required CRM role and is active.
- Validate the time, duration, and configured scheduling rules.
- Check conflicting appointments if the product requires exclusive counsellor calendars; define conflict policy before enforcing it.
- On reschedule, append previous time, new time, actor, timestamp, and reason.
- Emit notification events through the outbox after commit.
- Cancelling a session records actor, timestamp, and reason.
- Session history is not deleted when the lead is merged; references must be reconciled to the surviving lead where safe.

### 7.5 EOD effect

Only sessions with status `completed` count toward counselling totals used in EOD formulas. Scheduled, cancelled, and no-show sessions do not count. Count by the session's effective completion time/business date, not by the original scheduled date, unless the approved reporting policy states otherwise.

## 8. End-of-day (EOD) targets and reports

### 8.1 Existing target formula

The repository review identified the current target formulas:

- `dialTarget = max(0, 120 - totalCounselling * 15)`
- `connectTarget = max(30, 50 - totalCounselling * 5)`
- talk-time target = **90 minutes**

These formulas currently exist in frontend logic. The API must become the sole authority for calculation and validation. Confirm with business owners whether these values are still correct before production enablement.

### 8.2 Target service

Implement a pure domain function, for example:

```text
calculateEodTargets(completedCounsellingCount, config):
    dialTarget = max(config.dialFloor,
                     config.dialBaseline - completedCounsellingCount * config.dialsReducedPerSession)
    connectTarget = max(config.connectFloor,
                        config.connectBaseline - completedCounsellingCount * config.connectsReducedPerSession)
    talkTargetSeconds = config.talkTargetMinutes * 60
    return target snapshot
```

Initial configuration matching the identified formulas:
- `dialBaseline = 120`
- `dialFloor = 0`
- `dialsReducedPerSession = 15`
- `connectBaseline = 50`
- `connectFloor = 30`
- `connectsReducedPerSession = 5`
- `talkTargetMinutes = 90`

Store the effective target configuration version and the calculated targets in the report snapshot. Future config changes affect new reports only.

### 8.3 Counselling count

Define `totalCounselling` as the number of completed sessions attributed to the reporting user and business date under the approved attribution rule. The MVP proposal is sessions for which the user is the responsible counsellor and `completed_at` falls within the business date in the configured timezone.

Do not count reschedules as additional sessions. Do not let a client submit an arbitrary counselling count to influence targets.

### 8.4 Report schema and submission

The existing `eod_reports` table has a unique user/date key and JSONB payload. Inspect its current payload contract and consumers before extending it.

The target report snapshot should include:
- `user_id`;
- `business_date`;
- completed counselling count;
- target values and config version;
- submitted actuals: dials, connects, talk time, and other approved metrics;
- calculated achievement values;
- submission timestamp and actor;
- status and revision number;
- optional manager amendment metadata.

Unique constraint: one current report per `(user_id, business_date)`, with revisions represented in a revision table or append-only revision collection. Do not overwrite prior submitted values without retaining the previous revision.

### 8.5 Submission and validation

1. API resolves the reporting user from session or verifies authorized manager action.
2. API determines business date using configured timezone and validates that the date is in the allowed submission window.
3. API calculates completed counselling count from persisted sessions.
4. API calculates target snapshot using the server-owned formula.
5. API validates actuals as non-negative and within documented bounds.
6. API computes attainment values and persists report plus revision.
7. API writes audit/outbox events and returns the persisted report.

The client may display a preview, but the server recalculates during submission. If a submitted report already exists, return the existing report or require an explicit amendment workflow; do not silently replace it.

### 8.6 Locking and amendments

- A submitted report is locked against ordinary edits.
- A manager may reopen or amend only with explicit permission and a reason.
- Every amendment creates a revision containing the previous values, new values, actor, reason, and timestamp.
- Reopening does not erase the original submission timestamp or original target snapshot.
- Reports should be idempotent by `(user_id, business_date, submission_key)` or a documented equivalent.
- A correction to a counselling session after EOD submission must not silently rewrite the report; require a report amendment/recalculation policy.

### 8.7 Achievement calculations

Define calculation and rounding rules centrally. For a target of zero, do not divide by zero; represent achievement as not applicable or a documented special value. Store raw counts/seconds as integers and derive display percentages consistently. Avoid floating-point drift for persisted monetary or ratio values; use fixed-precision numeric values or calculate on read.

## 9. Authorization and audit

All actions must use the CRM authorization layer from Specification 4.

| Action | Minimum authorization concept |
|---|---|
| Log call | Lead visibility plus call-create permission |
| View recording | Lead visibility plus recording-specific permission |
| Create/complete follow-up | Lead/task visibility and task action permission |
| Reassign follow-up | Task-management permission and valid scope |
| Schedule/reschedule counselling | Lead visibility plus counselling-management permission |
| Mark counselling complete/no-show | Session action permission |
| Submit own EOD | Own-report permission |
| View team EOD | Team-report permission and scope |
| Reopen/amend EOD | Manager amendment permission and mandatory reason |

Use server-derived actor IDs and record:
- actor;
- action;
- entity type and ID;
- timestamp;
- request/correlation ID;
- before/after summary where appropriate;
- reason for exceptional changes.

Audit logs must not copy full call notes, contact details, or recording URLs unnecessarily. Keep sensitive payloads out of generic application logs.

## 10. Proposed API contracts

Align exact paths and naming with existing API conventions before implementation.

| Operation | Proposed endpoint | Behavior |
|---|---|---|
| Create call | `POST /api/crm/leads/:leadId/calls` | Idempotent; may atomically create callback task |
| List lead calls | `GET /api/crm/leads/:leadId/calls` | Scoped, paginated timeline |
| Create follow-up | `POST /api/crm/leads/:leadId/follow-ups` | Validates owner, due time, and permission |
| List follow-up queue | `GET /api/crm/follow-ups` | Due/overdue/upcoming and scope filters |
| Complete follow-up | `POST /api/crm/follow-ups/:id/complete` | Conditional state transition |
| Cancel follow-up | `POST /api/crm/follow-ups/:id/cancel` | Reason and audit |
| Reassign follow-up | `POST /api/crm/follow-ups/:id/reassign` | Permission and policy checks |
| Schedule counselling | `POST /api/crm/leads/:leadId/counselling-sessions` | Validates lead/counsellor/time |
| Reschedule counselling | `POST /api/crm/counselling-sessions/:id/reschedule` | Same ID; append history |
| Update session status | `POST /api/crm/counselling-sessions/:id/status` | Controlled state transition |
| EOD preview | `GET /api/crm/eod/preview?date=YYYY-MM-DD` | Server-calculated targets and counts |
| Submit EOD | `POST /api/crm/eod-reports` | Idempotent, server-authoritative |
| View EOD reports | `GET /api/crm/eod-reports` | Own/team scope and date filters |
| Amend EOD | `POST /api/crm/eod-reports/:id/amend` | Manager permission, reason, new revision |

### 10.1 Error codes

Use stable codes such as:
- `LEAD_NOT_ACCESSIBLE`
- `CALL_OUTCOME_INVALID`
- `CALLBACK_DETAILS_REQUIRED`
- `FOLLOW_UP_ALREADY_COMPLETED`
- `FOLLOW_UP_OWNER_INELIGIBLE`
- `COUNSELLOR_NOT_ELIGIBLE`
- `SESSION_TRANSITION_INVALID`
- `EOD_REPORT_ALREADY_SUBMITTED`
- `EOD_REPORT_LOCKED`
- `EOD_AMENDMENT_REASON_REQUIRED`
- `EOD_DATE_OUT_OF_WINDOW`

The API should return actionable field-level validation messages without leaking records outside the caller's scope.

## 11. Background jobs and notifications

Use the durable worker/outbox architecture specified in Specification 2.

Jobs/events may include:
- reminders for upcoming follow-ups;
- escalation for overdue tasks;
- counselling reminders and reschedule notifications;
- EOD submission reminders;
- manager alerts for unsubmitted reports;
- reconciliation of stale tasks owned by inactive users;
- AI-analysis completion events for call records.

Requirements:
- Persist job/outbox intent before acknowledging the originating transaction.
- Use idempotency keys and bounded retries with exponential backoff.
- Distinguish retryable provider errors from permanent invalid-recipient/configuration errors.
- Record delivery attempts and final state.
- Do not send repeated reminders after a task is completed/cancelled.
- Recheck task/session/report state immediately before sending a delayed notification.
- Respect notification preferences, contact consent, and retention policies.

The existing in-memory AI audio queue is not durable. For MVP, AI analysis must be optional and failure must not block call logging. Future AI jobs should be persisted durably and retried safely. AI results may suggest classifications or summaries but cannot change lead status, ownership, EOD actuals, or conversion state without an authorized human/API workflow.

## 12. Migration and compatibility plan

### Phase A — Inventory and contracts
1. Locate every read/write of `follow_ups`, `counselling_sessions`, and `eod_reports`.
2. Identify API routes, telephony GSM callbacks, AI service consumers, frontend forms, reports, and scheduled jobs.
3. Document existing field semantics and historical data quality.
4. Add tests around current behavior before refactoring.

### Phase B — Additive schema changes
1. Add canonical lead links and actor/owner fields where missing.
2. Add dedicated call records or a clear call-log representation without deleting existing fields.
3. Add follow-up state/history fields and indexes.
4. Add counselling `lead_id` and reschedule/status history.
5. Add EOD target/config/revision snapshot fields.
6. Add outbox/audit records as needed.
7. Use nullable fields and compatibility reads while backfill runs.

### Phase C — Backfill and validation
1. Backfill lead links only where deterministic evidence exists.
2. Place ambiguous counselling/session mappings into a reconciliation queue; do not guess from unrelated user IDs.
3. Map legacy follow-up rows into call/task concepts only where the semantics are clear.
4. Compare row counts, null rates, duplicate keys, and report totals.
5. Run shadow calculations for EOD targets and compare with current frontend results.

### Phase D — Dual-read or controlled cutover
1. Deploy API support before changing the CRM UI.
2. Use compatibility adapters for legacy telephony callbacks.
3. Switch one workflow at a time.
4. Compare new and legacy results during a limited observation period.
5. Keep a rollback switch until data integrity and reports are verified.

### Phase E — Contract cleanup
Only after all callers have moved:
- remove deprecated fields or compatibility adapters;
- tighten `NOT NULL` and check constraints;
- remove obsolete frontend formulas;
- update operational documentation.

Do not combine a destructive schema migration and a user-facing workflow launch in one release.

## 13. Indexing and data integrity

Candidate indexes, adapted to actual table names and query plans:

- calls: `(lead_id, occurred_at DESC)`;
- follow-ups: partial index on `(owner_user_id, due_at)` where status is open;
- follow-ups: `(lead_id, status, due_at)`;
- counselling sessions: `(counsellor_user_id, scheduled_at)` and `(lead_id, scheduled_at)`;
- EOD reports: unique `(user_id, business_date)`;
- counselling history: `(session_id, changed_at DESC)`;
- call provider events: unique `(provider, provider_event_id)` when both are present.

Use database constraints for allowed states, non-negative durations, and unique report keys. Avoid adding every proposed index blindly: validate against actual SQL queries and `EXPLAIN ANALYZE`, and account for write overhead.

## 14. Acceptance and test plan

### 14.1 Call logging
- [ ] A staff member with lead access can log a valid call.
- [ ] A staff member without lead access cannot log or inspect a call.
- [ ] Negative duration and invalid outcomes are rejected.
- [ ] Retrying the same call request does not create duplicate calls.
- [ ] A callback outcome with both date and time creates exactly one follow-up.
- [ ] Missing callback date or time does not invent a due time.
- [ ] Failure to send a notification does not roll back a saved call.

### 14.2 Follow-ups
- [ ] Queue ordering matches overdue/due-today/upcoming rules and priority tie-breaks.
- [ ] Due-today is calculated in the configured business timezone.
- [ ] Completed/cancelled tasks are not returned in the open queue.
- [ ] Two concurrent completion requests result in one successful state transition.
- [ ] Lead transfer follows the configured open-task ownership policy.
- [ ] Completed task history and ownership are immutable.
- [ ] A delayed reminder is suppressed if the task has since completed/cancelled.

### 14.3 Counselling
- [ ] A session is linked to the correct canonical lead and counsellor.
- [ ] Rescheduling keeps the same session ID and appends history.
- [ ] Cancelled/no-show/scheduled sessions do not count toward EOD.
- [ ] Only completed sessions count according to the configured attribution rule.
- [ ] Unauthorized users cannot change session state or read sensitive notes.

### 14.4 EOD
- [ ] API formula results match the approved formula and boundary cases.
- [ ] Client-supplied counselling counts cannot change targets.
- [ ] Target configuration and calculated targets are snapshotted.
- [ ] One report per user/business date is enforced.
- [ ] Repeated submission is idempotent or returns an explicit already-submitted result.
- [ ] Submitted reports cannot be edited without authorized amendment.
- [ ] Amendments preserve original values, actor, reason, and timestamp.
- [ ] Target zero avoids divide-by-zero and follows the approved display policy.

### 14.5 Operational tests
- [ ] Legacy GSM callback still works during migration.
- [ ] AI service restart does not lose durable jobs after the worker migration.
- [ ] Worker retries do not create duplicate reminders or follow-up tasks.
- [ ] Timezone and daylight-saving boundary tests pass where applicable.
- [ ] API p95 ≤ 500 ms under the agreed baseline; follow-up queue queries use indexes.
- [ ] Error rate < 1% under baseline load; no unauthorized data exposure.

## 15. Open decisions

1. **EOD formula approval:** Confirm the identified formulas and 90-minute talk target are still the intended business policy.
2. **Timezone:** Select the organization/team IANA timezone used for business dates and due-today calculations.
3. **Follow-up task ownership on lead transfer:** Retain owner, transfer open tasks, or require review?
4. **Follow-up completion correction:** Can managers reopen a task, or only create an audited correction?
5. **Counselling attribution:** Count completed sessions by assigned counsellor, actual completing user, or another attribution rule?
6. **Counselling scheduling conflicts:** Must a counsellor be prevented from having overlapping sessions?
7. **Callback validity:** May callback tasks be created for an immediate/past time, or must due time be future?
8. **EOD submission window:** How many prior business days can staff submit or amend?
9. **Report metrics:** Which actuals beyond dials, connects, talk time, and counselling are required?
10. **Legacy mapping:** Which existing `follow_ups` rows are call logs vs actionable tasks, and what evidence is sufficient to migrate them?
11. **Telephony scope:** Is a provider integration explicitly excluded from MVP, with manual logging as the initial release?
12. **AI analysis:** Which AI fields are currently relied on by production consumers, and what failure/retry SLA is required?

## 16. Definition of done

Sales Operations is ready for acceptance when:
- call logs and follow-up tasks have unambiguous semantics;
- callback task creation is atomic and idempotent;
- queue ordering and timezone behavior are tested;
- counselling sessions are linked to canonical leads with preserved history;
- EOD targets are calculated and validated by the API;
- submitted reports are immutable except through audited amendment;
- legacy integrations remain functional through the migration;
- notification and AI processing failures cannot lose core sales activity;
- authorization, concurrency, and regression tests pass.
