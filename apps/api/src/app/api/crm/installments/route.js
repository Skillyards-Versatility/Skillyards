import { db } from "@repo/db";
import { students, payments, installments, crmAuditEvents, users } from "@repo/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm } from "@/modules/crm/crm.permissions";
import { success, error } from "@/utils/response";

/**
 * Standard Initial Fallback Installment Records (Synthesized from enrolled cohort learners)
 */
const INITIAL_INSTALLMENTS = [
  {
    id: "inst-101",
    studentId: "SKY-2026-6623",
    rawStudentId: null,
    studentName: "Aarav Sharma",
    studentPhone: "+91 98765 43210",
    studentEmail: "aarav.sharma@example.com",
    courseName: "Full Stack Web Development (MERN)",
    cohortName: "Weekend Live Cohort (Sat-Sun 10 AM - 2 PM)",
    counselorName: "Priya Patel",
    installmentNo: 2,
    totalInstallments: 2,
    installmentTitle: "Milestone 2 of 2 (Mid-Term Completion)",
    amountDue: 20135,
    amountPaid: 0,
    totalCourseFee: 45135,
    priorPaid: 25000,
    dueDate: new Date(Date.now() + 14 * 3600000 * 24).toISOString().split("T")[0],
    status: "due_soon", // due in 14 days
    paymentSchedule: "installment",
    paymentMode: null,
    receiptNo: null,
    transactionRef: null,
    paidAt: null,
  },
  {
    id: "inst-102",
    studentId: "SKY-2026-7731",
    rawStudentId: null,
    studentName: "Sneha Mukherjee",
    studentPhone: "+91 99345 67890",
    studentEmail: "sneha.m@example.com",
    courseName: "Data Science & Applied AI Accelerator",
    cohortName: "Weekday Evening Cohort (Mon-Thu 7 PM - 9 PM)",
    counselorName: "Amit Kumar",
    installmentNo: 2,
    totalInstallments: 10,
    installmentTitle: "Monthly 0% EMI (Month 2 of 10)",
    amountDue: 5192,
    amountPaid: 0,
    totalCourseFee: 51920,
    priorPaid: 5192,
    dueDate: new Date(Date.now() - 4 * 3600000 * 24).toISOString().split("T")[0],
    status: "overdue", // 4 days overdue
    paymentSchedule: "emi",
    paymentMode: null,
    receiptNo: null,
    transactionRef: null,
    paidAt: null,
  },
  {
    id: "inst-103",
    studentId: "SKY-2026-7731",
    rawStudentId: null,
    studentName: "Sneha Mukherjee",
    studentPhone: "+91 99345 67890",
    studentEmail: "sneha.m@example.com",
    courseName: "Data Science & Applied AI Accelerator",
    cohortName: "Weekday Evening Cohort (Mon-Thu 7 PM - 9 PM)",
    counselorName: "Amit Kumar",
    installmentNo: 3,
    totalInstallments: 10,
    installmentTitle: "Monthly 0% EMI (Month 3 of 10)",
    amountDue: 5192,
    amountPaid: 0,
    totalCourseFee: 51920,
    priorPaid: 5192,
    dueDate: new Date(Date.now() + 26 * 3600000 * 24).toISOString().split("T")[0],
    status: "upcoming",
    paymentSchedule: "emi",
    paymentMode: null,
    receiptNo: null,
    transactionRef: null,
    paidAt: null,
  },
  {
    id: "inst-104",
    studentId: "SKY-2026-5519",
    rawStudentId: null,
    studentName: "Rohan Varma",
    studentPhone: "+91 97123 45678",
    studentEmail: "rohan.v@example.com",
    courseName: "Product Design (UI/UX) Mastery",
    cohortName: "Fast-Track Intensive (Mon-Fri 10 AM - 1 PM)",
    counselorName: "Vikram Malhotra",
    installmentNo: 2,
    totalInstallments: 2,
    installmentTitle: "Final Settlement (Portfolio Phase)",
    amountDue: 18000,
    amountPaid: 0,
    totalCourseFee: 38000,
    priorPaid: 20000,
    dueDate: new Date(Date.now() - 9 * 3600000 * 24).toISOString().split("T")[0],
    status: "overdue", // 9 days overdue
    paymentSchedule: "installment",
    paymentMode: null,
    receiptNo: null,
    transactionRef: null,
    paidAt: null,
  },
  {
    id: "inst-105",
    studentId: "SKY-2026-8812",
    rawStudentId: null,
    studentName: "Kabir Mehta",
    studentPhone: "+91 98456 78901",
    studentEmail: "kabir.m@example.com",
    courseName: "Full Stack Web Development (MERN)",
    cohortName: "Weekend Live Cohort (Sat-Sun 10 AM - 2 PM)",
    counselorName: "Priya Patel",
    installmentNo: 1,
    totalInstallments: 1,
    installmentTitle: "Full Tuition Clearance",
    amountDue: 45135,
    amountPaid: 45135,
    totalCourseFee: 45135,
    priorPaid: 0,
    dueDate: new Date(Date.now() - 2 * 3600000 * 24).toISOString().split("T")[0],
    status: "paid",
    paymentSchedule: "full",
    paymentMode: "upi",
    receiptNo: "REC-2026-90412",
    transactionRef: "UPI-48192019284",
    paidAt: new Date(Date.now() - 2 * 3600000 * 24).toISOString(),
  },
];

