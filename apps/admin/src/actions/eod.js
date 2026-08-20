"use server";

import { API } from "@/lib/api";
import { getIstDate, isIstBeforeCutoff, isIstSunday, formatIstDate } from "@/lib/ist";
import { getRawToken } from "@/lib/auth";

async function authHeaders() {
  const token = await getRawToken();
  return token ? { Cookie: `session=${token}` } : {};
}

export async function submitEodReport({ date, data, screenshotKey }) {
  try {
    const targetDate = date || getIstDate();

    if (isIstSunday() || new Date(targetDate).getDay() === 0) {
      return { success: false, message: "Submissions are not allowed on Sundays." };
    }

    if (!isIstBeforeCutoff()) {
      return { success: false, message: "Submission cutoff (7:30 PM IST) has passed." };
    }

    const res = await fetch(`${API}/api/eod`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(await authHeaders()) },
      body: JSON.stringify({ date: targetDate, data, screenshotKey }),
    });

    const result = await res.json();
    return result;
  } catch (err) {
    console.error("[ADMIN][ERROR] submitEodReport:", err.message);
    return { success: false, message: err.message };
  }
}

export async function uploadScreenshot(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API}/api/eod/screenshot`, {
      method: "POST",
      headers: await authHeaders(),
      body: formData,
    });

    const result = await res.json();
    return result;
  } catch (err) {
    console.error("[ADMIN][ERROR] uploadScreenshot:", err.message);
    return { success: false, message: err.message };
  }
}

export async function getEodReports({ date, team } = {}) {
  try {
    const params = new URLSearchParams();
    if (date) params.set("date", date);
    if (team) params.set("team", team);

    const res = await fetch(`${API}/api/eod?${params.toString()}`, {
      headers: await authHeaders(),
    });

    const result = await res.json();
    return result;
  } catch (err) {
    console.error("[ADMIN][ERROR] getEodReports:", err.message);
    return { success: false, message: err.message };
  }
}

export async function getEodHistory({ startDate, endDate, team } = {}) {
  try {
    const params = new URLSearchParams();
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    if (team) params.set("team", team);

    const res = await fetch(`${API}/api/eod/history?${params.toString()}`, {
      headers: await authHeaders(),
    });

    const result = await res.json();
    return result;
  } catch (err) {
    console.error("[ADMIN][ERROR] getEodHistory:", err.message);
    return { success: false, message: err.message };
  }
}

export async function getEodAnalytics({ startDate, endDate, team } = {}) {
  try {
    const params = new URLSearchParams();
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    if (team) params.set("team", team);

    const res = await fetch(`${API}/api/eod/analytics?${params.toString()}`, {
      headers: await authHeaders(),
    });

    const result = await res.json();
    return result;
  } catch (err) {
    console.error("[ADMIN][ERROR] getEodAnalytics:", err.message);
    return { success: false, message: err.message };
  }
}

export async function getMyEodSubmissions() {
  try {
    const res = await fetch(`${API}/api/eod/mine`, {
      headers: await authHeaders(),
    });

    const result = await res.json();
    return result;
  } catch (err) {
    console.error("[ADMIN][ERROR] getMyEodSubmissions:", err.message);
    return { success: false, message: err.message };
  }
}

export async function triggerEodEmails({ date, userId }) {
  try {
    const res = await fetch(`${API}/api/admin/eod/trigger`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(await authHeaders()) },
      body: JSON.stringify({ date, userId: userId || undefined }),
    });

    const result = await res.json();
    return result;
  } catch (err) {
    console.error("[ADMIN][ERROR] triggerEodEmails:", err.message);
    return { success: false, message: err.message };
  }
}

export { getIstDate, isIstBeforeCutoff, isIstSunday, formatIstDate };
