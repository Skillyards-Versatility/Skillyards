"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  PhoneCall,
  CalendarClock,
  GraduationCap,
  FileSpreadsheet,
  CopyCheck,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  PanelLeftClose,
  MoreHorizontal,
  Settings,
  Plus,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Primary Navigation Activity Bar Items
const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Leads", href: "/leads", icon: Users, badge: "9" },
  { label: "Duplicate Reviews", href: "/duplicates", icon: CopyCheck, badge: "1" },
  { label: "Call Queue", href: "/queue", icon: PhoneCall },
  { label: "Follow-ups", href: "/follow-ups", icon: CalendarClock },
  { label: "Counselling", href: "/counselling", icon: GraduationCap },
  { label: "EOD Reports", href: "/eod", icon: FileSpreadsheet },
];

// VS-Code / Linear style Sub-Panel Operations Tree for each section
const SECTION_DETAILS = {
  "/": {
    title: "Command Center",
    category: "Workspace Overview",
    items: [
      { label: "Sales KPI Summary", href: "/" },
      { label: "Pipeline Overview", href: "/leads" },
      { label: "Dialer Queue", href: "/queue" },
      { label: "Follow-up Schedule", href: "/follow-ups" },
    ],
  },
  "/leads": {
    title: "Leads Pipeline",
    category: "Lead Operations",
    items: [
      { label: "All Registered Leads", href: "/leads" },
      { label: "New Prospects", href: "/leads", count: 9 },
      { label: "Contacted Leads", href: "/leads" },
      { label: "In Follow-up", href: "/leads" },
      { label: "Counselling Scheduled", href: "/leads" },
      { label: "Qualified Prospects", href: "/leads", count: 4 },
      { label: "Converted / Closed", href: "/leads" },
      { label: "Cold / Lost", href: "/leads" },
    ],
  },
  "/duplicates": {
    title: "Duplicate Reviews",
    category: "Data Hygiene",
    items: [
      { label: "Pending Resolution", href: "/duplicates", count: 1 },
      { label: "Merge History", href: "/duplicates" },
      { label: "Audit Logs", href: "/duplicates" },
    ],
  },
  "/queue": {
    title: "Call Queue",
    category: "Dialer Operations",
    items: [
      { label: "Active Lead Queue", href: "/queue" },
      { label: "Overdue Follow-up Calls", href: "/follow-ups" },
      { label: "High Priority Prospects", href: "/leads" },
    ],
  },
  "/follow-ups": {
    title: "Follow-up Agenda",
    category: "Schedule & Agenda",
    items: [
      { label: "Today's Agenda", href: "/follow-ups" },
      { label: "Overdue Reminders", href: "/follow-ups" },
      { label: "Next 7 Days", href: "/follow-ups" },
    ],
  },
  "/counselling": {
    title: "Counselling Sessions",
    category: "Student Admissions",
    items: [
      { label: "Scheduled Today", href: "/counselling" },
      { label: "Session Outcomes", href: "/counselling" },
      { label: "Enrolled Students", href: "/counselling" },
    ],
  },
  "/eod": {
    title: "EOD Reports",
    category: "Performance Attainment",
    items: [
      { label: "Today's Attainment", href: "/eod" },
      { label: "Historical Records", href: "/eod" },
      { label: "Rep Activity Breakdown", href: "/eod" },
    ],
  },
};

