const PLACEHOLDER_URLS = new Set([
  "https://linkedin.com",
  "https://linkedin.com/",
  "https://www.linkedin.com",
  "https://www.linkedin.com/",
]);

export function isValidLinkedInUrl(url) {
  if (typeof url !== "string") return false;
  const raw = url.trim();
  if (!raw) return false;
  if (PLACEHOLDER_URLS.has(raw)) return false;

  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    return false;
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;

  const host = parsed.hostname.toLowerCase();
  if (host !== "linkedin.com" && host !== "www.linkedin.com") return false;

  const path = (parsed.pathname || "").trim();
  if (!path || path === "/") return false;

  // Reject generic landing paths that are commonly used as placeholders.
  const lowered = path.toLowerCase();
  if (
    lowered === "/feed/" ||
    lowered === "/feed" ||
    lowered === "/company/" ||
    lowered === "/company" ||
    lowered === "/in/" ||
    lowered === "/in"
  ) {
    return false;
  }

  return true;
}
