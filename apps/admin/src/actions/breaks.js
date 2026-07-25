"use server";

import { db, breaks, users } from "@repo/db";
import { eq, and, sql, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { getIstDate, isIstWithinBreakHours } from "@/lib/ist";

const MAX_BREAK_SECONDS = 600; // 10 minutes per break
const MAX_BREAKS_PER_DAY = 3;
const MAX_DAILY_BREAK_SECONDS = 1800; // 30 minutes total daily
const PRIVILEGED_ROLES = ["ADMIN", "HR", "MANAGER"];

function isPrivilegedRole(role) {
  return PRIVILEGED_ROLES.includes(role);
}

export async function savePushSubscription(subscription) {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated" };

  try {
    await db.update(users)
      .set({ pushSubscription: subscription })
      .where(eq(users.id, session.userId));
    return { success: true };
  } catch (err) {
    console.error("Save push subscription error:", err);
    return { success: false, error: "Failed to save subscription" };
  }
}

import { Client } from "@upstash/qstash";

const qstashClient = new Client({
  token: process.env.QSTASH_TOKEN || "",
});

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function startBreak() {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Not authenticated" };
  }

  const userId = session.userId;
  const date = getIstDate();

  if (!isIstWithinBreakHours()) {
    return { success: false, error: "Breaks can only be taken between 11:00 AM and 6:30 PM." };
  }

  try {
    const [existing] = await db
      .select()
      .from(breaks)
      .where(and(eq(breaks.userId, userId), eq(breaks.date, date), sql`${breaks.endedAt} IS NULL`))
      .limit(1);

    if (existing) {
      return { success: false, error: "You already have an active break. End it before starting a new one." };
    }

    const [lastBreak] = await db
      .select()
      .from(breaks)
      .where(and(eq(breaks.userId, userId), eq(breaks.date, date), sql`${breaks.endedAt} IS NOT NULL`))
      .orderBy(desc(breaks.endedAt))
      .limit(1);

    if (lastBreak && lastBreak.duration > 60) {
      const nowMs = new Date().getTime();
      const endedMs = new Date(lastBreak.endedAt).getTime();
      const diffMs = nowMs - endedMs;
      const cooldownMs = 30 * 60 * 1000;

      if (diffMs < cooldownMs) {
        const remainingMin = Math.ceil((cooldownMs - diffMs) / 60000);
        return { success: false, error: `Cooldown active: Please wait ${remainingMin}m before taking another break.` };
      }
    }

    const [statsRow] = await db
      .select({
        totalDuration: sql`coalesce(sum(${breaks.duration}), 0)::int`,
        effectiveCount: sql`coalesce(sum(ceil(${breaks.duration}::float / 600.0)), 0)::int`,
      })
      .from(breaks)
      .where(and(eq(breaks.userId, userId), eq(breaks.date, date), sql`${breaks.endedAt} IS NOT NULL`));

    const totalDur = statsRow?.totalDuration || 0;
    const effectiveCount = statsRow?.effectiveCount || 0;

    const remainingDailySeconds = Math.max(0, MAX_DAILY_BREAK_SECONDS - totalDur);
    if (remainingDailySeconds <= 0) {
      return { success: false, error: "You have exhausted your daily 30-minute break limit." };
    }

    if (effectiveCount >= MAX_BREAKS_PER_DAY) {
      return { success: false, error: `You have already taken your maximum of ${MAX_BREAKS_PER_DAY} breaks for today.` };
    }

    const [record] = await db
      .insert(breaks)
      .values({ userId, date })
      .returning();

    const maxSecondsForThisBreak = Math.min(MAX_BREAK_SECONDS, remainingDailySeconds);
    const delaySeconds = maxSecondsForThisBreak > 60 ? maxSecondsForThisBreak - 60 : maxSecondsForThisBreak;

    // Schedule QStash Notification for delaySeconds in the future
    let scheduleId = null;
    if (process.env.QSTASH_TOKEN) {
      try {
        const res = await qstashClient.publishJSON({
          url: `${API_BASE}/api/breaks/check-limit`,
          body: { breakId: record.id, userId, maxSeconds: maxSecondsForThisBreak },
          delay: `${delaySeconds}s`,
        });
        scheduleId = res.messageId;
      } catch (err) {
        console.error("QStash schedule failed:", err);
      }
    }

    return { success: true, break: record, maxBreaks: MAX_BREAKS_PER_DAY, maxSeconds: maxSecondsForThisBreak };
  } catch (err) {
    console.error("Start break error:", err);
    return { success: false, error: "Failed to start break" };
  }
}

export async function endBreak(breakId) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const [record] = await db
      .select()
      .from(breaks)
      .where(and(eq(breaks.id, breakId), eq(breaks.userId, session.userId)))
      .limit(1);

    if (!record) {
      return { success: false, error: "Break not found" };
    }

    if (record.endedAt) {
      return { success: false, error: "Break already ended" };
    }

    const now = new Date();
    const durationSec = Math.floor((now.getTime() - new Date(record.startedAt).getTime()) / 1000);

    const [updated] = await db
      .update(breaks)
      .set({ endedAt: now, duration: durationSec })
      .where(eq(breaks.id, breakId))
      .returning();
      
    // QStash cancellation: We don't need to cancel! 
    // The webhook will fire, and our `/check-limit` route will see `endedAt !== null` and just exit quietly.

    return { success: true, break: updated };
  } catch (err) {
    console.error("End break error:", err);
    return { success: false, error: "Failed to end break" };
  }
}

export async function getActiveBreak() {
  const session = await getSession();
  if (!session) return null;

  const date = getIstDate();

  try {
    const [active] = await db
      .select()
      .from(breaks)
      .where(and(eq(breaks.userId, session.userId), eq(breaks.date, date), sql`${breaks.endedAt} IS NULL`))
      .limit(1);

    return active || null;
  } catch (err) {
    console.error("Get active break error:", err);
    return null;
  }
}