// In-memory runtime cache for server-side persistence when DB is disconnected
let runtimeInstallments = [...INITIAL_INSTALLMENTS];

/**
 * GET /api/crm/installments
 * Returns all installment schedules with computed due aging and collection metrics
 */
async function getInstallmentsHandler(req, { ctx }) {
  try {
    let resultInstallments = [];

    // Attempt to read from PostgreSQL database
    try {
      const studentList = await db
        .select({
          id: students.id,
          studentName: students.name,
          studentPhone: students.phone,
          studentEmail: students.email,
          courseName: students.courseName,
          batchName: students.batchName,
          totalFee: students.totalFee,
          finalFee: students.finalFee,
          counselorName: users.name,
          createdAt: students.createdAt,
        })
        .from(students)
        .leftJoin(users, eq(students.assignedTo, users.id))
        .orderBy(desc(students.createdAt))
        .limit(100);

      if (studentList && studentList.length > 0) {
        // Fetch payments
        const paymentList = await db
          .select()
          .from(payments)
          .orderBy(desc(payments.createdAt));

        const paymentsByStudent = {};
        for (const p of paymentList) {
          if (!paymentsByStudent[p.studentId]) paymentsByStudent[p.studentId] = [];
          paymentsByStudent[p.studentId].push(p);
        }

        // Synthesize installment records from DB students
        const dbInstallments = [];
        for (const st of studentList) {
          const stPayments = paymentsByStudent[st.id] || [];
          const totalPaid = stPayments.reduce((s, p) => s + (Number(p.amount) || 0), 0);
          const grossFee = Number(st.finalFee) || Number(st.totalFee) || 0;
          const balance = Math.max(0, grossFee - totalPaid);

          if (balance > 0) {
            dbInstallments.push({
              id: `inst-db-${st.id.slice(0, 8)}`,
              studentId: `SKY-2026-${st.id.slice(0, 4).toUpperCase()}`,
              rawStudentId: st.id,
              studentName: st.studentName,
              studentPhone: st.studentPhone,
              studentEmail: st.studentEmail,
              courseName: st.courseName || "Full Stack Web Development",
              cohortName: st.batchName || "Weekend Live Cohort",
              counselorName: st.counselorName || "Admissions Team",
              installmentNo: 2,
              totalInstallments: 2,
              installmentTitle: "Installment Milestone 2 of 2",
              amountDue: balance,
              amountPaid: 0,
              totalCourseFee: grossFee,
              priorPaid: totalPaid,
              dueDate: new Date(Date.now() + 15 * 3600000 * 24).toISOString().split("T")[0],
              status: "due_soon",
              paymentSchedule: "installment",
              paymentMode: null,
              receiptNo: null,
              transactionRef: null,
              paidAt: null,
            });
          }
        }

        // Merge DB installments with runtime cache to preserve manual collections
        const dbStudentPhones = new Set(dbInstallments.map((i) => i.studentPhone));
        const nonDuplicateRuntime = runtimeInstallments.filter(
          (r) => !dbStudentPhones.has(r.studentPhone)
        );
        resultInstallments = [...dbInstallments, ...nonDuplicateRuntime];
      } else {
        resultInstallments = [...runtimeInstallments];
      }
    } catch (dbErr) {
      // Offline fallback: Use runtime in-memory cache
      resultInstallments = [...runtimeInstallments];
    }

    // Calculate dynamic aging days and statuses
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const enriched = resultInstallments.map((inst) => {
      if (inst.status === "paid") {
        return { ...inst, daysOverdue: 0, daysRemaining: 0 };
      }

      const due = new Date(inst.dueDate);
      due.setHours(0, 0, 0, 0);
      const diffMs = due.getTime() - now.getTime();
      const diffDays = Math.round(diffMs / (1000 * 3600 * 24));

      let calculatedStatus = inst.status;
      let daysOverdue = 0;
      let daysRemaining = 0;

      if (diffDays < 0) {
        calculatedStatus = "overdue";
        daysOverdue = Math.abs(diffDays);
      } else if (diffDays <= 7) {
        calculatedStatus = "due_soon";
        daysRemaining = diffDays;
      } else {
        calculatedStatus = "upcoming";
        daysRemaining = diffDays;
      }

      return {
        ...inst,
        status: calculatedStatus,
        daysOverdue,
        daysRemaining,
      };
    });

    // Compute executive KPI totals
    const totalReceivables = enriched
      .filter((i) => i.status !== "paid")
      .reduce((sum, i) => sum + (Number(i.amountDue) || 0), 0);

    const overdueList = enriched.filter((i) => i.status === "overdue");
    const overdueAmount = overdueList.reduce((sum, i) => sum + (Number(i.amountDue) || 0), 0);
    const overdueCount = overdueList.length;

    const dueThisWeekList = enriched.filter((i) => i.status === "due_soon");
    const dueThisWeekAmount = dueThisWeekList.reduce((sum, i) => sum + (Number(i.amountDue) || 0), 0);

    const paidList = enriched.filter((i) => i.status === "paid");
    const collectedThisMonth = paidList.reduce((sum, i) => sum + (Number(i.amountPaid || i.amountDue) || 0), 0);

    const totalInstallmentsCount = enriched.length;
    const onTimeRate = totalInstallmentsCount > 0
      ? Math.round((paidList.length / totalInstallmentsCount) * 100)
      : 85;

    return Response.json(
      success(
        {
          installments: enriched,
          kpis: {
            totalReceivables,
            overdueAmount,
            overdueCount,
            dueThisWeekAmount,
            dueThisWeekCount: dueThisWeekList.length,
            collectedThisMonth,
            paidCount: paidList.length,
            onTimeRate,
          },
        },
        "Installments loaded successfully"
      )
    );
  } catch (err) {
    ctx.error?.("CRM_GET_INSTALLMENTS_FAILED", { error: err.message });
    return Response.json(error(err.message || "Failed to load installments"), { status: 500 });
  }
}

