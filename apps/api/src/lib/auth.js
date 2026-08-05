import { jwtVerify } from "jose";
import { randomUUID } from "node:crypto";

const secretKey = process.env.JWT_SECRET || "skillyards_secret_key_change_me_in_prod";
const encodedKey = new TextEncoder().encode(secretKey);

/**
 * Decrypts and validates a JWT token.
 */
export async function decrypt(token, requestId = "unknown") {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    const logData = {
      event: "AUTH_DECRYPT_FAILURE",
      requestId,
      error: error.code || error.message,
      timestamp: new Date().toISOString(),
    };
    
    if (error.code === 'ERR_JWT_EXPIRED') {
      console.warn("[AUTH] Token expired", logData);
    } else {
      console.error("[AUTH] Verification failed", logData);
    }
    
    return null;
  }
}

/**
 * Standardized Context Generator.
 * Extracts requestId, adds timings, and returns session.
 */
export async function getRequestContext(req) {
  const startTime = Date.now();
  const requestId = req.headers.get("x-request-id") || randomUUID();
  
  const ctx = {
    requestId,
    startTime,
    session: null,
    log: (msg, data = {}) => {
      console.log(`[${requestId}] ${msg}`, { 
        ...data, 
        latencyMs: Date.now() - startTime,
        timestamp: new Date().toISOString() 
      });
    },
    warn: (msg, data = {}) => {
      console.warn(`[${requestId}] ${msg}`, { 
        ...data, 
        latencyMs: Date.now() - startTime,
        timestamp: new Date().toISOString() 
      });
    },
    error: (msg, data = {}) => {
      console.error(`[${requestId}] ${msg}`, { 
        ...data, 
        latencyMs: Date.now() - startTime,
        timestamp: new Date().toISOString() 
      });
    }
  };

  const cookie = req.cookies?.get?.("session")?.value;
  if (cookie) {
    ctx.session = await decrypt(cookie, requestId);
  }

  return ctx;
}
