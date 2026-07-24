import { eq, desc, sql } from "drizzle-orm";
import { batches, students } from "@repo/db";

export async function getBatchesWithCount(db, courseName = null) {
  let query = db
    .select({
      id: batches.id,
      name: batches.name,
      courseName: batches.courseName,
      description: batches.description,
      startDate: batches.startDate,
      status: batches.status,
      createdAt: batches.createdAt,
      studentCount: sql`COUNT(${students.id})::int`,
    })
    .from(batches)
    .leftJoin(students, eq(students.batchId, batches.id));

  if (courseName) {
    query = query.where(eq(batches.courseName, courseName));
  }

  return query
    .groupBy(batches.id)
    .orderBy(desc(batches.createdAt));
}

export async function createBatchRecord(db, data) {
  const inserted = await db
    .insert(batches)
    .values({
      name: data.name,
      courseName: data.courseName,
      description: data.description || null,
      startDate: data.startDate ? new Date(data.startDate) : null,
      status: data.status || "active",
    })
    .returning();

  return inserted[0];
}

export async function getBatchById(db, batchId) {
  const res = await db.select().from(batches).where(eq(batches.id, batchId)).limit(1);
  return res[0] || null;
}
