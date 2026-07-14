import "dotenv/config";

import express from "express";
import { auditCall } from "./call-analyzer.js";
import { db, followUps } from "@repo/db";
import { eq } from "drizzle-orm";

const app = express();
app.use(express.json());


const auditQueue = [];
let isProcessing = false;

async function processQueue() {
  if (isProcessing) return;
  if (auditQueue.length === 0) return;

  isProcessing = true;
  const task = auditQueue.shift();
  const { followUpId, recordingUrl } = task;

  try {
    console.log(`[Queue] Processing audit for followUpId: ${followUpId}, recordingUrl: ${recordingUrl}`);
    
    // Update db status to processing
    await db
      .update(followUps)
      .set({ aiStatus: "processing" })
      .where(eq(followUps.id, followUpId));

    // Audit with Gemini 1.5 Flash / 2.5 Flash
    const result = await auditCall(recordingUrl);

    // Save completed analysis
    await db
      .update(followUps)
      .set({
        aiStatus: "completed",
        transcription: result.transcription,
        analysis: result,
      })
      .where(eq(followUps.id, followUpId));

    console.log(`[Queue] Successfully completed audit for followUpId: ${followUpId}`);
  } catch (error) {
    console.error(`[Queue] AI Auditing Failed for call ID ${followUpId}:`, error);
    
    // Set status to failed
    try {
      await db
        .update(followUps)
        .set({ aiStatus: "failed" })
        .where(eq(followUps.id, followUpId));
    } catch (dbError) {
      console.error("[Queue] Failed to mark audit as failed in database:", dbError);
    }
  } finally {
    isProcessing = false;
    // Cooldown delay of 2 seconds before next audit to avoid model rate-limits / demand spikes
    setTimeout(processQueue, 2000);
  }
}

app.post("/api/audit", async (req, res) => {
  const { followUpId, recordingUrl } = req.body;

  if (!followUpId || !recordingUrl) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Push task to queue
  auditQueue.push({ followUpId, recordingUrl });
  console.log(`[Queue] Enqueued audit for call ID ${followUpId}. Queue size: ${auditQueue.length}`);

  // Trigger processing
  processQueue();

  // Acknowledge trigger receipt instantly (prevents connection timeout)
  res.status(202).json({ status: "queued" });
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`AI Microservice is listening on port ${PORT}`);
});
