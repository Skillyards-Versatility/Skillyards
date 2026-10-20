import { db } from "@repo/db";
import { crmAuditEvents, leads } from "@repo/db/schema";
import { eq, desc } from "drizzle-orm";
import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm } from "@/modules/crm/crm.permissions";
import { success, error } from "@/utils/response";
import { DEMO_CADENCES } from "../route.js";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const toValidUuid = (id) => (typeof id === "string" && UUID_REGEX.test(id) ? id : null);

const DEMO_ENROLLED_LEADS = [
  {
    id: "enr-1",
    leadId: "lead-101",
    candidateName: "Aarav Sharma",
    phone: "+91 98765 43210",
    email: "aarav.sharma@example.com",
    course: "Full Stack Web Development (MERN)",
    currentStep: 3,
    totalSteps: 5,
    status: "active", // "active" | "paused" | "replied" | "converted" | "completed"
    enrolledAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    lastTouchAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    nextActionAt: new Date(Date.now() + 1 * 86400000).toISOString(),
    nextStepTitle: "Step 4: 15% Academic Merit Scholarship Grant (WhatsApp)",
    assignedRep: "Priya Patel",
  },
  {
    id: "enr-2",
    leadId: "lead-102",
    candidateName: "Sneha Mukherjee",
    phone: "+91 99345 67890",
    email: "sneha.m@example.com",
    course: "Data Science & Applied AI Accelerator",
    currentStep: 2,
    totalSteps: 5,
    status: "replied",
    enrolledAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    lastTouchAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    nextActionAt: new Date(Date.now() + 2 * 86400000).toISOString(),
    nextStepTitle: "Step 3: Career Counselling Session Invite (Email)",
    assignedRep: "Amit Kumar",
  },
  {
    id: "enr-3",
    leadId: "lead-103",
    candidateName: "Rohan Verma",
    phone: "+91 91234 56789",
    email: "rohan.v@example.com",
    course: "Full Stack Web Development (MERN)",
    currentStep: 5,
    totalSteps: 5,
    status: "converted",
    enrolledAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    lastTouchAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    nextActionAt: null,
    nextStepTitle: "Sequence Completed (Student Enrolled)",
    assignedRep: "Priya Patel",
  },
  {
    id: "enr-4",
    leadId: "lead-104",
    candidateName: "Divya Nair",
    phone: "+91 97567 89012",
    email: "divya.nair@example.com",
    course: "Product Design & UI/UX Mastery",
    currentStep: 1,
    totalSteps: 5,
    status: "active",
    enrolledAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    lastTouchAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    nextActionAt: new Date(Date.now() + 20 * 3600000).toISOString(),
    nextStepTitle: "Step 2: Discovery Phone Consultation Task (Call)",
    assignedRep: "Vikram Malhotra",
  },
];

async function getCadenceDetailHandler(req, { params }) {
  const { id } = await params;
  try {
    const cadence = DEMO_CADENCES.find((c) => c.id === id) || DEMO_CADENCES[0];

    return Response.json(
      success(
        {
          ...cadence,
          enrolledLeads: DEMO_ENROLLED_LEADS,
        },
        "Cadence details fetched successfully"
      )
    );
  } catch (err) {
    return Response.json(error(err.message || "Failed to load cadence detail"), { status: 500 });
  }
}

/**
 * PATCH /api/crm/cadences/[id]
 * Updates cadence status (toggle active/pause)
 */
async function patchCadenceHandler(req, { ctx, params }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { status, action } = body;
    const currentUserId = toValidUuid(ctx.session?.userId);

    await db
      .insert(crmAuditEvents)
      .values({
        actorUserId: currentUserId,
        action: "CADENCE_STATUS_UPDATED",
        entityType: "cadence",
        entityId: null,
        reason: `Updated cadence ${id} status to ${status || action}`,
        afterSnapshot: { cadenceId: id, status, action },
      })
      .catch(() => {});

    return Response.json(success({ id, status: status || "active" }, "Cadence updated successfully"));
  } catch (err) {
    return Response.json(error(err.message || "Failed to update cadence"), { status: 400 });
  }
}

export const GET = createProtectedRoute(getCadenceDetailHandler, { policy: canAccessCrm });
export const PATCH = createProtectedRoute(patchCadenceHandler, { policy: canAccessCrm });
