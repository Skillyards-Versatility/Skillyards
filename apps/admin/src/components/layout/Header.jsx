"use client";

import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useSidebar } from "@/components/providers/SidebarProvider";
import { Menu } from "lucide-react";

const ROLE_LABEL = {
  ADMIN: "Full Access",
  MANAGER: "Manager",
  SALES: "Sales",
  HR: "HR",
  DEVELOPER: "Developer",
  STUDENT: "Student",
};

export function Header({ user }) {
  const { openMobile } = useSidebar();

  return (
    <header className="sticky top-0 z-30 h-16 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <button
        onClick={openMobile}
        className="lg:hidden p-2 -ml-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-3 ml-auto">
        <ThemeToggle />
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-sm font-bold text-foreground">
            {user?.name ?? "—"}
          </span>
          <span className="text-xs text-muted-foreground">
            {ROLE_LABEL[user?.role] ?? user?.role ?? "—"}
          </span>
        </div>
      </div>
    </header>
  );
}
