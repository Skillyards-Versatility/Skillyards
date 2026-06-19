import { db } from "@repo/db";
import { followUps } from "@repo/db";
import { createProtectedRoute } from "@/lib/middleware";
import { uploadAudioToR2 } from "@/integrations/r2/r2.client";

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
  } = body;

  if (!telecaller_id || !to_number || call_duration_seconds === undefined || !call_start_time) {
    return Response.json(
      { success: false, message: "Missing required fields" },
      { status: 400 }
    );
  }

  // 1. Normalize number
  const cleanPhone = to_number.replace(/\D/g, "").slice(-10);

  // 2. Process Audio if exists
  let recordingUrl = null;
  if (recording_base64) {
    try {
      const buffer = Buffer.from(recording_base64, "base64");
      const ext = recording_ext || "mp3";
      const key = `recordings/${telecaller_id}/${cleanPhone}_${Date.now()}.${ext}`;
      
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
        telecallerId: telecaller_id,
        duration: call_duration_seconds,
        recordingUrl: recordingUrl,
        outcome: outcome,
        type: "call",
        contactedAt: new Date(call_start_time),
      })
      .returning();

    ctx.log("CALL_RECORDING_LOGGED", { followUpId: inserted.id, telecaller_id, cleanPhone });
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
