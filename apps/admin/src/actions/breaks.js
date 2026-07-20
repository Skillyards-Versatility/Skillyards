"use server";

import { db, breaks, users } from "@repo/db";
import { eq, and, sql, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { getIstDate } from "@/lib/ist";

const MAX_BREAK_SECONDS = 900; // 15 minutes
const PRIVILEGED_ROLES = ["ADMIN", "HR", "MANAGER"];

function isPrivilegedRole(role) {
  return PRIVILEGED_ROLES.includes(role);
}

export async function startBreak() {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Not authenticated" };
  }

  const userId = session.userId;
  const date = getIstDate();

  try {
    const [existing] = await db
      .select()
      .from(breaks)
      .where(and(eq(breaks.userId, userId), eq(breaks.date, date), sql`${breaks.endedAt} IS NULL`))
      .limit(1);

    if (existing) {
      return { success: false, error: "You already have an active break. End it before starting a new one." };
    }

    const [record] = await db
      .insert(breaks)
      .values({ userId, date })
      .returning();

    return { success: true, break: record };
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
    const durationSec = Math.min(
      Math.floor((now.getTime() - new Date(record.startedAt).getTime()) / 1000),
      MAX_BREAK_SECONDS
    );

    const [updated] = await db
      .update(breaks)
      .set({ endedAt: now, duration: durationSec })
      .where(eq(breaks.id, breakId))
      .returning();

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
        breakCount: sql<number>`count(*)::int`,
        totalDuration: sql<number`coalesce(sum(${breaks.duration}), 0)::int`,
        avgDuration: sql<number>`coalesce(avg(${breaks.duration}), 0)::int`,
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
