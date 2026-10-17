# Skillyards CRM Application

A high-performance, enterprise-grade Sales & Admissions CRM built for **Skillyards Versatility**. Designed to streamline lead intake, round-robin lead distribution, counselling scheduling, callback workflows, and manager End-of-Day (EOD) reporting with audit compliance.

---

## 🎨 Design System & Theme Specifications

The CRM features a **Warm Luxury Parchment & Dark Cockpit** aesthetic engineered for optimal legibility, contrast, and executive ergonomics during extended sales shifts.

| Element | Specification / Token | Description |
| :--- | :--- | :--- |
| **Canvas Background** | `#F0E6D6` | Warm luxury parchment / linen foundation across the whole CRM |
| **Top Navbar** | `#0c1316` | Deep obsidian cockpit bar matching sidebar activity strip |
| **Sidebar Activity Bar** | `#0c1316` | Fixed 54px navigation strip with icon triggers |
| **Skillyards Brand Logo** | `/logo/logo-light.svg` | Statically locked full size (`h-8 w-auto`), bright white & cyan contrast |
| **Primary Cards / Panels** | `#FAF6EE` | Warm ivory surfaces with `rgba(71, 86, 87, 0.18)` borders |
| **Elevated Inner Boxes** | `#FFFFFF` | Crisp white callouts, form inputs, and comparison cards |
| **Headings & Body Text** | `#1C2527` | Crisp deep slate text ensuring sharp readability |
| **Muted & Secondary Text** | `#5A6E71` / `#7E939A` | Professional slate-teal subtitles, timestamps, and labels |
| **Modals & Drawers** | `#0c1316` Header + `#FAF6EE` Body | Obsidian cockpit top strip + warm ivory dialog body |

---

## 🚀 Recent Updates & Enhancements Changelog

### 1. Unified Color Theme Transformation
- **Canvas Re-theming:** Replaced plain dark backgrounds with luxury `#F0E6D6` linen canvas.
- **Navbar & Sidebar Cohesion:** Synchronized top navbar background with the sidebar's `#0c1316` obsidian theme (`border-b border-[rgba(98,146,158,0.15)]`).
- **Logo Legibility:** Switched to `/logo/logo-light.svg` locked at a fixed, permanent full size (`h-8 w-auto`) that never shrinks or distorts during navigation.
- **Tailwind Tokens Overhaul (`globals.css`):**
  - Mapped compatibility color scales:
    - `--color-platinum-50`: `#1C2527` (crisp slate headings)
    - `--color-platinum-800`: `rgba(71, 86, 87, 0.16)` (subtle warm borders)
    - `--color-platinum-900`: `#FFFFFF` (elevated white cards)
    - `--color-platinum-950`: `#F4ECDF` (warm linen insets)
  - Refined status badges, tab bars, buttons, and form inputs for high contrast.

### 2. Sidebar Navigation & Micro-Interactions
- **2-Tier Collapsible Drawer:** Integrated a compact 54px permanent activity bar with an expandable flyout menu.
- **Audio Feedback:** Integrated debounced tactile click sound (`pop.mp3`) that plays exactly once per link click.

### 3. Executive Dashboard (`/`)
- **4 Key Performance Indicator (KPI) Cards:** Styled with `#FAF6EE` surfaces, distinctive palette icon badges, and bold `#1C2527` metric counts.
- **Daily EOD Action Banner:** Dynamic gradient card (`from-[#FAF6EE] via-[#F6EDE0] to-[#ECE1CF]`) displaying submission status and quick entry CTAs.
- **Recent Prospects Table:** Monogram avatar circles, direct call/email links, and assigned representative chips.

