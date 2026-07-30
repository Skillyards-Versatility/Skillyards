"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, Hash, Users, X, Check, Plus, Search, MessageSquare, Smile, Loader2, Paperclip, Image, FileText } from "lucide-react";
import { toast } from "sonner";
import EmojiPicker, { Theme } from "emoji-picker-react";
import {
  getMessages,
  sendMessage,
  markAsRead,
  getChannelMembers,
  addChannelMembers,
  addAllUsersToChannel,
  getThreadReplies,
  toggleReaction,
  editMessage,
  deleteMessage,
} from "@/actions/chat";
import { getUsers } from "@/actions/users";

function formatMessageTime(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatMessageDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  if (d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) return "Today";
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.getDate() === yesterday.getDate() && d.getMonth() === yesterday.getMonth() && d.getFullYear() === yesterday.getFullYear()) return "Yesterday";
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
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

const COMMON_EMOJIS = ["👍", "❤️", "😄", "😮", "😢", "😡"];

function EmojiPickerPanel({ onSelect, onClose }) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 md:absolute md:bottom-full md:mb-1 md:left-0 md:right-auto">
        <EmojiPicker
          onEmojiClick={(emojiData) => onSelect(emojiData.emoji)}
          lazyLoadEmojis
          height={400}
          width={350}
          reactions={COMMON_EMOJIS}
          reactionsDefaultOpen
          allowExpandReactions
          theme={document?.documentElement?.classList?.contains?.("dark") ? Theme.DARK : Theme.LIGHT}
        />
      </div>
    </>
  );
}

