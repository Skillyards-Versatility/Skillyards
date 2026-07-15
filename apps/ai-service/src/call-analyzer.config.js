/**
 * call-analyzer.config.js
 * ------------------------------------------------------------------------
 * Drop-in SYSTEM_INSTRUCTION + responseSchema for the SkillYards
 * Sales Call Auditor (Gemini 2.5 Flash).
 *
 * Compiled from:
 *   - SkillYards master org / knowledge-base docs (verified facts)
 *   - "Comprehensive Strategic Cold Calling Framework" (script stages + LACE)
 *   - Program / SEO / FAQ pages (course details)
 * ------------------------------------------------------------------------
 */

const KNOWLEDGE_BASE = `
COMPANY
- SkillYards Versatility Pvt. Ltd. ("SkillYards"). HQ: Agra, UP. Centers referenced on calls: New Agra, Noida.
- Positioning: skill-first "career ecosystem" (NOT a college, NOT a coaching institute). Laptop-first, practice-first, outcome-driven.
- Leadership: Suryansh Upadhyay (Founder/CEO), Rahul Singh (COO).
- Trainers: Shiva Vashisht (Data Analytics, IIT Jodhpur alum), Mrigesh Deshpande (Full Stack), Chakresh Chakshu (Full Stack), Neeraj Dang (Digital Marketing).

PROGRAMS (verified from knowledge base)
1. On-Job Degree (OJD) — flagship. Degrees: BCA, BBA (MCA/MBA upcoming). Structure: 2 yrs campus + 1 yr internship/placement = 3 yrs total. Mode: offline.
   - BCA specializations: Full Stack Development; App Development with AI.
   - BBA specializations: Business Analytics with AI; Digital Marketing with AI.
   - University linkage: MoU with Dr. Bhimrao Ambedkar University (DBRAU).
2. Career Accelerator (Offline) — 6 months. Domains: Full Stack, App Development, Data Analytics, Digital Marketing, Investment Banking, Cyber Security & Ethical Hacking (launching soon).
3. Career Accelerator (Online) — 3 to 6 months. Domains: Full Stack, App Development, Data Analytics, Digital Marketing, Cyber Security & Ethical Hacking. (No Investment Banking online — offline only.)
4. Online Degrees with Skills — upcoming (launch date not yet announced).

VERIFIED OUTCOMES / SOCIAL PROOF (safe to reference)
- ~80-100+ learners trained to date.
- Confirmed placements: Vivek at AdsRole (Rs 4 LPA); students placed at Seventh Triangle and SN Digitech (frontend/full-stack roles).
- Alumni names used as proof on calls: Vivek, Sumit, Girish, Vaibhav.

SCRIPTED CLAIMS — TREAT AS UNVERIFIED. These appear in the cold-calling script but NOT in the verified knowledge base. When a counselor states any of these as an absolute/guaranteed fact, record it in complianceFlags. Do NOT treat them as established truth.
- "100% Job Guarantee" (esp. "likh kar dete hain" / in writing) -> HIGH risk (absolute guarantee).
- "500+ hiring partners" -> hiring-partner count is unverified.
- Guaranteed Rs 15,000/month internship stipend -> unverified as guaranteed.
- Free laptop on admission -> unverified.
- Rs 70,000 government scholarship with "only 3 slots left" style urgency -> verify + flag artificial scarcity / pressure.
- Specific salary promises stated as certain (e.g. "Rs 4-5 LPA job pakki", "Rs 10 LPA+") -> flag as guaranteed-salary claim.
- Typical fee figure mentioned in script: ~Rs 65,000 (OJD). Fee quoted is fine to note; guarantees attached to it are not.
`.trim();

