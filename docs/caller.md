# AI Telecaller — Product & Engineering Plan

> Status: **Design/plan** — not yet implemented. Cost-first decision made on 31 Jul 2026. Updated 31 Jul 2026 with real Agni pricing (Growth = default plan, Scale = upgrade path) and the full engineering design.
> Goal: an AI voice agent that makes outbound calls on behalf of SkillYards (cold outreach, enquiry follow-up, scheduled follow-ups, appointment setting) and hands off to a human telecaller when needed.

---

## 1. TL;DR

- Build an **AI telecaller** — an AI voice agent that calls leads on the phone, talks in **Hinglish + English**, qualifies them, answers course questions, books follow-ups/appointments, and **warm-transfers to a human** when a lead asks for one.
- **Cost is the major constraint.** Per real-world 2026 data, the "DIY" stack (Vapi + Sarvam + Gemini + Twilio) actually costs **₹12–30 per connected minute**, while India-managed voice-AI platforms cost **₹2–6.5/min all-in** (compliance included).
- **Decision: use an India-managed provider** (primary: **Agni by Ravan.ai**, fallback: **Vyora**) and keep all of our own infrastructure (DB, API, admin UI, per-call cost tracking) on top of it.
- Expected pilot cost: **₹7–10.5K/month + GST** on Agni Growth (~30–50 calls/day), versus ₹15–25K/month + overhead for one human telecaller.
- **Agni's ₹2/min headline is enterprise-overage only.** At pilot volume the ₹5,999/mo Growth platform fee dominates, so the real all-in rate lands at **₹7–9/connected min**. Scale (₹12,999/mo) only becomes cheaper above ~2,200 min/month.

---

## 2. The Existing Codebase (what we already have)

SkillYards already runs an end-to-end **human** telecaller operation:

| Piece | Where | Status |
|---|---|---|
| Call logging (Android call-tracker → `gsm-callback`) | `apps/api/src/app/api/telephony/` | Live |
| Call audio on Cloudflare R2 | `apps/api/src/integrations/r2/` | Live |
| AI call audit (Gemini transcribe + score → `call_analyses`) | `apps/ai-service/` | Live |
| Admin `/calls` page (ADMIN/MANAGER only) | `apps/admin` | Live |
| EOD reports, breaks, leaves, counselling sessions | DB + admin | Live |
| Leads: `enquiries` + `test_leads` | DB | Live |
| **Lead → telecaller assignment, lead pipeline, BDA self-service view** | — | **Missing** |

This new module is an **AI** telecaller — complementary to, not replacing, the human calling setup.

Key existing tables we will reuse/link:
- `users` — `role: "SALES"` is the telecaller/BDA role; also the handoff target for warm transfers.
- `enquiries` — existing website/test leads (status: `new | contacted | enrolled | closed`).
- `follow_ups` — human call log. AI calls get their own table (`ai_calls`); the two are not mixed because the billing/cost model differs.

---

## 3. Cost Analysis (the reason for this plan)

### 3.1 Real per-minute costs people actually pay (2026)

| Setup | Advertised | **Real all-in / min** |
|---|---|---|
| Vapi DIY stack (STT + LLM + TTS + telephony) | $0.05 | **₹12–28** |
| Vapi cold-call config (GPT-4o + Deepgram) | — | **₹17–42** |
| Retell DIY | $0.07 | **₹11–26** |
| Leadlock (speech-to-speech, Gemini) | — | **~₹10** |
| India-managed (Agni/Tabbly/Caller Digital/VoxTurn) | ₹2/min | **₹2–6.5 all-in** |

Lesson: the $0.05/min Vapi headline is only the orchestration fee. STT + LLM + TTS + telephony stack on top. India-managed platforms bundle everything (including TRAI/DLT compliance) at a fraction of the cost. **Caveat:** the ₹2–6.5/min "India-managed" figure is a headline/overage rate — at our low pilot volume, Agni's platform fee raises the *effective* all-in to **₹7–9/connected min** (see §3.3).

### 3.2 Real outcome numbers (deployments)

- Connection rate: AI outbound **20–25%** vs human telecallers **8–15%**
- Cost per qualified meeting: human $555–667 → AI **$220–287** (55–65% cheaper)
- Cost per lead: $5–15 staff time → **<$0.50** AI
- EdTech enrollment case study: 3x conversion, **60% lower CAC**, 5-min response
- **93% of converted leads need 6+ contact attempts** — humans quit after 2–3; AI doesn't
- Speed-to-lead: 2.5 hours → 28 seconds

### 3.3 Monthly math (our pilot)

Pilot = ~30–50 calls/day, ~15 connected, ~2.5 min avg → **~900–1350 connected min/month**.

| Route | Monthly (pilot) |
|---|---|
| **Agni Growth** (₹5,999 + 1,000 min, ₹6/min overage + ₹0.80/min telephony + ₹350 DID) | **₹7.2–10.5K** |
| Agni Scale (₹12,999 + 2,500 min) | ₹14.2–14.5K |
| DIY (Vapi + Sarvam + Gemini) | ₹15–40K |
| Human telecaller | ₹15–25K + overhead |

(+18% GST on all Agni figures.)

Effective all-in per connected minute at pilot volume: **Growth ≈ ₹7–9/min**, Scale ≈ ₹9.7–14/min.

**Growth vs Scale crossover:** Scale becomes the lower-cost plan from ~2,200 min/month. Beyond that:

| Volume | Growth | Scale |
|---|---|---|
| 2,000 min/mo | ₹15,350 | ₹14,550 |
| 5,000 min/mo | ₹34,350 (₹6.9/min) | ₹27,350 (₹5.5/min) |

Agni's published examples (4-min avg calls): edtech telesales 5,000 calls/mo on Scale ≈ ₹79K/mo (~₹15.8/call); NBFC 10,000 calls/mo ≈ ₹2.06L/mo (~₹20.6/call).

Scale reference (500+ calls/day): India-managed ~₹50–80K/month; DIY ₹1.5–2.5L/month.

