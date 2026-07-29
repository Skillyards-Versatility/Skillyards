"use client";

import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";

export function MessageList({
  messages,
  currentUserId,
  onEdit,
  onDelete,
  onReply,
  onReact,
  onRemoveReaction,
  showThread,
  loading,
}) {
  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading messages...</p>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          No messages yet. Start the conversation!
        </p>
      </div>
    );
  }

  const replyCounts = {};
  messages.forEach((m) => {
    if (m.parentId) {
      replyCounts[m.parentId] = (replyCounts[m.parentId] || 0) + 1;
    }
  });

  const topLevel = messages.filter((m) => !m.parentId);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto py-2 space-y-1"
    >
      {topLevel.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={{ ...msg, _currentUserId: currentUserId }}
          isOwn={msg.senderId === currentUserId}
          onEdit={onEdit}
          onDelete={onDelete}
          onReply={onReply}
          onReact={onReact}
          onRemoveReaction={onRemoveReaction}
          showThread={showThread}
          replyCount={replyCounts[msg.id] || 0}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
