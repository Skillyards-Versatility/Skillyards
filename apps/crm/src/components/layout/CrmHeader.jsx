"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Bell,
  ShieldCheck,
  Check,
  CalendarClock,
  GraduationCap,
  Users,
  FileSpreadsheet,
  ChevronDown,
  X,
  Keyboard,
  Menu,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const DEMO_NOTIFICATIONS = [
  {
    id: "n-1",
    title: "Overdue Callback Required",
    description: "Divya Nair requested an urgent evening callback.",
    time: "3h ago",
    unread: true,
    href: "/follow-ups",
    icon: CalendarClock,
    iconColor: "text-[#C3473C]",
    iconBg: "bg-[#C3473C]/15",
  },
  {
    id: "n-2",
    title: "Counselling Session Due Today",
    description: "Aarav Sharma scheduled for Full Stack MERN consultation.",
    time: "4h ago",
    unread: true,
    href: "/counselling",
    icon: GraduationCap,
    iconColor: "text-[#2E7559]",
    iconBg: "bg-[#2E7559]/15",
  },
  {
    id: "n-3",
    title: "Unassigned Queue Prospects",
    description: "3 new walk-in prospects waiting in the distribution queue.",
    time: "5h ago",
    unread: false,
    href: "/queue",
    icon: Users,
    iconColor: "text-[#4A6D7C]",
    iconBg: "bg-[#4A6D7C]/15",
  },
  {
    id: "n-4",
    title: "EOD Filing Reminder",
    description: "Daily dial and connect actuals target locks at 8:00 PM.",
    time: "6h ago",
    unread: false,
    href: "/eod",
    icon: FileSpreadsheet,
    iconColor: "text-[#B07238]",
    iconBg: "bg-[#B07238]/15",
  },
];

const ROLES_LIST = [
  {
    role: "ADMIN",
    label: "Sales Manager / Admin",
    crmRoles: ["crm_admin", "sales_manager"],
    description: "Full team access, EOD amendments, queue routing",
  },
  {
    role: "STAFF",
    label: "Senior Counsellor",
    crmRoles: ["counsellor"],
    description: "Counselling bookings, enrollments & target relief",
  },
  {
    role: "STAFF",
    label: "Telecaller Rep",
    crmRoles: ["telecaller"],
    description: "Lead intake, call dials, callback queue",
  },
];

