let cache = { data: null, windowKey: null };

function getCurrentWindowKey() {
  const now = new Date();
  const h = now.getHours();
  const day = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  if (h < 9) return null;
  if (h < 14) return `${day}-9`;
  if (h < 17) return `${day}-14`;
  return `${day}-17`;
}

export function shouldFetch() {
  const key = getCurrentWindowKey();
  if (key === null) return cache.data === null;
  return key !== cache.windowKey;
}

export function getCachedEnquiries() {
  return cache.data;
}

export function setCachedEnquiries(data) {
  const key = getCurrentWindowKey();
  cache = { data, windowKey: key };
}
