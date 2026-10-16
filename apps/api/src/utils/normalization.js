/**
 * Contact normalization utilities for CRM
 */

export function normalizePhone(rawPhone) {
  if (!rawPhone || typeof rawPhone !== "string") return null;
  // Strip all non-digit characters except leading plus
  const cleaned = rawPhone.trim().replace(/[^\d+]/g, "");
  if (!cleaned) return null;

  // Indian numbers: if 10 digits without code, prefix +91
  const digitsOnly = cleaned.replace(/\D/g, "");
  if (digitsOnly.length === 10) {
    return `+91${digitsOnly}`;
  }
  if (cleaned.startsWith("+")) {
    return cleaned;
  }
  return `+${digitsOnly}`;
}

export function normalizeEmail(rawEmail) {
  if (!rawEmail || typeof rawEmail !== "string") return null;
  const trimmed = rawEmail.trim().toLowerCase();
  if (!trimmed || !trimmed.includes("@")) return null;
  return trimmed;
}
