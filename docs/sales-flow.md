# Sales EOD — How It Works

## What a Sales Rep Fills Daily

Each sales person submits an EOD (End of Day) report with these numbers:

- **Dialed Calls** — How many calls they dialed
- **Connected Calls** — How many calls were answered
- **Talk Time** — Total minutes spent on calls
- **Counselling Done** — Counselling sessions they conducted (over phone/virtual)
- **Counselling Booked** — Future counselling appointments they scheduled
- **Counselling Conducted (Walk-in / Others)** — Walk-in or other counselling sessions
- **Sessions Booked** — Paid sessions they converted
- **Admissions / Registrations** — Students who enrolled
- **Admission Projection** — Expected admissions in pipeline
- **Notes** — Any additional comments

---

## How Calling Targets Adjust Automatically

The system knows that if you spend time counselling, you have less time to call. So your daily targets adapt.

### The rule

**Total counselling** = Counselling Done + Walk-in Counselling

(Counselling Booked is excluded — it hasn't happened yet.)

For every counselling session you do, your dial target drops by 15 and your connect target drops by 5.

### Quick reference

| If you did this many counselling sessions… | Your dial target becomes… | Your connect target becomes… |
|---|---|---|
| 0 | 120 | 50 |
| 1 | 105 | 45 |
| 2 | 90 | 40 |
| 3 | 75 | 35 |
| 4 | 60 | 30 |
| 5 | 45 | 30 |
| 6 | 30 | 30 |
| 7 | 15 | 30 |
| 8 or more | 0 | 30 |

Even with heavy counselling, the connect target never goes below 30 — there's a minimum connect expectation regardless.

### Example

A rep does 2 counselling sessions (1 phone + 1 walk-in) and dials 90 calls, connects 45.

- Total counselling = 2
- Dial target = 90, connect target = 40
- They dialed 90/90 and connected 45/40 — **target met**

---

## Where They See This

### 1. The EOD Form

The form now has a **"Counselling Conducted (Walk-in / Others)"** field alongside "Counselling Done" and "Counselling Booked".

### 2. Sales Comparison Dashboard

Under EOD Analytics → Team Analytics, a **Sales Callers Comparison** section shows:

- **Bar chart** — Each person's actual connected calls vs their adjusted target
- **Conversion funnel** — Dialed → Connected → Counselling → Sessions Booked (one combined bar for total counselling)
- **Per-person scorecards** — Shows connected/target, dialed/target, and total counselling with a breakdown (e.g., "3 done · 2 walk-in")

### 3. Individual Drill-Down

Clicking a person shows:

- **Daily progress bars** — Their latest day's dials, connects, and talk time against their *adjusted* target (not the flat 120/50)
- **Conversion funnel** — Lifetime totals across all their reports
- **Streak** — How many consecutive days they've hit all three targets (dial, connect, talk time). Targets are recalculated per day, so a counselling-heavy day has lower expectations than a pure calling day.

---

## Email Reports

At end of day, the sales team lead gets an email with all submissions in a table, including the new "Counselling Conducted (Walk-in / Others)" column. Anyone who didn't submit gets a warning email.

---

## Edge Cases Worth Knowing

### When dial target hits zero
If someone does 8+ counselling sessions, their dial target becomes 0. The progress bar shows 100% automatically — no division errors, just a green bar.

### Could someone inflate counselling to lower their targets?
Potentially, but:
- Each session only reduces dial target by 15 and connect by 5 — takes 8+ sessions to zero out dials
- Connect target can't go below 30 — minimum expectation stays
- Talk time target (90 mins) is fixed, not tied to counselling
- Counselling numbers should match CRM records

### Old data still works
Reports that used older field names (like `Walk-in Counselling` under an old label) are treated correctly and won't double-count.

### Counselling Booked is not counted
Only completed counselling affects targets. Future bookings don't change expectations.

---

## Quick Summary

- **More counselling = lower calling targets** (fair adjustment)
- **Walk-in and phone counselling both count** toward total
- **Everything visible** on the analytics dashboard with clear breakdowns
- **No code knowledge needed** to read the numbers

---

## Counselling Sessions Module

The **Counselling Sessions** module lets BDAs log individual counselling sessions in real time, separate from the EOD form.

### Where to find it

Navigate to **Counselling** in the sidebar. BDAs see only their own entries; Admins/Managers see everyone's.

### What you can do

- **Log a session** — Add a student's name, phone, age/class, course interest, source (Walk-in / Phone / Referral), outcome (Session Booked / Enrolled / Follow-up / Not Interested / No Response), and notes.
- **Filter by date range** — See sessions for any period.
- **Delete a session** — Remove your own entries (admins can delete any).
- **Summary stats** — Total sessions, breakdown by source and outcome.

### How it ties into EOD

When a BDA opens the **EOD form**, the counselling counts are **auto-populated** from their session logs for that day:

| EOD Field | Auto-populated from |
|---|---|
| Counselling Done | Phone + Referral sessions |
| Walk-in Counselling | Walk-in sessions |
| Counselling Booked | Sessions with outcome = Session Booked or Enrolled |

The BDA can still adjust these numbers manually if needed. If the EOD was already submitted for the day, existing values are preserved.

### Counselling Pipeline (Team Analytics)

The **Counselling Pipeline** section under Team Analytics shows a funnel:

- **Booked** — Booked counselling slots
- **Done** — Counselling sessions conducted (phone/referral)
- **Walk-in** — Walk-in counselling conducted
- **Conducted (Total)** — Done + Walk-in combined

The pipeline chart (stacked bars per person) shows how each BDA is performing across the three categories over time.
