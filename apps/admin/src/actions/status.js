"use server";

import { API } from "@/lib/api";
import { getRawToken } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function authHeaders() {
  const token = await getRawToken();
  return token ? { Cookie: `session=${token}` } : {};
}

export async function updateStatus({ statusEmoji, statusText, statusClearAt }) {
  const res = await fetch(`${API}/api/users/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify({ statusEmoji, statusText, statusClearAt }),
  });
  
  const result = await res.json();
  
  if (result.success) {
    revalidatePath("/team"); // or wherever the team directory is
  }
  
  return result;
}

export async function getTeamStatuses() {
  const res = await fetch(`${API}/api/users/status`, {
    headers: await authHeaders(),
    cache: "no-store",
  });
  return res.json();
}
