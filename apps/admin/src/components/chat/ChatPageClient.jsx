"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Plus, Search, ArrowLeft } from "lucide-react";
import { getOrCreateConversation, getMyConversations } from "@/actions/chat";

function formatTime(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now - d;
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays === 0) {
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  }
  if (diffDays === 1) return "Yesterday";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function ChatPageClient({ userId, conversations: initialConversations, users: allUsers }) {
  const router = useRouter();
  const [conversations, setConversations] = useState(initialConversations);
  const [showUserPicker, setShowUserPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConv, setSelectedConv] = useState(null);
  const [loading, setLoading] = useState(false);

  const refreshConversations = useCallback(async () => {
    const convs = await getMyConversations();
    setConversations(convs);
  }, []);

  useEffect(() => {
    const interval = setInterval(refreshConversations, 30000);
    return () => clearInterval(interval);
  }, [refreshConversations]);

  const handleNewChat = async (otherUserId) => {
    setLoading(true);
    const convId = await getOrCreateConversation(otherUserId);
    setLoading(false);
    setShowUserPicker(false);
    if (convId) {
      router.push(`/chat/${convId}`);
    }
  };

  const filteredUsers = allUsers.filter(
    (u) =>
      u.id !== userId &&
      u.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const existingConversationUserIds = new Set(
    conversations.map((c) => c.otherUserId)
  );

  if (selectedConv) {
    const conv = conversations.find((c) => c.conversationId === selectedConv);
    if (!conv) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          Conversation not found
        </div>
      );
    }
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setSelectedConv(null)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <p className="font-semibold text-sm">{conv.otherUserName}</p>
            <p className="text-xs text-gray-500">{conv.otherUserRole}</p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
          Select a thread to view messages
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Chat
        </h1>
        <button
          onClick={() => setShowUserPicker(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          New
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2 p-8">
            <MessageCircle className="w-12 h-12" />
            <p className="text-sm">No conversations yet</p>
            <button
              onClick={() => setShowUserPicker(true)}
              className="text-sm text-primary hover:underline cursor-pointer"
            >
              Start a new chat
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {conversations.map((conv) => (
              <button
                key={conv.conversationId}
                onClick={() => router.push(`/chat/${conv.conversationId}`)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold text-primary">
                    {conv.otherUserName?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium truncate">{conv.otherUserName}</p>
                    <span className="text-xs text-gray-400 shrink-0">
                      {formatTime(conv.lastMessageCreatedAt || conv.updatedAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-gray-500 truncate">
                      {conv.lastMessageContent || "No messages yet"}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="shrink-0 bg-primary text-primary-foreground text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                        {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {showUserPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[70vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-sm font-semibold">New Message</h2>
              <button
                onClick={() => {
                  setShowUserPicker(false);
                  setSearchQuery("");
                }}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search people..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <p className="text-center text-sm text-gray-400 py-8">No users found</p>
              ) : (
                filteredUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleNewChat(u.id)}
                    disabled={loading}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left cursor-pointer disabled:opacity-50"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-semibold text-primary">
                        {u.name?.charAt(0)?.toUpperCase() || "?"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{u.name}</p>
                      <p className="text-xs text-gray-500">{u.role}</p>
                    </div>
                    {existingConversationUserIds.has(u.id) && (
                      <span className="ml-auto text-[10px] text-gray-400">Existing</span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
