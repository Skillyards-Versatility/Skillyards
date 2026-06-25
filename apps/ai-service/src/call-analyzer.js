import { GoogleGenAI } from "@google/genai";
import { s3Client } from "./r2-client.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";

// Initialized inside the function to dynamically capture env variables
export async function auditCall(recordingKey) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // 1. Fetch file from R2
  const bucketParams = { Bucket: process.env.R2_BUCKET, Key: recordingKey };
  const s3Response = await s3Client.send(new GetObjectCommand(bucketParams));
  const audioBuffer = Buffer.from(await s3Response.Body.transformToByteArray());

  const SYSTEM_INSTRUCTION = `
You are the Lead Sales Auditor for SkillYards BootCamp.
Your task is to analyze the audio recording of a sales phone call.
Verify if the telecaller met the company standards:

=== COMPANYS COURSES & INFORMATION ===
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

  // 2. Request analysis from Gemini 2.5 Flash
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
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

  return JSON.parse(response.text);
}
