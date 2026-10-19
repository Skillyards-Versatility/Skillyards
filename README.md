# Skillyards Monorepo & CRM Platform

Enterprise ecosystem for **Skillyards Versatility**, combining education technology, admissions operations, sales workflows, and student career acceleration.

---

## 📁 Repository Overview

```text
Skillyards/
├── apps/
│   └── crm/               # Next.js 14 Sales & Admissions CRM Application
├── docs/                  # Architecture, DB Schema, Security & Implementation Guides
│   ├── CRM/               # Detailed CRM operational specifications & API contracts
│   └── ...                # Monorepo architecture & engineering documentation
├── package.json           # Root workspace configuration
└── README.md              # Project overview & changelog
```

---

## 🌟 Skillyards CRM Application (`apps/crm`)

The CRM platform handles multi-channel lead intake, automated round-robin routing, counselling session booking, callback pipeline management, and audited manager End-of-Day (EOD) reporting.

For full application instructions, visit [apps/crm/README.md](file:///d:/CRM-SKILLYARDS/Skillyards/apps/crm/README.md).

---

## 🎨 Recent Major Changelog & Redesign

### 1. Unified Luxury Parchment & Cockpit Design System
- **Background Foundation:** The application canvas was completely redesigned from dark gray to a warm, premium parchment linen tone (`#F0E6D6`).
- **Cockpit Navbar:** Synchronized top navigation with the sidebar activity bar background (`#0c1316`) for a sleek cockpit aesthetic.
- **Brand Logo:** Updated to `/logo/logo-light.svg` with locked dimensions (`h-8 w-auto`), guaranteeing permanent sharpness and preventing unwanted shrinking.
- **Surface Elevation Hierarchy:**
  - Canvas foundation: `#F0E6D6`
  - Outer panels & cards: `#FAF6EE` with border `rgba(71, 86, 87, 0.18)`
  - Elevated inner boxes & form inputs: Crisp `#FFFFFF`
  - High-contrast typography: `#1C2527` (slate black) for primary headings and `#5A6E71` / `#7E939A` for secondary labels.

### 2. Dual-Tier Navigation Sidebar (Obsidian Cockpit Drawer with In-Drawer Close)
- Dedicated vertical activity bar paired with an Operations Drawer (~240px) matching the dark obsidian cockpit theme (`#0c1316` / `#0f171a`).
- Cohesive color palette matching top navbar with slate-teal borders (`[rgba(98,146,158,0.15)]`) and high-contrast typography.
- Professional in-drawer close button (`w-7 h-7 rounded-lg`) with dark-glass styling, 90° rotation micro-animation, and tactile press feedback.
- Clicking any activity bar navigation icon instantly expands the operations drawer; clicking the active icon toggles the drawer.
- Tactile, single-trigger audio feedback (`button-click-sound.mp3`) on link interaction.

### 3. Modals, Drawers & Sub-Pages Polish (Option 1)
All interactive surfaces follow the unified dark cockpit header (`#0c1316`) + warm ivory body (`#FAF6EE`):
- **`+ New Lead` Modal:** Streamlined prospect creation with validated inputs.
- **Book Counselling Modal (`/leads/[id]`):** Candidate details pill, date picker, counsellor assignment, and outcome state.
- **Follow-up Modal (`/follow-ups`):** Resolution notes and callback scheduler.
- **Manager Amendment Modal & Revision History Drawer (`/eod`):** Audit-compliant revisions and version history.
- **Duplicate Candidate Reviews (`/duplicates`):** Side-by-side identity comparison cards and instant merge/separate resolution.
- **Call & Assignment Queue (`/queue`):** Real-time fair round-robin routing and team member workload utilization bars.

### 4. Deep Visual Polish & Core Workspaces Modernization (Option 2)
- **Lead Profile & Contact Workspace (`/leads/[id]`):** Modernized candidate hero header with monogram avatar pill, status badges, action buttons, quick call logger with duration presets, activity timeline feed with color-coded event icons, and ownership transfer cards.
- **Callback & Follow-up Queue (`/follow-ups`):** Task cards with lead monogram avatars, date/time chips, representative tags, and resolution notes boxes.
- **EOD Target Hub & Submission Console (`/eod`):** Policy formula banner in warm luxury gradient (`from-[#FAF6EE] via-[#F4ECE1] to-[#EBE0CF]`), authoritative target relief breakdown cards, KPI attainment gauges, and historical reports table.
- **Counselling Management Console (`/counselling`):** EOD attribution banner, 5 KPI metric cards, and session management table with monogram avatars.

### 5. End-to-End Workflow Integration & Offline Resilience (Option 3)
- **Standalone Offline / Demo Resilience:** Implemented graceful local state fallbacks with optimistic updates across all primary interactive forms, enabling 100% full interactive testing even when the backend API server is offline.
- **Lead Registration & Directory Sync:** `NewLeadModal` registers new prospects with automatic local persistence, immediately reflecting in `/leads` and dashboard home (`/`).
- **Lead Profile & Interactive Actions (`/leads/[id]`):** Generates complete profile fallback data and allows logging calls, scheduling counselling, changing status, and reassigning staff with live timeline feed updates.
- **Follow-up Tasks & Callbacks (`/follow-ups`):** Interactive callback queue with instant "Complete" and "Reschedule" optimistic state transitions.
- **Duplicate Candidate Review (`/duplicates`):** Side-by-side identity collision evaluation with interactive "Confirm Same Person (Associate)" and "Confirm Separate People" resolution.
- **Counselling Management (`/counselling`):** Live session booking, rescheduling, and outcome recording with optimistic updates and metric recalculation.
- **EOD Target Hub (`/eod`):** Authoritative target relief calculator, formula breakdown, gauge attainment, and audited submission/amendment workflows.

### 6. Enterprise Productivity, CSV Export & Mobile Polish (Option 4)
- **Functional Global Search & Navigation:** Real-time search query submission from navbar directly into the leads directory with `/` hotkey focus.
- **Dynamic Persona Switcher:** Interactive navbar dropdown for testing **Sales Manager**, **Senior Counsellor**, and **Telecaller** role permissions on the fly.
- **Actionable Notifications Center:** Navbar bell trigger with live activity indicators for overdue callbacks, counselling due today, and queue intake.
- **One-Click CSV Data Export:** Dedicated CSV export functionality in Leads Directory (`/leads`), Counselling Management (`/counselling`), and EOD Ledger (`/eod`).
- **Global Keyboard Shortcuts & Cheatsheet:** Hotkeys for New Lead (`N`), Dialer (`D`), Search (`/`), Help (`?`), and Dismiss (`Esc`) with a modal guide.
### 7. In-App Telecalling Softphone & Audio Cockpit (Phase 1)
- **Zero-Cost Web Audio Synthesizer:** Pure browser dual-frequency DTMF dial tones, authentic telecom ringback cadence, and call connection/hangup audio chimes.
- **Docked Floating Softphone Widget:** Persistent bottom-right floating trigger with live status indicators, interactive touch dialpad, live lead auto-lookup, and recent calls log.
- **Active Call Cockpit:** Live student hero card, real-time talk timer (`MM:SS`), soundwave voice visualizer, mute, hold, in-call DTMF keypad, and hangup.
- **Mandatory Call Disposition Modal:** Audit-compliant post-call outcome tagging (*Connected*, *Counselling Scheduled*, *Callback Requested*, etc.), callback scheduler, discussion notes, and direct EOD target auto-attribution (+1 Dial, +1 Connect, +Talk-Time seconds).
- **1-Click Call Triggers:** Seamless telecalling integration across Lead Profile, Leads Directory, Call Queue, and Follow-up Agenda.

### 8. Executive Visual Analytics & Conversion Funnel Cockpit
- **Interactive Multi-Stage Waterfall Funnel:** Real-time visualization of candidate conversion from *New Inquiries* (100%) through *Contacted*, *Qualified*, and *Counselling* down to confirmed *Admissions Enrolled* (15%) with stage drop-off calculations.
- **Sales Team Performance Leaderboard:** Ranked staff performance (🥇 Gold, 🥈 Silver, 🥉 Bronze) with admissions enrolled, sessions conducted, total calls, and target % attainment.
- **Velocity & Revenue Gauges:** Pacing progress bar, average lead turnaround time (days), and live telephony dials counter linked with the softphone.
- **Time Range Filtering:** Dynamic recalculations across *Today*, *This Week*, *This Month*, and *Quarterly*.

### 9. Multi-Channel WhatsApp, SMS & Direct Email Outreach Engine
- **Zero-Cost Native Multi-Channel Dispatch:** Direct browser protocol links (`https://wa.me/...`, `mailto:...`, `sms:...`) and 1-click clipboard copy without expensive external vendor API contracts.
- **Pre-Approved EdTech Sales Templates:** Ready-to-send templates for Course Curriculum/Brochure, 1-on-1 Counselling Invites, 15% Merit Scholarship Waivers, Call Follow-ups, and Fee Structure / EMI Schedules.
- **Dynamic Token Interpolation:** Live candidate and course personalization (`{{candidate_name}}`, `{{course_name}}`, `{{counsellor_name}}`, `{{meet_link}}`, `{{brochure_link}}`) with token insertion pills.
- **Audit-Compliant Activity Feed:** Sent outreach is automatically logged into the lead's chronological timeline (`/leads/[id]`) with color-coded channel badges and persisted to browser storage.

### 10. Lead Bulk Actions & Batch Operations Hub (`/leads`)
- **Multi-Select Table Management:** Tri-state master checkbox with active row highlights (`!bg-[#4A6D7C]/12 border-l-4`), selection counter, and instant deselect.
- **Docked Obsidian Cockpit Action Toolbar:** Floating control dock (`#0c1316`) surfacing on lead selection for 1-click batch actions.
- **Batch Lifecycle Status Transition:** Bulk status migration with audit logging.
- **Batch Staff Reassignment & Round-Robin Balancing:** Reassign to specific reps or auto-balance workloads evenly across the sales team.
- **Batch Outreach Broadcast:** Multi-lead WhatsApp, Email BCC, and SMS broadcasting with dynamic candidate token replacement and timeline logging.
- **Filtered Selected-Only CSV Export:** Download custom CSV containing only the chosen leads.

### 11. Student Admissions & Fee Collection Hub (`/admissions`)
- **Complete Admissions Funnel Conversion:** Transform qualified leads into enrolled students with auto-generated Student IDs (`SKY-2026-XXXX`).
- **Dynamic Fee Calculator & Scholarship Grants:** Program selection, merit waivers (`SKY-MERIT-15`), 18% GST toggle, and flexible payment plan calculation (Full, 2-Part Installment, or 0% EMI).
- **Official Digital Fee Receipt Letterhead:** Branded official receipt with itemized fee breakdown, transaction UTR, and 1-click **Print / Save as PDF** support.
- **Financial Admissions Ledger Console:** Real-time KPI summary (Enrolled Students, Tuition Collected, Receivables, 0% EMI Loans), cohort filters, and CSV data export.

---

## 🚀 Quick Start (Local Development)

```bash
# Clone the repository
git clone https://github.com/Skillyards-Versatility/Skillyards.git
cd Skillyards

# Install root dependencies
npm install

# Start CRM development server
cd apps/crm
npm run dev
```

The CRM application will start on [http://localhost:3003](http://localhost:3003).

---

## 📚 Technical Documentation

- [CRM Architecture & Data Models](file:///d:/CRM-SKILLYARDS/Skillyards/docs/CRM/README-detailed.md)
- [API Contracts & Endpoints](file:///d:/CRM-SKILLYARDS/Skillyards/docs/CRM/08-api-contracts-detailed.md)
- [Sales Operations & Routing Logic](file:///d:/CRM-SKILLYARDS/Skillyards/docs/CRM/06-sales-operations-detailed.md)
