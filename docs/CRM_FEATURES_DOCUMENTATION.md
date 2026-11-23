# 🚀 Skillyards Sales CRM — Complete Features Documentation

Welcome to the comprehensive features guide for the **Skillyards Sales CRM**. This documentation provides a simple, clear, and structured overview in English of all features, workflows, and modules built to date.

---

## 📋 Table of Contents
1. [Executive Analytics & Funnel MIS (`/analytics`)](#1-executive-analytics--funnel-mis)
2. [Razorpay Payment Gateway & Instant Webhooks](#2-razorpay-payment-gateway--instant-webhooks)
3. [WhatsApp Drip Cadences & Automation Workflow Builder (`/cadences`)](#3-whatsapp-drip-cadences--workflow-builder)
4. [1-Click WebRTC Softphone & Telephony Cockpit](#4-1-click-webrtc-softphone--telephony-cockpit)
5. [Leads Pipeline & Detail Cockpit (`/leads`, `/[id]`)](#5-leads-pipeline--detail-cockpit)
6. [Fee Installments & Receivables Desk (`/installments`)](#6-fee-installments--receivables-desk)
7. [Admissions & Tuition Management (`/admissions`)](#7-admissions--tuition-management)
8. [Sales Incentives & Gamification Hub (`/incentives`)](#8-sales-incentives--gamification-hub)
9. [Academic Batches & Live Cohorts (`/cohorts`)](#9-academic-batches--live-cohorts)
10. [1-on-1 Student Counselling Desk (`/counselling`)](#10-1-on-1-student-counselling-desk)
11. [Daily Actuals & EOD Telecalling Audit (`/eod`)](#11-daily-actuals--eod-telecalling-audit)
12. [Duplicate Reviews & Data Hygiene (`/duplicates`)](#12-duplicate-reviews--data-hygiene)
13. [Omnichannel Inbox (`/inbox`)](#13-omnichannel-inbox)
14. [Design System & UI Color Theme](#14-design-system--ui-color-theme)
15. [Unified Filter Architecture (Developer Blueprint)](#15-unified-filter-architecture-developer-blueprint)

---

## 1. Executive Analytics & Funnel MIS
**Route:** `http://localhost:3003/analytics`  
**Purpose:** Provides business intelligence, revenue velocity, marketing ROI, and admissions drop-off diagnostics for leadership.

### Key Capabilities:
- **Executive Revenue Ribbon:**
  - Real-time comparison between **Target Tuition Revenue** vs **Achieved Revenue** with completion progress bar.
  - **Overall Conversion Rate** benchmarks compared to EdTech industry standard (+3.5% edge).
  - **Blended CAC** (Customer Acquisition Cost) tracker.
  - **Sales Turnaround Days** (velocity from raw lead intake to fee deposit).
  - **Tuition Cash vs Balance Due** ratio.
- **5-Stage Interactive Admissions Conversion Funnel Chart:**
  - Upgraded from simple progress bars to a full **Interactive Multi-Mode Funnel UI Chart**:
    - **Waterfall Flow Mode:** Vertical proportional geometric pillars with custom SVG gradients, connecting flow curves, and drop-off bridges between adjacent stages.
    - **3D Stepped Funnel Mode:** Tapered trapezoid visual funnel segments narrowing from 100% intake down to final admissions yield.
    - **Stage Velocity Matrix Mode:** Detailed table breakdown showing volume, conversion yield %, drop-off loss, turnaround benchmarks, and prescriptive action recommendations.
    - **Interactive Stage Deep-Dive Inspector:** Click or hover any stage to inspect active lead volumes, drop-off causes, and recommended sales actions (e.g. automating demo reminders to resolve the 44% bottleneck between Qualified and Counselling).
  1. *Raw Inquiries & Leads* (100% top-of-funnel).
  2. *Tele-Contacted Prospects* (leads reached via softphone).
  3. *Academic Profile Qualified* (students matching eligibility & course intent).
  4. *1-on-1 Counselling Attended* (completed demo lectures & curriculum walkthrough).
  5. *Admissions & Tuition Enrolled* (token or installment deposit paid).
- **Counsellor Attainment Leaderboard:**
  - Live ranking of counsellors showing Total Closures, Counselling Conducted, Dials, Revenue Generated, Quota Attainment %, and Achievement Badges (*Top Closer*, *Volume Champion*, *Conversion Pro*).
- **Marketing Channel Attribution Matrix:**
  - Compares Google Search Ads, Meta/Instagram Reels, Direct Walk-in, College Referrals, and Organic SEO.
  - Shows Leads Captured, Ad Spend, Enrolled Admissions, Cost-Per-Admission (CPA), and Return on Ad Spend (ROAS).
- **Academic Batch Seat Fill Meter:**
  - Visual capacity meters for upcoming cohorts with seat countdowns and revenue forecasts.
- **Interactive Controls:**
  - Filter by Time Range (`Today`, `This Week`, `This Month`, `Current Quarter`, `Year-to-Date`).
  - Filter by Course Specialization.
  - 1-Click **CSV Export** & formatted **Print / PDF View**.

---

## 2. Razorpay Payment Gateway & Instant Webhooks
**Backend Services:** `apps/api/src/lib/razorpay.js`  
**Modal Component:** `apps/crm/src/components/payments/RazorpayPaymentModal.jsx`  
**Purpose:** Collect tuition fees and seat reservation token deposits via official Razorpay links, scannable UPI QR codes, and automated webhook settlement.

### How It Works:
1. **Link Generation:**
   - Counsellors click **"⚡ Razorpay"** on any lead or installment.
   - System generates an authentic short link (`https://rzp.io/l/sky_...`) with NPCI-compliant UPI Intent parameters.
   - Generates a high-resolution, instant scannable UPI QR code (Google Pay, PhonePe, Paytm, BHIM).
2. **Instant Sharing:**
   - **🟢 Share on WhatsApp:** Pre-fills a professional payment request message with the student's name, course, amount due, and direct checkout link.
   - **📱 Copy SMS Text:** Copies a clean SMS payment reminder template with 1 click.
3. **Automated Webhook Engine (`POST /api/crm/webhooks/razorpay`):**
   - Listens to Razorpay events: `payment_link.paid`, `payment.captured`.
   - Verifies cryptographic HMAC-SHA256 signature.
   - Automatically marks the installment as **`PAID`** in the database.
   - Assigns official Receipt Number (`REC-RZP-2026-XXXXX`), payment timestamp, and transaction ID.
   - Updates student's balance due and changes lead status to `converted`.
4. **Interactive Webhook Simulator (Test Mode):**
   - Includes a **"Simulate Student Payment Success"** button directly inside the modal so team members can test real-time ledger settlement without debiting real bank accounts.
5. **Zero-Error Resilient Fallback:**
   - If the backend API server is loading or offline, the CRM automatically switches to client-side generation so counsellors can always generate payment links smoothly without UI errors.

---

## 3. WhatsApp Drip Cadences & Workflow Builder
**Route:** `http://localhost:3003/cadences`  
**Purpose:** Nurtures prospects with multi-day automated WhatsApp & SMS sequences to reduce demo no-shows and accelerate admissions.

### Key Capabilities:
- **Interactive Visual Flowchart Builder:**
  - Canvas workflow nodes connecting:
    - *Trigger Event* (e.g. New Website Lead Captured).
    - *Action 1:* WhatsApp Course Brochure Delivery with live capstone project preview.
    - *Delay:* Wait 24 Hours.
    - *Decision Branch:* Did candidate click brochure? (Yes ➔ Send VIP Demo Invite; No ➔ Trigger counsellor call).
    - *Action 2:* SMS Demo Class Pass with Google Meet link.
- **1-Click EdTech Recipes:**
  - *Instant Lead Intake Sequence:* Immediate curriculum delivery + intro video.
  - *Demo Class Confirmation Sequence:* 24h before + 1h before WhatsApp reminder.
  - *Overdue Fee Recovery Drip:* Milestone payment alerts sent at 3-days prior, due date, and overdue stage.
- **Workflow Simulator Modal:**
  - Test any workflow trigger live and inspect the simulated softphone task injection.

---

## 4. 1-Click WebRTC Softphone & Telephony Cockpit
> [!NOTE]
> **Status: Temporarily Disabled & UI Removed** (All internal softphone widgets, sidebar dialer triggers, hotkey shortcuts, and table calling buttons have been completely removed from the UI).
**Components:** `SoftphoneDrawer.jsx`, `ActiveCallCockpit.jsx`, `telephonyAudio.js`  
**Purpose:** Allows counsellors to call students directly from within the CRM interface without picking up a desk phone.

### Key Capabilities:
- **Synthesized Telecom Audio Engine:**
  - Realistic dual-tone DTMF sounds on keypad press.
  - Authentic Indian telecom carrier ringback tone during dialing.
  - Call-connected chime and hold music playback.
- **Active Call Cockpit:**
  - Live Call Duration Timer (`00:03:45`).
  - **● REC** indicator showing call recording state.
  - Real-time animated audio wave visualizer reacting to microphone input.
  - In-call Scratchpad for logging discussion notes during the call.
- **Floating Minimized Call Pill:**
  - Counsellors can minimize an ongoing call into a floating pill in the bottom-right corner to browse lead details or check course syllabi without disconnecting.
- **Post-Call Disposition:**
  - 1-Click call outcome logging (`Connected`, `Callback Requested`, `Switched Off`, `Interested`, `Demo Booked`).
  - Auto-updates lead activity timeline.

---

## 5. Leads Pipeline & Detail Cockpit
**Routes:** `http://localhost:3003/leads`, `http://localhost:3003/leads/[id]`  
**Purpose:** Central hub for capturing, qualifying, and closing prospective students.

### Key Capabilities:
- **Pipeline Kanban & Table View:**
  - Track leads across stages: *New*, *Contacted*, *Follow-up*, *Counselling Scheduled*, *Qualified*, *Converted*, *Cold*, *Lost*.
  - Search by Name, Mobile, Email, and Course.
- **AI Lead Propensity Score (0–100):**
  - Heuristic score based on candidate qualification, ad source, response time, and engagement.
  - Visual badges: **🔥 Hot Lead (80+)**, **⚡ Warm (50–80)**, **❄️ Cold (<50)**.
- **Lead Detail Cockpit (`/leads/[id]`):**
  - Complete chronological timeline of all calls, WhatsApp messages, counsellor notes, and status changes.
  - Integrated Call Recording Audio Player with waveform controls.
  - **Quick Action Bar:** 1-Click Call, Multi-Channel Outreach, Book Counselling, Enroll Student, and **Collect Token Fee (Razorpay)**.

---

## 6. Fee Installments & Receivables Desk
**Route:** `http://localhost:3003/installments`  
**Purpose:** Tracks student milestone fee installments, 0% EMI schedules, and recovers overdue payments.

### Key Capabilities:
- **4 Key Financial Metric Cards:**
  - *Total Receivables* across all active students.
  - *Overdue At Risk* with urgent alert counters.
  - *Collected This Month* total tuition cash.
  - *On-Time Punctuality Rate %*.
- **Aging & Milestone Tabs:**
  - Filter by: *All Milestones*, *Overdue Alerts*, *Due This Week*, *Upcoming 30 Days*, and *Settled / Paid*.
- **Row Actions:**
  - **⚡ Razorpay Link:** Generates an instant UPI checkout link & QR code for that milestone.
  - **WhatsApp Reminder:** Sends pre-formatted overdue or upcoming payment reminder notices.
  - **Manual Collect:** Records offline payments (Cash/Bank UTR/Cheque).
  - **View Receipt:** Generates formatted digital fee receipts with Indian rupee currency words formatting.

---

## 7. Admissions & Tuition Management
**Route:** `http://localhost:3003/admissions`  
**Purpose:** Manages finalized admissions, academic enrollment records, scholarship discounts, and tax invoices.

> [!NOTE]
> **System Confirmation:** ✅ **Fully Linked with Admin Fee Management System.**  
> CRM Admissions and the Admin Fee Management Portal share the exact same underlying PostgreSQL database schema in `@repo/db`. Both read and write to the same `students`, `payments`, `installments`, and `plans` tables. When an admission or installment is settled in CRM, it is instantly visible in the Admin Student Ledger (`/students/[id]`).

### Key Capabilities:
- **Student Enrollment Ledger:**
  - Tracks Student ID (`SKY-2026-XXXX`), Course Name, Assigned Cohort, and Counsellor.
  - Base Fee vs Scholarship Waiver Code vs Net Fee calculations.
  - Automated 18% GST invoice breakdown.
- **Payment Modalities:**
  - Full Upfront Payment (`fully_paid`).
  - 0% No-Cost EMI Financing (`emi_active` via Propelld/Liquiloans).
  - Milestone Installments (`partial_paid`).
- **Official Digital Fee Receipt Modal:**
  - Printable official tax invoice with institution header, authorized signatory stamp, and 1-click WhatsApp receipt dispatch.

---

## 8. Sales Incentives & Gamification Hub
**Route:** `http://localhost:3003/incentives`  
**Purpose:** Drives sales performance with real-time target realization, commission tiers, and sales manager payout approvals.

### Key Capabilities:
- **Counsellor Sales Leaderboard:**
  - Target vs Closed Admissions, Total Tuition Collections, and Commission Earned.
  - Streaks, Average Deal Size, and Achievement Badges (*Gold Closer*, *Fastest First Connect*).
- **Interactive Commission Calculator Modal:**
  - Dynamic commission simulation disabled and completely removed from the UI per request.
- **Manager Payout Approval Workflow:**
  - Authorize and lock monthly sales incentive disbursement ledgers.

---

## 9. Academic Batches & Live Cohorts 
**Route:** `http://localhost:3003/cohorts`  
**Purpose:** Manages batch schedules, instructor allocations, and real-time seat fill capacity.

> [!NOTE]
> **System Confirmation:** ✅ **Fully Linked with Admin Batches & Live Cohorts.**  
> CRM Academic Batches and the Admin Cohort Management system query and mutate the identical PostgreSQL schema `@repo/db/schema/batches.js`. The capacity gauges, seat fills, start dates, and mentor assignments stay synchronized in real time between CRM and Admin.

### Key Capabilities:
- **Live Cohort Cards & Capacity Meters:**
  - Seat fill percentage meters (e.g. *32 / 35 Seats Filled — 91.4%*).
  - Status indicators: *Upcoming*, *In Progress (Live)*, *Batch Full*.
- **Batch Details Drawer:**
  - View full roster of enrolled learners in the cohort.
  - Mentor assignments, start dates, and weekend/weekday live lecture schedules.
- **Seat Reservation Modal:**
  - Reserve batch seats for prospects pending loan or payment clearance.

---

## 10. 1-on-1 Student Counselling Desk
**Route:** `http://localhost:3003/counselling`  
**Purpose:** Schedules and tracks 1-on-1 career consultation sessions and curriculum demo walkthroughs.

### Key Capabilities:
- **Counselling Calendar & Slot Booking:**
  - Schedule consultation appointments linked to specific counsellors.
- **Session Outcome Tracking:**
  - Log outcomes: *Completed / Demo Attended*, *No Show*, *Rescheduled*, *Enrolled Immediately*.
- **Counselling Relief Credit:**
  - Integrates with EOD reports so counsellors conducting 45-minute demo calls receive dial target relief credits.

---

## 11. Daily Actuals & EOD Telecalling Audit
**Route:** `http://localhost:3003/eod`  
**Purpose:** Ensures daily telecalling accountability and compliance across admissions representatives.

### Key Capabilities:
- **Daily Performance Audit:**
  - Tracks Dials Made vs Connects Achieved vs Total Talk-Time (Minutes).
  - Target completion gauges with benchmark progress bars.
- **Automatic Counselling Relief Calculation:**
  - Conducting a verified counselling demo automatically credits 15 dials and 5 connects to the representative's daily target.
- **Supervisor Review & Locking:**
  - Managers review notes, sign off on daily metrics, and lock EOD reports to prevent retrospective tampering.

---

## 12. Duplicate Reviews & Data Hygiene
**Route:** `http://localhost:3003/duplicates`  
**Purpose:** Prevents duplicate lead assignment and ensures clean marketing attribution.

### Key Capabilities:
- **Confidence Match Engine:**
  - Identifies duplicate inquiries using exact phone matches, email variations, or name conflicts.
  - Classifies conflicts into *High*, *Medium*, or *Low* confidence matches.
- **Side-by-Side Merge Review:**
  - Compare incoming inquiry data against existing lead records.
  - 1-Click **Merge & Reassign** or **Mark as New Distinct Prospect**.

---

## 13. Omnichannel Inbox  
**Route:** `http://localhost:3003/inbox`  
**Purpose:** Consolidated messaging center for real-time 2-way student communications.

> [!NOTE]
> **System Status: UI & Database Message Threads Active | Production Webhooks Pending**  
> The Omnichannel Inbox UI, conversation threads, and 1-click EdTech macro dispatch (Brochures, Google Meet links, coupons) are 100% active and running on top of local/database messages. However, live 2-way delivery from candidates' real WhatsApp phones requires setting up live Meta WhatsApp Cloud API credentials (`WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, Webhook callback verification) in `apps/api/.env`. Once connected, inbound WhatsApp webhooks automatically route into this exact inbox stream.

### Key Capabilities:
- **Multi-Channel Message Threads:**
  - View WhatsApp, SMS, and Email conversations in a unified chat stream.
- **Quick EdTech Macros:**
  - 1-Click insertion of Curriculum Brochure links, Google Meet demo room links, and early-bird scholarship codes (`SKILL30`).

---

## 14. Design System & UI Color Theme
The entire CRM is built on a custom, unified luxury visual design system with rich, professional gradients and ambient lighting:
- **Canvas Ambient Lighting Gradient:** Executive radial ambient light (`radial-gradient(135% 100% at 50% 0%, #FFFDF9 0%, #F5E8D6 40%, #EBD8BE 75%, #DFC5A4 100%)`), giving depth and warm parchment radiance to the overall application.
- **Top Navigation Bar (Navbar):** Luminous Warm Parchment gradient (`bg-gradient-to-r from-[#FFFDF9] via-[#F6ECE0] to-[#EFE0CC]`) with amber border highlight (`border-b border-[#D97706]/30`) and soft ambient elevation shadow (`shadow-[0_4px_20px_-3px_rgba(217,119,6,0.12)]`).
- **Sidebar (Dual-Tier Navigation Rails):**
  - **Tier 1 (56px Activity Strip):** Distinct executive gold-champagne gradient (`bg-gradient-to-b from-[#F5E2CC] via-[#EBCFB0] to-[#DFBE99]`) with an amber divider border (`border-r border-[#D97706]/35`). Active icon buttons glow with a 3-stop amber-gold gradient (`#F59E0B` ➔ `#D97706` ➔ `#B45309`).
  - **Tier 2 (240px Operations Drawer):** Warm parchment gradient (`bg-gradient-to-b from-[#FCF8F2] via-[#F7EFE2] to-[#EFE1CE]`) with gradient headers and golden-hued active route pills (`bg-gradient-to-r from-[#FDEFD9] to-[#F5DEC0]`).
- **Dashboard Cards & Table Containers (`.crm-card`, `.crm-panel`, `.crm-table-box`):** Multi-stop executive card gradients (`linear-gradient(180deg, #FFFFFF 0%, #FAF6EE 55%, #F4EAD9 100%)`) with warm amber borders (`rgba(217,119,6,0.22)`) and micro-elevations.
- **KPI Metric Cards (`.crm-metric-card`):** Multi-directional gradient cards (`linear-gradient(145deg, #FFFFFF 0%, #FAF3E6 50%, #F2E4CD 100%)`) with top inner bevel shine.
- **Primary Action Buttons (`.crm-btn-primary`):** 3-Stop Warm Amber & Gold Gradient (`linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #B45309 100%)`) with top bevel highlight (`inset 0 1px 0 rgba(255,255,255,0.28)`) and warm shadow glow.
- **Success & Enrollment Buttons (`.crm-btn-success`):** 3-Stop Vintage Teal & Emerald Gradient (`linear-gradient(135deg, #2E7559 0%, #1e5842 55%, #144432 100%)`).
- **Secondary Buttons (`.crm-btn-secondary`):** Reflective Crisp Parchment Gradient (`linear-gradient(180deg, #FFFFFF 0%, #FAF5EC 100%)`) with amber hover glow.
- **Active Navigation Tabs (`.crm-tab-active`):** Radiant Amber Gradient with drop shadow and inset highlight.
- **Executive Ledger Headers (`.crm-thead`):** Polished Ledger Parchment Gradient (`linear-gradient(180deg, #EFE2CE 0%, #E2CFB4 100%)`) with a strong amber base border (`border-bottom: 2px solid rgba(217, 119, 6, 0.35)`).
- **Typography & Layout:** Clean sans-serif hierarchy, tabular monospace numbers for monetary amounts, and smooth transitions throughout.

---

## 15. Unified Filter Architecture (Developer Blueprint)
**Reference:** Developer Flowchart Architecture for CRM Filters  
**Goal:** Empower Counsellors, Managers, and Admins to pinpoint leads, tasks, calls, and admissions using Quick Filters and multi-condition Advanced Filter Builders.

### Architecture Stages:
1. **Access Filters (Role-Based Visibility):**
   - **Admin:** Complete system visibility across all counsellors, teams, and financial parameters.
   - **Manager:** Team-level visibility, counsellor assignment tracking, and approval queues.
   - **Counsellor:** Restricted to assigned leads, personal follow-up calendars, and call queues.
2. **Module Selection:**
   - Supports 6 distinct modules: `Leads`, `Tasks / Follow-ups`, `Calls`, `Counselling Sessions`, `Admissions`, and `Reports / Analytics`.
3. **Filter Modalities:**
   - **Quick Filters (1-Click Pre-defined Views):** Instant status slices (e.g. *Today's Leads*, *Overdue Follow-ups*, *Switched Off*, *Hot Leads*, *Meta Ads*).
   - **Advanced Filters (Multi-Condition Builder):** Custom rules combining Field, Operator (`equals`, `contains`, `in`, `between`, `>`, `<`), and AND/OR grouping logic.
4. **Save & Manage Views:**
   - Save custom filter queries as Private or Shared Views.
   - Set Default View on login, duplicate, edit, or export results.
5. **Backend Execution:**
   - Validates role permissions, builds compound SQL/ORM queries, applies server-side pagination, and serves structured filtered JSON.

---

### 🌐 Quick Access URLs:
| Page / Module | URL |
| :--- | :--- |
| **Executive Analytics & Funnel MIS** | `http://localhost:3003/analytics` |
| **Fee Installments & Razorpay Desk** | `http://localhost:3003/installments` |
| **Leads Pipeline** | `http://localhost:3003/leads` |
| **Admissions & Fee Management** | `http://localhost:3003/admissions` |
| **WhatsApp Drip Cadences** | `http://localhost:3003/cadences` |
| **Sales Incentives Leaderboard** | `http://localhost:3003/incentives` |
| **Academic Batches** | `http://localhost:3003/cohorts` |
| **Counselling Sessions** | `http://localhost:3003/counselling` |
| **EOD Telecalling Reports** | `http://localhost:3003/eod` |
| **Omnichannel Inbox** | `http://localhost:3003/inbox` |
