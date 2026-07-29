"use client";

export function ChatLayout({ sidebar, children }) {
  return (
    <div className="flex h-[calc(100vh-8rem)] -mx-2 sm:-mx-4 lg:-mx-8">
      <div className="w-64 lg:w-72 shrink-0 border-r border-border bg-muted/20 hidden md:block overflow-y-auto">
        {sidebar}
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  );
}
