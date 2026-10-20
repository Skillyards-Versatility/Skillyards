import { db } from "@repo/db";
import { crmAuditEvents } from "@repo/db/schema";
import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm } from "@/modules/crm/crm.permissions";
import { success, error } from "@/utils/response";
import { runtimeThreads } from "../route";

/**
 * In-memory message store keyed by threadId (leadId)
 */
const THREAD_MESSAGES = {
  "lead-101": [
    {
      id: "msg-101-1",
      threadId: "lead-101",
      sender: "candidate",
      senderName: "Aarav Sharma",
      channel: "whatsapp",
      content: "Hi! I submitted an enquiry for the MERN Stack development course. Can someone help me with the syllabus?",
      timestamp: new Date(Date.now() - 1000 * 3600 * 5).toISOString(),
      status: "read",
    },
    {
      id: "msg-101-2",
      threadId: "lead-101",
      sender: "counsellor",
      senderName: "Priya Patel",
      channel: "whatsapp",
      content: "Hello Aarav! Welcome to Skillyards Versatility. Here is the official curriculum brochure: https://portal.skillyards.com/brochure/mern. It covers full-stack Node.js, React 19, Next.js, and cloud deployments.",
      timestamp: new Date(Date.now() - 1000 * 3600 * 4).toISOString(),
      status: "read",
    },
    {
      id: "msg-101-3",
      threadId: "lead-101",
      sender: "system",
      senderName: "Automated Cadence",
      channel: "system",
      content: "Cadence Step 2: 1-on-1 Academic Counselling invitation link dispatched.",
      timestamp: new Date(Date.now() - 1000 * 3600 * 2).toISOString(),
      status: "delivered",
    },
    {
      id: "msg-101-4",
      threadId: "lead-101",
      sender: "candidate",
      senderName: "Aarav Sharma",
      channel: "whatsapp",
      content: "Hi Priya, could you share the live project architecture for the MERN program?",
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      status: "delivered",
    },
  ],
  "lead-102": [
    {
      id: "msg-102-1",
      threadId: "lead-102",
      sender: "counsellor",
      senderName: "Amit Kumar",
      channel: "whatsapp",
      content: "Hi Sneha, looking forward to our Data Science & AI counselling session today at 5:00 PM. Here is the meeting room: https://meet.google.com/sky-ai-counsel",
      timestamp: new Date(Date.now() - 1000 * 3600 * 3).toISOString(),
      status: "read",
    },
    {
      id: "msg-102-2",
      threadId: "lead-102",
      sender: "candidate",
      senderName: "Sneha Mukherjee",
      channel: "whatsapp",
      content: "Thank you! I received the Google Meet link for today's session at 5 PM.",
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      status: "read",
    },
  ],
  "lead-103": [
    {
      id: "msg-103-1",
      threadId: "lead-103",
      sender: "counsellor",
      senderName: "Vikram Malhotra",
      channel: "whatsapp",
      content: "Hi Rohan! We noticed you evaluated the UI/UX Mastery cohort. Would you like to review our flexible payment options?",
      timestamp: new Date(Date.now() - 1000 * 3600 * 6).toISOString(),
      status: "read",
    },
    {
      id: "msg-103-2",
      threadId: "lead-103",
      sender: "candidate",
      senderName: "Rohan Varma",
      channel: "whatsapp",
      content: "Can you provide more details regarding the 0% EMI financing plan?",
      timestamp: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
      status: "delivered",
    },
  ],
};

/**
 * GET /api/crm/inbox/[id]
 * Returns message history for a specific conversation thread
 */
async function getThreadMessagesHandler(req, { ctx, params }) {
  try {
    const threadId = params.id;
    const messages = THREAD_MESSAGES[threadId] || [
      {
        id: `msg-${threadId}-init`,
        threadId,
        sender: "system",
        senderName: "System",
        channel: "system",
        content: "Conversation thread initialized.",
        timestamp: new Date().toISOString(),
        status: "delivered",
      },
    ];

    // Mark unread as read in runtime thread
    const thread = runtimeThreads.find((t) => t.id === threadId);
    if (thread) {
      thread.unreadCount = 0;
    }

    return Response.json(
      success(
        {
          threadId,
          thread: thread || { id: threadId, candidateName: "Prospect" },
          messages,
        },
        "Thread messages fetched successfully"
      )
    );
  } catch (err) {
    ctx.error?.("CRM_GET_THREAD_MESSAGES_FAILED", { error: err.message });
    return Response.json(error(err.message || "Failed to load thread messages"), { status: 500 });
  }
}

/**
 * POST /api/crm/inbox/[id]
 * Dispatches an outgoing message to the student across WhatsApp, Email, or SMS
 */
async function sendThreadMessageHandler(req, { ctx, params }) {
  try {
    const threadId = params.id;
    const body = await req.json();
    const { content, channel = "whatsapp", templateId = null, candidatePhone, candidateName } = body;

    if (!content || !content.trim()) {
      return Response.json(error("Message content cannot be empty"), { status: 400 });
    }

    const newMessage = {
      id: `msg-${Date.now()}`,
      threadId,
      sender: "counsellor",
      senderName: ctx.user?.name || "Admissions Team",
      channel,
      content: content.trim(),
      templateId,
      timestamp: new Date().toISOString(),
      status: "sent",
    };

    if (!THREAD_MESSAGES[threadId]) {
      THREAD_MESSAGES[threadId] = [];
    }
    THREAD_MESSAGES[threadId].push(newMessage);

    // Update thread summary snippet
    const thread = runtimeThreads.find((t) => t.id === threadId);
    if (thread) {
      thread.lastMessage = content.slice(0, 100);
      thread.lastMessageSender = "counsellor";
      thread.lastMessageAt = newMessage.timestamp;
      thread.channel = channel;
    }

    // Write audit event
    try {
      await db.insert(crmAuditEvents).values({
        actorId: ctx.user?.id || null,
        actorName: ctx.user?.name || "Counsellor",
        action: "OUTREACH_SENT",
        entityType: "lead",
        entityId: threadId,
        reason: `Dispatched ${channel.toUpperCase()} message via Omnichannel Inbox: ${content.slice(0, 80)}...`,
        afterSnapshot: {
          leadId: threadId,
          channel,
          content,
          templateId,
          sentAt: newMessage.timestamp,
        },
      });
    } catch (_) {}

    return Response.json(
      success(
        {
          message: newMessage,
          thread,
        },
        "Message dispatched successfully"
      )
    );
  } catch (err) {
    ctx.error?.("CRM_SEND_MESSAGE_FAILED", { error: err.message });
    return Response.json(error(err.message || "Failed to dispatch message"), { status: 500 });
  }
}

export const GET = createProtectedRoute(getThreadMessagesHandler, { policy: canAccessCrm });
export const POST = createProtectedRoute(sendThreadMessageHandler, { policy: canAccessCrm });
export { THREAD_MESSAGES };
