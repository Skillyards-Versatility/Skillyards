# SPEC-8 — CRM API Contracts

**Status:** Proposed implementation contract  
**Repository:** `/home/chakresh/Skillyards`  
**Primary implementation:** `apps/api` using existing Next.js Route Handlers, shared domain/database packages in `packages/db`, and `apps/crm` as the client  
**Related specifications:** `02-architecture-detailed.md` through `07-conversion-notifications-workers-detailed.md`

> **Contract rule:** The API is the authorization and business-rule boundary. The CRM browser must not connect directly to Neon/PostgreSQL. Paths and field names below are proposed contracts to align with the repository's current conventions before implementation; they are not claims about existing routes.

## 1. Design principles

1. **Server-authoritative behavior:** validation, permissions, lead visibility, duplicate decisions, assignment, EOD targets, conversion state, and notification recipients are decided by the API.
2. **Stable contracts:** return predictable JSON envelopes and machine-readable error codes.
3. **Idempotency:** operations that create records or trigger side effects accept an idempotency key or have a domain-specific unique event key.
4. **Scoped access:** every endpoint queries records within the caller's authorized scope; avoid fetching globally and filtering only in the UI.
5. **Backward compatibility:** existing website, telephony, admin, student, and payment routes must continue to work during staged rollout.
6. **Auditable writes:** assignment, duplicate resolution, merge, transfer, conversion, EOD amendment, and privileged administrative changes write audit records.
7. **No provider calls inside core transactions:** persist outbox intent, commit, and dispatch asynchronously.
8. **Pagination and limits:** list endpoints must have bounded page size and deterministic sorting.
9. **Versioned behavior:** breaking contract changes require an explicit versioning or compatibility plan.
10. **No hidden success:** asynchronous operations return `pending`/`processing` until the authoritative operation succeeds.

## 2. API conventions

### 2.1 Base path and deployment

- CRM UI: `https://crm.skillyards.in`
- Existing API: current API deployment, extended with `/api/crm/*` and selected `/api/internal/*` service endpoints.
- Website intake may use a public intake endpoint, but it must have channel-specific validation, abuse protection, and rate limits.
- Exact deployment host and route prefix must be confirmed against the current repository before release.

### 2.2 Request and response format

Use JSON for request and response bodies unless a route explicitly accepts multipart uploads or a provider webhook format.

Recommended successful response envelope:

```json
{
  "data": {},
  "meta": {
    "requestId": "req_...",
    "nextCursor": null
  }
}
```

For a single-record endpoint, `data` contains the record or stable operation result. For list endpoints, `data` is an array and `meta.nextCursor` indicates whether another page exists. If the existing API already uses a different stable envelope, preserve it rather than creating inconsistent conventions solely for CRM.

Recommended error envelope:

```json
{
  "error": {
    "code": "LEAD_NOT_ACCESSIBLE",
    "message": "The requested lead is unavailable.",
    "details": {},
    "requestId": "req_..."
  }
}
```

- `code` is stable and suitable for client branching.
- `message` is safe for display but not a substitute for the code.
- `details` may contain field-level validation information, never secret values or records outside the caller's scope.
- `requestId` supports troubleshooting.
- Do not expose stack traces, SQL errors, tokens, provider secrets, or internal hostnames.

### 2.3 HTTP status conventions

| Status | Meaning |
|---|---|
| `200 OK` | Successful read or update |
| `201 Created` | A new resource was created synchronously |
| `202 Accepted` | Durable asynchronous operation accepted but not complete |
| `204 No Content` | Successful operation with no response body, where useful |
| `400 Bad Request` | Malformed JSON or malformed request syntax |
| `401 Unauthorized` | Missing/invalid session |
| `403 Forbidden` | Authenticated but lacks permission |
| `404 Not Found` | Missing resource or resource intentionally hidden by scope policy |
| `409 Conflict` | State conflict, idempotency conflict, already-submitted, capacity, or concurrency conflict |
| `413 Payload Too Large` | Request exceeds body/upload limit |
| `415 Unsupported Media Type` | Unsupported content type |
| `422 Unprocessable Entity` | Syntactically valid but invalid field/business input |
| `429 Too Many Requests` | Rate limit exceeded |
| `500 Internal Server Error` | Unexpected server error |
| `502/503/504` | Upstream dependency failure/unavailable/timeout, when applicable |

