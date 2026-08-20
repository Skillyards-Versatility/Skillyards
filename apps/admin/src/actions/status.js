"use server";

import { API } from "@/lib/api";
import { getRawToken } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function authHeaders() {
  const token = await getRawToken();
  return token ? { Cookie: `session=${token}` } : {};
}

export async function updateStatus({ statusEmoji, statusText, statusClearAt }) {
  try {
    const res = await fetch(`${API}/api/users/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...(await authHeaders()) },
      body: JSON.stringify({ statusEmoji, statusText, statusClearAt }),
    });

    const result = await res.json();

    if (result.success) {
      revalidatePath("/team");
    }

    return result;
  } catch (err) {
    console.error("[ADMIN][ERROR] updateStatus:", err.message);
    return { success: false, message: err.message };
  }
}

export async function getTeamStatuses() {
  try {
    const res = await fetch(`${API}/api/users/status`, {
      headers: await authHeaders(),
      cache: "no-store",
    });
    return res.json();
  } catch (err) {
    console.error("[ADMIN][ERROR] getTeamStatuses:", err.message);
    return { success: false, message: err.message };
  }
}
