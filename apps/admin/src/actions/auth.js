"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { db, users } from "@repo/db";
import { eq, and, gt } from "drizzle-orm";
import { cookies } from "next/headers";
import { encrypt } from "@/lib/auth";
import { redirect } from "next/navigation";
import crypto from "crypto";
import { API } from "@/lib/api";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export async function login(prevState, formData) {
  const validatedFields = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user) {
      return {
        error: "Invalid email or password",
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        error: "Invalid email or password",
      };
    }

    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const sessionPayload = {
      userId: user.id,
      name: user.name,
      role: user.role,
      expires,
    };
    const session = await encrypt(sessionPayload);

    const cookieStore = await cookies();
    cookieStore.set("session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires,
      sameSite: "lax",
      path: "/",
      domain: process.env.NODE_ENV === "production" ? ".skillyards.in" : undefined,
    });

    return { success: true, role: user.role };

  } catch (error) {
    console.error("Login Error:", error);
    return {
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set("session", "", {
    maxAge: 0,
    path: "/",
    domain: process.env.NODE_ENV === "production" ? ".skillyards.in" : undefined,
  });
  redirect("/login");
}

export async function forgotPassword(prevState, formData) {
  const email = formData.get("email");

  if (!email) {
    return { error: "Email is required" };
  }

  try {
    const [user] = await db
      .select({ id: users.id, email: users.email })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (user) {
      const token = crypto.randomUUID();
      const expiry = new Date(Date.now() + 60 * 60 * 1000);

      await db
        .update(users)
        .set({ resetToken: token, resetTokenExpiry: expiry })
        .where(eq(users.id, user.id));

      const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3002";
      const resetLink = `${adminUrl}/reset-password?token=${token}`;

      try {
        await fetch(`${API}/api/auth/send-reset-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email, resetLink }),
        });
      } catch (emailErr) {
        console.error("Failed to send reset email:", emailErr);
      }
    }

    return {
      success: true,
      message: "If an account with that email exists, a reset link has been sent.",
    };
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return { error: "Something went wrong. Please try again." };
  }
}

export async function resetPassword(prevState, formData) {
  const token = formData.get("token");
  const newPassword = formData.get("newPassword");
  const confirmPassword = formData.get("confirmPassword");

  if (!token) {
    return { error: "Invalid or missing reset link" };
  }

  if (!newPassword || newPassword.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  if (newPassword !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  try {
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(
        and(
          eq(users.resetToken, token),
          gt(users.resetTokenExpiry, new Date())
        )
      )
      .limit(1);

    if (!user) {
      return { error: "Invalid or expired reset link. Please request a new one." };
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await db
      .update(users)
      .set({ password: hashed, resetToken: null, resetTokenExpiry: null })
      .where(eq(users.id, user.id));

    return { success: true };
  } catch (error) {
    console.error("Reset Password Error:", error);
    return { error: "Something went wrong. Please try again." };
  }
}
