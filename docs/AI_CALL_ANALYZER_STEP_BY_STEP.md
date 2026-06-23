# SkillYards AI Call Analyzer — Step-by-Step Implementation Guide (Independent AI Microservice Edition)

This document provides the exact code specifications, file paths, and steps to implement the **Gemini 1.5 Flash Call Auditing pipeline** inside a standalone HTTP microservice (`apps/ai-service`) in the SkillYards Turborepo workspace.

---

## Step 1: Initialize the `apps/ai-service` App (COMPLETED)

We will create a separate Node.js server inside the `apps` directory that communicates via HTTP API on port `3005`.

### 1. Create the Directory and Files
Create the following structure:
*   `apps/ai-service/`
*   `apps/ai-service/package.json`
*   `apps/ai-service/src/server.js`
*   `apps/ai-service/src/call-analyzer.js`

### 2. Configure `apps/ai-service/package.json`
```json
{
  "name": "ai-service",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "node --watch src/server.js",
    "start": "node src/server.js"
  },
  "dependencies": {
    "@google/genai": "^0.1.1",
    "@aws-sdk/client-s3": "^3.1032.0",
    "@repo/db": "workspace:*",
    "drizzle-orm": "^0.45.1",
    "express": "^4.19.2",
    "dotenv": "^17.3.1"
  }
}
```

---

## Step 2: Extend the Database Schema

We will add columns for the transcript and AI metrics directly into the `follow_ups` table inside the database package.

1. Open `packages/db/src/schema/followUps.js`.
2. Update the schema definition to include the new AI columns:

```javascript
import { pgTable, uuid, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { employees } from "./employees";

export const followUps = pgTable("follow_ups", {
  id: uuid("id").defaultRandom().primaryKey(),
  leadPhone: text("lead_phone").notNull(),
  telecallerId: uuid("telecaller_id")
    .references(() => employees.id, { onDelete: "cascade" })
    .notNull(),
  duration: integer("duration").notNull(),
  recordingUrl: text("recording_url"), // R2 Key
  outcome: text("outcome").notNull(),  // 'reached' or 'not_reached'
  type: text("type").default("call").notNull(),
  contactedAt: timestamp("contacted_at").notNull(),
  
  // === NEW AI COLUMNS ===
  aiStatus: text("ai_status").default("pending").notNull(), // 'pending' | 'processing' | 'completed' | 'failed'
  transcription: text("transcription"),
  analysis: jsonb("analysis"), // Holds structured audit object
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

3. Run schema generation and migrations:
   ```bash
   cd packages/db
   npm run db:generate
   npm run db:migrate
   ```

---

## Step 3: Implement the Gemini Client & Server inside `apps/ai-service`

We configure Express, S3 connection, and Gemini 1.5 Flash structured auditing.

### 1. Write the Auditing Logic (`apps/ai-service/src/call-analyzer.js`)
```javascript
import { GoogleGenAI } from "@google/genai";
import { s3Client } from "./r2-client.js"; // Helper mapping standard R2 connection
import { GetObjectCommand } from "@aws-sdk/client-s3";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
You are the Lead Sales Auditor for SkillYards BootCamp.
Your task is to analyze the audio recording of a sales phone call.
Verify if the telecaller met the company standards:

=== COPANIES COURSES & INFORMATION ===
1. Web Development BootCamp (6 Months, MERN Stack, Fees: ₹45,000)
2. DSA & Interview Prep (4 Months, Java/C++, Fees: ₹25,000)
3. Full Stack Versatility Program (12 Months, Guaranteed Placement, Fees: ₹85,000)

=== TELECALLER CALL GOALS ===
- Primary Goal: Convince the student to book a "Free 1-on-1 Career Counselling Session".
- Must greet the student, mention "SkillYards", and ask about their career background (discovery).
- Must pitch the counselling session.

=== AUDITING RUBRICS ===
Identify:
1. Student Interest: Was the student interested in counselling? If not, why?
2. Objection Handling: Did they handle fee or time objections using EMI or learning support guidelines?
3. Speech Pacing: Rate the speech speed of the agent.
4. Lack of Pitch: What did the telecaller lack on this call?
5. Improvement Plan: Actionable advice for the telecaller.

