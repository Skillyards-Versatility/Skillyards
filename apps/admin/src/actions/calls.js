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

import crypto from "crypto";

function hmac(key, string) {
  return crypto.createHmac("sha256", key).update(string).digest();
}

function hmacHex(key, string) {
  return crypto.createHmac("sha256", key).update(string).digest("hex");
}

function sha256Hex(string) {
  return crypto.createHash("sha256").update(string).digest("hex");
}

function getPresignedPutUrl({ bucket, key, accessKeyId, secretAccessKey, endpoint, expiresIn = 3600 }) {
  const baseUrl = endpoint.replace(/\/$/, "");
  const url = new URL(baseUrl);
  const host = url.host;
  
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]/g, "").split(".")[0] + "Z";
  const dateStamp = amzDate.substring(0, 8);
  
  const region = "auto";
  const service = "s3";
  
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  
  const queryParams = {
    "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
    "X-Amz-Credential": `${accessKeyId}/${credentialScope}`,
    "X-Amz-Date": amzDate,
    "X-Amz-Expires": expiresIn.toString(),
    "X-Amz-SignedHeaders": "host"
  };
  
  const sortedQueryString = Object.keys(queryParams)
    .sort()
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(queryParams[k])}`)
    .join("&");
    
  const path = `/${bucket}/${key}`;
  
  const canonicalHeaders = `host:${host}\n`;
  const canonicalRequest = [
    "PUT",
    path,
    sortedQueryString,
    canonicalHeaders,
    "host",
    "UNSIGNED-PAYLOAD"
  ].join("\n");
  
  const hashedCanonicalRequest = sha256Hex(canonicalRequest);
  
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    hashedCanonicalRequest
  ].join("\n");
  
  const kDate = hmac("AWS4" + secretAccessKey, dateStamp);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, service);
  const kSigning = hmac(kService, "aws4_request");
  
  const signature = hmacHex(kSigning, stringToSign);
  
  return `${baseUrl}${path}?${sortedQueryString}&X-Amz-Signature=${signature}`;
}

export async function getUploadPresignedUrlAction(telecallerId, phone, ext, isTrainingInput) {
  try {
    const session = await getSession();
    if (!session || !["ADMIN", "MANAGER"].includes(session.role)) {
      return { success: false, error: "Unauthorized" };
    }

    const cleanPhone = phone.replace(/\D/g, "").slice(-10);

    // Fetch user to verify and get default training status
    const [user] = await db
      .select({ id: users.id, name: users.name, isTraining: users.isTraining })
      .from(users)
      .where(eq(users.id, telecallerId))
      .limit(1);

    if (!user) {
      return { success: false, error: "Telecaller not found in database" };
    }

    const isTraining = isTrainingInput === true || (isTrainingInput === null && user.isTraining);
    const keyPrefix = isTraining ? "trainings" : "recordings";
    const recordingKey = `${keyPrefix}/${telecallerId}/${cleanPhone}_${Date.now()}.${ext}`;

    const uploadUrl = getPresignedPutUrl({
      bucket: process.env.R2_BUCKET,
      key: recordingKey,
      accessKeyId: process.env.R2_ACCESS_KEY,
      secretAccessKey: process.env.R2_SECRET_KEY,
      endpoint: process.env.R2_ENDPOINT,
      expiresIn: 3600
    });

    return { success: true, uploadUrl, recordingKey, isTraining, userName: user.name };
  } catch (error) {
    console.error("getUploadPresignedUrlAction error:", error);
    return { success: false, error: error.message };
  }
}

export async function finalizeCallUploadAction(payload) {
  try {
    const session = await getSession();
    if (!session || !["ADMIN", "MANAGER"].includes(session.role)) {
      return { success: false, error: "Unauthorized" };
    }

    const { telecallerId, userName, phone, duration, outcome, contactedAt, isTraining, recordingKey } = payload;
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);

    // Create follow-up call log record
    const [inserted] = await db
      .insert(followUps)
      .values({
        leadPhone: cleanPhone,
        telecallerId: telecallerId,
        duration: duration,
        recordingUrl: recordingKey,
        outcome: outcome || "reached",
        type: "call",
        contactedAt: new Date(contactedAt),
        isTraining: isTraining,
        aiStatus: "pending",
      })
      .returning();

    // Trigger AI Audit service
    if (inserted.outcome === "reached") {
      const aiServiceUrl = process.env.AI_SERVICE_URL || "http://localhost:3005";
      fetch(`${aiServiceUrl}/api/audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          followUpId: inserted.id,
          recordingUrl: recordingKey,
        }),
      }).catch((err) =>
        console.error("AI service trigger failed for custom recording:", err)
      );
    }

    revalidatePath("/calls");
    
    return { 
      success: true, 
      call: {
        id: inserted.id,
        leadPhone: inserted.leadPhone,
        telecallerId: inserted.telecallerId,
        telecallerName: userName,
        duration: inserted.duration,
        recordingUrl: inserted.recordingUrl,
        outcome: inserted.outcome,
        type: inserted.type,
        contactedAt: inserted.contactedAt.toISOString(),
        createdAt: inserted.createdAt.toISOString(),
        aiStatus: inserted.aiStatus,
        isTraining: inserted.isTraining,
        analysis: null
      }
    };
  } catch (error) {
    console.error("finalizeCallUploadAction error:", error);
    return { success: false, error: error.message };
  }
}