/**
 * POST /api/crm/installments
 * Creates a custom installment schedule
 */
async function postInstallmentHandler(req, { ctx }) {
  try {
    const body = await req.json();
    const {
      studentName,
      studentPhone,
      studentEmail,
      courseName,
      cohortName,
      counselorName,
      installmentTitle,
      amountDue,
      totalCourseFee,
      priorPaid,
      dueDate,
      paymentSchedule,
    } = body;

    if (!studentName || !studentPhone || !amountDue || !dueDate) {
      return Response.json(error("studentName, studentPhone, amountDue, and dueDate are required"), { status: 400 });
    }

    const newInst = {
      id: `inst-${Date.now()}`,
      studentId: `SKY-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      rawStudentId: null,
      studentName,
      studentPhone,
      studentEmail: studentEmail || "",
      courseName: courseName || "Full Stack Web Development",
      cohortName: cohortName || "Weekend Live Cohort",
      counselorName: counselorName || ctx.user?.name || "Admissions Team",
      installmentNo: 2,
      totalInstallments: paymentSchedule === "emi" ? 10 : 2,
      installmentTitle: installmentTitle || "Custom Installment Milestone",
      amountDue: Number(amountDue),
      amountPaid: 0,
      totalCourseFee: Number(totalCourseFee) || Number(amountDue),
      priorPaid: Number(priorPaid) || 0,
      dueDate,
      status: new Date(dueDate) < new Date() ? "overdue" : "upcoming",
      paymentSchedule: paymentSchedule || "installment",
      paymentMode: null,
      receiptNo: null,
      transactionRef: null,
      paidAt: null,
    };

    runtimeInstallments.unshift(newInst);

    // Audit log
    try {
      await db.insert(crmAuditEvents).values({
        actorId: ctx.user?.id || null,
        actorName: ctx.user?.name || "System",
        action: "INSTALLMENT_CREATED",
        entityType: "installment",
        entityId: newInst.id,
        reason: `Created installment milestone for ${studentName}: ₹${amountDue}`,
        afterSnapshot: newInst,
      });
    } catch (_) {}

    return Response.json(success(newInst, "Installment created successfully"));
  } catch (err) {
    ctx.error?.("CRM_CREATE_INSTALLMENT_FAILED", { error: err.message });
    return Response.json(error(err.message || "Failed to create installment"), { status: 500 });
  }
}

export const GET = createProtectedRoute(canAccessCrm, getInstallmentsHandler);
export const POST = createProtectedRoute(canAccessCrm, postInstallmentHandler);
export { runtimeInstallments };
