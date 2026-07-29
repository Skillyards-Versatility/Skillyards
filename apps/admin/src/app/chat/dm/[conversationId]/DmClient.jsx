"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChatLayout } from "@/components/chat/ChatLayout";
import { ChannelList } from "@/components/chat/ChannelList";
import { MessageList } from "@/components/chat/MessageList";
import { MessageInput } from "@/components/chat/MessageInput";
import { ThreadPanel } from "@/components/chat/ThreadPanel";

export function DmClient({ conversation, currentUser, initialMessages }) {
  const [messages, setMessages] = useState(initialMessages || []);
  const [myChannels, setMyChannels] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [threadParent, setThreadParent] = useState(null);
  const [threadReplies, setThreadReplies] = useState([]);
  const sseRef = useRef(null);

  useEffect(() => {
    setMessages(initialMessages || []);
  }, [conversation?.id, initialMessages]);

  useEffect(() => {
    if (!conversation?.id) return;

    const es = new EventSource(`/api/conversations/${conversation.id}/events`);
    sseRef.current = es;

    es.addEventListener("new_message", (e) => {
      const msg = JSON.parse(e.data);
      setMessages((prev) => [...prev, msg]);
    });

    es.addEventListener("message_updated", (e) => {
      const { id, content, editedAt } = JSON.parse(e.data);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, content, editedAt } : m))
      );
    });

    es.addEventListener("message_deleted", (e) => {
      const { messageId } = JSON.parse(e.data);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
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
      if (res.ok) setMyChannels(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/conversations");
      if (res.ok) setConversations(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = useCallback(
    async (text) => {
      try {
        await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: text, conversationId: conversation?.id, type: "text" }),
        });
      } catch (err) {
        console.error("Failed to send:", err);
      }
    },
    [conversation?.id]
  );

  const handleEdit = useCallback(async (messageId, content) => {
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
    try {
      await fetch(`/api/messages/${messageId}`, { method: "DELETE" });
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  }, []);

  const handleReact = useCallback(async (messageId, emoji) => {
    try {
      await fetch(`/api/messages/${messageId}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emoji }),
      });
    } catch (err) {
      console.error("Failed to add reaction:", err);
    }
  }, []);

  const handleRemoveReaction = useCallback(async (messageId, emoji) => {
    try {
      await fetch(`/api/messages/${messageId}/reactions`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emoji }),
      });
    } catch (err) {
      console.error("Failed to remove reaction:", err);
    }
  }, []);

  const handleReply = useCallback((message) => {
    setThreadParent(message);
    setThreadReplies([]);
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
            onNewChannel={() => {}}
            onNewDm={() => {}}
          />
        }
      >
        <div className="px-4 py-3 border-b border-border bg-background shrink-0">
          <h2 className="font-semibold text-foreground">DM</h2>
        </div>
        <MessageList
          messages={messages}
          currentUserId={currentUser.id}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReply={handleReply}
          onReact={handleReact}
          onRemoveReaction={handleRemoveReaction}
        />
        <MessageInput onSend={handleSend} />
      </ChatLayout>

      {threadParent && (
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
      )}
    </>
  );
}
