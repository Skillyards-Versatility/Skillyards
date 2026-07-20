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
