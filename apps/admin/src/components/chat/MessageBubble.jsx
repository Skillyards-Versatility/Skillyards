"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Edit2, Trash2, Reply, SmilePlus } from "lucide-react";
import { UserPresenceBadge } from "./UserPresenceBadge";
import { ReactionPicker } from "./ReactionPicker";

export function MessageBubble({
  message,
  isOwn,
  onEdit,
  onDelete,
  onReply,
  onReact,
  onRemoveReaction,
  showThread,
  replyCount,
}) {
  const [showReactions, setShowReactions] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(message.content);

  const sender = message.sender;
  const isEdited = !!message.editedAt;
  const time = format(new Date(message.createdAt), "h:mm a");

  const reactions = message.reactions || [];
  const groupedReactions = reactions.reduce((acc, r) => {
    const existing = acc.find((g) => g.emoji === r.emoji);
    if (existing) {
      existing.count++;
      existing.users.push(r.userId);
    } else {
      acc.push({ emoji: r.emoji, count: 1, users: [r.userId] });
    }
    return acc;
  }, []);

  const handleSaveEdit = () => {
    if (editText.trim() && editText !== message.content) {
      onEdit(message.id, editText.trim());
    }
    setEditing(false);
  };

  return (
    <div className="group flex gap-3 px-4 py-1.5 hover:bg-accent/30 transition-colors">
      {!isOwn && (
        <div className="shrink-0 mt-0.5">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
            {sender?.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
        </div>
      )}
      <div className="flex-1 min-w-0">
        {!isOwn && (
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-semibold text-foreground">
              {sender?.name || "Unknown"}
            </span>
            <span className="text-xs text-muted-foreground">{time}</span>
          </div>
        )}
        {isOwn && (
          <div className="flex items-center justify-end gap-2 mb-0.5">
            <span className="text-xs text-muted-foreground">{time}</span>
          </div>
        )}

        {editing ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveEdit();
                if (e.key === "Escape") setEditing(false);
              }}
              className="flex-1 px-2 py-1 text-sm border border-input rounded bg-background"
              autoFocus
            />
            <button
              onClick={handleSaveEdit}
              className="text-xs text-primary hover:underline cursor-pointer"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="text-xs text-muted-foreground hover:underline cursor-pointer"
            >
              Cancel
            </button>
          </div>
        ) : (
          <p className={`text-sm text-foreground whitespace-pre-wrap break-words ${isOwn ? "text-right" : ""}`}>
            {message.content}
            {isEdited && (
              <span className="text-xs text-muted-foreground ml-1">(edited)</span>
            )}
          </p>
        )}

        {/* Reactions */}
        {groupedReactions.length > 0 && (
          <div className={`flex gap-1 mt-1 flex-wrap ${isOwn ? "justify-end" : ""}`}>
            {groupedReactions.map((r) => {
              const hasReacted = r.users.includes(message._currentUserId);
              return (
                <button
                  key={r.emoji}
                  onClick={() => {
                    if (hasReacted) onRemoveReaction?.(message.id, r.emoji);
                    else onReact?.(message.id, r.emoji);
                  }}
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs border cursor-pointer transition-colors ${
                    hasReacted
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-muted border-border hover:bg-accent"
                  }`}
                >
                  {r.emoji} <span>{r.count}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Actions */}
        <div className={`hidden group-hover:flex items-center gap-1 mt-0.5 ${isOwn ? "justify-end" : ""}`}>
          <button
            onClick={() => onReply?.(message)}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
            title="Reply"
          >
            <Reply className="w-3.5 h-3.5" />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowReactions(!showReactions)}
              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
              title="React"
            >
              <SmilePlus className="w-3.5 h-3.5" />
            </button>
            {showReactions && (
              <ReactionPicker
                onSelect={(emoji) => {
                  onReact?.(message.id, emoji);
                  setShowReactions(false);
                }}
                className={isOwn ? "right-0" : "left-0"}
              />
            )}
          </div>
          {isOwn && (
            <>
              <button
                onClick={() => setEditing(true)}
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete?.(message.id)}
                className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          {showThread && replyCount > 0 && (
            <button
              onClick={() => showThread(message)}
              className="text-xs text-primary hover:underline ml-2 cursor-pointer"
            >
              {replyCount} {replyCount === 1 ? "reply" : "replies"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
