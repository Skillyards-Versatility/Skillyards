import { db, breaks, users } from "@repo/db";
import { eq, or } from "drizzle-orm";
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
    const { breakId, userId, maxSeconds, triggerType } = body;

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
    const [user] = await db
      .select({ id: users.id, name: users.name, pushSubscription: users.pushSubscription })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user && user.pushSubscription) {
      let titleText = "Stop Break ASAP!";
      let bodyText = "Your break ends in 1 minute! Please stop your break and return to work ASAP.";

      if (triggerType === "9min") {
        titleText = "9-Minute Break Warning";
        bodyText = "You have been on break for 9 minutes. Reaching 15 minutes will count as 2 breaks! Please return soon.";
      } else if (triggerType === "14min") {
        titleText = "14-Minute Break Warning";
        bodyText = "You have been on break for 14 minutes. If you exceed 15 minutes, it will count as 2 breaks! Return to work now.";
      } else if (triggerType === "final") {
        titleText = "Break Limit Reached!";
        bodyText = maxSeconds && maxSeconds <= 60
          ? `Your break limit of ${maxSeconds}s has been reached! Please stop your break and return to work ASAP.`
          : "Your break time limit has run out! Please return to work immediately.";
      } else {
        if (maxSeconds && maxSeconds <= 60) {
          bodyText = `Your break limit of ${maxSeconds}s has been reached! Please stop your break and return to work ASAP.`;
        }
      }

      try {
        await webPush.sendNotification(
          user.pushSubscription,
          JSON.stringify({
            title: titleText,
            body: bodyText,
            url: "/breaks",
          })
        );
      } catch (pushErr) {
        console.error("Failed to send push notification:", pushErr);
        if (pushErr.statusCode === 410) {
          try {
            await db.update(users).set({ pushSubscription: null }).where(eq(users.id, userId));
            console.log(`Cleaned up stale push subscription for user ${userId}`);
          } catch (cleanupErr) {
            console.error("Failed to clean up push subscription:", cleanupErr);
          }
        }
      }
    }

    if (triggerType === "final") {
      try {
        const notifiers = await db
          .select({ id: users.id, name: users.name, pushSubscription: users.pushSubscription })
          .from(users)
          .where(or(eq(users.role, "HR"), eq(users.role, "ADMIN")));

        for (const n of notifiers) {
          if (!n.pushSubscription) continue; 
          try {
            await webPush.sendNotification(
              n.pushSubscription,
              JSON.stringify({
                title: "Break limit exceeded",
                body: `${user.name} has exceeded their break time slot. Check the Breaks page.`,
                url: "/breaks",
              })
            );
          } catch (pushErr) {
            console.error("Failed to notify HR/Admin about break limit:", pushErr);
            if (pushErr.statusCode === 410) {
              try {
                await db.update(users).set({ pushSubscription: null }).where(eq(users.id, n.id));
              } catch (cleanupErr) {
                console.error("Failed to clean up HR/Admin push subscription:", cleanupErr);
              }
            }
          }
        }
      } catch (dbErr) {
        console.error("Failed to fetch HR/Admin for break notification:", dbErr);
      }
    }

    return Response.json({ success: true, message: "Over-limit alert processed" });
  } catch (error) {
    console.error("Check-limit webhook error:", error);
    return Response.json({ success: false, message: "Internal error" }, { status: 500 });
  }
}
