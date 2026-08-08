import { eq, and, gte, lte, desc, sql } from "drizzle-orm";
import { students, payments } from "@repo/db";

// Helper to calculate calendar month boundaries or custom ranges
function getMonthRange(type, customStart, customEnd) {
  const now = new Date();
  if (type === "current") {
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    return { startDate, endDate };
  } else if (type === "past") {
    const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    return { startDate, endDate };
  } else if (type === "custom" && customStart) {
    const startDate = new Date(customStart);
    startDate.setHours(0, 0, 0, 0);
    const endDate = customEnd ? new Date(customEnd) : new Date();
    endDate.setHours(23, 59, 59, 999);
    return { startDate, endDate };
  }
  return null;
}

export async function getStudentById(db, studentId) {
  const result = await db
    .select()
    .from(students)
    .where(eq(students.id, studentId))
    .limit(1);

  return result[0] || null;
}

export async function getStudentsWithPayments(db, limit = 100, offset = 0, filters = {}) {
  let query = db
    .select({
      id: students.id,
      name: students.name,
      email: students.email,
      phone: students.phone,
      courseName: students.courseName,
      batchId: students.batchId,
      batchName: students.batchName,
      totalFee: students.totalFee,
      finalFee: students.finalFee,
      createdAt: students.createdAt,
      laptopOpted: students.laptopOpted,
      totalPaid: sql`COALESCE(SUM(${payments.amount}), 0)`,
    })
    .from(students)
    .leftJoin(payments, sql`${payments.studentId} = ${students.id}`);

  const conditions = [];

  if (filters.courseName) {
    conditions.push(eq(students.courseName, filters.courseName));
  }

  if (filters.batchId) {
    if (filters.batchId === "unassigned") {
      conditions.push(sql`${students.batchId} IS NULL`);
    } else {
      conditions.push(eq(students.batchId, filters.batchId));
    }
  }

  if (filters.enrolledIn) {
    const range = getMonthRange(filters.enrolledIn, filters.startDate, filters.endDate);
    if (range) {
      conditions.push(gte(students.createdAt, range.startDate));
      conditions.push(lte(students.createdAt, range.endDate));
    }
  }

  if (filters.laptopOpted !== undefined && filters.laptopOpted !== null) {
    conditions.push(eq(students.laptopOpted, Boolean(filters.laptopOpted)));
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  return query
    .groupBy(students.id)
    .orderBy(desc(students.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function updateStudentBatch(db, studentId, batchId, batchName) {
  const updated = await db
    .update(students)
    .set({
      batchId: batchId || null,
      batchName: batchName || null,
      updatedAt: new Date(),
    })
    .where(eq(students.id, studentId))
    .returning();

  return updated[0] || null;
}

export async function getStudentStats(db) {
  const result = await db
    .select({
      totalCount: sql`COUNT(DISTINCT ${students.id})`,
      totalCollected: sql`COALESCE(SUM(${payments.amount}), 0)`,
    })
    .from(students)
    .leftJoin(payments, sql`${payments.studentId} = ${students.id}`);

  const pendingResult = await db
    .select({
      totalFinalFee: sql`SUM(${students.finalFee})`,
    })
    .from(students);

  const totalCollected = Number(result[0]?.totalCollected || 0);
  const totalCount = Number(result[0]?.totalCount || 0);
  const totalFinalFee = Number(pendingResult[0]?.totalFinalFee || 0);

  return {
    totalStudents: totalCount,
    totalCollected,
    totalPending: Math.max(0, totalFinalFee - totalCollected),
  };
}