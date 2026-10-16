# SPEC-1 — Identity, Roles, Sessions, and Authorization

**Status:** Proposed security specification based on the confirmed CRM architecture. Validate all integration points against the existing authentication implementation before coding.  
**Identity source:** Existing Skillyards identity and `users` records  
**CRM frontend:** `https://crm.skillyards.in`  
**API namespace:** `/api/crm`  
**Core rule:** Authentication establishes who the user is; authorization determines what the user may do and which records they may access.

## 1. Security objectives

The CRM security model must:

1. Reuse the existing identity system instead of creating a separate user directory.
2. Establish a CRM-specific session with an explicit audience and centralized revocation.
3. Support multiple CRM roles per user without overwriting existing platform roles.
4. Enforce resource-level permissions on every protected API operation.
5. Restrict access by ownership, team scope, counselling responsibility, and explicit grants.
6. Support time-limited, revocable access without changing lead ownership.
7. Audit role changes, access grants, approvals, and sensitive data operations.
8. Prevent direct-ID access, list/search leakage, and unauthorized background-job actions.
9. Fail safely when critical session or authorization state cannot be verified.
10. Keep secrets and unnecessary personal data out of browser storage, logs, and audit snapshots.

## 2. Threat model and trust boundaries

### 2.1 Protected assets

- Lead and enquiry personal/contact information.
- Call notes, callback details, recordings, and AI-generated summaries.
- Counselling schedules and session history.
- Student-linkage and admission milestone information.
- EOD reports and manager corrections.
- Assignment rules, capacity settings, team membership, and role grants.
- Session credentials, provider secrets, and audit history.

### 2.2 Threats to address

- A user changes a URL or resource ID to access another user's lead.
- A user manipulates frontend role or team data.
- An admin session/token is incorrectly accepted by CRM endpoints.
- A revoked/expired session continues to authorize requests.
- A stale temporary grant continues to authorize access.
- CSRF causes a browser to submit an authenticated state-changing request.
- CORS is misconfigured to allow unintended origins.
- Search, exports, history, or notifications expose data that detail endpoints would deny.
- Concurrent role/grant changes race with a protected operation.
- A worker performs an action without a valid service identity or required business guard.
- Logs/audit snapshots accidentally contain credentials or excessive PII.

### 2.3 Trust boundaries

- The browser is untrusted for identity claims, role claims, record scope, and business rules.
- The API is the enforcement point for authentication and authorization.
- PostgreSQL constraints and transactions enforce persistent integrity.
- The worker is a trusted server process, but must use explicit service identity and narrow job permissions.
- External providers are untrusted dependencies; validate webhooks and treat provider responses as fallible.
- Frontend route protection improves UX but never replaces API authorization.

## 3. Identity integration

Use the existing identity system and `users` table. Do not create a separate CRM user directory.

Before implementation, inspect:
- Current login and password-verification flow.
- Existing JWT creation and validation.
- Cookie attributes, domain scope, expiry, and logout behavior.
- Existing middleware/route protection utilities.
- Role source and status/disabled-user checks.
- CORS and CSRF handling.
- User deactivation and password-reset behavior.
- Any existing server-side session store or revocation mechanism.

### 3.1 CRM session establishment

Proposed flow:

1. User completes the approved existing identity login flow.
2. The server validates the identity and checks that the user is active.
3. The server verifies that the user is allowed to access the CRM.
4. The server creates a CRM session record.
5. The server issues a CRM-scoped credential with the required audience and session ID.
6. The browser receives the credential using the approved secure-cookie design.
7. Subsequent CRM API requests validate the credential and server-side session state.

The exact exchange endpoint and whether the identity provider redirects to CRM or the API initiates the exchange must follow the repository's existing authentication pattern. Do not invent a second password flow.

### 3.2 CRM token claims

Illustrative claims only:

```json
{
  "sub": "user-uuid",
  "aud": "skillyards-crm",
  "sid": "session-uuid",
  "iat": 0,
  "exp": 0
}
```

