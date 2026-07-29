"use client";

import { useState, useEffect } from "react";
import { ChatLayout } from "@/components/chat/ChatLayout";
import { ChannelList } from "@/components/chat/ChannelList";
import { ChannelCreateDialog } from "@/components/chat/ChannelCreateDialog";
import { NewDmDialog } from "@/components/chat/NewDmDialog";

export default function ChatPage() {
  const [channels, setChannels] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showNewDm, setShowNewDm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChannels();
    fetchConversations();
    fetchUsers();
  }, []);

  const fetchChannels = async () => {
    try {
      const res = await fetch("/api/channels");
      if (res.ok) setChannels(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/conversations");
      if (res.ok) setConversations(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users/presence");
      if (res.ok) {
        const { users } = await res.json();
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
