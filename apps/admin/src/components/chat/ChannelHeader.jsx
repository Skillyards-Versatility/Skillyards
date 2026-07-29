"use client";

import { Hash, Lock, Users, Info } from "lucide-react";

export function ChannelHeader({ channel, memberCount }) {
  if (!channel) return null;

  const Icon = channel.type === "private" ? Lock : Hash;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background shrink-0">
      <div className="flex items-center gap-2 min-w-0">
        <Icon className="w-5 h-5 text-muted-foreground shrink-0" />
        <h2 className="font-semibold text-foreground truncate">{channel.name}</h2>
        {channel.description && (
          <span className="text-xs text-muted-foreground hidden sm:inline truncate ml-2 border-l border-border pl-2">
            {channel.description}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
        <span className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          {memberCount || 0}
        </span>
      </div>
    </div>
  );
}
