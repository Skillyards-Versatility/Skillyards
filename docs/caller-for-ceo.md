# AI Telecaller — Summary for Decision-Makers

> A non-technical overview: what it is, what it costs, what it earns back, and what we need from you. All numbers are real 2026 pricing. The engineering detail lives in `docs/caller.md`.

---

## 1. What it is

An AI phone agent (working name **"Priya"**) that calls our leads on the phone, talks in **Hinglish + English**, and does the first job a telecaller does:

- introduces SkillYards,
- answers common course / fee / batch / eligibility questions,
- books a follow-up at a date/time the lead chooses,
- and **hands the call to a real telecaller** the moment the lead asks for one — with context, so the human doesn't have to re-explain anything.

It works **alongside** our existing calling team, not instead of it. The humans keep the hot calls; the AI does the dialing, the persistence, and the grunt work.

**What a call sounds like (real example from the script):**
> *"Namaste, main Priya bol rahi hoon, SkillYards admissions team se. Kya main [Name] se baat kar sakti hoon?"*
> Lead: *"Fees kitni hai?"* → Priya answers from our course database, or says *"mujhe confirm karke callback karungi"* and flags it.
> Lead: *"Mujhe kisi insaan se baat karni hai"* → Priya transfers the call to a live telecaller with a summary of the conversation.

It's not a chatbot and it's not a pre-recorded message. It listens, responds, is interrupted politely, and adapts its tone to the caller — the things that make a voice feel human.

---

## 2. What it costs

### 2.1 The pilot bill, line by line

Pilot = **30–50 calls/day**, ~15 conversations, ~2.5 min each.

| Item | Monthly |
|---|---|
| Platform subscription (Agni Growth: voice AI, Hinglish, campaigns, transfer, compliance built in) | ₹5,999 |
| Included 1,000 call-minutes; overage at pilot volume (~0–350 min) | ₹0–2,100 |
| Phone line / calling charges (~₹0.80/min) | ~₹900 |
| Phone number rental | ₹350 |
| **Subtotal** | **~₹7.2K–9.5K** |
| GST (18%) | +₹1.3K–1.7K |
| **All-in monthly** | **~₹8.5K–11.2K** |

Working cost: **~₹7–9 per minute actually spent talking** — roughly **₹20 per conversation** that connects, a few rupees per dial.

### 2.2 Why this beats the alternatives

| Route | Monthly cost (pilot) | Catch |
|---|---|---|
| **AI telecaller** | **~₹8.5–11.2K all-in** | None at pilot scale |
| One human telecaller | ₹15K–25K + recruitment, training, leaves, phone/internet | Can't do weekends/nights, quits after 2–3 attempts |
| Hiring a second telecaller | +₹15–25K | Same limits, doubled cost |
| "Do it ourselves" with cheap-sounding AI tools | ₹15–40K | *Plus* months of engineering, compliance you own, and it ends up costlier per minute (₹12–30/min) |

### 2.3 What the money buys, per lead

Using our target conversation rates (20–25% answer, ~5% genuinely interested):

| Metric | Cost |
|---|---|
| Per dial (whether or not they pick up) | a few rupees |
| Per conversation that connects | ~₹20 |
| Per genuinely interested lead | ~₹120 |
| Per warm transfer to a human | ~₹400–800 |

For comparison, a human telecaller's staff time is roughly ₹100+ per dial before the lead even answers.

### 2.4 If volume grows (automatic plan switch at ~2,200 min/month)

| Volume | Monthly cost | Per minute |
|---|---|---|
| Pilot (~1,000 min) | ~₹9K | ₹9 |
| 2,000 min | ~₹14.5K | ₹7 |
| 5,000 min | ~₹27.5K | ₹5.5 |
| 5,000 calls/month (scaled, real-world example) | ~₹79K | ~₹16/call |

The more we call, the cheaper each minute gets — no new hiring, no new desks.

---

## 3. The impact (why it's worth the money)

### 3.1 The numbers that matter

- **More leads actually reached.** 93% of leads who eventually convert need **6+ contact attempts**. Human telecallers give up after 2–3. The AI tries up to 6 times, automatically, on schedule.
- **Speed-to-lead: 2.5 hours → 28 seconds.** Leads called in minutes, not hours, convert at far higher rates. The AI starts dialing the moment a lead form lands.
- **Higher answer rate.** AI outbound calls connect at **20–25%** vs **8–15%** for human callers — more conversations from the same lead list.
- **Better conversion at lower cost.** Published edtech deployments of AI-led calling report **~3x conversion and ~60% lower cost per acquisition**.
- **Humans only where they add value.** Telecallers stop dialing, waiting on no-answers, and getting wrong numbers. They only pick up **hot** calls — pre-qualified, with context. That raises their morale, their talk-to-qualified ratio, and their conversion.