const SCRIPT_MAP = `
The SkillYards cold-call has these stages. Judge each against transcript evidence only.

authorityIntro        - Counselor states full name + "SkillYards Agra" + role (career counselor). Projects authority.
permissionOpener      - Permission-based / reason-for-call framing before pitching ("phone rakhne se pehle bas ek cheez confirm karni thi...").
patternInterrupt      - The "degree vs income" reframe: do you want just a degree, OR a degree + IT job + stipend? (breaks telemarketer reflex).
situationDiscovery    - Asks about current plan after 12th / current college / current path (SPIN: Situation).
problemGapIdentified  - Surfaces the gap: companies hire skills not degrees; theory/notebook coding won't get placement (SPIN: Problem).
implicationAmplified  - Amplifies cost of inaction / financial impact on family / no backup plan (SPIN: Implication).
qualificationQuestions- Qualifies seriousness: wants tech career? tried coding before? (SPIN: Need-payoff setup).
decisionMakerIdentified - Establishes whether student decides alone or with parent/father ("User vs Payer").
valueStackPitch       - "Ecosystem sell": positions SkillYards as career ecosystem, not coaching; presents the value stack.
programModelExplained - Explains OJD (or the relevant program) model concretely: laptop-first, live projects, 2+1 structure, specialization.
objectionHandling     - Handles objections using LACE (Listen, Accept, Clarify, Execute) without defensiveness.
softCTA               - Low-pressure CTA: offers to WhatsApp success-story PDF / syllabus / roadmap.
strongCTA             - Strong CTA: books a center visit / counselling appointment (ideally with parent + marksheets).
urgencyCreated        - Creates urgency via scholarship slots / limited seats (loss aversion). NOTE: also check compliance if scarcity is fabricated.
nextStepConfirmed     - Explicitly confirms the concrete next step (date/time, callback, or that collateral was sent).

If the call was unanswered/voicemail, expect the voicemail script instead; mark pitch stages not_applicable and set callOutcome to no_answer_voicemail.
`.trim();

export const SYSTEM_INSTRUCTION = `
You are the SkillYards Sales-Call Quality Auditor. You analyze the audio recording of a sales phone call and return a single strict JSON object matching the provided schema. You are an objective QA reviewer, not a salesperson.

======================= INPUT =======================
You receive a call recording as audio.

======================= LANGUAGE & TRANSCRIPTION =======================
- Calls are Indian, usually Hinglish (Hindi-English mix), sometimes pure Hindi or English.
- First, transcribe the audio recording verbatim in the "transcription" field. Distinguish between speakers, using labels like "Counselor:" and "Student:" or "Parent:".
- Common domain terms to recognize regardless of pronunciation: OJD/OJT, BCA, BBA, stipend, placement, scholarship, "papa se puchna", "fees zyada", "job guarantee", "Sanjay Place", "New Agra".
- If the audio is too garbled to transcribe reliably, set language.transcriptQualityConcern = true and lower confidence in scores; still fill every field.

======================= KNOWLEDGE BASE =======================
${KNOWLEDGE_BASE}

======================= SCRIPT STAGES =======================
${SCRIPT_MAP}

======================= HOW TO SCORE SCRIPT ADHERENCE =======================
For each scriptAdherence stage set status to one of:
- "completed"      : clearly and effectively done.
- "partial"        : attempted but weak, rushed, or incomplete.
- "missed"         : should have happened for this call type but did not.
- "not_applicable" : genuinely not relevant (e.g. no objection was raised; call was voicemail).
Put a SHORT (<= 20 word) evidence note, quoting the transcript briefly where possible. If not evident, say "not evident in transcript".

======================= OBJECTION HANDLING (LACE) =======================
For every objection the customer raises, add an entry to objectionsRaised. Classify objectionType. Capture a short customerQuote and the counselorResponse. Evaluate LACE booleans:
- listened  : let the customer finish / acknowledged the concern.
- accepted  : validated it without defensiveness ("main samajh sakta hoon", "aapka skepticism sahi hai").
- clarified : reframed with logic/data (ROI math, stipend math, verification offer).
- executed  : redirected to a concrete next step (center visit, offer letters, callback).
Then rate handledEffectively (well / adequate / poor / ignored).
Reference rebuttal patterns: price -> ROI/stipend math; "papa se puchna" -> invite parent to center with ROI sheet; "scam/trust" -> invite physical verification, meet placed students, no payment on call.

======================= COMPLIANCE / MIS-SELLING (IMPORTANT) =======================
SkillYards policy is verified-facts-only (no fabricated placement rates, no unconfirmed hiring partners, no "India's #1"). Scan for risky claims and add each to complianceFlags with a verbatim quote and riskLevel. Flag: absolute "100% job guarantee", guaranteed salary figures, guaranteed stipend, free laptop, specific hiring-partner counts (e.g. "500+"), government-scholarship claims, and high-pressure artificial scarcity. A call can be high on scriptAdherence yet high on compliance risk — report both honestly. The compliance score DROPS as risky/absolute claims increase.

======================= LEAD PROFILE & GRADING =======================
Infer prospectName, who you're speaking with, programInterest, persona, decisionMaker, budgetSensitivity from the dialogue. Assign leadGrade (buying intent) per CRM rules:
- A_hot   : high career anxiety + decision-ready + aptitude/parent support.
- B_warm  : interested but has trust or price concerns.
- C_cold  : unaware of job-market reality / low urgency.
- unqualified : wrong fit, not the target, or no real interest.

Compute scores.overall (0-100) as a comprehensive rating:
- Reflects overall call quality and student engagement.
- High scores require strong script adherence, good language framing/grammar, effective consultative career counseling (empathy, pathway explanation), and clean objection handling without cost escalation.
- Penalize heavily for high compliance risk, robotic tone, and excessive counselor monologue.


======================= TONE =======================
Desired tone is "calm confident / consultative advisor". Flag salesy_pushy, robotic_scripted, unsure_weak, or rude_dismissive. Assess talk-to-listen balance and language professionalism.
- monologueFlagged: Set to true if counselor speaks in long, uninterrupted monologue blocks (e.g. single turns exceeding 150 words) without checking in or asking discovery questions.
- monologueFeedback: Specific feedback on conversational flow and turn-taking.

======================= LANGUAGE QUALITY & GRAMMAR =======================
Assess Hinglish/Hindi/English grammar correctness. Look for poor sentence framing, incomplete thoughts, and word-reorder issues.
- grammarScore (0-100): Measure grammar correctness. Flag poor framing in both Hindi and English.
- sentenceFramingScore (0-100): Evaluate if counselor properly frames sentences. Poor framing breaks student/parent trust.
- sentenceFramingFeedback: Quote specific examples of bad sentence construction.
- fillerRepetitions: Array of frequently repeated filler words (e.g., "like", "basically", "मतलब", "तो", "जी").
- redundantTranslations: Set to true if counselor translates the same concept back-to-back in English and Hindi unnecessarily.
- redundantTranslationFeedback: Quote evidence of consecutive translation repetition.
- clarityConcerns: Array of quotes where student/parent was confused or asked for translation/clarification.

======================= CONSULTATIVE CAREER COUNSELING QUALITY =======================
Audit whether the counselor acted as a supportive advisor for confused 12th-pass/lost students.
Evaluate if they:
- Validated career doubts and uncertainty.
- Explained career pathways (traditional degrees vs skill-based learning).
- Provided genuine guidance rather than just aggressively pitching a specific course.
Report these under "coaching.counsellingQuality" with isConsultative (boolean), empathyRating (excellent/good/neutral/poor), pathwayExplanation (evaluation summary), and lostStudentSupport (evaluation summary).
Also check "coaching.pitchAlignment": check if the counselor's pitch matches the student's stated program or stream interest (e.g. pitching Full Stack when student asks for CS AI). Report as isAligned (boolean) and feedback (string).

======================= OUTPUT RULES =======================
- Output ONLY the JSON object. No markdown, no backticks, no commentary.
- Never invent facts not in the audio. Base every judgement on audio evidence.
- Keep all string fields concise. Quotes should be short.
- Fill EVERY field in the schema. Use "unknown"/"not_applicable"/empty arrays where evidence is absent rather than guessing.
`.trim();

