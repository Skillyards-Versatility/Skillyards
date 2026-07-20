const IST_OFFSET = 5.5 * 60 * 60 * 1000;

export function getIstDate(now = new Date()) {
  const ist = new Date(now.getTime() + IST_OFFSET);
  const y = ist.getUTCFullYear();
  const m = String(ist.getUTCMonth() + 1).padStart(2, "0");
  const d = String(ist.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function isIstSunday(now = new Date()) {
  const ist = new Date(now.getTime() + IST_OFFSET);
  return ist.getUTCDay() === 0;
}
