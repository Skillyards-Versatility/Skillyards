import Link from "next/link";
import { Hash, Lock, Users, ChevronLeft } from "lucide-react";

export function ChannelHeader({ channel, memberCount }) {
  if (!channel) return null;

  const Icon = channel.type === "private" ? Lock : Hash;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border/80 bg-card/45 backdrop-blur-md shrink-0 z-10">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Back Button */}
        <Link
          href="/chat"
          className="p-1.5 -ml-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 md:hidden transition-colors flex items-center gap-0.5"
          title="Back to channels"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-xs font-semibold pr-1">Channels</span>
        </Link>

        <div className="flex items-center gap-1.5 min-w-0">
          <div className="p-1 rounded bg-primary/10 text-primary shrink-0">
            <Icon className="w-4 h-4" />
          </div>
          <h2 className="font-semibold text-foreground truncate text-sm sm:text-base">
            {channel.name}
          </h2>
          {channel.description && (
            <span className="text-xs text-muted-foreground hidden sm:inline truncate ml-2 border-l border-border pl-2 py-0.5">
              {channel.description}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0 bg-muted/30 hover:bg-muted/50 px-2.5 py-1 rounded-full border border-border/50 transition-colors">
        <span className="flex items-center gap-1 font-medium">
          <Users className="w-3.5 h-3.5 text-primary" />
          {memberCount || 0}
        </span>
      </div>
    </div>
  );
}
