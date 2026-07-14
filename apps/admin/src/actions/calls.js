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
        aiStatus: followUps.aiStatus,
        transcription: followUps.transcription,
        analysis: followUps.analysis,
      })
      .from(followUps)
      .innerJoin(users, eq(followUps.telecallerId, users.id))
      .orderBy(desc(followUps.contactedAt));
  } catch (error) {
    console.error("Error fetching calls:", error);
    return [];
  }
}

export async function refreshCall(callId) {
  try {
    const results = await db
      .select({
        id: followUps.id,
        aiStatus: followUps.aiStatus,
        transcription: followUps.transcription,
        analysis: followUps.analysis,
      })
      .from(followUps)
      .where(eq(followUps.id, callId))
      .limit(1);
    return results[0] || null;
  } catch (error) {
    console.error("Error refreshing call:", error);
    return null;
  }
}
