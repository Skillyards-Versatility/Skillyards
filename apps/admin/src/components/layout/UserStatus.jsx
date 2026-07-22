"use client";

import { useState } from "react";
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
    <div className="relative">
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
        <div className="absolute right-0 top-full mt-2 w-[300px] sm:w-[320px] bg-card border border-border rounded-xl shadow-2xl p-3 z-[100] animate-in fade-in slide-in-from-top-2 origin-top-right">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold">Set status</h4>
            <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="relative mb-4">
            <div className="flex items-center gap-2 p-1 rounded-lg border border-input bg-muted/30 focus-within:ring-1 focus-within:ring-ring focus-within:border-ring transition-all">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-background/80 hover:shadow-sm text-lg transition-all shrink-0"
              >
                {emoji || "😊"}
              </button>
              
              <input
                type="text"
                placeholder="What's your status?"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 bg-transparent border-none shadow-none focus:outline-none focus:ring-0 text-sm px-1 text-foreground placeholder:text-muted-foreground"
                maxLength={50}
              />
            </div>

            {showEmojiPicker && (
              <div className="absolute top-12 left-0 right-0 z-[100] shadow-2xl rounded-lg overflow-hidden border border-border animate-in fade-in zoom-in-95 duration-200 bg-card">
                <EmojiPicker
                  onEmojiClick={(emojiObject) => {
                    setEmoji(emojiObject.emoji);
                    setShowEmojiPicker(false);
                  }}
                  theme="auto"
                  width="100%"
                  height={350}
                />
              </div>
            )}
          </div>

          <div className="space-y-1 mb-4">
            {PRESETS.map((preset) => (
              <button
                key={preset.text}
                onClick={() => {
                  setEmoji(preset.emoji);
                  setText(preset.text);
                  handleSave(preset.emoji, preset.text);
                }}
                className="w-full flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-muted text-sm text-left transition-colors"
              >
                <span>{preset.emoji}</span>
                <span className="text-muted-foreground">{preset.text}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleSave(emoji, text)}
              disabled={isSaving || !text}
              className="flex-1 bg-primary text-primary-foreground h-8 rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleClear}
              className="px-3 bg-muted text-muted-foreground h-8 rounded-md text-sm font-medium hover:bg-muted/80 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
