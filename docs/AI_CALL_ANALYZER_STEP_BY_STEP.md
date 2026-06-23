# SkillYards AI Call Analyzer — Step-by-Step Implementation Guide (Monorepo AI Package Edition)

This document provides the exact code specifications, file paths, and steps to implement the **Gemini 1.5 Flash Call Auditing pipeline** using a shared monorepo package architecture, complete with Weekly Reports sent via **Resend (Email)** and **Slack Webhooks**.

---

## Phase 1: Initialize the `@repo/ai` Monorepo Package

We will create a dedicated AI library package shared across all apps in the Turborepo monorepo.

### 1. Create Folder Structure
Create the following directories and files:
*   `packages/ai/`
*   `packages/ai/package.json`
*   `packages/ai/src/index.js`
*   `packages/ai/src/call-analyzer.js`

### 2. Configure `packages/ai/package.json`
```json
{
  "name": "@repo/ai",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.js",
  "dependencies": {
    "@google/genai": "^0.1.1"
  }
}
```

### 3. Link the Package to App Dependencies
Add `@repo/ai` to the dependencies inside:
*   `apps/api/package.json`
*   `apps/admin/package.json`

Add this dependency in both packages:
```json
"@repo/ai": "workspace:*"
```

---

## Phase 2: Extend the Database Schema

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

## Phase 3: Implement Call Analyzer in `@repo/ai`

We define the prompt playbook and the audit function inside `packages/ai/src/call-analyzer.js`.

```javascript
import { GoogleGenAI } from "@google/genai";

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

export async function auditCallWithGemini({ audioBuffer, apiKey }) {
  const ai = new GoogleGenAI({ apiKey });

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

Export this function in `packages/ai/src/index.js`:
```javascript
export { auditCallWithGemini } from "./call-analyzer";
```

---

## Phase 4: Hook API Callback Route to `@repo/ai`

In the Next.js endpoint, retrieve the audio from R2, call the library service, and update Drizzle.

1. Open `apps/api/src/app/api/telephony/gsm-callback/route.js`.
2. Import the shared module and s3 helper:
   ```javascript
   import { auditCallWithGemini } from "@repo/ai";
   import { s3Client } from "@/integrations/r2/r2.client";
   import { GetObjectCommand } from "@aws-sdk/client-s3";
   import { eq } from "drizzle-orm";
   ```
3. Run background audit after database log:

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

    // Trigger background AI auditing
    if (recordingUrl && outcome === "reached") {
      (async () => {
        try {
          // Update status to processing
          await db.update(followUps).set({ aiStatus: "processing" }).where(eq(followUps.id, inserted.id));

          // Fetch audio buffer from R2
          const bucketParams = { Bucket: process.env.R2_BUCKET, Key: recordingUrl };
          const s3Response = await s3Client.send(new GetObjectCommand(bucketParams));
          const audioBuffer = Buffer.from(await s3Response.Body.transformToByteArray());

          // Execute shared package logic
          const result = await auditCallWithGemini({
            audioBuffer,
            apiKey: process.env.GEMINI_API_KEY
          });

          // Save completed metrics
          await db.update(followUps).set({
            aiStatus: "completed",
            transcription: result.transcription,
            analysis: result
          }).where(eq(followUps.id, inserted.id));

        } catch (aiErr) {
          console.error("AI analysis failed:", aiErr);
          await db.update(followUps).set({ aiStatus: "failed" }).where(eq(followUps.id, inserted.id));
        }
      })();
    }
```

---

## Phase 5: Weekly Reports & Slack Notifier Cron Job

We create a scheduled node job inside `apps/api/src/jobs/weekly-report.js`.

```javascript
import { db, followUps, employees } from "@repo/db";
import { Resend } from "resend";
import { gte } from "drizzle-orm";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWeeklyReports() {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // 1. Fetch all calls completed in past 7 days
  const weeklyCalls = await db
    .select()
    .from(followUps)
    .where(gte(followUps.createdAt, oneWeekAgo));

  // 2. Fetch all employees
  const staff = await db.select().from(employees);

  for (const agent of staff) {
    const agentCalls = weeklyCalls.filter(c => c.telecallerId === agent.id);
    if (agentCalls.length === 0) continue;

    // Calculate scorecard averages
    const completedAudits = agentCalls.filter(c => c.aiStatus === "completed");
    const avgScore = completedAudits.reduce((acc, c) => acc + (c.analysis?.leadScore || 0), 0) / (completedAudits.length || 1);

    // 3. Compile HTML Scorecard Email
    const htmlEmail = `
      <h2>Weekly Performance Scorecard: ${agent.name}</h2>
      <p>Total Calls Made: <b>${agentCalls.length}</b></p>
      <p>Average Lead Intent Score: <b>${avgScore.toFixed(1)}/100</b></p>
      <h3>AI Core Coaching Suggestions</h3>
      <ul>
        ${completedAudits.map(c => `<li><b>Lead ${c.leadPhone}:</b> ${c.analysis?.improvementPlan || 'Good call.'}</li>`).join('')}
      </ul>
    `;

    // 4. Send Email via Resend
    await resend.emails.send({
      from: "SkillYards Audits <audits@skillyards.com>",
      to: agent.email || "manager@skillyards.com",
      subject: `Weekly Calling Report: ${agent.name}`,
      html: htmlEmail,
    });

    // 5. Fire Push Notification to Slack Channel Webhook
    if (process.env.SLACK_WEBHOOK_URL) {
      await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `📊 *Weekly Report Compiled*\n*Agent*: ${agent.name}\n*Total Calls*: ${agentCalls.length}\n*Average Score*: ${avgScore.toFixed(0)}/100\n📧 _Scorecard details sent to email._`
        })
      });
    }
  }
}
```