Do not return `200` with an error-shaped body for a failed operation. Use the same error envelope consistently.

### 2.4 Headers

- `Content-Type: application/json`
- `X-Request-Id` or an equivalent request correlation header; generate one if absent and validate supplied values.
- `Idempotency-Key` for supported create/side-effecting requests.
- Session cookie follows the existing auth scheme; CRM session hardening and revocation are specified in File 4.
- CSRF protection applies to cookie-authenticated state-changing requests.
- Internal service routes require service authentication and replay protection, not a browser session alone.

### 2.5 Timestamps and dates

- API timestamps use ISO 8601 UTC instants, e.g. `2026-10-15T10:00:00Z`.
- Business dates use `YYYY-MM-DD` and are interpreted in the configured organization/team IANA timezone.
- Do not treat a date-only EOD value as UTC midnight without applying the business timezone policy.
- IDs are opaque to clients. Do not require clients to infer database key structure.

## 3. Authentication, authorization, and validation pipeline

Every request should follow this order:

1. Apply request-size, content-type, and rate-limit controls.
2. Parse the request and validate its schema.
3. Authenticate the user/service.
4. Resolve current identity, CRM roles, team memberships, and permission grants.
5. Load the target record within authorized scope.
6. Validate domain state transitions and related-record constraints.
7. Perform the transaction with concurrency controls.
8. Write audit and outbox events in the transaction where applicable.
9. Return the persisted result and request ID.

Avoid existence leaks: if the caller cannot access a lead, do not return its phone, email, owner, duplicate candidates, or conversion status. Use `404` when policy requires hiding the record's existence.

### 3.1 Validation conventions

- Use shared schemas for request and response DTOs where supported by the existing TypeScript stack.
- Reject unknown security-sensitive fields rather than trusting them.
- Never trust client-supplied `actorUserId`, role, team scope, ownership, target values, or conversion milestone.
- Apply explicit maximum lengths, enum validation, integer bounds, and date-window validation.
- Normalize contact values in the domain service, preserving original values.
- Sanitize user-authored text on output and prevent HTML/script injection.
- Avoid logging request bodies containing contact data or notes.

## 4. Core resource contracts

### 4.1 Leads

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/crm/leads` | Scoped search/list |
| `POST` | `/api/crm/leads` | Staff-created intake |
| `GET` | `/api/crm/leads/:leadId` | Lead details |
| `PATCH` | `/api/crm/leads/:leadId` | Update allowed lead fields |
| `GET` | `/api/crm/leads/:leadId/timeline` | Combined, paginated activity timeline |
| `GET` | `/api/crm/leads/:leadId/enquiries` | Enquiries associated with the lead |
| `POST` | `/api/crm/leads/:leadId/archive` | Archive/disqualify according to lifecycle policy |
| `POST` | `/api/crm/leads/:leadId/restore` | Restore if policy permits |

**List query parameters**
- `cursor`: opaque pagination cursor.
- `limit`: default 25, maximum 100.
- `q`: bounded search query.
- `status`, `ownerId`, `teamId`, `source`, `campaign`, `programme`, `createdAfter`, `createdBefore`.
- `sort`: allow-listed fields and direction; never interpolate raw client values into SQL.

**Create/update rules**
- Staff creation uses the same intake/duplicate/assignment domain service as website intake.
- `PATCH` accepts only explicitly editable fields; it must not mutate owner, team, merge state, conversion milestones, or audit fields without their dedicated operations.
- List filtering is permission-scoped before pagination.
- Timeline merges events from multiple tables with a stable ordering key and bounded page size; it must not expose unauthorized call recordings or internal audit payloads.

### 4.2 Website enquiry intake

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/intake/enquiries` | Public/website enquiry intake |
| `GET` | `/api/crm/enquiries/:enquiryId` | Authorized enquiry detail |
| `POST` | `/api/crm/enquiries/:enquiryId/associate` | Associate enquiry after review, if needed |

The public endpoint must not require a CRM user session, but must enforce:
- source/channel validation;
- rate limits and bot/abuse protection;
- strict request schema and maximum payload size;
- safe handling of attribution fields;
- idempotency when the website can supply a stable request key.

Do not trust a public client's requested owner/team, CRM status, duplicate-resolution decision, or conversion state.

