"use server";

import { db, followUps, users } from "@repo/db";
import { eq, desc } from "drizzle-orm";

export async function getCalls() {
  try {
    return await db
      .select({
        id: followUps.id,
        leadPhone: followUps.leadPhone,
        telecallerId: followUps.telecallerId,
        telecallerName: users.name,
        duration: followUps.duration,
        recordingUrl: followUps.recordingUrl,
        outcome: followUps.outcome,
        type: followUps.type,
        contactedAt: followUps.contactedAt,
        createdAt: followUps.createdAt,
      })
      .from(followUps)
      .innerJoin(users, eq(followUps.telecallerId, users.id))
      .orderBy(desc(followUps.contactedAt));
  } catch (error) {
    console.error("Error fetching calls:", error);
    return [];
  }
}
