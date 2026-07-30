"use server";

import { API } from "@/lib/api";
import { getRawToken } from "@/lib/auth";

async function authHeaders() {
  const token = await getRawToken();
  return token ? { Cookie: `session=${token}` } : {};
}

export async function getCounsellingSessions({ startDate, endDate, source, outcome, counselorId } = {}) {
  const params = new URLSearchParams();
  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);
  if (source) params.set("source", source);
  if (outcome) params.set("outcome", outcome);
  if (counselorId) params.set("counselorId", counselorId);

  const res = await fetch(`${API}/api/counselling-sessions?${params}`, {
    headers: await authHeaders(),
  });
  return res.json();
}

export async function createCounsellingSession({ studentName, phone, ageOrClass, courseInterest, source, outcome, notes, sessionDate, counselorId }) {
  const res = await fetch(`${API}/api/counselling-sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify({ studentName, phone, ageOrClass, courseInterest, source, outcome, notes, sessionDate, counselorId }),
  });
  return res.json();
}

export async function deleteCounsellingSession(id) {
  const res = await fetch(`${API}/api/counselling-sessions/${id}`, {
    method: "DELETE",
    headers: await authHeaders(),
  });
  return res.json();
}
