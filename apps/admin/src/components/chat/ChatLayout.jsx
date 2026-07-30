"use client";

export function ChatLayout({ sidebar, children, threadPanel }) {
  return (
    <div className="flex h-[calc(100vh-6rem)] sm:h-[calc(100vh-7rem)] lg:h-[calc(100vh-8rem)] -mx-4 sm:-mx-6 lg:-mx-8 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] lg:w-[calc(100%+4rem)] max-w-none overflow-hidden relative">
      <div className="w-64 lg:w-72 shrink-0 border-r border-border bg-muted/20 hidden md:block overflow-y-auto">
        {sidebar}
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
      {threadPanel && (
        <div className="w-80 lg:w-96 shrink-0 border-l border-border bg-background flex flex-col min-h-0 relative z-20 shadow-lg md:shadow-none absolute md:relative right-0 h-full max-w-full">
          {threadPanel}
        </div>
      )}
    </div>
  );
}
