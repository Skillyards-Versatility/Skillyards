import { NextResponse } from "next/server";
import { createProtectedRoute } from "@/lib/middleware";
import { sendPasswordResetEmail } from "@/modules/notifications/email.service";

async function postHandler(req) {
  try {
    const { email, resetLink } = await req.json();

    if (!email || !resetLink) {
      return NextResponse.json(
        { success: false, message: "Email and reset link are required" },
        { status: 400 }
      );
    }

    await sendPasswordResetEmail({ to: email, resetLink });

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
});