export async function getDailyBreakTotal() {
  const session = await getSession();
  if (!session) return { breakCount: 0, maxBreaks: MAX_BREAKS_PER_DAY, maxSeconds: MAX_BREAK_SECONDS, totalDuration: 0, totalOverage: 0, lastEndedAt: null, lastDuration: 0, remainingDailySeconds: MAX_DAILY_BREAK_SECONDS };

  const date = getIstDate();

  try {
    const [statsRow] = await db
      .select({
        count: sql`count(*)::int`,
        effectiveCount: sql`coalesce(sum(ceil(${breaks.duration}::float / 600.0)), 0)::int`,
        totalDur: sql`coalesce(sum(${breaks.duration}), 0)::int`,
        overage: sql`coalesce(sum(case when ${breaks.duration} > ${MAX_BREAK_SECONDS} then ${breaks.duration} - ${MAX_BREAK_SECONDS} else 0 end), 0)::int`,
        lastEndedAt: sql`max(${breaks.endedAt})`,
      })
      .from(breaks)
      .where(and(eq(breaks.userId, session.userId), eq(breaks.date, date), sql`${breaks.endedAt} IS NOT NULL`));

    // To prevent lockout from accidental breaks, we also need the duration of that last break.
    let lastDuration = 0;
    if (statsRow?.lastEndedAt) {
      const lastEndedDate = new Date(statsRow.lastEndedAt);
      const [lastB] = await db.select({ duration: breaks.duration }).from(breaks).where(and(eq(breaks.userId, session.userId), eq(breaks.endedAt, lastEndedDate))).limit(1);
      if (lastB) lastDuration = lastB.duration;
    }

    const [activeRow] = await db
      .select({ count: sql`count(*)::int` })
      .from(breaks)
      .where(and(eq(breaks.userId, session.userId), eq(breaks.date, date), sql`${breaks.endedAt} IS NULL`));

    const totalCount = (statsRow?.effectiveCount || 0) + (activeRow?.count || 0);
    const totalDuration = statsRow?.totalDur || 0;
    const remainingDailySeconds = Math.max(0, MAX_DAILY_BREAK_SECONDS - totalDuration);
    const maxSeconds = Math.min(MAX_BREAK_SECONDS, remainingDailySeconds);

    return { 
      breakCount: totalCount, 
      maxBreaks: MAX_BREAKS_PER_DAY, 
      maxSeconds: maxSeconds,
      totalDuration: totalDuration,
      totalOverage: statsRow?.overage || 0,
      lastEndedAt: statsRow?.lastEndedAt || null,
      lastDuration: lastDuration,
      remainingDailySeconds: remainingDailySeconds
    };
  } catch (err) {
    console.error("Get daily break total error:", err);
    return { breakCount: 0, maxBreaks: MAX_BREAKS_PER_DAY, maxSeconds: MAX_BREAK_SECONDS, totalDuration: 0, totalOverage: 0, lastEndedAt: null, lastDuration: 0, remainingDailySeconds: MAX_DAILY_BREAK_SECONDS };
  }
}

export async function getMyBreaks(date) {
  const session = await getSession();
  if (!session) return [];

  const targetDate = date || getIstDate();

  try {
    const records = await db
      .select()
      .from(breaks)
      .where(and(eq(breaks.userId, session.userId), eq(breaks.date, targetDate)))
      .orderBy(desc(breaks.startedAt));

    return records;
  } catch (err) {
    console.error("Get my breaks error:", err);
    return [];
  }
}

export async function getAllBreaks(date, userId) {
  const session = await getSession();
  if (!session) return [];

  const targetDate = date || getIstDate();
  const privileged = isPrivilegedRole(session.role);

  try {
    const conditions = [eq(breaks.date, targetDate)];

    if (privileged) {
      if (userId) conditions.push(eq(breaks.userId, userId));
    } else {
      conditions.push(eq(breaks.userId, session.userId));
    }

    const records = await db
      .select({
        id: breaks.id,
        userId: breaks.userId,
        startedAt: breaks.startedAt,
        endedAt: breaks.endedAt,
        duration: breaks.duration,
        date: breaks.date,
        userName: users.name,
        userRole: users.role,
        userTeam: users.team,
      })
      .from(breaks)
      .innerJoin(users, eq(breaks.userId, users.id))
      .where(and(...conditions))
      .orderBy(desc(breaks.startedAt));

    return records;
  } catch (err) {
    console.error("Get all breaks error:", err);
    return [];
  }
}

export async function getBreakStats(date) {
  const session = await getSession();
  if (!session) return null;

  const targetDate = date || getIstDate();
  const privileged = isPrivilegedRole(session.role);

  try {
    const conditions = [eq(breaks.date, targetDate), sql`${breaks.endedAt} IS NOT NULL`];

    if (!privileged) {
      conditions.push(eq(breaks.userId, session.userId));
    }

    const stats = await db
      .select({
        userId: breaks.userId,
        userName: users.name,
        userTeam: users.team,
        breakCount: sql`coalesce(sum(ceil(${breaks.duration}::float / 600.0)), 0)::int`,
        totalDuration: sql`coalesce(sum(${breaks.duration}), 0)::int`,
        avgDuration: sql`coalesce(avg(${breaks.duration}), 0)::int`,
      })
      .from(breaks)
      .innerJoin(users, eq(breaks.userId, users.id))
      .where(and(...conditions))
      .groupBy(breaks.userId, users.name, users.team)
      .orderBy(desc(sql`count(*)`));

    return stats;
  } catch (err) {
    console.error("Get break stats error:", err);
    return [];
  }
}
