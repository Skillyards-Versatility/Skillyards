"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const ChatLayoutContext = createContext(null);

export function useChatLayout() {
  const context = useContext(ChatLayoutContext);
  if (!context) {
    throw new Error("useChatLayout must be used within a ChatLayoutProvider");
  }
  return context;
}

export function ChatLayoutProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Auto-close mobile sidebar on pathname change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <ChatLayoutContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      {children}
    </ChatLayoutContext.Provider>
  );
}

function ChatLayoutContent({ sidebar, children, threadPanel }) {
  const pathname = usePathname();
  const isRoot = pathname === "/chat";

  return (
    <div className="flex h-[calc(100vh-6.5rem)] sm:h-[calc(100vh-7.5rem)] lg:h-[calc(100vh-8.5rem)] -mx-4 sm:-mx-6 lg:-mx-8 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] lg:w-[calc(100%+4rem)] max-w-none overflow-hidden relative border border-border/40 bg-card/30 backdrop-blur-md rounded-2xl shadow-xl transition-all duration-300">
      {/* Sidebar - Desktop or Mobile Root */}
      <div className={`shrink-0 border-r border-border/80 bg-muted/10 overflow-y-auto ${
        isRoot
          ? "w-full md:w-64 lg:w-72 block"
          : "w-64 lg:w-72 hidden md:block"
      }`}>
        {sidebar}
      </div>

      {/* Main Chat Area - Desktop or Mobile specific sub-route */}
      <div className={`flex-1 flex flex-col min-w-0 bg-background/20 relative ${
        isRoot
          ? "hidden md:flex"
          : "flex"
      }`}>
        {children}
      </div>

      {/* Thread Panel - Slide over / responsive */}
      {threadPanel && (
        <>
          {/* Thread Backdrop on Mobile */}
          <div
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-2xs md:hidden"
            onClick={() => {
              // Closed via child action in ThreadPanel
            }}
          />
          <div className="w-full sm:w-96 md:w-80 lg:w-96 shrink-0 border-l border-border bg-card/95 backdrop-blur-md flex flex-col min-h-0 absolute md:relative right-0 h-full max-w-full z-35 shadow-2xl md:shadow-none animate-in slide-in-from-right duration-250 ease-out">
            {threadPanel}
          </div>
        </>
      )}
    </div>
  );
}

export function ChatLayout(props) {
  return (
    <ChatLayoutProvider>
      <ChatLayoutContent {...props} />
    </ChatLayoutProvider>
  );
}
