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

### 2. Dual-Tier Navigation Sidebar (Obsidian Cockpit Drawer with In-Drawer Close)
- **Activity Bar & Dedicated Operations Drawer:** Left vertical activity bar (~56px) paired with an Operations Drawer (~240px) matching the dark obsidian cockpit theme (`#0c1316` / `#0f171a`) for a unified, executive aesthetic.
- **Professional In-Drawer Close Button:** Sleek dark-glass icon button (`w-7 h-7 rounded-lg`) featuring a smooth 90° rotation micro-animation on hover, translucent cyan-teal border glow, and tactile press scaling.
- **Re-Open & Toggle Interaction:** Clicking any activity bar navigation icon instantly expands the operations drawer. Clicking the already-active section icon toggles the drawer open/closed.
- **Smooth Animation:** Smooth CSS width and opacity transitions ensure a silky-smooth experience without text jumping or layout breaks.
- **Audio Feedback:** Integrated debounced tactile click sound (`button-click-sound.mp3`) on link interaction.

### 3. Executive Dashboard & Visual Analytics Cockpit (`/`)
- **4 Key Performance Indicator (KPI) Cards:** Styled with `#FAF6EE` surfaces, distinctive palette icon badges, and bold `#1C2527` metric counts.
- **Multi-Stage Pipeline Conversion Funnel (`ExecutiveAnalyticsCockpit.jsx`):**
  - Interactive waterfall funnel tracking: *New Inquiries* (100%) ➔ *Contacted* (78%) ➔ *Qualified* (52%) ➔ *Counselling Conducted* (29%) ➔ *Admissions Enrolled* (15%).
  - Real-time drop-off calculations and proportional progress bars with luxury color accents.
  - Interactive time range selector (*Today*, *This Week*, *This Month*, *Quarterly*).
- **Sales Team Performance Leaderboard:**
  - Dynamic rankings (🥇 Gold, 🥈 Silver, 🥉 Bronze) showcasing admissions enrolled, sessions conducted, total dials, and target attainment percentages.
- **Revenue Pacing & Operational Velocity Gauges:**
  - Revenue Attainment progress bar with pacing benchmark status.
  - Average Lead-to-Session turnaround time velocity tracker.
  - Live Tele-calling Attainment gauge dynamically integrated with the in-app softphone.
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

### 9. In-App Telecalling Softphone & Audio Cockpit (Phase 1)
- **Zero-Cost Web Audio Synthesizer (`lib/telephonyAudio.js`):**
  - Pure in-browser oscillator audio synthesis without external files or audio latency.
  - Standard ITU-T dual-frequency DTMF dial tones (697Hz–1477Hz) on numeric key touches.
  - Authentic telecom ringback cadence (440Hz + 480Hz burst loop).
  - Ascending harmonic chime on call connection (C5-E5-G5 triad) and descending hangup tone.
- **Docked Floating Softphone (`components/telephony/SoftphoneDrawer.jsx`):**
  - Always-accessible floating widget in the bottom-right corner.
  - Shows real-time connection status (Live WebRTC Ready), rep availability, and live duration timer.
  - Interactive touch dialpad with instant prospect name & course auto-lookup matching typed digits.
  - Recent calls history log with 1-click redial.
- **Live Active Call Cockpit (`components/telephony/ActiveCallCockpit.jsx`):**
  - Full candidate hero card with monogram avatar, normalized phone, and course interest tag.
  - Dynamic status indicator (`DIALING` -> `RINGING` -> `CONNECTED` -> `ENDED`).
  - High-contrast emerald live timer (`00:00`) with animated soundwave voice activity visualizer.
  - In-call controls: Mute Microphone (`MicOff`), Hold Call (`Pause`), In-call DTMF Keypad, and prominent Hang Up (`PhoneOff`).
- **Mandatory Call Disposition Modal (`components/telephony/CallDispositionModal.jsx`):**
  - Automatically surfaces upon call completion to enforce SPEC-6 audit compliance.
  - Standardized outcomes: *Connected*, *Counselling Scheduled*, *Callback Requested*, *Ringing/No Answer*, *Busy*, *Invalid Number*, *Not Interested*.
  - Callback scheduler: If *Callback Requested* is selected, prompts date & time and auto-creates a task in `/follow-ups`.
  - Discussion notes with one-click quick suggestion chips.
  - Direct EOD target auto-attribution (+1 Dial, +1 Connect if >15s, +Talk-Time seconds).
