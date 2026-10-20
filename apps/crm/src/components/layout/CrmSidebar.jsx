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
  ChevronLeft,
  X,
  Settings,
  Plus,
  Award,
  Layers,
  Workflow,
  Banknote,
  MessageSquare,
  Target,
  Trophy,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTelephony } from "@/context/TelephonyContext";

// Primary Navigation Activity Bar Items
const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Leads", href: "/leads", icon: Users, badge: "9" },
  { label: "Marketing Campaigns", href: "/campaigns", icon: Target, badge: "ROI" },
  { label: "Duplicate Reviews", href: "/duplicates", icon: CopyCheck, badge: "1" },
  { label: "Call Queue", href: "/queue", icon: PhoneCall },
  { label: "Follow-ups", href: "/follow-ups", icon: CalendarClock },
  { label: "Omnichannel Inbox", href: "/inbox", icon: MessageSquare, badge: "3" },
  { label: "Counselling", href: "/counselling", icon: GraduationCap },
  { label: "Admissions & Fees", href: "/admissions", icon: Award, badge: "New" },
  { label: "Fee Installments", href: "/installments", icon: Banknote, badge: "Dues" },
  { label: "Sales Incentives", href: "/incentives", icon: Trophy, badge: "Bonus" },
  { label: "Academic Batches", href: "/cohorts", icon: Layers, badge: "Live" },
  { label: "Drip Cadences", href: "/cadences", icon: Workflow, badge: "Drip" },
  { label: "EOD Reports", href: "/eod", icon: FileSpreadsheet },
];

