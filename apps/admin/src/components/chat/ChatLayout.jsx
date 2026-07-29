"use client";

export function ChatLayout({ sidebar, children }) {
  return (
    <div className="flex h-[calc(100vh-6rem)] sm:h-[calc(100vh-7rem)] lg:h-[calc(100vh-8rem)] -mx-4 sm:-mx-6 lg:-mx-8 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] lg:w-[calc(100%+4rem)] max-w-none overflow-hidden">
      <div className="w-64 lg:w-72 shrink-0 border-r border-border bg-muted/20 hidden md:block overflow-y-auto">
        {sidebar}
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  );
}
