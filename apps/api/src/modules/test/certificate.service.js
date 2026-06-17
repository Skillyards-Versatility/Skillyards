import { getResend } from "../notifications/resend.client";
import {
  certificateTemplate,
  certificateEmailTemplate,
} from "./certificate.template";

/**
 * Generate a PDF buffer from HTML using PDFShift API.
 * Fast (~2s), works on Vercel free tier, no Puppeteer needed.
 *
 * @param {string} html – Full HTML page string
 * @returns {Promise<Buffer>} PDF buffer
 */
async function generatePdfBuffer(html) {
  const apiKey = process.env.PDFSHIFT_API_KEY;

  if (!apiKey) {
    throw new Error("PDFSHIFT_API_KEY is not set in environment variables");
  }

  const response = await fetch("https://api.pdfshift.io/v3/convert/pdf", {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from("api:" + apiKey).toString("base64"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      source: html,
      landscape: true,
      format: "A4",
      margin: "0",
      use_print: false,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`PDFShift error (${response.status}): ${errText}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

/**
 * Full certificate pipeline:
 * 1. Render HTML certificate
 * 2. Convert to PDF via PDFShift
 * 3. Send via Resend with PDF attachment
 */
export async function generateAndSendCertificate(data) {
  try {
    const percentage = Math.round((data.score / data.total) * 100);

    const html = certificateTemplate({
      ...data,
      percentage,
      topics: [...new Set(data.topics)],
      date: new Date(data.completedAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    });

    // Generate PDF via PDFShift
    console.log("Generating PDF for", data.name);
    const pdfBuffer = await generatePdfBuffer(html);
    console.log("PDF generated, size:", pdfBuffer.length, "bytes");

    // Send email with PDF attachment
    const resend = getResend();
    if (!resend) {
      console.warn("Skipping email — Resend not configured");
      return;
    }

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || "SkillYards <certificates@skillyards.in>",
      to: [data.email],
      subject: `Your SkillYards Certificate — ${percentage}% Score`,
      html: certificateEmailTemplate({
        name: data.name,
        percentage,
        score: data.score,
        total: data.total,
      }),
      attachments: [
        {
          filename: `SkillYards-Certificate-${data.name.replace(/\s+/g, "-")}.pdf`,
          content: pdfBuffer.toString("base64"),
        },
      ],
    });

    console.log(`Certificate sent to ${data.email} (${percentage}%)`, result);
  } catch (err) {
    console.error("CERTIFICATE FLOW FAILED:", err);
    throw err;
  }
}