import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { auditCall } from "./call-analyzer.js";
import { db, followUps } from "@repo/db";
import { eq } from "drizzle-orm";

const app = express();
app.use(express.json());

app.post("/api/audit", async (req, res) => {
  const { followUpId, recordingUrl } = req.body;

  if (!followUpId || !recordingUrl) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Acknowledge trigger receipt instantly (prevents connection timeout)
  res.status(202).json({ status: "processing" });

  // Process asynchronously in background
  try {
    console.log(`Received audit trigger for followUpId: ${followUpId}, recordingUrl: ${recordingUrl}`);
    
    // Update db status to processing
    await db
      .update(followUps)
      .set({ aiStatus: "processing" })
      .where(eq(followUps.id, followUpId));

    // Audit with Gemini 1.5 Flash
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

    console.log(`Successfully completed audit for followUpId: ${followUpId}`);
  } catch (error) {
    console.error(`AI Auditing Failed for call ID ${followUpId}:`, error);
    
    // Set status to failed
    try {
      await db
        .update(followUps)
        .set({ aiStatus: "failed" })
        .where(eq(followUps.id, followUpId));
    } catch (dbError) {
      console.error("Failed to mark audit as failed in database:", dbError);
    }
  }
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`AI Microservice is listening on port ${PORT}`);
});
