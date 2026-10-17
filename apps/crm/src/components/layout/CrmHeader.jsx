"use client";

import React from "react";
import Link from "next/link";
import { Search, Plus, Bell, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function CrmHeader({ onNewLeadClick }) {
  const { user, crmRoles } = useAuth();
  const primaryRole = crmRoles?.[0] || user?.role || "Staff";

  return (
    <header className="h-16 px-6 bg-[#0c1316] border-b border-[rgba(98,146,158,0.15)] flex items-center justify-between sticky top-0 z-40 shadow-md w-full">
      {/* Left: Permanent Full-Size Skillyards Logo */}
      <div className="flex items-center gap-6">
        <Link
          href="/"
          title="Skillyards CRM"
          className="flex items-center group transition-transform active:scale-95 shrink-0"
        >
          <img
            src="/logo/logo-light.svg"
            alt="Skillyards Logo"
            className="h-8 w-auto object-contain transition-opacity group-hover:opacity-90"
          />
        </Link>

        {/* Global Search Bar with Dark Sidebar-Matched Theme */}
        <div className="relative w-80 hidden md:block">
          <input
            type="text"
            placeholder="Search leads by name, phone, email..."
            className="w-full bg-[#131d21] border border-[rgba(98,146,158,0.25)] rounded-lg px-3.5 py-1.5 text-xs text-white placeholder-[#7e939a] outline-none focus:border-[#62929e] focus:bg-[#162227] focus:ring-1 focus:ring-[#62929e]/40 transition-all pr-9"
          />
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#7e939a] pointer-events-none" />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Role Badge */}
        <div className="px-2.5 py-1 rounded-full bg-[rgba(98,146,158,0.15)] border border-[rgba(98,146,158,0.3)] text-[11px] font-semibold text-[#a2c4cc] flex items-center gap-1.5 shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-[#62929e]" />
          <span className="capitalize">{primaryRole.replace("_", " ")}</span>
        </div>

        {/* Notifications */}
        <button
          type="button"
          aria-label="View notifications"
          className="p-2 relative text-[#7e939a] hover:text-white hover:bg-[rgba(98,146,158,0.12)] rounded-lg transition-colors active:scale-95"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-[#62929e] absolute top-2 right-2 ring-2 ring-[#0c1316] shadow-[0_0_6px_#62929e]" />
        </button>

        {/* Fast Action */}
        <button
          onClick={onNewLeadClick}
          className="crm-btn-primary shadow-sm hover:shadow-[#4A6D7C]/30"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Lead</span>
        </button>
      </div>
    </header>
  );
}
