"use client";

import { useState, useRef, useEffect } from "react";

const COMMON_EMOJIS = [
  "👍", "👎", "😄", "🎉", "🙏", "❤️", "😂", "🔥",
  "✅", "❌", "⭐", "👀", "🤔", "🚀", "💯", "👏",
];

export function ReactionPicker({ onSelect, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        // parent controls visibility
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={ref}
      className={`absolute top-full mt-1 z-50 p-2 bg-popover border border-border rounded-lg shadow-lg grid grid-cols-4 gap-1 w-max ${className}`}
    >
      {COMMON_EMOJIS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => onSelect(emoji)}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-accent text-lg transition-colors cursor-pointer"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