Return the transcription and the audit data strictly matching the requested JSON schema.
`;

export async function auditCall(recordingKey) {
  // Fetch recording from R2
  const bucketParams = { Bucket: process.env.R2_BUCKET, Key: recordingKey };
  const s3Response = await s3Client.send(new GetObjectCommand(bucketParams));
  const audioBuffer = Buffer.from(await s3Response.Body.transformToByteArray());

  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: [
      {
        inlineData: {
          data: audioBuffer.toString("base64"),
          mimeType: "audio/mp3",
        },
      },
      {
        role: "user",
        text: "Perform the auditing process for this call recording."
      }
    ],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          transcription: { type: "STRING" },
          summary: { type: "STRING" },
          sentiment: { type: "STRING", enum: ["Positive", "Neutral", "Negative"] },
          leadScore: { type: "INTEGER" },
          talkRatioAgent: { type: "INTEGER" },
          talkRatioCustomer: { type: "INTEGER" },
          scriptAdherence: {
            type: "OBJECT",
            properties: {
              professional_greeting: { type: "BOOLEAN" },
              background_discovery: { type: "BOOLEAN" },
              counselling_pitched: { type: "BOOLEAN" },
            },
            required: ["professional_greeting", "background_discovery", "counselling_pitched"],
          },
          objectionsHandled: {
            type: "ARRAY",
            items: { type: "STRING" },
          },
          telecallerLacking: { type: "STRING" },
          improvementPlan: { type: "STRING" },
        },
        required: [
          "transcription",
          "summary",
          "sentiment",
          "leadScore",
          "talkRatioAgent",
          "talkRatioCustomer",
          "scriptAdherence",
          "objectionsHandled",
          "telecallerLacking",
          "improvementPlan",
        ],
      },
    },
  });

  return JSON.parse(response.text);
}
```

### 2. Write the Express Server (`apps/ai-service/src/server.js`)
```javascript
import express from "express";
import { auditCall } from "./call-analyzer.js";
import { db, followUps } from "@repo/db";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.post("/api/audit", async (req, res) => {
  const { followUpId, recordingUrl } = req.body;

  if (!followUpId || !recordingUrl) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Acknowledge trigger receipt instantly (keeps connection open without timeouts)
  res.status(202).json({ status: "processing" });

  // Process asynchronously in background
  try {
    await db.update(followUps).set({ aiStatus: "processing" }).where(eq(followUps.id, followUpId));

    const result = await auditCall(recordingUrl);

    await db.update(followUps).set({
      aiStatus: "completed",
      transcription: result.transcription,
      analysis: result
    }).where(eq(followUps.id, followUpId));

    console.log(`Successfully audited call ID: ${followUpId}`);
  } catch (error) {
    console.error(`Auditing failed for call ID ${followUpId}:`, error);
    await db.update(followUps).set({ aiStatus: "failed" }).where(eq(followUps.id, followUpId));
  }
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`AI Microservice is running on port ${PORT}`);
});
```

---

## Step 4: Dispatch Auditing Webhook from `apps/api`

In the telephony callback route, trigger the microservice asynchronously.

1. Open `apps/api/src/app/api/telephony/gsm-callback/route.js`.
2. Trigger the HTTP POST to the microservice inside the insert callback block:

```javascript
    // (Existing code) insert database row
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

    // Trigger background AI microservice
    if (recordingUrl && outcome === "reached") {
      (async () => {
        try {
          const aiServiceUrl = process.env.AI_SERVICE_URL || "http://localhost:3005";
          
          // Fire-and-forget request
          fetch(`${aiServiceUrl}/api/audit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              followUpId: inserted.id,
              recordingUrl: recordingUrl
            })
          }).catch(err => console.error("AI service dispatcher connection failed:", err));
          
        } catch (dispatchErr) {
          console.error("AI service trigger dispatch failed:", dispatchErr);
        }
      })();
    }

    return Response.json({ success: true, message: "Call Logged" });
```