### 3.4 Free tiers to validate before paying

- Agni — **"Start free"** = free agent build + trial credits to test the agent, **not** free calling minutes at scale; no credit card required to start
- Vyora — free agent setup, no per-minute surprises
- Sarvam — 1,000 free credits (for later DIY comparison if ever needed)
- Vapi — 60 free minutes (same)

---

## 4. Provider Decision

### Primary: Agni by Ravan.ai (`docs.ravan.ai`)
- Hinglish-native, 30+ Indian languages, voice + LLM + emotion engine included in per-minute rate
- Built-in: DND/NCPR scrubbing, consent logging, calling-window enforcement (9am–9pm), call recordings & audit trails
- No-code agent builder so the sales/ops team can tune the script

**Agni plan structure (real pricing, excl. 18% GST):**

| | Starter | **Growth** | Scale | Enterprise |
|---|---|---|---|---|
| Price | ₹2,999/mo | **₹5,999/mo** | ₹12,999/mo | Custom |
| Included minutes | 300 | **1,000** | 2,500 | Custom |
| Overage /min | ₹8 | **₹6** | ₹4 | upto ₹2 |
| Concurrent calls | 5 | **15** | 25 | 10,000+ |
| Languages | Hindi+English | **All 30+** | All + dialects | Custom |
| Outbound campaigns | ❌ | **✓** | ✓ | ✓ |
| Call transfer | ❌ | **✓** | ✓ | ✓ |
| Webhook notifications | ✓ | **✓** | ✓ | ✓ |
| Custom functions (AI → our API) | ❌ | **✓** | ✓ | ✓ |
| Call recordings & transcripts | ❌ | **✓** | ✓ | ✓ |
| **Full REST API access** | ❌ | ❌ | ✓ | ✓ |
| Agent memory (cross-call context) | ❌ | ❌ | ✓ | ✓ |
| Inbound routing | ❌ | ❌ | ✓ | ✓ |

**Starter is unusable for us** — no outbound campaigns, no call transfer, no custom functions, no recordings/transcripts. Minimum viable plan = **Growth**.

**Telephony is billed separately** from Agni's per-minute rate (which covers AI processing only):
- **Via Ravan:** ₹0.80/min (in+out, India PSTN) + ₹350/month per DID number — recommended, flat INR, no Twilio account
- **BYO Twilio:** ~₹1.08/min outbound + ~₹96/mo per number — you manage Twilio directly
- Agni's per-minute overage + telephony stack to give the real all-in rate.

**Plan decision: Growth = default, Scale = documented upgrade path (both covered in this doc).**
- **Growth** supports every functional requirement (campaigns, warm transfer, webhooks for cost tracking, custom functions) — but campaigns are run from **Agni's dashboard + CSV import**, not our code. Our API/UI become the system of record and reporting/oversight layer.
- **Scale** adds **full REST API** (programmatic campaign orchestration from our `dialer.service`) and **agent memory** (cross-call context — valuable for follow-ups: "last time you said…"). Switch to Scale when volume passes ~2,200 min/month.

### 4.1 Provider comparison matrix

| | **Agni (Ravan)** | **Vyora** | Caller Digital | Tabbly | Vapi DIY |
|---|---|---|---|---|---|
| Model | Plan + overage | Subscription | Per-minute | Per-minute | Per-minute + BYO |
| Real cost (pilot volume) | **₹7–9/min** | ~₹800–3.5K/mo | ₹4–6.5/min | ~₹2/min | ₹12–30/min |
| Hinglish quality | Hinglish-native, 30+ lang | Hindi + English | Strong | 50+ lang | **Weak** — loses mid-sentence switches |
| DLT/DND/compliance | Built-in | Built-in (160-series) | Built-in | — | **You build it** |
| Warm transfer to human | ✓ (Growth+) | — | ✓ | — | ✓ (SIP) |
| Webhooks (cost/events) | ✓ (all plans) | Limited | ✓ | — | ✓ (full control) |
| REST API | Scale+ only | Limited | — | — | Full |
| Agent builder | No-code | No-code | Managed | No-code | Code |
| Best for | **Our pick** — programmable + Hinglish + transfer | Fallback — no-code edtech | Managed turnkey | Cheap generic | Max control, max cost |

**Verdict:** Agni is the only option that combines Hinglish-native voice, warm transfer, webhooks for our cost tracking, and a path to programmatic control (Scale). The others trade away one of those. Keep Vyora as the no-code fallback if Agni's voice/agent builder fails the P0 gate.

### Fallback: Vyora
- ~₹800–3,449/month model, edtech-focused (admissions calling), Hindi/English, auto-retries, skips DND numbers
- Choose Vyora if Agni's voice quality or agent builder doesn't meet the bar in testing

### Decision gate (P0 spike)
Run 3–5 test calls on our own phone through Agni **on the Growth plan**. Confirm:
1. Voice sounds human (not bot-like) in Hinglish
2. Webhook payload includes **per-call cost** (for our cost tracking)
3. Warm transfer works to a real number
4. Outbound campaign flow (dashboard + CSV import) is workable

Commit to the provider on that evidence. Keep the DIY path documented (§20) as a fallback if the managed voice is unacceptable.

### Why not Sarvam AI?

**What Sarvam AI actually is.** Sarvam is an Indian **foundation-model company** (Bengaluru) — it sells models and APIs, not a phone-calling product. Its relevant offerings for us:

| Sarvam product | What it does | Our take |
|---|---|---|
| **Bulbul TTS** | Text-to-speech, 11 Indian languages, 35+ voices, Hinglish/Tanglish code-switching, Indian number pronunciation (lakh/crore), sub-250ms streaming | Best-in-class Hindi voice quality — the *voice* we'd want if we built DIY |
| **Indic STT** | Speech-to-text trained on Indian call speech at scale | Industry benchmark for code-switched Hinglish — beats global STT on mid-sentence switches |
| **Sarvam LLM / Shuka** | LLM family tuned for Indian languages | Fine as a brain, but Gemini already covers Hinglish in our stack |

