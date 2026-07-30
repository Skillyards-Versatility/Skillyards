"use client";

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
    <div className="flex flex-col h-full w-full bg-transparent">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/80 bg-card/45 backdrop-blur-md shrink-0">
        <div className="flex flex-col">
          <h3 className="text-sm font-bold text-foreground">Thread</h3>
          <span className="text-[10px] text-muted-foreground/75">Conversation replies</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer"
          title="Close thread"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto py-4 flex flex-col scrollbar-thin">
        {/* Parent Message */}
        <div className="bg-primary/5 dark:bg-primary/[0.02] px-1 py-1 rounded-xl mx-2 border border-primary/10">
          <MessageBubble
            message={{ ...parentMessage, _currentUserId: currentUserId }}
            isOwn={parentMessage.senderId === currentUserId}
            onEdit={onEdit}
            onDelete={onDelete}
            onReact={onReact}
            onRemoveReaction={onRemoveReaction}
          />
        </div>

        {/* Separator / Divider */}
        <div className="flex items-center gap-3 my-4 px-4 select-none">
          <div className="h-px bg-border/85 flex-1" />
          <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest leading-none">
            Replies
          </span>
          <div className="h-px bg-border/85 flex-1" />
        </div>

        {/* Replies List */}
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
          {replies.length === 0 && (
            <div className="text-center py-6">
              <p className="text-xs text-muted-foreground/60 italic">No replies yet. Start the thread!</p>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <MessageInput
        onSend={(text) => onSendReply(text)}
        placeholder="Reply in thread..."
      />
    </div>
  );
}
