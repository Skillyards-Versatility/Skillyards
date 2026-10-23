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
  ChevronDown,
  ChevronRight,
  ArrowRight,
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

// Primary Navigation Activity Items
const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Leads", href: "/leads", icon: Users, badge: "9", hasSubmenu: true },
  { label: "Marketing Campaigns", href: "/campaigns", icon: Target, hasSubmenu: true },
  { label: "Duplicate Reviews", href: "/duplicates", icon: CopyCheck, badge: "1" },
  { label: "Call Queue", href: "/queue", icon: PhoneCall },
  { label: "Follow-ups", href: "/follow-ups", icon: CalendarClock },
  { label: "Omnichannel Inbox", href: "/inbox", icon: MessageSquare, badge: "3", hasSubmenu: true },
  { label: "Counselling", href: "/counselling", icon: GraduationCap, hasSubmenu: true },
  { label: "Admissions & Fees", href: "/admissions", icon: Award, hasSubmenu: true },
  { label: "Fee Installments", href: "/installments", icon: Banknote },
  { label: "Sales Incentives", href: "/incentives", icon: Trophy },
  { label: "Academic Batches", href: "/cohorts", icon: Layers, hasSubmenu: true },
  { label: "Drip Cadences", href: "/cadences", icon: Workflow, hasSubmenu: true },
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
      { label: "New Prospects", href: "/leads?status=new", count: 9 },
      { label: "Contacted Leads", href: "/leads?status=contacted" },
      { label: "In Follow-up", href: "/leads?status=follow_up" },
      { label: "Counselling Scheduled", href: "/leads?status=counselling_scheduled" },
      { label: "Qualified Prospects", href: "/leads?status=qualified", count: 4 },
      { label: "Converted / Closed", href: "/leads?status=converted" },
      { label: "Cold / Lost", href: "/leads?status=lost" },
    ],
  },
  "/campaigns": {
    title: "Campaign Attribution",
    category: "Marketing & Growth",
    items: [
      { label: "Active Campaigns", href: "/campaigns" },
      { label: "Channel Performance", href: "/campaigns?tab=performance" },
      { label: "Launch Campaign & UTM", href: "/campaigns?tab=create" },
      { label: "Leads Pipeline", href: "/leads" },
    ],
  },
  "/duplicates": {
    title: "Duplicate Reviews",
    category: "Data Hygiene",
    items: [
      { label: "Pending Resolution", href: "/duplicates", count: 1 },
      { label: "Merge History", href: "/duplicates?tab=history" },
      { label: "Audit Logs", href: "/duplicates?tab=audit" },
    ],
  },
  "/queue": {
    title: "Call Queue",
    category: "Dialer Operations",
    items: [
      { label: "Active Lead Queue", href: "/queue" },
      { label: "Overdue Follow-up Calls", href: "/follow-ups" },
      { label: "High Priority Prospects", href: "/leads?status=qualified" },
    ],
  },
  "/follow-ups": {
    title: "Follow-up Agenda",
    category: "Schedule & Agenda",
    items: [
      { label: "Today's Agenda", href: "/follow-ups" },
      { label: "Overdue Reminders", href: "/follow-ups?filter=overdue" },
      { label: "Next 7 Days", href: "/follow-ups?filter=upcoming" },
    ],
  },
  "/inbox": {
    title: "Omnichannel Communications",
    category: "Conversational Sales",
    items: [
      { label: "All Active Chats", href: "/inbox" },
      { label: "WhatsApp Direct", href: "/inbox?channel=whatsapp" },
      { label: "Unread Messages", href: "/inbox?filter=unread", count: 3 },
      { label: "Cadence Drip Replies", href: "/inbox?filter=cadence" },
    ],
  },
  "/counselling": {
    title: "Counselling Sessions",
    category: "Student Admissions",
    items: [
      { label: "Scheduled Today", href: "/counselling" },
      { label: "Session Outcomes", href: "/counselling?tab=outcomes" },
      { label: "Enrolled Students", href: "/counselling?tab=enrolled" },
    ],
  },
  "/admissions": {
    title: "Admissions & Fees",
    category: "Financials & Cohorts",
    items: [
      { label: "Enrolled Students", href: "/admissions" },
      { label: "Tuition Collections", href: "/admissions?tab=collections" },
      { label: "0% EMI Loan Approvals", href: "/admissions?tab=emi" },
      { label: "Pending Receivables", href: "/installments" },
    ],
  },
  "/installments": {
    title: "Fee Installments Desk",
    category: "Financials & Receivables",
    items: [
      { label: "Receivables Ledger", href: "/installments" },
      { label: "Overdue Alerts", href: "/installments?filter=overdue" },
      { label: "Upcoming 30 Days", href: "/installments?filter=upcoming" },
      { label: "Admissions Hub", href: "/admissions" },
    ],
  },
  "/incentives": {
    title: "Incentives & Payouts",
    category: "Gamification & Payroll",
    items: [
      { label: "Sales Leaderboard", href: "/incentives" },
      { label: "Commission Calculator", href: "/incentives?tab=calculator" },
      { label: "Manager Approval Ledger", href: "/incentives?tab=approvals" },
      { label: "Admissions Hub", href: "/admissions" },
    ],
  },
  "/cohorts": {
    title: "Academic Batches",
    category: "EdTech Operations",
    items: [
      { label: "Active Live Cohorts", href: "/cohorts" },
      { label: "Capacity & Seat Ledger", href: "/cohorts?tab=capacity" },
      { label: "Faculty Allocations", href: "/cohorts?tab=faculty" },
      { label: "Admissions Pipeline", href: "/admissions" },
    ],
  },
  "/cadences": {
    title: "Drip Automation",
    category: "Lead Nurturing",
    items: [
      { label: "All Cadence Flows", href: "/cadences" },
      { label: "WhatsApp Sequences", href: "/cadences?channel=whatsapp" },
      { label: "Email Auto-Drips", href: "/cadences?channel=email" },
      { label: "Omnichannel Inbox", href: "/inbox" },
    ],
  },
  "/eod": {
    title: "Daily Actuals & Filing",
    category: "EOD Telecalling",
    items: [
      { label: "Daily Call Logs", href: "/eod" },
      { label: "Connect Targets", href: "/eod?tab=targets" },
      { label: "Supervisor Review", href: "/eod?tab=review" },
    ],
  },
};

