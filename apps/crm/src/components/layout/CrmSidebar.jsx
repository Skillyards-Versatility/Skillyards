"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  PhoneCall,
  CalendarClock,
  GraduationCap,
  FileSpreadsheet,
  Settings,
  Sparkles,
  CopyCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Leads", href: "/leads", icon: Users },
  { label: "Duplicate Reviews", href: "/duplicates", icon: CopyCheck },
  { label: "Call Queue", href: "/queue", icon: PhoneCall },
  { label: "Follow-ups", href: "/follow-ups", icon: CalendarClock },
  { label: "Counselling", href: "/counselling", icon: GraduationCap },
  { label: "EOD Reports", href: "/eod", icon: FileSpreadsheet },
];

export function CrmSidebar() {
  const pathname = usePathname();
  const { user, crmRoles } = useAuth();

  return (
    <aside className="w-64 bg-platinum-950 border-r border-platinum-800/80 flex flex-col shrink-0 h-screen sticky top-0">
      {/* Brand */}
      <div className="h-16 px-6 flex items-center border-b border-platinum-800/80">
        <Link href="/" className="flex items-center">
          <img
            src="/logo/logo-light.svg"
            alt="Skillyards Logo"
            className="h-8 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-platinum-500 uppercase">
          Sales Operations
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${isActive
                ? "bg-dark-teal-900/50 text-deep-ocean-300 border border-dark-teal-700/60 font-semibold shadow-sm shadow-dark-teal-950"
                : "text-platinum-400 hover:text-platinum-100 hover:bg-platinum-900/60"
                }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-deep-ocean-400" : "text-platinum-400"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User profile footer */}
      <div className="p-3 border-t border-platinum-800/80 bg-platinum-900/40">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-platinum-900 border border-platinum-800">
          <div className="w-8 h-8 rounded-full bg-dark-teal-900/60 text-deep-ocean-300 flex items-center justify-center font-bold text-xs uppercase border border-dark-teal-700/50">
            {user?.name ? user.name[0] : "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-platinum-100 truncate">{user?.name || "Loading..."}</p>
            <p className="text-[10px] text-platinum-400 truncate">
              {crmRoles?.[0] ? crmRoles[0].toUpperCase() : user?.role || "Staff"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
