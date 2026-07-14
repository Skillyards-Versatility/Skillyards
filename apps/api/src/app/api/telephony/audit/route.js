import { db } from "@repo/db";
import { followUps } from "@repo/db";
import { eq } from "drizzle-orm";
import { createProtectedRoute } from "@/lib/middleware";

async function postHandler(req, { ctx }) {
  try {
    const { followUpId, recordingUrl } = await req.json();

    if (!followUpId || !recordingUrl) {
      return Response.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // 1. Update database status to pending (clear errorLog too)
    await db
      .update(followUps)
      .set({ aiStatus: "pending" })
      .where(eq(followUps.id, followUpId));

    // 2. Dispatch to AI service
    const aiServiceUrl = process.env.AI_SERVICE_URL || "http://localhost:3005";
    
    // Non-blocking trigger to local AI microservice
    fetch(`${aiServiceUrl}/api/audit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ followUpId, recordingUrl }),
    }).catch((err) =>
      console.error("Manual AI service dispatcher connection failed:", err)
    );

    return Response.json({ success: true, message: "Audit triggered successfully" });
  } catch (error) {
    console.error("Manual audit trigger route error:", error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export const POST = createProtectedRoute(postHandler, {
  isPublic: true,
  policy: () => ({ authorized: true }),
});
