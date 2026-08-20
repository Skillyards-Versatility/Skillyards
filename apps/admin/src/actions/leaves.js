"use server";

import { API } from "@/lib/api";
import { getRawToken } from "@/lib/auth";

async function authHeaders() {
  const token = await getRawToken();
  return token ? { Cookie: `session=${token}` } : {};
}

export async function applyLeave({ startDate, endDate, type, reason, isHalfDay, halfDayPeriod }) {
  try {
    const res = await fetch(`${API}/api/leaves`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(await authHeaders()) },
      body: JSON.stringify({ startDate, endDate, type, reason, isHalfDay, halfDayPeriod }),
    });
    return res.json();
  } catch (err) {
    console.error("[ADMIN][ERROR] applyLeave:", err.message);
    return { success: false, message: err.message };
  }
}

export async function getLeaves() {
  try {
    const res = await fetch(`${API}/api/leaves`, {
      headers: await authHeaders(),
      cache: "no-store",
    });
    return res.json();
  } catch (err) {
    console.error("[ADMIN][ERROR] getLeaves:", err.message);
    return { success: false, message: err.message };
  }
}

export async function updateLeaveStatus(id, status, rejectionReason) {
  try {
    const res = await fetch(`${API}/api/leaves/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...(await authHeaders()) },
      body: JSON.stringify({ status, rejectionReason }),
    });
    return res.json();
  } catch (err) {
    console.error("[ADMIN][ERROR] updateLeaveStatus:", err.message);
    return { success: false, message: err.message };
  }
}