// Sub-Panel Operations Tree for each section
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
  "/campaigns": {
    title: "Campaign Attribution",
    category: "Marketing & Growth",
    items: [
      { label: "Active Campaigns", href: "/campaigns" },
      { label: "Channel Performance", href: "/campaigns" },
      { label: "Launch Campaign & UTM", href: "/campaigns" },
      { label: "Leads Pipeline", href: "/leads" },
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
  "/inbox": {
    title: "Omnichannel Communications",
    category: "Conversational Sales",
    items: [
      { label: "All Active Chats", href: "/inbox" },
      { label: "WhatsApp Direct", href: "/inbox" },
      { label: "Unread Messages", href: "/inbox", count: 3 },
      { label: "Cadence Drip Replies", href: "/inbox" },
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
  "/admissions": {
    title: "Admissions & Fees",
    category: "Financials & Cohorts",
    items: [
      { label: "Enrolled Students", href: "/admissions" },
      { label: "Tuition Collections", href: "/admissions" },
      { label: "0% EMI Loan Approvals", href: "/admissions" },
      { label: "Pending Receivables", href: "/installments" },
    ],
  },
  "/installments": {
    title: "Fee Installments Desk",
    category: "Financials & Receivables",
    items: [
      { label: "Receivables Ledger", href: "/installments" },
      { label: "Overdue Alerts", href: "/installments" },
      { label: "Upcoming 30 Days", href: "/installments" },
      { label: "Admissions Hub", href: "/admissions" },
    ],
  },
  "/incentives": {
    title: "Incentives & Payouts",
    category: "Gamification & Payroll",
    items: [
      { label: "Sales Leaderboard", href: "/incentives" },
      { label: "Commission Calculator", href: "/incentives" },
      { label: "Manager Approval Ledger", href: "/incentives" },
      { label: "Admissions Hub", href: "/admissions" },
    ],
  },
  "/cohorts": {
    title: "Academic Batches",
    category: "Seat Inventory & Allocations",
    items: [
      { label: "Active Cohorts & Batches", href: "/cohorts" },
      { label: "Seat Occupancy Ledger", href: "/cohorts" },
      { label: "Reserve Seat (Token Hold)", href: "/cohorts" },
      { label: "Enrolled Admissions", href: "/admissions" },
    ],
  },
  "/batches": {
    title: "Academic Batches",
    category: "Seat Inventory & Allocations",
    items: [
      { label: "Active Cohorts & Batches", href: "/cohorts" },
      { label: "Seat Occupancy Ledger", href: "/cohorts" },
      { label: "Reserve Seat (Token Hold)", href: "/cohorts" },
      { label: "Enrolled Admissions", href: "/admissions" },
    ],
  },
  "/cadences": {
    title: "Drip Cadences",
    category: "Sales Automation",
    items: [
      { label: "Active Sequences", href: "/cadences" },
      { label: "Enrolled Prospects", href: "/cadences" },
      { label: "Engagement Analytics", href: "/cadences" },
      { label: "Lead Pipeline", href: "/leads" },
    ],
  },
  "/eod": {
    title: "EOD Attainment",
    category: "Reporting & Audits",
    items: [
      { label: "Daily Submission", href: "/eod" },
      { label: "Target Calculator", href: "/eod" },
      { label: "Manager Amendments", href: "/eod" },
      { label: "Attainment Ledger", href: "/eod" },
    ],
  },
};

export function CrmSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, crmRoles } = useAuth();
  const { openSoftphone } = useTelephony();

  const [activeSection, setActiveSection] = useState("/");
  const [folderOpen, setFolderOpen] = useState(true);
  const [isOpen, setIsOpen] = useState(true);

  const audioRef = useRef(null);
  const lastSoundPlayedRef = useRef(0);

  // Sync active section with current URL
  useEffect(() => {
    const matching = NAV_ITEMS.find((item) =>
      item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
    );
    if (matching) {
      setActiveSection(matching.href);
    }
  }, [pathname]);

  const playClickSound = () => {
    try {
      const now = Date.now();
      if (now - lastSoundPlayedRef.current < 200) return;
      lastSoundPlayedRef.current = now;

      if (!audioRef.current && typeof Audio !== "undefined") {
        audioRef.current = new Audio("/audio/button-click-sound.mp3");
        audioRef.current.volume = 0.35;
      }
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    } catch {}
  };

  const handleActivityClick = (item) => {
    playClickSound();
    if (activeSection === item.href) {
      // Toggle drawer if active icon clicked
      setIsOpen((prev) => !prev);
    } else {
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
    <aside className="flex shrink-0 h-full select-none">
      {/* =========================================================================
          TIER 1: PRIMARY ACTIVITY BAR (Narrow Vertical Icon Strip ~56px)
          Always visible, clean, high-precision dark aesthetic matching top navbar
          ========================================================================= */}
      <div className="w-14 bg-[#0c1316] border-r border-[rgba(98,146,158,0.15)] flex flex-col items-center justify-between py-2 h-full z-20 shadow-xl overflow-hidden">
        {/* Navigation Icons (Scrollable without scrollbar if viewport is short) */}
        <div className="flex-1 flex flex-col items-center gap-1 w-full pt-0.5 overflow-y-auto overflow-x-hidden no-scrollbar">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isSelected = activeSection === item.href;

            return (
              <div key={item.href} className="relative group w-full flex justify-center shrink-0">
                <button
                  type="button"
                  onClick={() => handleActivityClick(item)}
                  title={item.label}
                  className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 ${
                    isSelected
                      ? "text-white bg-[rgba(98,146,158,0.18)] border border-[rgba(98,146,158,0.4)] shadow-sm shadow-[#62929e]/10"
                      : "text-[#7e939a] hover:text-white hover:bg-[rgba(98,146,158,0.08)]"
                  }`}
                >
                  {/* Active vertical left bar indicator */}
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

                  {/* Badge Pill */}
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

        {/* Bottom: Settings & User Avatar */}
        <div className="flex flex-col items-center gap-2.5 w-full pt-2 border-t border-[rgba(98,146,158,0.12)] shrink-0 bg-[#0c1316]">
          <button
            type="button"
            onClick={playClickSound}
            title="Settings"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[#7e939a] hover:text-white hover:bg-[rgba(98,146,158,0.08)] transition-all cursor-pointer"
          >
            <Settings className="w-5 h-5" />
          </button>

          <div
            title={`${user?.name || "User"} (${crmRoles?.[0] || "Staff"})`}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4A6D7C] to-[#62929E] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm border border-[rgba(162,196,204,0.3)] cursor-pointer hover:scale-105 active:scale-95 transition-transform"
          >
            {user?.name ? user.name[0] : "P"}
          </div>
        </div>
      </div>

      {/* =========================================================================
          TIER 2: OPERATIONS DRAWER / EXPLORER PANEL (~240px)
          Can be collapsed via the close button inside the drawer header
          ========================================================================= */}
      <div
        className={`bg-[#0f171a] border-r border-[rgba(98,146,158,0.15)] flex flex-col h-full overflow-hidden transition-[width,opacity] duration-200 ease-in-out z-10 shadow-2xl ${
          isOpen ? "w-60 opacity-100" : "w-0 opacity-0 pointer-events-none border-r-0"
        }`}
      >
        {/* Panel Header with professional in-drawer Close Button */}
        <div className="h-14 px-3.5 flex items-center justify-between border-b border-[rgba(98,146,158,0.15)] bg-[#0c1316] shrink-0 min-w-[240px]">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#62929e] shadow-[0_0_6px_#62929e]" />
            <span className="text-[11.5px] font-bold tracking-wider text-white uppercase truncate">
              {currentSectionData.title}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setIsOpen(false);
              }}
              title="Close Drawer"
              aria-label="Close drawer"
              className="group/close w-7 h-7 rounded-lg flex items-center justify-center text-[#8ba3aa] hover:text-white bg-[rgba(98,146,158,0.1)] hover:bg-[rgba(98,146,158,0.25)] border border-[rgba(98,146,158,0.2)] hover:border-[rgba(98,146,158,0.45)] transition-all duration-150 active:scale-90 cursor-pointer shadow-sm"
            >
              <X className="w-3.5 h-3.5 text-[#8ba3aa] group-hover/close:text-white group-hover/close:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Panel Content Tree (Explorer Style) */}
        <div className="flex-1 py-3 overflow-y-auto overflow-x-hidden text-xs min-w-[240px]">
          {/* Section Category Dropdown Tree */}
          <div className="mb-2">
            <button
              type="button"
              onClick={() => setFolderOpen((prev) => !prev)}
              className="w-full px-3 py-1.5 flex items-center gap-1.5 text-[10.5px] font-bold text-[#7e939a] hover:text-white tracking-wider uppercase transition-colors"
            >
              {folderOpen ? (
                <ChevronDown className="w-3.5 h-3.5 text-[#62929e]" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-[#62929e]" />
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
                          ? "bg-[rgba(98,146,158,0.22)] text-white font-semibold border border-[rgba(98,146,158,0.4)] shadow-sm"
                          : "text-[#95abb2] hover:text-white hover:bg-[rgba(98,146,158,0.08)]"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isCurrent
                              ? "bg-[#62929e] shadow-[0_0_6px_#62929e]"
                              : "bg-[#4A6D7C]/60 group-hover:bg-[#62929e]"
                          }`}
                        />
                        <span className="truncate">{sub.label}</span>
                      </div>

                      {sub.count !== undefined && (
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full border ${
                            isCurrent
                              ? "bg-white/20 text-white border-white/30"
                              : "bg-[rgba(98,146,158,0.18)] text-[#a3cdd8] border border-[rgba(98,146,158,0.25)]"
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
          <div className="mt-4 px-3 pt-3 border-t border-[rgba(98,146,158,0.14)]">
            <div className="text-[10px] font-semibold tracking-wider text-[#62929e] uppercase mb-2">
              Quick Shortcuts
            </div>
            <div className="space-y-1">
              <Link
                href="/leads"
                onClick={playClickSound}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] text-[#95abb2] hover:text-white hover:bg-[rgba(98,146,158,0.08)] transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-[#62929e]" />
                <span>Register New Lead</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  openSoftphone();
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] text-[#95abb2] hover:text-white hover:bg-[rgba(98,146,158,0.08)] transition-colors text-left cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#62929e]" />
                <span>Open Softphone Dialer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Panel Footer */}
        <div className="p-3 border-t border-[rgba(98,146,158,0.15)] bg-[#090f11] flex items-center justify-between text-[11px] text-[#7e939a] min-w-[240px]">
          <span className="truncate">Skillyards CRM v2.0</span>
          <span className="flex items-center gap-1.5 text-[#62929e] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
            Ready
          </span>
        </div>
      </div>
    </aside>
  );
}
