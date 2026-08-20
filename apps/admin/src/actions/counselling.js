"use server";

import { API } from "@/lib/api";
import { getRawToken, getSession } from "@/lib/auth";

async function authHeaders() {
  const token = await getRawToken();
  return token ? { Cookie: `session=${token}` } : {};
}

async function requireAdmin() {
  const session = await getSession();
  if (session?.role !== "ADMIN") {
    throw new Error("Unauthorized: admin access required");
  }
  return session;
}

export async function getCounsellingSessions({ startDate, endDate, source, outcome, counselorId, bookedById, search, limit, offset, showTodayFollowUps, followUpDate } = {}) {
  try {
    const params = new URLSearchParams();
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    if (source) params.set("source", source);
    if (outcome) params.set("outcome", outcome);
    if (counselorId) params.set("counselorId", counselorId);
    if (bookedById) params.set("bookedById", bookedById);
    if (search) params.set("search", search);
    if (limit) params.set("limit", limit);
    if (offset) params.set("offset", offset);
    if (showTodayFollowUps) params.set("showTodayFollowUps", "true");
    if (followUpDate) params.set("followUpDate", followUpDate);

    const res = await fetch(`${API}/api/counselling-sessions?${params}`, {
      headers: await authHeaders(),
      cache: "no-store"
    });
    return res.json();
  } catch (err) {
    console.error("[ADMIN][ERROR] getCounsellingSessions:", err.message);
    return { success: false, message: err.message };
  }
}

export async function createCounsellingSession({ studentName, phone, ageOrClass, courseInterest, source, outcome, notes, sessionDate, nextFollowUpDate, counselorId, bookedById, imageKey }) {
  try {
    const res = await fetch(`${API}/api/counselling-sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(await authHeaders()) },
      body: JSON.stringify({ studentName, phone, ageOrClass, courseInterest, source, outcome, notes, sessionDate, nextFollowUpDate, counselorId, bookedById, imageKey }),
    });
    return res.json();
  } catch (err) {
    console.error("[ADMIN][ERROR] createCounsellingSession:", err.message);
    return { success: false, message: err.message };
  }
}

export async function updateCounsellingSession(id, data) {
  try {
    await requireAdmin();

    const res = await fetch(`${API}/api/counselling-sessions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...(await authHeaders()) },
      body: JSON.stringify(data),
    });
    return res.json();
  } catch (err) {
    console.error("[ADMIN][ERROR] updateCounsellingSession:", err.message);
    return { success: false, message: err.message };
  }
}

export async function deleteCounsellingSession(id) {
  try {
    const res = await fetch(`${API}/api/counselling-sessions/${id}`, {
      method: "DELETE",
      headers: await authHeaders(),
    });
    return res.json();
  } catch (err) {
    console.error("[ADMIN][ERROR] deleteCounsellingSession:", err.message);
    return { success: false, message: err.message };
  }
}
