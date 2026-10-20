import { db } from "@repo/db";
import { crmAuditEvents, leads } from "@repo/db/schema";
import { eq, desc } from "drizzle-orm";
import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm } from "@/modules/crm/crm.permissions";
import { success, error } from "@/utils/response";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const toValidUuid = (id) => (typeof id === "string" && UUID_REGEX.test(id) ? id : null);

export const DEMO_CADENCES = [
  {
    id: "cad-101",
    name: "7-Day High Intent Prospect Nurture",
    code: "CAD-7D-INTENT",
    targetCourse: "Full Stack Web Development (MERN)",
    description: "Automated 5-step multi-channel cadence for fresh web enquiries, converting interest into counselling.",
    status: "active",
    enrolledCount: 28,
    activeCount: 19,
    completedCount: 9,
    convertedCount: 6,
    conversionRate: 21.4,
    responseRate: 46.4,
    channels: ["whatsapp", "call", "email", "sms"],
    steps: [
      {
        stepNumber: 1,
        dayOffset: 0,
        channel: "whatsapp",
        title: "Instant Course Brochure & Welcome",
        description: "Sends MERN curriculum PDF link and welcomes candidate to Skillyards.",
        templateName: "Curriculum Brochure",
      },
      {
        stepNumber: 2,
        dayOffset: 1,
        channel: "call",
        title: "Discovery Phone Consultation Task",
        description: "Creates high-priority softphone dialer task for assigned counsellor.",
        templateName: "1-on-1 Discovery Call",
      },
      {
        stepNumber: 3,
        dayOffset: 3,
        channel: "email",
        title: "Career Counselling Session Invite",
        description: "Emails Google Meet video link for dedicated senior mentor counselling.",
        templateName: "Counselling Room Link",
      },
      {
        stepNumber: 4,
        dayOffset: 5,
        channel: "whatsapp",
        title: "15% Academic Merit Scholarship Grant",
        description: "Sends coupon SKY-MERIT-15 with 48-hour expiration timer.",
        templateName: "Merit Scholarship Offer",
      },
      {
        stepNumber: 5,
        dayOffset: 7,
        channel: "call",
        title: "Final Cohort Seat Reservation Call",
        description: "Executive follow-up call to finalize enrollment down-payment or 0% EMI.",
        templateName: "Cohort Seat Lock Call",
      },
    ],
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    id: "cad-102",
    name: "14-Day Cold & Unresponsive Lead Re-engagement",
    code: "CAD-14D-REVIVE",
    targetCourse: "Data Science & Applied AI Accelerator",
    description: "Revives prospects who went silent after initial enquiry with placement case studies and AI trends.",
    status: "active",
    enrolledCount: 42,
    activeCount: 27,
    completedCount: 15,
    convertedCount: 5,
    conversionRate: 11.9,
    responseRate: 31.0,
    channels: ["email", "whatsapp", "sms"],
    steps: [
      {
        stepNumber: 1,
        dayOffset: 0,
        channel: "email",
        title: "Highest Paying Tech Skills 2026 Report",
        description: "Sends industry salary benchmarks and alumni placement breakdown.",
        templateName: "Industry Salary Report",
      },
      {
        stepNumber: 2,
        dayOffset: 4,
        channel: "whatsapp",
        title: "Free AI Masterclass & Live Project Demo",
        description: "Invites candidate to weekend live system design and LLM fine-tuning webinar.",
        templateName: "Webinar VIP Pass",
      },
      {
        stepNumber: 3,
        dayOffset: 9,
        channel: "sms",
        title: "Alumni Hiring Spotlight & Interview Prep",
        description: "Case study of graduate placed at top tier product MNC.",
        templateName: "Placement Spotlight",
      },
      {
        stepNumber: 4,
        dayOffset: 14,
        channel: "whatsapp",
        title: "Profile Archive Warning & Final Consultation",
        description: "Polite notice before lead profile is closed, offering 1 last slot.",
        templateName: "Archive Notice",
      },
    ],
    createdAt: new Date(Date.now() - 35 * 86400000).toISOString(),
  },
  {
    id: "cad-103",
    name: "Weekend Cohort Launch Countdown (Urgency Drip)",
    code: "CAD-5D-COUNTDOWN",
    targetCourse: "All Courses",
    description: "High-urgency 5-day blitz leading up to cohort start date when seats are 85%+ full.",
    status: "active",
    enrolledCount: 19,
    activeCount: 11,
    completedCount: 8,
    convertedCount: 7,
    conversionRate: 36.8,
    responseRate: 57.9,
    channels: ["whatsapp", "sms", "call"],
    steps: [
      {
        stepNumber: 1,
        dayOffset: 0,
        channel: "whatsapp",
        title: "Batch 85% Full — 4 Seats Remaining Alert",
        description: "Live occupancy meter screenshot and seat reservation request.",
        templateName: "Live Seat Alert",
      },
      {
        stepNumber: 2,
        dayOffset: 2,
        channel: "sms",
        title: "Zero Cost 10-Month EMI Digital Pre-Approval",
        description: "Insta-approval link for ₹4,500/month 0% interest payment plan.",
        templateName: "EMI Instant Approval",
      },
      {
        stepNumber: 3,
        dayOffset: 4,
        channel: "call",
        title: "Direct Admissions Desk Call",
        description: "Counsellor emergency slot lock call 24 hours prior to cohort launch.",
        templateName: "Emergency Lock Call",
      },
    ],
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
];

/**
 * GET /api/crm/cadences
 * Returns active lead nurturing drip cadences with metrics
 */
async function getCadencesHandler(req) {
  try {
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");
    const courseFilter = searchParams.get("courseName");

    let result = DEMO_CADENCES;

    if (statusFilter) {
      result = result.filter((c) => c.status === statusFilter);
    }
    if (courseFilter) {
      result = result.filter(
        (c) =>
          c.targetCourse.toLowerCase().includes(courseFilter.toLowerCase()) ||
          c.targetCourse === "All Courses"
      );
    }

    return Response.json(success(result, "Cadences fetched successfully"));
  } catch (err) {
    return Response.json(error(err.message || "Failed to load cadences"), { status: 500 });
  }
}

/**
 * POST /api/crm/cadences
 * Creates a new cadence template and logs audit record
 */
async function postCadenceHandler(req, { ctx }) {
  try {
    const body = await req.json();
    const { name, targetCourse = "All Courses", description, steps = [] } = body;

    if (!name || name.trim().length === 0) {
      return Response.json(error("Cadence name is required"), { status: 400 });
    }

    const currentUserId = toValidUuid(ctx.session?.userId);
    const cadenceId = `cad-${Date.now()}`;
    const code = `CAD-${name.slice(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;

    const newCadence = {
      id: cadenceId,
      name: name.trim(),
      code,
      targetCourse,
      description: description || "Custom sales automation nurture sequence",
      status: "active",
      enrolledCount: 0,
      activeCount: 0,
      completedCount: 0,
      convertedCount: 0,
      conversionRate: 0,
      responseRate: 0,
      channels: Array.from(new Set(steps.map((s) => s.channel))),
      steps: steps.map((s, idx) => ({
        stepNumber: idx + 1,
        dayOffset: Number(s.dayOffset) || idx * 2,
        channel: s.channel || "whatsapp",
        title: s.title || `Step ${idx + 1}`,
        description: s.description || "Automated touchpoint",
        templateName: s.templateName || "Standard Template",
      })),
      createdAt: new Date().toISOString(),
    };

    // Log to audit events
    await db
      .insert(crmAuditEvents)
      .values({
        actorUserId: currentUserId,
        action: "CADENCE_CREATED",
        entityType: "cadence",
        entityId: null,
        reason: `Created cadence "${name}" with ${steps.length} automated steps for ${targetCourse}`,
        afterSnapshot: {
          name,
          targetCourse,
          stepCount: steps.length,
        },
      })
      .catch((e) => console.warn("Failed to log audit event:", e));

    return Response.json(success(newCadence, "Cadence created successfully"), { status: 201 });
  } catch (err) {
    return Response.json(error(err.message || "Failed to create cadence"), { status: 400 });
  }
}

export const GET = createProtectedRoute(getCadencesHandler, { policy: canAccessCrm });
export const POST = createProtectedRoute(postCadenceHandler, { policy: canAccessCrm });
