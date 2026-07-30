"use client";

import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import EmojiPicker, { Theme, EmojiStyle } from "emoji-picker-react";
import { useTheme } from "next-themes";

export function ReactionPicker({ onSelect, onClose, openUpward, className = "" }) {
  const ref = useRef(null);
  const { resolvedTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose?.();
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [onClose]);

  if (!mounted) return null;

  if (isMobile) {
    return createPortal(
      <>
        <div
          onClick={(e) => {
            e.stopPropagation();
            onClose?.();
          }}
          className="fixed inset-0 bg-background/30 backdrop-blur-xs z-[90]"
        />
        <div
          ref={ref}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] w-[300px] shadow-xl rounded-lg animate-in fade-in zoom-in-95 duration-200"
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
      </>,
      document.body
    );
  }

  return (
    <div
      ref={ref}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      className={`absolute ${openUpward ? "bottom-full mb-2" : "top-full mt-2"} ${className} z-50 shadow-xl rounded-lg animate-in fade-in zoom-in-95 duration-200`}
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
