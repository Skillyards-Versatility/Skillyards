import { db, followUps, users } from "@repo/db";
import { createProtectedRoute } from "@/lib/middleware";
import { uploadAudioToR2 } from "@/integrations/r2/r2.client";
import { and, eq, gte, lte } from "drizzle-orm";

async function postHandler(req, { ctx }) {
  const secret = req.headers.get("x-app-secret");
  const expectedSecret = process.env.CALL_TRACKER_SECRET || "skillyards_call_tracker_secret_default";

  if (!secret || secret !== expectedSecret) {
    ctx.warn("CALL_TRACKER_AUTH_FAILURE", { secretProvided: !!secret });
    return Response.json(
      { success: false, message: "Forbidden" },
      { status: 403 }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch (err) {
    return Response.json(
      { success: false, message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const {
    telecaller_id,
    to_number,
    call_duration_seconds,
    recording_base64,
    recording_ext,
    call_start_time,
    recording_key,
  } = body;

  console.log("☎️ Received gsm-callback payload:", {
    telecaller_id,
    to_number,
    call_duration_seconds,
    has_base64: !!recording_base64,
    base64_length: recording_base64 ? recording_base64.length : 0,
    recording_ext,
    call_start_time,
    recording_key
  });

  if (!telecaller_id || !to_number || call_duration_seconds === undefined || !call_start_time) {
    return Response.json(
      { success: false, message: "Missing required fields" },
      { status: 400 }
    );
  }

  // 0. Map old employee UUIDs to new user UUIDs if applicable
  const EMPLOYEE_TO_USER_MAP = {
    "f2b05e4f-e983-4c35-abb3-600f5a730a45": "0f164502-26f3-4d9a-adcc-703adfb1af33", // Rahul Singh
    "a22ac5ef-452b-46ed-9b77-43529200c08c": "c6a0af52-b579-4d64-9b72-7d64e5044840", // Suryansh Upadhyay
    "13c29d1d-f765-4483-9bcc-3aeeb14942f7": "70c7f340-888b-4380-a9b4-30123f1f8a33", // Karan Singh Tomar
    "988f616e-bea5-4c98-a8c1-b160a7aca469": "4d3e6da0-4f82-49db-9781-2273e52572ae", // Saurabh Verma
  };

  let activeTelecallerId = telecaller_id;
  if (EMPLOYEE_TO_USER_MAP[telecaller_id]) {
    activeTelecallerId = EMPLOYEE_TO_USER_MAP[telecaller_id];
    console.log(`[Mapping] Transformed old employee UUID ${telecaller_id} to new user UUID ${activeTelecallerId}`);
  }

  // Verify that the telecaller exists in the users table to avoid foreign key violations
  try {
    const userExists = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, activeTelecallerId))
      .limit(1);

    if (userExists.length === 0) {
      ctx.warn("CALL_TRACKER_INVALID_TELECALLER", { telecaller_id: activeTelecallerId });
      // Return 200 OK so the mobile client removes this call from its offline Room database queue
      return Response.json(
        { success: true, message: "Call skipped (invalid or deactivated telecaller)" }
      );
    }
  } catch (userCheckError) {
    ctx.error("TELECALLER_CHECK_FAILED", { error: userCheckError.message });
  }

  // 1. Normalize number
  const cleanPhone = to_number.replace(/\D/g, "").slice(-10);

  // 1b. Deduplication Check: Skip inserting if this call was already logged within 10 seconds
  const contactedTime = new Date(call_start_time);
  const timeThresholdMs = 10 * 1000;
  const startTimeMin = new Date(contactedTime.getTime() - timeThresholdMs);
  const startTimeMax = new Date(contactedTime.getTime() + timeThresholdMs);

  try {
    const existing = await db
      .select({ id: followUps.id })
      .from(followUps)
      .where(
        and(
          eq(followUps.telecallerId, activeTelecallerId),
          eq(followUps.leadPhone, cleanPhone),
          gte(followUps.contactedAt, startTimeMin),
          lte(followUps.contactedAt, startTimeMax)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      ctx.log("CALL_RECORDING_LOGGED_DUPLICATE_SKIPPED", { telecaller_id: activeTelecallerId, cleanPhone, call_start_time });
      return Response.json({ success: true, message: "Call already logged (duplicate skipped)" });
    }
  } catch (dedupError) {
    ctx.error("DEDUPLICATION_CHECK_FAILED", { error: dedupError.message });
  }

  // 2. Process Audio if exists
  let recordingUrl = null;
  if (recording_key) {
    recordingUrl = recording_key;
  } else if (recording_base64) {
    try {
      const buffer = Buffer.from(recording_base64, "base64");
      const ext = recording_ext || "mp3";
      const key = `recordings/${activeTelecallerId}/${cleanPhone}_${Date.now()}.${ext}`;
      
      let contentType = "audio/mpeg";
      if (ext === "m4a") contentType = "audio/x-m4a";
      else if (ext === "wav") contentType = "audio/wav";

      // Upload to R2
      await uploadAudioToR2({ key, buffer, contentType });
      
      // Store the key in the database
      recordingUrl = key;
    } catch (uploadError) {
      ctx.error("AUDIO_UPLOAD_FAILED", { error: uploadError.message });
      // Continue executing to log metadata even if audio upload fails
    }
  }

  // 3. Update Database
  const outcome = call_duration_seconds > 15 ? "reached" : "not_reached";

  try {
    const [inserted] = await db
      .insert(followUps)
      .values({
        leadPhone: cleanPhone,
        telecallerId: activeTelecallerId,
        duration: call_duration_seconds,
        recordingUrl: recordingUrl,
        outcome: outcome,
        type: "call",
        contactedAt: new Date(call_start_time),
      })
      .returning();

    ctx.log("CALL_RECORDING_LOGGED", { followUpId: inserted.id, telecaller_id: activeTelecallerId, cleanPhone });

    // Auto auditing disabled by administrator. Audits are now triggered manually via the UI.
    if (false && recordingUrl && outcome === "reached") {
      (async () => {
        try {
          const aiServiceUrl = process.env.AI_SERVICE_URL || "http://localhost:3005";
          
          fetch(`${aiServiceUrl}/api/audit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              followUpId: inserted.id,
              recordingUrl: recordingUrl,
            }),
          }).catch((err) =>
            console.error("AI service dispatcher connection failed:", err)
          );
        } catch (dispatchErr) {
          console.error("AI service trigger dispatch failed:", dispatchErr);
        }
      })();
    }

    return Response.json({ success: true, message: "Call Logged" });
  } catch (dbError) {
    ctx.error("DB_LOGGING_FAILED", { error: dbError.message });
    return Response.json(
      { success: false, message: "Database logging failed" },
      { status: 500 }
    );
  }
}

export const POST = createProtectedRoute(postHandler, {
  isPublic: true,
  policy: () => ({ authorized: true }),
});
