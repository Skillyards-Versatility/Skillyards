"use client";

import React from "react";
import { Search, Plus, Bell, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function CrmHeader({ onNewLeadClick }) {
  const { user, crmRoles } = useAuth();
  const primaryRole = crmRoles?.[0] || user?.role || "Staff";

  return (
    <header className="h-16 px-8 bg-platinum-950/80 backdrop-blur-md border-b border-platinum-800 flex items-center justify-between sticky top-0 z-30">
      {/* Search Bar */}
      <div className="relative w-80">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-platinum-500" />
        <input
          type="text"
          placeholder="Search leads by name, phone, email..."
          className="crm-input pl-9"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Role Badge */}
        <div className="crm-badge crm-badge-info">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="capitalize">{primaryRole.replace("_", " ")}</span>
        </div>

        {/* Notifications */}
        <button
          type="button"
          aria-label="View notifications"
          className="crm-btn-ghost !p-2 relative"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-deep-ocean-400 absolute top-2 right-2 ring-2 ring-platinum-950" />
        </button>

        {/* Fast Action */}
        <button
          onClick={onNewLeadClick}
          className="crm-btn-primary"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Lead</span>
        </button>
      </div>
    </header>
  );
}
