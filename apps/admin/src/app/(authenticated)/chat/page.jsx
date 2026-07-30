"use client";

import { useState, useEffect } from "react";
import { ChatLayout } from "@/components/chat/ChatLayout";
import { ChannelList } from "@/components/chat/ChannelList";
import { ChannelCreateDialog } from "@/components/chat/ChannelCreateDialog";
import { NewDmDialog } from "@/components/chat/NewDmDialog";

import { chatCache } from "@/components/chat/chatCache";

export default function ChatPage() {
  const [channels, setChannels] = useState(chatCache.channels || []);
  const [conversations, setConversations] = useState(chatCache.conversations || []);
  const [allUsers, setAllUsers] = useState(chatCache.users || []);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showNewDm, setShowNewDm] = useState(false);
  const [loading, setLoading] = useState(!chatCache.channels);

  useEffect(() => {
    fetchChannels();
    fetchConversations();
    fetchUsers();
  }, []);

  const fetchChannels = async () => {
    try {
      const res = await fetch("/api/channels");
      if (res.ok) {
        const data = await res.json();
        chatCache.channels = data;
        setChannels(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/conversations");
      if (res.ok) {
        const data = await res.json();
        chatCache.conversations = data;
        setConversations(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users/presence");
      if (res.ok) {
        const { users } = await res.json();
        chatCache.users = users;
        setAllUsers(users);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateChannel = async (data) => {
    const res = await fetch("/api/channels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || err.error || "Failed to create channel");
    }
    const channel = await res.json();
    window.location.href = `/chat/${channel.id}`;
  };

  const handleStartDm = async (otherUserId) => {
    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "direct", participantIds: [otherUserId] }),
    });
    if (!res.ok) throw new Error("Failed to create conversation");
    const conv = await res.json();
    window.location.href = `/chat/dm/${conv.id}`;
  };

  return (
    <>
      <ChatLayout
        sidebar={
          <ChannelList
            channels={channels}
            conversations={conversations}
            onNewChannel={() => setShowCreateChannel(true)}
            onNewDm={() => setShowNewDm(true)}
          />
        }
      >
        <div className="flex-1 flex items-center justify-center">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : channels.length === 0 ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">No channels yet</p>
              <button
                onClick={() => setShowCreateChannel(true)}
                className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
              >
                Create your first channel
              </button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Select a channel to start chatting</p>
          )}
        </div>
      </ChatLayout>

      <ChannelCreateDialog
        open={showCreateChannel}
        onClose={() => setShowCreateChannel(false)}
        onCreate={handleCreateChannel}
      />

      <NewDmDialog
        open={showNewDm}
        onClose={() => setShowNewDm(false)}
        users={allUsers}
        onStart={handleStartDm}
      />
    </>
  );
}