At runtime:
- `sub` identifies the authenticated user.
- `aud` identifies the CRM audience.
- `sid` identifies a server-side session.
- `iat` is issue time.
- `exp` is expiry time.

Do not put authoritative team membership, lead ownership, or long-lived permissions only in the token. Those facts can change during a session. If any claims are cached in the token, define their refresh/invalidation behavior.

## 4. CRM session lifecycle

### 4.1 Proposed `crm_sessions` record

Adapt the table to the existing database/authentication conventions. Do not create a second session store if an existing server-side mechanism already meets these requirements.

| Field | Proposed type | Purpose |
|---|---|---|
| `id` | UUID PK | Session identifier referenced by `sid` |
| `user_id` | UUID FK to `users.id` | Session owner |
| `token_hash` | TEXT nullable | Optional hash/fingerprint if the implementation stores a revocable opaque credential; never store a raw bearer token |
| `created_at` | TIMESTAMPTZ | Creation time |
| `last_seen_at` | TIMESTAMPTZ nullable | Last activity, subject to write-frequency policy |
| `expires_at` | TIMESTAMPTZ | Absolute expiry |
| `revoked_at` | TIMESTAMPTZ nullable | Revocation time |
| `revocation_reason` | TEXT nullable | Logout, admin action, user disabled, security event |
| `created_ip_hash` | TEXT nullable | Optional privacy-reviewed security signal |
| `user_agent_summary` | TEXT nullable | Minimized client metadata |

Indexes:
- `(user_id, expires_at)`
- Partial index for active sessions if useful.
- Do not store raw session tokens or unnecessary device fingerprints.

### 4.2 Session validation

For every protected CRM request:

1. Extract the credential from the configured transport.
2. Verify signature using the existing approved signing/verification configuration.
3. Validate issuer if configured, audience `skillyards-crm`, `exp`, `iat`, and required claims.
4. Resolve the session by `sid`.
5. Confirm session belongs to `sub`.
6. Confirm session is not revoked and has not expired according to server time.
7. Confirm user still exists and is active.
8. Confirm current CRM access is permitted.
9. Continue to permission evaluation for the requested action/resource.

Reject invalid, malformed, expired, revoked, wrong-audience, and mismatched-user sessions with a generic unauthenticated response. Do not reveal whether a particular user/session exists.

### 4.3 Logout and revocation

- `DELETE /api/crm/session` revokes the current CRM session.
- Session revocation must take effect on subsequent protected requests.
- If “log out all sessions” is implemented, it revokes all active CRM sessions for that user.
- Administrative revocation requires explicit permission and an audit event.
- User deactivation, suspected compromise, or credential reset must have a documented policy for revoking CRM sessions.
- Session cleanup may delete expired records only after the approved audit/security retention policy allows it; revocation history may need to be retained separately.

### 4.4 Session duration and renewal

The existing platform token lifetime must be inspected before choosing CRM session durations. Do not silently assume that the existing seven-day JWT expiry is appropriate for CRM.

Define:
- Absolute session lifetime.
- Optional idle timeout.
- Renewal/refresh behavior.
- Reauthentication requirement for high-risk actions.
- Whether sessions are revoked after role removal or team membership changes.

Recommended starting policy: keep absolute lifetime bounded, support immediate server-side revocation, and require reauthentication for high-risk actions if the current identity stack supports it.

### 4.5 Failure policy

If the API cannot check revocation state or current user status, protected CRM requests fail closed. Do not silently accept a token solely because its signature is valid when centralized revocation is unavailable.

## 5. Cookie, CSRF, and CORS security

Exact settings depend on whether CRM and API are same-site and on the existing deployment configuration. Confirm the actual hostnames and browser flow before implementation.

### 5.1 Cookie rules

