"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChatLayout } from "@/components/chat/ChatLayout";
import { ChannelList } from "@/components/chat/ChannelList";
import { ChannelHeader } from "@/components/chat/ChannelHeader";
import { MessageList } from "@/components/chat/MessageList";
import { MessageInput } from "@/components/chat/MessageInput";
import { ThreadPanel } from "@/components/chat/ThreadPanel";
import { ChannelCreateDialog } from "@/components/chat/ChannelCreateDialog";
import { NewDmDialog } from "@/components/chat/NewDmDialog";

export function ChatClient({
  channel,
  currentUser,
  initialMessages,
  allUsers,
  isMember,
  memberCount,
}) {
  const [messages, setMessages] = useState(initialMessages || []);
  const [channels, setChannels] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [threadParent, setThreadParent] = useState(null);
  const [threadReplies, setThreadReplies] = useState([]);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showNewDm, setShowNewDm] = useState(false);
  const [myChannels, setMyChannels] = useState(channel ? [channel] : []);
  const sseRef = useRef(null);
  const onlineUsersRef = useRef(new Set());
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    setMessages(initialMessages || []);
  }, [channel?.id, initialMessages]);

  const threadParentIdRef = useRef(null);
  
  useEffect(() => {
    threadParentIdRef.current = threadParent?.id || null;
  }, [threadParent]);

  useEffect(() => {
    if (!channel?.id) return;

    const es = new EventSource(`/api/channels/${channel.id}/events`, { withCredentials: true });
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

    es.onerror = () => {
      // EventSource auto-reconnects
    };

    return () => {
      es.close();
      sseRef.current = null;
    };
  }, [channel?.id]);

  useEffect(() => {
    fetchChannels();
    fetchConversations();
  }, []);

  const fetchChannels = async () => {
    try {
      const res = await fetch("/api/channels");
      if (res.ok) {
        const data = await res.json();
        setChannels(data);
        setMyChannels(data);
      }
    } catch (err) {
      console.error("Failed to fetch channels:", err);
    }
  };

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
    }
  };

  const handleSend = useCallback(
    async (text) => {
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
          body: JSON.stringify({ content: text, channelId: channel?.id, type: "text" }),
        });
        if (!res.ok) {
          const err = await res.json();
          console.error("Failed to send:", err);
          setMessages((prev) => prev.filter((m) => m.id !== tempId));
        }
      } catch (err) {
        console.error("Failed to send:", err);
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
      }
    },
    [channel?.id, currentUser]
  );

  const handleEdit = useCallback(
    async (messageId, content) => {
      // Optimistic update
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
    },
    []
  );

  const handleDelete = useCallback(
    async (messageId) => {
      // Optimistic update
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      setThreadReplies((prev) => prev.filter((m) => m.id !== messageId));
      setThreadParent((prev) => prev?.id === messageId ? null : prev);
      try {
        await fetch(`/api/messages/${messageId}`, { method: "DELETE" });
      } catch (err) {
        console.error("Failed to delete:", err);
      }
    },
    []
  );

  const handleReact = useCallback(
    async (messageId, emoji) => {
      // Optimistic update
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
    },
    [currentUser]
  );

  const handleRemoveReaction = useCallback(
    async (messageId, emoji) => {
      // Optimistic update
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
    },
    [currentUser]
  );

  const handleReply = useCallback(
    async (message) => {
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
    },
    []
  );

  const handleSendReply = useCallback(
    async (text) => {
      if (!threadParent) return;
      try {
        const res = await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: text,
            channelId: channel?.id,
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
    [threadParent, channel?.id]
  );

  const handleCreateChannel = async (data) => {
    const res = await fetch("/api/channels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || err.error || "Failed to create channel");
    }
    const channelRes = await res.json();
    window.location.href = `/chat/${channelRes.id}`;
  };

  const handleStartDm = async (otherUserId) => {
    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "direct", participantIds: [otherUserId] }),
    });
    if (!res.ok) throw new Error("Failed to create conversation");
    const conv = await res.json();
    window.location.href = `/chat/dm/${conv.id}`;
  };

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
        <ChannelHeader channel={channel} memberCount={memberCount} />
        <MessageList
          messages={messages}
          currentUserId={currentUser.id}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReply={handleReply}
          onReact={handleReact}
          onRemoveReaction={handleRemoveReaction}
          showThread={(msg) => handleReply(msg)}
        />
        <MessageInput onSend={handleSend} />
      </ChatLayout>


      <ChannelCreateDialog
        open={showCreateChannel}
        onClose={() => setShowCreateChannel(false)}
        onCreate={handleCreateChannel}
      />

      <NewDmDialog
        open={showNewDm}
        onClose={() => setShowNewDm(false)}
        users={allUsers}
        onStart={handleStartDm}
      />
    </>
  );
}
