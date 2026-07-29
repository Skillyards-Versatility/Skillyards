"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Hash, Lock, MessageCircle, Plus } from "lucide-react";

export function ChannelList({ channels, conversations, onNewChannel, onNewDm }) {
  const pathname = usePathname();

  return (
    <div className="p-3 space-y-4">
      {/* Channels */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Channels
          </p>
          <button
            onClick={onNewChannel}
            className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Create channel"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-0.5">
          {channels.map((ch) => {
            const href = `/chat/${ch.id}`;
            const isActive = pathname === href;
            const Icon = ch.type === "private" ? Lock : Hash;
            return (
              <Link
                key={ch.id}
                href={href}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{ch.name}</span>
              </Link>
            );
          })}
          {channels.length === 0 && (
            <p className="text-xs text-muted-foreground px-2">No channels yet</p>
          )}
        </div>
      </div>

      {/* Direct Messages */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Direct Messages
          </p>
          <button
            onClick={onNewDm}
            className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="New message"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-0.5">
          {conversations.map((conv) => {
            const href = `/chat/dm/${conv.id}`;
            const isActive = pathname === href;
            const otherParticipants = conv.participants?.filter(
              (p) => p.id !== conv._currentUserId
            ) || [];
            const label =
              conv.name ||
              otherParticipants.map((p) => p.name).join(", ") ||
              "Unknown";
            return (
              <Link
                key={conv.id}
                href={href}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
          {conversations.length === 0 && (
            <p className="text-xs text-muted-foreground px-2">No conversations yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
