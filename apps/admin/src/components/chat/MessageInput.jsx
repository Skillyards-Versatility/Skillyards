"use client";

import { useState, useRef } from "react";
import { Send, Paperclip, X } from "lucide-react";

export function MessageInput({ onSend, placeholder = "Type a message...", disabled, replyTarget, onCancelReply }) {
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  const handleSubmit = () => {
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText("");
    setTimeout(() => inputRef.current?.focus(), 10);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="px-4 py-4 border-t border-border/70 bg-card/45 backdrop-blur-md shrink-0 flex flex-col gap-2">
      {/* Reply target preview (WhatsApp style) */}
      {replyTarget && (
        <div className="flex items-center justify-between bg-muted/65 border-l-4 border-primary rounded-r-lg px-3 py-2 text-xs animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex flex-col min-w-0 pr-2">
            <span className="font-bold text-primary mb-0.5 truncate">
              Replying to {replyTarget.sender?.name || "User"}
            </span>
            <span className="text-muted-foreground truncate max-w-full">
              {replyTarget.content}
            </span>
          </div>
          <button
            onClick={onCancelReply}
            className="p-1 rounded-full hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
            title="Cancel reply"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      <div className="flex items-end gap-2.5 bg-background border border-border/80 rounded-xl px-3 py-2.5 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/10 transition-all duration-200 shadow-2xs">
        <button
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer shrink-0"
          title="Attach file"
          disabled={disabled}
        >
          <Paperclip className="w-4 h-4" />
        </button>
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={disabled}
          className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground/60 resize-none max-h-32 disabled:opacity-50 pr-2 pt-0.5 leading-relaxed"
          style={{ minHeight: "22px" }}
        />
        <button
          onClick={handleSubmit}
          disabled={!text.trim() || disabled}
          className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 hover:scale-[1.03] active:scale-[0.97] disabled:opacity-35 disabled:scale-100 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0 flex items-center justify-center shadow-xs"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
