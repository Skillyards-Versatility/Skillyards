import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { Edit2, Trash2, Reply, SmilePlus } from "lucide-react";
import { ReactionPicker } from "./ReactionPicker";

const ROLE_BADGES = {
  ADMIN: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  MANAGER: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  HR: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
  DEVELOPER: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  SALES: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
};

const getRoleBadge = (role) => {
  if (!role) return null;
  const style = ROLE_BADGES[role] || "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
  return (
    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${style} uppercase tracking-wider`}>
      {role}
    </span>
  );
};

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
  const [showMobileActions, setShowMobileActions] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const smileButtonRef = useRef(null);

  const handleToggleReactions = () => {
    if (smileButtonRef.current) {
      const rect = smileButtonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUpward(spaceBelow < 370);
    }
    setShowReactions((prev) => !prev);
  };

  useEffect(() => {
    if (!showMobileActions) return;
    const handleClose = () => setShowMobileActions(false);
    const timer = setTimeout(() => {
      document.addEventListener("click", handleClose);
    }, 10);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClose);
    };
  }, [showMobileActions]);

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
    <div className={`group relative flex gap-3 px-4 py-2 hover:bg-muted/30 transition-all duration-200 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div className="shrink-0 mt-0.5">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary border border-primary/20 overflow-hidden relative shadow-xs">
          {sender?.profileImageKey ? (
            <img
              src={`/api/files/${sender.profileImageKey}`}
              alt={sender?.name}
              className="w-full h-full object-cover"
            />
          ) : (
            sender?.name?.charAt(0)?.toUpperCase() || "?"
          )}
        </div>
      </div>

      {/* Bubble Content */}
      <div className={`flex flex-col max-w-[75%] ${isOwn ? "items-end" : "items-start"}`}>
        {/* Name and Time Header */}
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-xs font-bold text-foreground/90">
            {isOwn ? "You" : (sender?.name || "Unknown")}
          </span>
          {sender?.role && getRoleBadge(sender.role)}
          <span className="text-[10px] text-muted-foreground/60">{time}</span>
        </div>

        {/* Message bubble card */}
        <div
          onClick={(e) => {
            if (!editing) {
              e.stopPropagation();
              setShowMobileActions(!showMobileActions);
            }
          }}
          className={`px-4 py-2.5 rounded-2xl border transition-all shadow-2xs cursor-pointer select-none ${
            isOwn
              ? "bg-primary/10 border-primary/25 text-foreground rounded-tr-xs"
              : "bg-card border-border/85 text-foreground rounded-tl-xs"
          }`}
        >
          {editing ? (
            <div className="flex flex-col gap-2 min-w-[200px]">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSaveEdit();
                  }
                  if (e.key === "Escape") setEditing(false);
                }}
                className="w-full px-2.5 py-1.5 text-sm border border-border rounded-lg bg-background focus:ring-1 focus:ring-primary focus:outline-none resize-none min-h-[50px]"
                rows={2}
                autoFocus
              />
              <div className="flex justify-end gap-1.5">
                <button
                  onClick={() => setEditing(false)}
                  className="px-2.5 py-1 text-[11px] font-semibold text-muted-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>
          ) : message.deletedAt ? (
            <p className="text-sm italic text-muted-foreground/75">
              This message was deleted.
            </p>
          ) : (
            <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {message.content}
              {isEdited && (
                <span className="text-[10px] text-muted-foreground/50 ml-1.5 select-none">(edited)</span>
              )}
            </div>
          )}
        </div>

        {/* Reactions List */}
        {!message.deletedAt && groupedReactions.length > 0 && (
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {groupedReactions.map((r) => {
              const hasReacted = r.users.includes(message._currentUserId);
              return (
                <button
                  key={r.emoji}
                  onClick={() => {
                    if (hasReacted) onRemoveReaction?.(message.id, r.emoji);
                    else onReact?.(message.id, r.emoji);
                  }}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs cursor-pointer transition-all border shadow-2xs hover:scale-105 active:scale-95 ${
                    hasReacted
                      ? "bg-primary/10 text-primary border-primary/30 font-semibold"
                      : "bg-muted/65 text-muted-foreground border-transparent hover:bg-muted"
                  }`}
                >
                  <span className="text-sm select-none">{r.emoji}</span>
                  <span className="font-bold select-none text-[10px]">{r.count}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Thread replies footer */}
        {!message.deletedAt && showThread && replyCount > 0 && (
          <div className="mt-2">
            <button
              onClick={() => showThread(message)}
              className="text-xs text-primary font-semibold hover:underline cursor-pointer flex items-center gap-1.5 bg-primary/5 hover:bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/10 transition-colors"
            >
              <Reply className="w-3.5 h-3.5" />
              <span>
                {replyCount} {replyCount === 1 ? "reply" : "replies"}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Hover Toolbar Actions */}
      {!message.deletedAt && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute ${showMobileActions ? "flex" : "hidden group-hover:flex"} items-center gap-1 bg-card/95 backdrop-blur-md border border-border/80 rounded-xl shadow-md px-1.5 py-1 -bottom-4.5 z-25 transition-all duration-200 animate-in fade-in zoom-in-95 ${isOwn ? "right-14" : "left-14"}`}>
          <button
            onClick={() => onReply?.(message)}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Reply in thread"
          >
            <Reply className="w-3.5 h-3.5" />
          </button>
          <div className="relative">
            <button
              ref={smileButtonRef}
              onClick={(e) => {
                e.stopPropagation();
                handleToggleReactions();
              }}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Add reaction"
            >
              <SmilePlus className="w-3.5 h-3.5" />
            </button>
            {showReactions && (
              <ReactionPicker
                openUpward={openUpward}
                onSelect={(emoji) => {
                  if (emoji) onReact?.(message.id, emoji);
                  setShowReactions(false);
                }}
                onClose={() => setShowReactions(false)}
                className={isOwn ? "right-0" : "left-0"}
              />
            )}
          </div>
          {isOwn && (
            <>
              <button
                onClick={() => setEditing(true)}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title="Edit message"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete?.(message.id)}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                title="Delete message"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