This is why the "just use Sarvam" instinct is tempting: on raw **voice + hearing quality for Indian audiences, Sarvam is the best there is.** But a telecaller is not a voice model — it is a phone operation.

**The decisive gap: Sarvam ships no phone-operation layer.** Everything that makes a call actually happen is missing and must be built by us:

| Requirement for our telecaller | Sarvam provides | We must build |
|---|---|---|
| A phone number (DID) that dials people | ❌ None | Sourcing + DLT registration (3-7 days, ₹5.5-7.5K) |
| PSTN connection (the call itself) | ❌ None | Twilio/Exotel/Airtel integration |
| Real-time orchestration (STT → LLM → TTS loop on a live call, turn-taking, barge-in) | ❌ None | Custom streaming pipeline |
| Outbound dialing, retries, voicemail detection, call scheduling | ❌ None | Full dialer engine |
| Warm transfer to a human | ❌ None | Call-control + SIP transfer logic |
| Webhooks with per-call events + cost | ❌ None | Everything (our `webhooks/route`, cost tracking) |
| DND/NCPR scrubbing, consent logging, calling-window enforcement, audit trails | ❌ None (you own it) | Full compliance stack + records |
| Campaigns, CSV import, agent builder, analytics dashboard | ❌ None | Everything |
| Recordings + transcripts stored and retrievable | ❌ None (you store them) | R2 storage + playback |

**The cost that hides in the API bill.** Sarvam's per-use pricing looks cheap (TTS ~₹15-30 per 10K chars ≈ ₹2-3/voice-min; STT similar), but that is only two of the six layers. The real total cost of ownership:

| Layer (DIY with Sarvam) | Cost |
|---|---|
| Sarvam Bulbul TTS | ~₹2-3/min |
| Sarvam Indic STT | ~₹2-3/min |
| LLM brain (Gemini) | ~₹0.5-1/min |
| Telephony (Twilio → India mobile) | ~₹2.5-4/min |
| Orchestration + dialer + webhooks + compliance code | ~1 month of engineering (₹1.5-3L at dev cost) + ongoing maintenance |
| DLT registration + number | ₹5.5-7.5K one-time + ~₹350-500/mo |
| **Real all-in** | **₹12-30/connected min** + 4-8 weeks build |

Independent 2026 analyses put the mid-market DIY timeline at **~six months** of build. That's the exact path we rejected in §20.

**The voice trade-off that makes Sarvam's advantage shrink.** Sarvam wins on Hindi prosody and Hinglish accuracy, but reviewers rate its expressiveness lower than premium global TTS (~3.6/5 naturalness vs ElevenLabs 4.5/5) and note it **"requires a lot of tuning"** to sound consistently human. Agni's built-in Thunder Emotion voices already target Hinglish on a phone line — the same job, without us wiring or tuning anything.

**Sarvam vs Agni, scoped to a *live call*:** both sound impressively human, but they target different halves of "human":

| Metric | Sarvam Bulbul V3 | Agni (Ravan.ai) |
|---|---|---|
| Voice texture & clarity | **Winner for studio** — 48kHz, crisp, professional voice-artist sound | Excellent, tuned for compressed 8kHz telephony lines |
| Accent & pronunciation (Indian names, Hinglish/Tanglish, numbers) | Best-in-class — flawless, linguistically perfect | Strong, native Hinglish |
| Emotional reactivity | Static/preset — good but pre-set by the user | **Winner for live calls** — emotion engine reads caller mood, shifts empathy/apology mid-call |
| Interruptions & overlap | Relies on external orchestration to handle barge-in | **Winner for live calls** — cuts off instantly (<300ms), yields like a human |
| Conversational fluency | Needs external setups | Native — sub-300ms response, adaptive pacing |