For cookie-based authentication:
- Set `Secure` in production.
- Set `HttpOnly` for session credentials.
- Set an appropriate `SameSite` policy based on the actual sign-in and API topology.
- Restrict `Domain` to the minimum scope required; avoid broad domain sharing unless necessary.
- Choose `Path` deliberately.
- Do not expose session credentials to JavaScript.
- Never put session credentials in URLs or query strings.

If the design uses a host-only CRM cookie while API requests go to `api.skillyards.in`, verify browser cookie behavior and choose a secure architecture that actually transmits the credential as intended. Do not assume cookie sharing works across hosts without testing.

### 5.2 CSRF protection

If browser authentication uses automatically attached cookies:
- Protect state-changing requests with an approved CSRF strategy, such as a validated CSRF token and/or strict origin checks.
- Validate `Origin`/`Referer` according to the established security policy.
- Use appropriate `SameSite` settings as defense in depth, not as the only control unless justified.
- Do not rely on CORS alone as CSRF protection.
- Test login, logout, session exchange, and all state-changing methods.

If credentials are not automatically attached by the browser, document the alternate threat model and controls.

### 5.3 CORS

- Allow only explicitly approved production and local development origins.
- Include `https://crm.skillyards.in` when CRM browser requests require cross-origin API access.
- Add the actual local CRM origin only after confirming the development port.
- Do not use wildcard origins with credentialed requests.
- Allow only required methods and headers.
- Return the appropriate credential/header policy for the selected session transport.
- Test preflight requests and ensure CORS is not treated as authorization.

## 6. CRM roles and permissions

Initial CRM roles:
- `bda`
- `counsellor`
- `sales_lead`
- `sales_manager`

Users may hold multiple CRM roles. CRM role grants are separate from the existing platform role field. Effective permissions are the union of applicable role permissions, constrained by resource scope, explicit grants, and business restrictions.

### 6.1 Permission model

Prefer named permissions and policy functions rather than scattered checks such as `if role === "sales_manager"` throughout handlers.

Illustrative permission names:
- `crm.lead.read_own`
- `crm.lead.read_team`
- `crm.lead.read_all`
- `crm.lead.create`
- `crm.lead.update_own`
- `crm.lead.update_team`
- `crm.lead.assign`
- `crm.lead.transfer`
- `crm.lead.transfer_approve`
- `crm.duplicate.review_routine`
- `crm.duplicate.review_high_risk`
- `crm.lead.merge`
- `crm.access_grant.create`
- `crm.access_grant.revoke`
- `crm.team.manage`
- `crm.assignment_rule.manage`
- `crm.counselling.manage`
- `crm.eod.submit_own`
- `crm.eod.read_team`
- `crm.eod.reopen`
- `crm.eod.amend`
- `crm.conversion.initiate`
- `crm.conversion.resolve_match`
- `crm.retention.execute`
- `crm.audit.read`
- `crm.settings.manage`

This is a proposed vocabulary. Final names and granularity should be centralized and version-controlled.

### 6.2 Baseline role matrix

| Capability | BDA | Counsellor | Sales Lead | Sales Manager |
|---|---|---|---|---|
| Read own assigned leads | Yes | Where assigned/authorized | Yes | Yes, if permission granted |
| Read other BDA leads | No, unless explicit grant | Only within authorized counselling scope | Within authorized team scope | Cross-CRM scope if permission granted |
| Update lead data | Permitted fields on own/scope | Counselling-related fields within scope | Team permissions | Explicit granted permissions |
| Assign leads | Only if policy grants | Only if policy grants | Within team, subject to rules | Cross-team according to permission |
| Routine duplicate review | Within scope | Within scope if assigned | Yes | Yes |
| High-risk duplicate review | No | No | If explicitly permitted | If explicitly permitted |
| Approve restricted transfer | No | No | If explicitly permitted and not prohibited by separation-of-duties policy | Yes, if permission granted |
| Manage sales teams/rules | No | No | Only if explicitly granted | Yes, if permission granted |
| Amend EOD reports | No | No | Only if explicitly granted | Yes, if permission granted |
| Read audit records | No by default | No by default | Limited if explicitly granted | Explicit permission required |

