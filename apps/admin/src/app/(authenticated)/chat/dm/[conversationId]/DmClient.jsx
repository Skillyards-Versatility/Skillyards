"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ChatLayout, useChatLayout } from "@/components/chat/ChatLayout";
import { ChannelList } from "@/components/chat/ChannelList";
import { MessageList } from "@/components/chat/MessageList";
import { MessageInput } from "@/components/chat/MessageInput";
import { ThreadPanel } from "@/components/chat/ThreadPanel";
import { ChannelCreateDialog } from "@/components/chat/ChannelCreateDialog";
import { NewDmDialog } from "@/components/chat/NewDmDialog";
import { UserPresenceBadge } from "@/components/chat/UserPresenceBadge";
import { ChevronLeft } from "lucide-react";
import { chatCache } from "@/components/chat/chatCache";

function DmHeader({ conversation, currentUser }) {
  const otherParticipant = conversation?.participants?.filter(p => p.id !== currentUser.id)?.[0];

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border/80 bg-card/45 backdrop-blur-md shrink-0 z-10">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Back Button */}
        <Link
          href="/chat"
          className="p-1.5 -ml-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 md:hidden transition-colors flex items-center gap-0.5"
          title="Back to channels"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-xs font-semibold pr-1">Channels</span>
        </Link>

        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary border border-primary/20">
              {otherParticipant?.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            {otherParticipant && (
              <UserPresenceBadge
                userId={otherParticipant.id}
                className="absolute -bottom-0.5 -right-0.5 ring-2 ring-background w-2.5 h-2.5"
              />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-foreground text-sm sm:text-base leading-tight truncate">
              {conversation?.name || otherParticipant?.name || "Direct Message"}
            </span>
            {otherParticipant?.role && (
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider leading-none mt-0.5">
                {otherParticipant.role}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DmClient({ conversation, currentUser, initialMessages }) {
  const [messages, setMessages] = useState(initialMessages || []);
  const [myChannels, setMyChannels] = useState(chatCache.channels || []);
  const [conversations, setConversations] = useState(chatCache.conversations || []);
  const [threadParent, setThreadParent] = useState(null);
  const [threadReplies, setThreadReplies] = useState([]);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showNewDm, setShowNewDm] = useState(false);
  const [replyTarget, setReplyTarget] = useState(null);
  const sseRef = useRef(null);

  useEffect(() => {
    setMessages(initialMessages || []);
  }, [conversation?.id, initialMessages]);

  const threadParentIdRef = useRef(null);
  
  useEffect(() => {
    threadParentIdRef.current = threadParent?.id || null;
  }, [threadParent]);

  useEffect(() => {
    if (!conversation?.id) return;

    const es = new EventSource(`/api/conversations/${conversation.id}/events`, { withCredentials: true });
    sseRef.current = es;

    es.addEventListener("new_message", (e) => {
      const msg = JSON.parse(e.data);
      setMessages((prev) => [...prev, msg]);
      
      if (msg.parentId && msg.parentId === threadParentIdRef.current) {
        setThreadReplies((prev) => [...prev, msg]);
      }
    });

    es.addEventListener("message_updated", (e) => {
      const { id, content, editedAt } = JSON.parse(e.data);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, content, editedAt } : m))
      );
    });

    es.addEventListener("message_deleted", (e) => {
      const { messageId } = JSON.parse(e.data);
      const now = new Date().toISOString();
      setMessages((prev) => prev.map((m) => m.id === messageId ? { ...m, deletedAt: now } : m));
      setThreadReplies((prev) => prev.map((m) => m.id === messageId ? { ...m, deletedAt: now } : m));
      setThreadParent((prev) => prev?.id === messageId ? { ...prev, deletedAt: now } : prev);
    });

    es.addEventListener("reaction_added", (e) => {
      const reaction = JSON.parse(e.data);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === reaction.messageId
            ? { ...m, reactions: [...(m.reactions || []), reaction] }
            : m
        )
      );
    });

    es.addEventListener("reaction_removed", (e) => {
      const { messageId, userId, emoji } = JSON.parse(e.data);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, reactions: (m.reactions || []).filter((r) => !(r.userId === userId && r.emoji === emoji)) }
            : m
        )
      );
    });

    return () => {
      es.close();
      sseRef.current = null;
    };
  }, [conversation?.id]);

  useEffect(() => {
    fetchChannels();
    fetchConversations();
  }, []);

  const fetchChannels = async () => {
    try {
      const res = await fetch("/api/channels");
      if (res.ok) {
        const data = await res.json();
        chatCache.channels = data;
        setMyChannels(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/conversations");
      if (res.ok) {
        const data = await res.json();
        chatCache.conversations = data;
        setConversations(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = useCallback(
    async (text) => {
      if (replyTarget) {
        const targetId = replyTarget.id;
        setReplyTarget(null);
        try {
          const res = await fetch("/api/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              content: text,
              conversationId: conversation?.id,
              parentId: targetId,
              type: "text",
            }),
          });
          if (res.ok) {
            const msg = await res.json();
            if (threadParent && targetId === threadParent.id) {
              setThreadReplies((prev) => [...prev, msg]);
            }
            setMessages((prev) => [...prev, msg]);
          }
        } catch (err) {
          console.error("Failed to send reply:", err);
        }
        return;
      }

      // Optimistic update
      const tempId = `temp-${Date.now()}`;
      const tempMsg = {
        id: tempId,
        content: text,
        sender: { id: currentUser.id, name: currentUser.name },
        senderId: currentUser.id,
        createdAt: new Date().toISOString(),
        reactions: [],
      };
      setMessages((prev) => [...prev, tempMsg]);

      try {
        const res = await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: text, conversationId: conversation?.id, type: "text" }),
        });
        if (!res.ok) {
          setMessages((prev) => prev.filter((m) => m.id !== tempId));
        }
      } catch (err) {
        console.error("Failed to send:", err);
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
      }
    },
    [conversation?.id, currentUser, replyTarget, threadParent]
  );

  const handleEdit = useCallback(async (messageId, content) => {
    const now = new Date().toISOString();
    setMessages((prev) => prev.map((m) => m.id === messageId ? { ...m, content, editedAt: now } : m));
    setThreadReplies((prev) => prev.map((m) => m.id === messageId ? { ...m, content, editedAt: now } : m));
    setThreadParent((prev) => prev?.id === messageId ? { ...prev, content, editedAt: now } : prev);
    try {
      await fetch(`/api/messages/${messageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
    } catch (err) {
      console.error("Failed to edit:", err);
    }
  }, []);

  const handleDelete = useCallback(async (messageId) => {
    const now = new Date().toISOString();
    setMessages((prev) => prev.map((m) => m.id === messageId ? { ...m, deletedAt: now } : m));
    setThreadReplies((prev) => prev.map((m) => m.id === messageId ? { ...m, deletedAt: now } : m));
    setThreadParent((prev) => prev?.id === messageId ? { ...prev, deletedAt: now } : prev);
    try {
      await fetch(`/api/messages/${messageId}`, { method: "DELETE" });
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  }, []);

  const handleReact = useCallback(async (messageId, emoji) => {
    const newReaction = { messageId, emoji, userId: currentUser.id };
    const applyReaction = (m) => m.id === messageId ? { ...m, reactions: [...(m.reactions || []), newReaction] } : m;
    
    setMessages((prev) => prev.map(applyReaction));
    setThreadReplies((prev) => prev.map(applyReaction));
    setThreadParent((prev) => prev ? applyReaction(prev) : prev);

    try {
      await fetch(`/api/messages/${messageId}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emoji }),
      });
    } catch (err) {
      console.error("Failed to add reaction:", err);
    }
  }, [currentUser]);

  const handleRemoveReaction = useCallback(async (messageId, emoji) => {
    const removeReaction = (m) => m.id === messageId ? { ...m, reactions: (m.reactions || []).filter((r) => !(r.userId === currentUser.id && r.emoji === emoji)) } : m;
    
    setMessages((prev) => prev.map(removeReaction));
    setThreadReplies((prev) => prev.map(removeReaction));
    setThreadParent((prev) => prev ? removeReaction(prev) : prev);

    try {
      await fetch(`/api/messages/${messageId}/reactions`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emoji }),
      });
    } catch (err) {
      console.error("Failed to remove reaction:", err);
    }
  }, [currentUser]);

  const handleReply = useCallback(async (message) => {
    setThreadParent(message);
    setThreadReplies([]);
    try {
      const res = await fetch(`/api/messages/${message.id}/replies`);
      if (res.ok) {
        const data = await res.json();
        setThreadReplies(data);
      }
    } catch (err) {
      console.error("Failed to fetch replies:", err);
    }
  }, []);

  const handleSendReply = useCallback(
    async (text) => {
      if (!threadParent) return;
      try {
        const res = await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: text,
            conversationId: conversation?.id,
            parentId: threadParent.id,
            type: "text",
          }),
        });
        if (res.ok) {
          const msg = await res.json();
          setThreadReplies((prev) => [...prev, msg]);
          setMessages((prev) => [...prev, msg]);
        }
      } catch (err) {
        console.error("Failed to send reply:", err);
      }
    },
    [threadParent, conversation?.id]
  );

  return (
    <>
      <ChatLayout
        sidebar={
          <ChannelList
            channels={myChannels}
            conversations={conversations}
            onNewChannel={() => setShowCreateChannel(true)}
            onNewDm={() => setShowNewDm(true)}
          />
        }
        threadPanel={
          threadParent && (
            <ThreadPanel
              parentMessage={threadParent}
              replies={threadReplies}
              currentUserId={currentUser.id}
              onClose={() => setThreadParent(null)}
              onSendReply={handleSendReply}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onReact={handleReact}
              onRemoveReaction={handleRemoveReaction}
            />
          )
        }
      >
        <DmHeader conversation={conversation} currentUser={currentUser} />
        <MessageList
          messages={messages}
          currentUserId={currentUser.id}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReply={setReplyTarget}
          onReact={handleReact}
          onRemoveReaction={handleRemoveReaction}
          showThread={handleReply}
        />
        <MessageInput
          onSend={handleSend}
          replyTarget={replyTarget}
          onCancelReply={() => setReplyTarget(null)}
        />
      </ChatLayout>


      <ChannelCreateDialog
        open={showCreateChannel}
        onClose={() => setShowCreateChannel(false)}
        onCreate={async (data) => {
          const res = await fetch("/api/channels", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          if (res.ok) {
            const channel = await res.json();
            window.location.href = `/chat/${channel.id}`;
          }
        }}
      />
      <NewDmDialog
        open={showNewDm}
        onClose={() => setShowNewDm(false)}
        users={[]} // We can pass allUsers here if we fetch it, but the dialog might fetch it
        onStart={async (otherUserId) => {
          const res = await fetch("/api/conversations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "direct", participantIds: [otherUserId] }),
          });
          if (res.ok) {
            const conv = await res.json();
            window.location.href = `/chat/dm/${conv.id}`;
          }
        }}
      />
    </>
  );
}