### 4.3 Duplicate review and merge

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/crm/duplicate-reviews` | Scoped review queue |
| `GET` | `/api/crm/duplicate-reviews/:reviewId` | Review details |
| `POST` | `/api/crm/duplicate-reviews/:reviewId/claim` | Claim case |
| `POST` | `/api/crm/duplicate-reviews/:reviewId/resolve` | Resolve to existing/new/dismissed |
| `GET` | `/api/crm/leads/:leadId/duplicate-candidates` | Bounded candidate search |
| `POST` | `/api/crm/leads/:leadId/merge` | Merge with explicit survivor |

Resolution payload should contain:
- `resolution`: one of the supported resolution actions;
- `survivorLeadId` when resolving to an existing lead/merging;
- `reasonCode`;
- bounded `reasonText`;
- optional `expectedVersion` for optimistic concurrency.

Return `409 REVIEW_ALREADY_RESOLVED` for a stale competing resolution. Candidate results must not be returned to unauthorized teams/users.

### 4.4 Assignment and teams

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/crm/teams` | List teams in caller's scope |
| `GET` | `/api/crm/teams/:teamId/members` | Effective/current members |
| `POST` | `/api/crm/teams/:teamId/members` | Add effective-dated membership |
| `PATCH` | `/api/crm/teams/:teamId/members/:membershipId` | End/change membership |
| `GET` | `/api/crm/assignment-rules` | List rules |
| `POST` | `/api/crm/assignment-rules` | Create rule |
| `PATCH` | `/api/crm/assignment-rules/:ruleId` | Create new version/update config |
| `POST` | `/api/crm/assignment/preview` | Dry-run routing |
| `POST` | `/api/crm/leads/:leadId/assign` | Manual assignment |
| `POST` | `/api/crm/leads/:leadId/transfer` | Cross-team transfer/approval flow |
| `GET` | `/api/crm/unassigned-leads` | Authorized unassigned queue |

Rules:
- Manual assignment and transfer use the same eligibility/capacity service as automatic assignment.
- Rule preview has no side effects and does not reserve capacity.
- Cross-team transfer requires the permission/approval defined by policy.
- Rule edits do not automatically reassign existing leads.
- Assignment response includes current owner/team and a safe decision summary, not private candidate data.

### 4.5 Calls and follow-ups

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/crm/leads/:leadId/calls` | Create call record |
| `GET` | `/api/crm/leads/:leadId/calls` | Call history |
| `POST` | `/api/crm/leads/:leadId/follow-ups` | Create task |
| `GET` | `/api/crm/follow-ups` | Scoped task queue |
| `GET` | `/api/crm/follow-ups/:taskId` | Task detail |
| `PATCH` | `/api/crm/follow-ups/:taskId` | Update allowed open-task fields |
| `POST` | `/api/crm/follow-ups/:taskId/complete` | Complete task |
| `POST` | `/api/crm/follow-ups/:taskId/cancel` | Cancel task |
| `POST` | `/api/crm/follow-ups/:taskId/reassign` | Reassign task with policy checks |

Call creation is idempotent. If outcome is `callback_requested`, both callback date and time are required to create the callback task. Call and task creation commit atomically. Do not expose recording URLs without a separate access check and secure playback flow.

### 4.6 Counselling sessions

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/crm/leads/:leadId/counselling-sessions` | Schedule session |
| `GET` | `/api/crm/counselling-sessions` | Scoped session list/calendar |
| `GET` | `/api/crm/counselling-sessions/:sessionId` | Session detail |
| `POST` | `/api/crm/counselling-sessions/:sessionId/reschedule` | Reschedule same session ID |
| `POST` | `/api/crm/counselling-sessions/:sessionId/status` | Complete/cancel/no-show transition |

Rescheduling appends history and sends notifications through the outbox. Only completed sessions count toward EOD counselling totals under the approved attribution rule.

### 4.7 EOD reports

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/crm/eod/preview?date=YYYY-MM-DD` | Server-calculated targets/counts |
| `POST` | `/api/crm/eod-reports` | Submit report |
| `GET` | `/api/crm/eod-reports` | Scoped report list |
| `GET` | `/api/crm/eod-reports/:reportId` | Report detail/history |
| `POST` | `/api/crm/eod-reports/:reportId/amend` | Manager amendment |

The server calculates targets using the approved formula and persisted completed counselling sessions. The client cannot submit its own target values or counselling count as authoritative data. Submitted reports are locked except through an audited amendment operation.

### 4.8 Conversion

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/crm/leads/:leadId/conversion` | Start conversion |
| `GET` | `/api/crm/leads/:leadId/conversion` | Get current conversion state |
| `GET` | `/api/crm/conversions/:conversionId` | Conversion detail |
| `POST` | `/api/crm/conversions/:conversionId/resolve` | Resolve ambiguous student match/retry |
| `POST` | `/api/internal/admissions/events` | Authenticated admissions event ingestion |