function ConfirmDialog({ title, message, confirmLabel, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-sm mx-4 p-6">
        <h3 className="text-sm font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-5">{message}</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
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
  const messagesContainerRef = useRef(null);
  const threadMessagesEndRef = useRef(null);

  const [showMembersPanel, setShowMembersPanel] = useState(false);
  const [members, setMembers] = useState([]);
  const [showAddPeople, setShowAddPeople] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState(new Set());
  const [memberSearch, setMemberSearch] = useState("");
  const [addingMembers, setAddingMembers] = useState(false);

  const [threadParent, setThreadParent] = useState(null);
  const [threadReplies, setThreadReplies] = useState([]);
  const [threadReplyText, setThreadReplyText] = useState("");
  const [sendingThreadReply, setSendingThreadReply] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(null);

  const [showConfirm, setShowConfirm] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [uploadingFile, setUploadingFile] = useState(false);
  const fileInputRef = useRef(null);

  const latestTimestampRef = useRef(
    initialMessages.length > 0
      ? new Date(initialMessages[initialMessages.length - 1].createdAt).getTime()
      : undefined
  );

  const isChannel = convInfo?.type === "channel";
  const headerTitle = isChannel ? `# ${convInfo?.name || "channel"}` : (convInfo?.otherUserName || "Unknown");
  const headerSubtitle = isChannel ? null : convInfo?.otherUserRole;
  const otherUserAvatar = convInfo?.otherUserProfileImageKey
    ? `/api/files/${convInfo.otherUserProfileImageKey}`
    : null;

  const isNearBottom = useCallback(() => {
    const el = messagesContainerRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 100;
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isNearBottom()) scrollToBottom();
  }, [messages, scrollToBottom, isNearBottom]);

  useEffect(() => {
    threadMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threadReplies]);

  useEffect(() => {
    markAsRead(conversationId);
  }, [conversationId]);

  useEffect(() => {
    if (isChannel) {
      getChannelMembers(conversationId).then(setMembers).catch(() => {});
    }
  }, [conversationId, isChannel]);

  const fetchMessages = useCallback(async () => {
    try {
      const since = latestTimestampRef.current;
      const newMsgs = await getMessages(conversationId, since);
      if (newMsgs.length > 0) {
        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const unique = newMsgs.filter((m) => !existingIds.has(m.id));
          const merged = prev.map((m) => {
            const found = newMsgs.find((u) => u.id === m.id);
            return found || m;
          });
          const result = unique.length > 0 ? [...merged, ...unique] : merged;
          if (result.length > 0) {
            latestTimestampRef.current = new Date(result[result.length - 1].createdAt).getTime();
          }
          return result;
        });
        markAsRead(conversationId);
      }
    } catch {
      toast.error("Failed to fetch messages");
    }
  }, [conversationId]);

  useEffect(() => {
    let eventSource = null;
    let reconnectTimeout = null;
    let retryDelay = 1000;
    const MAX_RETRY_DELAY = 30000;

    function connect() {
      eventSource = new EventSource(`/api/conversations/${conversationId}/events`);

      eventSource.addEventListener("connected", () => {
        setConnectionStatus("connected");
        retryDelay = 1000;
      });

      eventSource.addEventListener("new_message", (e) => {
        const raw = JSON.parse(e.data);
        const msg = {
          id: raw.id,
          content: raw.content,
          createdAt: raw.createdAt,
          senderId: raw.senderId,
          senderName: raw.sender?.name || "Unknown",
          senderProfileImageKey: raw.sender?.profileImageKey || null,
          parentId: raw.parentId,
          replyCount: 0,
          reactions: raw.reactions || [],
          fileKey: raw.fileKey || null,
          fileType: raw.fileType || null,
          fileName: raw.fileName || null,
        };
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
        markAsRead(conversationId);
      });

      eventSource.addEventListener("message_updated", (e) => {
        const { id, content, editedAt } = JSON.parse(e.data);
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, content, editedAt } : m))
        );
      });

      eventSource.addEventListener("message_deleted", (e) => {
        const { messageId } = JSON.parse(e.data);
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
      });

      eventSource.addEventListener("reaction_added", (e) => {
        const { messageId, userId: reactorId, emoji } = JSON.parse(e.data);
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id !== messageId) return m;
            const existing = (m.reactions || []).find((r) => r.emoji === emoji);
            if (existing) {
              return {
                ...m,
                reactions: m.reactions.map((r) =>
                  r.emoji === emoji
                    ? { ...r, count: r.count + 1, hasReacted: r.hasReacted || reactorId === userId }
                    : r
                ),
              };
            }
            return {
              ...m,
              reactions: [...(m.reactions || []), { emoji, count: 1, hasReacted: reactorId === userId }],
            };
          })
        );
      });

      eventSource.addEventListener("reaction_removed", (e) => {
        const { messageId, emoji } = JSON.parse(e.data);
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id !== messageId) return m;
            const existing = (m.reactions || []).find((r) => r.emoji === emoji);
            if (!existing) return m;
            if (existing.count <= 1) {
              return { ...m, reactions: m.reactions.filter((r) => r.emoji !== emoji) };
            }
            return {
              ...m,
              reactions: m.reactions.map((r) =>
                r.emoji === emoji ? { ...r, count: r.count - 1 } : r
              ),
            };
          })
        );
      });

      eventSource.addEventListener("heartbeat", () => {});

      eventSource.onerror = () => {
        eventSource.close();
        setConnectionStatus("reconnecting");
        reconnectTimeout = setTimeout(() => {
          retryDelay = Math.min(retryDelay * 2, MAX_RETRY_DELAY);
          connect();
        }, retryDelay);
      };
    }

    connect();

    return () => {
      if (eventSource) eventSource.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, [conversationId, userId]);

  let visTimeout = useRef(null);
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        clearTimeout(visTimeout.current);
        visTimeout.current = setTimeout(fetchMessages, 500);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      clearTimeout(visTimeout.current);
    };
  }, [fetchMessages]);

  let focusTimeout = useRef(null);
  useEffect(() => {
    const handleFocus = () => {
      clearTimeout(focusTimeout.current);
      focusTimeout.current = setTimeout(fetchMessages, 500);
    };
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
      clearTimeout(focusTimeout.current);
    };
  }, [fetchMessages]);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("conversationId", conversationId);

      const res = await fetch("/api/chat/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.message || "Upload failed");
        return;
      }

      const data = await res.json();
      const result = await sendMessage(conversationId, file.name || "File", null, {
        fileKey: data.fileKey,
        fileType: data.fileType,
        fileName: data.fileName,
      });

      if (result.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: result.message.id,
            content: result.message.content,
            createdAt: result.message.createdAt,
            senderId: userId,
            senderName: "You",
            senderProfileImageKey: null,
            parentId: null,
            replyCount: 0,
            reactions: [],
            fileKey: data.fileKey,
            fileType: data.fileType,
            fileName: data.fileName,
          },
        ]);
      } else {
        toast.error(result.error || "Failed to send");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSend = async () => {
    const content = newMessage.trim();
    if (!content || sending) return;

    setSending(true);
    setNewMessage("");

    try {
      const result = await sendMessage(conversationId, content);
      if (result.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: result.message.id,
            content: result.message.content,
            createdAt: result.message.createdAt,
            senderId: userId,
            senderName: "You",
            senderProfileImageKey: null,
            parentId: null,
            replyCount: 0,
            reactions: [],
          },
        ]);
      } else {
        setNewMessage(content);
        toast.error(result.error || "Failed to send");
      }
    } catch {
      setNewMessage(content);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleOpenThread = useCallback(async (msg) => {
    setThreadParent(msg);
    try {
      const replies = await getThreadReplies(msg.id);
      setThreadReplies(replies);
    } catch {
      toast.error("Failed to load thread");
    }
  }, []);

  const handleCloseThread = useCallback(() => {
    setThreadParent(null);
    setThreadReplies([]);
    setThreadReplyText("");
  }, []);

  const handleThreadSend = async () => {
    const content = threadReplyText.trim();
    if (!content || sendingThreadReply || !threadParent) return;

    setSendingThreadReply(true);
    setThreadReplyText("");

    try {
      const result = await sendMessage(conversationId, content, threadParent.id);
      if (result.success) {
        const newReply = {
          id: result.message.id,
          content: result.message.content,
          createdAt: result.message.createdAt,
          senderId: userId,
          senderName: "You",
          senderProfileImageKey: null,
          reactions: [],
        };
        setThreadReplies((prev) => [...prev, newReply]);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === threadParent.id
              ? { ...m, replyCount: (m.replyCount || 0) + 1 }
              : m
          )
        );
      } else {
        setThreadReplyText(content);
        toast.error(result.error || "Failed to send reply");
      }
    } catch {
      setThreadReplyText(content);
      toast.error("Failed to send reply");
    } finally {
      setSendingThreadReply(false);
    }
  };

  const handleToggleReaction = useCallback(async (messageId, emoji) => {
    try {
      const result = await toggleReaction(messageId, emoji);
      if (result.success && result.reactions) {
        const updateMsg = (msg) =>
          msg.id === messageId ? { ...msg, reactions: result.reactions } : msg;

        if (threadParent?.id === messageId) {
          setThreadParent((prev) => (prev ? { ...prev, reactions: result.reactions } : prev));
        }

        setThreadReplies((prev) => prev.map(updateMsg));
        setMessages((prev) => prev.map(updateMsg));
      }
    } catch {
      toast.error("Failed to toggle reaction");
    }
  }, [threadParent]);

  const handleStartEdit = useCallback((msg) => {
    setEditingMessageId(msg.id);
    setEditContent(msg.content);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingMessageId(null);
    setEditContent("");
  }, []);

  const handleSaveEdit = useCallback(async () => {
    const content = editContent.trim();
    if (!content || !editingMessageId) return;
    const result = await editMessage(editingMessageId, content);
    if (result.success) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === editingMessageId ? { ...m, content, editedAt: new Date().toISOString() } : m
        )
      );
      setEditingMessageId(null);
      setEditContent("");
    } else {
      toast.error(result.error || "Failed to edit message");
    }
  }, [editContent, editingMessageId]);

  const handleDeleteMessage = useCallback((messageId) => {
    setShowConfirm({
      title: "Delete message",
      message: "Are you sure you want to delete this message?",
      confirmLabel: "Delete",
      onConfirm: async () => {
        setShowConfirm(null);
        const result = await deleteMessage(messageId);
        if (result.success) {
          setMessages((prev) => prev.filter((m) => m.id !== messageId));
        } else {
          toast.error(result.error || "Failed to delete message");
        }
      },
    });
  }, []);

  const handleOpenMembers = useCallback(async () => {
    try {
      const data = await getChannelMembers(conversationId);
      setMembers(data);
      setShowMembersPanel(true);
    } catch {
      toast.error("Failed to load members");
    }
  }, [conversationId]);

  const handleOpenAddPeople = useCallback(async () => {
    try {
      const users = await getUsers();
      setAllUsers(users.filter((u) => !members.some((m) => m.userId === u.id)));
      setSelectedUserIds(new Set());
      setMemberSearch("");
      setShowAddPeople(true);
    } catch {
      toast.error("Failed to load users");
    }
  }, [members]);

  const handleToggleUser = (id) => {
    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAddSelected = async () => {
    if (selectedUserIds.size === 0) return;
    setAddingMembers(true);
    try {
      const result = await addChannelMembers(conversationId, [...selectedUserIds]);
      if (result.success) {
        if (result.added > 0) {
          toast.success(`${result.added} member${result.added > 1 ? "s" : ""} added`);
        } else {
          toast.info("Selected users are already members");
        }
        const updated = await getChannelMembers(conversationId);
        setMembers(updated);
        setShowAddPeople(false);
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Failed to add members");
    } finally {
      setAddingMembers(false);
    }
  };

  const handleAddEveryone = () => {
    const nonMembers = allUsers.length;
    setShowConfirm({
      title: "Add Everyone",
      message: `Add ${nonMembers} user${nonMembers !== 1 ? "s" : ""} to #${convInfo?.name}?`,
      confirmLabel: nonMembers > 0 ? `Add ${nonMembers}` : "OK",
      onConfirm: async () => {
        setShowConfirm(null);
        setAddingMembers(true);
        try {
          const result = await addAllUsersToChannel(conversationId);
          if (result.success) {
            if (result.added > 0) {
              toast.success(`${result.added} user${result.added > 1 ? "s" : ""} added to channel`);
            } else {
              toast.info("All users are already members");
            }
            const updated = await getChannelMembers(conversationId);
            setMembers(updated);
          } else {
            toast.error(result.error);
          }
        } catch {
          toast.error("Failed to add users");
        } finally {
          setAddingMembers(false);
        }
      },
    });
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
          <div className="w-9 h-9 rounded-full shrink-0 overflow-hidden bg-primary/10 flex items-center justify-center">
            {otherUserAvatar ? (
              <img src={otherUserAvatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-semibold text-primary">
                {convInfo?.otherUserName?.charAt(0)?.toUpperCase() || "?"}
              </span>
            )}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{headerTitle}</p>
          {headerSubtitle && (
            <p className="text-xs text-gray-500">{headerSubtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1" title={
            connectionStatus === "connected" ? "Connected" :
            connectionStatus === "reconnecting" ? "Reconnecting..." :
            "Connecting..."
          }>
            <span className={`w-2 h-2 rounded-full ${
              connectionStatus === "connected" ? "bg-green-500" :
              connectionStatus === "reconnecting" ? "bg-yellow-500 animate-pulse" :
              "bg-gray-400"
            }`} />
          </div>
          {isChannel && (
            <button
              onClick={handleOpenMembers}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              {members.length || "..."}
            </button>
          )}
        </div>
      </div>

      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {messages.map((msg, idx) => {
          const isMine = msg.senderId === userId;
          const showDateSep = shouldShowDateSeparator(msg, messages[idx - 1]);
          const prevMsg = messages[idx - 1];
          const sameSender = prevMsg && prevMsg.senderId === msg.senderId && !shouldShowDateSeparator(msg, prevMsg);
          const showHeader = !sameSender;

          const avatarUrl = msg.senderProfileImageKey
            ? `/api/files/${msg.senderProfileImageKey}`
            : null;

          return (
            <div key={msg.id} className="group">
              {showDateSep && (
                <div className="flex justify-center my-3">
                  <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                    {formatMessageDate(msg.createdAt)}
                  </span>
                </div>
              )}
              <div className={`flex gap-2 mb-1 ${isMine ? "justify-end" : "justify-start"}`}>
                {!isMine && (
                  <div className="flex flex-col items-end">
                    {showHeader ? (
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full shrink-0 overflow-hidden bg-primary/10 flex items-center justify-center">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] md:text-xs font-semibold text-primary">
                            {msg.senderName?.charAt(0)?.toUpperCase() || "?"}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="w-7 h-7 md:w-8 md:h-8 shrink-0" />
                    )}
                  </div>
                )}
                <div className={`max-w-[75%] flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                  {showHeader && (
                    <div className={`flex items-center gap-2 mb-0.5 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                      <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                        {isMine ? "You" : msg.senderName}
                      </p>
                      <p className="text-[9px] text-gray-400 dark:text-gray-500">{formatMessageTime(msg.createdAt)}</p>
                    </div>
                  )}
                  <div
                    className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      isMine
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-sm"
                    }`}
                  >
                    {editingMessageId === msg.id ? (
                      <div className="flex flex-col gap-2">
                        <input
                          type="text"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSaveEdit();
                            }
                            if (e.key === "Escape") handleCancelEdit();
                          }}
                          className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                          autoFocus
                        />
                        <div className="flex gap-1.5 justify-end">
                          <button
                            onClick={handleCancelEdit}
                            className="text-[10px] px-2 py-0.5 rounded font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveEdit}
                            disabled={!editContent.trim()}
                            className="text-[10px] px-2 py-0.5 rounded font-medium bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-50 cursor-pointer"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {msg.fileKey && (
                          <div className="mb-1.5">
                            {msg.fileType?.startsWith("image/") ? (
                              <img
                                src={`/api/files/${msg.fileKey}`}
                                alt={msg.fileName || "Image"}
                                className="max-w-full max-h-48 rounded-lg object-cover cursor-pointer"
                                onClick={() => window.open(`/api/files/${msg.fileKey}`, "_blank")}
                              />
                            ) : (
                              <a
                                href={`/api/files/${msg.fileKey}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                                  isMine
                                    ? "bg-primary-foreground/10 text-primary-foreground"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                }`}
                              >
                                <FileText className="w-4 h-4 shrink-0" />
                                <span className="truncate">{msg.fileName || "File"}</span>
                              </a>
                            )}
                          </div>
                        )}
                        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                        {!showHeader && (
                          <p className={`text-[9px] mt-1 ${isMine ? "text-left text-primary-foreground/60" : "text-right text-gray-400"}`}>
                            {msg.editedAt ? `edited ${formatMessageTime(msg.editedAt)}` : formatMessageTime(msg.createdAt)}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                  <div className={`flex items-center gap-1 mt-0.5 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                    {msg.reactions?.map((r) => (
                      <button
                        key={r.emoji}
                        onClick={() => handleToggleReaction(msg.id, r.emoji)}
                        className={`text-xs px-1.5 py-0.5 rounded-full border transition-colors cursor-pointer ${
                          r.hasReacted
                            ? "bg-primary/10 border-primary/30 text-primary"
                            : "bg-transparent border-gray-200 dark:border-gray-700 text-gray-500"
                        }`}
                      >
                        {r.emoji} {r.count}
                      </button>
                    ))}
                    <div className="relative">
                      <button
                        onClick={() => setShowEmojiPicker(showEmojiPicker === msg.id ? null : msg.id)}
                        className="text-xs p-0.5 rounded-full border border-transparent hover:border-gray-200 dark:hover:border-gray-700 text-gray-400 hover:text-gray-600 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100 cursor-pointer"
                      >
                        <Smile className="w-3.5 h-3.5" />
                      </button>
                      {showEmojiPicker === msg.id && (
                        <EmojiPickerPanel
                          onSelect={(emoji) => {
                            handleToggleReaction(msg.id, emoji);
                            setShowEmojiPicker(null);
                          }}
                          onClose={() => setShowEmojiPicker(null)}
                        />
                      )}
                    </div>
                    <button
                      onClick={() => handleOpenThread(msg)}
                      className="text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 cursor-pointer"
                    >
                      <MessageSquare className="w-3 h-3" />
                      Reply
                    </button>
                    {isMine && editingMessageId !== msg.id && (
                      <>
                        <button
                          onClick={() => handleStartEdit(msg)}
                          className="text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100 cursor-pointer"
                          title="Edit"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="text-[10px] text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100 cursor-pointer"
                          title="Delete"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                  {msg.replyCount > 0 && (
                    <button
                      onClick={() => handleOpenThread(msg)}
                      className="text-[11px] text-primary hover:text-primary/80 transition-colors mt-0.5 cursor-pointer"
                    >
                      {msg.replyCount} {msg.replyCount === 1 ? "reply" : "replies"}
                    </button>
                  )}
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
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
          />
          <textarea
            ref={inputRef}
            placeholder={isChannel ? `Message #${convInfo?.name || "channel"}` : "Type a message..."}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none overflow-y-auto max-h-32"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingFile}
            className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 cursor-pointer shrink-0"
            title="Attach file"
          >
            {uploadingFile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
          </button>
          <button
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
            className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer shrink-0"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {showMembersPanel && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-t-2xl md:rounded-xl shadow-xl w-full md:max-w-md md:mx-4 max-h-[75vh] flex flex-col md:mb-0">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <Users className="w-4 h-4" />
                Members ({members.length})
              </h2>
              <button
                onClick={() => setShowMembersPanel(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {members.map((m) => (
                <div key={m.userId} className="flex items-center gap-3 px-4 py-2.5">
                  <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden bg-primary/10 flex items-center justify-center">
                    {m.profileImageKey ? (
                      <img src={`/api/files/${m.profileImageKey}`} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-semibold text-primary">
                        {m.name?.charAt(0)?.toUpperCase() || "?"}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{m.name}</p>
                      {m.role === "admin" && (
                        <span className="text-[10px] font-medium text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded">Admin</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {m.userRole}{m.team ? ` · ${m.team}` : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
              <button
                onClick={handleOpenAddPeople}
                disabled={addingMembers}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add People
              </button>
              <button
                onClick={handleAddEveryone}
                disabled={addingMembers}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Users className="w-4 h-4" />
                Add Everyone
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddPeople && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-t-2xl md:rounded-xl shadow-xl w-full md:max-w-md md:mx-4 max-h-[75vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-sm font-semibold">Add People</h2>
              <button
                onClick={() => setShowAddPeople(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {allUsers.filter((u) => u.name?.toLowerCase().includes(memberSearch.toLowerCase())).length === 0 ? (
                <p className="text-center text-sm text-gray-400 py-8">No users found</p>
              ) : (
                allUsers
                  .filter((u) => u.name?.toLowerCase().includes(memberSearch.toLowerCase()))
                  .map((u) => (
                    <button
                      key={u.id}
                      onClick={() => handleToggleUser(u.id)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left cursor-pointer"
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                        selectedUserIds.has(u.id)
                          ? "bg-primary border-primary"
                          : "border-gray-300 dark:border-gray-600"
                      }`}>
                        {selectedUserIds.has(u.id) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden bg-primary/10 flex items-center justify-center">
                        {u.profileImageKey ? (
                          <img src={`/api/files/${u.profileImageKey}`} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs font-semibold text-primary">
                            {u.name?.charAt(0)?.toUpperCase() || "?"}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.role}</p>
                      </div>
                    </button>
                  ))
              )}
            </div>
            {selectedUserIds.size > 0 && (
              <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleAddSelected}
                  disabled={addingMembers}
                  className="w-full py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {addingMembers ? "Adding..." : `Add ${selectedUserIds.size} member${selectedUserIds.size > 1 ? "s" : ""}`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {threadParent && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={handleCloseThread} />
          <div
            className={`fixed z-50 flex flex-col bg-white dark:bg-gray-900 ${
              "inset-0 md:inset-y-4 md:right-4 md:left-auto md:w-[380px] md:rounded-xl md:shadow-xl md:border md:border-gray-200 dark:md:border-gray-700"
            }`}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 shrink-0">
              <div className="flex items-center gap-2">
                <button onClick={handleCloseThread} className="md:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="text-sm font-semibold">Thread</h3>
              </div>
              <button onClick={handleCloseThread} className="hidden md:block p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-4 py-3 space-y-3">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full shrink-0 overflow-hidden bg-primary/10 flex items-center justify-center">
                    {threadParent.senderProfileImageKey ? (
                      <img src={`/api/files/${threadParent.senderProfileImageKey}`} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[9px] font-semibold text-primary">
                        {threadParent.senderName?.charAt(0)?.toUpperCase() || "?"}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium">{threadParent.senderName}</p>
                  <p className="text-[10px] text-gray-400">{formatMessageTime(threadParent.createdAt)}</p>
                </div>
                <p className="text-sm whitespace-pre-wrap break-words">{threadParent.content}</p>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 pt-3 space-y-3">
                {threadReplies.length === 0 && (
                  <p className="text-center text-xs text-gray-400 py-4">No replies yet</p>
                )}
                {threadReplies.map((reply) => {
                  const isMine = reply.senderId === userId;
                  const avatarUrl = reply.senderProfileImageKey
                    ? `/api/files/${reply.senderProfileImageKey}`
                    : null;
                  return (
                    <div key={reply.id}>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full shrink-0 overflow-hidden bg-primary/10 flex items-center justify-center">
                          {avatarUrl ? (
                            <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[9px] font-semibold text-primary">
                              {isMine ? "Y" : (reply.senderName?.charAt(0)?.toUpperCase() || "?")}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-medium">{isMine ? "You" : reply.senderName}</p>
                        <p className="text-[10px] text-gray-400">{formatMessageTime(reply.createdAt)}</p>
                      </div>
                      <div className="ml-8">
                        <p className="text-sm whitespace-pre-wrap break-words">{reply.content}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {reply.reactions?.map((r) => (
                            <button
                              key={r.emoji}
                              onClick={() => handleToggleReaction(reply.id, r.emoji)}
                              className={`text-xs px-1.5 py-0.5 rounded-full border transition-colors cursor-pointer ${
                                r.hasReacted
                                  ? "bg-primary/10 border-primary/30 text-primary"
                                  : "bg-transparent border-gray-200 dark:border-gray-700 text-gray-500"
                              }`}
                            >
                              {r.emoji} {r.count}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={threadMessagesEndRef} />
              </div>
            </div>

            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 shrink-0">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Reply in thread..."
                  value={threadReplyText}
                  onChange={(e) => setThreadReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleThreadSend();
                    }
                  }}
                  className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  onClick={handleThreadSend}
                  disabled={!threadReplyText.trim() || sendingThreadReply}
                  className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {sendingThreadReply ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {showConfirm && (
        <ConfirmDialog
          title={showConfirm.title}
          message={showConfirm.message}
          confirmLabel={showConfirm.confirmLabel}
          onConfirm={showConfirm.onConfirm}
          onCancel={() => setShowConfirm(null)}
        />
      )}
    </div>
  );
}
