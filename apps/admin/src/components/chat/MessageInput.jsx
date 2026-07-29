"use client";

import { useState, useRef } from "react";
import { Send, Paperclip } from "lucide-react";

export function MessageInput({ onSend, placeholder = "Type a message...", disabled }) {
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  const handleSubmit = () => {
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="px-4 py-3 border-t border-border bg-background shrink-0">
      <div className="flex items-end gap-2 bg-muted/50 rounded-lg px-3 py-2 border border-input focus-within:border-primary/50 transition-colors">
        <button
          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer shrink-0"
          title="Attach file"
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
          className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground resize-none max-h-32 disabled:opacity-50"
          style={{ minHeight: "20px" }}
        />
        <button
          onClick={handleSubmit}
          disabled={!text.trim() || disabled}
          className="p-1.5 rounded bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
