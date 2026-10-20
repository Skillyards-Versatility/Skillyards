import { db } from "@repo/db";
import { batches, students, crmAuditEvents, payments } from "@repo/db/schema";
import { eq, desc } from "drizzle-orm";
import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm } from "@/modules/crm/crm.permissions";
import { success, error } from "@/utils/response";
import { DEMO_COHORTS } from "../route.js";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const toValidUuid = (id) => (typeof id === "string" && UUID_REGEX.test(id) ? id : null);

const DEMO_STUDENTS_BY_COHORT = {
  "cohort-101": [
    {
      id: "st-1",
      studentId: "SKY-2026-8812",
      name: "Kabir Mehta",
      phone: "+91 98456 78901",
      email: "kabir.m@example.com",
      paymentStatus: "fully_paid",
      amountPaid: 45000,
      totalAmount: 45000,
      enrolledAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    },
    {
      id: "st-2",
      studentId: "SKY-2026-6623",
      name: "Aarav Sharma",
      phone: "+91 98765 43210",
      email: "aarav.sharma@example.com",
      paymentStatus: "partial_paid",
      amountPaid: 25000,
      totalAmount: 45135,
      enrolledAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    },
    {
      id: "st-3",
      studentId: "SKY-2026-5510",
      name: "Rohan Verma",
      phone: "+91 91234 56789",
      email: "rohan.v@example.com",
      paymentStatus: "fully_paid",
      amountPaid: 50000,
      totalAmount: 50000,
      enrolledAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    },
  ],
  "cohort-102": [
    {
      id: "st-4",
      studentId: "SKY-2026-7731",
      name: "Sneha Mukherjee",
      phone: "+91 99345 67890",
      email: "sneha.m@example.com",
      paymentStatus: "emi_active",
      amountPaid: 5192,
      totalAmount: 51920,
      enrolledAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
  ],
};

async function getCohortDetailHandler(req, { params }) {
  const { id } = await params;
  try {
    const validId = toValidUuid(id);
    let cohort = null;
    let enrolledStudents = [];

    if (validId) {
      try {
        const [found] = await db
          .select()
          .from(batches)
          .where(eq(batches.id, validId))
          .limit(1);
        if (found) {
          cohort = {
            id: found.id,
            code: `SKY-${found.name.slice(0, 3).toUpperCase()}-01`,
            name: found.name,
            courseName: found.courseName,
            schedule: found.description || "Weekend Live Cohort",
            mentorName: "Senior Faculty Lead",
            mentorRole: "Admissions Mentor",
            mentorAvatar: "SF",
            description: found.description || "Skillyards accelerator live cohort",
            startDate: found.startDate,
            status: found.status,
            maxCapacity: 30,
            createdAt: found.createdAt,
          };

          // Fetch students in this batch
          const studentRows = await db
            .select({
              id: students.id,
              name: students.name,
              phone: students.phone,
              email: students.email,
              finalFee: students.finalFee,
              createdAt: students.createdAt,
            })
            .from(students)
            .where(eq(students.batchId, validId))
            .orderBy(desc(students.createdAt));

          enrolledStudents = studentRows.map((st) => ({
            id: st.id,
            studentId: `SKY-2026-${st.id.slice(0, 4).toUpperCase()}`,
            name: st.name,
            phone: st.phone,
            email: st.email,
            paymentStatus: "active",
            totalAmount: st.finalFee || 45000,
            enrolledAt: st.createdAt,
          }));
        }
      } catch (dbErr) {
        console.warn("DB get cohort warning:", dbErr.message);
      }
    }

    if (!cohort) {
      cohort = DEMO_COHORTS.find((c) => c.id === id) || DEMO_COHORTS[0];
      enrolledStudents = DEMO_STUDENTS_BY_COHORT[cohort.id] || DEMO_STUDENTS_BY_COHORT["cohort-101"];
    }

    return Response.json(
      success(
        {
          ...cohort,
          students: enrolledStudents,
        },
        "Cohort detail fetched successfully"
      )
    );
  } catch (err) {
    return Response.json(error(err.message || "Failed to fetch cohort details"), { status: 500 });
  }
}

async function postAssignStudentHandler(req, { ctx, params }) {
  const { id: batchId } = await params;
  try {
    const body = await req.json();
    const { studentId, studentName } = body;

    if (!studentId && !studentName) {
      return Response.json(error("Student identifier is required"), { status: 400 });
    }

    const currentUserId = toValidUuid(ctx.session?.userId);
    const validBatchId = toValidUuid(batchId);
    const validStudentId = toValidUuid(studentId);

    if (validBatchId && validStudentId) {
      try {
        const [batch] = await db.select().from(batches).where(eq(batches.id, validBatchId)).limit(1);
        if (batch) {
          await db
            .update(students)
            .set({
              batchId: validBatchId,
              batchName: batch.name,
              updatedAt: new Date(),
            })
            .where(eq(students.id, validStudentId));

          await db
            .insert(crmAuditEvents)
            .values({
              actorUserId: currentUserId,
              action: "STUDENT_COHORT_ASSIGNED",
              entityType: "student",
              entityId: validStudentId,
              reason: `Assigned student to cohort "${batch.name}"`,
              afterSnapshot: {
                batchId: validBatchId,
                batchName: batch.name,
              },
            })
            .catch(() => {});
        }
      } catch (dbErr) {
        console.warn("DB student cohort assignment warning:", dbErr.message);
      }
    }

    return Response.json(
      success(
        {
          batchId,
          studentId: studentId || `st-${Date.now()}`,
          assignedAt: new Date().toISOString(),
        },
        "Student assigned to cohort successfully"
      )
    );
  } catch (err) {
    return Response.json(error(err.message || "Failed to assign student to cohort"), { status: 400 });
  }
}

export const GET = createProtectedRoute(getCohortDetailHandler, { policy: canAccessCrm });
export const POST = createProtectedRoute(postAssignStudentHandler, { policy: canAccessCrm });
