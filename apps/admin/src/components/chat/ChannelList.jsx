"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Hash, Lock, MessageCircle, Plus, X } from "lucide-react";
import { useChatLayout } from "./ChatLayout";
import { UserPresenceBadge } from "./UserPresenceBadge";

export function ChannelList({ channels, conversations, onNewChannel, onNewDm }) {
  const pathname = usePathname();
  const { setSidebarOpen } = useChatLayout();

  return (
    <div className="p-4 flex flex-col h-full bg-card/25 backdrop-blur-xs">
      {/* Mobile Header with Close Button */}
      <div className="flex items-center justify-between mb-6 md:mb-4 shrink-0">
        <span className="text-xs font-bold text-foreground/75 uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
          WORKSPACE
        </span>
        <Link
          href="/dashboard"
          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground md:hidden transition-colors flex items-center justify-center cursor-pointer"
          title="Exit chat"
        >
          <X className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto pr-1 -mr-2 scrollbar-thin">
        {/* Channels */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider">
              Channels
            </p>
            <button
              onClick={onNewChannel}
              className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer"
              title="Create channel"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-1">
            {channels.map((ch) => {
              const href = `/chat/${ch.id}`;
              const isActive = pathname === href;
              const Icon = ch.type === "private" ? Lock : Hash;
              return (
                <Link
                  key={ch.id}
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 relative ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary pl-3.5 shadow-xs"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:pl-4"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive ? "text-primary scale-110" : "text-muted-foreground group-hover:text-foreground"}`} />
                  <span className="truncate">{ch.name}</span>
                </Link>
              );
            })}
            {channels.length === 0 && (
              <p className="text-xs text-muted-foreground/50 italic px-3 py-1">No channels yet</p>
            )}
          </div>
        </div>

        {/* Direct Messages */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider">
              Direct Messages
            </p>
            <button
              onClick={onNewDm}
              className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer"
              title="New message"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-1">
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
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 relative ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary pl-3.5 shadow-xs"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:pl-4"
                  }`}
                >
                  <MessageCircle className={`w-4 h-4 shrink-0 transition-transform ${isActive ? "text-primary scale-110" : "text-muted-foreground group-hover:text-foreground"}`} />
                  <span className="truncate flex-1 pr-2">{label}</span>
                  {otherParticipants[0] && (
                    <UserPresenceBadge
                      userId={otherParticipants[0].id}
                      className={`shrink-0 w-1.5 h-1.5 ring-1 ${isActive ? "ring-primary/20" : "ring-background"}`}
                    />
                  )}
                </Link>
              );
            })}
            {conversations.length === 0 && (
              <p className="text-xs text-muted-foreground/50 italic px-3 py-1">No conversations yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
