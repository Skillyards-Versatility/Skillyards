# SkillYards AI Call Analyzer — Step-by-Step Implementation Guide

This document provides the exact code specifications, file paths, and steps to implement the **Gemini 1.5 Flash Call Auditing and Analytics pipeline** in the SkillYards monorepo.

---

## Step 1: Install Node.js Dependencies

We need to install the official Google GenAI Node.js SDK inside the API application.

1. Open your terminal.
2. Run the following command:
   ```bash
   cd apps/api
   npm install @google/genai
   ```

---

## Step 2: Extend the Database Schema

We will add columns for the transcript and AI metrics directly into the `follow_ups` table inside the database package.

1. Open `packages/db/src/schema/followUps.js`.
2. Update the schema definition to include the `aiStatus`, `transcription`, and `analysis` fields:

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

3. Generate the database migration:
   ```bash
   cd packages/db
   npm run db:generate
   ```
4. Run the migration to apply changes to Neon Postgres:
   ```bash
   npm run db:migrate
   ```

---

## Step 3: Create the Gemini Client

We will create the Gemini service client to fetch recording streams from Cloudflare R2, send them to Gemini 1.5 Flash, and store the structured audit output back to the database.

1. Create a new folder: `apps/api/src/integrations/gemini`.
2. Create a new file: `apps/api/src/integrations/gemini/gemini.client.js`.
3. Add the following code:

```javascript
import { GoogleGenAI } from "@google/genai";
import { s3Client } from "../r2/r2.client";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { db, followUps } from "@repo/db";
import { eq } from "drizzle-orm";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// SkillYards Custom Playbook & Prompt
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
3. Speech Pacing: Rate the speech speed of the agent (words per minute pacing).
4. Lack of Pitch: What did the telecaller lack on this call?
5. Improvement Plan: Actionable advice for the telecaller.

Return the transcription and the audit data strictly matching the requested JSON schema.
`;

export async function auditCallWithGemini(followUpId, recordingKey) {
  try {
    // 1. Mark status as processing in database
    await db
      .update(followUps)
      .set({ aiStatus: "processing" })
      .where(eq(followUps.id, followUpId));

    // 2. Fetch file from R2
    const bucketParams = { Bucket: process.env.R2_BUCKET, Key: recordingKey };
    const s3Response = await s3Client.send(new GetObjectCommand(bucketParams));
    const audioBuffer = Buffer.from(await s3Response.Body.transformToByteArray());

    // 3. Request analysis from Gemini 1.5 Flash
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
            leadScore: { type: "INTEGER" }, // 0-100 buyer intent
            talkRatioAgent: { type: "INTEGER" }, // e.g. 60
            talkRatioCustomer: { type: "INTEGER" }, // e.g. 40
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

    const result = JSON.parse(response.text);

    // 4. Update follow_ups record with results
    await db
      .update(followUps)
      .set({
        aiStatus: "completed",
        transcription: result.transcription,
        analysis: {
          summary: result.summary,
          sentiment: result.sentiment,
          leadScore: result.leadScore,
          talkRatioAgent: result.talkRatioAgent,
          talkRatioCustomer: result.talkRatioCustomer,
          scriptAdherence: result.scriptAdherence,
          objectionsHandled: result.objectionsHandled,
          telecallerLacking: result.telecallerLacking,
          improvementPlan: result.improvementPlan,
        },
      })
      .where(eq(followUps.id, followUpId));

    console.log(`AI Auditing Completed for FollowUp ID: ${followUpId}`);
  } catch (error) {
    console.error("AI Auditing Failed:", error);
    await db
      .update(followUps)
      .set({ aiStatus: "failed" })
      .where(eq(followUps.id, followUpId));
  }
}
```

---

## Step 4: Hook Gemini into the Ingestion Endpoint

We will trigger the audit function asynchronously inside the telephony callback handler.

1. Open `apps/api/src/app/api/telephony/gsm-callback/route.js`.
2. Import the client at the top of the file:
   ```javascript
   import { auditCallWithGemini } from "@/integrations/gemini/gemini.client";
   ```
3. Update the insert database block to run the background auditor:

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

    ctx.log("CALL_RECORDING_LOGGED", { followUpId: inserted.id, telecaller_id, cleanPhone });

    // === NEW BACKGROUND TRIGGER ===
    if (recordingUrl && outcome === "reached") {
      // Execute asynchronously in background without blocking callback response
      (async () => {
        try {
          await auditCallWithGemini(inserted.id, recordingUrl);
        } catch (aiErr) {
          console.error(`AI queue trigger error for ${inserted.id}:`, aiErr);
        }
      })();
    }

    return Response.json({ success: true, message: "Call Logged" });
```

---

## Step 5: Render Analysis in the Admin Dashboard

Now we expose the new AI auditing fields in the Admin Portal.

1. Open `apps/admin/src/actions/calls.js` (Server Action).
2. Ensure you are selecting `aiStatus`, `transcription`, and `analysis` from the database query.
3. Open `apps/admin/src/app/(authenticated)/calls/page.js` (or related UI views).
4. Add an **AI Audit** column to the Call Logs table.
5. If `aiStatus` is:
   *   `pending` / `processing`: Render a loading spinner or "Analyzing..." badge.
   *   `completed`: Render a button "View AI Insights" that opens a modal.
   *   `failed`: Render "Failed" badge.
6. Design the modal to display:
   *   **Lead Sentiment & Score**: Positive/Negative badge and circular progress indicator.
   *   **Script Adherence Checklist**: Checkboxes showing whether greeting, discovery, and pitch were completed.
   *   **Objections raised**: Objections handled listing.
   *   **Coaching Advice**: *"What did this agent lack?"* and *"How can they improve?"* recommendations.
   *   **Transcript**: Verbatim scrollable conversation transcript box.
