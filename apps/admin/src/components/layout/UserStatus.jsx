"use client";

import { useState } from "react";
import { updateStatus } from "@/actions/status";
import { toast } from "sonner";
import { SmilePlus, X } from "lucide-react";

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
        <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-xl shadow-lg p-3 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold">Set status</h4>
            <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Emoji"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              className="w-12 h-9 rounded-md border border-input bg-transparent px-2 text-center text-lg focus:outline-none focus:ring-1 focus:ring-ring"
              maxLength={2}
            />
            <input
              type="text"
              placeholder="What's your status?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 h-9 rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              maxLength={50}
            />
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