### 3.2 What one month looks like at pilot scale (illustrative)

| Per month | Estimate |
|---|---|
| Dials | ~1,400 |
| Conversations | ~300 |
| Interested leads | ~70 |
| Warm transfers to humans | ~15–30 |
| **Total bill** | **~₹8.5–11.2K** |

### 3.3 Payback: how little it needs to earn to pay for itself

Even **one or two extra enrollments per month** (well within the projected interest pipeline) covers the entire monthly bill — everything above that is pure gain. In enrollment-value terms, the AI pays for itself if it helps convert **one course sale a month** at our typical course price. The realistic upside is far higher.

### 3.4 Head to head

| | Human telecaller | AI telecaller |
|---|---|---|
| Cost/month | ₹15–25K + overhead | **~₹8.5–11.2K all-in** |
| Calls/day | ~40–60 | 30–50 (scales without hiring) |
| Follow-ups | Quits after 2–3 attempts | Up to 6, automatic |
| Weekends / after hours | No | Yes (within legal hours) |
| Handles abuse / wrong numbers | Tires, gets discouraged | Tags "do-not-call", moves on |
| Warm transfer with context | — | Built in |
| Tired / sick / leaves | Yes | Never |

**Bottom line: for roughly half the cost of one telecaller, we get a tireless second caller that hands hot leads to the humans at the right moment.**

---

## 4. What it's NOT (boundaries, so expectations are right)

- **Not a replacement for the sales team.** It qualifies and routes; humans close.
- **Not a booking system on its own.** It logs appointment intent and hands off — the transfer to a human is the booking moment.
- **Not a WhatsApp bot or email drip.** It's voice on a phone call only (SMS/WhatsApp follow-up is a planned later phase).
- **Not instantly "done".** It needs a 3–4 week pilot to tune the voice and script, and a weekly human spot-check of recordings to keep quality high.

---

## 5. How we roll it out (first month)

| Week | What happens | Money spent |
|---|---|---|
| **Setup (2–3 days)** | Test calls on our own phones: voice quality, Hinglish, transfer, cost capture | Trial credits, ~nothing |
| **Week 1** | Load leads, run first real campaign, verify every call is recorded with its cost | ~₹9K |
| **Week 2** | Admin dashboard live (calls, results, cost per lead) — ops can run campaigns without any code | — |
| **Week 3** | Follow-up engine + warm transfer to real telecallers | — |
| **Week 4** | Review vs go/no-go bar (below) | — |

**No long-term lock-in.** If the voice or the cost fails the test in week 1–2, we stop — we've only spent ~₹9K and 2–3 weeks.

### Go/no-go bar (we'll report this to you weekly)
- ≥ 20% of calls answered, ~5% interested
- Real cost-per-lead visible on the dashboard (no guesswork)
- Voice quality passes a human review of recordings each week
- One stable week of runs before we scale volume

---

## 6. Risks and how we've covered them

| Risk | How we handle it |
|---|---|
| Cost spikes | Hard daily call cap; weekly cost review; automatic alerts at 2x expected spend |
| Voice sounds robotic | Human reviews 3 recordings weekly; provider fallback already chosen if it fails the test |
| Wrong/old lead numbers wasting dials | Dedupe + "wrong number" tagging so bad numbers are retired |
| Legal: do-not-call / consent | Platform scrubs DND numbers, logs consent, only calls 9am–9pm; abusive callers are tagged "never call again" |
| Agent says wrong course info | Rule: it only answers from our course data, otherwise "I'll confirm and call back" — never invents fees |
| Provider outage | Monitoring alerts + a tested fallback provider ready to switch to |

---

## 7. What we need from you (three decisions)

1. **Green-light the pilot** — ~2–3 days of setup, then ~₹8.5–11.2K/month all-in during the pilot. Reversible at any time.
2. **The disclosure question:** the script can open with *"…SkillYards ki AI calling assistant…"* (safer under the new DPDP data law, may cost slightly more hang-ups) or keep the greeting neutral. **Our recommendation: disclose as AI.**
3. **Handoff numbers & hours** — which telecaller phone numbers and working hours the AI should transfer hot leads to.

Everything else is implementation detail already planned (`docs/caller.md`).
