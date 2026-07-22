import { db, breaks, users } from "@repo/db";
import { eq } from "drizzle-orm";
import webPush from "web-push";

// Ensure web-push is configured with VAPID keys
if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webPush.setVapidDetails(
    "mailto:admin@skillyards.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

export async function POST(req) {
  try {
    // Basic verification of QStash (You could add Upstash receiver verification here for prod security)
    const body = await req.json();
    const { breakId, userId } = body;

    if (!breakId || !userId) {
      return Response.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Check if the break is still active
    const [breakRecord] = await db.select().from(breaks).where(eq(breaks.id, breakId)).limit(1);

    if (!breakRecord) {
      return Response.json({ success: true, message: "Break not found, ignoring" });
    }

    if (breakRecord.endedAt) {
      // User ended the break early, no notification needed!
      return Response.json({ success: true, message: "Break ended early, no alert sent" });
    }

    // The break is still active, and this endpoint is only hit if the delay expired.
    // That means the user has EXCEEDED their 30-minute daily allowance.
    // Fetch the user's push subscription
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);

    if (user && user.pushSubscription) {
      try {
        await webPush.sendNotification(
          user.pushSubscription,
          JSON.stringify({
            title: "Break Time Over!",
            body: "Your 10-minute break is over! Please return to work immediately.",
            url: "/breaks",
          })
        );
      } catch (pushErr) {
        console.error("Failed to send push notification:", pushErr);
        // If subscription is invalid (e.g. 410 Gone), we should probably delete it, but we'll ignore for now
      }
    }

    return Response.json({ success: true, message: "Over-limit alert processed" });
  } catch (error) {
    console.error("Check-limit webhook error:", error);
    return Response.json({ success: false, message: "Internal error" }, { status: 500 });
  }
}