export function CrmHeader({ onNewLeadClick, onMenuToggle, isMobileSidebarOpen }) {
  const router = useRouter();
  const { user, crmRoles, setUser, setCrmRoles } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);

  const searchInputRef = useRef(null);
  const notifRef = useRef(null);
  const roleRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;
  const primaryRole = crmRoles?.[0] || user?.role || "Staff";

  // Global hotkey '/' to focus search input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close popups on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target)) {
        setShowRoleSwitcher(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/leads?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowMobileSearch(false);
    }
  };

  const handleSelectRole = (r) => {
    if (setUser) {
      setUser((prev) => ({
        ...prev,
        role: r.role,
        roleTitle: r.label,
      }));
    }
    if (setCrmRoles) {
      setCrmRoles(r.crmRoles);
    }
    setShowRoleSwitcher(false);
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <header className="h-16 px-3 sm:px-6 bg-[#0c1316] border-b border-[rgba(98,146,158,0.15)] flex items-center justify-between sticky top-0 z-40 shadow-md w-full">
      {/* Left: Mobile Drawer Hamburger + Skillyards Logo + Search */}
      <div className="flex items-center gap-2 sm:gap-6 min-w-0">
        {/* Mobile Hamburger Drawer Button */}
        <button
          type="button"
          onClick={onMenuToggle}
          aria-label="Toggle navigation drawer"
          className="md:hidden p-2 rounded-xl text-[#7e939a] hover:text-white hover:bg-[rgba(98,146,158,0.15)] transition-colors active:scale-95 cursor-pointer shrink-0"
        >
          {isMobileSidebarOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5" />}
        </button>

        <Link
          href="/"
          title="Skillyards CRM"
          className="flex items-center group transition-transform active:scale-95 shrink-0"
        >
          <img
            src="/logo/logo-light.svg"
            alt="Skillyards Logo"
            className="h-7 sm:h-8 w-auto object-contain transition-opacity group-hover:opacity-90"
          />
        </Link>

        {/* Global Search Bar (Desktop / Tablet) */}
        <form onSubmit={handleSearchSubmit} className="relative w-56 md:w-80 hidden sm:block">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads (Press '/' to focus)..."
            className="w-full bg-[#131d21] border border-[rgba(98,146,158,0.25)] rounded-lg pl-3.5 pr-14 py-1.5 text-xs text-white placeholder-[#7e939a] outline-none focus:border-[#62929e] focus:bg-[#162227] focus:ring-1 focus:ring-[#62929e]/40 transition-all"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[9.5px] font-mono text-[#7e939a] bg-[#0c1316] border border-[rgba(98,146,158,0.2)] rounded">
              /
            </kbd>
            <Search className="w-3.5 h-3.5 text-[#7e939a] pointer-events-none" />
          </div>
        </form>
      </div>

      {/* Mobile Search Overlay Bar */}
      {showMobileSearch && (
        <div className="sm:hidden absolute top-16 left-0 right-0 bg-[#0c1316] border-b border-[rgba(98,146,158,0.25)] p-3 z-50 shadow-2xl animate-in slide-in-from-top-2 duration-150">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search leads by name, phone or email..."
                className="w-full bg-[#131d21] border border-[rgba(98,146,158,0.35)] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#7e939a] outline-none focus:border-[#62929e]"
              />
              <Search className="w-4 h-4 text-[#7e939a] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <button
              type="submit"
              className="crm-btn-primary !py-2 !px-3 text-xs shrink-0"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowMobileSearch(false)}
              className="p-2 text-[#7e939a] hover:text-white rounded-lg transition-colors shrink-0"
              title="Close search"
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Right Controls */}
      <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
        {/* Mobile Search Toggle */}
        <button
          type="button"
          onClick={() => setShowMobileSearch((prev) => !prev)}
          aria-label="Toggle mobile search"
          className="sm:hidden p-2 text-[#7e939a] hover:text-white hover:bg-[rgba(98,146,158,0.12)] rounded-lg transition-colors active:scale-95"
          title="Search Leads"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Role & Persona Switcher */}
        <div className="relative" ref={roleRef}>
          <button
            type="button"
            onClick={() => setShowRoleSwitcher((prev) => !prev)}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-full bg-[rgba(98,146,158,0.15)] hover:bg-[rgba(98,146,158,0.22)] border border-[rgba(98,146,158,0.3)] text-[11px] font-semibold text-[#a2c4cc] flex items-center gap-1 shadow-xs transition-colors"
            title={`Persona: ${primaryRole.replace(/_/g, " ")} (Click to switch)`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#62929e] shrink-0" />
            <span className="hidden sm:inline capitalize truncate">{primaryRole.replace(/_/g, " ")}</span>
            <ChevronDown className="w-3 h-3 text-[#7e939a] shrink-0 hidden sm:inline" />
          </button>

          {showRoleSwitcher && (
            <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-72 max-w-sm bg-[#FAF6EE] border border-[rgba(71,86,87,0.2)] rounded-2xl shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 text-left">
              <div className="px-2.5 py-1.5 border-b border-[rgba(71,86,87,0.12)] mb-1 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#1C2527]">Switch CRM Persona</p>
                  <p className="text-[10px] text-[#5A6E71]">Preview role permissions instantly</p>
                </div>
                <button
                  onClick={() => setShowRoleSwitcher(false)}
                  className="p-1 rounded text-[#7e939a] hover:text-[#1C2527]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1">
                {ROLES_LIST.map((r, i) => {
                  const isActive =
                    (crmRoles?.includes(r.crmRoles[0]) || user?.role === r.role) &&
                    (r.crmRoles[0] === "crm_admin" ? crmRoles?.includes("crm_admin") : crmRoles?.[0] === r.crmRoles[0]);

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectRole(r)}
                      className={`w-full p-2.5 rounded-xl text-left transition-all flex items-start justify-between gap-2 ${
                        isActive
                          ? "bg-white border border-[rgba(74,109,124,0.3)] shadow-xs"
                          : "hover:bg-white/60 border border-transparent"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#1C2527]">{r.label}</span>
                          {isActive && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#2E7559]/15 text-[#2E7559] font-bold">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[10.5px] text-[#5A6E71] mt-0.5 leading-snug">{r.description}</p>
                      </div>
                      {isActive && <Check className="w-4 h-4 text-[#2E7559] shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setShowNotifications((prev) => !prev)}
            aria-label="View notifications"
            className="p-2 relative text-[#7e939a] hover:text-white hover:bg-[rgba(98,146,158,0.12)] rounded-lg transition-colors active:scale-95"
            title="Activity Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#62929e] absolute top-2 right-2 ring-2 ring-[#0c1316] shadow-[0_0_6px_#62929e]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-88 max-w-sm bg-[#FAF6EE] border border-[rgba(71,86,87,0.2)] rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[rgba(71,86,87,0.12)] px-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#1C2527]">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#4A6D7C] text-white">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10.5px] text-[#4A6D7C] hover:underline font-semibold"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-1.5 max-h-80 overflow-y-auto">
                {notifications.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setShowNotifications(false)}
                      className={`block p-2.5 rounded-xl border transition-all ${
                        item.unread
                          ? "bg-white border-[rgba(71,86,87,0.2)] shadow-xs"
                          : "bg-white/50 border-transparent hover:bg-white"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className={`w-7 h-7 rounded-lg ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0 mt-0.5`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-xs font-bold text-[#1C2527] truncate">{item.title}</p>
                            <span className="text-[10px] text-[#7e939a] shrink-0">{item.time}</span>
                          </div>
                          <p className="text-[11px] text-[#5A6E71] mt-0.5 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="pt-2 mt-2 border-t border-[rgba(71,86,87,0.1)] text-center">
                <Link
                  href="/follow-ups"
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] font-bold text-[#4A6D7C] hover:underline"
                >
                  View All Action Reminders →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Fast Action */}
        <button
          onClick={onNewLeadClick}
          className="crm-btn-primary shadow-sm hover:shadow-[#4A6D7C]/30 text-xs !py-1.5 !px-3 sm:!px-4"
          title="Shortcut: Press 'N'"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Lead</span>
          <span className="sm:hidden">Add</span>
          <kbd className="hidden lg:inline-block ml-1 px-1 py-0.2 text-[9px] font-mono bg-white/20 text-white rounded">
            N
          </kbd>
        </button>
      </div>
    </header>
  );
}

