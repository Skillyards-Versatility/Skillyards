"use client";

export default function ChatLoading() {
  return (
    <div className="flex h-[calc(100vh-6.5rem)] sm:h-[calc(100vh-7.5rem)] lg:h-[calc(100vh-8.5rem)] -mx-4 sm:-mx-6 lg:-mx-8 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] lg:w-[calc(100%+4rem)] max-w-none overflow-hidden relative border border-border/40 bg-card/30 backdrop-blur-md rounded-2xl shadow-xl animate-pulse">
      {/* Sidebar Skeleton (Desktop only) */}
      <div className="w-64 lg:w-72 shrink-0 border-r border-border/80 bg-muted/10 hidden md:flex flex-col p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-6 w-24 bg-muted/40 rounded-full" />
        </div>
        <div className="space-y-4">
          <div className="h-4 w-16 bg-muted/40 rounded" />
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-2.5 px-3 py-2">
                <div className="w-4 h-4 rounded bg-muted/40" />
                <div className="h-4 bg-muted/40 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-4 w-24 bg-muted/40 rounded" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2.5 px-3 py-2">
                <div className="w-4 h-4 rounded bg-muted/40" />
                <div className="h-4 bg-muted/40 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Area Skeleton */}
      <div className="flex-1 flex flex-col min-w-0 bg-background/20">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/80 bg-card/45 backdrop-blur-md shrink-0 h-14">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-muted/40 md:hidden" /> {/* back btn on mobile */}
            <div className="w-8 h-8 rounded-full bg-muted/40 hidden md:block" />
            <div className="h-4 bg-muted/40 rounded w-28" />
          </div>
          <div className="w-16 h-6 rounded-full bg-muted/40" />
        </div>

        {/* Message List Skeleton */}
        <div className="flex-1 p-4 space-y-6 overflow-y-auto">
          {[1, 2, 3, 4].map((i) => {
            const isEven = i % 2 === 0;
            return (
              <div key={i} className={`flex gap-3 ${isEven ? "flex-row-reverse" : "flex-row"}`}>
                <div className="w-8 h-8 rounded-full bg-muted/40 shrink-0" />
                <div className={`flex flex-col space-y-1.5 max-w-[70%] ${isEven ? "items-end" : "items-start"}`}>
                  <div className="h-3 bg-muted/40 rounded w-24" />
                  <div className={`h-12 bg-muted/40 rounded-2xl w-64 ${isEven ? "rounded-tr-none" : "rounded-tl-none"}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Skeleton */}
        <div className="px-4 py-4 border-t border-border/70 bg-card/45 backdrop-blur-md shrink-0">
          <div className="h-12 bg-muted/40 rounded-xl w-full" />
        </div>
      </div>
    </div>
  );
}
