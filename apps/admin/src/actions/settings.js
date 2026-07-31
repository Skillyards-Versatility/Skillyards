"use server";

import { db, settings } from "@repo/db";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getSettings() {
  try {
    const session = await getSession();
    if (!session) return {};

    const allSettings = await db.select().from(settings);
    return allSettings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return {};
  }
}

export async function updateSetting(key, value) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return { error: "Unauthorized. Admin access required." };
    }

    // Check if the setting already exists
    const existing = await db
      .select()
      .from(settings)
      .where(eq(settings.key, key))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(settings)
        .set({ value, updatedAt: new Date() })
        .where(eq(settings.key, key));
    } else {
      await db.insert(settings).values({ key, value });
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to update setting:", error);
    return { error: "Failed to update setting" };
  }
}