- **1-Click Call Triggers Across CRM Workspaces:**
  - Lead Workspace Profile (`/leads/[id]`): Hero "Call" button directly initiates the softphone.
  - Leads Pipeline (`/leads`): Table row quick phone action button.
  - Call Queue (`/queue`): 1-click dial from assigned queue list.
  - Follow-up Agenda (`/follow-ups`): 1-click dial scheduled callback tasks.
  - Global Hotkey `D`: Press `D` anywhere to toggle the softphone dialer window.

### 10. Multi-Channel WhatsApp, SMS & Direct Email Outreach Engine
- **Zero-Cost Native Multi-Channel Dispatch:**
  - Direct integration via browser protocol deep links (`https://wa.me/...`, `mailto:...`, `sms:...`) and 1-click clipboard copying.
  - Zero paid external API subscriptions required (bypasses costly Gupshup/Twilio per-message fees while remaining enterprise-ready).
- **Interactive Multi-Channel Modal (`components/leads/MultiChannelOutreachModal.jsx`):**
  - **3 Communication Channels:** WhatsApp Web / Desktop App, Native Email Client, and Mobile SMS.
  - **5 Pre-Approved EdTech Sales Templates:**
    1. *Course Curriculum & Syllabus Brochure:* Official syllabus link, live project details, mentor intro, and curriculum overview.
    2. *Admissions 1-on-1 Counselling Invite:* Direct Google Meet / Zoom admissions room link and career path consultation invite.
    3. *Merit Scholarship & Tuition Waiver:* 15% academic waiver code with 48-hour expiration trigger for urgent conversions.
    4. *Post-Call Summary & Immediate Follow-up:* Key phone takeaways recap, program highlights, and next steps confirmation.
    5. *Course Fee Structure & Flexible 0% EMI Schedule:* Complete installment and digital EMI approval link.
  - **Dynamic Token Interpolation Engine:**
    - Live substitution of `{{candidate_name}}`, `{{course_name}}`, `{{counsellor_name}}`, `{{crm_phone}}`, `{{meet_link}}`, `{{brochure_link}}`, and `{{candidate_code}}`.
    - Token quick-insert pills allow representatives to insert dynamic tags directly into the message text area on the fly.
    - Live character counter and WhatsApp Web / Email dispatch buttons with tactile feedback.
- **Audit-Compliant Activity Feed Integration:**
  - Dispatched communications automatically log to the candidate's activity timeline (`/leads/[id]`) with timestamps, actor metadata, and message preview snippets.
  - Distinct channel badges: WhatsApp (`#25D366`), Email (`#4A6D7C`), and SMS (`#B07238`).
  - Persistent browser storage (`skillyards_lead_call_history_${id}`) ensures outreach history survives refreshes and offline reloads.

### 11. Lead Bulk Actions & Batch Operations Hub (`/leads`)
- **Multi-Select Table Selection:**
  - Tri-state master checkbox (Select All, Indeterminate, Deselect All).
  - Row-level interactive checkboxes with active row highlighting (`!bg-[#4A6D7C]/12 border-l-4 !border-l-[#4A6D7C]`).
  - Real-time selection count tracking and quick "Clear Selection" trigger.
- **Docked Obsidian Cockpit Action Toolbar:**
  - Floating bottom-docked control deck (`#0c1316`) that smoothly slides up when 1 or more leads are selected.
  - One-click trigger buttons for Bulk Status, Bulk Reassignment, Batch Outreach, and Filtered CSV Export.
- **Batch Status Migration Modal:**
  - Update all selected prospects across lifecycle stages (*New*, *Contacted*, *Follow-up*, *Counselling Scheduled*, *Qualified*, *Converted*, *Cold*, *Lost*).
  - Optional batch reason / audit log note recorded into candidate history.
- **Batch Staff Reassignment Modal:**
  - Reassign selected leads to a specific sales representative (*Priya Patel*, *Vikram Malhotra*, *Amit Kumar*).
  - **⚡ Auto Round-Robin Balanced Distribution:** Alternates assignment across all active counsellors to equalize team lead loads automatically.
- **Batch Outreach Broadcast Modal (`components/leads/BulkOutreachModal.jsx`):**
  - Broadcasts WhatsApp, Email, or SMS to all selected candidates with automated dynamic name/course token replacement.
  - Multi-candidate recipient roster with quick 1-click individual WhatsApp chat launchers and BCC email client merge.
  - Auto-logs outreach history to all selected candidates' chronological timelines in `localStorage`.
