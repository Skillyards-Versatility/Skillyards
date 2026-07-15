import { RESPONSE_SCHEMA } from "../apps/ai-service/src/call-analyzer.config.js";

// Helper to validate schema conformance
function validateObject(obj, schema, path = "root") {
  if (schema.type === "object") {
    if (typeof obj !== "object" || obj === null) {
      throw new Error(`Validation Error: ${path} should be an object.`);
    }

    // Check required properties
    if (schema.required) {
      for (const req of schema.required) {
        if (!(req in obj)) {
          throw new Error(`Validation Error: Required field "${req}" is missing in ${path}.`);
        }
      }
    }

    // Validate nested properties
    for (const [key, value] of Object.entries(obj)) {
      if (schema.properties && schema.properties[key]) {
        validateObject(value, schema.properties[key], `${path}.${key}`);
      }
    }
  } else if (schema.type === "array") {
    if (!Array.isArray(obj)) {
      throw new Error(`Validation Error: ${path} should be an array.`);
    }
    if (schema.items) {
      obj.forEach((item, index) => {
        validateObject(item, schema.items, `${path}[${index}]`);
      });
    }
  } else if (schema.type === "string") {
    if (typeof obj !== "string" && (!schema.nullable || obj !== null)) {
      throw new Error(`Validation Error: ${path} should be a string (or null if allowed).`);
    }
    if (schema.enum && !schema.enum.includes(obj)) {
      throw new Error(`Validation Error: ${path} value "${obj}" is not in allowed enum [${schema.enum.join(", ")}].`);
    }
  } else if (schema.type === "integer") {
    if (!Number.isInteger(obj)) {
      throw new Error(`Validation Error: ${path} should be an integer.`);
    }
  } else if (schema.type === "boolean") {
    if (typeof obj !== "boolean") {
      throw new Error(`Validation Error: ${path} should be a boolean.`);
    }
  }
}

// Mock analysis payload conforming to RESPONSE_SCHEMA
const mockAnalysisResult = {
  transcription: "Counselor: Welcome to SkillYards. Student: Hello.",
  callSummary: "A standard welcome call explaining programs.",
  language: {
    primary: "hinglish",
    codeSwitching: "light",
    transcriptQualityConcern: false
  },
  leadProfile: {
    prospectName: "Arjun Kumar",
    speakingWith: "student",
    programInterest: "ojd_bca",
    personaGuess: "ambitious_arjun",
    decisionMaker: "self",
    budgetSensitivity: "medium",
    leadGrade: "A_hot"
  },
  callOutcome: "appointment_booked",
  scriptAdherence: {
    authorityIntro: { status: "completed", evidence: "Introduced as counselor" },
    permissionOpener: { status: "completed", evidence: "Asked for 2 mins" },
    patternInterrupt: { status: "completed", evidence: "Degree vs job pitch" },
    situationDiscovery: { status: "completed", evidence: "Asked for background info" },
    problemGapIdentified: { status: "completed", evidence: "Highlighted lack of skills" },
    implicationAmplified: { status: "completed", evidence: "Discussed job security" },
    qualificationQuestions: { status: "completed", evidence: "Validated career goal" },
    decisionMakerIdentified: { status: "completed", evidence: "Asked about parents" },
    valueStackPitch: { status: "completed", evidence: "Pitched curriculum value" },
    programModelExplained: { status: "completed", evidence: "Explained 2+1 campus plan" },
    objectionHandling: { status: "completed", evidence: "Addressed fees skepticism" },
    softCTA: { status: "completed", evidence: "Sent syllabus link" },
    strongCTA: { status: "completed", evidence: "Booked visit" },
    urgencyCreated: { status: "completed", evidence: "Scarcity of slots" },
    nextStepConfirmed: { status: "completed", evidence: "Confirmed date" }
  },
  objectionsRaised: [
    {
      objectionType: "price_fees",
      customerQuote: "Fees is a bit high.",
      counselorResponse: "Offered installment details.",
      laceAdherence: {
        listened: true,
        accepted: true,
        clarified: true,
        executed: true
      },
      handledEffectively: "well"
    }
  ],
  complianceFlags: [
    {
      claimType: "job_guarantee_100",
      verbatimQuote: "100% placement likh ke denge",
      riskLevel: "high",
      note: "Do not guarantee absolute jobs."
    }
  ],
  toneAndDelivery: {
    tone: "calm_confident",
    talkToListenBalance: "good",
    languageProfessionalism: "professional",
    concerns: []
  },
  scores: {
    scriptAdherenceScore: 90,
    discoveryQuality: 85,
    objectionHandling: 90,
    communication: 95,
    compliance: 70,
    overall: 86
  },
  coaching: {
    strengths: ["Excellent LACE approach", "Tone control"],
    improvements: ["Avoid absolute guarantees"],
    exampleQuotes: [
      { label: "good_rebuttal", quote: "Aap center check kijiye" }
    ]
  },
  recommendedNextAction: "Verify scholarship proof at center."
};

try {
  console.log("Starting schema conformance test...");
  validateObject(mockAnalysisResult, RESPONSE_SCHEMA);
  console.log("\x1b[32m%s\x1b[0m", "SUCCESS: Schema conformance validated successfully! Mock data matches RESPONSE_SCHEMA structure.");
} catch (err) {
  console.error("\x1b[31m%s\x1b[0m", "FAILURE: Mock data fails schema validation!");
  console.error(err.message);
  process.exit(1);
}