### 4. Interactive Modals & Slide-Over Drawers (Option 1 Polish)
All modal dialogs and slide-over drawers now feature the unified `#0c1316` cockpit header and `#FAF6EE` body:
- **`+ New Lead` Modal (`NewLeadModal.jsx`):** Quick prospect intake with phone, email, source, and course fields.
- **Book Counselling Modal (`/leads/[id]`):** Candidate details pill, session date, assigned counsellor, course interest, and outcome state.
- **Callback & Reschedule Modal (`/follow-ups`):** Resolution notes and callback scheduler.
- **Manager Amendment Modal & Revision History Drawer (`/eod`):** Audit-compliant manager override and historical revision timeline.
- **Session Booking, Reschedule, Outcome & Audit Drawers (`/counselling`):** Clean scheduling workflows with zero syntax glitches.

### 5. Sales Sub-Pages Redesign
- **Duplicate Review Queue (`/duplicates`):** Side-by-side comparison cards with risk badges, contact blocks, and one-click *Confirm Same* / *Separate* resolution.
- **Call & Assignment Queue (`/queue`):** Real-time round-robin routing pool and team capacity roster with workload utilization bars.
- **Leads Directory (`/leads`):** Enhanced table rows, filter tabs, search controls, and monogram badges.

### 6. Deep Visual Polish & Core Workspaces Modernization (Option 2)
- **Lead Profile & Contact Workspace (`/leads/[id]`):**
  - Modernized candidate hero header with large monogram avatar pill, status badges, and quick contact action pills (Book Counselling, Copy Contact, direct Call & Email).
  - Quick Call Logger redesign with `#FAF6EE` surface, high-contrast outcome selector pills, duration presets, and clean discussion notes.
  - Activity Feed & Timeline with vertical rail, color-coded event icon badges (phone, status change, web enquiry, counselling), and elevated `#FFFFFF` interaction cards.
  - Redesigned Sales Ownership card with representative avatar and Contact Profile summary cards.
- **Callback & Follow-up Queue (`/follow-ups`):**
  - Enhanced task cards with lead monogram avatars, date/time chips, representative tags, and resolution notes boxes.
  - Polished empty state with luxury emerald checkmark and helpful messaging.
- **EOD Target Hub & Submission Console (`/eod`):**
  - Redesigned Server-Owned Target Engine policy banner with warm luxury gradient card (`from-[#FAF6EE] via-[#F4ECE1] to-[#EBE0CF]`) and locked formula tag.
  - Upgraded Authoritative Target Relief breakdown cards (Dials, Connects, Talk-Time) in crisp white with bold metric counters and verified counselling session credit.
  - Polished KPI Attainment Gauges with smooth progress tracks and Target Met / Deficit Pending badges.
  - Redesigned EOD Submission History table with legible metrics and audit log actions.
- **Counselling Management Console (`/counselling`):**
  - Redesigned EOD Attribution banner with SPEC-6 policy details and live conducted session counter.
  - 5 Key KPI cards with bold `#1C2527` and `#2E7559` metrics.
  - Enhanced sessions table with student monogram avatars, phone chips, course interest tags, and canonical lead deep-links.

### 7. End-to-End Workflow Integration & Offline Resilience (Option 3)
- **Standalone Offline / Demo Resilience Architecture:**
  - Implemented graceful local state fallbacks with optimistic updates across all primary interactive workflows, ensuring 100% of the CRM's UI, forms, and business logic can be tested and demonstrated even when the backend API server is offline or restarting.
- **Lead Registration & Directory Synchronization:**
  - `NewLeadModal`: Automatically persists locally registered prospects to browser `localStorage` (`skillyards_custom_leads`) if the backend is unreachable.
  - Leads Directory (`/leads`) and Dashboard (`/`): Automatically read and prepend custom-created prospects, instantly updating table rows, totals, and metrics upon registration.
- **Lead Detail Profile & Actions Resilience (`/leads/[id]`):**
  - Robust `getFallbackLead` and `FALLBACK_STAFF` generation ensures direct deep-linking to any lead ID (e.g. `/leads/lead-101`) renders a complete interactive cockpit.
  - Interactive Call Logger, Counselling Scheduler, Status Pipeline Selector, and Staff Reassignment optimistically update component state and timeline entries in real-time.
