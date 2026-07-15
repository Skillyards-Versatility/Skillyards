import { GoogleGenAI } from "@google/genai";
import { s3Client } from "./r2-client.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { db, followUps, callAnalyses } from "@repo/db";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";
import { SYSTEM_INSTRUCTION, RESPONSE_SCHEMA, GENERATION_CONFIG } from "./call-analyzer.config.js";

export async function auditCall(recordingKey, followUpId) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // 1. Fetch file from R2
  const bucketParams = { Bucket: process.env.R2_BUCKET, Key: recordingKey };
  const s3Response = await s3Client.send(new GetObjectCommand(bucketParams));
  const audioBuffer = Buffer.from(await s3Response.Body.transformToByteArray());

  const ext = recordingKey.split(".").pop().toLowerCase();
  let mimeType = "audio/mp3";
  if (ext === "wav") mimeType = "audio/wav";
  else if (ext === "m4a") mimeType = "audio/x-m4a";
  else if (ext === "ogg") mimeType = "audio/ogg";
  else if (ext === "aac") mimeType = "audio/aac";

  let tempFilePath = null;
  let fileRef = null;
  let contents = [];

  try {
    // If audio size is large (>= 10MB), upload using Gemini Files API
    const sizeInMb = audioBuffer.length / (1024 * 1024);
    console.log(`[Call Analyzer] Audio size: ${sizeInMb.toFixed(2)} MB, extension: ${ext}`);

    if (sizeInMb >= 10) {
      console.log(`[Call Analyzer] Using Files API for upload...`);
      const tempDir = path.resolve("./scratch");
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      tempFilePath = path.join(tempDir, `temp_audit_${Date.now()}.${ext}`);
      fs.writeFileSync(tempFilePath, audioBuffer);

      fileRef = await ai.files.upload({
        file: tempFilePath,
        mimeType,
      });

      console.log(`[Call Analyzer] Uploaded to Gemini Files API: ${fileRef.name}`);
      contents = [
        fileRef,
        { role: "user", text: "Perform the auditing process for this call recording." }
      ];
    } else {
      console.log(`[Call Analyzer] Using inline data upload...`);
      contents = [
        {
          inlineData: {
            data: audioBuffer.toString("base64"),
            mimeType,
          },
        },
        {
          role: "user",
          text: "Perform the auditing process for this call recording."
        }
      ];
    }

    // 2. Request analysis from Gemini 2.5 Flash
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        ...GENERATION_CONFIG,
      },
    });

    const finishReason = response.candidates?.[0]?.finishReason;
    console.log(`[Call Analyzer] Gemini finished with reason: ${finishReason}`);
    if (finishReason === "MAX_TOKENS") {
      console.warn("[Call Analyzer] Warning: Response was truncated due to output token limit.");
    }

    let auditData;
    try {
      auditData = JSON.parse(response.text);
    } catch (parseError) {
      console.error("[Call Analyzer] Error parsing Gemini JSON response. Raw text length:", response.text?.length);
      throw parseError;
    }

    // Save to follow_ups for backwards compatibility
    await db
      .update(followUps)
      .set({
        transcription: auditData.transcription,
        analysis: auditData,
      })
      .where(eq(followUps.id, followUpId));

    // Upsert into call_analyses
    await db
      .insert(callAnalyses)
      .values({
        followUpId,
        overallScore: auditData.scores.overall,
        leadGrade: auditData.leadProfile.leadGrade,
        hasComplianceRisk: auditData.complianceFlags.length > 0,
        callSummary: auditData.callSummary,
        language: auditData.language,
        leadProfile: auditData.leadProfile,
        callOutcome: auditData.callOutcome,
        scriptAdherence: auditData.scriptAdherence,
        objectionsRaised: auditData.objectionsRaised,
        complianceFlags: auditData.complianceFlags,
        toneAndDelivery: auditData.toneAndDelivery,
        scores: auditData.scores,
        coaching: auditData.coaching,
        recommendedNextAction: auditData.recommendedNextAction,
      })
      .onConflictDoUpdate({
        target: callAnalyses.followUpId,
        set: {
          overallScore: auditData.scores.overall,
          leadGrade: auditData.leadProfile.leadGrade,
          hasComplianceRisk: auditData.complianceFlags.length > 0,
          callSummary: auditData.callSummary,
          language: auditData.language,
          leadProfile: auditData.leadProfile,
          callOutcome: auditData.callOutcome,
          scriptAdherence: auditData.scriptAdherence,
          objectionsRaised: auditData.objectionsRaised,
          complianceFlags: auditData.complianceFlags,
          toneAndDelivery: auditData.toneAndDelivery,
          scores: auditData.scores,
          coaching: auditData.coaching,
          recommendedNextAction: auditData.recommendedNextAction,
        }
      });

    console.log(`[Call Analyzer] Successfully stored audit results for followUpId: ${followUpId}`);
    return auditData;

  } finally {
    // Cleanup temporary file
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
        console.log(`[Call Analyzer] Cleaned up temporary file: ${tempFilePath}`);
      } catch (err) {
        console.error(`[Call Analyzer] Failed to clean up temp file: ${tempFilePath}`, err);
      }
    }
    // Cleanup Gemini file
    if (fileRef) {
      try {
        await ai.files.delete({ name: fileRef.name });
        console.log(`[Call Analyzer] Deleted file from Gemini Files API: ${fileRef.name}`);
      } catch (err) {
        console.error(`[Call Analyzer] Failed to delete Gemini file: ${fileRef.name}`, err);
      }
    }
  }
}
