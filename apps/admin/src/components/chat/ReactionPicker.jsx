"use client";

import { useRef, useEffect } from "react";
import EmojiPicker, { Theme, EmojiStyle } from "emoji-picker-react";
import { useTheme } from "next-themes";

export function ReactionPicker({ onSelect, className = "" }) {
  const ref = useRef(null);
  const { resolvedTheme } = useTheme();

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
      className={`absolute top-full mt-2 right-0 z-50 shadow-xl rounded-lg animate-in fade-in zoom-in-95 duration-200 ${className}`}
    >
      <EmojiPicker
        theme={resolvedTheme === "dark" ? Theme.DARK : Theme.LIGHT}
        emojiStyle={EmojiStyle.APPLE}
        onEmojiClick={(emojiData) => onSelect(emojiData.emoji)}
        lazyLoadEmojis={true}
        searchDisabled={false}
        skinTonesDisabled={true}
        height={350}
        width={300}
      />
    </div>
  );
}
