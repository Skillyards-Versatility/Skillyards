import { NextResponse } from "next/server";
import { db, users } from "@repo/db";
import { eq } from "drizzle-orm";
import { createProtectedRoute } from "@/lib/middleware";
import { checkRateLimit } from "@/lib/rateLimiter";
import { sendPasswordResetEmail } from "@/modules/notifications/email.service";

// IP-level ceiling: bounds abuse of the endpoint from a single source.
const RESET_EMAIL_RATE_LIMIT = {
  prefix: "reset-email",
  burst: { limit: 5, windowMs: 60000 },
  hourly: { limit: 20 },
  daily: { limit: 50 },
  global: { limit: 200, windowMs: 3600000 },
};

// Per-recipient cap: no single address may receive more than 3 reset emails/day,
// so a bot cannot turn this endpoint into an email-bombing relay.
const RESET_EMAIL_PER_RECIPIENT = {
  prefix: "reset-email-per-email",
  burst: { limit: 3, windowMs: 86400000 },
  hourly: null,
  daily: null,
};

async function postHandler(req, { ctx }) {
  try {
    const { email, resetLink } = await req.json();

    if (!email || !resetLink) {
      return NextResponse.json(
        { success: false, message: "Email and reset link are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    // Only send to a known account — prevents relaying mail to arbitrary inboxes.
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (!user) {
      ctx.log("RESET_EMAIL_NO_ACCOUNT", { email: normalizedEmail });
      return NextResponse.json({
        success: true,
        message: "If that account exists, a reset link has been sent.",
      });
    }

    const { limited, retryAfterMs } = await checkRateLimit({
      prefix: RESET_EMAIL_PER_RECIPIENT.prefix,
      identity: normalizedEmail,
      burst: RESET_EMAIL_PER_RECIPIENT.burst,
      hourly: RESET_EMAIL_PER_RECIPIENT.hourly,
      daily: RESET_EMAIL_PER_RECIPIENT.daily,
    });

    if (limited) {
      ctx.warn("RESET_EMAIL_PER_RECIPIENT_LIMITED", {
        email: normalizedEmail,
        retryAfterMs,
      });
      return NextResponse.json(
        { success: false, message: "Too many reset requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) } }
      );
    }

    await sendPasswordResetEmail({ to: normalizedEmail, resetLink });

    return NextResponse.json({ success: true, message: "Reset email sent" });
  } catch (error) {
    console.error("Send Reset Email Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send email" },
      { status: 500 }
    );
  }
}

export const POST = createProtectedRoute(postHandler, {
  isPublic: true,
  policy: () => ({ authorized: true, reason: "public password reset email" }),
  rateLimit: RESET_EMAIL_RATE_LIMIT,
});
