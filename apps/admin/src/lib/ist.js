const IST_OFFSET = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30

/**
 * Get the current IST date as YYYY-MM-DD string.
 */
export function getIstDate(now = new Date()) {
  const ist = new Date(now.getTime() + IST_OFFSET);
  const y = ist.getUTCFullYear();
  const m = String(ist.getUTCMonth() + 1).padStart(2, "0");
  const d = String(ist.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Get current IST time components.
 */
export function getIstTime(now = new Date()) {
  const ist = new Date(now.getTime() + IST_OFFSET);
  return {
    hours: ist.getUTCHours(),
    minutes: IST_OFFSET / 60000 > 0 ? ist.getUTCMinutes() : ist.getUTCMinutes(),
    totalMinutes: ist.getUTCHours() * 60 + ist.getUTCMinutes(),
  };
}

/**
 * Check if current IST time is before the 6:30 PM cutoff.
 * Cutoff = 18:30 IST = 1110 minutes from midnight.
 */
export function isIstBeforeCutoff(now = new Date()) {
  const { totalMinutes } = getIstTime(now);
  return totalMinutes < 1110; // 18 * 60 + 30 = 1110
}

/**
 * Check if today is a Sunday in IST.
 */
export function isIstSunday(now = new Date()) {
  const ist = new Date(now.getTime() + IST_OFFSET);
  return ist.getUTCDay() === 0;
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