The matrix is a default, not a substitute for the permission contract. In particular, “manager” must not automatically bypass every permission or audit requirement.

### 6.3 Separation of duties

For high-risk operations, define whether the same person can initiate and approve:
- High-risk duplicate resolution or lead merge.
- Cross-team ownership transfer.
- Retention deletion/anonymization.
- Role elevation or privileged access grants.
- EOD amendments, where policy requires independent review.

Recommended starting assumption: high-risk operations require explicit permission and audit; use a different approver when the business requires separation of duties.

## 7. Resource-level authorization algorithm

For every protected request, evaluate in this order:

1. **Authenticate:** validate CRM session and current user status.
2. **Authorize action:** verify the named permission for the operation.
3. **Load scoped resource:** query the resource through a permission-aware repository/query.
4. **Evaluate ownership/team scope:** apply the resource's current owner, team, and relevant relationship scope.
5. **Evaluate explicit grants:** verify resource, recipient, start, expiry, and revocation state.
6. **Evaluate business restrictions:** lifecycle state, duplicate-review gate, approval requirement, immutable/locked state, and other invariants.
7. **Execute atomically:** use a transaction/conditional update where concurrent changes could invalidate the authorization or business decision.
8. **Audit:** write the required event for sensitive changes.
9. **Return minimal response:** avoid disclosing hidden candidate records or unauthorized field values.

Authorization and the protected mutation should share a transaction or re-check the relevant state at mutation time when ownership, grants, or approval can change concurrently.

### 7.1 Query scoping

List/search/export endpoints must filter in SQL or the repository query. Do not load all records and filter them in application memory after returning them from an unrestricted query.

A conceptual policy is:

```text
canReadLead(user, lead):
    require user.active
    require permission("crm.lead.read_*")
    if permission("crm.lead.read_all") and scope allows all:
        return true
    if permission("crm.lead.read_team") and lead.team is in user's permitted teams:
        return true
    if lead.assigned_to_user_id == user.id and permission("crm.lead.read_own"):
        return true
    if activeExplicitGrant(user.id, lead.id):
        return true
    return false
```

This is illustrative pseudocode, not a complete implementation. Each action needs its own policy, and grants must not override prohibitions or required approvals.

### 7.2 Field-level permissions

Where some users can read a lead but cannot edit every field:
- Define an allow-list of mutable fields per action/permission.
- Reject unknown or restricted fields rather than silently accepting them.
- Keep server-controlled fields (owner, team, lifecycle, conversion references, audit data) out of generic patch operations.
- Use dedicated endpoints/services for assignment, transfer, merge, conversion, reopen, and EOD correction.

## 8. Temporary access grants

A grant provides access to a specific lead without changing its owner.

Required properties:
- Grant recipient.
- Lead/resource.
- Grantor.
- Reason.
- Start time.
- Optional expiry.
- Revocation timestamp and actor/reason, if stored separately.
- Audit event.

Rules:
- Grantor must have the relevant grant-creation permission and scope.
- A user cannot grant permissions they do not possess.
- Grant cannot exceed the grantor's permitted resource scope.
- Expired/revoked grants do not authorize subsequent requests.
- Grant does not permit actions beyond its configured permission scope.
- A grant cannot override a hard business restriction such as unresolved high-risk duplicate conversion blocking.
- Revocation takes effect on subsequent requests.
- If grants are cached, invalidation/TTL must be documented and tested.
- Grants are visible only to authorized administrators/actors.
- All grant creation, extension, and revocation is audited.

The initial schema proposal models lead-level access. If grants need read-only versus edit/assign scopes, add an explicit scope field or permission relation before implementation; do not infer privilege from grant existence alone.

## 9. Team membership and assignment authorization

