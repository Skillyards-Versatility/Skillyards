import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.JWT_SECRET || "skillyards_secret_key_change_me_in_prod";
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session) {
  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.error("Failed to verify session:", error);
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function getRawToken() {
  const cookieStore = await cookies();
  return cookieStore.get("session")?.value;
}

export async function updateSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const res = await encrypt(parsed);

  cookieStore.set("session", res, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: parsed.expires,
    sameSite: "lax",
    path: "/",
    domain: process.env.NODE_ENV === "production" ? ".skillyards.in" : undefined,
  });
}

/**
 * Update the session cookie with new user data (name, profileImageKey).
 * Used after profile updates so the UI reflects changes without re-login.
 */
export async function updateSessionCookie(updates) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  Object.assign(parsed, updates, {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  const res = await encrypt(parsed);

  cookieStore.set("session", res, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: parsed.expires,
    sameSite: "lax",
    path: "/",
    domain: process.env.NODE_ENV === "production" ? ".skillyards.in" : undefined,
  });
}

/**
 * Standardized headers for server-to-api fetches.
 * Forwards the session cookie to satisfy createProtectedRoute requirements.
 */
export async function getAuthHeaders() {
  const token = await getRawToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { "Cookie": `session=${token}` } : {}),
  };
}
