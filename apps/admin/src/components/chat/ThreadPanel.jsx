"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";

export function ThreadPanel({
  parentMessage,
  replies,
  currentUserId,
  onClose,
  onSendReply,
  onEdit,
  onDelete,
  onReact,
  onRemoveReaction,
}) {
  if (!parentMessage) return null;

  return (
    <div className="w-80 lg:w-96 border-l border-border bg-background flex flex-col shrink-0">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold">Thread</h3>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-2">
        <MessageBubble
          message={{ ...parentMessage, _currentUserId: currentUserId }}
          isOwn={parentMessage.senderId === currentUserId}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        <div className="border-t border-border my-2 mx-4" />
        {replies.length > 0 && (
          <div className="px-4 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Replies
          </div>
        )}
        <div className="flex flex-col gap-2">
          {replies.map((reply) => (
            <MessageBubble
              key={reply.id}
              message={{ ...reply, _currentUserId: currentUserId }}
              isOwn={reply.senderId === currentUserId}
              onEdit={onEdit}
              onDelete={onDelete}
              onReact={onReact}
              onRemoveReaction={onRemoveReaction}
            />
          ))}
        </div>
      </div>

      <MessageInput
        onSend={(text) => onSendReply(text)}
        placeholder="Reply in thread..."
      />
    </div>
  );
}
