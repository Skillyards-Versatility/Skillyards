"use server";

import { db, users } from "@repo/db";
import { eq, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { getSession, updateSessionCookie, getRawToken } from "@/lib/auth";
import { API } from "@/lib/api";

export async function getProfile() {
  const session = await getSession();
  if (!session) return { error: "Not authenticated" };

  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      profileImageKey: users.profileImageKey,
      role: users.role,
      team: users.team,
    })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  if (!user) return { error: "User not found" };
  return { success: true, user };
}

export async function updateProfile({ name, email, phone }) {
  const session = await getSession();
  if (!session) return { error: "Not authenticated" };

  if (!name || !email) {
    return { error: "Name and email are required" };
  }

  try {
    await db
      .update(users)
      .set({ name, email, phone: phone || null })
      .where(eq(users.id, session.userId));

    await updateSessionCookie({ name });

    revalidatePath("/profile");
    return { success: true };
  } catch (err) {
    if (err.message.includes("unique constraint")) {
      return { error: "Email already in use" };
    }
    return { error: "Failed to update profile" };
  }
}

export async function changePassword({ currentPassword, newPassword }) {
  const session = await getSession();
  if (!session) return { error: "Not authenticated" };

  if (!currentPassword || !newPassword) {
    return { error: "Both current and new password are required" };
  }

  if (newPassword.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  const [user] = await db
    .select({ password: users.password })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  if (!user) return { error: "User not found" };

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) {
    return { error: "Current password is incorrect" };
  }

  try {
    const hashed = await bcrypt.hash(newPassword, 10);
    await db
      .update(users)
      .set({ password: hashed })
      .where(eq(users.id, session.userId));

    return { success: true };
  } catch {
    return { error: "Failed to change password" };
  }
}

export async function uploadProfilePhoto(formData) {
  const session = await getSession();
  if (!session) return { error: "Not authenticated" };

  const file = formData.get("file");
  if (!file) return { error: "No file provided" };

  if (file.size > 2 * 1024 * 1024) {
    return { error: "File must be under 2MB" };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const blob = new Blob([buffer], { type: file.type });
    const uploadFormData = new FormData();
    uploadFormData.append("file", blob, file.name);

    const token = await getRawToken();
    const res = await fetch(`${API}/api/users/avatar`, {
      method: "POST",
      headers: token ? { Cookie: `session=${token}` } : {},
      body: uploadFormData,
    });

    const result = await res.json();
    if (!result.success) {
      return { error: result.message || "Upload failed" };
    }

    await db
      .update(users)
      .set({ profileImageKey: result.profileImageKey })
      .where(eq(users.id, session.userId));

    await updateSessionCookie({ profileImageKey: result.profileImageKey });

    revalidatePath("/profile");
    return { success: true, profileImageKey: result.profileImageKey };
  } catch (err) {
    console.error("Profile photo upload error:", err);
    return { error: "Upload failed" };
  }
}

export async function removeProfilePhoto() {
  const session = await getSession();
  if (!session) return { error: "Not authenticated" };

  try {
    await db
      .update(users)
      .set({ profileImageKey: null })
      .where(eq(users.id, session.userId));

    await updateSessionCookie({ profileImageKey: null });

    revalidatePath("/profile");
    return { success: true };
  } catch (err) {
    console.error("Remove photo error:", err);
    return { error: "Failed to remove photo" };
  }
}
