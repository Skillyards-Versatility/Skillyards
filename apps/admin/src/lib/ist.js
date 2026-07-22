const IST_TIMEZONE = "Asia/Kolkata";

/**
 * Get the current IST date as YYYY-MM-DD string.
 */
export function getIstDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: IST_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const y = parts.find((p) => p.type === "year").value;
  const m = parts.find((p) => p.type === "month").value;
  const d = parts.find((p) => p.type === "day").value;
  return `${y}-${m}-${d}`;
}

/**
 * Get current IST time components.
 */
export function getIstTime(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: IST_TIMEZONE,
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(now);
  const hours = parseInt(parts.find((p) => p.type === "hour").value, 10);
  const minutes = parseInt(parts.find((p) => p.type === "minute").value, 10);
  return {
    hours,
    minutes,
    totalMinutes: hours * 60 + minutes,
  };
}

/**
 * Check if current IST time is before the 7:30 PM cutoff.
 * Cutoff = 19:30 IST = 1170 minutes from midnight.
 */
export function isIstBeforeCutoff(now = new Date()) {
  const { totalMinutes } = getIstTime(now);
  return totalMinutes < 1170; // 19 * 60 + 30 = 1170
}

/**
 * Check if current IST time is within allowed break hours (11:00 AM to 6:30 PM).
 */
export function isIstWithinBreakHours(now = new Date()) {
  const { totalMinutes } = getIstTime(now);
  return totalMinutes >= 660 && totalMinutes < 1110; // 11:00 AM = 660, 6:30 PM = 1110
}

/**
 * Check if today is a Sunday in IST.
 */
export function isIstSunday(now = new Date()) {
  const dayName = now.toLocaleDateString("en-US", {
    timeZone: IST_TIMEZONE,
    weekday: "long",
  });
  return dayName === "Sunday";
}

/**
 * Format an IST date for display: "Mon, 21 Jul 2026"
 */
export function formatIstDate(dateStr, now = new Date()) {
  if (!dateStr) return "—";
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d, 0, 0, 0));
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

/**
 * Get IST day name for a date string (e.g., "Monday").
 */
export function getIstDayName(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d, 0, 0, 0));
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    timeZone: "Asia/Kolkata",
  });
}