Conversion may return `202 Accepted` while an authoritative admissions operation is pending. `fully_enrolled` must only come from the authoritative admissions workflow. CRM conversion must not independently create payment, receipt, or installment records.

### 4.9 Notifications and preferences

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/crm/notifications` | Current user's notifications |
| `POST` | `/api/crm/notifications/:notificationId/read` | Mark own notification read |
| `POST` | `/api/crm/notifications/read-all` | Mark current user's visible notifications read |
| `GET` | `/api/crm/notification-preferences` | Get preferences |
| `PUT` | `/api/crm/notification-preferences` | Update supported preferences |

Notification endpoints never permit the caller to read or mark another user's notification as read. Provider delivery status and outbox administration are internal operational capabilities, not ordinary CRM endpoints.

## 5. List, search, and pagination contracts

### 5.1 Cursor pagination

Prefer cursor pagination for frequently changing lists:
- `limit` defaults to 25 and has a hard maximum of 100.
- `nextCursor` is opaque and signed or otherwise tamper-resistant.
- Sort order includes a stable unique tie-breaker (usually ID).
- The cursor encodes the last sort values and relevant query/filter version.
- Invalid/expired cursor returns `400 INVALID_CURSOR`.
- Do not expose raw SQL offsets or internal query structure in the cursor.

Offset pagination may be used for small administrative lists if measured and bounded.

### 5.2 Search

- Search only fields explicitly approved for the caller's role and scope.
- Apply minimum/maximum query length and rate limits.
- Escape wildcard characters and use parameterized SQL.
- Phone/email search must not enable broad enumeration by public users.
- Duplicate-candidate search is separate from general lead search and must return only the evidence needed for review.
- Search results and counts must reflect authorization filters, not reveal total global records.

### 5.3 Sorting

Each list has an allow-list of sort fields. Invalid sort field/direction returns `422 INVALID_SORT`. Every query includes deterministic tie-breaking to prevent records being skipped/repeated across cursor pages.

## 6. Concurrency and idempotency contract

### 6.1 Idempotency header

For supported create/side-effecting operations, accept `Idempotency-Key` and scope it by authenticated actor or channel plus operation. Store a canonical request hash and stable result.

- Same key + same request: return the original result.
- Same key + different request: `409 IDEMPOTENCY_KEY_REUSED`.
- Concurrent identical requests: one operation wins; other requests receive the same result or a documented retryable in-progress response.
- A key must not be reused across unrelated operation types.
- Retain keys for a documented period sufficient for client retries.

### 6.2 Operations that require idempotency or unique-event protection

- public enquiry intake;
- staff lead creation;
- call creation and callback-task creation;
- follow-up creation where retries can duplicate work;
- conversion start;
- admissions event ingestion;
- notification delivery;
- scheduled job creation;
- EOD submission;
- import batch/row processing, if imports are in MVP.

### 6.3 Optimistic concurrency

For mutable review/session/report/rule resources, support a version number or `updatedAt` precondition where concurrent editing is plausible. A stale update returns `409 VERSION_CONFLICT` with a safe current version or reload instruction.

Database constraints and locks remain the final authority. Optimistic checks do not replace transaction-safe capacity reservations or conditional state transitions.

## 7. Transaction and side-effect rules

For a state-changing operation, the transaction should include:
- domain row changes;
- required history/revision rows;
- idempotency result;
- audit event;
- outbox event;
- capacity counter/cursor changes when applicable.

External email/push/AI/admissions HTTP calls must happen outside the transaction through the worker or an explicit integration boundary.

If an external operation is asynchronous, return a stable operation ID and `202 Accepted`. Provide a status endpoint or a resource endpoint that exposes its current state. Do not return success before the authoritative operation is durable.

## 8. Internal API and webhooks

### 8.1 Internal endpoints

Internal endpoints are not protected merely because their URL is obscure. Require service-to-service authentication, narrow service permissions, request signatures or an equivalent authenticated transport, timestamp/replay checks where applicable, and rate limits.

### 8.2 Admissions event payload

Proposed shape:

```json
{
  "eventId": "source-event-id",
  "eventType": "admission.fully_enrolled",
  "eventVersion": 1,
  "occurredAt": "2026-10-15T10:00:00Z",
  "studentId": "authoritative-student-id",
  "admissionId": "authoritative-admission-id",
  "correlationId": "conversion-correlation-id"
}
```

Validate the event type/version, source authentication, identifier consistency, and event uniqueness. Persist the event receipt before acknowledging it. Unknown event types should be rejected or quarantined according to an explicit compatibility policy, not silently interpreted.

### 8.3 Webhook response behavior

- Return success only after the event is durably recorded.
- Duplicate event ID with equivalent payload returns success without repeating side effects.
- Duplicate event ID with a different payload is a security/data-integrity conflict and must be alerted.
- If durable persistence fails, return a retryable server error so the sender can retry.
- Do not expose internal processing stack traces to the sender.

## 9. File upload and recording access

If the API supports recording upload or playback:
- upload directly to private object storage using a short-lived, scoped signed URL where feasible;
- validate allowed file types, size, and content metadata;
- never trust a filename or MIME type alone;
- keep storage objects private by default;
- issue short-lived playback URLs only after lead/session permission checks;
- avoid storing permanent public recording URLs in lead payloads;
- scan/validate uploads as required by operational policy;
- enforce retention and legal holds for recordings separately from metadata.

The exact upload flow depends on the existing telephony and Cloudflare R2 integration; it must be confirmed during repository implementation.

## 10. Rate limits and abuse controls

Apply configurable limits at route/channel level:
- public intake per IP/source and, where practical, per normalized contact;
- login/session-sensitive endpoints;
- search and duplicate-candidate queries;
- bulk operations and exports;
- call/follow-up creation bursts;
- internal webhook endpoints.

Return `429` with a retry hint where safe. Avoid account-lockout behavior that enables denial-of-service against a staff member. Use bot protection and server-side validation for public forms.

## 11. API error code catalog

A shared error catalog should cover at least:

**Authentication/authorization**
- `UNAUTHENTICATED`
- `FORBIDDEN`
- `LEAD_NOT_ACCESSIBLE`
- `RESOURCE_NOT_ACCESSIBLE`
- `CSRF_INVALID`

**Validation**
- `VALIDATION_ERROR`
- `INVALID_CONTACT`
- `INVALID_CURSOR`
- `INVALID_SORT`
- `PAYLOAD_TOO_LARGE`
- `UNSUPPORTED_MEDIA_TYPE`

**Concurrency/idempotency**
- `IDEMPOTENCY_KEY_REUSED`
- `OPERATION_IN_PROGRESS`
- `VERSION_CONFLICT`
- `REVIEW_ALREADY_RESOLVED`
- `LEAD_ALREADY_MERGED`
- `CAPACITY_EXHAUSTED`
- `ASSIGNEE_NOT_ELIGIBLE`

**Sales operations**
- `CALL_OUTCOME_INVALID`
- `CALLBACK_DETAILS_REQUIRED`
- `FOLLOW_UP_ALREADY_COMPLETED`
- `SESSION_TRANSITION_INVALID`
- `EOD_REPORT_ALREADY_SUBMITTED`
- `EOD_REPORT_LOCKED`
- `EOD_AMENDMENT_REASON_REQUIRED`

**Conversion/integration**
- `DUPLICATE_REVIEW_REQUIRED`
- `STUDENT_MATCH_REVIEW_REQUIRED`
- `CONVERSION_ALREADY_COMPLETED`
- `AUTHORITATIVE_SYSTEM_UNAVAILABLE`
- `INVALID_SOURCE_EVENT`
- `DUPLICATE_EVENT_CONFLICT`

**Configuration**
- `RULE_CONFIGURATION_INVALID`
- `DESTINATION_TEAM_INVALID`
- `APPROVAL_REQUIRED`

Avoid creating multiple codes for the same semantic failure without a reason. Error codes should be documented and tested as part of the contract.

## 12. TypeScript DTO and route organization

Suggested organization, adapted to existing project conventions:

```text
apps/api/
  app/api/
    intake/enquiries/route.ts
    crm/
      leads/route.ts
      leads/[leadId]/route.ts
      leads/[leadId]/calls/route.ts
      leads/[leadId]/follow-ups/route.ts
      duplicate-reviews/route.ts
      assignment-rules/route.ts
      eod-reports/route.ts
      notifications/route.ts
      ...
    internal/
      admissions/events/route.ts
  lib/
    auth/
    http/
    validation/
    rate-limit/
    request-context/