- **Callback & Follow-up Queue Resilience (`/follow-ups`):**
  - Integrated realistic fallback callback tasks distributed across Overdue, Due Today, Upcoming, and Completed tabs.
  - Interactive "Complete" and "Reschedule" modals with immediate optimistic list transitions and automatic count re-calculation.
- **Duplicate Detection & Manager Review Queue (`/duplicates`):**
  - Added realistic identity collision demo cases with side-by-side comparison between existing database leads and incoming website submissions.
  - Interactive "Confirm Same Person (Associate)" and "Confirm Separate People" manager actions with optimistic status resolution.
- **Counselling Management Console Resilience (`/counselling`):**
  - Integrated interactive "Book Session", "Reschedule Session", and "Record Outcome" modal submissions with optimistic table updates and KPI summary re-calculation.
- **EOD Target Hub Resilience (`/eod`):**
  - Integrated authoritative target relief calculation with formula breakdown and gauge attainment.
  - Offline baseline preview and fallback submission/amendment history with optimistic report locking.
- **Queue Distribution Engine (`/queue`):**
  - Optimistic Claim Lead and Round-Robin Auto-Assign state routing with active capacity counters.

### 8. Enterprise Productivity, CSV Export & Mobile Polish (Option 4)
- **Functional Global Search & Navigation:**
  - Active header search bar with form submit routing directly to `/leads?search=...`.
  - Pressing `/` globally focuses the search bar with instant keyboard navigation.
- **Role & Persona Switcher:**
  - Interactive persona selector in the navbar for immediate live-testing between:
    - 🛡️ **Sales Manager / Admin** (all team sessions, manager amendments, full ledger access)
    - 🎓 **Senior Counsellor** (counselling schedule, student enrollment, target relief)
    - 🎧 **Telecaller Rep** (call queue, quick logger, my follow-ups)
  - Exposed live `setUser` and `setCrmRoles` in `AuthContext` to test role-based UI variations on the fly.
- **Interactive Notifications Center:**
  - Navbar bell trigger opening an obsidian-themed action center with real-time indicators for overdue callbacks, today's counselling appointments, queue intake, and EOD cutoff reminders.
- **One-Click CSV Data Export:**
  - **Leads Directory (`/leads`):** One-click export to `skillyards-leads-YYYY-MM-DD.csv` formatted with contact details, status, and assigned representative.
  - **Counselling Management (`/counselling`):** One-click export to `skillyards-counselling-YYYY-MM-DD.csv` with session date, student background, counsellor, and outcomes.
  - **EOD Submissions Ledger (`/eod`):** One-click export to `skillyards-eod-ledger-YYYY-MM-DD.csv` with dials, connects, talk-time, and audit revisions.
- **Global Keyboard Shortcuts & Cheatsheet Modal:**
  - Press `N` anywhere to trigger the **Register New Lead** modal.
  - Press `/` to focus global search.
  - Press `?` to toggle the Keyboard Shortcuts Cheatsheet.
  - Press `Esc` to instantly dismiss open dialogs and drawers.
- **Responsive Mobile Ergonomics:**
  - Main workspace layout padding adapted to `p-4 sm:p-6 md:p-8`.
  - Polished touch targets and horizontal table scroll containers across mobile viewports.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS + Vanilla CSS Custom Properties (`globals.css`)
- **Icons:** Lucide React
- **Audio:** Web Audio API / HTML5 Audio
- **State & Context:** React Hooks & AuthContext

---

## 🏃 Getting Started

### Prerequisites
- Node.js 18+
- npm / yarn / pnpm

### Installation
```bash
# Navigate to the CRM package
cd apps/crm

# Install dependencies
npm install

# Run the local development server (port 3003)
npm run dev
```

Visit [http://localhost:3003](http://localhost:3003) in your browser.
