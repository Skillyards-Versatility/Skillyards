"use server";

import { db, followUps, users, callAnalyses } from "@repo/db";
import { eq, desc, sql } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { API } from "@/lib/api";

let migrated = false;

export async function getCalls() {
  try {
    if (!migrated) {
      try {
        await db.execute(
          sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_training BOOLEAN DEFAULT FALSE NOT NULL;`
        );
        await db.execute(
          sql`ALTER TABLE follow_ups ADD COLUMN IF NOT EXISTS is_training BOOLEAN DEFAULT FALSE NOT NULL;`
        );
        migrated = true;
        console.log("Programmatic database migrations applied successfully.");
      } catch (migError) {
        console.error("Migration runner failed:", migError);
      }
    }

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
        isTraining: followUps.isTraining,
        analysis: callAnalyses,
      })
      .from(followUps)
      .innerJoin(users, eq(followUps.telecallerId, users.id))
      .leftJoin(callAnalyses, eq(followUps.id, callAnalyses.followUpId))
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
        analysis: callAnalyses,
      })
      .from(followUps)
      .leftJoin(callAnalyses, eq(followUps.id, callAnalyses.followUpId))
      .where(eq(followUps.id, callId))
      .limit(1);
    return results[0] || null;
  } catch (error) {
    console.error("Error refreshing call:", error);
    return null;
  }
}

export async function uploadRecordingAction(formData) {
  try {
    const session = await getSession();
    if (!session || !["ADMIN", "MANAGER"].includes(session.role)) {
      return { success: false, error: "Unauthorized" };
    }

    const response = await fetch(`${API}/api/telephony/upload`, {
      method: "POST",
      headers: {
        "x-app-secret": process.env.CALL_TRACKER_SECRET || "skillyards_call_tracker_secret_default",
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      return { success: false, error: data.message || "Failed to upload recording" };
    }

    revalidatePath("/calls");
    return { success: true, call: data.call };
  } catch (error) {
    console.error("uploadRecordingAction error:", error);
    return { success: false, error: error.message };
  }
}
