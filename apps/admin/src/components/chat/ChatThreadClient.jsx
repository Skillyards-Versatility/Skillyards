"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, Hash, Users, X, Check, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { getMessages, sendMessage, markAsRead, getChannelMembers, addChannelMembers, addAllUsersToChannel } from "@/actions/chat";
import { getUsers } from "@/actions/users";

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

  const [showMembersPanel, setShowMembersPanel] = useState(false);
  const [members, setMembers] = useState([]);
  const [showAddPeople, setShowAddPeople] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState(new Set());
  const [memberSearch, setMemberSearch] = useState("");
  const [addingMembers, setAddingMembers] = useState(false);

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

  const handleOpenMembers = useCallback(async () => {
    const data = await getChannelMembers(conversationId);
    setMembers(data);
    setShowMembersPanel(true);
  }, [conversationId]);

  const handleOpenAddPeople = useCallback(async () => {
    const users = await getUsers();
    setAllUsers(users.filter((u) => !members.some((m) => m.userId === u.id)));
    setSelectedUserIds(new Set());
    setMemberSearch("");
    setShowAddPeople(true);
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
    const result = await addChannelMembers(conversationId, [...selectedUserIds]);
    setAddingMembers(false);
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
  };

  const handleAddEveryone = async () => {
    if (!window.confirm("Add all users to this channel?")) return;
    setAddingMembers(true);
    const result = await addAllUsersToChannel(conversationId);
    setAddingMembers(false);
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
        <div className="flex-1">
          <p className="font-semibold text-sm">{headerTitle}</p>
          {headerSubtitle && (
            <p className="text-xs text-gray-500">{headerSubtitle}</p>
          )}
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

      {showMembersPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[70vh] flex flex-col">
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
                <div
                  key={m.userId}
                  className="flex items-center gap-3 px-4 py-2.5"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-primary">
                      {m.name?.charAt(0)?.toUpperCase() || "?"}
                    </span>
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[70vh] flex flex-col">
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
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-semibold text-primary">
                          {u.name?.charAt(0)?.toUpperCase() || "?"}
                        </span>
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
    </div>
  );
}