- A user has at most one active sales-team membership at a time.
- Historical memberships remain available for audit and historical reporting.
- Membership in a team does not automatically grant a BDA access to all team leads.
- Sales Lead access is limited to explicitly authorized team scope.
- Sales Manager cross-CRM access is permission-controlled and audited.
- Cross-team transfer requires the configured approval.
- Assignment rules cannot grant access by themselves; assignment and read permissions are separate.
- A user's inactive status prevents new automatic assignments.
- User deactivation and team changes must define how existing sessions, grants, and assignments are handled.

When team membership changes, authorization should use current membership for current access and preserve historical membership for historical reporting. Do not accidentally let a former team member retain team-wide access from a stale token.

## 10. Authorization for background jobs

Workers must not impersonate an arbitrary human user without explicit, audited delegation.

For each job:
- Identify the initiating user when the job originated from a user action.
- Record a service/job identity for execution.
- Re-check business state at execution time.
- Use a narrowly scoped service operation.
- Preserve the initiating actor and service executor separately in audit/event metadata where relevant.
- Re-check recipient access before creating or delivering lead-sensitive notifications.
- Do not include lead data in notifications to recipients who no longer have access, except approved operational notifications that reveal no sensitive content.
- Ensure retries are idempotent and do not bypass current approval or retention rules.

For a scheduled system task without a human initiator, record the job type and service identity explicitly.

## 11. API security requirements

Every `/api/crm` endpoint must:
- Require a valid CRM session unless explicitly public by approved design.
- Validate request body, path parameters, query filters, and pagination.
- Enforce action permission and resource scope.
- Use stable error responses without stack traces or raw SQL details.
- Apply rate limits to authentication, search, mutations, and high-risk operations.
- Use idempotency for operations that may be retried.
- Emit audit events for sensitive changes.
- Avoid mass assignment by using endpoint-specific input schemas.
- Avoid returning hidden candidate data in duplicate-review/conversion errors.
- Apply the same authorization rules to API endpoints, exports, history, and notifications.
- Return a correlation/request ID for operational diagnosis where supported.

Suggested external status behavior:
- `401` — missing, invalid, expired, or revoked session.
- `403` — authenticated but action is not permitted, where revealing resource existence is safe.
- `404` — resource absent or intentionally hidden to avoid confirming its existence.
- `409` — stale state, conflicting resolution, capacity conflict, or invalid state transition.
- `422` — syntactically valid request that fails domain validation.
- `429` — rate limit exceeded.
- `5xx` — unexpected server/dependency failure with generic external message.

Choose consistent conventions with the existing API before implementation; these are proposed defaults.

## 12. Audit and security logging

Audit at minimum:
- Session creation/revocation and administrative revocation.
- CRM role grant/revocation.
- Team membership changes.
- Access grant creation/extension/revocation.
- Lead reads/exports only where the approved privacy/security policy requires such tracking.
- Sensitive lead field changes and lifecycle transitions.
- Assignment, transfer, and approval.
- Duplicate resolution and merge/reversal.
- Conversion and admission milestone changes.
- EOD reopen/amendment.
- Retention, archive, anonymization, and deletion.
- Security configuration and assignment/retention policy changes.

Security logs should record relevant failures such as repeated invalid session attempts, denied privileged actions, and authorization failures, without logging raw tokens or excessive personal information.

Define:
- Who may query audit events.
- How audit events are protected from modification.
- Retention and backup policy.
- Whether access to audit records itself needs an audit event.
- Correlation IDs linking API requests and worker jobs.

## 13. Security testing

### 13.1 Session tests

- Wrong audience is rejected.
- Invalid signature, missing claim, expired token, and revoked session are rejected.
- Session ID and subject mismatch is rejected.
- Disabled user cannot use an existing session.
- Revocation takes effect on the next protected request.
- Revocation-store failure causes protected requests to fail closed.
- Admin token is not accepted as a CRM token without approved exchange.
- Logout revokes the intended session and does not accidentally revoke unrelated sessions.

### 13.2 Authorization tests

