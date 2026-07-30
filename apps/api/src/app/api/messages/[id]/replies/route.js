import { db, users } from "@repo/db";
import { inArray } from "drizzle-orm";
import { getThreadMessages } from "@/modules/chat/messages.service";
import { createProtectedRoute } from "@/lib/middleware";

async function getHandler(req, { context }) {
  const { id: parentId } = await context.params;
  
  try {
    const rawReplies = await getThreadMessages(db, parentId);
    
    if (rawReplies.length === 0) {
      return Response.json([]);
    }

    const senderIds = [...new Set(rawReplies.map((r) => r.senderId))];
    const senders = await db
      .select({ id: users.id, name: users.name })
      .from(users)
      .where(inArray(users.id, senderIds));
      
    const senderMap = Object.fromEntries(senders.map((s) => [s.id, s]));

    const replies = rawReplies.map(r => ({
      ...r,
      sender: senderMap[r.senderId] || { id: r.senderId, name: "Unknown" },
      createdAt: r.createdAt?.toISOString?.() || r.createdAt,
      editedAt: r.editedAt?.toISOString?.() || null,
      reactions: [] 
    }));

    return Response.json(replies);
  } catch (error) {
    console.error("Error fetching replies:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export const GET = createProtectedRoute(getHandler, {
  policy: (session) => ({
    authorized: !!session?.userId,
    reason: session?.userId ? "Authenticated" : "Login required",
  }),
});
