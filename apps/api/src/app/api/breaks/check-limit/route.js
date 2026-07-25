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
    const { breakId, userId, maxSeconds } = body;

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

    // The break is still active, and this endpoint is hit when the warning delay expires.
    // Fetch the user's push subscription
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);

    if (user && user.pushSubscription) {
      let bodyText = "Your break ends in 1 minute! Please stop your break and return to work ASAP.";
      if (maxSeconds && maxSeconds <= 60) {
        bodyText = `Your break limit of ${maxSeconds}s has been reached! Please stop your break and return to work ASAP.`;
      }
      try {
        await webPush.sendNotification(
          user.pushSubscription,
          JSON.stringify({
            title: "Stop Break ASAP!",
            body: bodyText,
            url: "/breaks",
          })
        );
      } catch (pushErr) {
        console.error("Failed to send push notification:", pushErr);
      }
    }

    return Response.json({ success: true, message: "Over-limit alert processed" });
  } catch (error) {
    console.error("Check-limit webhook error:", error);
    return Response.json({ success: false, message: "Internal error" }, { status: 500 });
  }
}