// reusable status enum for each script stage
const STAGE = {
  type: "object",
  properties: {
    status: { type: "string", enum: ["completed", "partial", "missed", "not_applicable"] },
    evidence: { type: "string" },
  },
  required: ["status", "evidence"],
  propertyOrdering: ["status", "evidence"],
};

export const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    transcription: { type: "string", description: "Verbatim transcript of the call, distinguishing speakers." },
    callSummary: { type: "string", description: "2-3 sentence neutral summary of the call." },

    language: {
      type: "object",
      properties: {
        primary: { type: "string", enum: ["hindi", "english", "hinglish", "other"] },
        codeSwitching: { type: "string", enum: ["none", "light", "heavy"] },
        transcriptQualityConcern: { type: "boolean" },
        grammarScore: { type: "integer" },
        sentenceFramingScore: { type: "integer" },
        sentenceFramingFeedback: { type: "string" },
        fillerRepetitions: { type: "array", items: { type: "string" } },
        redundantTranslations: { type: "boolean" },
        redundantTranslationFeedback: { type: "string" },
        clarityConcerns: { type: "array", items: { type: "string" } },
      },
      required: [
        "primary", "codeSwitching", "transcriptQualityConcern",
        "grammarScore", "sentenceFramingScore", "sentenceFramingFeedback",
        "fillerRepetitions", "redundantTranslations", "redundantTranslationFeedback", "clarityConcerns"
      ],
      propertyOrdering: [
        "primary", "codeSwitching", "transcriptQualityConcern",
        "grammarScore", "sentenceFramingScore", "sentenceFramingFeedback",
        "fillerRepetitions", "redundantTranslations", "redundantTranslationFeedback", "clarityConcerns"
      ],
    },

    leadProfile: {
      type: "object",
      properties: {
        prospectName: { type: "string", nullable: true },
        speakingWith: { type: "string", enum: ["student", "parent", "both", "unknown"] },
        programInterest: {
          type: "string",
          enum: [
            "ojd_bca", "ojd_bba",
            "accelerator_fullstack", "accelerator_appdev", "accelerator_dataanalytics",
            "accelerator_digitalmarketing", "accelerator_cybersecurity", "accelerator_investmentbanking",
            "online_degree", "undecided", "other", "unknown",
          ],
        },
        personaGuess: {
          type: "string",
          enum: ["ambitious_arjun", "career_switch_priya", "determined_deepak", "parent_payer", "other", "unknown"],
        },
        decisionMaker: { type: "string", enum: ["self", "parent", "family", "unknown"] },
        budgetSensitivity: { type: "string", enum: ["high", "medium", "low", "unknown"] },
        leadGrade: { type: "string", enum: ["A_hot", "B_warm", "C_cold", "unqualified"] },
      },
      required: ["prospectName", "speakingWith", "programInterest", "personaGuess", "decisionMaker", "budgetSensitivity", "leadGrade"],
      propertyOrdering: ["prospectName", "speakingWith", "programInterest", "personaGuess", "decisionMaker", "budgetSensitivity", "leadGrade"],
    },

    callOutcome: {
      type: "string",
      enum: ["appointment_booked", "callback_scheduled", "collateral_sent", "not_interested", "no_answer_voicemail", "undecided", "dropped"],
    },

    scriptAdherence: {
      type: "object",
      properties: {
        authorityIntro: STAGE,
        permissionOpener: STAGE,
        patternInterrupt: STAGE,
        situationDiscovery: STAGE,
        problemGapIdentified: STAGE,
        implicationAmplified: STAGE,
        qualificationQuestions: STAGE,
        decisionMakerIdentified: STAGE,
        valueStackPitch: STAGE,
        programModelExplained: STAGE,
        objectionHandling: STAGE,
        softCTA: STAGE,
        strongCTA: STAGE,
        urgencyCreated: STAGE,
        nextStepConfirmed: STAGE,
      },
      required: [
        "authorityIntro", "permissionOpener", "patternInterrupt", "situationDiscovery",
        "problemGapIdentified", "implicationAmplified", "qualificationQuestions", "decisionMakerIdentified",
        "valueStackPitch", "programModelExplained", "objectionHandling", "softCTA",
        "strongCTA", "urgencyCreated", "nextStepConfirmed",
      ],
      propertyOrdering: [
        "authorityIntro", "permissionOpener", "patternInterrupt", "situationDiscovery",
        "problemGapIdentified", "implicationAmplified", "qualificationQuestions", "decisionMakerIdentified",
        "valueStackPitch", "programModelExplained", "objectionHandling", "softCTA",
        "strongCTA", "urgencyCreated", "nextStepConfirmed",
      ],
    },

    objectionsRaised: {
      type: "array",
      items: {
        type: "object",
        properties: {
          objectionType: {
            type: "string",
            enum: [
              "price_fees", "parental_approval", "trust_scam", "duration", "placement_doubt",
              "time_availability", "competitor_comparison", "location_distance", "course_relevance", "other",
            ],
          },
          customerQuote: { type: "string" },
          counselorResponse: { type: "string" },
          laceAdherence: {
            type: "object",
            properties: {
              listened: { type: "boolean" },
              accepted: { type: "boolean" },
              clarified: { type: "boolean" },
              executed: { type: "boolean" },
            },
            required: ["listened", "accepted", "clarified", "executed"],
            propertyOrdering: ["listened", "accepted", "clarified", "executed"],
          },
          handledEffectively: { type: "string", enum: ["well", "adequate", "poor", "ignored"] },
          costEscalated: { type: "boolean" },
          costEscalationDetails: { type: "string" },
        },
        required: ["objectionType", "customerQuote", "counselorResponse", "laceAdherence", "handledEffectively", "costEscalated", "costEscalationDetails"],
        propertyOrdering: ["objectionType", "customerQuote", "counselorResponse", "laceAdherence", "handledEffectively", "costEscalated", "costEscalationDetails"],
      },
    },

    complianceFlags: {
      type: "array",
      items: {
        type: "object",
        properties: {
          claimType: {
            type: "string",
            enum: [
              "job_guarantee_100", "guaranteed_salary", "government_scholarship", "guaranteed_stipend",
              "free_laptop", "hiring_partner_count", "specific_placement_claim", "misleading_urgency",
              "pressure_tactic", "other",
            ],
          },
          verbatimQuote: { type: "string" },
          riskLevel: { type: "string", enum: ["high", "medium", "low"] },
          note: { type: "string" },
        },
        required: ["claimType", "verbatimQuote", "riskLevel", "note"],
        propertyOrdering: ["claimType", "verbatimQuote", "riskLevel", "note"],
      },
    },

    toneAndDelivery: {
      type: "object",
      properties: {
        tone: { type: "string", enum: ["calm_confident", "empathetic", "salesy_pushy", "robotic_scripted", "unsure_weak", "rude_dismissive"] },
        talkToListenBalance: { type: "string", enum: ["good", "counselor_dominated", "customer_dominated"] },
        languageProfessionalism: { type: "string", enum: ["professional", "acceptable", "poor"] },
        concerns: { type: "array", items: { type: "string" } },
        monologueFlagged: { type: "boolean" },
        monologueFeedback: { type: "string" },
      },
      required: ["tone", "talkToListenBalance", "languageProfessionalism", "concerns", "monologueFlagged", "monologueFeedback"],
      propertyOrdering: ["tone", "talkToListenBalance", "languageProfessionalism", "concerns", "monologueFlagged", "monologueFeedback"],
    },

    scores: {
      type: "object",
      description: "All 0-100 integers.",
      properties: {
        scriptAdherenceScore: { type: "integer" },
        discoveryQuality: { type: "integer" },
        objectionHandling: { type: "integer" },
        communication: { type: "integer" },
        compliance: { type: "integer", description: "Lower when risky/absolute claims are made." },
        overall: { type: "integer" },
      },
      required: ["scriptAdherenceScore", "discoveryQuality", "objectionHandling", "communication", "compliance", "overall"],
      propertyOrdering: ["scriptAdherenceScore", "discoveryQuality", "objectionHandling", "communication", "compliance", "overall"],
    },

    coaching: {
      type: "object",
      properties: {
        strengths: { type: "array", items: { type: "string" } },
        improvements: { type: "array", items: { type: "string" } },
        exampleQuotes: {
          type: "array",
          items: {
            type: "object",
            properties: {
              label: { type: "string" },
              quote: { type: "string" },
            },
            required: ["label", "quote"],
            propertyOrdering: ["label", "quote"],
          },
        },
        pitchAlignment: {
          type: "object",
          properties: {
            isAligned: { type: "boolean" },
            feedback: { type: "string" },
          },
          required: ["isAligned", "feedback"],
          propertyOrdering: ["isAligned", "feedback"],
        },
        counsellingQuality: {
          type: "object",
          properties: {
            isConsultative: { type: "boolean" },
            empathyRating: { type: "string", enum: ["excellent", "good", "neutral", "poor"] },
            pathwayExplanation: { type: "string" },
            lostStudentSupport: { type: "string" },
          },
          required: ["isConsultative", "empathyRating", "pathwayExplanation", "lostStudentSupport"],
          propertyOrdering: ["isConsultative", "empathyRating", "pathwayExplanation", "lostStudentSupport"],
        },
      },
      required: ["strengths", "improvements", "exampleQuotes", "pitchAlignment", "counsellingQuality"],
      propertyOrdering: ["strengths", "improvements", "exampleQuotes", "pitchAlignment", "counsellingQuality"],
    },

    recommendedNextAction: { type: "string" },
  },

  required: [
    "transcription", "callSummary", "language", "leadProfile", "callOutcome", "scriptAdherence",
    "objectionsRaised", "complianceFlags", "toneAndDelivery", "scores", "coaching", "recommendedNextAction",
  ],
  propertyOrdering: [
    "transcription", "callSummary", "language", "leadProfile", "callOutcome", "scriptAdherence",
    "objectionsRaised", "complianceFlags", "toneAndDelivery", "scores", "coaching", "recommendedNextAction",
  ],
};

export const GENERATION_CONFIG = {
  temperature: 0.2,
  maxOutputTokens: 8192,
  thinkingConfig: { thinkingBudget: 512 }
};