export function CrmSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, crmRoles } = useAuth();
  const audioRef = useRef(null);
  const lastPlayTimeRef = useRef(0);

  // VS-Code style activity drawer: collapsed by default ("pahle se icon dikhega")
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(pathname || "/");
  const [folderOpen, setFolderOpen] = useState(true);

  // Sync active section when path changes
  useEffect(() => {
    setActiveSection(pathname);
  }, [pathname]);

  // Preload click sound
  useEffect(() => {
    audioRef.current = new Audio("/audio/button-click-sound.mp3");
    audioRef.current.preload = "auto";
  }, []);

  const playClickSound = () => {
    const now = Date.now();
    if (now - lastPlayTimeRef.current < 150) return; // Prevent double trigger
    lastPlayTimeRef.current = now;

    try {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      } else {
        const audio = new Audio("/audio/button-click-sound.mp3");
        audio.play().catch(() => {});
      }
    } catch {}
  };

  /**
   * Handle Activity Bar Icon Click:
   * 1. If drawer is closed: open it and navigate to route.
   * 2. If drawer is already open and clicked icon is CURRENT: toggle/close drawer (width ghatega).
   * 3. If drawer is open and clicked icon is DIFFERENT: switch section and navigate.
   */
  const handleActivityClick = (item) => {
    playClickSound();

    if (isOpen && activeSection === item.href) {
      // Toggle off / collapse
      setIsOpen(false);
    } else {
      // Open / switch
      setActiveSection(item.href);
      setIsOpen(true);
      router.push(item.href);
    }
  };

  const currentSectionData =
    SECTION_DETAILS[activeSection] ||
    SECTION_DETAILS["/"] || {
      title: "Explorer",
      category: "Operations",
      items: [],
    };

  return (
    <aside className="flex shrink-0 h-[calc(100vh-64px)] sticky top-16 z-30 select-none">
      {/* =========================================================================
          TIER 1: PRIMARY ACTIVITY BAR (Narrow Vertical Icon Strip ~54px)
          Always visible, clean, high-precision dark aesthetic (VS Code / Cursor style)
          ========================================================================= */}
      <div className="w-14 bg-[#0c1316] border-r border-[rgba(98,146,158,0.15)] flex flex-col items-center justify-between py-3 h-full z-20 shadow-xl">
        {/* Top: Section Toggle & Navigation Icons */}
        <div className="flex flex-col items-center gap-2 w-full">
          {/* Quick Toggle Button */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setIsOpen((prev) => !prev);
            }}
            title={isOpen ? "Collapse Menu Drawer" : "Expand Menu Drawer"}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[#7e939a] hover:text-white hover:bg-[rgba(98,146,158,0.12)] transition-colors mb-1 active:scale-95"
          >
            {isOpen ? (
              <PanelLeftClose className="w-4 h-4 text-[#a2c4cc]" />
            ) : (
              <SlidersHorizontal className="w-4 h-4 text-[#62929e]" />
            )}
          </button>

          {/* Activity Bar Icons */}
          <div className="flex flex-col items-center gap-1.5 w-full">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isSelected = activeSection === item.href;

              return (
                <div key={item.href} className="relative group w-full flex justify-center">
                  <button
                    type="button"
                    onClick={() => handleActivityClick(item)}
                    title={item.label}
                    className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 ${
                      isSelected && isOpen
                        ? "text-white bg-[rgba(98,146,158,0.18)] border border-[rgba(98,146,158,0.4)] shadow-sm shadow-[#62929e]/10"
                        : isSelected
                        ? "text-white bg-[rgba(98,146,158,0.1)]"
                        : "text-[#7e939a] hover:text-white hover:bg-[rgba(98,146,158,0.08)]"
                    }`}
                  >
                    {/* Active vertical left bar indicator (VS Code style) */}
                    {isSelected && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-[2.5px] bg-[#62929e] rounded-r shadow-[0_0_6px_#62929e]" />
                    )}

                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        isSelected
                          ? "text-[#62929e] drop-shadow-[0_0_8px_rgba(98,146,158,0.5)]"
                          : "text-[#7e939a] group-hover:text-white"
                      }`}
                    />

                    {/* Blue Notification Badge Pill (e.g. '9', '1') */}
                    {item.badge && (
                      <span className="absolute -bottom-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#007acc] text-white text-[9.5px] font-bold flex items-center justify-center shadow-md border border-[#0c1316]">
                        {item.badge}
                      </span>
                    )}
                  </button>

                  {/* Floating tooltip */}
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1 rounded-md bg-[#121c1f] border border-[rgba(98,146,158,0.25)] text-white text-xs font-medium whitespace-nowrap shadow-xl z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 backdrop-blur-md">
                    {item.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#121c1f]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom: Settings & User Avatar */}
        <div className="flex flex-col items-center gap-3 w-full">
          <button
            type="button"
            onClick={playClickSound}
            title="Settings"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[#7e939a] hover:text-white hover:bg-[rgba(98,146,158,0.08)] transition-all"
          >
            <Settings className="w-5 h-5" />
          </button>

          <div
            title={`${user?.name || "User"} (${crmRoles?.[0] || "Staff"})`}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4A6D7C] to-[#62929E] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm border border-[rgba(162,196,204,0.3)] cursor-pointer hover:scale-105 active:scale-95 transition-transform"
          >
            {user?.name ? user.name[0] : "U"}
          </div>
        </div>
      </div>

      {/* =========================================================================
          TIER 2: EXPANDABLE EXPLORER / OPERATIONS PANEL (~230px)
          Slides open/close when activity icons are clicked ("width badhega or ghatega")
          ========================================================================= */}
      <div
        className={`bg-[#FAF6EE] border-r border-[rgba(71,86,87,0.14)] flex flex-col h-full overflow-hidden transition-[width,opacity] duration-250 ease-out z-10 shadow-xl ${
          isOpen ? "w-60 opacity-100" : "w-0 opacity-0 pointer-events-none border-r-0"
        }`}
      >
        {/* Panel Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-[rgba(71,86,87,0.12)] shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[11px] font-bold tracking-wider text-[#1C2527] uppercase truncate">
              {currentSectionData.title}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={playClickSound}
              title="More actions"
              className="p-1 rounded text-[#57686A] hover:text-[#1C2527] hover:bg-[rgba(71,86,87,0.08)] transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setIsOpen(false);
              }}
              title="Collapse Panel"
              className="p-1 rounded text-[#57686A] hover:text-[#1C2527] hover:bg-[rgba(71,86,87,0.08)] transition-colors"
            >
              <PanelLeftClose className="w-4 h-4 text-[#4A6D7C]" />
            </button>
          </div>
        </div>

        {/* Panel Content Tree (VS Code Explorer style) */}
        <div className="flex-1 py-3 overflow-y-auto overflow-x-hidden text-xs">
          {/* Collapsible Section Category Tree */}
          <div className="mb-2">
            <button
              type="button"
              onClick={() => setFolderOpen((prev) => !prev)}
              className="w-full px-3 py-1.5 flex items-center gap-1.5 text-[11px] font-bold text-[#2E3A3C] hover:text-[#1C2527] tracking-wide uppercase transition-colors"
            >
              {folderOpen ? (
                <ChevronDown className="w-3.5 h-3.5 text-[#57686A]" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-[#57686A]" />
              )}
              <span className="truncate">{currentSectionData.category}</span>
            </button>

            {/* Tree Items */}
            {folderOpen && (
              <div className="mt-1 space-y-0.5 px-2">
                {currentSectionData.items.map((sub, idx) => {
                  const isCurrent = pathname === sub.href;

                  return (
                    <Link
                      key={idx}
                      href={sub.href}
                      onClick={playClickSound}
                      className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors group ${
                        isCurrent
                          ? "bg-[#4A6D7C] text-white font-semibold shadow-sm"
                          : "text-[#2E3A3C] hover:text-[#1C2527] hover:bg-[rgba(71,86,87,0.08)]"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isCurrent ? "bg-[#ffffff]" : "bg-[#4A6D7C]/60 group-hover:bg-[#4A6D7C]"
                          }`}
                        />
                        <span className="truncate">{sub.label}</span>
                      </div>

                      {sub.count !== undefined && (
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full border ${
                            isCurrent
                              ? "bg-white/20 text-white border-white/30"
                              : "bg-[rgba(74,109,124,0.12)] text-[#284752] border-[rgba(74,109,124,0.25)]"
                          }`}
                        >
                          {sub.count}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Shortcuts Box */}
          <div className="mt-4 px-3 pt-3 border-t border-[rgba(71,86,87,0.1)]">
            <div className="text-[10px] font-semibold tracking-wider text-[#57686A] uppercase mb-2">
              Quick Shortcuts
            </div>
            <div className="space-y-1">
              <Link
                href="/leads"
                onClick={playClickSound}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] text-[#2E3A3C] hover:text-[#1C2527] hover:bg-[rgba(71,86,87,0.08)] transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-[#4A6D7C]" />
                <span>Register New Lead</span>
              </Link>
              <Link
                href="/queue"
                onClick={playClickSound}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] text-[#2E3A3C] hover:text-[#1C2527] hover:bg-[rgba(71,86,87,0.08)] transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#4A6D7C]" />
                <span>Start Tele-calling</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Panel Footer */}
        <div className="p-3 border-t border-[rgba(71,86,87,0.12)] bg-[#F5EDE1] flex items-center justify-between text-[11px] text-[#57686A]">
          <span className="truncate">Skillyards CRM v2.0</span>
          <span className="text-[#35626D] font-semibold">Ready</span>
        </div>
      </div>
    </aside>
  );
}
