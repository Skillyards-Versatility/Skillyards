import { Redis } from "@upstash/redis";

/**
 * SKILLYARDS DISTRIBUTED RATE LIMITER
 *
 * Multi-layer, configurable per route:
 *   burst  - fixed window (short)
 *   hourly - fixed calendar-hour window
 *   daily  - fixed calendar-day window
 *
 * Backends:
 *   - Upstash Redis when UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are set.
 *   - In-memory fallback (dev / single instance) otherwise.
 *
 * Fail policy: if Redis is unavailable we fail OPEN (allow the request) but log a
 * warning so an outage never takes the site down. Rate limiting is a protection,
 * not an availability dependency.
 */

const inMemory = global.__rateLimiterStore || new Map();
if (process.env.NODE_ENV !== "production") global.__rateLimiterStore = inMemory;

const IN_MEMORY_MAX_KEYS = 10000;

let redisClient = null;
let redisResolved = false;

export function getRedisClient() {
  if (redisResolved) return redisClient;
  redisResolved = true;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    redisClient = null;
    return null;
  }

  try {
    redisClient = new Redis({ url, token });
  } catch (err) {
    console.error("[RATE_LIMITER] Failed to initialize Upstash Redis:", err.message);
    redisClient = null;
  }
  return redisClient;
}

function purgeInMemory(now) {
  if (inMemory.size <= IN_MEMORY_MAX_KEYS) return;
  for (const [k, v] of inMemory) {
    if (v.expiresAt < now) inMemory.delete(k);
  }
}

function yyyymmdd(date) {
  return date.toISOString().slice(0, 10).replace(/-/g, "");
}

function yyyymmddHH(date) {
  return `${yyyymmdd(date)}${String(date.getUTCHours()).padStart(2, "0")}`;
}

/**
 * @param {Object} options
 * @param {string} options.prefix      route-specific namespace (e.g. "test-register")
 * @param {string} options.identity    ip for public routes, userId[:resourceId] for authed
 * @param {{limit:number,windowMs:number}} [options.burst]
 * @param {{limit:number}} [options.hourly]
 * @param {{limit:number}} [options.daily]
 * @returns {Promise<{limited:boolean,retryAfterMs?:number}>}
 */
export async function checkRateLimit({ prefix, identity, burst, hourly, daily }) {
  const now = new Date();
  const layers = [];

  if (burst && burst.limit > 0) {
    const bucket = Math.floor(now.getTime() / burst.windowMs);
    layers.push({
      key: `rl:${prefix}:${identity}:b:${bucket}`,
      limit: burst.limit,
      ttlSeconds: Math.max(1, Math.ceil(burst.windowMs / 1000)),
      retryAfterMs: burst.windowMs - (now.getTime() % burst.windowMs),
    });
  }

  if (hourly && hourly.limit > 0) {
    layers.push({
      key: `rl:${prefix}:${identity}:h:${yyyymmddHH(now)}`,
      limit: hourly.limit,
      ttlSeconds: 7200,
      retryAfterMs: 3600000 - (now.getTime() % 3600000),
    });
  }

  if (daily && daily.limit > 0) {
    layers.push({
      key: `rl:${prefix}:${identity}:d:${yyyymmdd(now)}`,
      limit: daily.limit,
      ttlSeconds: 172800,
      retryAfterMs: 86400000 - (now.getTime() % 86400000),
    });
  }

  if (layers.length === 0) return { limited: false };

  const redis = getRedisClient();
  if (redis) {
    return checkWithRedis(redis, layers);
  }

  return checkWithMemory(layers, now.getTime());
}

async function checkWithRedis(redis, layers) {
  for (const layer of layers) {
    let count;
    try {
      count = await redis.incr(layer.key);
      if (count === 1) {
        await redis.expire(layer.key, layer.ttlSeconds);
      }
    } catch (err) {
      console.error("[RATE_LIMITER] Redis check failed — failing open:", err.message);
      return { limited: false };
    }

    if (count > layer.limit) {
      return { limited: true, retryAfterMs: layer.retryAfterMs };
    }
  }
  return { limited: false };
}

function checkWithMemory(layers, now) {
  purgeInMemory(now);

  for (const layer of layers) {
    const entry = inMemory.get(layer.key);

    if (entry && entry.expiresAt > now) {
      if (entry.count >= layer.limit) {
        return { limited: true, retryAfterMs: entry.expiresAt - now };
      }
      entry.count += 1;
    } else {
      inMemory.set(layer.key, {
        count: 1,
        expiresAt: now + layer.ttlSeconds * 1000,
      });
    }
  }
  return { limited: false };
}

// ── DEFAULT POLICY (preserves previous behaviour: burst-only, 10 req / 15s) ──
export const DEFAULT_RATE_LIMIT = {
  prefix: "api",
  burst: { limit: 10, windowMs: 15000 },
  hourly: null,
  daily: null,
};
