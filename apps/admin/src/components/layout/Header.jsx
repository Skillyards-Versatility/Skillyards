"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useSidebar } from "@/components/providers/SidebarProvider";
import { Menu } from "lucide-react";

const ROLE_LABEL = {
  ADMIN: "Full Access",
  MANAGER: "Manager",
  SALES: "Sales",
  HR: "HR",
  DEVELOPER: "Developer",
  DIGITAL_MARKETER: "Digital Marketer",
  OUTSIDE_SALES: "Outside Sales",
  STUDENT: "Student",
};

export function Header({ user }) {
  const { openMobile } = useSidebar();

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

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
        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-lg hover:bg-muted/50 transition-colors px-2 py-1.5 -mr-2"
        >
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0 overflow-hidden">
            {user?.profileImageKey ? (
              <img
                src={`/api/files/${user.profileImageKey}`}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-bold text-foreground">
              {user?.name ?? "—"}
            </span>
            <span className="text-xs text-muted-foreground">
              {ROLE_LABEL[user?.role] ?? user?.role ?? "—"}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}