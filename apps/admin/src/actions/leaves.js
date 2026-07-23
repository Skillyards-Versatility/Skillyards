"use server";

import { API } from "@/lib/api";
import { getRawToken } from "@/lib/auth";

async function authHeaders() {
  const token = await getRawToken();
  return token ? { Cookie: `session=${token}` } : {};
}

export async function applyLeave({ startDate, endDate, type, reason, isHalfDay, halfDayPeriod }) {
  const res = await fetch(`${API}/api/leaves`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify({ startDate, endDate, type, reason, isHalfDay, halfDayPeriod }),
  });
  return res.json();
}

export async function getLeaves() {
  const res = await fetch(`${API}/api/leaves`, {
    headers: await authHeaders(),
    cache: "no-store",
  });
  return res.json();
}

export async function updateLeaveStatus(id, status, rejectionReason) {
  const res = await fetch(`${API}/api/leaves/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify({ status, rejectionReason }),
  });
  return res.json();
}
