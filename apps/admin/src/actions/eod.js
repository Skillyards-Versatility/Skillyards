"use server";

import { API } from "@/lib/api";
import { getIstDate, isIstBeforeCutoff, isIstSunday, formatIstDate } from "@/lib/ist";
import { getRawToken } from "@/lib/auth";

async function authHeaders() {
  const token = await getRawToken();
  return token ? { Cookie: `session=${token}` } : {};
}

export async function submitEodReport({ data, screenshotKey }) {
  const date = getIstDate();

  if (isIstSunday()) {
    return { success: false, message: "Submissions are not allowed on Sundays." };
  }

  if (!isIstBeforeCutoff()) {
    return { success: false, message: "Submission cutoff (6:30 PM IST) has passed." };
  }

  const res = await fetch(`${API}/api/eod`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify({ date, data, screenshotKey }),
  });

  const result = await res.json();
  return result;
}

export async function uploadScreenshot(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API}/api/eod/screenshot`, {
    method: "POST",
    headers: await authHeaders(),
    body: formData,
  });

  const result = await res.json();
  return result;
}

export async function getEodReports({ date, team } = {}) {
  const params = new URLSearchParams();
  if (date) params.set("date", date);
  if (team) params.set("team", team);

  const res = await fetch(`${API}/api/eod?${params.toString()}`, {
    headers: await authHeaders(),
  });

  const result = await res.json();
  return result;
}

export async function getEodHistory({ startDate, endDate, team } = {}) {
  const params = new URLSearchParams();
  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);
  if (team) params.set("team", team);

  const res = await fetch(`${API}/api/eod/history?${params.toString()}`, {
    headers: await authHeaders(),
  });

  const result = await res.json();
  return result;
}

export async function getMyEodSubmissions() {
  const res = await fetch(`${API}/api/eod/mine`, {
    headers: await authHeaders(),
  });

  const result = await res.json();
  return result;
}

export { getIstDate, isIstBeforeCutoff, isIstSunday, formatIstDate };
