"use client";

import { useState, useEffect, useRef } from "react";
import { updateStatus } from "@/actions/status";
import { toast } from "sonner";
import { SmilePlus, X } from "lucide-react";
import EmojiPicker from 'emoji-picker-react';

const PRESETS = [
  { emoji: "💻", text: "Deep Work" },
  { emoji: "📞", text: "In a meeting" },
  { emoji: "🍔", text: "Lunch break" },
  { emoji: "🤒", text: "Sick" },
  { emoji: "🌴", text: "OOO" },
];

export function UserStatus({ initialEmoji, initialText }) {
  const [isOpen, setIsOpen] = useState(false);
  const [emoji, setEmoji] = useState(initialEmoji || "");
  const [text, setText] = useState(initialText || "");
  const [isSaving, setIsSaving] = useState(false);

  // Optimistic UI state
  const [currentEmoji, setCurrentEmoji] = useState(initialEmoji);
  const [currentText, setCurrentText] = useState(initialText);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowEmojiPicker(false);
      }
    }
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSave = async (selectedEmoji = emoji, selectedText = text) => {
    setIsSaving(true);
    setCurrentEmoji(selectedEmoji);
    setCurrentText(selectedText);
    
    try {
      const res = await updateStatus({ statusEmoji: selectedEmoji, statusText: selectedText });
      if (res.success) {
        setIsOpen(false);
        toast.success("Status updated");
      } else {
        toast.error("Failed to update status");
        // Revert optimistic update
        setCurrentEmoji(initialEmoji);
        setCurrentText(initialText);
      }
    } catch (err) {
      toast.error("An error occurred");
      setCurrentEmoji(initialEmoji);
      setCurrentText(initialText);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = () => {
    setEmoji("");
    setText("");
    handleSave("", "");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full hover:bg-muted/50 transition-colors text-sm font-medium border border-transparent hover:border-border"
        title="Update Status"
      >
        {currentEmoji ? (
          <>
            <span>{currentEmoji}</span>
            <span className="max-w-[100px] truncate text-xs text-muted-foreground hidden sm:inline-block">
              {currentText}
            </span>
          </>
        ) : (
          <SmilePlus className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[90] sm:hidden bg-background/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed left-4 right-4 top-20 sm:absolute sm:left-auto sm:right-0 sm:top-[calc(100%+0.5rem)] sm:w-[320px] bg-background/70 backdrop-blur-2xl border border-white/10 dark:border-white/5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-4 z-[100] animate-in fade-in zoom-in-95 slide-in-from-top-4 sm:origin-top-right duration-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold tracking-tight">Update Status</h4>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative mb-5">
              <div className="flex items-center gap-2 p-1.5 rounded-xl border border-border/50 bg-muted/20 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all shadow-inner">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-background/80 hover:shadow-sm text-xl transition-all shrink-0 bg-background/50 border border-border/50"
                >
                  {emoji || "😊"}
                </button>
                
                <input
                  type="text"
                  placeholder="What's your status?"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="flex-1 bg-transparent border-none shadow-none focus:outline-none focus:ring-0 text-sm px-2 text-foreground placeholder:text-muted-foreground font-medium"
                  maxLength={50}
                />
              </div>

              {showEmojiPicker && (
                <div className="absolute top-14 left-0 right-0 z-[100] shadow-2xl rounded-xl overflow-hidden border border-border/50 animate-in fade-in zoom-in-95 duration-200 bg-background/95 backdrop-blur-xl">
                  <EmojiPicker
                    onEmojiClick={(emojiObject) => {
                      setEmoji(emojiObject.emoji);
                      setShowEmojiPicker(false);
                    }}
                    theme="auto"
                    width="100%"
                    height={320}
                  />
                </div>
              )}
            </div>

            <div className="space-y-1 mb-5">
              {PRESETS.map((preset) => (
                <button
                  key={preset.text}
                  onClick={() => {
                    setEmoji(preset.emoji);
                    setText(preset.text);
                    handleSave(preset.emoji, preset.text);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/50 text-sm text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="text-lg">{preset.emoji}</span>
                  <span className="font-medium text-muted-foreground group-hover:text-foreground transition-colors">{preset.text}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleSave(emoji, text)}
                disabled={isSaving || !text}
                className="flex-1 bg-primary text-primary-foreground h-10 rounded-xl text-sm font-semibold shadow-sm hover:bg-primary/90 disabled:opacity-50 transition-all hover:shadow-md active:scale-[0.98]"
              >
                Save Status
              </button>
              <button
                onClick={handleClear}
                className="px-4 bg-muted/50 text-muted-foreground h-10 rounded-xl text-sm font-semibold hover:bg-muted hover:text-foreground transition-all active:scale-[0.98]"
              >
                Clear
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
