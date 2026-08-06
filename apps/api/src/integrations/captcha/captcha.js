const ALLOWED_HOSTNAMES = (process.env.RECAPTCHA_ALLOWED_HOSTNAMES || "")
  .split(",")
  .map((h) => h.trim())
  .filter(Boolean);

export async function verifyCaptcha(token, { action, minScore = 0.5 } = {}) {
  if (process.env.NODE_ENV === "development") {
    return true;
  }

  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret) {
    console.error("[CAPTCHA] RECAPTCHA_SECRET_KEY is not configured");
    return false;
  }

  if (!token) return false;

  const body = new URLSearchParams({ secret, response: token });

  const response = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body
    }
  );

  const data = await response.json();

  if (!data.success) return false;
  if (action && data.action !== action) return false;
  if (ALLOWED_HOSTNAMES.length > 0 && !ALLOWED_HOSTNAMES.includes(data.hostname)) {
    return false;
  }
  if (typeof data.score === "number" && data.score < minScore) return false;

  return true;
}
