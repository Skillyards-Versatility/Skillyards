import { createHash } from "node:crypto";
import { db } from "@repo/db";
import { registerTestSchema, HONEYPOT_FIELDS } from "@/modules/test/test.schema";
import { registerTestLead } from "@/modules/test/test.service";
import { verifyCaptcha } from "@/integrations/captcha/captcha";
import { createProtectedRoute } from "@/lib/middleware";
import { publicAllow } from "@/lib/permissions";

/**
 * PUBLIC ASSESSMENT REGISTRATION HANDLER (Lead Generation)
 *
 * Protection order (cheap checks first):
 *   1. Rate limit          -> enforced by middleware (strict per-IP policy)
 *   2. Honeypot            -> hidden field; bots fill it, humans never see it
 *   3. CAPTCHA             -> Google reCAPTCHA token verification
 *   4. Validation          -> zod schema
 *   5. Database            -> insert test lead
 *
 * Logging intentionally omits request bodies (no emails/names/phones). Only a
 * sha256 hash of the email is kept for forensic correlation.
 */

// Strict policy for the public assessment registration funnel.
const REGISTER_RATE_LIMIT = {
  prefix: "test-register",
  burst: { limit: 5, windowMs: 60000 },
  hourly: { limit: 20 },
  daily: { limit: 100 },
  global: { limit: 1000, windowMs: 3600000 },
};

function getClientInfo(req) {
  return {
    ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon",
    userAgent: req.headers.get("user-agent") || "unknown",
  };
}

function hashEmail(email) {
  return createHash("sha256").update(email).digest("hex");
}

async function postHandler(req, { ctx }) {
  const { ip, userAgent } = getClientInfo(req);
  const body = await req.json();

  // ── HONEYPOT: silent reject, indistinguishable from a valid response ──
  const honeypotFilled = HONEYPOT_FIELDS.some(
    (field) => typeof body?.[field] === "string" && body[field].trim().length > 0
  );
  if (honeypotFilled) {
    ctx.warn("ASSESSMENT_REG_HONEYPOT_HIT", {
      ip,
      userAgent,
      result: "rejected",
      reason: "honeypot",
    });
    return Response.json({ success: true, leadId: "00000000-0000-0000-0000-000000000000" });
  }

  const parsed = registerTestSchema.safeParse(body);

  if (!parsed.success) {
    ctx.warn("ASSESSMENT_REG_VALIDATION_FAILURE", {
      ip,
      userAgent,
      result: "rejected",
      reason: "validation",
      errors: parsed.error.flatten(),
    });
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  const { captchaToken, email, website, company, ...leadData } = parsed.data;
  const emailHash = hashEmail(email);

  // ── CAPTCHA ──
  const isValidCaptcha = await verifyCaptcha(captchaToken, { action: "test_register" });
  if (!isValidCaptcha) {
    ctx.warn("ASSESSMENT_REG_CAPTCHA_FAILURE", {
      ip,
      userAgent,
      emailHash,
      result: "rejected",
      reason: "captcha",
    });
    return Response.json({ error: "Captcha verification failed" }, { status: 400 });
  }

  const result = await registerTestLead({ db, data: { ...leadData, email } });
  ctx.log("ASSESSMENT_LEAD_REGISTERED", {
    leadId: result.lead.id,
    alreadyExists: result.alreadyExists,
    ip,
    userAgent,
    emailHash,
    result: "accepted",
    reason: "ok",
  });

  return Response.json({
    success: true,
    leadId: result.lead.id,
    alreadyExists: result.alreadyExists,
  });
}

// ── STRUCTURAL ENFORCEMENT ──
export const POST = createProtectedRoute(postHandler, {
  policy: publicAllow,
  isPublic: true,
  rateLimit: REGISTER_RATE_LIMIT,
});
