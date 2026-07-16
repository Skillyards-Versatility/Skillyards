import { db, followUps, users } from "@repo/db";
import { createProtectedRoute } from "@/lib/middleware";
import { uploadAudioToR2 } from "@/integrations/r2/r2.client";
import { eq } from "drizzle-orm";

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

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const telecallerId = formData.get("telecallerId");
    const phone = formData.get("phone");
    const durationInput = formData.get("duration");
    const outcome = formData.get("outcome") || "reached";
    const contactedAtInput = formData.get("contactedAt");
    const isTrainingInput = formData.get("isTraining");

    if (!file || !telecallerId || !phone) {
      return Response.json(
        { success: false, message: "Missing required fields (file, telecallerId, phone)" },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    const duration = parseInt(durationInput || "60", 10);
    const contactedAt = contactedAtInput ? new Date(contactedAtInput) : new Date();

    // 1. Fetch user to verify they exist and get their default training status
    const [user] = await db
      .select({ id: users.id, name: users.name, isTraining: users.isTraining })
      .from(users)
      .where(eq(users.id, telecallerId))
      .limit(1);

    if (!user) {
      return Response.json(
        { success: false, message: "Telecaller not found in database" },
        { status: 404 }
      );
    }

    // Determine if this recording should be categorized as training
    const isTraining = isTrainingInput === "true" || (isTrainingInput === null && user.isTraining);

    // 2. Upload audio to R2
    const fileArrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileArrayBuffer);
    const ext = file.name.split(".").pop().toLowerCase() || "mp3";
    
    // Trainee path vs normal path
    const keyPrefix = isTraining ? "trainings" : "recordings";
    const recordingKey = `${keyPrefix}/${telecallerId}/${cleanPhone}_${Date.now()}.${ext}`;

    let contentType = "audio/mpeg";
    if (ext === "m4a") contentType = "audio/x-m4a";
    else if (ext === "wav") contentType = "audio/wav";
    else if (ext === "ogg") contentType = "audio/ogg";
    else if (ext === "aac") contentType = "audio/aac";

    await uploadAudioToR2({ key: recordingKey, buffer, contentType });
    ctx.log("CUSTOM_RECORDING_UPLOADED", { recordingKey, isTraining });

    // 3. Create follow-up call log record
    const [inserted] = await db
      .insert(followUps)
      .values({
        leadPhone: cleanPhone,
        telecallerId: telecallerId,
        duration: duration,
        recordingUrl: recordingKey,
        outcome: outcome,
        type: "call",
        contactedAt: contactedAt,
        isTraining: isTraining,
        aiStatus: "pending",
      })
      .returning();

    ctx.log("CUSTOM_RECORDING_LOGGED", { followUpId: inserted.id, recordingKey });

    // 4. Trigger AI Audit service
    if (outcome === "reached") {
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

    return Response.json({
      success: true,
      message: "Recording uploaded and analysis triggered successfully",
      call: {
        id: inserted.id,
        leadPhone: inserted.leadPhone,
        telecallerId: inserted.telecallerId,
        telecallerName: user.name,
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
    });

  } catch (error) {
    ctx.error("CUSTOM_RECORDING_UPLOAD_FAILED", { error: error.message });
    return Response.json(
      { success: false, message: "Upload failed: " + error.message },
      { status: 500 }
    );
  }
}

export const POST = createProtectedRoute(postHandler, {
  isPublic: true,
  policy: () => ({ authorized: true }),
});
