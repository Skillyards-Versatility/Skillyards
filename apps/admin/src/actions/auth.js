"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { db, users } from "@repo/db";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { encrypt } from "@/lib/auth";
import { redirect } from "next/navigation";

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
  cookieStore.delete("session");
  redirect("/login");
}
