const IST_TIMEZONE = "Asia/Kolkata";

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

export function isIstSunday(now = new Date()) {
  const dayName = now.toLocaleDateString("en-US", {
    timeZone: IST_TIMEZONE,
    weekday: "long",
  });
  return dayName === "Sunday";
}

export function isIstBeforeCutoff(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: IST_TIMEZONE,
    hour12: false,
    hour: "numeric",
    minute: "numeric",
  }).formatToParts(now);
  
  const hourPart = parts.find((p) => p.type === "hour");
  const minutePart = parts.find((p) => p.type === "minute");
  
  const hour = parseInt(hourPart ? hourPart.value : "0", 10);
  const minute = parseInt(minutePart ? minutePart.value : "0", 10);
  
  if (hour < 18) return true;
  if (hour === 18 && minute < 30) return true;
  return false;
}