The practical consequence: Sarvam's headline advantages (studio clarity, perfect pronunciation) matter for **pre-recorded content** — audiobooks, video narration, e-learning, fixed IVR menus — where nothing compresses the audio or talks back. On a real phone line, the clarity edge mostly vanishes under 8kHz telephony, while Agni's strengths (reading the caller's mood, handling overlap, sub-300ms response) are *exactly* what makes a live call feel human. For our use case — a live outbound telecaller — Agni is the right voice engine on merit, before we even factor in the phone-operation gap above.

**When Sarvam *would* be the right choice** (documented for the future):
- Voice quality/expressiveness is the #1 priority and we accept DIY cost + timeline
- We need a voice global platforms can't do (deep regional dialects, sovereign/data-residency mandate)
- Volume is so high (1M+ min/mo) that DIY unit economics beat platform fees
- We want to productize "the voice" as our own IP long-term
- **Content production** (courses, e-learning, marketing audio) — Sarvam Bulbul is genuinely the best pick there; note this for the content team even though it's not our telecaller provider.

**Verdict.** Sarvam is the right *voice + hearing layer for a DIY build*, not a telecaller platform. Choosing it today means paying ₹12-30/connected min and months of engineering to get the same outbound calling Agni delivers at ₹7-9/connected min in the pilot. We keep Sarvam documented as the DIY fallback (§20) — it stays in the plan, just not as the chosen path.

---

## 5. Agent & Conversation Design (the "human feel")

This is 80% of whether calls work. The voice comes from Agni; the *behaviour* comes from the persona + script we design.

### 5.1 Persona spec
- **Name:** fixed per agent, e.g. "Priya". A named person gets far better answer rates than a generic "SkillYards representative".
- **Tone:** warm, polite, unhurried, professional; never pushy, never lies, never over-promises.
- **Language:** Hinglish base, mirrors the lead (§5.5).
- **Role:** calling from SkillYards admissions team.
- **Voice:** Agni Thunder Emotion voice matching the persona (pick in P0, same for all agents initially).

### 5.2 Opening script (sample, Hinglish)
> (brief pause after pickup, then:)
> "Namaste, main Priya bol rahi hoon, SkillYards admissions team se. Kya main [Name] se baat kar sakti hoon?"

**AI-disclosure decision (open, §24):** DPDP-lean approach is to disclose at greeting —
> "…SkillYards ki AI calling assistant…"
A soft disclosure reduces hang-ups but must be decided by the business; the script template supports either version.

### 5.3 Interruption / barge-in rules
- If the lead cuts in mid-sentence: **stop immediately**, acknowledge ("haan, bol rahi hoon"), let them finish.
- Never talk over the lead; wait for a full pause before responding.
- These behaviours come from Agni's engine (native sub-300ms barge-in handling); our persona rules layer on top — we configure the interruption/mood behaviour, not build it.
- This is the single biggest "bot tell" — test it explicitly in the QA matrix (§16, cases 4 and 15).

### 5.4 Objection-handling map (v1)
| Lead says… | Agent does |
|---|---|
| "Koi zaroorat nahi / not interested" | One gentle close: "Kya main thoda aur bata sakti hoon?" → if no, polite exit + tag `not_interested` |
| "Fees kitni hai?" / "Kitne din ka course hai?" | Answer from knowledge base (§8); if unknown → "mujhe confirm karke callback karungi" + flag follow-up |
| "Mujhe baad mein call karna" | Pin an actual date/time (§7) |
| "Koi insaan se baat karni hai" | Warm transfer (§6) |
| "Aap robot ho?" | Honest answer (AI assistant), then continue with the purpose |
| Abusive / "mujhe kabhi mat call karna" | Polite exit + `doNotCall = true` (§9) |

### 5.5 Language mirroring
- Lead speaks **pure Hindi** → agent switches to Hindi (same script, translated).
- Lead speaks **English** → agent switches to English.
- Hinglish only when the lead mixes. The agent follows, never forces.

### 5.6 Polite-exit script
> "Theek hai ji, aapka din shubh ho. Agar aapko kabhi koi sawaal ho toh aap humein WhatsApp/site pe message kar sakte hain. Dhanyavaad."

### 5.7 Per-target goals (drives the script focus)
| `ai_agents.target` | Call goal | Success outcome |
|---|---|---|
| `cold_outreach` | Introduce, qualify interest, capture consent | `interested` / `not_interested` |
| `enquiry_followup` | Answer the enquiry, qualify, book follow-up/appointment | `follow_up` / `transfer` |
| `scheduled_followup` | Reconnect, answer, push toward appointment/enrolment | `follow_up` / `interested` |
| `appointment_setting` | Book a counselling slot (or log intent) | `transfer` / `follow_up` |

---

## 6. Warm-Transfer Flow (handoff to humans)

The killer feature that keeps humans in the loop for the leads that matter.

### 6.1 Triggers (script-level)
When the lead says any of: *"human se baat"*, *"insaan se"*, *"customer care"*, *"manager se baat karni hai"*, *"aap real nahi ho"* → the agent acknowledges and initiates transfer.

### 6.2 How it works on Agni
- **Static transfer:** transfer to a fixed number (e.g. the on-duty telecaller's mobile).
- **Dynamic transfer:** choose the target at runtime via custom function → our API returns the on-duty telecaller's number (Agni Growth supports both).

### 6.3 Context passed to the human
The human should never take a cold call. Minimum context: lead name, phone, course interest, enquiry details, AI summary of what was discussed, consent status. Delivered via:
- Agni transfer headers/webhook → our `ai_calls` row → shown in the receiving telecaller's UI, **or**
- SMS/WhatsApp ping to the telecaller with the context before the call lands.

### 6.4 No human available
If no telecaller is on duty (hours mismatch, busy):
- Agent captures the lead's preferred callback time → `nextFollowUpAt` → follow-up campaign (§7).
- Never dump the lead to voicemail.

### 6.5 Ownership & open items
- Decide the handoff number(s) and hours (§24).
- Track outcome of transferred calls (`ai_calls.handoffTelecallerId`, outcome `transfer` → human closes it in `counselling_sessions`).

---

## 7. Follow-Up Engine Logic

Industry data: **93% of converted leads need 6+ contact attempts** — persistence is where the AI beats humans.

### 7.1 Sources of follow-ups
1. **"Call me later"** — agent pins an actual date/time, confirms it out loud, writes `nextFollowUpAt`.
2. **Explicit callback promise** — "mujhe confirm karke callback karungi" (unanswered KB question) → follow-up with the answer.
3. **Scheduled cadence** — cold leads re-dialed after a configurable interval (default 7 days) up to max attempts.
4. **Missed/voicemail** — auto-retry next business day (respecting 9am–9pm).

### 7.2 Re-entry mechanics
- `followups.service` picks due leads (`nextFollowUpAt <= now`, `outcome IN (follow_up, no_answer)`, `attempts < max`), writes them to a CSV, and an operator (or on Scale, `dialer.service`) starts the next campaign batch.
- Same agent persona is reused for continuity; **agent memory (Scale)** carries "last time you said…" context automatically.

### 7.3 Guardrails
- Min interval between attempts: configurable (default 7 days cold / 2 days hot).
- Max attempts per lead: **6** (industry norm), then auto-archive.
- `doNotCall` leads are never queued.
- Daily attempt cap per campaign to protect the budget (e.g. 50/day during pilot).

### 7.4 Scheduling
Reuse the existing **QStash cron** pattern (already used for EOD warnings) to run the follow-up sweep daily at, say, 8am IST.

---

## 8. Knowledge Base Requirements

What the agent must be able to answer accurately on the call, or it loses credibility instantly.

### 8.1 Scope for v1
- **Courses** offered (names, durations, format: online/offline/hybrid)
- **Fees** per course + any payment/installment options
- **Batches** — current/upcoming start dates
- **Eligibility** (e.g. class/age for school courses, prerequisites for professional courses)
- **Admission process** — how to enrol, what documents, counselling booking
- **SkillYards contact info** (location, phone, website)

### 8.2 Source & sync
- Primary source: **Sanity CMS** (website content) — the agent answers from a curated, exported subset (not the raw CMS).
- Sync approach: build a small export job (cron or on-publish webhook) → Agni Knowledge Base.
- KB content lives in `ai_agents`-linked docs or an Agni KB per campaign type.

### 8.3 Cost impact (affects the cost tables)
Agni KB add-ons: **₹799/KB/month** + **₹1/min** when the agent queries a KB live during a call. For v1 plan **1 knowledge base** (courses+fees+batches) → add ₹799/mo to the Growth budget; the ₹1/min only applies to minutes where KB retrieval fires.

### 8.4 Unknown answers
Never hallucinate: agent says *"main iska exact details abhi confirm karke aapko bataungi"* → flags the lead for callback with the answer (§7.1.2).

---

## 9. Compliance (handled by the platform, but our responsibilities)

- **Platform handles:** DLT Principal Entity registration, 140/160-series number, DND scrubbing, calling window, recordings/audit trail.
- **We must still:**
  - Only feed numbers we are entitled to call (leads from enquiries/CSV/CMS with consent basis).
  - Ensure the agent script **introduces who it is** (SkillYards) and captures consent on the call (DPDP).
  - Store consent basis per call/campaign in our DB (audit-ready).
  - Enforce business hours (9am–9pm IST) at campaign-schedule level in our code, independent of the platform.
  - Tag do-not-call / "never call again" numbers so they are never re-dialed (angry leads, wrong numbers, DND requests).

---

## 10. Architecture

```
[Admin app]  create campaign / pick agent persona
      ↓
[apps/api]  modules/ai-caller/
  campaign.service   → pull leads from enquiries / CSV / CMS, dedupe
  compliance.service → consent check + DND guard + 9am-9pm IST window
  dialer.service     → trigger outbound batch via provider REST API
  webhooks/route     → provider events (answered / transcript / ended / transfer)
  outcome.service    → map provider outcome → lead status + enquiry stage
  followups.service  → "call me later" → schedule into next campaign
  costs.service      → store provider-reported cost; fallback = duration × rate
  reports.service    → ₹/lead, ₹/interested, ₹/appointment aggregations
      ↓
[DB] ai_calls + ai_campaigns (system of record)
      ↓
[Admin UI] campaigns / live / results (+ cost dashboard)
```

- The provider owns: dialing, telephony, voice pipeline (STT/LLM/TTS), DLT/DND, recordings.
- We own: lead sourcing, the system of record, outcomes, follow-up logic, and **cost tracking**.
- All API routes wrapped in `createProtectedRoute` per existing middleware convention; auth = existing JWT session cookie.

### Two operating modes (driven by Agni plan)

**Growth mode (default):** campaigns are created/run from **Agni's dashboard** (CSV import + agent builder). Our API consumes Agni webhooks (call events, transcript, outcome, cost) → upserts `ai_calls` → our UI reports. No programmatic campaign trigger; `dialer.service` is not used.

```
[Agni dashboard]  create campaign / upload CSV / pick agent
      ↓  dials via Ravan/our number
[Agni]  AI call (voice, LLM, emotion) — Hinglish
      ↓  custom functions → our API (fetch lead / book follow-up)
      ↓  webhooks (events, transcript, outcome, cost)
[apps/api]  webhooks/route → outcome.service → costs.service → followups.service
      ↓
[DB] ai_calls + ai_campaigns (system of record)
      ↓
[Admin UI] campaigns (status only) / live / results (+ cost dashboard)
```

**Scale mode (upgrade path, ~2,200+ min/month):** full REST API enables `dialer.service` to create/pause/start campaigns programmatically from our code, and agent memory carries cross-call context into follow-ups.

```
[Admin UI]  create campaign
      ↓
[apps/api]  campaign.service → dialer.service (REST API → Agni)
      ↓
[Agni]  dials, AI talks — webhooks back to apps/api → DB → UI
```

`webhooks/route.js`, `outcome.service.js`, `costs.service.js`, `followups.service.js`, `reports.service.js` are identical in both modes — only campaign orchestration differs.

---

## 11. DB Schema (`packages/db/src/schema/`)

Conventions: plain JS, `drizzle-orm/pg-core`, camelCase ↔ snake_case, `uuid().defaultRandom().primaryKey()`, index via third arg. Export from `schema/index.js`.

### `aiAgents.js` — `ai_agents`
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| name | text | Display name ("Priya — SkillYards") |
| persona | text | System prompt / persona description |
| script | text | Hinglish call script |
| languageMix | text | `hinglish` default |
| voiceId | text | Provider voice id |
| greeting | text | First line spoken |
| target | text | `cold_outreach | enquiry_followup | scheduled_followup | appointment_setting` |
| createdBy | uuid → users | |
| isActive | boolean | |
| createdAt / updatedAt | timestamps | |

### `aiCampaigns.js` — `ai_campaigns`
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| name | text | |
| agentId | uuid → ai_agents | |
| leadSource | text | `enquiry | csv | cms` |
| scheduleStart / scheduleEnd | timestamptz | 9am–9pm IST guard |
| status | text | `draft | queued | running | paused | completed | cancelled` — on Growth, synced from Agni dashboard via webhooks; on Scale, driven by our REST API |
| providerRef | text | Provider-side campaign/batch id |
| consentBasis | text | e.g. `website_form | imported_list | test_lead` |
| dndScrubbedAt | timestamptz | When DND check ran |
| createdBy | uuid → users | |
| createdAt / updatedAt | timestamps | |

> **Note:** On Growth, campaign lifecycle lives in Agni's dashboard; `status`/`providerRef` are updated here via webhook sync. On Scale, `campaign.service` + `dialer.service` create and manage them programmatically. No schema change needed between modes.

### `aiCalls.js` — `ai_calls` (core, with cost tracking)
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| campaignId | uuid → ai_campaigns | |
| agentId | uuid → ai_agents | |
| enquiryId | uuid → enquiries (nullable) | **links AI calls to leads** |
| phone | text | normalized 10-digit / E.164 |
| status | text | `queued | ringing | in_progress | completed | failed | transferred` |
| outcome | text | `interested | not_interested | follow_up | transfer | dnq | no_answer | wrong_number` |
| providerCallId | text | Provider call id (dedupe/audit) |
| transcript | text | |
| summary | text | Post-call provider summary |
| recordingUrl | text | Provider recording URL (or R2 key) |
| durationSeconds | integer | Connected seconds |
| costTotalPaise | integer | **Total cost in paise** (int — no float drift) |
| costBreakdown | jsonb | `{ platformPaise, telephonyPaise, ... }` (provider shape) |
| costCurrency | text | `INR` |
| consentCaptured | boolean | Agent asked/confirmed consent on call |
| doNotCall | boolean | Lead asked never to call / abusive → never redial |
| handoffTelecallerId | uuid → users (nullable) | Human who took the warm transfer |
| nextFollowUpAt | timestamptz (nullable) | From "call me later" confirmation |
| attemptNumber | integer (default 1) | Follow-up attempt count (cap 6) |
| createdAt / updatedAt | timestamps | |

Indexes: `(campaignId, status)`, `(enquiryId)`, `(phone)`.

> **Cost tracking principle:** `costTotalPaise` is **always populated** — either from the provider's reported cost, or recomputed by `costs.service.js` from `durationSeconds` × configured per-minute rate. Cost fields live on `ai_calls`, not `follow_ups` (different billing model from human calls).

---

## 12. API Module (`apps/api/src/modules/ai-caller/`)

Mirror existing module pattern (`*.schema.js` zod / `*.service.js` logic / `*.repository.js` DB). Routes:

| Route | Method | Purpose |
|---|---|---|
| `/api/ai-caller/campaigns` | POST/GET | Create/list campaigns (Scale: full orchestration; Growth: records created from Agni dashboard sync) |
| `/api/ai-caller/campaigns/[id]` | GET/PATCH | Detail / pause / resume / cancel (Scale: REST API; Growth: read-only here, control in Agni dashboard) |
| `/api/ai-caller/campaigns/[id]/leads` | POST | Upload leads (CSV) to a campaign (Scale; Growth uploads via Agni's CSV import) |
| `/api/ai-caller/campaigns/[id]/start` | POST | Compliance gate then push batch to provider (Scale only) |
| `/api/ai-caller/agents` | POST/GET | Agent persona management |
| `/api/ai-caller/webhooks` | POST | **Public**, signed with provider secret → upsert `ai_calls` + cost + outcome |
| `/api/ai-caller/calls` | GET | Call log (admin) |
| `/api/ai-caller/reports/costs` | GET | ₹/lead, ₹/interested, ₹/appointment |

Key logic:
- `campaign.service.js` — dedupe by phone against existing `ai_calls` + `enquiries`; skip `doNotCall` numbers.
- `compliance.service.js` — run before every batch: DND guard, IST window (9am–9pm), consent basis present. Block with a clear error otherwise.
- `webhooks/route.js` — verify HMAC/signature header; idempotent upsert on `providerCallId`.
- `outcome.service.js` — map provider outcome → `enquiries.status` (e.g. `interested` → `contacted`, handoff scheduled) and set `ai_calls.outcome`.
- `costs.service.js` — parse provider cost payload → paise; fallback: `durationSeconds × rateFromEnv`; flag which source was used (`source: "provider" | "estimated"`) in `costBreakdown`.
- `followups.service.js` — collect due leads, cap attempts at 6, write CSV for the next campaign.
- `reports.service.js` — SQL aggregations over `ai_calls` grouped by campaign/date/agent.

All admin routes guarded with `canAccessAiCaller` policy in `apps/api/src/lib/permissions.js` (ADMIN/MANAGER; add `SALES` read-own later).

---

## 13. Security & Configuration

### 13.1 Webhook security
- Agni signs webhook payloads (HMAC/signature header) — `webhooks/route.js` **verifies the signature before processing**; reject anything unsigned.
- Endpoint is public (Agni must reach it) but guarded by signature + rate limiting (existing middleware).

### 13.2 New environment variables
| Var | Purpose |
|---|---|
| `AGNI_API_KEY` | Agni API key (Scale mode; also dashboard/API ops) |
| `AGNI_WEBHOOK_SECRET` | Verifies webhook payloads |
| `AGNI_NUMBER` | Our outbound DID |
| `RATE_AGNI_PLATFORM_PAISE_PER_MIN` | Fallback platform rate (e.g. 600 for ₹6) |
| `RATE_TELEPHONY_PAISE_PER_MIN` | Fallback telephony rate (e.g. 80 for ₹0.80) |
| `AI_CALLER_MAX_ATTEMPTS` | Default 6 |
| `AI_CALLER_DAILY_CAP` | Default 50 (pilot) |

- All secrets live in `.env` (already gitignored); never commit keys.
- Cost-fallback rates come from env so the estimates track the agreed contract.

### 13.3 Data
- Recordings: keep provider URL, optionally archive to R2 (existing `r2.client.js`).
- Transcripts: PII — store, but restrict access to ADMIN/MANAGER (permission policy §12).

---

## 14. Cost Tracking Deep-Dive

Per-call cost is a **first-class field**, not an afterthought — it's the entire reason we chose this provider.

### 14.1 Primary: provider-reported
- Agni webhook end-of-call payload carries per-call cost. `costs.service.js` parses it, converts to **paise (int)** to avoid float drift, and stores in `costTotalPaise` + `costBreakdown` (platform vs telephony split) + `costCurrency`.
- Mark `costBreakdown.source = "provider"`.

### 14.2 Fallback: estimated
If a webhook arrives without cost data:
```
platformPaise = durationSeconds × RATE_AGNI_PLATFORM_PAISE_PER_MIN / 60
telephonyPaise = durationSeconds × RATE_TELEPHONY_PAISE_PER_MIN / 60
costTotalPaise = platformPaise + telephonyPaise
costBreakdown.source = "estimated"
```
Never leave `costTotalPaise` null.

### 14.3 Reporting aggregations (`reports.service.js`)
- **₹/connected-min** by campaign / date / agent: `SUM(costTotalPaise) / SUM(durationSeconds) × 60`
- **₹/lead:** total cost ÷ calls with an outcome
- **₹/interested:** total cost ÷ `outcome = interested`
- **₹/appointment:** total cost ÷ `outcome = transfer` (or booked appointments)
- Daily spend line chart for the dashboard (§15.3).

---

## 15. Admin UI (`apps/admin/src/app/(authenticated)/ai-calls/`)

Follow existing pattern: server page → server action fetch → client component (like `calls/`).

### 15.1 `campaigns/`
- Create campaign: name, agent (persona picker), lead source, schedule window, consent basis
- CSV upload with column mapping (name, phone, course interest, source)
- Campaign list: status, DND scrub state, dialed/connected counts, cost-to-date
- Actions: start / pause / resume / cancel (Growth: links to Agni dashboard)

### 15.2 `live/`
- In-progress calls: caller number, lead name, live transcript stream
- Manual "transfer to human" if a manager is watching

### 15.3 `results/`
- Per-call table: lead, outcome, duration, **cost**, recording, transcript, next action
- Filters: campaign, date range, outcome, telecaller
- **Cost dashboard** (recharts): ₹/connected-min by campaign, ₹/lead, ₹/interested, ₹/appointment, daily spend line

### 15.4 `agents/`
- Manage personas/scripts (Hinglish), voice pick, greeting, transfer trigger phrases

### 15.5 `followups/`
- Due follow-up list (from §7): lead, next date, attempt count, one-click "generate CSV for next campaign"

Feature-gate behind a `ai_caller_feature` flag in `settings`, add to `Sidebar.jsx` navItems per convention.

---

## 16. Testing / QA Matrix

Run these as recorded test calls in P0 and re-run after any script change. Every case needs an Agni test number.

| # | Test case | How | Pass criteria |
|---|---|---|---|
| 1 | Hinglish conversation | Call in mixed Hinglish | Agent responds naturally, no mid-sentence "lost thread" |
| 2 | Pure Hindi | Call in Hindi | Agent mirrors to Hindi |
| 3 | Pure English | Call in English | Agent mirrors to English |
| 4 | Interruption | Cut the agent off mid-sentence | Agent stops, acknowledges, yields |
| 5 | Voicemail | Call when lead won't answer / leaves voicemail | Correct `voicemail` outcome, no wasted talk |
| 6 | No answer / busy | — | `no_answer` outcome, retry scheduled (§7) |
| 7 | Angry / abusive caller | Simulate | Polite exit, `doNotCall = true`, never re-dialed |
| 8 | "Call me later" | Ask for a later callback | Agent pins date/time, confirms, sets `nextFollowUpAt` |
| 9 | "Talk to a human" | Ask for human | Warm transfer connects to target; human gets context |
| 10 | "Aap robot ho?" | Ask if AI | Honest answer, call continues |
| 11 | Course/fee question | Ask a real course question | Correct answer from KB, or flagged callback (§8.4) |
| 12 | Wrong number / "kabhi enquiry nahi ki" | — | Graceful exit, `wrong_number` outcome |
| 13 | Frustrated / annoyed-but-polite caller | Simulate impatience, curt answers | Agent's tone shifts empathetic / apologetic mid-call, stays warm, no scripted coldness |
| 14 | Voice texture on a real line | Judge on an actual phone call, not a demo speaker | Clear under 8kHz telephony, no robotic cadence, natural pauses |
| 15 | Repeated barge-in | Talk over the agent several times in a row | Agent cuts off instantly (<300ms) each time, never talks over the lead, doesn't get "stuck" |

---

## 17. KPIs & Pilot Review

### 17.1 Metrics to track (all on the results dashboard)
- **Connect rate** — target 20–25% (AI outbound benchmark)
- **Interested rate** — target ~5% of dialed
- **Hang-up rate** — early indicator of voice/script problems
- **Average talk time** — healthy = 1.5–3 min
- **Transfer rate** — how many leads ask for a human
- **₹/lead, ₹/interested, ₹/appointment** — the cost metrics (§14.3)
- **Attempts-to-close** — should approach 6, not 2–3

### 17.2 Pilot review cadence
- **Weekly review** for the first month: results + cost dashboard + 3 random call recordings reviewed by a human (voice quality drift check).
- **Scale gate:** only expand volume when: connect ≥ 20%, ₹/interested is visible and sane, webhook cost capture is 100% complete, and at least 1 week of stable runs.

---

## 18. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Webhook payload missing cost | Medium | Cost tracking gaps | Fallback estimator (§14.2) + alert (§19) |
| Cost spike (overage + KB retrieval) | Medium | Budget blowout | Daily cap, KB retrieval awareness, weekly review |
| Provider outage / voice quality drift | Low–Med | Calls fail/robotic | P0 fallback (Vyora), re-test cadence, monitoring |
| DND / consent violation | Low (platform handles) | Legal + blacklist | Consent basis stored, do-not-call tagging, business-hours guard |
| Leads list quality (wrong numbers) | High | Wasted dials | Dedupe, wrong-number tagging, DND scrub |
| Agent hallucination (fees/courses) | High | Misinformation → churn | KB-first answers, "confirm and callback" rule (§8.4), script review |
| Scale needed sooner than expected | Low–Med | Feature gap | Documented upgrade path; growth past 2,200 min/mo triggers it |

---

## 19. Ops & Monitoring

Reuse existing patterns (QStash cron for scheduled jobs, like EOD warnings).

- **Webhook health:** heartbeat — if no webhook received in the last N hours while a campaign is `running`, alert.
- **Failed campaigns:** webhook/status sync failure → alert + mark campaign `paused`.
- **Cost anomalies:** daily spend vs expected (daily cap × rate) — alert on >2x deviation.
- **Uncaptured costs:** any `ai_calls` with `costBreakdown.source = "estimated"` count > 5% → flag (provider payload likely missing).
- **Voice quality drift:** weekly human review of 3 recordings; log issues against the agent.

---

## 20. Fallback: DIY Path (documented, not chosen)

If the managed provider's voice fails the human-feel test, this is the alternative:

- **Orchestrator:** Vapi (BYO keys) or Bolna (India-native)
- **TTS (voice):** Sarvam Bulbul v3 — most natural Hindi/Hinglish, Indian number pronunciation, sub-250ms streaming
- **STT (hearing):** Sarvam Indic STT — the #1 reason to go DIY: global STT "loses the thread" on mid-sentence Hinglish switches
- **Brain:** Gemini 2.5 Flash in existing `apps/ai-service`
- **Telephony:** Twilio/Exotel number (still needs DLT registration — 3–7 days, ~₹5.5–7.5K)
- **Real cost: ₹12–30/connected min** + ~1 month of engineering for orchestration + DLT + compliance code

Take this path only if managed voice quality is unacceptable.

---

## 21. Rollout Phases

| Phase | What | Time | Done when |
|---|---|---|---|
| **P0** | Agni account, **Growth plan**, free trial → test calls on our own phone; verify voice + webhook cost payload + warm transfer + campaign/CSV flow + QA matrix §16 | ~2–3 days | Provider + plan committed |
| **P1** | Schema (`ai_agents`, `ai_campaigns`, `ai_calls`) + migration + API module (webhooks, costs, outcome) | ~1 week | Cost captured on every call in DB |
| **P2** | Campaign runs on Agni dashboard (CSV export from `enquiries` + CSV import to Agni) + webhook ingestion + compliance gate + knowledge base setup | ~1 week | First real campaign runs and calls land in DB |
| **P3** | Admin UI: campaigns / live / results + cost dashboard + followups page | ~1 week | Ops can run campaigns without code |
| **P4** | Warm transfer to human telecallers + follow-up engine + ₹/lead reporting + **Scale upgrade evaluation** (REST API + agent memory past ~2,200 min/month) | ~1 week | Handoff loop closes |

**Pilot success metric:** ~20% connect rate, ~5% interested, and real ₹/lead visible on the dashboard before scaling beyond the pilot volume.

---

## 22. Edge Cases to Handle

- **Voicemail / no answer / "No" then hang-up** — map to distinct outcomes; don't retry same-day beyond platform limits
- **Wrong number / "maine kabhi enquiry nahi ki"** — graceful script + mark `wrong_number`
- **Angry or abusive caller** — polite exit script + set `doNotCall = true` (DPDP: never redial)
- **"Call me later"** — agent pins an actual date/time, confirms it, writes `nextFollowUpAt` → auto-schedules next campaign
- **Hinglish mirroring** — agent follows the lead's language (pure Hindi or pure English), not forced Hinglish
- **Cost webhook missing** — `costs.service.js` fallback estimates from duration × rate; flag as `estimated`
- **Duplicate leads** — dedupe by phone across `enquiries`, `ai_calls`, CSV rows before dialing
- **Lead asks something the agent can't answer** — "confirm and callback" rule (§8.4), never hallucinate

---

## 23. Roadmap (post-pilot)

- **WhatsApp/SMS follow-up** — after calls, send summary + links + reminders (many platforms offer this; keeps the thread warm)
- **Multi-language rollout** — Agni covers 30+; enable regional (Marathi, Tamil, etc.) based on lead profile
- **Scale upgrade trigger** — automated check: when monthly minutes pass ~2,200, evaluate Scale (REST API + agent memory)
- **Appointment booking in calendar** — connect to Cal.com (Agni Growth integration) so the AI books real counselling slots
- **Inbound answering** — Agni inbound routing (Scale) to answer calls when humans are busy
- **DIY revisit trigger** — if per-lead cost stays high at scale or voice quality becomes the bottleneck, revisit Sarvam/Vapi §20

---

## 24. Open Questions

- [ ] Provider spike outcome (voice quality, webhook cost payload, warm transfer, campaign/CSV flow) — **P0 gate**
- [ ] **Confirm Growth webhook payload includes per-call cost** (required for our cost tracking; else fallback duration × rate)
- [ ] Does the agent disclose it's an AI? (DPDP-lean: yes at greeting; decision needed — affects script §5.2)
- [ ] Which courses/fee/batch content do we feed the agent as its knowledge base? (source = Sanity CMS? confirm scope §8.1)
- [ ] Should the AI book real counselling appointments in the calendar, or just log intent for humans? (roadmap §23 has both options)
- [ ] Handoff target numbers (which human telecallers receive transfers, and their hours) — §6.5
- [ ] Persona name + voice pick for v1 ("Priya"? Thunder Emotion voice) — P0

---

## 25. Quick Summary

- **AI telecaller** that calls leads in Hinglish/English and warm-transfers to humans
- **Cheap path:** India-managed provider — **Agni Growth (₹5,999/mo + ₹0.80/min telephony)**, ~₹7–9/connected min at pilot volume; Scale upgrade past ~2,200 min/month. NOT the DIY Vapi/Sarvam stack at ₹12–30/min
- **We build:** `ai_agents` / `ai_campaigns` / `ai_calls` schema, `modules/ai-caller` API, admin `ai-calls` UI
- **Cost tracking is first-class:** `costTotalPaise` + `costBreakdown` on every call, provider-reported with duration-based fallback (§14)
- **Compliance:** platform handles DLT/DND; we enforce consent basis, 9am–9pm IST, and do-not-call tagging
- **Pilot budget:** ₹7–10.5K/month + GST vs ₹15–25K+/month for a human telecaller
- **Why not Sarvam:** great voice/hearing models, but ships no phone-operation layer (no dialing, telephony, campaigns, transfer, webhooks, compliance) — using it means the ₹12–30/min DIY path (§4, §20)
- **Human feel = behaviour, not just voice:** persona + interruption rules + language mirroring + objection map (§5), verified by a 15-case QA matrix (§16) — including emotional reactivity and voice texture on a real line