- **Selected-Only CSV Export:**
  - Generates custom-filtered CSV (`skillyards-selected-X-leads-YYYY-MM-DD.csv`) containing only the checked leads.
- **Optimistic State & Local Storage Persistence:**
  - Immediate state reflection with animated toast notification banner.

### 12. Student Admissions & Fee Collection Hub (`/admissions`)
- **End-to-End Admissions Conversion:**
  - Converts qualified/counselled prospects into officially enrolled students with unique Student IDs (`SKY-2026-XXXX`).
  - Available via the Admissions Console (`/admissions`) and directly within any candidate profile (`/leads/[id]`) via the emerald "Enroll Student" action button.
- **Tuition Fee Calculator & Scholarship Deduction Engine (`components/admissions/EnrollStudentModal.jsx`):**
  - Course selection with real-time base tuition fees.
  - Scholarship & fee waiver codes: 15% Academic Merit (`SKY-MERIT-15`), 10% Early Bird (`EARLY-10`), 20% Women in Tech Leadership Grant.
  - Government GST (18%) automatic calculation toggle with full tax transparency.
  - Payment schedule configuration: 100% Upfront, 2-Part Installment, or 0% Interest 10-Month EMI Loan.
  - Down payment collection, balance due computation, and installment due date scheduling.
- **Official Digital Fee Receipt & Letterhead (`components/admissions/StudentFeeReceiptModal.jsx`):**
  - Instant institutional letterhead fee receipt with unique Receipt No (`REC-2026-XXXXX`), student details, program cohort, transaction UTR, and itemized tuition & GST tax breakdown.
  - One-click **Print / Save as PDF** support (`window.print()`).
- **Admissions Management Console (`/admissions`):**
  - 4 Real-time Financial & Enrollment KPI cards: Total Enrolled Students, Gross Tuition Revenue Collected, Pending Receivables (<30 days), and 0% EMI Loan Disbursals.
  - Interactive Filter Tabs (*All Enrollments*, *Fully Paid*, *0% EMI Active*, *Balance Pending*).
  - Search by Student Name, ID, Phone, Email, or Receipt number.
  - Direct softphone call triggers and receipt inspection.
  - One-click Admissions Ledger CSV Export.
### 13. Complete Full-Stack Integration (Backend API + Database + UI)
- **Unified Admissions & Payment Hub:**
  - `GET /api/crm/admissions`: Fetches live enrolled students joined with payment records from `students` and `payments` tables via Drizzle ORM.
  - `POST /api/crm/admissions`: Inserts student into `students`, logs down payment into `payments`, sets lead status to `converted`, and writes an immutable audit record in `crmAuditEvents`.
  - Frontend client `crmApi.getAdmissions()` and `crmApi.enrollStudent()` with dual-layer fallback to local storage.
- **Batch Operations & Reassignment:**
  - `POST /api/crm/leads/bulk`: Handles `status`, `assign` (direct or round-robin), and `outreach` actions with database updates and batch `crmAuditEvents` entries.
  - Frontend multi-selection bar in `/leads` executes live batch API updates with optimistic state and timeline history logging.
- **Multi-Channel Candidate Outreach Logging:**
  - `POST /api/crm/leads/[id]/outreach`: Logs candidate WhatsApp, Email, or SMS message events to `crmAuditEvents`.
  - Unified timeline builder in `crm.lead.service.js` automatically renders outreach entries (`OUTREACH_SENT`) with channel badges, templates, and timestamps.
- **In-App Softphone Call Logging:**
  - `POST /api/crm/leads/[id]/calls`: Records call duration, disposition outcome, and callback timestamps directly into call logs and lead timeline.
  - Telephony context automatically syncs softphone call dispositions to backend and updates EOD attributable counters.

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

---

## 📞 Telecalling Dialer & Softphone Documentation

For the complete technical blueprint, state machine, telecom options (WebRTC vs Cloud PBX vs Android GSM), and EOD target integration specs, see:
- [docs/CRM/TELECALLING_DIALER_ARCHITECTURE_GUIDE.md](file:///d:/CRM-SKILLYARDS/Skillyards/docs/CRM/TELECALLING_DIALER_ARCHITECTURE_GUIDE.md)
