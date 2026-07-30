"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, Hash } from "lucide-react";
import { getMessages, sendMessage, markAsRead } from "@/actions/chat";

function formatMessageTime(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatMessageDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now - d;
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function shouldShowDateSeparator(currentMsg, previousMsg) {
  if (!previousMsg) return true;
  const curr = new Date(currentMsg.createdAt);
  const prev = new Date(previousMsg.createdAt);
  return (
    curr.getDate() !== prev.getDate() ||
    curr.getMonth() !== prev.getMonth() ||
    curr.getFullYear() !== prev.getFullYear()
  );
}

export function ChatThreadClient({
  conversationId,
  userId,
  convInfo,
  initialMessages,
}) {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const isChannel = convInfo?.type === "channel";
  const headerTitle = isChannel ? `# ${convInfo?.name || "channel"}` : (convInfo?.otherUserName || "Unknown");
  const headerSubtitle = isChannel ? null : convInfo?.otherUserRole;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    markAsRead(conversationId);
  }, [conversationId]);

  const fetchMessages = useCallback(async () => {
    const latestMsg = messages[messages.length - 1];
    const since = latestMsg?.createdAt
      ? new Date(latestMsg.createdAt).getTime()
      : undefined;
    const newMsgs = await getMessages(conversationId, since);
    if (newMsgs.length > 0) {
      setMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const unique = newMsgs.filter((m) => !existingIds.has(m.id));
        if (unique.length === 0) return prev;
        return [...prev, ...unique];
      });
      markAsRead(conversationId);
    }
  }, [conversationId, messages]);

  useEffect(() => {
    const interval = setInterval(fetchMessages, 30000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") fetchMessages();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [fetchMessages]);

  useEffect(() => {
    const handleFocus = () => fetchMessages();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchMessages]);

  const handleSend = async () => {
    const content = newMessage.trim();
    if (!content || sending) return;

    setSending(true);
    setNewMessage("");

    const result = await sendMessage(conversationId, content);
    setSending(false);

    if (result.success) {
      setMessages((prev) => [
        ...prev,
        {
          id: result.message.id,
          content: result.message.content,
          createdAt: result.message.createdAt,
          senderId: userId,
          senderName: "You",
        },
      ]);
    } else {
      setNewMessage(content);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700 shrink-0">
        <button
          onClick={() => router.push("/chat")}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        {isChannel ? (
          <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
            <Hash className="w-4 h-4 text-blue-500" />
          </div>
        ) : (
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-semibold text-primary">
              {convInfo?.otherUserName?.charAt(0)?.toUpperCase() || "?"}
            </span>
          </div>
        )}
        <div>
          <p className="font-semibold text-sm">{headerTitle}</p>
          {headerSubtitle && (
            <p className="text-xs text-gray-500">{headerSubtitle}</p>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {messages.map((msg, idx) => {
          const isMine = msg.senderId === userId;
          const showDateSep = shouldShowDateSeparator(msg, messages[idx - 1]);
          const showSenderName = isChannel && !isMine;

          return (
            <div key={msg.id}>
              {showDateSep && (
                <div className="flex justify-center my-3">
                  <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                    {formatMessageDate(msg.createdAt)}
                  </span>
                </div>
              )}
              {showSenderName && (
                <p className="text-[11px] font-medium text-gray-500 mt-2 mb-0.5 ml-1">
                  {msg.senderName}
                </p>
              )}
              <div
                className={`flex ${isMine ? "justify-end" : "justify-start"} mb-1`}
              >
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    isMine
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  <p
                    className={`text-[10px] mt-1 ${
                      isMine
                        ? "text-primary-foreground/60"
                        : "text-gray-400"
                    }`}
                  >
                    {formatMessageTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 shrink-0">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            placeholder={isChannel ? `Message #${convInfo?.name || "channel"}` : "Type a message..."}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
            className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
