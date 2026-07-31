# Skillyards V2: Scope, TODOs, and TBDs

  Continue  opencode -s ses_0482b5326ffeUZiej4nDeFKtoY
This document outlines the identified technical debt, incomplete features (TBDs), and proposed scope for the V2 evolution of the Skillyards platform.

## 1. Authorization & Security (Policy Engine)

- [ ] **Sales Scoped Access**: Implement student-to-staff assignment logic. Update `canAccessStudent` and `canAccessReceipt` to verify assignments instead of the current `SALES_UNASSIGNED_DENY`.
- [ ] **Staff Granular Permissions**: Define specific read/write boundaries for the `STAFF` role (e.g., allow ledger viewing but block payment status overrides).
- [ ] **Student Self-Service**: Fully implement ownership checks for all student-facing endpoints to ensure a student can only see their own plan and installments.
- [ ] **Revoke Sessions**: Add infrastructure to invalidate JWTs/sessions if a user's role changes or their account is deactivated.


## 2. Payment & Financial Ledger

- [ ] **Automated Installment Updates**: Ensure `updateInstallmentStatus` is called atomically after every payment or refund to maintain ledger integrity.
- [ ] **Payment Gateway Integration**: Transition from manual payment entries to a provider (e.g., Razorpay/Stripe).
- [ ] **Refund Logic**: Implement a formal refund workflow that reverses allocations and updates installment statuses.
- [ ] **Sequential Numbering Audit**: Verify `getNextReceiptNumber` handles high-concurrency race conditions (potential move to a DB sequence or atomic counter).

## 3. Analytics & Reporting

- [ ] **Analytics Service**: Implement the service layer for `packages/db/src/schema/analytics.js`.
- [ ] **Collection Reports**: Generate weekly/monthly collection reports for `ADMIN` and `MANAGER` roles.
- [ ] **Outstanding Forecast**: Build a service to calculate expected revenue based on upcoming installment due dates.

## 4. Assessment System

- [ ] **Assessment Logic**: Expand `canAccessAssessment` into a full module. Implement test session tracking and score calculation.
- [ ] **Proctoring Readiness**: TBD logic for validating if a student is authorized to start a specific assessment session.

## 5. Infrastructure & Resilience (Turbopack/Production)

- [ ] **Production Env Hardening**: Remove fallback secrets (`skillyards_secret_key_change_me_in_prod`) and enforce strict environment variable validation on startup.
- [ ] **Stale Job Recovery**: Implement a cron/worker to clean up "Generating" states in the PDF system that have exceeded a timeout (e.g., > 5 mins).
- [ ] **CORS Lockdown**: Move `cors.js` allowed origins to an environment variable rather than a hardcoded list.

---
*Note: This scope is derived from current `// TBD` and `// TODO` markers in the codebase as of April 2026.*