packages/db/
  schema/
  migrations/
  repositories/
  domain/
    leads/
    duplicates/
    assignment/
    calls/
    follow-ups/
    counselling/
    eod/
    conversion/
    notifications/
```

Do not force domain logic into route files. Route handlers should:
1. parse and validate transport input;
2. resolve request/auth context;
3. invoke a domain use case;
4. map domain outcomes to HTTP responses;
5. return a stable DTO.

Use separate request DTOs, internal domain models, and response DTOs. Do not serialize raw Drizzle rows blindly if they contain internal fields, secrets, or relationships not intended for the client.

## 13. Testing strategy

### 13.1 Contract tests

For every endpoint:
- valid request/response schema;
- missing/invalid session;
- insufficient permission and cross-team scope;
- invalid fields and unknown protected fields;
- stable error code/status;
- idempotency replay and conflict;
- pagination limits and invalid cursor;
- audit/outbox event created for successful mutation.

### 13.2 Integration tests

- Public intake cannot set owner/team/CRM status.
- Unauthorized lead IDs do not reveal data through detail, search, timeline, calls, or duplicate endpoints.
- Concurrent assignment cannot violate capacity.
- Duplicate-review race results in one final resolution.
- Callback task is created once with a call.
- EOD target values are server-calculated.
- Conversion response reflects authoritative pending/success state.
- Duplicate/out-of-order admissions events do not downgrade milestones.
- Notification reads are limited to the current recipient.
- Provider failure does not roll back domain state.

### 13.3 Regression tests

Run the existing website enquiry, telephony GSM callback, student creation, payments/receipts, and admin workflows against each migration. Capture critical existing response fields before changing the API envelope. Add compatibility tests before removing any legacy contract.

### 13.4 Performance tests

Measure:
- lead list/search p95 and query plans;
- timeline pagination;
- duplicate candidate query latency;
- assignment endpoint latency and lock contention;
- follow-up queue query latency;
- EOD report list and preview;
- outbox/job polling cost.

Initial architecture goals: ordinary API p95 ≤ 500 ms, assignment p95 ≤ 1 second, error rate < 1% at the agreed baseline load. Define a representative data volume and traffic profile before treating these as release gates.

## 14. Implementation sequence

1. Inventory existing route handlers, auth middleware, response envelope, validation conventions, and API error patterns.
2. Define shared DTOs/error codes and contract-test helpers.
3. Implement scoped lead read/list endpoints first.
4. Add intake, duplicate-review, and assignment endpoints with transaction-safe domain services.
5. Add call/follow-up/counselling and EOD endpoints.
6. Add conversion and internal admissions event contracts.
7. Add notification APIs and durable outbox/job integration.
8. Add rate limits, CSRF/CORS rules, and service authentication.
9. Add contract/integration/regression tests and API documentation.
10. Deploy backward-compatible routes, migrate consumers gradually, and remove legacy behavior only after verified parity.

## 15. Open decisions

1. **Existing response envelope:** What format do current `apps/api` routes use, and should CRM match it exactly?
2. **Validation library:** Which schema-validation library is already installed and standard in the repo?
3. **API base URL:** Which host/path is used by current frontends and telephony callbacks?
4. **Cursor vs offset:** Which existing list endpoints already use cursor pagination?
5. **Public intake abuse protection:** Which rate-limiting/bot-protection infrastructure is currently available?
6. **Internal service auth:** What service-to-service authentication mechanism can the admissions workflow support?
7. **Idempotency retention:** What is the agreed key retention window and cleanup schedule?
8. **OpenAPI generation:** Is an OpenAPI spec already maintained, or should one be introduced for CRM?
9. **Recording access:** Does the current API generate signed R2 URLs, and what is the required expiry?
10. **Versioning policy:** Should CRM remain under `/api/crm` without explicit versioning initially, or follow an existing API version convention?

## 16. Definition of done

API contracts are ready for implementation when existing conventions are inventoried, endpoint DTOs and errors are agreed, permission/scope checks are enforced server-side, all side-effecting writes are idempotent or protected by unique event keys, external effects use the outbox/worker path, and contract/regression tests pass.