For each role and multi-role combination:
- Own lead allowed where permission grants it.
- Another BDA's lead denied without grant.
- Active grant allows only its configured scope.
- Expired/revoked/not-yet-active grant is denied.
- Team lead access is constrained to authorized teams.
- Manager access follows explicit permissions.
- List, detail, search, history, export, and mutation endpoints agree.
- Direct-ID enumeration does not expose hidden records.
- A stale token cannot preserve removed team/role permissions.

### 13.3 Mutation and concurrency tests

- Generic patch cannot modify owner/team/lifecycle/conversion fields without dedicated permission.
- Two simultaneous duplicate resolutions cannot both succeed incompatibly.
- A grant revoked during a sensitive operation is handled according to the defined transaction/consistency policy.
- Transfer cannot commit without required approval.
- Unauthorized EOD reopen/amendment is rejected.
- Worker jobs cannot bypass duplicate-review or conversion gates.
- Notifications do not leak lead data after recipient access is removed.
- Rate limits and CSRF defenses behave as documented.

### 13.4 Security release gates

Do not release to general CRM users until:
- All critical session and resource-scope tests pass.
- No known critical authorization bypass remains.
- CORS/CSRF/cookie settings have been verified in deployed browser flows.
- Audit and revocation behavior has been exercised in staging.
- Secrets and PII have been reviewed in logs and API responses.
- An operational owner and incident response process are defined.

## 14. Implementation sequence

1. Inventory existing authentication, token validation, cookie, CORS, and route-protection code.
2. Decide whether an existing server-side session mechanism can be extended or a dedicated `crm_sessions` table is required.
3. Implement CRM audience/session validation and revocation.
4. Centralize named CRM permissions and policy functions.
5. Implement scoped repository queries and field-level mutation schemas.
6. Add role grants, team membership history, and temporary access grants.
7. Add audit events and security logging.
8. Protect every CRM endpoint and worker operation with the shared policy model.
9. Add session, authorization, CSRF/CORS, concurrency, and regression tests.
10. Verify the complete sign-in/revocation flow in staging before enabling production access.

## 15. Decisions to confirm

| ID | Decision | Recommended starting assumption |
|---|---|---|
| AUTH-001 | Existing server-side session store | Reuse if it supports per-session revocation and required CRM audience isolation; otherwise add CRM session records |
| AUTH-002 | CRM session duration/idle timeout | Set explicit bounded policy after inspecting existing login behavior and operational needs |
| AUTH-003 | Cookie topology across `crm.skillyards.in` and `api.skillyards.in` | Verify browser behavior; use minimum domain scope and tested CSRF protections |
| AUTH-004 | Temporary grant scopes | Start with explicit lead-level read access; add edit scopes only where a real workflow requires them |
| AUTH-005 | Separation of duties | Require independent approval for high-risk merge/transfer/retention operations where business policy requires it |
| AUTH-006 | Manager access | Cross-CRM visibility is still controlled by explicit permissions and audit |
| AUTH-007 | Audit retention | Approve retention and access policy before enabling automated cleanup |
| AUTH-008 | Revocation dependency failure | Fail closed for protected CRM requests |

## 16. Authorization acceptance checklist

- [ ] Existing identity flow is reused; no competing password/user system is created.
- [ ] CRM tokens are audience-bound and session-revocable.
- [ ] Session validation checks current user status.
- [ ] Cookie, CSRF, and CORS behavior is tested in the real deployment topology.
- [ ] CRM permissions are centralized and server-enforced.
- [ ] List/search/export queries apply resource scope in the database.
- [ ] Temporary grants include scope, reason, expiry/revocation, and audit.
- [ ] Team membership changes cannot leave stale access.
- [ ] Worker jobs have explicit service identity and re-check business state.
- [ ] Critical authorization and session tests run in CI.
- [ ] Security logs and audit snapshots exclude secrets and unnecessary PII.
- [ ] Operational revocation and incident-response procedures are documented.

## 17. Need Professional Help in Developing Your Architecture?

Please contact me at [sammuti.com](https://sammuti.com) :)