export function CrmSidebar({ isMobileOpen = false, onMobileClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, crmRoles } = useAuth();
  const { openSoftphone } = useTelephony();

  const [activeSection, setActiveSection] = useState("/");
  const [isOpen, setIsOpen] = useState(true);
  const [selectedSubHref, setSelectedSubHref] = useState("");

  const audioRef = useRef(null);
  const lastSoundPlayedRef = useRef(0);

  // Sync active section and sub-item with current URL
  useEffect(() => {
    const matching = NAV_ITEMS.find((item) =>
      item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
    );
    if (matching) {
      setActiveSection(matching.href);
    }
    if (typeof window !== "undefined") {
      const full = window.location.pathname + window.location.search;
      setSelectedSubHref(full);
    }
    // Auto-close mobile drawer on route change
    if (isMobileOpen && onMobileClose) {
      onMobileClose();
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
        audioRef.current.play().catch(() => { });
      }
    } catch { }
  };

  const handleActivityClick = (item, isMobile = false) => {
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

  const renderSidebarContent = (isMobile = false) => (
    <div className="flex shrink-0 h-full select-none">
      {/* =========================================================================
          TIER 1: PRIMARY ACTIVITY BAR (Narrow Vertical Icon Strip ~56px)
          Lavender aesthetic (#EDE9FE) matching CRM purple branding
          ========================================================================= */}
      <div className="w-14 bg-[#F6E3CC] border-r border-[#D97706]/20 flex flex-col items-center justify-between py-2 h-full z-20 shadow-xs overflow-hidden shrink-0">
        {/* Navigation Icons (Scrollable without scrollbar if viewport is short) */}
        <div className="flex-1 flex flex-col items-center gap-2 w-full py-1 overflow-y-auto overflow-x-hidden no-scrollbar">
          {/* Mobile Top Dismiss Button */}
          {isMobile && (
            <button
              type="button"
              onClick={onMobileClose}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-[#D97706] hover:text-white hover:bg-[#D97706] bg-white/70 border border-[#D97706]/25 mb-1 shrink-0 cursor-pointer active:scale-95 transition-all shadow-xs"
              title="Close Drawer"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isSelected = activeSection === item.href;

            return (
              <div key={item.href} className="relative group w-full flex justify-center shrink-0">
                <button
                  type="button"
                  onClick={() => handleActivityClick(item, isMobile)}
                  title={item.label}
                  className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 cursor-pointer ${isSelected
                    ? "text-white bg-[#D97706] shadow-md shadow-[#D97706]/30"
                    : "text-[#D97706] hover:text-[#B45309] hover:bg-white/80 hover:shadow-xs"
                    }`}
                >
                  {/* Active vertical left bar indicator */}
                  {isSelected && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-white rounded-r shadow-xs" />
                  )}

                  <Icon
                    className={`w-5 h-5 transition-colors ${isSelected
                      ? "text-white"
                      : "text-[#D97706] group-hover:text-[#B45309]"
                      }`}
                  />

                  {/* Badge Pill (Anchored at top-right corner so it NEVER invades or disrupts vertical icon spacing) */}
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-[#D97706] text-white text-[9.5px] font-bold flex items-center justify-center shadow-xs border-2 border-[#F6E3CC] pointer-events-none z-10">
                      {item.badge}
                    </span>
                  )}
                </button>

                {/* Floating tooltip (desktop only) */}
                {!isMobile && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1 rounded-md bg-slate-900 text-white text-xs font-medium whitespace-nowrap shadow-xl z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    {item.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom: Quick Softphone Dialer & User Profile Avatar (Exact matching gap & sizing) */}
        <div className="flex flex-col items-center gap-2 w-full pt-2 border-t border-[#D97706]/20 shrink-0 bg-[#F6E3CC]">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              openSoftphone();
              if (isMobile && onMobileClose) onMobileClose();
            }}
            title="Open Softphone Dialer"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[#D97706] hover:text-white hover:bg-[#D97706] hover:shadow-xs transition-all cursor-pointer"
          >
            <PhoneCall className="w-5 h-5" />
          </button>

          <div
            title={`${user?.name || "User"} (${crmRoles?.[0] || "Staff"})`}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D97706] to-[#B45309] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm border-2 border-white cursor-pointer hover:scale-105 active:scale-95 transition-transform"
          >
            {user?.name ? user.name[0] : "P"}
          </div>
        </div>
      </div>

      {/* =========================================================================
          TIER 2: OPERATIONS DRAWER / EXPLORER PANEL (~240px)
          Can be collapsed via the close button or clicking active icon
          ========================================================================= */}
      <div
        className={`bg-[#FAF6EE] border-r border-[rgba(71,86,87,0.18)] flex flex-col h-full overflow-hidden transition-[width,opacity] duration-200 ease-in-out z-10 shadow-lg ${isOpen ? "w-60 opacity-100" : "w-0 opacity-0 pointer-events-none border-r-0"
          }`}
      >
        {/* Panel Header */}
        <div className="h-14 px-3.5 flex items-center justify-between border-b border-[rgba(71,86,87,0.12)] bg-[#F5EEDB]/60 shrink-0 min-w-[240px]">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-[#D97706] shadow-[0_0_6px_rgba(217,119,6,0.5)]" />
            <div className="min-w-0">
              <span className="text-xs font-bold tracking-wider text-[#1C2527] uppercase truncate block">
                {currentSectionData.title}
              </span>
              <span className="text-[10px] text-[#7e939a] font-medium truncate block">
                {currentSectionData.category}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              setIsOpen(false);
            }}
            title="Collapse Drawer"
            aria-label="Collapse drawer"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#7e939a] hover:text-[#1C2527] hover:bg-black/5 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Panel Content (Sub-items) */}
        <div className="flex-1 py-3 px-2 overflow-y-auto overflow-x-hidden no-scrollbar space-y-1 min-w-[240px]">
          {currentSectionData.items.map((sub, idx) => {
            const isSubActive =
              selectedSubHref === sub.href ||
              (!selectedSubHref && pathname === sub.href && !sub.href.includes("?")) ||
              (selectedSubHref === pathname && sub.href === pathname);

            return (
              <Link
                key={idx}
                href={sub.href}
                onClick={() => {
                  playClickSound();
                  setSelectedSubHref(sub.href);
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("lead-status-filter-change"));
                  }
                  if (isMobile && onMobileClose) onMobileClose();
                }}
                className={`group/sub flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs transition-all duration-150 cursor-pointer ${isSubActive
                  ? "bg-[#F6E3CC] text-[#D97706] font-bold shadow-xs"
                  : "bg-transparent text-[#475657] hover:text-[#D97706] hover:bg-[#F6E3CC] hover:font-bold font-medium"
                  }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-150 ${isSubActive
                      ? "bg-[#D97706] scale-125 shadow-[0_0_6px_rgba(217,119,6,0.5)]"
                      : "bg-[#D97706]/40 group-hover/sub:bg-[#D97706] group-hover/sub:scale-125"
                      }`}
                  />
                  <span className="truncate">{sub.label}</span>
                </div>

                {sub.count !== undefined && (
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full transition-colors ${isSubActive
                      ? "bg-[#D97706]/20 text-[#D97706]"
                      : "bg-black/5 text-[#5A6E71] group-hover/sub:bg-[#D97706]/20 group-hover/sub:text-[#D97706]"
                      }`}
                  >
                    {sub.count}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Quick Shortcuts Box */}
          <div className="mt-4 pt-3 border-t border-[rgba(71,86,87,0.12)] space-y-1">
            <span className="text-[10px] font-bold tracking-wider text-[#7e939a] uppercase px-2 mb-1 block">
              Quick Shortcuts
            </span>
            <Link
              href="/leads"
              onClick={() => {
                playClickSound();
                if (isMobile && onMobileClose) onMobileClose();
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#475657] hover:text-[#D97706] hover:bg-[#F6E3CC]/60 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Register New Lead</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                playClickSound();
                openSoftphone();
                if (isMobile && onMobileClose) onMobileClose();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#475657] hover:text-[#D97706] hover:bg-[#F6E3CC]/60 transition-colors text-left cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Open Softphone</span>
            </button>
          </div>
        </div>

        {/* Panel Footer */}
        <div className="p-3 border-t border-[rgba(71,86,87,0.12)] bg-[#F5EEDB]/50 flex items-center justify-between text-[11px] text-[#5A6E71] shrink-0 min-w-[240px]">
          <span className="truncate font-medium">Skillyards CRM</span>
          <span className="flex items-center gap-1.5 text-emerald-600 font-semibold text-[10.5px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Docked Sidebar */}
      <aside className="hidden md:flex shrink-0 h-full select-none">
        {renderSidebarContent(false)}
      </aside>

      {/* Mobile & Small Tablet Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={onMobileClose}
          />

          {/* Drawer Content */}
          <div className="relative z-10 flex h-full shadow-2xl animate-in slide-in-from-left duration-200">
            {renderSidebarContent(true)}
          </div>
        </div>
      )}
    </>
  );
}
