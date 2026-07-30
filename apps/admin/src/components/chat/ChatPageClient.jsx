"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Plus, Search, ArrowLeft, Hash, User, Users, Check } from "lucide-react";
import { getOrCreateConversation, getMyConversations, ensureTeamChannels, createChannel, getAvailableChannels, joinChannel } from "@/actions/chat";

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

function useVisibilityRefresh(cb) {
  const cbRef = useRef(cb);
  cbRef.current = cb;
  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === "visible") cbRef.current();
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);
}

export function ChatPageClient({ userId, conversations: initialConversations, users: allUsers }) {
  const router = useRouter();
  const [conversations, setConversations] = useState(initialConversations);
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [showUserPicker, setShowUserPicker] = useState(false);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [channelError, setChannelError] = useState("");
  const [selectedChannelMembers, setSelectedChannelMembers] = useState(new Set());
  const [channelMemberSearch, setChannelMemberSearch] = useState("");
  const [showBrowseChannels, setShowBrowseChannels] = useState(false);
  const [availableChannels, setAvailableChannels] = useState([]);

  const refreshConversations = useCallback(async () => {
    const convs = await getMyConversations();
    setConversations(convs);
  }, []);

  useEffect(() => {
    ensureTeamChannels().then(refreshConversations);
    const interval = setInterval(refreshConversations, 60000);
    return () => clearInterval(interval);
  }, [refreshConversations]);

  useVisibilityRefresh(refreshConversations);

  const handleNewChat = async (otherUserId) => {
    setLoading(true);
    const convId = await getOrCreateConversation(otherUserId);
    setLoading(false);
    setShowUserPicker(false);
    if (convId) router.push(`/chat/${convId}`);
  };

  const handleCreateChannel = async () => {
    setChannelError("");
    const result = await createChannel(channelName, [...selectedChannelMembers]);
    if (!result.success) {
      setChannelError(result.error);
      return;
    }
    setShowCreateChannel(false);
    setChannelName("");
    setSelectedChannelMembers(new Set());
    router.push(`/chat/${result.conversationId}`);
  };

  const channels = conversations.filter((c) => c.type === "channel");
  const dms = conversations.filter((c) => c.type === "dm");

  const filteredUsers = allUsers.filter(
    (u) => u.id !== userId && u.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const existingConversationUserIds = new Set(dms.map((c) => c.otherUserId));

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Chat
        </h1>
        <div className="relative">
          <button
            onClick={() => setShowNewMenu(!showNewMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New
          </button>
          {showNewMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowNewMenu(false)} />
              <div className="absolute right-0 top-full mt-1 z-20 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1">
                <button
                  onClick={() => { setShowNewMenu(false); setShowUserPicker(true); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  New Direct Message
                </button>
                <button
                  onClick={() => { setShowNewMenu(false); setShowCreateChannel(true); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                >
                  <Hash className="w-4 h-4" />
                  New Channel
                </button>
                <button
                  onClick={async () => { setShowNewMenu(false); const chs = await getAvailableChannels(); setAvailableChannels(chs); setShowBrowseChannels(true); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  Browse Channels
                </button>
              </div>
            </>
          )}
        </div>
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
          <>
            <div>
              <div className="px-4 pt-4 pb-1">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Hash className="w-3 h-3" />
                  Channels
                </p>
              </div>
              {channels.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">No channels yet. Create one!</p>
              ) : (
                channels.map((conv) => (
                  <button
                    key={conv.conversationId}
                    onClick={() => router.push(`/chat/${conv.conversationId}`)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                      <Hash className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium truncate">
                          {conv.name || "Unnamed"}
                        </p>
                        <span className="text-xs text-gray-400 shrink-0">
                          {formatTime(conv.lastMessageCreatedAt || conv.updatedAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs text-gray-500 truncate">
                          {conv.lastMessageContent || "No messages yet"}
                        </p>
                        <div className="flex items-center gap-2 shrink-0">
                          {conv.unreadCount > 0 && (
                            <span className="bg-primary text-primary-foreground text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                              {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
                            </span>
                          )}
                          <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                            <Users className="w-3 h-3" />
                            {conv.participantCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                )))}
              </div>

            {dms.length > 0 && (
              <div>
                <div className="px-4 pt-4 pb-1">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3 h-3" />
                    Direct Messages
                  </p>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {dms.map((conv) => (
                    <button
                      key={conv.conversationId}
                      onClick={() => router.push(`/chat/${conv.conversationId}`)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden bg-primary/10 flex items-center justify-center">
                        {conv.otherUserProfileImageKey ? (
                          <img src={`/api/files/${conv.otherUserProfileImageKey}`} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs font-semibold text-primary">
                            {conv.otherUserName?.charAt(0)?.toUpperCase() || "?"}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium truncate">
                            {conv.otherUserName || "Unknown"}
                          </p>
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
              </div>
            )}
          </>
        )}
      </div>

      {showUserPicker && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-t-2xl md:rounded-xl shadow-xl w-full md:max-w-md md:mx-4 max-h-[75vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-sm font-semibold">New Message</h2>
              <button
                onClick={() => { setShowUserPicker(false); setSearchQuery(""); }}
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

      {showBrowseChannels && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-t-2xl md:rounded-xl shadow-xl w-full md:max-w-md md:mx-4 max-h-[75vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Browse Channels
              </h2>
              <button
                onClick={() => setShowBrowseChannels(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {availableChannels.length === 0 ? (
                <p className="text-center text-sm text-gray-400 py-8">No channels available</p>
              ) : (
                availableChannels.map((ch) => {
                  const isMember = channels.some((c) => c.conversationId === ch.id);
                  return (
                    <div key={ch.id} className="flex items-center gap-3 px-4 py-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                        <Hash className="w-4 h-4 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium"># {ch.name}</p>
                        <p className="text-xs text-gray-500">{ch.participantCount} member{ch.participantCount !== 1 ? "s" : ""}</p>
                      </div>
                      {isMember ? (
                        <button
                          onClick={() => { setShowBrowseChannels(false); router.push(`/chat/${ch.id}`); }}
                          className="px-3 py-1 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                        >
                          Open
                        </button>
                      ) : (
                        <button
                          onClick={async () => {
                            await joinChannel(ch.id);
                            const convs = await getMyConversations();
                            setConversations(convs);
                            setAvailableChannels(await getAvailableChannels());
                          }}
                          className="px-3 py-1 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
                        >
                          Join
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {showCreateChannel && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-t-2xl md:rounded-xl shadow-xl w-full md:max-w-md md:mx-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Create Channel
              </h2>
              <button
                onClick={() => { setShowCreateChannel(false); setChannelName(""); setChannelError(""); setSelectedChannelMembers(new Set()); }}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Channel name</label>
                <input
                  type="text"
                  placeholder="e.g. design-team"
                  value={channelName}
                  onChange={(e) => { setChannelName(e.target.value); setChannelError(""); }}
                  onKeyDown={(e) => { if (e.key === "Enter") handleCreateChannel(); }}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  autoFocus
                />
                {channelError && (
                  <p className="text-xs text-red-500 mt-1">{channelError}</p>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Add members (optional)</label>
                <div className="relative mb-2">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search people..."
                    value={channelMemberSearch}
                    onChange={(e) => setChannelMemberSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-100 dark:divide-gray-800">
                  {allUsers
                    .filter((u) => u.id !== userId)
                    .filter((u) => u.name?.toLowerCase().includes(channelMemberSearch.toLowerCase()))
                    .length === 0 ? (
                    <p className="text-center text-sm text-gray-400 py-4">No users found</p>
                  ) : (
                    allUsers
                      .filter((u) => u.id !== userId)
                      .filter((u) => u.name?.toLowerCase().includes(channelMemberSearch.toLowerCase()))
                      .map((u) => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => {
                            setSelectedChannelMembers((prev) => {
                              const next = new Set(prev);
                              if (next.has(u.id)) next.delete(u.id);
                              else next.add(u.id);
                              return next;
                            });
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left cursor-pointer"
                        >
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                            selectedChannelMembers.has(u.id)
                              ? "bg-primary border-primary"
                              : "border-gray-300 dark:border-gray-600"
                          }`}>
                            {selectedChannelMembers.has(u.id) && (
                              <Check className="w-2.5 h-2.5 text-white" />
                            )}
                          </div>
                          <div className="w-7 h-7 rounded-full shrink-0 overflow-hidden bg-primary/10 flex items-center justify-center">
                            {u.profileImageKey ? (
                              <img src={`/api/files/${u.profileImageKey}`} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[10px] font-semibold text-primary">
                                {u.name?.charAt(0)?.toUpperCase() || "?"}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{u.name}</p>
                            <p className="text-[10px] text-gray-500 truncate">{u.role}</p>
                          </div>
                        </button>
                      ))
                  )}
                </div>
                {selectedChannelMembers.size > 0 && (
                  <p className="text-[10px] text-gray-400 mt-1">
                    {selectedChannelMembers.size} member{selectedChannelMembers.size > 1 ? "s" : ""} selected
                  </p>
                )}
              </div>
              <button
                onClick={handleCreateChannel}
                disabled={!channelName.trim() || loading}
                className="w-full py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Create Channel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
